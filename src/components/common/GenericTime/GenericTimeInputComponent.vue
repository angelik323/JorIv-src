<script setup lang="ts">
import Icon from '@/components/common/Icon/Icon.vue'
import { defaultIconsLucide } from '@/utils'
import useGenericTimeInputComponent from '@/components/common/GenericTime/GenericTimeInputComponent'

// Props
const props = withDefaults(
  defineProps<{
    id?: string
    class_name?: string
    label?: string
    label_class?: string
    label_color?: string
    default_value: string | null
    placeholder?: string
    readonly?: boolean
    disabled?: boolean
    required?: boolean
    hint?: string
    rules: ((val: any) => true | string)[]
    aria_label?: string
    now_btn?: boolean
  }>(),
  {
    label_class: 'text-weight-medium break-word q-ml-sm',
    label_color: 'text-black-50',
    default_value: null,
    placeholder: '00:00',
    readonly: false,
    disabled: false,
    required: false,
    now_btn: false,
  }
)

const emits = defineEmits<(e: 'update:modelValue', value: any) => void>()

const {
  inputProperties,
  valid_format_time,
  labelClass,
  timeInputRef,
  inputId,
  setValue,
} = useGenericTimeInputComponent(props, emits)

defineExpose({
  validate: () => timeInputRef.value?.validate(),
})
</script>

<template>
  <label v-if="label" :for="inputId" :class="labelClass">
    {{ label }}<span v-if="required" aria-hidden="true">*</span>
  </label>

  <q-input
    ref="timeInputRef"
    :id="inputId"
    :for="inputId"
    v-model="inputProperties.value"
    :placeholder="placeholder"
    :readonly="readonly"
    :disable="disabled"
    :rules="required ? [...rules, (v: string) => valid_format_time(v)] : []"
    :hint="hint"
    outlined
    dense
    clearable
    mask="time"
    :aria-label="aria_label || undefined"
    :aria-readonly="readonly ? 'true' : 'false'"
    :aria-disabled="disabled ? 'true' : 'false'"
    :aria-required="required ? 'true' : 'false'"
    :aria-describedby="hint ? `${inputId}-hint` : undefined"
    :aria-invalid="!!timeInputRef?.hasError ? 'true' : 'false'"
    @keydown.prevent
    @paste.prevent
    @drop.prevent
    @update:model-value="setValue($event)"
  >
    <template #append>
      <Icon :name="defaultIconsLucide.clock" :size="20" aria-hidden="true" />

      <q-popup-proxy
        ref="qTimeInput"
        cover
        transition-show="scale"
        transition-hide="scale"
      >
        <q-time
          v-model="inputProperties.value"
          :format24h="true"
          color="primary_fiduciaria"
          text-color="white"
          header-class="bg-primary text-h4"
          :now-btn="now_btn"
          @update:model-value="setValue($event)"
        >
          <div class="row items-center justify-end">
            <q-btn
              v-close-popup
              label="Cerrar"
              color="primary_fiduciaria"
              flat
              aria-label="Cerrar selección de hora"
            />
          </div>
        </q-time>
      </q-popup-proxy>
    </template>
  </q-input>
</template>
