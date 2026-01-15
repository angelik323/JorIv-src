import { onMounted, ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { isEmptyOrZero } from '@/utils'
import { ActionType, ActionHandlers } from '@/interfaces/global'
import {
  IDefinitionAccountingParametersDetails,
  IReceiptTypeResource,
  IPaperTypeResource,
  IGenericResource,
} from '@/interfaces/customs'
import {
  useDefinitionAccountingParametersStore,
  useInvestmentPortfolioResourceStore,
  useAccountingResourceStore,
} from '@/stores'

const useDetailForm = (props: {
  action: ActionType
  data?: IDefinitionAccountingParametersDetails | null
}) => {
  const {
    definition_accounting_parameters_view,
    is_required_fields_positions,
    is_required_fields_derivates,
  } = storeToRefs(useDefinitionAccountingParametersStore('v1'))
  const { _setDefinitionAccountingParametersDetails } =
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
  const isInitialized = ref(false)
  const sub_receipt_types = ref<Array<{ value: number; label: string }>>([])
  const parsed_operation_type = ref<
    Array<{ value: number; label: string; description: string }>
  >([])
  const creditNature = 'Crédito' as const
  const debitNature = 'Débito' as const

  const initialModelsValues: IDefinitionAccountingParametersDetails = {
    operation_code: null,
    paper_type: null,
    investment_class: null,
    nature: null,
    main_match: null,
    auxiliary: null,
    cost_center_id: null,
    higher_account_receivable: null,
    receivable_auxiliary: null,
    receivable_cost_center_id: null,
    counterparty_account: null,
    counterparty_auxiliary: null,
    counterparty_cost_center: null,
    operation_description: null,
    voucher_type: null,
    sub_receipt_types: null,
  }

  const models = ref<IDefinitionAccountingParametersDetails>({
    ...initialModelsValues,
  })

  const isView = computed(() => props.action === 'view')

  const selectedNature = computed<boolean>({
    get: () => models.value.nature === creditNature,
    set: (isCredit) => {
      models.value.nature = isCredit ? creditNature : debitNature
    },
  })

  const handlerActionForm = (action: ActionType) => {
    const data =
      definition_accounting_parameters_view.value?.details?.[0] ??
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

  const setForm = async (
    data: IDefinitionAccountingParametersDetails | null
  ) => {
    if (!data) {
      models.value = { ...initialModelsValues, nature: creditNature }
      return
    }

    models.value = {
      ...initialModelsValues,
      ...data,
    }
  }

  const setFormEdit = async (
    data: IDefinitionAccountingParametersDetails | null
  ) => {
    if (!data) {
      models.value = { ...initialModelsValues, nature: creditNature }
      return
    }

    models.value = {
      ...initialModelsValues,
      operation_code: data.operation_id ?? null,
      paper_type: data.paper_type_id ?? null,
      investment_class: data.investment_class ?? null,
      nature: data.nature ?? null,
      main_match: data.main_match_id ?? null,
      auxiliary: data.auxiliary ?? null,
      cost_center_id: data.cost_center_id ?? null,
      higher_account_receivable: data.higher_account_receivable_id ?? null,
      receivable_auxiliary: data.receivable_auxiliary ?? null,
      receivable_cost_center_id: data.receivable_cost_center_id ?? null,
      counterparty_account: data.counterparty_account_id ?? null,
      counterparty_auxiliary: data.counterparty_auxiliary ?? null,
      counterparty_cost_center: data.counterparty_cost_center_id ?? null,
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

  const handlePaperTypeChange = (value: number | null) => {
    if (!value) {
      models.value.paper_type = null
      return
    }

    models.value.paper_type = value
    const selectedPaperType = paper_types_form_parameters.value.find(
      (item: IPaperTypeResource) => item.value === value
    )
    is_required_fields_positions.value =
      selectedPaperType?.enable_position_form ?? false
    is_required_fields_derivates.value =
      selectedPaperType?.enable_derivative_form ?? false
  }

  onMounted(async () => {
    await handlerActionForm(props.action)
    await setParsedOperationTypeCodeLocalCurrency()
    isInitialized.value = true
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
        _setDefinitionAccountingParametersDetails(null)
      } else {
        _setDefinitionAccountingParametersDetails({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => operation_type.value,
    async () => {
      await setParsedOperationTypeCodeLocalCurrency()
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

  return {
    models,
    formElementRef,
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
    handleReceiptTypeChange,
    handleOperationTypeCodeLocalCurrencyChange,
    handlePaperTypeChange,
  }
}

export default useDetailForm
