// Miscellaneous utility methods
import OlMap from 'ol/Map.js'
import Interaction from 'ol/interaction/Interaction.js'

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
  map: OlMap, ctor: new (options?: never) => T): T | undefined {
  return map.getInteractions().getArray()
    .find(i => i instanceof ctor) as T | undefined
}
