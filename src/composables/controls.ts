import { Collection, Feature, MapBrowserEvent } from 'ol'
import type { DragBoxEvent } from 'ol/interaction/DragBox'
import type { SelectEvent } from 'ol/interaction/Select'
import { ref } from 'vue'
import { useSources } from './sources'
import { Fill, Stroke, Style, Text } from 'ol/style'
import type { FeatureLike } from 'ol/Feature'
import { APP_SETTINGS } from '@/shared/constants'
import { transformExtent } from 'ol/proj'
import { useToasts } from './toasts'
import { CToastType } from '@cscfi/csc-ui'

const {
  indexLayerSource,
  drawBoundingBox,
  dataLayerMaxResolution
} = useSources()

const { addToast } = useToasts()

// Map zoom controls
const mapCenter = ref<[number, number]>(APP_SETTINGS.MAP_DEFAULT_CENTER)
const mapZoom = ref<number>(APP_SETTINGS.MAP_DEFAULT_ZOOM)

// Map layer controls
const backgroundVisible = ref(true)
const muncipalitiesVisible = ref(false)
const catchmentVisible = ref(false)
const indexVisible = ref(true)
const dataVisible = ref(true)
const mapsheetSearch = ref(false)

// Tool modes
const featureInfoToolMode = ref(false)

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

// Rectangular selection
const dragboxEnd = (event: DragBoxEvent) => {
  const extent = event.target.getGeometry().getExtent()

  indexLayerSource.value?.forEachFeatureIntersectingExtent(extent, (feature) => {
    if (!selectedOlFeatures.getArray().includes(feature)) {
      selectedOlFeatures.push(feature)
      feature.setStyle(selectionStyle(feature))
    }
  })
}

// Selection by search string
function selectFeatureSearch(query: string, bbox: Array<number>) {
  if (!indexLayerSource.value || !query) return;
  selectedOlFeatures.clear();
  const features = indexLayerSource.value.getFeatures();

  // First try bounding box
  const extent = transformExtent([bbox[2], bbox[0], bbox[3], bbox[1]], 'EPSG:4326', 'EPSG:3857')
  drawBoundingBox(extent)
  let matches = features.filter((f) => {
    return f.getGeometry()?.intersectsExtent(extent)
  })
  if (matches.length > 0) {
    matches.forEach((f) => selectedOlFeatures.push(f))
    return
  }

  // If none found, simply select sheets by label
  matches = features.filter((f) => {
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

// Handles user moving or zooming the map. Zooming can trigger an
// automatic switch between mapsheet mode and feature info mode.
const handleResolutionChange = (e: unknown) => {
  const event = e as MapBrowserEvent<PointerEvent> // OL typing bug

  // We assume feature info mode if we zoom within its resolution limits.
  const newResolution = event.map.getView().getResolution();
  if (newResolution == undefined) {
    console.error('undefined new resolution!?')
  }
  else {
    const infoMode = newResolution <= dataLayerMaxResolution.value
    featureInfoToolMode.value = infoMode
  }

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
    mapsheetSearch,
    featureInfoToolMode,
    featureSelected,
    dragboxEnd,
    selectFeatureSearch,
    selectStyle: selectionStyle,
    handleResolutionChange,
    selectedFeaturesArray,
    selectedOlFeatures,
  }
}
