import { Collection, Feature } from 'ol'
import type { DragBoxEvent } from 'ol/interaction/DragBox'
import type { SelectEvent } from 'ol/interaction/Select'
import { ref } from 'vue'
import { useSources } from './sources'
import { Fill, Stroke, Style, Text } from 'ol/style'
import type { FeatureLike } from 'ol/Feature'
import { transformExtent } from 'ol/proj'
import { useToasts } from './toasts'
import { CToastType } from '@cscfi/csc-ui'
import type { Extent } from 'ol/extent'
import type { DrawEvent } from 'ol/interaction/Draw'

const {
  indexLayerSource,
  drawBoundingBox,
} = useSources()

const { addToast } = useToasts()

// Map layer controls
const backgroundVisible = ref(true)
const muncipalitiesVisible = ref(false)
const catchmentVisible = ref(false)
const indexVisible = ref(true)
const dataVisible = ref(true)
const mapsheetSearch = ref(false)

// Tool modes
type ControlMode = 'move' | 'select' | 'inspect'
type SelectMode = 'single' | 'multi' | 'draw' | 'clear'
const controlMode = ref<ControlMode>('move')
const selectMode = ref<SelectMode>('single')

// Selected features managed by OL map element
const selectedOlFeatures = new Collection<Feature>()

// Mapsheet array, which gets updated based on changes to the above
// Honestly I forgot why we need this and the collection separately,
// must have been some Vue shenanigans?
const selectedFeaturesArray = ref<Feature[]>([])
selectedOlFeatures.on('add', (event) => {
  selectedFeaturesArray.value.push(event.element)
})
selectedOlFeatures.on('remove', (event) => {
  selectedFeaturesArray.value = selectedFeaturesArray.value.filter(
    (f) => f.get('label') !== event.element.get('label'),
  )
})

// Update style for (de)selected features
const featureSelected = (event: SelectEvent) => {
  event.selected.forEach((feature) => {
    feature.setStyle(selectionStyle(feature))
  })

  event.deselected.forEach((feature) => {
    feature.setStyle(undefined) // revert to layer default
  })
}

// Rectangular selections
const dragboxEnd = (event: DragBoxEvent) => {
  const extent = event.target.getGeometry().getExtent()

  indexLayerSource.value?.forEachFeatureIntersectingExtent(extent, (feature) => {
    if (!selectedOlFeatures.getArray().includes(feature)) {
      selectedOlFeatures.push(feature)
      feature.setStyle(selectionStyle(feature))
    }
  })
}

// Polygon selections
const polyDrawEnd = (event: DrawEvent) => {
  const geometry = event.feature.getGeometry()
  if (!geometry) return
  indexLayerSource.value?.forEachFeature((feature) => {
    const featureExtent = feature.getGeometry()?.getExtent()
    if (featureExtent && geometry.intersectsExtent(featureExtent)) {
      selectedOlFeatures.push(feature)
      feature.setStyle(selectionStyle(feature))
    }
  })
}

// Selects index mapsheets by the provided extent
const selectSheetsByExtent = (extent: Extent): boolean => {
  if (!indexLayerSource.value) return false

  const matches = indexLayerSource.value.getFeatures().filter((f) => {
    return f.getGeometry()?.intersectsExtent(extent)
  })
  matches.forEach((f) => selectedOlFeatures.push(f))
  drawBoundingBox(extent)
  return matches.length > 0
}

// Selection by search string
function selectFeatureSearch(query: string, bbox: Array<number>) {
  if (!indexLayerSource.value || !query) return;
  selectedOlFeatures.clear();
  const features = indexLayerSource.value.getFeatures();

  // First try bounding box
  const extent = transformExtent([bbox[2], bbox[0], bbox[3], bbox[1]], 'EPSG:4326', 'EPSG:3857')
  if (selectSheetsByExtent(extent)) return

  // If none found, simply select sheets by label
  const matches = features.filter((f) => {
    const name = (f.get('label') || f.get('name') || '').toLowerCase();
    return name.includes(query.toLowerCase());
  })
  if (matches.length > 0) {
    matches.forEach((f) => selectedOlFeatures.push(f));
    return
  }

  addToast({
    type: CToastType.Warning,
    message: 'Search query did not match any location or mapsheet label'
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

// Callback for user selecting files to upload
const fileSelectedCallback = ref<(file: File) => void>()

export function useControls() {
  return {
    indexVisible,
    dataVisible,
    backgroundVisible,
    muncipalitiesVisible,
    catchmentVisible,
    mapsheetSearch,
    controlMode,
    selectMode,
    featureSelected,
    dragboxEnd,
    polyDrawEnd,
    selectFeatureSearch,
    selectSheetsByExtent,
    selectStyle: selectionStyle,
    selectedFeaturesArray,
    selectedOlFeatures,
    fileSelectedCallback,
  }
}
