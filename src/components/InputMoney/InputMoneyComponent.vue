<template>
  <label v-if="label" :for="inputId" :class="labelClass">
    {{ label }}<span v-if="required" aria-hidden="true">*</span>
  </label>

  <q-input
    ref="inputRef"
    :id="inputId"
    :for="inputId"
    v-model="internalDisplayValue"
    type="text"
    inputmode="decimal"
    :class="class_name"
    :placeholder="placeholder"
    outlined
    dense
    :readonly="readonly"
    :disable="disabled"
    :rules="combinedRules"
    :hide-bottom-space="hide_bottom_space"
    :bottom-slots="!hide_bottom_space"
    :aria-invalid="inputRef?.hasError ? 'true' : 'false'"
    @update:model-value="onInputChange"
  >
    <!-- Símbolo de moneda -->
    <template v-if="!hide_symbol" #prepend>
      <Icon
        :name="utils.defaultIconsLucide.dollarSign"
        :size="20"
        aria-hidden="true"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
// Interfaces
import {
  InputMoneyProps,
  InputMoneyEmits,
} from '@/interfaces/global/MoneyInput'

// Components
import Icon from '@/components/common/Icon/Icon.vue'

// Logic
import useInputMoneyComponent from '@/components/InputMoney/InputMoneyComponent'

// Props
const props = withDefaults(defineProps<InputMoneyProps>(), {
  modelValue: null,
  id: undefined,
  placeholder: 'Inserte',
  label_class: 'text-weight-medium break-word q-ml-sm',
  label_color: 'text-black-50',
  required: false,
  disabled: false,
  readonly: false,
  rules: () => [],
  max_integer_digits: 15,
  max_decimal_digits: 6,
  hide_bottom_space: false,
  hide_symbol: false,
})

// Emits
const emit = defineEmits<InputMoneyEmits>()

const {
  utils,
  inputRef,
  inputId,
  labelClass,
  combinedRules,
  internalDisplayValue,
  onInputChange,
} = useInputMoneyComponent(props, emit)
</script>
