import './assets/main.css'

import { createApp, nextTick } from 'vue'
import { defineCustomElements } from '@cscfi/csc-ui/loader'
import { vControl } from '@cscfi/csc-ui-vue'
import { VCodeBlock } from '@wdns/vue-code-block';
import { useLocale } from './composables/locale';

const { i18n } = useLocale();

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.component('VCodeBlock', VCodeBlock)

app.use(i18n)

// Register CSC Design System components
app.directive('control', vControl)
defineCustomElements()

// We have to flush the DOM before mounting because some design system elements
// (like <c-menu>, <c-toasts>, etc.) are registered somehow asynchronously via defineCustomElements()
// Not ideal, but without the nextTick() those web components may not exist yet,
// causing them to render empty or not function correctly.
// TODO TEST IF THIS HELPS WITH THE TOASTS
await nextTick()

app.mount('#app')