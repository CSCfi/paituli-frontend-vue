<script setup lang="ts">
import { mdiClose } from '@mdi/js'
import { helpVisible, helpText } from '@/modules/helpText';
import { useI18n } from 'vue-i18n';
import { watch } from 'vue';

const { t } = useI18n({ useScope: 'global' })

// Default the box if it gets reset (e.g. locale change)
watch(helpText, (newText: string | undefined) => {
  if (!newText) helpText.value = t('help.default')
})
</script>

<template>
  <div class="help-box" v-if="helpVisible">
    <h3>Help</h3>
    <p v-if="helpText" v-html="helpText"></p>
    <div class="close">
      <c-icon-button size="small" @click="helpVisible = false">
        <c-icon size="20px" :path="mdiClose"/>
      </c-icon-button>
    </div>
  </div>
</template>

<style scoped>
.help-box {
  position: absolute;
  left: 0;
  z-index: 1;
  width: 400px;
  padding: 0 1em 0 1em;

  color: var(--c-primary-100);
  background: var(--c-primary-800);

  .close {
    position: absolute;
    z-index: 0;
    top: 0;
    right: 0;
    margin: 1em;
  }
}

:global(.help-content) {
  display: none !important;
}
</style>
