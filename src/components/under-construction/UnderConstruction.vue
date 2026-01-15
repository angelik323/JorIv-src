<script setup lang="ts">
const props = defineProps(['titleSection'])
const titleSection = props.titleSection
</script>
<template>
  <div class="construction__page--container">
    <div class="column items-center justify-center">
      <div class="col-auto">
        <q-img
          src="@/assets/images/loader.png"
          loading="lazy"
          spinner-color="white"
          class="construction__page--img q-ma-lg"
        />
      </div>
      <div class="col-auto">
        <span class="construction__page--min">Gracias la sección</span>
        <span class="construction__page--title text-primary"
          >"{{ titleSection }}"
        </span>
      </div>
      <div class="col-auto">
        <span class="construction__page--dev">esta en desarrollo</span>
      </div>
      <div class="col-auto">
        <span class="construction__page--dev">Gracias por su paciencia</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" src="./UnderConstruction.scss" />

