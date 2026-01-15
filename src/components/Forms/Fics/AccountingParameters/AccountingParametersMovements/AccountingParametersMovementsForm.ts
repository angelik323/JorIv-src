// Vue - Vue Router - Pinia
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { IResource } from '@/interfaces/global/Resource'
import { ISelectorResources } from '@/interfaces/customs/Filters'
import { IReceiptTypeResource } from '@/interfaces/customs/resources'
import {
  ExtendedActionTypeCopy,
  ActionHandlers,
} from '@/interfaces/global/Action'
import {
  IAccountingParametersMovementsForm,
  IAccountingParametersMovementsView,
} from '@/interfaces/customs/fics/AccountingParametersMovements'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useAccountingParametersAccountingParametersMovementsStore } from '@/stores/fics/accounting-parameters/accounting-parameters-movements'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useAccountingParametersMovementsForm = (props: {
  action: ExtendedActionTypeCopy
  data?: IAccountingParametersMovementsView | null
}) => {
  const { openMainLoader } = useMainLoader()
  const { isEmptyOrZero } = useUtils()

  const {
    accounting_parameters_movements_view,
    accounting_parameters_movements_block_selected,
  } = storeToRefs(
    useAccountingParametersAccountingParametersMovementsStore('v1')
  )
  const {
    _setAccountingParametersMovementsForm,
    _setAccountingParametersMovementsBlockSelected,
  } = useAccountingParametersAccountingParametersMovementsStore('v1')

  const {
    movements_accounting_parameters: movements,
    auxiliar_accounting_parameter,
    fund_types,
    accounting_parameter_counter_part_types,
  } = storeToRefs(useFicResourceStore('v1'))
  const {
    deferred_impairment_natures,
    receipt_types,
    accounting_chart_operative_by_structure,
    cost_center_codes_by_structure,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { third_parties } = storeToRefs(useTreasuryResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    fics: [
      'movements_accounting_parameters',
      'auxiliar_accounting_parameter',
      'fund_types',
      'accounting_parameter_counter_part_types',
    ],
    accounting: ['deferred_impairment_natures', 'receipt_types'],
    treasury: ['third_parties'],
  }

  const keyCostCenter = {
    accounting: ['cost_center_codes_by_structure'],
  }

  const keyAccountingChartOperativeByStructure = {
    accounting: ['accounting_chart_operative_by_structure'],
  }

  const accountingParametersMovementsFormElementRef = ref()

  const sub_receipt_types = ref<Array<{ value: number; label: string }>>([])

  const disabledSpecificThirdParty = ref(true)
  const disabledSpecificCounterparty = ref(true)
  const disabledDepartureCostCenter = ref(false)
  const disabledCounterpartCostCenter = ref(false)

  const initialModels: IAccountingParametersMovementsForm = {
    accounting_block_id: null,
    movement_code_id: null,
    fund_type_id: null,
    departure_nature: null,
    departure_account_chart_id: null,
    departure_auxiliar_id: null,
    departure_third_party_id: null,
    departure_cost_center_id: null,
    counterpart_type: null,
    counterpart_nature: null,
    counterpart_account_chart_id: null,
    counterpart_auxiliar_id: null,
    counterpart_third_party_id: null,
    counterpart_cost_center_id: null,
    receipt_type_id: null,
    sub_receipt_type_id: null,
  }

  const models = ref({
    ...initialModels,
  })

  const handleEditOrCopy = async () => {
    const data = accounting_parameters_movements_view.value || props.data
    if (data) {
      await setFormEdit(data)
    }
  }

  const handlerActionForm = (action: ExtendedActionTypeCopy) => {
    const actionHandlers: ActionHandlers = {
      create: async () => {
        await setFormCreate()
      },
      edit: handleEditOrCopy,
      copy: handleEditOrCopy,
    }
    actionHandlers[action]?.()
  }

  const setFormCreate = () => {
    Object.assign(models.value, {
      ...initialModels,
      accounting_block_id:
        accounting_parameters_movements_block_selected.value?.id ?? null,
    } as IAccountingParametersMovementsForm)
  }

  const setFormEdit = (data: IAccountingParametersMovementsView | null) => {
    clearForm()
    if (data) {
      Object.assign(models.value, {
        accounting_block_id: data.accounting_block_id ?? null,
        movement_code_id: data.movement_code?.id ?? null,
        fund_type_id: data.fund_type?.id ?? null,
        departure_nature: data.departure_nature ?? null,
        departure_account_chart_id: data.departure_account_chart?.id ?? null,
        departure_auxiliar_id: data.departure_auxiliar?.id ?? null,
        departure_third_party_id: data.departure_third_party?.id ?? null,
        departure_cost_center_id: data.departure_cost_center?.id ?? null,
        counterpart_type: data.counterpart_type ?? null,
        counterpart_nature: data.counterpart_nature ?? null,
        counterpart_account_chart_id:
          data.counterpart_account_chart?.id ?? null,
        counterpart_auxiliar_id: data.counterpart_auxiliar?.id ?? null,
        counterpart_third_party_id: data.counterpart_third_party?.id ?? null,
        counterpart_cost_center_id: data.counterpart_cost_center?.id ?? null,
        receipt_type_id: data.receipt_type?.id ?? null,
        sub_receipt_type_id: data.sub_receipt_type?.value ?? null,
      })
    }
  }

  const clearForm = () => {
    Object.assign(models.value, initialModels)
  }

  const handleDepartureAccountChartChange = (
    value: string | number | null,
    costCenterId: string | number | null = null
  ) => {
    if (!value) {
      models.value.departure_account_chart_id = null
      models.value.departure_cost_center_id = null
      disabledDepartureCostCenter.value = true
      return
    }

    models.value.departure_account_chart_id = Number(value)
    models.value.departure_cost_center_id = costCenterId
      ? Number(costCenterId)
      : null

    const accountChart = accounting_chart_operative_by_structure.value.find(
      (item: IResource) => item.id === Number(value)
    )

    if (
      !accounting_parameters_movements_block_selected.value?.plan_cost_center
        ?.id
    ) {
      disabledDepartureCostCenter.value = true
    } else {
      disabledDepartureCostCenter.value = !accountChart?.has_cost_center
    }

    if (disabledDepartureCostCenter.value) {
      models.value.departure_cost_center_id = null
    }
  }

  const handleCounterpartAccountChartChange = (
    value: string | number | null,
    costCenterId: string | number | null = null
  ) => {
    if (!value) {
      models.value.counterpart_account_chart_id = null
      models.value.counterpart_cost_center_id = null
      disabledCounterpartCostCenter.value = true
      return
    }

    models.value.counterpart_account_chart_id = Number(value)
    models.value.counterpart_cost_center_id = costCenterId
      ? Number(costCenterId)
      : null

    const accountChart = accounting_chart_operative_by_structure.value.find(
      (item: IResource) => item.id === Number(value)
    )

    if (
      !accounting_parameters_movements_block_selected.value?.plan_cost_center
        ?.id
    ) {
      disabledCounterpartCostCenter.value = true
    } else {
      disabledCounterpartCostCenter.value = !accountChart?.has_cost_center
    }

    if (disabledCounterpartCostCenter.value) {
      models.value.counterpart_cost_center_id = null
    }
  }

  const handleAuxiliaryChange = (value: string | null) => {
    if (!value) {
      models.value.departure_third_party_id = null
      models.value.departure_auxiliar_id = null
      disabledSpecificThirdParty.value = true
      return
    }

    models.value.departure_auxiliar_id = Number(value)
    const auxiliarie = auxiliar_accounting_parameter.value.find(
      (item: ISelectorResources) => Number(item.value) === Number(value)
    )
    disabledSpecificThirdParty.value = auxiliarie?.id !== 3
    if (disabledSpecificThirdParty.value) {
      models.value.departure_third_party_id = null
    }
  }

  const handleCounterpartTypeChange = (value: string | null) => {
    models.value.counterpart_type = value
    if (value !== 'Contabilidad') {
      models.value.counterpart_nature = null
      models.value.counterpart_account_chart_id = null
      models.value.counterpart_auxiliar_id = null
      models.value.counterpart_third_party_id = null
    }
  }

  const handleCounterpartAuxiliaryChange = (value: string | null) => {
    if (!value) {
      models.value.counterpart_third_party_id = null
      models.value.counterpart_auxiliar_id = null
      disabledSpecificCounterparty.value = true
      return
    }
    models.value.counterpart_auxiliar_id = Number(value)
    const auxiliarie = auxiliar_accounting_parameter.value.find(
      (item: ISelectorResources) => Number(item.value) === Number(value)
    )
    disabledSpecificCounterparty.value = auxiliarie?.id !== 3
    if (disabledSpecificCounterparty.value) {
      models.value.counterpart_third_party_id = null
    }
  }

  const handleReceiptTypeChange = (
    value: number | null,
    subReceiptType: number | null = null
  ) => {
    if (!value) {
      sub_receipt_types.value = []
      return
    }

    models.value.receipt_type_id = Number(value)
    const selectedReceiptType = receipt_types.value.find(
      (item: IReceiptTypeResource) => item.id === value
    )

    sub_receipt_types.value =
      selectedReceiptType?.related?.map(
        (item: { value: string | number; label: string }) => ({
          value: Number(item.value),
          label: item.label,
        })
      ) ?? []

    models.value.sub_receipt_type_id = subReceiptType
  }

  onMounted(async () => {
    openMainLoader(true)
    await handlerActionForm(props.action)
    await _getResources(keys)
    await _getResources(
      keyCostCenter,
      `filter[accounts_chart_id]=${accounting_parameters_movements_block_selected.value?.accounting_plan?.id}`
    )
    await _getResources(
      keyAccountingChartOperativeByStructure,
      `filter[account_structures_id]=${accounting_parameters_movements_block_selected.value?.accounting_plan?.id}`
    )
    if (
      !accounting_parameters_movements_block_selected.value?.plan_cost_center
        ?.id
    ) {
      disabledDepartureCostCenter.value = true
    }
    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    _setAccountingParametersMovementsForm(null)
    _resetKeys(keys)
    _resetKeys(keyCostCenter)
    _resetKeys(keyAccountingChartOperativeByStructure)
  })

  onBeforeRouteLeave(() => {
    _setAccountingParametersMovementsBlockSelected(null)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setAccountingParametersMovementsForm(null)
      } else {
        _setAccountingParametersMovementsForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => receipt_types.value,
    () => {
      handleReceiptTypeChange(
        models.value.receipt_type_id,
        models.value.sub_receipt_type_id
      )
    },
    { deep: true }
  )

  watch(
    () => accounting_chart_operative_by_structure.value,
    () => {
      handleDepartureAccountChartChange(
        models.value.departure_account_chart_id,
        models.value.departure_cost_center_id
      )
      handleCounterpartAccountChartChange(
        models.value.counterpart_account_chart_id,
        models.value.counterpart_cost_center_id
      )
    },
    { deep: true }
  )

  return {
    models,
    accountingParametersMovementsFormElementRef,
    movements,
    auxiliar_accounting_parameter,
    fund_types,
    deferred_impairment_natures,
    cost_center_codes_by_structure,
    third_parties,
    accounting_parameter_counter_part_types,
    receipt_types,
    sub_receipt_types,
    accounting_chart_operative_by_structure,
    disabledDepartureCostCenter,
    disabledCounterpartCostCenter,
    disabledSpecificThirdParty,
    disabledSpecificCounterparty,
    handleDepartureAccountChartChange,
    handleCounterpartAccountChartChange,
    handleAuxiliaryChange,
    handleCounterpartTypeChange,
    handleCounterpartAuxiliaryChange,
    handleReceiptTypeChange,
  }
}

export default useAccountingParametersMovementsForm
