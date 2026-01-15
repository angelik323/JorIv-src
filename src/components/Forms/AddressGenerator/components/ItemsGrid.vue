<template>
  <div>
    <p v-if="title" class="text-dark text-h6 text-bold q-my-md">
      {{ title }}
    </p>

    <div class="row q-col-gutter-sm">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="col-6 col-sm-4 col-md-3"
      >
        <q-btn
          type="button"
          outline
          no-caps
          class="full-width btn__round-item custom txt-color-new-primary"
          @click="handleClick(item)"
        >
          {{ getItemDisplayValue(item) }}
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    items: Record<string, any>[] | string[]
    isObjectArray?: boolean
    displayKey?: string
    valueKey?: string
  }>(),
  {
    displayKey: '',
  }
)

const emit =
  defineEmits<(e: 'item-click', item: Record<string, any> | string) => void>()

const getItemDisplayValue = (item: Record<string, any> | string): string => {
  return props.isObjectArray
    ? (item as Record<string, any>)[props.displayKey]
    : (item as string)
}

const handleClick = (item: Record<string, any> | string) => {
  emit('item-click', item)
}
</script>
