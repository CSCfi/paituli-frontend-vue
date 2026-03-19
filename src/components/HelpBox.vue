<script setup lang="ts">
import { mdiClose, mdiHelpCircleOutline } from '@mdi/js'
import { helpVisible, helpText, setHelp } from '@/modules/helpText';
import { useI18n } from 'vue-i18n';
import { watch } from 'vue';

const { t } = useI18n({ useScope: 'global' })

// Default the box initially and if it gets reset (e.g. locale change)
helpText.value = t('help.default')
watch(helpText, (newText: string | undefined) => {
  if (!newText) helpText.value = t('help.default')
})
</script>

<template>
  <div class="container">
    <div class="help-button">
      <c-icon-button
        ghost
        @click="setHelp(); helpVisible = true"
        v-tooltip="t('help.tooltip')"
        size="small">
        <c-icon :path="mdiHelpCircleOutline" size="30px"/>
      </c-icon-button>
    </div>
    <div class="help-box" v-if="helpVisible">
      <h3>Help</h3>
      <p v-if="helpText" v-html="helpText"></p>
      <div class="close">
        <c-icon-button size="small" @click="helpVisible = false">
          <c-icon size="20px" :path="mdiClose"/>
        </c-icon-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 350px;
}

.help-button, .help-box {
  position: relative;
  left: 0;
}
.help-button {
  position: absolute;
  z-index: 1;
  --c-icon-button-ghost-background-color: var(--c-primary-200);
  --c-icon-button-ghost-background-color-hover: var(--c-primary-300);
  margin: 1.9em;
}
.help-box {
  z-index: 2;
  padding: .25em 1em;

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
