// vue - quasar
import { onMounted, ref, computed, watch } from 'vue'
import { uid, useQuasar } from 'quasar'

const useWysiwygComponent = (
  props: {
    id?: string
    class_name?: string
    label?: string
    label_class?: string
    label_color?: string
    default_value: string | null | undefined
    placeholder?: string
    readonly?: boolean
    lazy_rules?: boolean
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
    hide_bottom_space?: boolean
  },
  emit: Function
) => {
  const editorProperties = ref<{
    loading: boolean
    disable: boolean
    value: string
    label: string | undefined
  }>({
    loading: false,
    disable: false,
    value: '',
    label: props.label,
  })

  const labelClass = computed(() => {
    return `${props.label_class} ${props.label_color}`.trim()
  })

  const $q = useQuasar()

  const editorId = computed(() => props.id || `editor-${uid()}`)

  const editorRef = ref()

  const defaultToolbar = [
    ['bold', 'italic', 'underline'],
    [
      {
        label: $q.lang.editor.formatting,
        list: 'no-icons',
        options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
        class: 'custom',
      },
    ],
    [
      {
        icon: $q.iconSet.editor.align,
        fixedLabel: true,
        fixedIcon: true,
        list: 'only-icons',
        options: ['left', 'center', 'right', 'justify'],
        class: 'custom',
      },
    ],

    ['unordered', 'ordered'],
  ]

  const computedToolbar = computed(() => {
    if (props.toolbar && props.toolbar.length > 0) {
      return props.toolbar
    }
    return defaultToolbar
  })

  onMounted(() => {
    if (props.default_value) {
      editorProperties.value.value = props.default_value || ''
    }
  })

  watch(
    () => props.default_value,
    (val) => {
      editorProperties.value.value = val || ''
    }
  )

  watch(
    () => props.disabled,
    (val) => {
      editorProperties.value.disable = val ?? false
    }
  )

  const setValue = (value: string) => {
    editorProperties.value.value = value
    emit('update:modelValue', value)
  }

  return {
    editorProperties,
    labelClass,
    editorId,
    editorRef,
    computedToolbar,
    setValue,
  }
}

export default useWysiwygComponent
