<template>
  <span
    class="custom-toggles"
    :style="bgStyle"
    role="switch"
    tabindex="0"
    :aria-checked="isChecked ? 'true' : 'false'"
    :aria-readonly="readonly"
    :aria-disabled="disabled"
    test-id="toggle"
    @keyup.enter.prevent="toggle"
    @keyup.space.prevent="toggle"
    @click="toggle"
  >
    <span
      aria-hidden="true"
      :style="dotStyle"
      class="custom-toggles__dot"
      test-id="dot"
    >
      <span
        v-if="checkedText || uncheckedText"
        class="custom-toggles__text"
        :style="textStyle"
        test-id="text"
      >
        {{ isChecked ? checkedText : uncheckedText }}
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { CustomToggleProps } from '@/interfaces/global'
import useCustomToggle from '@/components/common/CustomToggle/CustomToggle'

const props = withDefaults(defineProps<CustomToggleProps>(), {
  modelValue: undefined,
  value: undefined,
  width: 75,
  height: 25,
  dotColor: '#FFFFFF',
  dotSize: 0,
  uncheckedBg: '#D9DCE3',
  checkedBg: '#FFEEE3',
  uncheckedTextColor: '#000',
  checkedTextColor: '#000',
  uncheckedText: '',
  checkedText: '',
  fontSize: 15,
  fontWeight: 'normal',
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'click', currentValue: boolean): void
}>()

const { isChecked, bgStyle, dotStyle, textStyle, toggle } = useCustomToggle(
  props,
  emits
)
</script>

<style lang="scss" src="./CustomToggle.scss" />
