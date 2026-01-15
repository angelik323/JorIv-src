import { computed, ref, watch } from 'vue'

// Utils
import { isEmptyOrZero } from '@/utils'
import { commissionTypeMap } from '@/constants'

// Interfaces
import { IFiduciaryBusinessCommissionsCalculationForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useSettlementCommissionsResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'

const useBasicDataCalculationForm = (
  props: {
    action: ActionType
    data: IFiduciaryBusinessCommissionsCalculationForm | null
  },
  emit: Function
) => {
  const utils = useUtils()

  const { calculation_types } = storeToRefs(
    useSettlementCommissionsResourceStore('v1')
  )

  const formElementRef = ref()

  const initialModelsValues: IFiduciaryBusinessCommissionsCalculationForm = {
    calculation_type: null,
    smlmv_amount: null,
    payment_amount: null,
    returns_percentage: null,
    balances_percentage: null,
    other_amount: null,

    smlmv_quantity: null,
    payments_count: null,
    balances_amount: null,
    returns_amount: null,
    other_value_amount: null,

    base_amount: null,
    iva_percentage: null,
    iva_amount: null,
    total_amount: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  const opsCalculationTypes = computed(() => {
    if (!calculation_types.value?.length || !props.data) {
      return []
    }

    const classCommission = props.data.commission_class_catalog_id
    const typeCommission = props.data.commission_type_catalog_id

    if (!classCommission) return []

    const configKey =
      classCommission === 2 || classCommission === 3
        ? String(classCommission)
        : `${classCommission}-${typeCommission}`

    const allowedTypes = commissionTypeMap[configKey] || []

    return calculation_types.value.filter((ct) =>
      allowedTypes.includes(ct.label?.toLowerCase() || '')
    )
  })

  const clearFields = () => {
    models.value.base_amount = null
    models.value.total_amount = null
    models.value.iva_amount = null
    models.value.smlmv_quantity = null
    models.value.payment_amount = null
    models.value.payments_count = null
    models.value.returns_percentage = null
    models.value.returns_amount = null
    models.value.balances_percentage = null
    models.value.balances_amount = null
    models.value.other_amount = null
    models.value.other_value_amount = null
  }

  const updateCalculationType = (newType: string) => {
    models.value.calculation_type = newType

    clearFields()
  }

  // Sincroniza el modelo con la prop 'data'
  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      // Evita bucle infinito
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    formElementRef,
    models,
    utils,
    opsCalculationTypes,
    updateCalculationType,
  }
}

export default useBasicDataCalculationForm
