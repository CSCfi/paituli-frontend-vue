<script setup lang="ts">
import { ref, type Ref } from 'vue'
import * as proj from 'ol/proj'
import { URLS } from '@/shared/constants'

// Inject the shared state
const mapCenter = defineModel('center') as Ref<[number, number]>
const mapZoom = defineModel('zoom') as Ref<number>

const searchStr = ref('')

const search = async () => {
  if (searchStr.value.trim().length === 0) return

  try {
    const response = await fetch(
      URLS.NOMINATIM_API.replace(
        '!query!',
        encodeURIComponent(searchStr.value),
      ),
    )
    const data = await response.json()

    if (data.length > 0) {
      const [lon, lat] = [Number(data[0].lon), Number(data[0].lat)]
      const projected = proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857')

      mapCenter.value = [projected[0], projected[1]]
      mapZoom.value = searchStr.value.includes(',') ? 16 : 13
    } else {
      alert('Location or address not found. Please double check your spelling.')
    }
  } catch (error) {
    console.error('Search error:', error)
  }
}
</script>

<template>
  <div>
    <input v-model="searchStr" @keypress.enter="search" />
    <button @click="search">{{ 'Search' }}</button>
  </div>
</template>
