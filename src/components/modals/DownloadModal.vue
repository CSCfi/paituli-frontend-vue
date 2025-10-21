<script setup lang="ts">
import { ref, computed } from 'vue'
import { APP_SETTINGS, URLS } from '@/shared/constants'
import { useDatasets } from '@/composables/datasets'
import { mdiHelpCircle } from '@mdi/js';
import ToolTip from '../ToolTip.vue';
import type { JobResponse } from '@/shared/types';
import { sleep } from '@/shared/util'
import { useToasts } from '@/composables/toasts';
import { CToastType } from '@cscfi/csc-ui';

const { currentDataset } = useDatasets()
const { addToast } = useToasts()

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
  /*
  if (!email.value || email.value.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email.'
    valid = false
  }
  */
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

const networkErrorMessage = 'Failed to contact download service. Check your internet connection. '
const somethingWrongMessage = 'Something went wrong while processing your download. '
const pleaseRetryMessage = 'If the problem persists, please try again later. '

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
  progressLabel.value = '(Starting...)'

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
      toastErrorMessage = networkErrorMessage
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
            message: networkErrorMessage + pleaseRetryMessage,
          }, toasts.value)
        }
        continue;
      }

      // Job progressing okay? If yes, update progress
      job = await request.json()
      assertJob(job, somethingWrongMessage)
      progress.value = Math.ceil(job.progress * 100)
      if (progress.value > 0)
      {
        progressLabel.value = '(Processing files...)'
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
    progressLabel.value = '(Failed!)'
    console.error('Download failed: ', e)
    // If the toast message is undefined at this point, either the backend did
    // not specify a reason for failure, or we tripped on something unexpected.
    if (!toastErrorMessage) toastErrorMessage = somethingWrongMessage
    addToast({
      type: CToastType.Error, persistent: true, closeText: 'Okay 😔',
      message: toastErrorMessage + pleaseRetryMessage
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
      <c-card-title>Download</c-card-title>
      <c-card-content>
        <div class="summary">
          <strong>Download Summary:</strong>
          <p>{{ downloadDescription }}</p>

          <div class="zip-size-warning" v-if="zipDownloadDisabled">
            Note: You can download selected data only as a file list,
            as the selection size exceeds the compressed archive size limit of {{ APP_SETTINGS.MAX_ZIP_SIZE }} MB.
          </div>
          <div v-else-if="!downloadAsList">
            Your download will be a zip archive with and estimated size of {{ downloadSize }} MB
          </div>
          <div v-else>
            Your download will be a text file.
          </div>
        </div>

        <!-- Download type (zip / file list) option -->
        <c-switch v-model="downloadAsList" :disabled="zipDownloadDisabled" v-control>
          Download as file list
          <ToolTip text="Download the selected data paths as a text file for batch download">
            <c-icon :path="mdiHelpCircle" color="var(--c-primary-500)" size="18" />
          </ToolTip>
        </c-switch>

        <!-- Render the required license checkbox, if we have a license -->
        <div class="form-group" v-if="licenseUrl">
          <c-checkbox v-control
                      v-model="licenseCheckbox"
                      :valid="!licenseError"
                      required>
            I agree to the
            <c-link :href="licenseUrl" target="_blank" underline>dataset license</c-link>
          </c-checkbox>
        </div>

        <!-- Errors and warnings -->
        <c-toasts ref="toasts" vertical="bottom" absolute="true" />
      </c-card-content>

      <c-card-actions justify="end">
        <c-progress-bar v-if="started"
                        :value="progress"
                        :label="progressLabel"
                        :error="downloadError"/>
        <c-button :loading="fetching" :disabled="fetching" @click="submit">Download</c-button>
        <c-button @click="showModal = false" variant="light">Cancel</c-button>
      </c-card-actions>
    </c-card>
  </c-modal>
</template>

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
