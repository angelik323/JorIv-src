<style lang="scss" scoped src="./RadioYesNo.scss"></style>

<template>
  <div :class="customClass">
    <div :class="hasTitle ? 'col-xs-12 col-sm-9 col-md-9' : 'col-0'">
      <p class="text-black-90 text-h7 mb-0" v-if="hasTitle">{{ title }}</p>
      <p class="text-grey-6 mb-0" v-if="hasSubtitle">{{ subtitle }}</p>
    </div>
    <div
      :class="{
        'col-12': hasTitle,
      }"
    >
      <q-field
        borderless
        hide-bottom-space
        :model-value="modelValue"
        :rules="rules"
      >
        <div
          :class="[classRadio, { hiddenLayer: isDisabled }]"
          v-if="isRadioButton"
        >
          <q-radio
            v-for="option in optionsHandler"
            :key="String(option.value)"
            v-model="selectedValue"
            :val="option.value"
            :label="option.label"
            @change="emitChange"
            :color="color"
            class="custom-radio"
            :disable="isDisabled || option.disabled"
          />
        </div>

        <div v-else-if="isSwitch">
          <SwitchComponent
            :model-value="Boolean(selectedValue)"
            @update:model-value="(val) => (selectedValue = val)"
            color="orange"
            :disable="isDisabled"
          />
        </div>

        <div :class="classCheck" v-else>
          <q-checkbox
            v-if="!multipleCheckBox"
            v-model="selectedValue"
            @update:model-value="(val) => (selectedValue = val)"
            @change="emitChange"
            :color="color"
            class="flex"
            :disable="isDisabled"
            :label="label"
          />

          <q-checkbox
            v-else
            v-for="option in options"
            :key="String(option.value)"
            v-model="selectedValue"
            :val="option.value"
            :label="option.label"
            @change="emitChange"
            :color="color"
            class="flex"
            :disable="isDisabled || option.disabled"
          />
        </div>
      </q-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import SwitchComponent from '@/components/common/Switch/SwitchComponent.vue'

type OptionValue =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | unknown[]
  | null

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object, Array] as PropType<OptionValue>,
    default: null,
  },
  rules: {
    type: Array as PropType<Array<(val: any) => true | string>>,
    default: () => [],
  },
  hasTitle: Boolean,
  title: String,
  hasSubtitle: {
    type: Boolean,
    default: false,
  },
  subtitle: {
    type: String,
    default: '',
  },
  isRadioButton: {
    type: Boolean,
    default: true,
  },
  isSwitch: {
    type: Boolean,
    default: false,
  },
  classRadio: {
    type: String,
    default: 'q-gutter-x-sm row',
  },
  classCheck: {
    type: String,
    default: 'q-gutter-x-sm row justify-center items-center',
  },
  color: {
    type: String,
    default: 'orange',
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  titleRadioTrue: {
    type: String,
    default: 'Sí',
  },
  titleRadioFalse: {
    type: String,
    default: 'No',
  },
  label: {
    type: String,
    default: '',
  },
  options: {
    type: Array as PropType<
      Array<{ label: string; value: OptionValue; disabled?: boolean }>
    >,
    default: [],
  },
  customClass: {
    type: String,
    default: 'row flex items-center',
  },
  multipleCheckBox: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

const optionsHandler = computed(() => {
  if (props.options?.length > 0) {
    return props.options
  } else {
    return [
      { label: props.titleRadioTrue, value: true },
      { label: props.titleRadioFalse, value: false },
    ]
  }
})
const emitChange = () => {
  emit('change', selectedValue.value)
}
</script>
