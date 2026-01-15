<script setup lang="ts">
import StatsCard from '@/components/common/StatsCard/StatsCard.vue'

withDefaults(
  defineProps<{
    stats: {
      image: any
      count: number | string
      label: string
    }[]
  }>(),
  {}
)
</script>

<template>
  <div class="row q-gutter-md">
    <StatsCard
      v-for="(item, index) in stats"
      class="col-3 col-xs-12 col-sm-8 col-md-3 col-lg-3"
      :key="index"
      :image="item.image"
      :count="item.count"
      :label="item.label"
    />
  </div>
</template>
