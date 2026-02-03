<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

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
          {{ t("privacy") }}
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/accessibility">
          {{ t("accessibility") }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<i18n>
{
  "en": {
    "contact": "Contact",
    "privacy": "Privacy",
    "accessibility": "Accessibility",
  },
  "fi": {
    "contact": "Ota yhteyttä",
    "privacy": "Tietosuoja",
    "accessibility": "Saavutettavuus",
  },
}
</i18n>

<style scoped>
  .footer {
    height: 7rem;

    display: flex;
    justify-content: center;
    align-items: center;

    margin-top: 1rem;
    padding: 1.5rem 0 1.5rem 0;
    gap: 2rem;

    background-color: var(--c-primary-100);

    a, img {
      height: 100%;
    }
  }
</style>