// pinia - vue - quasar
import { storeToRefs } from 'pinia'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

// stores
import {
  useTrustBusinessMovementCodesStore,
  useResourceStore,
  useFicResourceStore,
} from '@/stores'

// interfaces
import {
  ITrustBusinessMovementCodes,
  ITrustBusinessMovementCodesCreate,
} from '@/interfaces/customs'

// composables
import { useUtils } from '@/composables/useUtils'
const { isEmptyOrZero } = useUtils()

// constants
import { default_yes_no } from '@/constants/resources'

const useInformationForm = (props: {
  action: 'create' | 'edit' | 'view'
  data?: ITrustBusinessMovementCodes | null
}) => {
  const { _setDataInformationForm } = useTrustBusinessMovementCodesStore('v1')

  const {
    movement_codes_natures,
    movement_codes_types,
    collection_shapes,
    movement_codes_cancellation_codes,
  } = storeToRefs(useResourceStore('v1'))

  const { movements_codes_nfi } = storeToRefs(useFicResourceStore('v1'))

  const formInformation = ref()

  const models = ref<ITrustBusinessMovementCodesCreate>({
    code: '',
    description: '',
    nature: '',
    movement: '',
    has_ganerate_accounting: null,
    has_cancellation_movement_code: '',
    has_cancellation_movement_code_name: '',
    applies_to_goods: null,
    good_type_code: '',
    good_type_code_name: '',
    has_iva: null,
    percentage_iva: '',
    iva_movement_code: undefined,
    iva_movement_code_name: '',
    has_affects_funds: null,
    funds_movement_code: undefined,
    collection_shape: '',
    has_generate_invoice: null,
    billing_concept: '',
  })

  const handlerActionForm = async (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setModelValue,
      edit: await _setModelView,
      view: await _setModelView,
    }
    actionHandlers[action]?.()
  }

  const _setModelValue = () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value = {
        ...data,
        code: data.movement_code ?? '',
        has_cancellation_movement_code:
          Number(data?.has_cancellation_movement_code?.code) || '',
        good_type_code: Number(data?.good_type_code?.code) || '',
        iva_movement_code: data?.iva_movement_code?.id,
        funds_movement_code: data?.funds_movement_code?.id,
        collection_shape: data.collection_shape,
        has_affects_funds: data.has_affects_funds ?? false,
        has_ganerate_accounting: data.has_ganerate_accounting ?? false,
      }
    }
  }

  const _setModelView = async () => {
    const data = props.data
    if (data) {
      models.value = {
        code: data.movement_code ?? '',
        description: data.description ?? '',
        nature: data.nature ?? '',
        movement: data.movement ?? '',
        has_ganerate_accounting: data.has_ganerate_accounting ?? false,
        has_cancellation_movement_code:
          Number(data?.has_cancellation_movement_code?.code) || '',
        has_cancellation_movement_code_name: data.has_cancellation_movement_code
          ? `${data.has_cancellation_movement_code.code} - ${data.has_cancellation_movement_code.description}`
          : '',
        applies_to_goods: data.applies_to_goods ?? false,
        good_type_code: Number(data?.good_type_code?.code) || '',
        good_type_code_name: data.good_type_code
          ? `${data.good_type_code.code} - ${data.good_type_code.description}`
          : '',
        has_iva: data.has_iva ?? false,
        percentage_iva: data.percentage_iva ?? '',
        iva_movement_code: data.iva_movement_code?.id ?? undefined,
        iva_movement_code_name: data.iva_movement_code
          ? `${data.iva_movement_code.code} - ${data.iva_movement_code.description}`
          : '',
        has_affects_funds: data.has_affects_funds ?? false,
        funds_movement_code: data.funds_movement_code?.id ?? undefined,
        funds_movement_code_name: data.funds_movement_code
          ? `${data.funds_movement_code.code} - ${data.funds_movement_code.description}`
          : '',
        collection_shape: data.collection_shape,

        has_generate_invoice: data.has_generate_invoice ?? false,
        billing_concept: data.billing_concept ?? '',
      }
      await nextTick()
    }
  }

  const clearForm = async () => {
    models.value.description = ''
    models.value.nature = ''
    models.value.movement = ''
    models.value.has_ganerate_accounting = false
    models.value.has_cancellation_movement_code = ''
    models.value.applies_to_goods = false
    models.value.good_type_code = ''
    models.value.has_iva = false
    models.value.percentage_iva = ''
    models.value.iva_movement_code = undefined
    models.value.has_affects_funds = false
    models.value.funds_movement_code = undefined
    models.value.collection_shape = ''
    models.value.has_generate_invoice = false
    models.value.billing_concept = ''
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.applies_to_goods,
    (val) => {
      if (!val) {
        formInformation.value.resetValidation()
        models.value.good_type_code = ''
      }
    }
  )

  watch(
    () => models.value.has_iva,
    (val) => {
      if (!val) {
        formInformation.value.resetValidation()
        models.value.percentage_iva = ''
        models.value.iva_movement_code = undefined
      }
    }
  )

  watch(
    () => models.value.has_affects_funds,
    (val) => {
      if (!val) {
        formInformation.value.resetValidation()
        models.value.funds_movement_code = ''
        models.value.collection_shape = ''
      }
    }
  )

  watch(
    () => models.value.has_generate_invoice,
    (val) => {
      if (!val) {
        formInformation.value.resetValidation()
        models.value.billing_concept = ''
      }
    }
  )

  watch(
    () => models.value.has_ganerate_accounting,
    (val) => {
      if (!val) {
        formInformation.value.resetValidation()
        models.value.has_cancellation_movement_code = ''
      }
    }
  )

  return {
    models,
    formInformation,
    movement_codes_natures,
    movement_codes_types,
    default_yes_no,
    collection_shapes,
    movements_codes_nfi,
    movement_codes_cancellation_codes,
  }
}

export default useInformationForm
