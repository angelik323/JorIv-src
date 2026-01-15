<script setup lang="ts">
// Props
const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    class_name?: string
    label_class?: string
    label_color?: string
    option_calendar?: string
    auto_complete?: boolean
    display_value?: string
    display_label?: string
    multiple?: boolean
    required: boolean
    placeholder?: string
    prepend_icon?: string
    append_icon?: string
    return_object?: boolean
    manual_option?: any[]
    map_options?: boolean
    first_filter_option?: string
    second_filter_option?: string
    disabled?: boolean
    readonly?: boolean
    default_value: string | number | object | null | boolean | undefined
    filter_request?: object
    without_filters?: object
    auto_focus?: boolean
    rules: ((val: any) => true | string)[]
    clearable?: boolean
    class_custom_popup?: string
    show_as_checkbox?: boolean
    should_slice_options?: boolean
    match_mode?: 'partial' | 'exact'
    hide_bottom_space?: boolean
    custom_selection_label?: string | Function
    use_advanced_filter?: boolean
  }>(),
  {
    auto_complete: true,
    class_name: 'col-12',
    display_value: 'value',
    display_label: 'label',
    multiple: false,
    required: false,
    placeholder: 'Seleccione',
    label_class: 'text-weight-medium break-word q-ml-sm',
    label_color: 'text-black-50',
    return_object: false,
    first_filter_option: 'label',
    second_filter_option: 'value',
    disabled: false,
    readonly: false,
    default_value: null,
    auto_focus: false,
    manual_option: [] as never,
    clearable: true,
    show_as_checkbox: false,
    should_slice_options: true,
    rules: () => [],
    match_mode: 'partial',
    hide_bottom_space: false,
    use_advanced_filter: false,
  }
)

// Emits
const emits = defineEmits<{
  (event: 'click', value: any): void
  (event: 'update:modelValue', value: any): void
  (event: 'update:focus', value: boolean): void
  (event: 'update:blur', value: boolean): void
  (event: 'update:keyup', value: KeyboardEvent): void
}>()

// Logic View
import { useUtils } from '@/composables'
import useGenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent'
import Icon from '@/components/common/Icon/Icon.vue'

// Imports variables
const {
  setValue,
  selectorProperties,
  genericSelectorRef,
  labelClass,
  inputId,
  filterOptionV2,
} = useGenericSelectorComponent(props, emits)

const resetValidation = () => {
  genericSelectorRef.value?.resetValidation()
}

defineExpose({
  resetValidation,
})
</script>

<template>
  <label
    v-if="label"
    :id="inputId + '-label'"
    :for="inputId"
    :class="labelClass"
  >
    {{ label }}<span v-if="required" aria-hidden="true">*</span>
  </label>
  
  <q-select
    v-if="!auto_complete"
    ref="genericSelectorRef"
    :id="inputId"
    :for="inputId"
    outlined
    class="generic-selector"
    :class="class_name"
    :popup-content-class="`custom-popup-content ${class_custom_popup}`"
    v-model="selectorProperties.value"
    :options="selectorProperties.options"
    :option-value="display_value"
    :option-label="display_label"
    dense
    emit-value
    map-options
    :loading="selectorProperties.loading"
    :disable="selectorProperties.disable"
    :readonly="readonly"
    :clearable="true"
    :use-input="auto_complete"
    :multiple="multiple"
    :use-chips="multiple ? true : false"
    :placeholder="
      !selectorProperties.value && typeof selectorProperties.value != 'boolean'
        ? placeholder
        : ''
    "
    :rules="rules"
    :autofocus="auto_focus"
    :hide-bottom-space="hide_bottom_space"
    :aria-required="required"
    :aria-disabled="disabled"
    :aria-labelledby="label ? inputId + '-label' : undefined"
    @focus="emits('update:focus', selectorProperties.value)"
    @blur="emits('update:blur', selectorProperties.value)"
    @keyup="emits('update:keyup', $event)"
    @update:model-value="setValue($event)"
  >
    <template v-if="props.custom_selection_label" #selected-item="scope">
      {{ typeof props.custom_selection_label === 'function' ? props.custom_selection_label(scope.opt) : scope.opt[props.custom_selection_label] }}
    </template>
    <template v-if="prepend_icon" v-slot:prepend>
      <q-icon :name="prepend_icon" />
    </template>
    <template v-if="append_icon" v-slot:append>
      <q-icon :name="append_icon" />
    </template>
    <template
      v-if="
        (selectorProperties.value === undefined ||
          selectorProperties.value === null) &&
        typeof selectorProperties.value != 'boolean'
      "
      v-slot:selected
    >
      <div class="text-black-6">
        {{ placeholder }}
      </div>
    </template>
  </q-select>

  <q-select
    v-else
    ref="genericSelectorRef"
    :id="inputId"
    :for="inputId"
    outlined
    class="generic-selector"
    :class="class_name"
    :popup-content-class="`custom-popup-content ${class_custom_popup}`"
    v-model="selectorProperties.value"
    :options="selectorProperties.options"
    :option-value="display_value"
    :option-label="display_label"
    dense
    :loading="selectorProperties.loading"
    :disable="selectorProperties.disable"
    :readonly="readonly"
    :emit-value="!return_object"
    :map-options="map_options"
    :clearable="true"
    :use-input="auto_complete && (!selectorProperties.value || multiple)"
    :multiple="multiple"
    :use-chips="multiple ? true : false"
    :placeholder="
      !selectorProperties.value && typeof selectorProperties.value != 'boolean'
        ? placeholder
        : ''
    "
    :rules="rules"
    :autofocus="auto_focus"
    :hide-bottom-space="hide_bottom_space"
    :aria-required="required"
    :aria-disabled="disabled"
    :aria-labelledby="label ? inputId + '-label' : undefined"
    @filter="filterOptionV2"
    @focus="emits('update:focus', selectorProperties.value)"
    @blur="emits('update:blur', selectorProperties.value)"
    @keyup="emits('update:keyup', $event)"
    @update:model-value="setValue($event)"
  >
    <template v-if="props.custom_selection_label" #selected-item="scope">
      {{ typeof props.custom_selection_label === 'function' ? props.custom_selection_label(scope.opt) : scope.opt[props.custom_selection_label] }}
    </template>
    <template v-if="prepend_icon" v-slot:prepend>
      <q-icon :name="prepend_icon" />
    </template>
    <template v-if="append_icon" v-slot:append>
      <q-icon :name="append_icon" />
    </template>
    <template
      v-if="multiple && show_as_checkbox"
      #option="{ itemProps, opt, selected, toggleOption }"
    >
      <q-item v-bind="itemProps">
        <q-item-section side>
          <q-checkbox
            :model-value="selected"
            @update:model-value="toggleOption(opt)"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          <p class="mb-0 text-center row items-center justify-center q-gutter-sm">
            <div>
              <Icon :name="useUtils().defaultIconsLucide.magnify" :size="20" />
            </div>
            <p class="mb-0">No hay datos para mostrar</p>
          </p>
        </q-item-section>
      </q-item>
    </template>
    <slot v-if="multiple" name="multipleOptions"></slot>
  </q-select>
</template>
