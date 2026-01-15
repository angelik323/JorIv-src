<template>
  <q-dialog v-model="isModalOpen" persistent>
    <q-card
      flat
      bordered
      class="relative v-card-rounded q-px-xl q-pt-xl q-pb-lg custom-nomenclature-card"
    >
      <div class="q-px-lg">
        <div
          class="row items-center justify-between q-col-gutter-md q-px-md q-mb-sm"
        >
          <p class="text-body1 q-ma-none">
            ¿{{ selectedNomenclature?.name || 'Nomenclatura' }} con nombre?
          </p>

          <div class="row q-gutter-sm">
            <q-radio
              v-model="selectedOption"
              val="si"
              label="Si"
              color="orange"
              class="cursor-pointer"
              @update:model-value="handleRadioChange"
            />

            <q-radio
              v-model="selectedOption"
              val="no"
              label="No"
              color="orange"
              class="cursor-pointer"
              @update:model-value="handleRadioChange"
            />
          </div>
        </div>

        <q-separator class="q-mb-lg" color="grey-2" />

        <q-form
          @submit.prevent="handleSubmit"
          ref="customNomenclatureForm"
          class="q-mb-sm"
        >
          <div class="q-mb-sm">
            <p class="text-grey-10 text-weight-medium q-ml-sm q-mb-xs">
              Nombres
            </p>
            <q-input
              v-model="customNomenclatureName"
              outlined
              dense
              type="text"
              label="Inserte"
              :rules="inputRules"
              :disable="selectedOption !== 'si'"
            />
          </div>

          <div class="row justify-center">
            <q-btn
              type="submit"
              size="md"
              rounded
              unelevated
              no-caps
              color="orange"
              class="custom q-px-xl q-py-sm"
              :disable="selectedOption !== 'si'"
            >
              Agregar
            </q-btn>
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { INomenclature } from '@/interfaces/customs/AddressGenerator'
import { ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  selectedNomenclature?: INomenclature
}>()

const emit = defineEmits<{
  (e: 'add', customName: string): void
  (e: 'close'): void
  (e: 'update:isOpen', value: boolean): void
}>()

const isModalOpen = ref(props.isOpen)
const selectedOption = ref<'si' | 'no'>()
const customNomenclatureName = ref('')
const customNomenclatureForm = ref()

// Reglas del input
const inputRules = [
  (val: string) => !!val || 'Campo requerido',
  (val: string) => val.length <= 50 || 'Máximo 50 caracteres',
  (v: string) =>
    /^(?! )[A-Za-zÁÉÍÓÚÜÑñáéíóúü]+(?: [A-Za-zÁÉÍÓÚÜÑñáéíóúü]+)*$/.test(v) ||
    'Solo caracteres alfabéticos',
]

// Handlers
const handleRadioChange = () => {
  if (selectedOption.value === 'no') {
    selectedOption.value = undefined
    closeModal()
  }
}

const handleSubmit = () => {
  customNomenclatureForm.value.validate().then((success: boolean) => {
    if (!success) return
    emit('add', customNomenclatureName.value)
    closeModal()
  })
}

// Watchers
watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) {
      selectedOption.value = undefined
      customNomenclatureName.value = ''
    }
    isModalOpen.value = newVal
  }
)

const closeModal = () => {
  isModalOpen.value = false
  emit('update:isOpen', false)
}
</script>

<style scoped>
.custom-nomenclature-card {
  width: 750px;
  max-width: 90vw;
}
</style>
