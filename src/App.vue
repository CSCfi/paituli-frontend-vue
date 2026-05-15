<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n'

import { initToasts } from '@/composables/toasts';
import FooterItem from '@/components/common/FooterItem.vue';
import { currentFlag, languageItems } from '@/modules/locale';
import { useRoute } from 'vue-router';

const { t } = useI18n({ useScope: 'global' })
const route = useRoute()

// Initialize global toasts messages container
const toasts = ref<HTMLCToastsElement | null>(null)
onMounted(() => {
  initToasts(toasts.value)
})

</script>

<template>
  <header>
    <c-toolbar class="site-header">
      <c-navigation-button />
      <c-csc-logo />
      <RouterLink to="/">
        <h2>Paituli</h2>
      </RouterLink>
      <div class="header-content">
        <nav>
          <RouterLink id="home" to="/">{{ t("pages.home") }}</RouterLink>
          <RouterLink to="/download">{{ t("pages.download") }}</RouterLink>
          <RouterLink to="/webservices">{{ t("pages.webservices") }}</RouterLink>
          <RouterLink to="/files">{{ t("pages.batchdownload") }}</RouterLink>
          <RouterLink to="/stac">{{ t("pages.stac") }}</RouterLink>
          <RouterLink to="/opendata">{{ t("pages.shareyourdata") }}</RouterLink>
        </nav>
      </div>
      <c-menu id="languages" :items="languageItems">
        <h3>{{ currentFlag }}</h3>
      </c-menu>
    </c-toolbar>
  </header>
  <div class="page">
    <main>
      <RouterView />
    </main>
    <FooterItem v-if="!route.meta.hideFooter"/>
  </div>
  <c-toasts ref="toasts" horizontal="center" vertical="top" />
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  max-width: 1150px;
  margin: 0 auto;
  padding: 0 5vw;
  margin-top: var(--site-header-height);
  padding-top: 10px;

  flex: 1;
}

c-toasts {
  padding-top: var(--site-header-height);
}

a h2 {
  color: var(--c-info-600);
}

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  nav {
    margin: 0 auto;
    * {
      margin-right: 15px;
      padding: 5px 10px;
    }
  }
  h2 {
    margin: 5px;
  }
}

#languages {
  margin-left: auto;
  h3 {
    color: var(--c-tertiary-800);
  }
}

.header-content {
  display: flex;
  flex: auto;
  gap: 30px;
  align-items: center;
  font-weight: bold;
}

c-navigation-button {
  display: none;
}

@media (max-width: 1150px) {
  .site-header nav * {
    margin: 0;
  }
}
@media (max-width: 1050px) {
  c-csc-logo, #home {
    display: none;
  }
}
@media (max-width: 900px) {
  .header-content {
    display: none;
  }
  c-navigation-button {
    display: unset;
  }
}
</style>
