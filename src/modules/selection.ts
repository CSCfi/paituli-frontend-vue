import { computed, ref, watch } from 'vue'

import { Collection, Feature, View } from 'ol'
import type { DragBoxEvent } from 'ol/interaction/DragBox'
import type { SelectEvent } from 'ol/interaction/Select'
import { Fill, Stroke, Style, Text } from 'ol/style'
import type { FeatureLike } from 'ol/Feature'
import { createEmpty, extend, getArea, type Extent } from 'ol/extent'
import type { DrawEvent } from 'ol/interaction/Draw'

import { drawBoundingBox, indexSource } from '@/modules/layers'
import { currentDataset } from './datasets'
import { toolbarMode } from './controls'
import type { Geometry } from 'ol/geom'


// Selected features managed by OL map element
export const selectedOlFeatures = new Collection<Feature>()

// Map sheet array, which gets updated based on changes to the above
// Honestly I forgot why we need this and the collection separately,
// must have been some Vue shenanigans?
export const selectedFeaturesArray = ref<Feature[]>([])

// Update our selection array based on collection changes
selectedOlFeatures.on('add', (event) => {
  selectedFeaturesArray.value.push(event.element)
})
selectedOlFeatures.on('remove', (event) => {
  selectedFeaturesArray.value = selectedFeaturesArray.value.filter(
    (f) => f.get('label') !== event.element.get('label'),
  )
})

// Adds a single feature (sheet) to selection
export function selectFeature(feature: Feature<Geometry>) {
  selectedOlFeatures.push(feature)
  feature.setStyle(selectionStyle(feature))
}

// Sheets should be automatically selected if there is only one of them
export const autoSelectSheets =
  computed(() => currentDataset.value?.map_sheets == 1)

// Simply selects all map sheets in the current index source, if any
// and ensures their style gets updated
export function selectAll() {
  indexSource.value?.forEachFeature((feature) => selectFeature(feature))
}

// Update style for (de)selected features
export function featureSelected(event: SelectEvent) {
  event.selected.forEach((feature) => {
    feature.setStyle(selectionStyle(feature))
  })

  event.deselected.forEach((feature) => {
    feature.setStyle(undefined) // revert to layer default
  })
}

// Rectangular selections
export function dragboxEnd(event: DragBoxEvent) {
  const extent = event.target.getGeometry().getExtent()

  indexSource.value?.forEachFeatureIntersectingExtent(extent, (feature) => {
    if (!selectedOlFeatures.getArray().includes(feature)) {
      selectFeature(feature)
    }
  })
}

// Polygon selections
export function polyDrawEnd(event: DrawEvent) {
  const geometry = event.feature.getGeometry()
  if (!geometry) return
  indexSource.value?.forEachFeature((feature) => {
    const featureExtent = feature.getGeometry()?.getExtent()
    if (featureExtent && geometry.intersectsExtent(featureExtent)) {
      selectFeature(feature)
    }
  })
}

// Selects index map sheets by the provided extent,
// and returns whether any sheets were selected.
// Also draws the extent and zooms to the selection, if any.
export function selectSheetsByExtent(
  extent: Extent,
  mapView: View,
): boolean {
  if (!indexSource.value) return false

  const matches = indexSource.value.getFeatures().filter((f) => {
    return f.getGeometry()?.intersectsExtent(extent)
  })
  if (matches.length == 0) return false
  drawBoundingBox(extent)

  const selection = createEmpty()
  matches.forEach((feature) => {
    selectFeature(feature)
    extend(selection, feature.getGeometry()!.getExtent())
  })

  // We zoom so that both extents stay in view
  const biggerExtent =
    getArea(selection) > getArea(extent) ? selection : extent
  requestAnimationFrame(() => {
    mapView.fit(biggerExtent, {
      padding: [150, 40, 40, 40],
      duration: 1500,
    })
  })
  return true
}

// Style for selected map sheets,
// which is different between inspect mode and other modes
const selectionStyle = (feature: FeatureLike) => {
  switch (toolbarMode.value) {
  case 'inspect':
    return new Style({
      stroke: new Stroke({ color: 'rgba(222, 0, 255, 1.0)', width: 2.5 }),
      zIndex: 50,
    })
  default:
    return new Style({
      stroke: new Stroke({ color: 'rgba(222, 0, 255, 1.0)', width: 2.5 }),
      fill: new Fill({ color: 'rgba(200, 0, 255, 0.15)' }),
      text: new Text({
        text: feature.get('label'),
        stroke: new Stroke({ width: 0.6 }) }),
      zIndex: 50,
    })
  }
}

// Refresh style for selected map sheets whenever tool modes change
watch(toolbarMode, () =>
  selectedOlFeatures.forEach(f => f.setStyle(selectionStyle(f))))
