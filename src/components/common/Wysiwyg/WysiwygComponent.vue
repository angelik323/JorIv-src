<template>
  <label v-if="label" :for="editorId" :class="labelClass">
    {{ label }}<span v-if="required" aria-hidden="true">*</span>
  </label>

  <q-editor
    ref="editorRef"
    :id="editorId"
    :for="editorId"
    v-model="editorProperties.value"
    :class="class_name"
    :placeholder="placeholder"
    :readonly="readonly"
    :disable="disabled"
    :rules="rules"
    :hint="hint"
    :lazy-rules="lazy_rules"
    :hide-bottom-space="hide_bottom_space"
    :bottom-slots="!hide_bottom_space"
    :toolbar="computedToolbar"
    :height="height"
    :min-height="min_height"
    :max-height="max_height"
    outlined
    dense
    :aria-label="aria_label || undefined"
    :aria-readonly="readonly ? 'true' : 'false'"
    :aria-disabled="disabled ? 'true' : 'false'"
    :aria-required="required ? 'true' : 'false'"
    :aria-describedby="hint ? `${editorId}-hint` : undefined"
    :debounce="debounce"
    :aria-invalid="!!editorRef?.hasError ? 'true' : 'false'"
    @click="emits('click', editorProperties.value)"
    @focus="emits('update:focus', editorProperties.value)"
    @blur="emits('update:blur', editorProperties.value)"
    @update:model-value="setValue($event ?? '')"
  >
    <template #after>
      <slot name="after"></slot>
    </template>
  </q-editor>
</template>

<script setup lang="ts">
// logic
import useWysiwygComponent from '@/components/common/Wysiwyg/WysiwygComponent'

const props = withDefaults(
  defineProps<{
    id?: string
    class_name?: string
    label?: string
    label_class?: string
    label_color?: string
    default_value: string | null | undefined
    placeholder?: string
    readonly?: boolean
    lazy_rules?: boolean
    hide_bottom_space?: boolean
    disabled?: boolean
    required?: boolean
    hint?: string
    rules?: ((
      val: string | null | undefined
    ) => true | string | Promise<true | string>)[]
    aria_label?: string
    debounce?: number | string
    height?: string
    min_height?: string
    max_height?: string
    toolbar?: Array<Array<string>>
  }>(),
  {
    class_name: 'col-12',
    label_class: 'text-weight-medium break-word q-ml-sm',
    label_color: 'text-grey-7',
    default_value: null,
    lazy_rules: false,
    hide_bottom_space: false,
    placeholder: 'Inserte',
    readonly: false,
    disabled: false,
    required: false,
    hint: undefined,
    rules: () => [],
    debounce: 0,
    height: '150px',
    min_height: '100px',
    max_height: '400px',
    toolbar: undefined,
  }
)

const emits =
  defineEmits<
    (
      e: 'click' | 'update:modelValue' | 'update:focus' | 'update:blur',
      value: any
    ) => void
  >()

const {
  editorProperties,
  labelClass,
  editorId,
  editorRef,
  computedToolbar,
  setValue,
} = useWysiwygComponent(props, emits)

const resetValidation = () => {
  editorRef.value?.resetValidation()
}

const validate = () => {
  const result = editorRef.value?.validate()
  return result === true
}

defineExpose({ resetValidation, validate })
</script>

<style
  type="scss"
  src="@/components/common/Wysiwyg/WysiwygComponent.scss"
  scoped
/>
