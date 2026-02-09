import { ref } from 'vue'

// Map layer visibility controls
export const showLayer = {
  background: ref(true),
  muncipalities: ref(false),
  catchment: ref(false),
  index: ref(true),
  data: ref(true),
}

// Tool modes
type ControlMode = 'move' | 'select' | 'inspect'
type SelectMode = 'basic' | 'poly' | 'json' | 'clear'
export const toolbarMode = ref<ControlMode>('move')
export const selectMode = ref<SelectMode>('basic')

// Callback for user selecting files to upload
export const fileSelectedCallback = ref<(file: File) => void>()
