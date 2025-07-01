<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <c-toolbar class="relative">
    <!--img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /-->
    <c-csc-logo />
    <h2 class="logo">Paituli</h2>

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/download">Download data</RouterLink>
        <RouterLink to="/webservices">Web services</RouterLink>
        <RouterLink to="/files">Batch download</RouterLink>
        <RouterLink to="/stac">STAC</RouterLink>
        <RouterLink to="/opendata">Share your data</RouterLink>
      </nav>
    </div>

    <c-spacer />

    <c-navigation-button />
  </c-toolbar>
</template>

<style scoped>
.logo {
  font-weight: bold;
  color: var(--c-info-600);
}
</style>
