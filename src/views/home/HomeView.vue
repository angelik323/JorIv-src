<template>
  <div class="q-px-lg q-mx-lg">
    <div class="row q-gutter-sm">
      <h4 class="txt-color-new-primary q-mb-none">Hola, {{ name }}</h4>
    </div>

    <RouterView />
  </div>
</template>
<script setup>
import useHomeView from '@/views/home/HomeView'

const { name } = useHomeView()
</script>
