<script setup lang="ts">
import VCard from '@/components/common/VCard/VCard.vue'
import Icon from '@/components/common/Icon/Icon.vue'

withDefaults(
  defineProps<{
    image: string | null
    count: string | number | null
    label: string
  }>(),
  {}
)
</script>

<template>
  <VCard :custom-style="'max-width: 290px'">
    <template #content-card>
      <div
        class="row items-center q-gutter-md q-pa-md q-pt-lg"
        style="height: 140px"
      >
        <div class="col">
          <span class="text-h3 text-black count-adjust">{{ count }}</span>
          <p class="text-subtitle1">{{ label }}</p>
        </div>

        <div class="col-auto flex justify-end q-pb-md">
          <div class="icon-wrapper">
            <Icon v-if="image" :name="image" alt="Icono" :size="20" />
          </div>
        </div>
      </div>
    </template>
  </VCard>
</template>
<style lang="scss" src="./StatsCard.scss" scoped />
