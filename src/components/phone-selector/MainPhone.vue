<template>
  <div class="phone-selector row q-col-gutter-xs">
    <div class="col-2">
      <q-select
        class="fixed-size-select"
        outlined
        v-model="selectedCountry"
        :options="phones_countries"
        dense
        emit-value
        map-options
        @update:model-value="updateCountry"
        menu-class="custom-dropdown"
        :hide-dropdown-icon="true"
      >
        <template #option="scope">
          <q-item v-bind="scope.itemProps" class="custom-option">
            <q-item-section avatar>
              <img :src="scope.opt.flag" width="24" height="16" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.code }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <template #selected-item="scope">
          <div class="flex items-center gap-4">
            <img :src="scope.opt.flag" class="circle-img" />
          </div>
        </template>
      </q-select>
    </div>

    <div class="col-10">
      <q-input
        v-model="phoneNumber"
        outlined
        dense
        :mask="selectedCountry?.phoneMask"
        required
        type="tel"
        :rules="[
          ...(props.rules ?? []),
          (val: string) =>
            val.length === String(selectedCountry?.phoneMask)?.length ||
            'Debe contener ' +
              String(selectedCountry?.phoneMask)?.replace(/\s+/g, '').length +
              ' caracteres',
        ]"
        @update:model-value="setValue($event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useResourceStore } from '@/stores'

const props = withDefaults(
  defineProps<{
    phoneNumber?: string | null | undefined
    code_country?: string
    validate_format?: boolean
    clean_value?: boolean
    rules?: ((val: any) => true | string)[]
  }>(),
  {
    code_country: '+57',
    validate_format: false,
    clean_value: false,
    rules: () => [(val: any) => !!val || 'El campo es requerido'],
  }
)

const emit = defineEmits(['update:phoneNumber', 'update:selectedCountry'])

const { phones_countries } = useResourceStore('v1')

const selectedCountry = ref()

const matchPhoneNumber = props.phoneNumber
  ?.replace(/\s+/g, '')
  .match(/\((\+\d+)\)(\d+)/)

const phoneNumber = ref(matchPhoneNumber ? matchPhoneNumber[2] : '')

onMounted(() => {
  selectedCountry.value =
    phones_countries.find((c) => c.code === props.code_country) ||
    phones_countries[0]
  emit('update:selectedCountry', selectedCountry.value)
})

const setValue = (valueModify: any) => {
  // emit('update:selectedCountry', selectedCountry.value)

  if (props.validate_format) {
    const regex = /\((\+\d+)\)(\d+)/
    const match = props.phoneNumber?.replace(/\s+/g, '').match(regex)

    selectedCountry.value =
      phones_countries.find((c) => c.code === match?.[1]) ?? phones_countries[0]
  }

  emit('update:phoneNumber', `(${selectedCountry.value.code})${valueModify}`)
}

watch(
  () => props.clean_value,
  (val) => {
    phoneNumber.value = val ? '' : phoneNumber.value
  }
)

const updateCountry = (country: any) => {
  selectedCountry.value = country
  emit('update:selectedCountry', country)
}
</script>
<style lang="scss" src="./MainPhone.scss" />
