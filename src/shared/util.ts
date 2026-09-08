// Miscellaneous utility methods
import type Map from 'ol/Map.js'
import Interaction from 'ol/interaction/Interaction.js'
import type { MapBrowserEvent } from 'ol'

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
    .then(() => {
      // show a toast/notification instead?
      console.log('Copied:', text)
    })
    .catch(err => {
      console.error('Failed to copy: ', err)
    })
}

// For digging interactions out of OpenLayers map component
export function getMapInteraction<T extends Interaction>(
  map: Map, ctor: new (options?: never) => T): T | undefined {
  return map.getInteractions().getArray()
    .find(i => i instanceof ctor) as T | undefined
}

// Whether a keyboard event came from an element accepting text input. OL's own
// `targetNotEditable` condition only sees the retargeted web component host
// (e.g. <c-text-field>), so reach the actual <input> via the composed path.
export function keyTargetEditable(event: MapBrowserEvent): boolean {
  const original = event.originalEvent
  const target = (original.composedPath()[0] ?? original.target) as Element | null
  if (!target) return false
  return ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)
    || (target as HTMLElement).isContentEditable === true
}
