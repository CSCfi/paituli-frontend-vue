<script setup lang="ts">
import { ref, computed } from 'vue'
import { URLS } from '@/shared/constants'
import { useDatasets } from '@/composables/datasets'
import type { DownloadType } from '@/shared/types'

const { currentDataset } = useDatasets()

const showModal = ref(false)
const email = ref('')
const licenseAccepted = ref(false)
const privacyAccepted = ref(false)

const emailError = ref('')
const licenseError = ref('')
const privacyError = ref('')

const filePaths = ref<string[]>([])
const fileLabels = ref<string[]>([])
const downloadType = ref<DownloadType>()
const downloadSize = ref<number>(0)

const open = (paths: string[], labels: string[], size: number, type: DownloadType) => {
  filePaths.value = paths
  fileLabels.value = labels
  downloadSize.value = size
  downloadType.value = type
  resetErrors()
  showModal.value = true
}

const downloadDescription = computed(() => {
  const current = currentDataset.value
  if (!current) return 'none'
  return `${current.org}, ${current.name}, ${current.scale}, ${current.year}, ${current.coord_sys}, ${current.format} - ${downloadSize.value} MB`
})

const validate = () => {
  let valid = true
  emailError.value = ''
  licenseError.value = ''
  privacyError.value = ''

  if (!email.value || email.value.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email.'
    valid = false
  }
  if (!licenseAccepted.value) {
    licenseError.value = 'You must accept the license.'
    valid = false
  }
  if (!privacyAccepted.value) {
    privacyError.value = 'You must accept the privacy policy.'
    valid = false
  }

  return valid
}

const submit = async () => {
  const current = currentDataset.value
  if (!validate() || filePaths.value.length === 0 || !current) return

  const payload = {
    data_id: current.data_id,
    downloadType: downloadType.value,
    email: email.value,
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

  try {
    await fetch(URLS.DOWNLOAD_API, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    showModal.value = false
  } catch (e) {
    console.error('Error sending email:', e)
  }
}

const resetErrors = () => {
  emailError.value = ''
  licenseError.value = ''
  privacyError.value = ''
}

defineExpose({ open })
</script>

<template>
  <c-modal v-model="showModal" v-control>
    <c-card>
      <c-card-title>Email Download</c-card-title>

      <c-card-content>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="input"
            :class="{ error: emailError }"
            placeholder="you@example.com"
          />
          <p v-if="emailError" class="error-text">{{ emailError }}</p>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" v-model="licenseAccepted" />
            I agree to the license
          </label>
          <p v-if="licenseError" class="error-text">{{ licenseError }}</p>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" v-model="privacyAccepted" />
            I agree to the privacy policy
          </label>
          <p v-if="privacyError" class="error-text">{{ privacyError }}</p>
        </div>

        <div class="summary">
          <strong>Download Summary:</strong>
          <p>{{ downloadDescription }}</p>
        </div>
      </c-card-content>

      <c-card-actions justify="end">
        <c-button @click="submit">Send</c-button>
        <c-button @click="showModal = false" variant="light">Cancel</c-button>
      </c-card-actions>
    </c-card>
  </c-modal>
</template>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
.input {
  display: block;
  width: 100%;
  padding: 0.5em;
  margin-top: 0.25rem;
}
.error-text {
  color: red;
  font-size: 0.85em;
}
.error {
  border-color: red;
}
.summary {
  margin-top: 1rem;
  background-color: #f6f6f6;
  padding: 0.5em;
  border-radius: 4px;
}
</style>
