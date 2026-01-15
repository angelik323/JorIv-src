import { computed, ref, watchEffect } from 'vue'
import { CustomToggleProps } from '@/interfaces/global'

const useCustomToggle = (props: CustomToggleProps, emits: Function) => {
  const PADDING = 8
  const MARGIN = 5
  const TEXT_OFFSET = 3

  const isChecked = ref(Boolean(props.value ?? props.modelValue))

  const bgStyle = computed(() => {
    const styles = {
      width: `${props.width}px`,
      height: `${props.height}px`,
      background: isChecked.value ? props.checkedBg : props.uncheckedBg,
      opacity: props.disabled ? '0.5' : '1',
      cursor: !props.disabled ? 'pointer' : 'not-allowed',
    }

    return styles
  })

  const dotStyle = computed(() => {
    const dotDimension = props.dotSize || props.height - PADDING

    const styles = {
      background: props.dotColor,
      width: `${dotDimension}px`,
      height: `${dotDimension}px`,
      'min-width': `${dotDimension}px`,
      'min-height': `${dotDimension}px`,
      'margin-left': isChecked.value
        ? `${props.width - dotDimension - TEXT_OFFSET}px`
        : `${MARGIN}px`,
    }

    if (isChecked.value) {
      if (props.reverse) {
        styles['margin-left'] = `${MARGIN}px`
      } else {
        styles['margin-left'] = `${props.width - dotDimension - TEXT_OFFSET}px`
      }
    } else {
      if (props.reverse) {
        styles['margin-left'] = `${props.width - dotDimension - TEXT_OFFSET}px`
      } else {
        styles['margin-left'] = `${MARGIN}px`
      }
    }

    return styles
  })

  const textStyle = computed(() => {
    const styles = {
      'font-weight': props.fontWeight,
      'font-size': `${props.fontSize}px`,
      color:
        isChecked.value && !props.disabled
          ? props.checkedTextColor
          : props.uncheckedTextColor,
      right: isChecked.value ? `${props.height - TEXT_OFFSET}px` : 'auto',
      left: isChecked.value ? 'auto' : `${props.height - TEXT_OFFSET}px`,
    }

    if (isChecked.value) {
      if (props.reverse) {
        styles.left = `${props.height - TEXT_OFFSET}px`
        styles.right = 'auto'
      } else {
        styles.right = `${props.height - TEXT_OFFSET}px`
        styles.left = 'auto'
      }
    } else {
      if (props.reverse) {
        styles.right = `${props.height - TEXT_OFFSET}px`
        styles.left = 'auto'
      } else {
        styles.left = `${props.height - TEXT_OFFSET}px`
        styles.right = 'auto'
      }
    }

    return styles
  })

  const toggle = () => {
    emits('click', isChecked.value)

    if (props.disabled || props.readonly) return

    isChecked.value = !isChecked.value
    emits('update:modelValue', isChecked.value)
  }

  watchEffect(() => {
    isChecked.value = Boolean(props.value ?? props.modelValue)
  })

  return {
    isChecked,
    bgStyle,
    dotStyle,
    textStyle,
    toggle,
  }
}

export default useCustomToggle
