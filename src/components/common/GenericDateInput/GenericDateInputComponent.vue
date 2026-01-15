<template>
  <label v-if="label" :for="inputId" :class="labelClass">
    {{ label }}<span v-if="required" aria-hidden="true">*</span>
  </label>

  <q-input
    ref="dateInputRef"
    :id="inputId"
    :for="inputId"
    v-model="inputProperties.value"
    class="generic-q-date"
    :class="class_name"
    :placeholder="placeholder"
    :readonly="readonly"
    :disable="disabled"
    :rules="computedRules"
    :hint="hint"
    outlined
    dense
    clearable
    :aria-label="aria_label || undefined"
    :aria-readonly="readonly ? 'true' : 'false'"
    :aria-disabled="disabled ? 'true' : 'false'"
    :aria-required="required ? 'true' : 'false'"
    :aria-describedby="hint ? `${inputId}-hint` : undefined"
    :aria-invalid="!!dateInputRef?.hasError ? 'true' : 'false'"
    :hide-bottom-space="hide_bottom_space"
    @keydown="checkDigit($event, null)"
    @update:model-value="setValue($event)"
  >
    <template #append>
      <Icon :name="defaultIconsLucide.calendar" :size="20" aria-hidden="true" />

      <q-popup-proxy
        ref="qDateInput"
        cover
        transition-show="scale"
        transition-hide="scale"
      >
        <q-date
          v-if="!option_calendar"
          :mask="mask"
          v-model="inputProperties.value"
          :navigation-min-year-month="navigation_min_year_month ?? '1000/01'"
          :navigation-max-year-month="
            navigation_max_year_month ??
            moment().add(5, 'year').format('YYYY/MM')
          "
          :default-view="
            mask === 'YYYY'
              ? 'Years'
              : mask === 'YYYY-MM'
              ? 'Years'
              : 'Calendar'
          "
          :emit-immediately="mask === 'YYYY' || mask === 'YYYY-MM'"
          @update:model-value="setValue($event)"
          @navigation="
            ({ year, month }) => {
              emits('navigation', { year, month })
            }
          "
        >
          <div class="row items-center justify-end">
            <q-btn v-close-popup label="Cerrar" color="indigo-10" flat />
          </div>
        </q-date>
        <q-date
          v-else
          :mask="mask"
          v-model="inputProperties.value"
          no-unset
          :navigation-min-year-month="navigation_min_year_month ?? '1000/01'"
          :navigation-max-year-month="
            navigation_max_year_month ??
            moment().add(5, 'year').format('YYYY/MM')
          "
          :options="option_calendar"
          :default-view="mask === 'YYYY-MM' ? currentView : 'Calendar'"
          :emit-immediately="mask === 'YYYY-MM'"
          @update:model-value="setValue($event)"
          @navigation="
            ({ year, month }) => {
              emits('navigation', { year, month })
            }
          "
        >
        </q-date>
      </q-popup-proxy>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import moment from 'moment'
import Icon from '@/components/common/Icon/Icon.vue'
import { defaultIconsLucide } from '@/utils'
import useGenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent'

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
    disabled?: boolean
    required?: boolean
    hint?: string
    rules: ((val: any) => true | string)[]
    aria_label?: string
    option_calendar?: (date: string) => boolean
    mask?: string
    navigation_max_year_month?: string
    navigation_min_year_month?: string
    hide_bottom_space?: boolean
  }>(),
  {
    class_name: 'col-12',
    label_class: 'text-weight-medium break-word q-ml-sm',
    label_color: 'text-black-50',
    default_value: null,
    placeholder: 'AAAA-MM-DD',
    readonly: false,
    disabled: false,
    required: false,
    mask: 'YYYY-MM-DD',
    hide_bottom_space: false
  }
)

const emits =
  defineEmits<(e: 'update:modelValue' | 'navigation', value: any) => void>()

const {
  setValue,
  inputProperties,
  qDateInput,
  currentView,
  checkDigit,
  labelClass,
  dateInputRef,
  inputId,
  computedRules,
} = useGenericDateInputComponent(props, emits)

defineOptions({
  inheritAttrs: false,
})
</script>
