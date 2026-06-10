<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n'

import { initToasts } from '@/composables/toasts';
import FooterItem from '@/components/common/FooterItem.vue';
import { currentFlag, languageItems } from '@/modules/locale';
import { useRoute, useRouter } from 'vue-router';
import { navLinks } from '@/routes';

const { t } = useI18n({ useScope: 'global' })
const route = useRoute()
const router = useRouter()

// Label for a nav route, by convention `pages.<name lowercased>`.
const pageLabel = (name: string) => t(`pages.${name.toLowerCase()}`)

// Mobile dropdown items derived from the same nav links as the header. Localized
// (hence computed); each navigates on select (the { name, action } shape the
// language dropdown uses).
const navItems = computed(() =>
  navLinks.map(link => ({
    name: pageLabel(link.name),
    action: () => router.push(link.path),
  })),
)

// Initialize global toasts messages container
const toasts = ref<HTMLCToastsElement | null>(null)
onMounted(() => {
  initToasts(toasts.value)
})

</script>

<template>
  <header>
    <c-toolbar class="site-header">
      <c-menu id="nav-menu" :items="navItems" custom>
        <c-navigation-button />
      </c-menu>
      <c-csc-logo />
      <RouterLink to="/">
        <h2>Paituli</h2>
      </RouterLink>
      <div class="header-content">
        <nav>
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :id="link.name.toLowerCase()"
            :to="link.path"
          >{{ pageLabel(link.name) }}</RouterLink>
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

#nav-menu {
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
  #nav-menu {
    display: unset;
  }
}
</style>
