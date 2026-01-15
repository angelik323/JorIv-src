<template>
  <div class="phone-selector row q-col-gutter-xs">
    <!-- Selector de país -->
    <div class="col-2">
      <q-select
        class="fixed-size-select"
        outlined
        v-model="inputProperties.value_country"
        :options="phonesCountriesCopy"
        dense
        emit-value
        auto_complete
        map_options
        menu-class="custom-dropdown"
        :hide-dropdown-icon="true"
      >
        <template #option="scope">
          <q-item v-bind="scope.itemProps" class="custom-option">
            <q-item-section avatar>
              <img :src="scope.opt.flag" width="24" height="16" alt="flag" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.code }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <template #selected-item="scope">
          <div class="flex items-center gap-4">
            <img :src="scope.opt.flag" class="circle-img" alt="flag" />
          </div>
        </template>
      </q-select>
    </div>

    <!-- Campo de teléfono -->
    <div class="col-10">
      <q-input
        ref="inputRef"
        :key="inputProperties.value_country?.code"
        v-model="inputProperties.value"
        outlined
        dense
        :mask="
          inputProperties.value_country?.phoneMask ??
          phonesCountriesCopy.find((c: any) => c.code === '+57')?.phoneMask
        "
        :required="required"
        :rules="required ? [...rules, validatePhone] : []"
        @update:model-value="setValue($event ?? '')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, reactive } from 'vue'
import { useResourceStore } from '@/stores'

const props = withDefaults(
  defineProps<{
    validate_format?: boolean
    clean_value?: boolean
    rules?: ((val: string) => true | string)[]
    default_value: string | null
    required?: boolean
    country_validation?: boolean
    showColombia?: boolean
  }>(),
  {
    validate_format: false,
    clean_value: false,
    rules: () => [],
    default_value: null,
    required: true,
    country_validation: false,
    showColombia: true,
  }
)

// Emits
const emits =
  defineEmits<
    (
      e:
        | 'update:modelValue'
        | 'click:appendIcon'
        | 'click:prependIcon'
        | 'update:focus'
        | 'update:blur',
      value: any
    ) => void
  >()

defineExpose({
  resetValidation: () => inputRef.value?.resetValidation(),
})

const { phones_countries } = useResourceStore('v1')
const phonesCountriesCopy = ref(
  !props.showColombia
    ? phones_countries.filter((item) => item.code !== '+57')
    : [...phones_countries]
)

const inputRef = ref()

const inputProperties = ref<{
  disable: boolean
  value: any
  value_country: any
}>({
  disable: false,
  value: null,
  value_country: null,
})
const countryValidation = reactive<
  Record<string, (val: string) => true | string>
>({
  '+57': (val: string) =>
    val.startsWith('60') || 'El número debe comenzar con 60',
})

const setInitialValues = () => {
  const match = props.default_value?.trim().match(/\((\+\d+)\)\s*([\d\s]+)/)

  if (match && match[1].length > 2 && match[2].length >= 8) {
    inputProperties.value.value_country =
      phonesCountriesCopy.value.find((c) => c.code === match[1]) ||
      phonesCountriesCopy.value[0]

    inputProperties.value.value = match[2]
  } else {
    if (match) {
      inputProperties.value.value_country =
        phonesCountriesCopy.value.find((c) => c.code === match[1]) ||
        phonesCountriesCopy.value[0]

      inputProperties.value.value = match[2]
    } else {
      inputProperties.value.value_country = props.showColombia
        ? phonesCountriesCopy.value.find((c) => c.code === '+57')?.code
        : phonesCountriesCopy.value.find((c) => c.code === '+1')?.code

      inputProperties.value.value = ''
    }
  }
}

onMounted(() => {
  if (props.default_value) {
    setInitialValues()
  }

  setTimeout(() => {
    if (!inputProperties.value.value_country) {
      inputProperties.value.value_country = props.showColombia
        ? phonesCountriesCopy.value[48]
        : phonesCountriesCopy.value[phonesCountriesCopy.value.length - 14]
    }
  }, 500)
})

watch(
  () => props.default_value,
  () => {
    setInitialValues()
  }
)

const setValue = (value: string | number) => {
  emits(
    'update:modelValue',
    `(${inputProperties.value.value_country.code})${value?.toString().trim()}`
  )
}

const validatePhone = (val: string | number) => {
  const phoneValueLength = val.toString().length
  const countryCode = inputProperties.value.value_country?.code

  // Validación de longitud
  const phoneMaskLength = String(
    inputProperties.value.value_country?.phoneMask
  ).length

  const phoneMaskLengthWithoutSpaces = String(
    inputProperties.value.value_country?.phoneMask
  ).replace(/\s+/g, '').length

  if (
    props.country_validation &&
    countryValidation &&
    countryValidation[countryCode]
  ) {
    return countryValidation[countryCode](val.toString())
  }

  if (phoneValueLength !== phoneMaskLength) {
    return `Debe contener ${phoneMaskLengthWithoutSpaces} caracteres`
  }

  return true
}
</script>

<style scoped>
.fixed-size-select {
  width: 100%;
}
.circle-img {
  width: 24px;
  height: 16px;
  border-radius: 4px;
}
</style>
