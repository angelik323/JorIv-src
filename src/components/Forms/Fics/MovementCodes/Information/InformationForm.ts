// Vue - Pinia -Quasar
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QForm } from 'quasar'

// Composables
import { useRules } from '@/composables'
import {
  IMovementCodesInformationForm,
  PropsInformationForm,
} from '@/interfaces/customs/fics/MovementCodes'

// Utils
import { isEmptyOrZero } from '@/utils'

// Interfaces
import { ISelectorResources } from '@/interfaces/customs'

// Stores
import { useMovementCodesStore } from '@/stores/fics/movement-codes'
import { useResourceStore } from '@/stores/resources-selects'

const useInformationForm = (props: PropsInformationForm) => {
  const { data_information_form } = storeToRefs(useMovementCodesStore('v1'))
  const { _setDataInformationForm } = useMovementCodesStore('v1')
  const { _getResourcesFics } = useResourceStore('v1')
  const {
    movement_classes_movement_codes,
    movement_nature_movement_codes,
    movement_group_movement_codes,
    movement_types_movement_codes,
    origin_module_movement_codes,
    operation_class,
  } = storeToRefs(useResourceStore('v1'))

  const {
    is_required,
    max_length,
    min_length,
    only_number,
    only_alphanumeric,
    max_integer_decimal,
  } = useRules()

  const initialModelsValues: IMovementCodesInformationForm = {
    code: '',
    description: '',
    movement_type_id: null,
    movement_type_description: '',
    movement_class_id: null,
    movement_class_description: '',
    movement_nature_id: null,
    movement_nature_description: '',
    movement_group_id: null,
    movement_group_description: '',
    annulment_movement: null,
    real_estate_movement: null,
    generate_accounting: false,
    operation_class: null,
    origin_module_id: null,
    origin_module_description: '',
    consolidated_code: '',
    distribution_code: '',
    withholding_base: '',
  }

  const keys = [
    'movement_types_movement_codes',
    'movement_classes_movement_codes',
    'movement_nature_movement_codes',
    'movement_group_movement_codes',
    'operation_class',
    'origin_module_movement_codes',
  ]

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })
  const informationFormRef = ref<QForm | null>(null)
  const classlist = ref<ISelectorResources[]>([])
  const skipWatch = ref(false)

  const handlerActionForm = (action: 'create' | 'view' | 'edit') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: setValueModel,
      view: setFormView,
      edit: setFormEdit,
    }
    actionHandlers[action]?.()
  }

  const setFormView = () => {
    skipWatch.value = true
    clearForm()
    if (props.data) {
      models.value = { ...props.data }
    }
    nextTick(() => (skipWatch.value = false))
  }
  const setFormEdit = () => {
    skipWatch.value = true

    clearForm()

    if (props.data) {
      models.value = { ...props.data }
    }

    if (data_information_form.value) {
      models.value = { ...models.value, ...data_information_form.value }
    }

    nextTick(() => (skipWatch.value = false))
  }

  const setValueModel = () => {
    if (!data_information_form.value) return

    models.value = { ...data_information_form.value }
  }

  const clearForm = () => {
    models.value = { ...initialModelsValues }
  }

  const updateUpperCase = <K extends keyof typeof models.value>(
    key: K,
    value: unknown
  ) => {
    if (typeof value === 'string') {
      models.value[key] = value.toUpperCase() as (typeof models.value)[K]
    }
  }

  const createdDisabled = computed(() => {
    const form = data_information_form.value

    if (!form) return false

    const typeId = movement_types_movement_codes.value.filter(
      (type) => type.label === 'M Movimiento'
    )[0]?.value

    const classId = movement_classes_movement_codes.value.filter((cls) =>
      cls.label.includes('RED')
    )[0]?.value

    const isAjuste =
      form?.movement_class_id === classId ||
      form?.operation_class === 'A - Ajuste' ||
      form?.movement_type_id === typeId

    const hasCodes =
      form?.consolidated_code?.trim() !== '' &&
      form?.distribution_code?.trim() !== ''

    return !isAjuste || hasCodes
  })

  const isRetentionBaseDisabled = computed(() => {
    return (
      models.value.movement_class_id === 7 ||
      models.value.movement_class_id === 3 ||
      models.value.movement_class_id === 9
    )
  })

  const isMovementGroupDisabled = computed(() => {
    return (
      models.value.movement_type_id === 17 &&
      models.value.movement_class_id === 9
    )
  })

  const withholdingBaseRules = computed(() => [
    (val: string) => {
      if (isMovementGroupDisabled.value && !val) {
        return 'La base de retención es requerida'
      }
      return true
    },
    (val: string) => {
      if (!val) return true
      return max_integer_decimal(val, 2, 2)
    },
    (val: string) => {
      if (!val) return true
      return max_length(val, 4)
    },
    (val: string) => {
      if (!val) return true
      return min_length(val, 1)
    },
  ])

  const isCodesDisabled = computed(() => {
    return (
      models.value.movement_class_id === 7 &&
      models.value.operation_class === 'A - Ajuste'
    )
  })

  onMounted(async () => {
    handlerActionForm(props.action)
    await _getResourcesFics(`keys[]=${keys.join('&keys[]=')}`)
    await nextTick()
  })

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setDataInformationForm({ ...val })
      handlerActionForm(props.action)
    },
    { immediate: true }
  )

  watch(
    () => models.value,
    () => {
      if (skipWatch.value) return
      if (isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
      } else {
        if (models.value.movement_type_id) {
          const typeId = movement_types_movement_codes.value.filter(
            (type) => type.label === 'M Movimiento'
          )[0]?.value

          const clases =
            models.value.movement_type_id === typeId
              ? ['APO', 'RET', 'RFT', 'GMF', 'CAP', 'PEN', 'RCO', 'RED']
              : ['COM', 'REN', 'REB', 'OMO', 'VUN', 'NUF', 'VUB']

          classlist.value = movement_classes_movement_codes.value.filter(
            (cls) => clases.some((clase) => cls.label.includes(clase))
          )

          const isCurrentClassIdValid = classlist.value.some(
            (cls) => cls.value === models.value.movement_class_id
          )

          if (!isCurrentClassIdValid) {
            models.value.movement_class_id = null
          }
        } else {
          classlist.value = []
          models.value.movement_class_id = null
        }

        _setDataInformationForm({ ...models.value })
      }
    },
    { deep: true }
  )

  return {
    models,
    informationFormRef,

    movement_types_movement_codes,
    movement_nature_movement_codes,
    movement_group_movement_codes,
    operation_class,
    origin_module_movement_codes,
    classlist,

    createdDisabled,

    is_required,
    max_length,
    min_length,
    only_number,
    only_alphanumeric,
    updateUpperCase,
    isMovementGroupDisabled,
    isCodesDisabled,
    withholdingBaseRules,
    isRetentionBaseDisabled,
  }
}

export default useInformationForm
