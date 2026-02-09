<script setup lang="ts">
import { ref, computed } from 'vue'
import { CToastType } from '@cscfi/csc-ui';
import { useI18n } from 'vue-i18n';

import type { JobResponse } from '@/shared/types';
import { APP_SETTINGS, URLS } from '@/shared/constants'
import { sleep } from '@/shared/util'
import { useToasts } from '@/composables/toasts';
import { currentDataset } from '@/modules/datasets';

const { addToast } = useToasts()
const { t } = useI18n()

const showModal = ref(false)

const licenseCheckbox = ref(false)
const licenseError = ref(false)
const licenseUrl = computed(() => currentDataset.value?.license_url)

const zipDownloadDisabled = ref(false)

const filePaths = ref<string[]>([])
const fileLabels = ref<string[]>([])
const downloadAsList = ref(false)
const downloadSize = ref<number>(0)

const fetching = ref(false)
const started = ref(false)
const progress = ref(0)
const progressLabel = ref('')
const downloadError = ref(false)

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
    downloadAsList.value = true
  }

  filePaths.value = paths
  fileLabels.value = labels
  downloadSize.value = size

  showModal.value = true
}

const downloadDescription = computed(() => {
  const current = currentDataset.value
  if (!current) return 'none'
  return `${current.org}, ${current.name}\n${current.scale}, ${current.year}, ${current.coord_sys}, ${current.format}`
})

const validateForm = () => {
  // We double check that download form input should not make
  // the backend angry, and we show error message(s) if it would be so.
  resetErrors()
  let valid = true
  if (zipDownloadDisabled.value && !downloadAsList.value)
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
    downloadType: downloadAsList.value ? 'LIST' : 'ZIP',
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
  downloadAsList.value = false
  zipDownloadDisabled.value = false
}

// By default toasts get hidden behind the modal backdrop,
// so we need a custom toast element for addToast()
const toasts = ref<HTMLCToastsElement | null>(null)

defineExpose({ open })
</script>

<template>
  <c-modal v-model="showModal" v-control>
    <c-card>
      <c-card-title>{{ t("title") }}</c-card-title>
      <c-card-content>
        <div class="summary">
          <strong>{{ t("summary.header") }}:</strong>
          <p>{{ downloadDescription }}</p>

          <div class="zip-size-warning" v-if="zipDownloadDisabled">
            {{ t("summary.size_warning", { size: APP_SETTINGS.MAX_ZIP_SIZE }) }}
          </div>
          <div v-else-if="!downloadAsList">
            {{ t("summary.info_zip", { size: downloadSize }) }}
          </div>
          <div v-else>
            {{ t("summary.info_list") }}
          </div>
        </div>

        <!-- Download type (zip / file list) option -->
        <c-switch v-model="downloadAsList" :disabled="zipDownloadDisabled" v-control>
          {{ t("as_list") }}
        </c-switch>

        <!-- Render the required license checkbox, if we have a license -->
        <div class="form-group" v-if="licenseUrl">
          <c-checkbox v-control
                      v-model="licenseCheckbox"
                      :valid="!licenseError"
                      required>
            {{ t("license_agree") }}
            <c-link :href="licenseUrl" target="_blank" underline>{{ t("license") }}</c-link>
          </c-checkbox>
        </div>

        <!-- Separate toasts container because the backdrop obscures global toasts -->
        <c-toasts ref="toasts" vertical="bottom" absolute="true" />
      </c-card-content>

      <c-card-actions justify="end">
        <c-progress-bar v-if="started"
                        :value="progress"
                        :label="progressLabel"
                        :error="downloadError"/>
        <c-button :loading="fetching" :disabled="fetching" @click="submit">{{ t("confirm") }}</c-button>
        <c-button @click="showModal = false" variant="light">{{ t("cancel") }}</c-button>
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
      "size_warning": "Note: You can download selected data only as a file list, as the selection size exceeds the compressed archive size limit of {size} MB.",
      "info_zip": "Your download will be a zip archive with and estimated size of {size} MB.",
      "info_list": "Your download will be a text file.",
    },
    "as_list": "Download as file list",
    "list_tooltip": "Download data paths as a text file for batch download",
    "license_agree": "I agree to the",
    "license": "dataset license",
    "confirm": "Download",
    "cancel": "Cancel",
    "toasts": {
      "network_error": "Failed to contact download service. Check your internet connection. ",
      "something_wrong": "Something went wrong while processing your download. ",
      "please_retry": "If the problem persists, please try again later. ",
    },
    "progress": {
      "starting": "(Starting...)",
      "processing": "(Processing files...)",
      "failed": "(Failed!)",
    },
  },
  "fi": {
    "title": "Aineiston lataus",
    "summary": {
      "header": "Yhteenveto",
      "size_warning": "Huom: Voit ladata valitun datan vain tiedostolistana, koska valinnan koko ylittää pakatun arkiston kokorajan {size} MB.",
      "info_zip": "Latauksesi on ZIP-tiedosto, jonka arvioitu koko on {size} MB.",
      "info_list": "Latauksesi on tekstitiedosto.",
    },
    "as_list": "Lataa tiedostolistana",
    "list_tooltip": "Lataa valinnan polut tekstitiedostona massalatausta varten",
    "license_agree": "Hyväksyn",
    "license": "aineiston lisenssin",
    "confirm": "Lataa",
    "cancel": "Peruuta",
    "toasts": {
      "network_error": "Yhteydenotto latauspalveluun epäonnistui. Tarkista internet-yhteytesi. ",
      "something_wrong": "Jotain meni pieleen latauksen käsittelyn aikana. ",
      "please_retry": "Jos ongelma jatkuu, yritä myöhemmin uudelleen. ",
    },
    "progress": {
      "starting": "(Käynnistetään...)",
      "processing": "(Käsitellään tiedostoja...)",
      "failed": "(Epäonnistui!)",
    },
  },
}
</i18n>

<style scoped>

.input {
  display: block;
  width: 100%;
  padding: 0.5em;
  margin-top: 0.25rem;
}
.zip-size-warning {
  color: var(--c-warning-600);
}
.summary {
  background-color: var(--c-tertiary-100);
  padding: 0.5em;
  border-radius: 4px;
  white-space: pre-line;
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
</style>
