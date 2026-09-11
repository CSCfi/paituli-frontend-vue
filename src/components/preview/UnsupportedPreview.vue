<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { CAlertType } from '@cscfi/csc-ui'

import AppLink from '@/components/common/AppLink.vue'
import type { PreviewSource } from '@/modules/preview'

// The fallback for entries no renderer claims: formats that are not implemented,
// and index entries naming a directory rather than a single file. Listing a
// directory's contents needs either a Funet CORS origin or a backend endpoint,
// so for now those entries link to the archive listing itself.
const { source } = defineProps<{ source: PreviewSource }>()

const { t } = useI18n()
</script>

<template>
  <div class="unsupported">
    <c-alert :type="CAlertType.Info">
      <div class="message">
        <span v-if="source.directory">{{ t('directory') }}</span>
        <span v-else>{{ t('unsupported', { name: source.name }) }}</span>
        <AppLink :to="source.url" new-tab>
          {{ t(source.directory ? 'browse' : 'open') }}
        </AppLink>
      </div>
    </c-alert>
  </div>
</template>

<i18n>
{
  "en": {
    "directory": "This map sheet covers a folder of files rather than a single file, so there is nothing to preview yet.",
    "unsupported": "There is no preview for {name} yet.",
    "browse": "Browse the folder in the archive",
    "open": "Open the file in the archive",
  },
  "fi": {
    "directory": "Tämä karttalehti kattaa kansion tiedostoja yksittäisen tiedoston sijaan, joten esikatseltavaa ei vielä ole.",
    "unsupported": "Tiedostolle {name} ei ole vielä esikatselua.",
    "browse": "Selaa kansiota arkistossa",
    "open": "Avaa tiedosto arkistossa",
  },
}
</i18n>

<style scoped>
.unsupported {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  align-items: flex-start;
}
</style>
