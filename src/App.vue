<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useToasts } from './composables/toasts';
import { mdiTranslate } from '@mdi/js';
import { useI18n } from 'vue-i18n'
import { useLocale } from './composables/locale';

const { t } = useI18n()
const { initToasts } = useToasts()
const { languageItems } = useLocale()

// Initialize global toasts messages container
const toasts = ref<HTMLCToastsElement | null>(null)
onMounted(() => {
  initToasts(toasts.value)
})


</script>

<template>
  <header>
    <c-toolbar class="absolute site-header">
      <div class="header-content">
        <c-csc-logo />
        <h2>Paituli</h2>
        <nav>
          <RouterLink to="/">{{ t("home") }}</RouterLink>
          <RouterLink to="/download">{{ t("download") }}</RouterLink>
          <RouterLink to="/webservices">{{ t("webservices") }}</RouterLink>
          <RouterLink to="/files">{{ t("files") }}</RouterLink>
          <RouterLink to="/stac">{{ t("stac") }}</RouterLink>
          <RouterLink to="/opendata">{{ t("opendata") }}</RouterLink>
        </nav>
      </div>
      <c-menu :items="languageItems">
        <c-icon-button ghost>
          <c-icon :path="mdiTranslate" />
        </c-icon-button>
      </c-menu>
    </c-toolbar>
  </header>
  <main>
    <RouterView />
  </main>
  <c-toasts ref="toasts" horizontal="center" vertical="top" />
</template>

<i18n>
  {
    "en": {
      "home": "Home",
      "download": "Download Data",
      "webservices": "Web Services",
      "files": "Batch Download",
      "stac": "STAC",
      "opendata": "Share Your Data",
    },
    "fi": {
      "home": "Koti",
      "download": "Latauspalvelu",
      "webservices": "Rajapinnat",
      "files": "Massalataus",
      "stac": "STAC",
      "opendata": "Jaa Aineistosi",
    },
  }
</i18n>

<style scoped>
main {
  max-width: 1150px;
  margin: 0 auto;
  margin-top: var(--site-header-height);
  padding-top: 10px;
}

c-toasts {
  padding-top: var(--site-header-height);
}

.site-header {
  position: fixed;
  top: 0;
  left: 0;
}
.site-header nav {
  width: 100%;
  max-width: 1450px;
  margin: 0 auto;
}
.site-header nav * {
  margin-right: 15px;
  padding: 5px 10px;
}

.header-content {
  display: flex;
  flex: auto;
  gap: 30px;
  align-items: center;

  font-weight: bold;
  color: var(--c-info-600);
}
</style>
