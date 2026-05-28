import { ref } from 'vue'

// Side menu tab mode
// (Tabbing happens only if vertical space is low)
type MenuMode = 'datasets' | 'download'
export const menuMode = ref<MenuMode>('datasets')

// Map layer visibility controls
export const showLayer = {
  background: ref(true),
  municipalities: ref(false),
  catchment: ref(false),
  index: ref(true),
  data: ref(true),
}

// Map view resolution
export const mapViewResolution = ref(0)

// Tool modes
type ControlMode = 'move' | 'select' | 'inspect'
type SelectMode = 'basic' | 'poly' | 'json' | 'clear'
export const toolbarMode = ref<ControlMode>('move')
export const selectMode = ref<SelectMode>('basic')

// Callback for user selecting files to upload
export const fileSelectedCallback = ref<(file: File) => void>()
