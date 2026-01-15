import { onMounted, ref, watch, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { isEmptyOrZero } from '@/utils'
import { ActionType, ActionHandlers } from '@/interfaces/global'
import {
  IDefinitionAccountingParametersPositions,
  IReceiptTypeResource,
  IGenericResource,
  IPaperTypeResource,
} from '@/interfaces/customs'
import {
  useDefinitionAccountingParametersStore,
  useInvestmentPortfolioResourceStore,
  useAccountingResourceStore,
} from '@/stores'

const usePositionForm = (props: {
  action: ActionType
  data?: IDefinitionAccountingParametersPositions | null
  tabActive?: string
  isInitialized?: boolean
}) => {
  const {
    definition_accounting_parameters_view,
    definition_accounting_parameters_details,
    definition_accounting_parameters_positions,
    is_required_fields_positions,
  } = storeToRefs(useDefinitionAccountingParametersStore('v1'))
  const { _setDefinitionAccountingParametersPositions } =
    useDefinitionAccountingParametersStore('v1')

  const {
    operation_type,
    paper_types_form_parameters,
    class_investment,
    type_auxiliary,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  const { accounts_charts, cost_center, receipt_types } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const formElementRef = ref()
  const sub_receipt_types = ref<Array<{ value: number; label: string }>>([])
  const parsed_operation_type = ref<
    Array<{ value: number; label: string; description: string }>
  >([])
  const creditNature = 'Crédito' as const
  const debitNature = 'Débito' as const
  const activePosition = 'Activo' as const
  const passivePosition = 'Pasiva' as const

  const initialModelsValues: IDefinitionAccountingParametersPositions = {
    operation_code: null,
    paper_type: null,
    investment_class: null,
    position: null,
    main_match: null,
    auxiliary: null,
    cost_center_id: null,
    counterparty_account: null,
    nature: null,
    receivable_cost_center_id: null,
    counterparty_auxiliary: null,
    operation_description: null,
    voucher_type: null,
    sub_receipt_types: null,
  }

  const models = ref<IDefinitionAccountingParametersPositions>({
    ...initialModelsValues,
  })

  const isView = computed(() => props.action === 'view')

  const selectedPosition = computed<boolean>({
    get: () => models.value.position === activePosition,
    set: (isActive) => {
      models.value.position = isActive ? activePosition : passivePosition
    },
  })

  const selectedNature = computed<boolean>({
    get: () => models.value.nature === creditNature,
    set: (isCredit) => {
      models.value.nature = isCredit ? creditNature : debitNature
    },
  })

  const handlerActionForm = (action: ActionType) => {
    const data =
      definition_accounting_parameters_view.value?.positions?.[0] ??
      props.data ??
      null
    const actionHandlers: ActionHandlers = {
      create: async () => {
        await setForm(data)
      },
      edit: async () => {
        await setFormEdit(data)
      },
      view: () => setForm(data),
    }
    actionHandlers[action]?.()
  }

  const setCommonForm = () => {
    models.value = {
      ...initialModelsValues,
      nature: creditNature,
      position: activePosition,
    }
  }

  const setForm = async (
    data: IDefinitionAccountingParametersPositions | null
  ) => {
    if (!data) {
      setCommonForm()
      return
    }

    models.value = {
      ...initialModelsValues,
      ...data,
    }
  }

  const setFormEdit = async (
    data: IDefinitionAccountingParametersPositions | null
  ) => {
    if (!data) {
      setCommonForm()
      return
    }

    models.value = {
      ...initialModelsValues,
      operation_code: data.operation_code_id ?? null,
      paper_type: data.paper_type_id ?? null,
      investment_class: data.investment_class ?? null,
      position: data.position ?? null,
      main_match: data.main_match_id ?? null,
      auxiliary: data.auxiliary ?? null,
      cost_center_id: data.cost_center_id ?? null,
      counterparty_account: data.counterparty_account_id ?? null,
      nature: data.nature ?? null,
      receivable_cost_center_id: data.receivable_cost_center_id ?? null,
      counterparty_auxiliary: data.counterparty_auxiliary ?? null,
      operation_description: data.operation_description ?? null,
    }
    await handleReceiptTypeChange(
      data?.voucher_type_id ?? null,
      data?.sub_receipt_types_id ?? null
    )
  }

  const handleReceiptTypeChange = (
    value: number | null,
    subReceiptType: number | null = null
  ) => {
    if (!value) {
      sub_receipt_types.value = []
      models.value.sub_receipt_types = null
      return
    }

    models.value.voucher_type = Number(value)
    const selectedReceiptType = receipt_types.value.find(
      (item: IReceiptTypeResource) => item.id === value
    )
    models.value.sub_receipt_types = subReceiptType
    sub_receipt_types.value =
      selectedReceiptType?.related?.map(
        (item: { value: string | number; label: string }) => ({
          value: Number(item.value),
          label: item.label,
        })
      ) ?? []
  }

  const handleOperationTypeCodeLocalCurrencyChange = (value: number | null) => {
    if (!value) {
      models.value.operation_code = null
      models.value.operation_description = ''
      return
    }
    models.value.operation_code = value
    models.value.operation_description =
      parsed_operation_type.value.find(
        (item: IGenericResource) => item.value === value
      )?.description ?? ''
  }

  const setParsedOperationTypeCodeLocalCurrency = () => {
    parsed_operation_type.value = operation_type.value.map(
      (item: IGenericResource) => ({
        ...item,
        value: parseInt(String(item.value), 10),
        label: item.description || '',
        description: item.description || '',
      })
    )
  }

  const setIsRequiredFieldsPositions = async () => {
    nextTick(() => {
      const selectedPaperType = paper_types_form_parameters.value.find(
        (item: IPaperTypeResource) =>
          item.value ===
          Number(
            definition_accounting_parameters_details.value?.paper_type ?? null
          )
      )
      is_required_fields_positions.value =
        selectedPaperType?.enable_position_form ?? false

      if (!is_required_fields_positions.value) {
        setForm(null)
      }
    })
  }

  onMounted(async () => {
    await handlerActionForm(props.action)
    await setParsedOperationTypeCodeLocalCurrency()
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDefinitionAccountingParametersPositions(null)
      } else {
        _setDefinitionAccountingParametersPositions({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => definition_accounting_parameters_positions.value,
    (newValue) => {
      if (!newValue) {
        is_required_fields_positions.value = false
        return
      }

      const { position, nature, ...rest } = newValue
      const allOtherFieldsNull = Object.values(rest).every(
        (value) => value === null || value === '' || value === undefined
      )

      is_required_fields_positions.value ||= !allOtherFieldsNull
    },
    { deep: true }
  )

  watch(
    () => operation_type.value,
    () => {
      setParsedOperationTypeCodeLocalCurrency()
    }
  )

  watch(
    () => receipt_types.value,
    () => {
      handleReceiptTypeChange(
        Number(models.value.voucher_type),
        Number(models.value.sub_receipt_types)
      )
    }
  )

  watch(
    () => props.tabActive,
    () => {
      if (props.tabActive === 'positions') {
        formElementRef.value?.resetValidation()
      }
    }
  )

  watch(
    () => definition_accounting_parameters_details.value?.paper_type,
    async (newVal) => {
      if (!props.isInitialized) return
      if (paper_types_form_parameters.value.length === 0) return
      if (newVal == null) return

      await setIsRequiredFieldsPositions()
      formElementRef.value?.resetValidation()
    }
  )

  return {
    models,
    formElementRef,
    selectedPosition,
    selectedNature,
    isView,
    parsed_operation_type,
    paper_types_form_parameters,
    class_investment,
    accounts_charts,
    type_auxiliary,
    cost_center,
    receipt_types,
    sub_receipt_types,
    is_required_fields_positions,
    handleReceiptTypeChange,
    handleOperationTypeCodeLocalCurrencyChange,
  }
}

export default usePositionForm
