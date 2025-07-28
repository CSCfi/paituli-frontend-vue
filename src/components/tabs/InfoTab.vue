<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDatasets } from '@/composables/datasets'

const { currentDataset } = useDatasets()

const props = defineProps<{ metadata: any | null }>()
const descriptionHtml = ref('')
const links = ref<{ title: string; url: string }[]>([])
const error = ref(false)

// Parse metadata whenever it changes in parent
watch(
  () => props.metadata,
  (newMetadata) => parseMetadata(newMetadata)
)

// Extract dataset description from metadata
function parseMetadata(metadata: any) {
  if (!metadata || !metadata.research_dataset) {
    error.value = true
    return
  }

  const resources = metadata.research_dataset.remote_resources || []
  links.value = resources
    .filter((item: any) =>
      item.title &&
      item.download_url?.identifier &&
      !item.download_url.identifier.toLowerCase().includes('paituli.csc.fi/download')
    )
    .map((item: any) => ({
      title: item.title,
      url: item.download_url.identifier,
    }))

  const descObj = metadata.research_dataset.description || {}
  const notesRaw = descObj.en
  if (!notesRaw) {
    error.value = true
    return
  }

  descriptionHtml.value = parseMarkdownishText(notesRaw)
}

function parseMarkdownishText(text: string): string {
  // Markdown-style [title](url)
  text = text.replace(/\[([^\]]+)\]\((http.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
  // <http://example.com>
  text = text.replace(/<http(.*?)>/g, '<a href="http$1" target="_blank">http$1</a>')
  // Line breaks
  return text.replace(/(\r\n|\n|\r)/gm, '<br>')

  // Would we need further sanitization?
}

const showModal = ref(false)

const open = () => {
  showModal.value = true
}

defineExpose({ open })
</script>

<template>
  <div v-if="metadata">
    <div class="metadata-description" v-html="descriptionHtml" />

    <div v-if="error" class="error">Metadata is not available.</div>
  </div>

  <c-modal v-model="showModal"
           v-control
           dismissable
           disable-backdrop-blur>
    <c-card>
      <c-card-title>
        Dataset description
      </c-card-title>

      <c-card-content>
        <strong>{{ currentDataset?.name }} - {{ currentDataset?.org }}</strong>
        <div v-html="descriptionHtml"></div>
        <div v-if="links.length">
          <strong>Files describing this dataset:</strong>
          <ul class="metadata-links">
            <li v-for="link in links" :key="link.url">
              <a :href="link.url" target="_blank">{{ link.title }}</a>
            </li>
          </ul>
        </div>
      </c-card-content>

      <c-card-actions justify="end">
        <c-button
          @click="showModal = false"
        >
          Close
        </c-button>
      </c-card-actions>
    </c-card>
  </c-modal>
</template>

<style scoped>
.metadata-info-label {
  margin-bottom: 10px;
}
.metadata-description {
  margin-bottom: 10px;
}
.error {
  color: red;
  font-style: italic;
}
</style>
