import { onMounted, ref, computed, watch } from 'vue'
import { uid } from 'quasar'
import { FileInputValue, GenericFileInputProps } from '@/interfaces/global'

const useGenericFileInputComponent = (
  props: GenericFileInputProps,
  emit: (e: 'update:modelValue', value: FileInputValue) => void
) => {
  const inputFileProperties = ref<{
    loading: boolean
    disable: boolean
    value: FileInputValue
    label: string | undefined
  }>({
    loading: false,
    disable: false,
    value: null,
    label: props.label,
  })

  const labelClass = computed(() => {
    return `${props.label_class} ${props.label_color}`.trim()
  })

  const inputFileId = computed(() => props.id || `input-${uid()}`)

  const inputFileRef = ref<InstanceType<
    typeof import('quasar')['QFile']
  > | null>(null)

  onMounted(() => {
    if (props.default_value) {
      inputFileProperties.value.value = props.default_value
    }
  })

  watch(
    () => props.default_value,
    (val) => {
      inputFileProperties.value.value = val
    }
  )

  watch(
    () => props.disabled,
    (val) => {
      inputFileProperties.value.disable = !!val
    }
  )

  watch(
    () => props.required,
    (val) => {
      if (!val) {
        inputFileRef.value?.resetValidation()
      }
    }
  )

  return {
    inputFileProperties,
    labelClass,
    inputFileId,
    inputFileRef,
    setValue: (value: FileInputValue) => {
      const valueModify = props.multiple ? value ?? [] : value ?? null
      emit('update:modelValue', valueModify)
    },
  }
}

export default useGenericFileInputComponent
