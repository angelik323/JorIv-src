// core
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import { useUtils, useRules, useMainLoader } from '@/composables'

// interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IPaymentRequestAssociatedDataAdvancesForm,
  IPaymentRequestAssociatedDataForm,
} from '@/interfaces/customs/accounts-payable/PaymentRequests'

// constants
import { advance_amortization_type } from '@/constants/resources'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import { useFinantialObligationResourceStore } from '@/stores/resources-manager/finantial-obligations'
import { usePaymentRequestsStore } from '@/stores/accounts-payable/payment-requests'

const useAssociatedDataFormRef = (
  props: {
    action?: ActionType
    data?: IPaymentRequestAssociatedDataForm | null
  },
  emit: Function
) => {
  // hooks
  const { isEmptyOrZero } = useUtils()
  const {
    is_required,
    only_number_with_max_integers_and_decimals_ignore_symbols,
  } = useRules()
  const { openMainLoader } = useMainLoader()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getAdvances } = usePaymentRequestsStore('v1')
  const { type, configuration_type, asset_number } = storeToRefs(
    useFixedAssetsResourceStore('v1')
  )
  const { financial_obligations, payment_plan_quotas } = storeToRefs(
    useFinantialObligationResourceStore('v1')
  )
  const { business_label } = storeToRefs(usePaymentRequestsStore('v1'))

  const tableRef = ref()

  const tableProps = ref<
    IBaseTableProps<IPaymentRequestAssociatedDataAdvancesForm>
  >({
    title: '',
    loading: false,
    columns: [
      {
        name: 'amortization_type',
        required: false,
        label: 'Forma de amortización',
        align: 'left',
        field: 'amortization_type',
        sortable: true,
      },
      {
        name: 'business_label',
        required: false,
        label: 'Negocio',
        align: 'left',
        field: 'business_label',
        sortable: true,
      },
      {
        name: 'payment_request_id',
        required: false,
        label: 'Solicitud de pago',
        align: 'left',
        field: 'request_number',
        sortable: true,
      },
      {
        name: 'advance_number',
        required: false,
        label: 'Número de anticipo',
        align: 'left',
        field: 'advance_number',
        sortable: true,
      },
      {
        name: 'advance_value',
        required: false,
        label: 'Valor de Anticipo',
        align: 'left',
        field: 'advance_value',
        sortable: true,
      },
      {
        name: 'amortization_percentage',
        required: false,
        label: 'Porcentaje',
        align: 'left',
        field: 'amortization_percentage',
        sortable: true,
      },
      {
        name: 'accumulated_amortization',
        required: false,
        label: 'Acumulado amortización',
        align: 'left',
        field: 'accumulated_amortization',
        sortable: true,
      },

      {
        name: 'balance_to_amortize',
        required: false,
        label: 'Saldo por amortización',
        align: 'left',
        field: 'balance_to_amortize',
        sortable: true,
      },
      {
        name: 'amortize_value',
        required: false,
        label: 'Valor a amortizar',
        align: 'left',
        field: 'amortize_value',
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  // refs
  const keys = {
    fixed_assets: ['asset_number'],
  }
  const keysFinancialObligations = {
    finantial_obligations: ['payment_plan_quotas'],
  }

  // configs
  const associatedDataFormRef = ref()

  const models = ref<IPaymentRequestAssociatedDataForm>({
    assets: [],
    financial_obligations: [],
    advances: [],
    table: [],
  })

  // methods

  const changeConfigurationType = async ($event: number) => {
    models.value.assets[0].asset_type_id = $event

    if (!$event) return

    await _resetKeys(keys)

    openMainLoader(true)
    await _getResources(keys, `filter[configuration_type_id]=${$event}`)
    openMainLoader(false)
  }

  const changeFinancialObligation = async ($event: number) => {
    models.value.financial_obligations[0].financial_obligation_id = $event

    if (!$event) return

    await _resetKeys(keysFinancialObligations)

    openMainLoader(true)
    await _getResources(
      keysFinancialObligations,
      `filter[financial_obligation_id]=${$event}`
    )
    openMainLoader(false)

    models.value.financial_obligations[0].installment_number =
      payment_plan_quotas.value[0]?.number_quota || null
    models.value.financial_obligations[0].capital_value =
      payment_plan_quotas.value[0]?.capital_quota || null
    models.value.financial_obligations[0].interest_value =
      payment_plan_quotas.value[0]?.interest_quota || null
    models.value.financial_obligations[0].total_installment_value =
      payment_plan_quotas.value[0]?.total_quota || null
  }

  const handleSelectAdvance = async (
    selected: IPaymentRequestAssociatedDataAdvancesForm[]
  ) => {
    tableProps.value.rows = tableProps.value.rows.map((item) => ({
      ...item,
      amortization_type: '',
      amortization_percentage: '',
      amortize_value: '',
    }))
    models.value.advances = selected.length > 0 ? selected : []
  }

  const selectedItemId = computed(() => {
    if (models.value.advances.length == 0) return 0
    return (
      models.value.advances[0]?.id ??
      models.value.advances[0]?.advance_request_id ??
      0
    )
  })

  const changeAmortizationType = (
    row: IPaymentRequestAssociatedDataAdvancesForm,
    $event: string
  ) => {
    row.amortization_type = $event ?? ''
    row.amortization_percentage = ''
    row.amortize_value = ''

    if (models.value.advances.length > 0) {
      models.value.advances[0].amortization_type = $event ?? ''
      models.value.advances[0].amortization_percentage = ''
      models.value.advances[0].amortize_value = ''
    }
  }

  const changeAmortizationPercentage = (
    row: IPaymentRequestAssociatedDataAdvancesForm,
    rawValue: string
  ) => {
    row.amortization_percentage = rawValue

    if (models.value.advances.length > 0) {
      models.value.advances[0].amortization_percentage = rawValue
    }
  }

  const changeAmortizeValue = (
    row: IPaymentRequestAssociatedDataAdvancesForm,
    rawValue: string
  ) => {
    row.amortize_value = rawValue

    if (models.value.advances.length > 0) {
      models.value.advances[0].amortize_value = rawValue
    }
  }

  // lifecycle hooks
  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val && props.data) models.value = props.data
    },
    { immediate: true }
  )

  watch(
    () => tableProps.value.rows,
    (rows) => {
      if (models.value.table === rows) return
      models.value.table = rows
    },
    { deep: true }
  )

  watch(
    () => models.value.table,
    (table) => {
      if (tableProps.value.rows === table) return
      tableProps.value.rows = table
    }
  )

  onMounted(async () => {
    const advances = await _getAdvances()
    const nextRows = advances ?? []

    const currentIds = new Set(
      models.value.table.map((r) => r.advance_request_id)
    )

    const nextIds = new Set(
      nextRows.map(
        (r: IPaymentRequestAssociatedDataAdvancesForm) => r.advance_request_id
      )
    )

    const sameIds =
      currentIds.size === nextIds.size &&
      [...currentIds].every((id) => nextIds.has(id))

    if (sameIds) {
      tableProps.value.rows = tableProps.value.rows = models.value.table
    } else {
      tableProps.value.rows = advances ?? []

      tableProps.value.rows = tableProps.value.rows.map((item) => ({
        ...item,
        id: item.advance_request_id,
        business_label: business_label.value,
      }))
    }
  })

  return {
    associatedDataFormRef,
    models,
    tableRef,
    tableProps,

    // selects
    type,
    configuration_type,
    asset_number,
    financial_obligations,
    advance_amortization_type,
    selectedItemId,

    // methods
    changeConfigurationType,
    changeFinancialObligation,
    handleSelectAdvance,
    changeAmortizationType,
    changeAmortizationPercentage,
    changeAmortizeValue,

    // rules
    is_required,
    only_number_with_max_integers_and_decimals_ignore_symbols,
  }
}

export default useAssociatedDataFormRef
