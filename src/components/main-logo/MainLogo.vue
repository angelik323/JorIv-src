<template>
  <div class="picture__logo" :style="{ maxWidth: size }">
    <q-img
      src="@/assets/images/login/logo_fiduprevisora.svg"
      :alt
      fit="contain"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: string
    alt?: string
  }>(),
  {
    size: '180px',
    alt: 'Fiduprevisora',
  }
)
</script>

<style lang="scss" src="./MainLogo.scss" />
