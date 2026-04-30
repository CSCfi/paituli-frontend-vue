<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { CAlertType, CToastType } from '@cscfi/csc-ui';
import { useI18n } from 'vue-i18n';
import { mdiHelpCircleOutline } from '@mdi/js'

import type { JobResponse } from '@/shared/types';
import { APP_SETTINGS, URLS } from '@/shared/constants'
import { sleep } from '@/shared/util'
import { useToasts } from '@/composables/toasts';
import { currentDataset } from '@/modules/datasets';
import AppLink from '../AppLink.vue';

const { addToast } = useToasts()
const { t } = useI18n()

const showModal = ref(false)
const modalRef = ref()

const licenseCheckbox = ref(false)
const licenseError = ref(false)
const licenseUrl = computed(() => currentDataset.value?.license_url)

const zipDownloadDisabled = ref(false)

const filePaths = ref<string[]>([])
const fileLabels = ref<string[]>([])
const downloadSize = ref<number>(0)

const fetching = ref(false)
const started = ref(false)
const progress = ref(0)
const progressLabel = ref('')
const downloadError = ref(false)
const started = ref(false)

const open = (paths: string[], labels: string[], size: number) => {
  if (paths.length == 0)
  {
    console.error('Refusing to open download modal with zero file paths!')
    return;
  }
  if (labels.length == 0)
  {
    console.error('Refusing to open download modal with zero file labels!')
    return;
  }
  resetForm()

  if (size <= 0)
  {
    console.warn('Download modal did not expect a download size of ' + size)
  }
  else if (size > APP_SETTINGS.MAX_ZIP_SIZE)
  {
    zipDownloadDisabled.value = true
    downloadType.value = downloadTypeItems.value[1].value
  }

  filePaths.value = paths
  fileLabels.value = labels
  downloadSize.value = size

  started.value = false
  showModal.value = true
}

const downloadDescription = computed(() => {
  const current = currentDataset.value
  if (!current) return 'none'
  return `${current.org}, ${current.name}\n${current.scale}, ${current.year}, ${current.coord_sys}, ${current.format}`
})

const validateForm = () => {
  // We double check that download form input should not make the backend angry
  resetErrors()
  let valid = true
  if (zipDownloadDisabled.value && downloadType.value != 'LIST')
  {
    valid = false
  }
  if (licenseCheckbox.value != true) {
    licenseError.value = true
    valid = false
  }
  return valid
}


const submit = async () => {
  const current = currentDataset.value!
  if (!validateForm()) {
    return
  }

  const payload = {
    data_id: current.data_id,
    downloadType: downloadType.value,
    email: '',
    locale: 'en',
    filePaths: filePaths.value,
    filenames: fileLabels.value,
    org: current.org,
    data: current.name,
    scale: current.scale,
    year: current.year,
    coord_sys: current.coord_sys,
    format: current.format,
  }

  started.value = true
  fetching.value = true
  progress.value = 0
  progressLabel.value = t('progress.starting')

  let toastErrorMessage = ''
  try {
    // Request backend to start a download job
    const response = await fetch(URLS.DOWNLOAD_API, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json', },
    })
    if (!response.ok) {
      // The backend should always return OK - network error?
      toastErrorMessage = t('toasts.network_error')
      throw Error(`HTTP code ${response.status}`)
    }

    // Shorthand
    const assertJob = (job: JobResponse, message: string) => {
      if (job.error) {
        toastErrorMessage = message
        throw Error(job.error)
      }
    }

    // Started successfully? If yes, now we have the job's ID
    let job: JobResponse = await response.json()
    assertJob(job, job.message)
    console.log('Download service has started job ' + job.ID)

    // Periodically poll job status until it completes
    let silentRetries = 10
    do {
      await sleep(1000)
      const request = await fetch(URLS.DOWNLOAD_API + '/status/' + job.ID, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!request.ok) {
        // Again the backend should always return OK here - network error?
        // Let's just silently try again, unless we hit our retry limit.
        if (--silentRetries == 0)
        {
          addToast({
            type: CToastType.Warning, progress: true,
            message: t('toasts.network_error') + t('toasts.please_retry'),
          }, toasts.value)
        }
        continue;
      }

      // Job progressing okay? If yes, update progress
      job = await request.json()
      assertJob(job, t('toasts.something_wrong'))
      progress.value = Math.ceil(job.progress * 100)
      if (progress.value > 0)
      {
        progressLabel.value = t('progress.processing')
      }
    }
    while (job.progress < 1.0)

    // Download ready, start it!
    progress.value = 100
    progressLabel.value = ''
    console.log('Starting download for ' + job.ID)
    downloadJobOutput(URLS.DOWNLOAD_API + '/' + job.ID)

  } catch (e) {
    downloadError.value = true
    // Caught error details should go to the log,
    // while toasts communicate the failed download to the user
    progressLabel.value = t('progress.failed')
    console.error('Download failed: ', e)
    // If the toast message is undefined at this point, either the backend did
    // not specify a reason for failure, or we tripped on something unexpected.
    if (!toastErrorMessage) toastErrorMessage = t('toasts.something_wrong')
    addToast({
      type: CToastType.Error, persistent: true, closeText: 'Okay 😔',
      message: toastErrorMessage + t('toasts.please_retry')
    }, toasts.value)
  } finally {
    fetching.value = false
  }
}

function downloadJobOutput(url: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = url.split('/').pop()!
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const resetErrors = () => {
  downloadError.value = false
  licenseError.value = false
}

const resetForm = () => {
  resetErrors()
  licenseCheckbox.value = false
  downloadType.value = downloadTypeItems.value[0].value
  zipDownloadDisabled.value = false
  showListHint.value = false
}

// By default toasts get hidden behind the modal backdrop,
// so we need a custom toast element for addToast()
const toasts = ref<HTMLCToastsElement | null>(null)

defineExpose({ open })

const downloadTypeItems = computed(() => [
  { name: t('type.as_zip'), value: 'ZIP', disabled: zipDownloadDisabled.value },
  { name: t('type.as_list'), value: 'LIST' }
]);

const downloadType = ref()
const showListHint = ref(false)

// c-modals have built-in event which listens ESC, which does not
// respect the 'dismissable' prop, thus we have to intercept it
function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  if (started.value) {
    e.preventDefault()
    e.stopPropagation()
    // Let's still nudge the modal
    const modal = modalRef.value as HTMLElement
    const dialog = modal.shadowRoot?.querySelector('dialog')
    if (dialog) {
      dialog.classList.add('nudging')
      setTimeout(() => dialog.classList.remove('nudging'), 150);
    }
  }
}
onMounted(() =>
  document.addEventListener('keydown', onKeydown, true))
onBeforeUnmount(() =>
  document.removeEventListener('keydown', onKeydown, true))

</script>

<template>
  <c-modal v-model="showModal"
           ref="modalRef"
           :dismissable="!started"
           v-control>
    <c-card>
      <c-card-title>{{ t("title") }}</c-card-title>
      <c-card-content v-if="!started">
        <!-- Download type (zip / file list) option -->
        <div>
          <c-radio-group
            v-control
            :items="downloadTypeItems"
            hide-details
            v-model="downloadType">
            <div id="group-header">
              {{ t("type.title") }}
              <c-icon-button
                @click="showListHint = true"
                size="x-small">
                <c-icon :path="mdiHelpCircleOutline" size="20px" />
              </c-icon-button>
            </div>
          </c-radio-group>
          <c-alert v-if="showListHint" :type="CAlertType.Info">
            <span>
              {{ t('list_hint') }}
              <app-link to="/files" new-tab>
                {{ t('list_link') }}
              </app-link>
            </span>
          </c-alert>
        </div>

        <c-alert>
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <div slot="title">
            {{ t("summary.header") }}
          </div>
          <div>
            <p>{{ downloadDescription }}</p>
            <div class="zip-size-warning" v-if="zipDownloadDisabled">
              {{ t("summary.size_warning", { size: APP_SETTINGS.MAX_ZIP_SIZE }) }}
            </div>
            <div v-else-if="downloadType == 'ZIP'">
              {{ t("summary.info_zip", { size: downloadSize }) }}
            </div>
            <div v-else>
              {{ t("summary.info_list") }}
            </div>
          </div>
        </c-alert>

        <!-- Render the required license checkbox, if we have a license -->
        <div class="form-group" v-if="licenseUrl">
          <c-checkbox v-control
                      v-model="licenseCheckbox"
                      :hide-details="!licenseError"
                      :valid="!licenseError"
                      :validation="t('validation')"
                      required>
            {{ t("license_agree") }}
            <app-link :to="licenseUrl" new-tab>
              {{ t("license") }}
            </app-link>
          </c-checkbox>
        </div>

        <!-- Separate toasts container because the backdrop obscures global toasts -->
        <c-toasts ref="toasts" vertical="bottom" absolute="true" />
      </c-card-content>
      <c-card-content v-else>
        <c-alert :type="CAlertType.Success">
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <div slot="title">
            {{ t("started.header") }}
          </div>
          {{ t("started.message") }}
        </c-alert>
      </c-card-content>

      <c-card-actions justify="space-between">
        <c-button
          @click="showModal = false"
          :outlined="!started"
          id="cancel">
          {{ t(started ? "close" : "cancel") }}
        </c-button>
        <c-progress-bar
          v-if="started"
          :value="progress"
          :label="progressLabel"
          :error="downloadError"/>
        <div v-else-if="!started" id="download-note">
          {{ t('note') }}
        </div>
        <c-button
          v-if="!started"
          :loading="fetching"
          :outlined="fetching"
          :disabled="fetching"
          @click="submit">
          {{ t("confirm") }}
        </c-button>
      </c-card-actions>
    </c-card>
  </c-modal>
</template>

<i18n>
{
  "en": {
    "title": "Download",
    "summary": {
      "header": "Download Summary",
      "size_warning": "Note: You can download selected data only as a file list, as the selection size exceeds the allowed ZIP file size limit of {size} MB.",
      "info_zip": "Your download will be a ZIP file with and estimated size of {size} MB.",
      "info_list": "Your download will be a text file, which contains the paths of all selected map sheets.",
    },
    "type": {
      "title": "Download type",
      "as_zip": "ZIP file",
      "as_list": "File list",
    },
    "list_hint": "File list -option downloads data paths as a text file for ",
    "list_link": "batch download",
    "license_agree": "I agree to the",
    "license": "dataset license",
    "validation": "This is mandatory",
    "confirm": "Download",
    "cancel": "Cancel",
    "close": "Close",
    "toasts": {
      "network_error": "Failed to contact download service. Check your internet connection. ",
      "something_wrong": "Something went wrong while processing your download. ",
      "please_retry": "If the problem persists, please contact CSC.",
    },
    "note": "Preparing your download may take a moment. Please wait on this page until the download has started.",
    "progress": {
      "starting": "(Starting...)",
      "processing": "(Processing files...)",
      "failed": "(Failed!)",
    },
    "started": {
      "header": "Download started",
      "message": "Thank you for using Paituli. Your download should start soon. If you have any problems with your data, do not hesitate to contact CSC.",
    },
  },
  "fi": {
    "title": "Aineiston lataus",
    "summary": {
      "header": "Yhteenveto",
      "size_warning": "Huom: Voit ladata valitun datan vain tiedostolistana, koska valinnan koko ylittää sallitun ZIP-tiedoston kokorajan {size} MB.",
      "info_zip": "Latauksesi on ZIP-tiedosto, jonka arvioitu koko on {size} MB.",
      "info_list": "Latauksesi on tekstitiedosto, joka sisältää kaikkien valittujen karttalehtien polut.",
    },
    "type": {
      "title": "Latauksen tyyppi",
      "as_zip": "ZIP-tiedosto",
      "as_list": "Tiedostolista",
    },
    "list_hint": "Tiedostolista -optio lataa valittujen karttalehtien polut tekstitiedostona, jota käytetään ",
    "list_link": "massalatauksessa",
    "license_agree": "Hyväksyn",
    "license": "aineiston lisenssin",
    "validation": "Pakollinen",
    "confirm": "Lataa",
    "cancel": "Peruuta",
    "close": "Sulje",
    "toasts": {
      "network_error": "Yhteydenotto latauspalveluun epäonnistui. Tarkista internet-yhteytesi. ",
      "something_wrong": "Jotain meni pieleen latauksen käsittelyn aikana. ",
      "please_retry": "Jos ongelma jatkuu, ota yhteyttä CSC:hen",
    },
    "note": "Latauksen valmistelu voi kestää hetken. Odotathan tällä sivulla, kunnes lataus on alkanut.",
    "progress": {
      "starting": "(Käynnistetään...)",
      "processing": "(Käsitellään tiedostoja...)",
      "failed": "(Epäonnistui!)",
    },
    "started": {
      "header": "Lataus aloitettu",
      "message": "Kiitos, että käytit Paitulia. Latauksesi pitäisi alkaa pian. Jos sinulla on ongelmia aineiston kanssa, älä epäröi ottaa yhteyttä CSC:hen.",
    },
  },
}
</i18n>

<style scoped>

.zip-size-warning {
  color: var(--c-warning-600);
}
c-button {
  --c-button-outlined-background-color: unset !important;
  --c-button-outlined-background-color-hover: unset !important;
  --c-button-outlined-border-color: unset !important;
  --c-button-background-color-hover: var(--c-tertiary-500);
}
c-button#cancel {
  --c-button-background-color: var(--c-warning-500);
  --c-button-background-color-hover: var(--c-warning-300);
}
c-progress-bar {
  width: 100%;
  color: var(--c-tertiary-500);

  &[error="true"] {
    color: var(--c-error-600);
    --c-progress-bar-color: var(--c-error-600);
  }
}
c-link {
  --c-link-color: var(--c-primary-500);
}
c-alert p {
  white-space: pre-wrap;
  margin: 0 0 .5em 0;
}
#group-header {
  display: inline-flex;
  font-weight: bold;
  gap: .5em;
  align-items: center;

  --c-icon-button-background-color: var(--c-white);
  --c-icon-button-background-color-hover: var(--c-tertiary-100);

  c-icon {
    --c-icon-color: var(--c-tertiary-400);
  }
}
c-card {
  --c-card-gap: 1.25em;
}
#download-note {
  font-size: smaller;
  color: var(--c-tertiary-800)
}
</style>
