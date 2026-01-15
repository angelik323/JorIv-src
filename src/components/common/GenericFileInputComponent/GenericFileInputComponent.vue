<template>
  <div>
    <label v-if="label" :for="inputFileId" :class="labelClass">
      {{ label }}
      <span v-if="required" aria-hidden="true">*</span>
    </label>

    <div class="q-file-wrapper">
      <q-file
        ref="inputFileRef"
        :id="inputFileId"
        v-model="inputFileProperties.value"
        :class="class_name"
        :disable="disabled"
        :readonly="readonly"
        :rules="rules"
        :hint="hint"
        outlined
        clearable
        dense
        counter
        :multiple="multiple"
        :accept="accept"
        :aria-label="aria_label || undefined"
        :aria-required="required ? 'true' : 'false'"
        :aria-disabled="disabled ? 'true' : 'false'"
        :aria-describedby="hint ? `${inputFileId}-hint` : undefined"
        :aria-invalid="!!inputFileRef?.hasError ? 'true' : 'false'"
        @update:model-value="setValue($event ?? null)"
      >
        <template #after>
          <slot name="after"></slot>
        </template>
      </q-file>

      <div
        v-if="
          placeholder &&
          (!inputFileProperties.value ||
            (Array.isArray(inputFileProperties.value) &&
              inputFileProperties.value.length === 0))
        "
        class="q-file-placeholder"
      >
        {{ placeholder }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileInputValue, GenericFileInputProps } from '@/interfaces/global'
import useGenericFileInputComponent from './GenericFileInputComponent'

const props = withDefaults(defineProps<GenericFileInputProps>(), {
  class_name: 'col-12',
  label_class: 'text-weight-medium break-word q-ml-sm',
  label_color: 'text-black-50',
  default_value: null,
  readonly: false,
  disabled: false,
  required: false,
  hint: '',
  rules: () => [],
  multiple: false,
  accept: '*',
  clearable: false,
  placeholder: '',
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: FileInputValue): void
}>()

const { inputFileProperties, labelClass, inputFileId, inputFileRef, setValue } =
  useGenericFileInputComponent(props, emits)

const resetValidation = () => {
  inputFileRef.value?.resetValidation()
}

const validate = () => {
  const result = inputFileRef.value?.validate()
  return result === true
}

defineExpose({ resetValidation, validate })
</script>

<style src="./GenericFileInputComponent.scss" lang="scss"></style>
