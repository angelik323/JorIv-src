<template>
  <div class="container-info-card">
    <p>{{ models.title }}</p>
    <p class="info-card-value">{{ models.value }}</p>
    <p class="info-card-description">{{ models.description }}</p>
  </div>
</template>
<style lang="scss" src="./InfoCard.scss" />
<script setup lang="ts">
import useInfoCard from '@/components/Forms/FixedAssets/CalculationDeterioration/InfoCard/InfoCard'

const props = defineProps<{
  title: string | null
  value: string | number | null
  description: string | null
}>()

const { models } = useInfoCard(props)
</script>
