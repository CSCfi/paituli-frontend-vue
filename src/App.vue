<script setup lang="ts"></script>

<template>
  <header>
    <c-toolbar class="relative site-header">
      <div class="header-content">
        <c-csc-logo />
        <h2>Paituli logo</h2>
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/download">Download data</RouterLink>
          <RouterLink to="/webservices">Web services</RouterLink>
          <RouterLink to="/files">Batch download</RouterLink>
          <RouterLink to="/stac">STAC</RouterLink>
          <RouterLink to="/opendata">Share your data</RouterLink>
        </nav>
      </div>
      <!--c-spacer />
      <c-navigation-button /-->
    </c-toolbar>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  max-width: 1150px;
  margin: 0 auto;
  margin-top: var(--site-header-height);
}

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
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
