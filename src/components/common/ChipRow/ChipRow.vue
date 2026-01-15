<template>
  <div class="row items-center q-gutter-x-lg">
    <div class="col-auto container-chip">
      <p class="text-weight-bold text-grey-10 q-mb-none">{{ label }}</p>
    </div>
    <div class="col">
      <q-chip
        v-for="opt in displayedItems"
        :key="opt.id"
        class="q-mr-xs chip-limit"
        outline
        color="primary_fiduciaria"
        text-color="primary_fiduciaria"
        :removable="removable"
        @remove="onRemove(opt)"
      >
        <span class="chip-text">
          {{ emailMode ? opt.id : opt.name }}
        </span>
      </q-chip>

      <q-chip
        v-if="hiddenCount > 0"
        class="q-mr-xs"
        outline
        color="grey-4"
        text-color="grey-10"
      >
        y {{ hiddenCount }} más
      </q-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IChipsOptions } from '@/interfaces/customs'
import useChipRow from './ChipRow'

const props = defineProps<{
  label: string
  items?: (string | IChipsOptions)[]
  defaultValue?: (string | IChipsOptions)[]
  hiddenCount: number
  emailMode?: boolean
  removable?: boolean
}>()

const emit = defineEmits<{
  (e: 'change', value: { name: string; id: number }[]): void
}>()

const { displayedItems, onRemove } = useChipRow(props, emit)
</script>

<style src="./ChipRow.scss" lang="scss" scoped />
