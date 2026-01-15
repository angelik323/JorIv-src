<template>
  <div>
    <q-input
      v-model="internalValue"
      readonly
      outlined
      type="text"
      dense
      :placeholder="placeholder"
      :rules:="rules ?? undefined"
      :required="required"
      @click="openModal"
    >
      <template v-if="icon" v-slot:prepend>
        <q-icon :name="icon" />
      </template>
    </q-input>

    <AddressGenerator
      v-model:is-open="isModalOpen"
      :address-only="address_only"
      :required="required"
      @save="handleSaveAddress"
    />
  </div>
</template>

<script setup lang="ts">
import { ILocation } from '@/interfaces/customs/AddressGenerator'
import { computed, ref } from 'vue'
import AddressGenerator from './AddressGenerator.vue'

const props = withDefaults(
  defineProps<{
    modelValue: any
    type?: string
    icon?: string
    placeholder?: string
    dense?: boolean
    rules?: ((val: any) => true | string)[]
    required?: boolean
    address_only?: boolean
  }>(),
  {
    type: 'text',
    icon: 'mdi-map-marker-outline',
    placeholder: 'Ingrese dirección',
    dense: false,
    required: false,
    address_only: true,
  }
)
const isModalOpen = ref(false)

const emit = defineEmits(['update:modelValue'])
const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const openModal = () => {
  isModalOpen.value = true
}

const handleSaveAddress = (location: ILocation) => {
  internalValue.value = location.address
}
</script>
