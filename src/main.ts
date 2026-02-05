import './assets/main.css'

import { createApp, nextTick } from 'vue'
import { defineCustomElements } from '@cscfi/csc-ui/loader'
import { vControl } from '@cscfi/csc-ui-vue'

import App from '@/App.vue'
import router from '@/routes'
import { i18n } from '@/modules/locale'

const app = createApp(App)
app.use(router)
app.use(i18n)

app.directive('control', vControl);

(async () => {

  defineCustomElements();

  // We have to flush the DOM before mounting because some design system elements
  // (like <c-menu>, <c-toasts>, etc.) are registered somehow asynchronously via defineCustomElements()
  // Not ideal, but without the nextTick() those web components may not exist yet,
  // causing them to render empty or not function correctly.
  await nextTick();

  app.mount('#app');

})();

