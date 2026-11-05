<script setup lang="ts">
import { computed, ref, type Directive } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiCopyright } from '@mdi/js'
import {
  backgroundIndex,
  backgroundProviders,
  backgroundSource,
  openFreeMapSource,
  openFreeMapStyle,
  unavailableBackgrounds,
} from '@/modules/layers'
import AppLink from '@/components/common/AppLink.vue'

const { t } = useI18n()

const showAttribs = ref(false)

const providerItems = computed(() => backgroundProviders.map(({ name }, index) => {
  const unavailable = unavailableBackgrounds.value.has(index)
  return { name: unavailable ? `${name} (${t('unavailable')})` : name, value: index, disabled: unavailable }
}))
const styleItems = ['Bright', 'Positron', 'Fiord'].map((name) => ({ name, value: name.toLowerCase() }))

// The providers are split into two groups after OpenFreeMap, so that its styles can be listed under it
const split = backgroundProviders.findIndex(({ source }) => source == openFreeMapSource) + 1

// The CSC radios leave room for a big hover circle, which spaces them far apart.
// Their rows live in a shadow root, so this adopts smaller ones straight into it.
// :host makes these rules win over the component's own, whichever comes first.
const compactRadios = new CSSStyleSheet()
compactRadios.replaceSync(`
  :host .c-radio-group__items { gap: 0 }
  :host .c-radio .ripple { width: 32px; min-width: 32px; height: 32px }
  :host .c-radio .selection { top: 6px; left: 6px }
  :host .c-radio__label { padding-top: 6px }
`)
const vCompact: Directive<HTMLElement> = {
  mounted: (el) => {
    if (el.shadowRoot) el.shadowRoot.adoptedStyleSheets = [...el.shadowRoot.adoptedStyleSheets, compactRadios]
  },
}

</script>

<template>
  <h3>{{ t("heading") }}</h3>
  <c-radio-group :items="providerItems.slice(0, split)" v-model="backgroundIndex" v-control v-compact hide-details />
  <Transition name="collapse">
    <div v-if="backgroundSource == openFreeMapSource" class="collapse">
      <c-radio-group class="styles"
                     :items="styleItems"
                     v-model="openFreeMapStyle"
                     v-control
                     v-compact
                     hide-details />
    </div>
  </Transition>
  <c-radio-group :items="providerItems.slice(split)" v-model="backgroundIndex" v-control v-compact hide-details />
  <c-button class="attributions" text size="small" @click="showAttribs = true">
    <c-icon :path="mdiCopyright" />
    {{ t("attributions") }}
  </c-button>
  <c-modal v-model="showAttribs"
           v-control
           dismissable
           disable-backdrop-blur>
    <c-card>
      <c-card-title>
        {{ t('attributions') }}
      </c-card-title>
      <!-- Each provider's credit line as its docs ask for it -->
      <c-card-content>
        <dl>
          <dt>Terrestris</dt>
          <dd>
            © <AppLink to="https://www.openstreetmap.org/copyright">OpenStreetMap</AppLink> contributors,
            © Natural Earth Data, © GEBCO Bathymetric Compilation Group 2019,
            © <AppLink to="https://terrestris.de/produkte/freier-osm-wms/">terrestris</AppLink>
          </dd>
          <dt>OpenFreeMap</dt>
          <dd>
            <AppLink to="https://openfreemap.org">OpenFreeMap</AppLink>
            © <AppLink to="https://www.openmaptiles.org/">OpenMapTiles</AppLink>
            Data from <AppLink to="https://www.openstreetmap.org/copyright">OpenStreetMap</AppLink>
          </dd>
          <dt>OpenTopoMap</dt>
          <dd>
            Map data: © <AppLink to="https://www.openstreetmap.org/copyright">OpenStreetMap</AppLink> contributors, SRTM |
            Map style: © <AppLink to="https://opentopomap.org">OpenTopoMap</AppLink> (CC-BY-SA)
          </dd>
        </dl>
      </c-card-content>
      <c-card-actions justify="end">
        <c-button @click="showAttribs = false">{{ t('close') }}</c-button>
      </c-card-actions>
    </c-card>
  </c-modal>
</template>

<i18n>
{
  "en": {
    "heading": "Background map",
    "unavailable": "unavailable",
    "attributions": "Attributions",
    "close": "Close",
  },
  "fi": {
    "heading": "Taustakartta",
    "unavailable": "ei käytettävissä",
    "attributions": "Tekijänoikeudet",
    "close": "Sulje",
  },
}
</i18n>

<style scoped>
h3 {
  margin-top: 0;
  margin-bottom: .5em;
  text-align: center;
}
c-radio-group {
  --c-radio-group-color: var(--c-primary-200);
  --c-radio-group-color-active: var(--c-accent-300);
  --c-radio-group-color-disabled: var(--c-primary-400);
  --c-radio-group-background-color-hover: rgba(255, 255, 255, .1);
}
.styles {
  margin-left: 1.5em;
}

/* Collapses the style options vertically by animating their grid row. While
   it animates, hidden overflow lets the row get shorter than its content. */
.collapse {
  display: grid;
  grid-template-rows: 1fr;
}
.collapse-enter-active,
.collapse-leave-active {
  transition: grid-template-rows .2s ease;

  > * {
    overflow: hidden;
  }
}
.collapse-enter-from,
.collapse-leave-to {
  grid-template-rows: 0fr;
}
dl {
  margin: 0;
}
dt {
  font-weight: bold;
}
dd {
  margin: 0 0 .75em;
}
c-button {
  --c-button-background-color: var(--c-info-600);
  --c-button-background-color-hover: var(--c-info-400);
}
.attributions {
  width: 100%;
  margin-top: .5em;

  --c-button-text-text-color: var(--c-primary-100);
  --c-button-text-background-color-hover: var(--c-primary-500);
}
</style>
