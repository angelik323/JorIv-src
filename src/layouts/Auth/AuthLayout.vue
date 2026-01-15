<template>
  <q-layout class="auth-layout" view="lHh Lpr lff" container>
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Loader global -->
    <MainLoader />

    <!-- Herramientas de accesibilidad -->
    <AccessibilityBar />
  </q-layout>
</template>

<script setup lang="ts">
// Components
import MainLoader from '@/components/loader/MainLoader.vue'
import AccessibilityBar from '@/components/common/AccessibilityBar/AccessibilityBar.vue'
</script>

<style lang="scss" src="./AuthLayout.scss" />
