// Vue - Pinia -Quasar
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QForm } from 'quasar'

// Interfaces - Constants
import { ISelectorResources } from '@/interfaces/customs'
import { operation_class } from '@/constants'
import {
  IMovementCodesInformationForm,
  PropsInformationForm,
} from '@/interfaces/customs/fics/MovementCodes'

// Composables
import { useRules, useUtils } from '@/composables'

// Stores
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useMovementCodesStore } from '@/stores/fics/movement-codes'

const useInformationForm = (props: PropsInformationForm) => {
  const { data_information_form } = storeToRefs(useMovementCodesStore('v1'))
  const { _setDataInformationForm } = useMovementCodesStore('v1')
  const { _getResources } = useResourceManagerStore('v1')
  const { treasury_movement_codes } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const {
    movement_classes_movement_codes,
    movement_nature_movement_codes,
    movement_types_movement_codes,
    movement_group_movement_codes,
    origin_module_movement_codes,
  } = storeToRefs(useFicResourceStore('v1'))

  const {
    max_integer_decimal,
    only_alphanumeric,
    is_required,
    only_number,
    max_length,
    min_length,
  } = useRules()

  const { isEmptyOrZero } = useUtils()
  const initialModelsValues: IMovementCodesInformationForm = {
    code: '',
    description: '',
    movement_type_id: null,
    movement_type_description: '',
    movement_class_id: null,
    movement_class_description: '',
    movement_nature_id: null,
    movement_nature_id_number: null,
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

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })
  const informationFormRef = ref<QForm | null>(null)
  const classlist = ref<ISelectorResources[]>([])
  const isMovementType = ref<boolean>(false)
  const isUpdatingNature = ref(false)
  const isMovementNature = ref(false)
  const isMovementClass = ref(false)
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
      if (props.data.real_estate_movement != null) {
        models.value.real_estate_movement = Number(
          props.data.real_estate_movement
        )
      }
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
  const normalizeRealEstateMovement = () => {
    const id = models.value.real_estate_movement
    if (!id) return

    const list = treasury_movement_codes.value
    if (!list || list.length === 0) return

    const item = list.find((i) => i.value === id)
    if (!item) return

    models.value.real_estate_movement = item.value
  }
  const isCodesDisabled = computed(() => {
    return (
      models.value.movement_class_id === 7 &&
      models.value.operation_class === 'A - Ajuste'
    )
  })

  const isTreasuryMovementEnabled = computed(() => {
    return (
      isMovementType.value && isMovementClass.value && isMovementNature.value
    )
  })

  const keysFics = {
    fics: [
      'movement_types_movement_codes',
      'movement_classes_movement_codes',
      'movement_nature_movement_codes',
      'movement_group_movement_codes',
      'operation_class',
      'origin_module_movement_codes',
    ],
  }
  onMounted(async () => {
    await _getResources(keysFics)
    handlerActionForm(props.action)
    await nextTick()
  })

  watch(isTreasuryMovementEnabled, (enabled) => {
    if (!enabled) {
      models.value.real_estate_movement = null
    }
  })
  watch(
    () => props.data,
    (val) => {
      if (!val) return
      const payload = { ...val }
      if (payload.real_estate_movement != null) {
        payload.real_estate_movement = Number(payload.real_estate_movement)
      }
      _setDataInformationForm(payload)
      handlerActionForm(props.action)
    },
    { immediate: true }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
      } else {
        if (models.value.movement_type_id) {
          const movement = movement_types_movement_codes.value.filter(
            (type) => type.description === 'Movimiento'
          )[0]?.value

          const traslate = movement_types_movement_codes.value.filter(
            (type) => type.description === 'Traslado'
          )[0]?.value

          const clases =
            models.value.movement_type_id === movement ||
            models.value.movement_type_id === traslate
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

  watch(
    () => models.value.movement_type_id,
    (val) => {
      if (!val) return (isMovementType.value = false)

      const type = movement_types_movement_codes.value.find(
        (item) => item.value === val
      )

      isMovementType.value = type
        ? type?.label?.startsWith('M - Movimiento')
        : false
    }
  )
  watch(
    () => models.value.movement_class_id,
    (val) => {
      if (!val) return (isMovementClass.value = false)

      const cls = classlist.value.find((c) => c.value === val)

      isMovementClass.value = ['APO', 'RET'].some((code) =>
        cls?.label?.includes(code)
      )
    }
  )

  watch(
    [
      () => models.value.movement_type_id,
      () => models.value.movement_class_id,
      () => models.value.movement_nature_id,
    ],
    async ([type, cls, nature]) => {
      if (!type || !cls || !nature) return

      await nextTick()

      if (!isTreasuryMovementEnabled.value) return

      const natureItem = movement_nature_movement_codes.value.find(
        (item) => item.value === nature
      )

      if (!natureItem) return

      const [_prefix, _prefix2, ...rest] = natureItem.label.split(' ')
      const natureText = rest.join(' ')

      await _getResources(
        { treasury: ['treasury_movement_codes'] },
        `filter[nature]=${natureText}`
      )
      await nextTick()
      normalizeRealEstateMovement()
    },
    { immediate: true }
  )

  watch(
    () => models.value.movement_nature_id,
    (val) => {
      if (!val) return (isMovementNature.value = false)

      const nature = movement_nature_movement_codes.value.find(
        (item) => item.value === val
      )

      const code = nature?.label?.split(' ')?.[0] ?? ''

      isMovementNature.value = ['I', 'E'].includes(code)
    }
  )
  watch(
    () => movement_nature_movement_codes.value,
    (val) => {
      if (isUpdatingNature.value || !val) return

      isUpdatingNature.value = true

      const updated = val.map((item) => {
        const [prefix, ...rest] = item.label.split(' ')
        let labelText = rest.join(' ')

        if (!labelText.endsWith('s')) {
          if (labelText.endsWith('o')) labelText = labelText.slice(0, -1) + 'os'
          else if (labelText.endsWith('a'))
            labelText = labelText.slice(0, -1) + 'as'
        }

        const newLabel = `${prefix} ${labelText}`

        return {
          ...item,
          label: newLabel,
          value: Number(item.value),
          id: Number(item.value),
        }
      })

      movement_nature_movement_codes.value = updated

      setTimeout(() => {
        isUpdatingNature.value = false
      }, 0)
    },
    { immediate: true }
  )

  return {
    models,
    classlist,
    max_length,
    min_length,
    is_required,
    only_number,
    operation_class,
    updateUpperCase,
    isCodesDisabled,
    only_alphanumeric,
    informationFormRef,
    withholdingBaseRules,
    treasury_movement_codes,
    isRetentionBaseDisabled,
    isMovementGroupDisabled,
    isTreasuryMovementEnabled,
    origin_module_movement_codes,
    movement_group_movement_codes,
    movement_types_movement_codes,
    movement_nature_movement_codes,
  }
}

export default useInformationForm
