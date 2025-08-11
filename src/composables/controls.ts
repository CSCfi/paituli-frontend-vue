import { Collection, Feature } from 'ol'
import type { DragBoxEvent } from 'ol/interaction/DragBox'
import type { SelectEvent } from 'ol/interaction/Select'
import { ref } from 'vue'
import { useSources } from './sources'
import { Fill, Stroke, Style, Text } from 'ol/style'
import type { FeatureLike } from 'ol/Feature'
import { APP_SETTINGS } from '@/shared/constants'

const { indexLayerSource } = useSources()

// Map zoom controls
const mapCenter = ref<[number, number]>(APP_SETTINGS.MAP_DEFAULT_CENTER)
const mapZoom = ref<number>(APP_SETTINGS.MAP_DEFAULT_ZOOM)

// Map layer controls
const backgroundVisible = ref(true)
const muncipalitiesVisible = ref(false)
const catchmentVisible = ref(false)
const indexVisible = ref(true)
const dataVisible = ref(true)

// Mapsheet selection
const selectedFeatures = new Collection<Feature>()
selectedFeatures.on('add', (event) => {
  selectedFeaturesArray.value.push(event.element)
})

const selectedFeaturesArray = ref<Feature[]>([])
selectedFeatures.on('remove', (event) => {
  selectedFeaturesArray.value = selectedFeaturesArray.value.filter(
    (f) => f.get('label') !== event.element.get('label'),
  )
  if (!selectedFeaturesArray.value.length) {
  }
})

const featureSelected = (event: SelectEvent) => {
  event.selected.forEach((feature) => {
    feature.setStyle(selectionStyle(feature))
  })

  event.deselected.forEach((feature) => {
    feature.setStyle(undefined) // revert to layer default
  })
}

const dragboxEnd = (event: DragBoxEvent) => {
  const extent = event.target.getGeometry().getExtent()

  indexLayerSource.value?.forEachFeatureIntersectingExtent(extent, (feature) => {
    if (!selectedFeatures.getArray().includes(feature)) {
      selectedFeatures.push(feature)
      feature.setStyle(selectionStyle(feature))
    }
  })
}

const selectionStyle = function (feature: FeatureLike) {
  return new Style({
    stroke: new Stroke({ color: 'rgba(255, 0, 255, 1.0)', width: 2 }),
    fill: new Fill({ color: 'rgba(0, 0, 255, 0.4)' }),
    text: new Text({ text: feature.get('label'), stroke: new Stroke({ width: 0.6 }) }),
    zIndex: 50,
  })
}

export function useControls() {
  return {
    indexVisible,
    dataVisible,
    mapCenter,
    mapZoom,
    backgroundVisible,
    muncipalitiesVisible,
    catchmentVisible,
    featureSelected,
    dragboxEnd,
    selectStyle: selectionStyle,
    selectedFeaturesArray,
    selectedFeatures,
  }
}
