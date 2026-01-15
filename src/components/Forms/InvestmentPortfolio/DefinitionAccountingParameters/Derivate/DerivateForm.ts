import { onMounted, ref, watch, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { isEmptyOrZero } from '@/utils'
import { ActionType, ActionHandlers } from '@/interfaces/global'
import {
  IDefinitionAccountingParametersDerivates,
  IReceiptTypeResource,
  IGenericResource,
  IPaperTypeResource,
} from '@/interfaces/customs'
import {
  useDefinitionAccountingParametersStore,
  useInvestmentPortfolioResourceStore,
  useAccountingResourceStore,
} from '@/stores'

const useDerivateForm = (props: {
  action: ActionType
  data?: IDefinitionAccountingParametersDerivates | null
  tabActive?: string
}) => {
  const {
    definition_accounting_parameters_view,
    definition_accounting_parameters_details,
    is_required_fields_derivates,
  } = storeToRefs(useDefinitionAccountingParametersStore('v1'))
  const { _setDefinitionAccountingParametersDerivates } =
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
  const coverageTarget = 'Cobertura' as const
  const speculationTarget = 'Especulación' as const
  const creditNature = 'Crédito' as const
  const debitNature = 'Débito' as const

  const initialModelsValues: IDefinitionAccountingParametersDerivates = {
    operation_code: null,
    paper_type: null,
    investment_class: null,
    objective: null,
    main_match: null,
    auxiliary: null,
    cost_center_id: null,
    counterparty_account: null,
    nature: null,
    counterparty_auxiliary: null,
    counterparty_cost_center: null,
    operation_description: null,
    voucher_type: null,
    sub_receipt_types: null,
  }

  const models = ref<IDefinitionAccountingParametersDerivates>({
    ...initialModelsValues,
  })

  const isView = computed(() => props.action === 'view')

  const selectedObjective = computed<boolean>({
    get: () => models.value.objective === coverageTarget,
    set: (isActive) => {
      models.value.objective = isActive ? coverageTarget : speculationTarget
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
      definition_accounting_parameters_view.value?.derivatives?.[0] ??
      props.data ??
      null

    const actionHandlers: ActionHandlers = {
      create: async () => {
        await setForm(data)
      },
      edit: async () => {
        await setFormEdit(data)
        await handleReceiptTypeChange(
          data?.voucher_type_id ?? null,
          data?.sub_receipt_types_id ?? null
        )
      },
      view: () => setForm(data),
    }
    actionHandlers[action]?.()
  }

  const setCommonForm = () => {
    models.value = {
      ...initialModelsValues,
      objective: coverageTarget,
      nature: creditNature,
    }
  }

  const setForm = (data: IDefinitionAccountingParametersDerivates | null) => {
    if (!data) {
      setCommonForm()
      return
    }

    models.value = {
      ...initialModelsValues,
      ...data,
    }
  }

  const setFormEdit = (
    data: IDefinitionAccountingParametersDerivates | null
  ) => {
    if (!data) {
      setCommonForm()
      return
    }

    models.value = {
      ...initialModelsValues,
      operation_code: data.operation_id ?? null,
      paper_type: data.paper_type_id ?? null,
      investment_class: data.investment_class ?? null,
      objective: data.objective ?? null,
      main_match: data.main_match_id ?? null,
      auxiliary: data.auxiliary ?? null,
      cost_center_id: data.cost_center_id ?? null,
      counterparty_account: data.counterparty_account_id ?? null,
      nature: data.nature ?? null,
      counterparty_auxiliary: data.counterparty_auxiliary ?? null,
      counterparty_cost_center: data.counterparty_cost_center_id ?? null,
      operation_description: data.operation_description ?? null,
    }
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

  const setIsRequiredFieldsDerivates = () => {
    nextTick(() => {
      const selectedPaperType = paper_types_form_parameters.value.find(
        (item: IPaperTypeResource) =>
          item.value ===
          Number(
            definition_accounting_parameters_details.value?.paper_type ?? null
          )
      )
      is_required_fields_derivates.value =
        selectedPaperType?.enable_derivative_form ?? false

      if (!is_required_fields_derivates.value) {
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
        _setDefinitionAccountingParametersDerivates(null)
      } else {
        _setDefinitionAccountingParametersDerivates({ ...models.value })
      }
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
    async () => {
      if (props.tabActive === 'derivates') {
        await setIsRequiredFieldsDerivates()
        formElementRef.value?.resetValidation()
      }
    }
  )

  return {
    models,
    formElementRef,
    selectedObjective,
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
    is_required_fields_derivates,
    handleReceiptTypeChange,
    handleOperationTypeCodeLocalCurrencyChange,
  }
}

export default useDerivateForm
