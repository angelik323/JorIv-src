<template>
  <label v-if="label" :for="inputId" :class="labelClass">
    {{ label }}<span v-if="required" aria-hidden="true">*</span>
  </label>

  <q-select
    ref="checkboxSelectorRef"
    :id="inputId"
    :for="inputId"
    :model-value="internalValue"
    :class="class_name"
    :placeholder="displayPlaceholder"
    :readonly="readonly"
    :disable="disabled"
    multiple
    outlined
    dense
    clearable
    input-debounce="300"
    :use-input="auto_complete"
    :use-chips="show_selected_chips"
    :options="filteredOptions"
    :loading="loading"
    :option-label="display_label"
    :option-value="display_value"
    popup-content-class="custom-popup-content"
    :aria-label="aria_label || undefined"
    :aria-readonly="readonly ? 'true' : 'false'"
    :aria-disabled="disabled ? 'true' : 'false'"
    :aria-required="required ? 'true' : 'false'"
    :aria-invalid="!!checkboxSelectorRef?.hasError ? 'true' : 'false'"
    @focus="emit('update:focus', internalValue)"
    @blur="emit('update:blur', internalValue)"
    @keyup="onKeyup"
    @clear="clearAll"
    @keypress="onKeyPress"
  >
    <template v-slot:option="scope">
      <q-item @click.stop="toggleOption(scope.opt)" class="q-hoverable">
        <q-item-section avatar>
          <q-checkbox
            :color="color"
            :model-value="isSelected(scope.opt)"
            @click.stop="toggleOption(scope.opt)"
          />
        </q-item-section>
        <q-item-section>
          {{ scope.opt[display_label] }}
        </q-item-section>
      </q-item>
    </template>

    <template v-if="show_selected_chips" v-slot:selected>
      <q-chip
        v-for="opt in internalValue"
        :key="opt[display_value] as string | number"
        outline
        removable
        @remove="removeOption(opt)"
        :color="color"
        :text-color="color"
      >
        {{ opt[display_label] }}
      </q-chip>
    </template>

    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey-7">
          <p class="mb-0 text-center">No hay datos para mostrar</p>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { IGenericCheckboxSelector, IGenericOption } from '@/interfaces/customs'
import useGenericCheckboxSelector from './GenericCheckboxSelector'

const props = withDefaults(
  defineProps<IGenericCheckboxSelector<IGenericOption>>(),
  {
    modelValue: () => [],
    options: () => [],
    label_class: 'text-weight-medium break-word q-ml-sm',
    label_color: 'text-black-50',
    placeholder: 'Seleccione',
    readonly: false,
    disabled: false,
    required: false,
    display_label: 'name',
    display_value: 'id',
    class_name: 'col-12',
    auto_complete: true,
    color: 'orange',
    show_selected_chips: true,
    loading: false,
  }
)

const emit = defineEmits<{
  (event: 'update:focus', value: IGenericOption[]): void
  (event: 'update:blur', value: IGenericOption[]): void
  (event: 'update:keyup', value: KeyboardEvent): void
  (event: 'search', value: string): void
  (event: 'change', value: IGenericOption[]): void
  (event: 'update:modelValue', value: IGenericOption[]): void
}>()

const {
  displayPlaceholder,
  filteredOptions,
  internalValue,
  labelClass,
  inputId,
  checkboxSelectorRef,
  toggleOption,
  removeOption,
  isSelected,
  onKeyup,
  clearAll,
  onKeyPress,
} = useGenericCheckboxSelector(props, emit)
</script>
