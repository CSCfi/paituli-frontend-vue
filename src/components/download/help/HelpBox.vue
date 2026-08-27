<script setup lang="ts">
import { mdiClose, mdiHelpCircleOutline } from '@mdi/js'
import { helpLabel, helpVisible, helpText } from '@/modules/helpText';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n({ useScope: 'global' })

// The box defaults until something gives it contents. Note that the contents
// live outside the component, so they survive it being unmounted.
const content = computed(() => helpText.value || t('help.default'))

// Each help source labels its contents, telling what they are about
const header = computed(() => helpLabel.value
  ? t('help.header_labeled', { label: helpLabel.value })
  : t('help.header'))
</script>

<template>
  <div class="container">
    <div class="help-button">
      <c-icon-button
        ghost
        @click="helpVisible = true"
        v-tooltip="t('help.tooltip')"
        size="small">
        <c-icon :path="mdiHelpCircleOutline" size="30px"/>
      </c-icon-button>
    </div>
    <div class="help-box" v-if="helpVisible">
      <h3>{{ header }}</h3>
      <p v-html="content"></p>
      <div class="close">
        <c-icon-button size="small"
                       :aria-label="t('close')"
                       @mousedown.prevent
                       @click="helpVisible = false">
          <c-icon size="20px" :path="mdiClose"/>
        </c-icon-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  width: 350px;
  pointer-events: none;
}
.help-button {
  position: absolute;
  z-index: 1;
  --c-icon-button-ghost-background-color: var(--c-primary-200);
  --c-icon-button-ghost-background-color-hover: var(--c-primary-300);
  margin: 1.9em;
  pointer-events: auto;
}
.help-box {
  position: relative;
  width: 100%;
  bottom: 0;
  z-index: 2;
  padding: .25em 1em;

  color: var(--c-primary-100);
  background: var(--c-primary-800);
  pointer-events: auto;

  h3 {
    font-size: 1em;
  }

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
