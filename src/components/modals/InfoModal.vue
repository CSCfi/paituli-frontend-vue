<script setup lang="ts">
import { useDatasets } from '@/composables/datasets';
import { ref } from 'vue';

const { currentDataset } = useDatasets()

const props = defineProps<{
  desc: string, links: { title: string, url: string }[]
}>()

const showModal = ref(false)
const open = () => {
  showModal.value = true
}

defineExpose({ open })
</script>

<template>

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
        <div v-html="props.desc"></div>
        <div v-if="links.length">
          <strong>Files describing this dataset:</strong>
          <ul class="metadata-links">
            <li v-for="link in props.links" :key="link.url">
              <a :href="link.url" target="_blank">{{ link.title }}</a>
            </li>
          </ul>
        </div>
      </c-card-content>

      <c-card-actions justify="end">
        <c-button @click="showModal = false">
          Close
        </c-button>
      </c-card-actions>
    </c-card>
  </c-modal>
</template>

