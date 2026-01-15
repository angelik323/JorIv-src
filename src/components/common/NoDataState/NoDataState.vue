<template>
  <div :class="[!disableDefaultClass && 'q-mt-xl']">
    <VCard>
      <template #content-card>
        <div
          class="flex column justify-center items-center items-center q-pb-xl q-pt-lg q-mt-lg q-mb-xl"
        >
          <img
            :src="getImage()"
            :alt="type === 'empty' ? 'No hay datos' : 'Sin resultados'"
          />
          <p class="text-main text-weight-bold text-h6 q-mt-lg q-mb-sm">
            {{ title }}
          </p>
          <p v-if="subtitle" class="text-body2 text-black-50 q-mb-none">
            {{ subtitle }}
          </p>
        </div>
      </template>
    </VCard>
  </div>
</template>

<script lang="ts" setup>
import VCard from '@/components/common/VCard/VCard.vue'

import useNoDataState from '@/components/common/NoDataState/NoDataState'

const props = defineProps<{
  type: 'empty' | 'no-results'
  title?: string
  subtitle?: string
  disableDefaultClass?: boolean
}>()

const { title, subtitle, getImage } = useNoDataState(props)
</script>
