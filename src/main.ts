import './assets/main.css'

import { createApp } from 'vue'
import { defineCustomElements } from '@cscfi/csc-ui/loader'
import { vControl } from '@cscfi/csc-ui-vue'
import { VCodeBlock } from '@wdns/vue-code-block';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.component('VCodeBlock', VCodeBlock);

app.directive('control', vControl)
defineCustomElements()

app.use(router)

app.mount('#app')

