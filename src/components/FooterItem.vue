<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' })

</script>

<template>
  <div class="footer">
    <a href="https://www.okm.fi/">
      <img :src="'okm_logo.png'" />
    </a>
    <a href="https://www.csc.fi">
      <img :src="'csc.png'" />
    </a>
    <a href="https://www.geoportti.fi">
      <img :src="'geoportti.png'" />
    </a>
    <a href="https://www.fairdata.fi">
      <img :src="'fairdata_logo.svg'" />
    </a>
    <div>
      <strong>{{ t("contact") }}<br></strong>
      <a href="mailto:servicedesk@csc.fi">servicedesk@csc.fi</a>
    </div>
    <ul>
      <li>
        <RouterLink to="/privacy">
          {{ t("pages.privacy") }}
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/cookies">
          {{ t("pages.cookies") }}
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/accessibility">
          {{ t("pages.accessibility") }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>


<style scoped>
.footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  gap: .5rem;
  background-color: var(--c-primary-100);

  img {
    height: 3.5rem;
    margin: .5em;
  }
}

</style>
