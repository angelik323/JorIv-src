<template>
  <div class="q-mb-lg q-mx-lg">
    <p class="text-black-10 text-weight-bold text-h6 q-mb-md">
      {{ props.title }}
    </p>

    <div class="row">
      <div
        class="col-12 col-md-4 q-mt-lg"
        v-for="(item, index) in props.info"
        :key="index"
      >
        <p class="text-weight-medium q-mb-none text-grey-10">
          {{ item.title }}
        </p>
        <p class="text-grey-6 mb-0">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TitleDescription } from '@/interfaces/customs'

const props = defineProps<{
  title: string
  info:  TitleDescription[]
}>()
</script>
