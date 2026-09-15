<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { CAlertType } from '@cscfi/csc-ui'

import type { PreviewSource } from '@/modules/preview'

// The fallback for entries no renderer claims: formats that are not implemented,
// and index entries naming a directory. Neither can be drawn, and both are still
// downloadable, so the header's button is the way out.
const { source } = defineProps<{ source: PreviewSource }>()

const { t } = useI18n()
</script>

<template>
  <div class="unsupported">
    <c-alert :type="CAlertType.Info">
      <div class="message">
        <span v-if="source.directory">{{ t('directory') }}</span>
        <span v-else>{{ t('unsupported', { name: source.name }) }}</span>
        <span>{{ t('download_instead') }}</span>
      </div>
    </c-alert>
  </div>
</template>

<i18n>
{
  "en": {
    "directory": "This map sheet covers a folder of files rather than a single file, so there is nothing to preview yet.",
    "unsupported": "There is no preview for {name} yet.",
    "download_instead": "You can still download it with the button above.",
  },
  "fi": {
    "directory": "Tämä karttalehti kattaa kansion tiedostoja yksittäisen tiedoston sijaan, joten esikatseltavaa ei vielä ole.",
    "unsupported": "Tiedostolle {name} ei ole vielä esikatselua.",
    "download_instead": "Voit silti ladata sen yläreunan painikkeesta.",
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
