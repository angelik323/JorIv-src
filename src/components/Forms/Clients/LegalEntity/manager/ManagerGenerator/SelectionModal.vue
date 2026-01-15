<template>
  <q-dialog v-model="isModalOpen" persistent>
    <q-card
      flat
      bordered
      class="relative v-card-rounded q-py-lg q-px-xl generator-card"
    >
      <q-btn
        round
        flat
        icon="mdi-close"
        class="absolute-top-right q-ma-md q-mr-lg z-top"
        @click="closeModal"
      />

      <!-- Descripción -->
      <div class="text-center q-mt-xs q-mb-lg">
        <h2 class="text-h6 text-dark text-bold q-mt-none q-mb-sm">
          ¿Desea agregar un nuevo directorio?
        </h2>
        <p class="text-body2 text-grey-7 full-width q-ma-none">
          Seleccione el tipo de persona que quiere agregar
        </p>
      </div>

      <q-separator class="q-mb-lg" color="grey-2" />

      <div class="row justify-center q-gutter-md q-mb-sm">
        <q-btn
          type="button"
          size="md"
          rounded
          outline
          no-caps
          color="grey-10"
          class="text-weight-bold q-px-lg q-py-sm custom"
          @click="handleAction('Natural')"
        >
          Persona natural
        </q-btn>

        <q-btn
          type="button"
          size="md"
          rounded
          unelevated
          no-caps
          color="orange"
          class="custom q-px-lg q-py-sm"
          @click="handleAction('Juridica')"
        >
          Persona jurídica
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
  }>(),
  {
    isOpen: false,
  }
)

const isModalOpen = ref(props.isOpen)

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'click', action: 'Natural' | 'Juridica'): void
}>()

watch(
  () => props.isOpen,
  (newVal) => {
    isModalOpen.value = newVal
  }
)

const handleAction = async (action: 'Natural' | 'Juridica') => {
  emit('click', action)
  closeModal()
}

const closeModal = () => {
  isModalOpen.value = false
  emit('update:isOpen', false)
}
</script>

<style scoped lang="scss">
.generator-card {
  width: 640px;
  max-width: 90vw;
}
</style>
