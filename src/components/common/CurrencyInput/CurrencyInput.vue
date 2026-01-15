<template>
  <label v-if="inputLabel" :for="inputId" :class="labelClass">
    {{ inputLabel }}<span v-if="required" aria-hidden="true">*</span>
  </label>

  <q-input
    ref="inputRef"
    v-model="formattedValue"
    :id="inputId"
    :for="inputId"
    :class="class_name"
    :placeholder="placeholder"
    :hint="hint"
    outlined
    dense
    :disable="disabled"
    :readonly="onlyRead"
    :rules="rules ?? []"
    :aria-label="aria_label || undefined"
    :aria-disabled="disabled ? 'true' : 'false'"
    :aria-readonly="onlyRead ? 'true' : 'false'"
    :aria-required="required ? 'true' : 'false'"
    :aria-describedby="hint ? `${inputId}-hint` : undefined"
    :aria-invalid="!!inputRef?.hasError ? 'true' : 'false'"
  >
    <template #prepend v-if="!hideIcon">
      <Icon
        :name="defaultIconsLucide.dollarSign"
        :size="20"
        aria-hidden="true"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, onMounted, nextTick, watch } from 'vue'
import { CurrencyDisplay, useCurrencyInput } from 'vue-currency-input'
import { uid } from 'quasar'
import Icon from '@/components/common/Icon/Icon.vue'
import { defaultIconsLucide } from '@/utils'

const props = withDefaults(
  defineProps<{
    modelValue: number | string | null | undefined
    id?: string
    label?: string
    currencyLabel?: string
    placeholder?: string
    hint?: string
    class_name?: string
    label_class?: string
    label_color?: string
    aria_label?: string
    required?: boolean
    disabled?: boolean
    onlyRead?: boolean
    rules?: ((val: any) => true | string)[]
    currency?: string
    hideIcon?: boolean
    precision?: number
  }>(),
  {
    placeholder: 'Inserte',
    label_class: 'text-weight-medium break-word q-ml-sm',
    label_color: 'text-grey-7',
    required: false,
    disabled: false,
    onlyRead: false,
    currency: 'COP',
    hideIcon: false,
    precision: 2,
  }
)

const { inputRef, formattedValue, setValue, setOptions } = useCurrencyInput({
  currency: props.currency,
  currencyDisplay: CurrencyDisplay.hidden,
  locale: 'es-CO',
  precision: props.precision,
})

const inputLabel = computed(() => props.label || props.currencyLabel)
const labelClass = computed(() =>
  `${props.label_class} ${props.label_color}`.trim()
)

// ID único para el input
const inputId = computed(() => props.id || `input-${uid()}`)

const handleConversion = (value: number | string | null | undefined) => {
  // Caso 1: Valor null o undefined
  if (value === null || value === undefined) return null

  // Caso 2: Valor numérico directo
  if (typeof value === 'number') {
    return Number.isNaN(value) ? null : value
  }

  // Caso 3: String vacío o no numérico
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '') return null
    const numericPattern = /^[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/
    return numericPattern.test(trimmed) ? Number(trimmed) : null
  }

  return null
}

onMounted(async () => {
  await nextTick()
  inputRef.value?.resetValidation()
})

watch(
  () => props.modelValue,
  (value) => {
    setValue(handleConversion(value))
  }
)

watch(
  () => props.currency,
  (currency) => {
    setOptions({
      currency,
      currencyDisplay: CurrencyDisplay.hidden,
      hideCurrencySymbolOnFocus: true,
      accountingSign: false,
    })
  }
)
</script>
