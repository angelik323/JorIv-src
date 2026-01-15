<template>
  <label v-if="label" :for="inputId" :class="labelClass">
    {{ label }}<span v-if="required" aria-hidden="true">*</span>
  </label>

  <q-input
    ref="inputRef"
    :id="inputId"
    :for="inputId"
    v-model="inputProperties.value"
    :class="class_name"
    :type="type || 'text'"
    :placeholder="placeholder"
    :readonly="readonly"
    :disable="disabled"
    :maxlength="max_length"
    :min="min_value"
    :max="max_value"
    :rules="rules"
    :hint="hint"
    :lazy-rules="lazy_rules"
    :hide-bottom-space="hide_bottom_space"
    :bottom-slots="!hide_bottom_space"
    outlined
    dense
    :autogrow="autogrow"
    :aria-label="aria_label || undefined"
    :aria-readonly="readonly ? 'true' : 'false'"
    :aria-disabled="disabled ? 'true' : 'false'"
    :aria-required="required ? 'true' : 'false'"
    :aria-describedby="hint ? `${inputId}-hint` : undefined"
    :debounce="debounce"
    :aria-invalid="!!inputRef?.hasError ? 'true' : 'false'"
    @click="emits('click', inputProperties.value)"
    @focus="emits('update:focus', inputProperties.value)"
    @blur="emits('update:blur', inputProperties.value)"
    @keydown="
      type === 'number' ? checkDigit($event, additional_characters) : undefined
    "
    @update:model-value="setValue($event ?? '')"
  >
    <template v-if="prepend_icon" #prepend>
      <Button
        v-if="prepend_clickable"
        class-custom="q-pa-sm"
        flat
        size="md"
        color="orange"
        :left-icon="prepend_icon"
        :outline="false"
        :aria-label="prepend_aria_label"
        @keydown.enter.prevent="$emit('click:prependIcon', true)"
        @keydown.space.prevent="$emit('click:prependIcon', true)"
        @click="$emit('click:prependIcon', true)"
      />

      <Icon v-else :name="prepend_icon" :size="20" aria-hidden="true" />
    </template>

    <template v-if="append_icon" #append>
      <Button
        v-if="append_clickable"
        class-custom="q-pa-sm"
        flat
        size="md"
        color="orange"
        :left-icon="append_icon"
        :outline="false"
        :aria-label="append_aria_label"
        @keydown.enter.prevent="$emit('click:appendIcon', true)"
        @keydown.space.prevent="$emit('click:appendIcon', true)"
        @click="$emit('click:appendIcon', true)"
      />

      <Icon v-else :name="append_icon" :size="20" aria-hidden="true" />
    </template>

    <template #after>
      <slot name="after"></slot>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import Icon from '@/components/common/Icon/Icon.vue'
import { checkDigit } from '@/utils'
import useGenericInputComponent from '@/components/common/GenericInput/GenericInputComponent'

const props = withDefaults(
  defineProps<{
    id?: string
    class_name?: string
    label?: string
    label_class?: string
    label_color?: string
    default_value: string | number | object | null | boolean | undefined
    type?:
      | 'number'
      | 'date'
      | 'search'
      | 'file'
      | 'textarea'
      | 'time'
      | 'text'
      | 'email'
      | 'url'
      | 'password'
      | 'tel'
      | 'datetime-local'
    placeholder?: string
    readonly?: boolean
    lazy_rules?: boolean
    hide_bottom_space?: boolean
    disabled?: boolean
    required?: boolean
    max_length?: string
    hint?: string
    min_value?: number
    max_value?: number
    rules?: ((val: any) => true | string | Promise<true | string>)[]
    additional_characters?: string
    aria_label?: string
    prepend_icon?: string
    append_icon?: string
    prepend_clickable?: boolean
    append_clickable?: boolean
    prepend_aria_label?: string
    append_aria_label?: string
    debounce?: number | string
    autogrow?: boolean
  }>(),
  {
    class_name: 'col-12',
    label_class: 'text-weight-medium break-word q-ml-sm',
    label_color: 'text-black-50',
    default_value: null,
    lazy_rules: false,
    hide_bottom_space: false,
    type: 'text',
    placeholder: 'Inserte',
    readonly: false,
    disabled: false,
    required: false,
    max_length: '10000',
    hint: undefined,
    additional_characters: '',
    prepend_clickable: false,
    append_clickable: false,
    prepend_aria_label: 'Botón izquierdo',
    append_aria_label: 'Botón derecho',
    rules: () => [],
    debounce: 0,
    autogrow: false
  }
)

const emits =
  defineEmits<
    (
      e:
        | 'click'
        | 'update:modelValue'
        | 'click:appendIcon'
        | 'click:prependIcon'
        | 'update:focus'
        | 'update:blur',
      value: any
    ) => void
  >()

const { inputProperties, labelClass, inputId, inputRef, setValue } =
  useGenericInputComponent(props, emits)

const resetValidation = () => {
  inputRef.value?.resetValidation()
}

const validate = () => {
  const result = inputRef.value?.validate()
  return result === true
}

defineExpose({ resetValidation, validate })
</script>
