// vue - pinia
import { ref, onBeforeMount, onUnmounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// stores
import { useFinancialObligationStore } from '@/stores/financial-obligations/financial-obligation'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import { IBaseTableProps } from '@/interfaces/global'
import {
  IFinancialObligationDetailV2,
  IFinancialObligationAuditInfo,
  IFinancialObligationAuthorizationObservation,
  IFinancialObligationPaymentPlanItem,
} from '@/interfaces/customs/financial-obligations/v2/FinancialObligation'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// assets
import excelIcon from '@/assets/images/excel.svg'

const useFinancialObligationView = () => {
  // route
  const route = useRoute()
  const searchId = +route.params.id

  // composables
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, formatCurrencyString, formatDate } = useUtils()

  // stores
  const { headerPropsDefault } = storeToRefs(useFinancialObligationStore('v2'))
  const { _getFinancialObligationById, _downloadPaymentPlan } =
    useFinancialObligationStore('v2')

  // breadcrumb
  const headerPropsView = {
    title: 'Ver obligación financiera',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
        route: 'FinancialObligationView',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  // state
  const isLoading = ref(true)
  const responseData = ref<IFinancialObligationDetailV2 | null>(null)

  // audit info
  const auditInfo = ref<IFinancialObligationAuditInfo>({
    status_id: null,
    status_name: null,
    created_at: null,
    created_by: null,
    updated_at: null,
    updated_by: null,
  })

  // authorization observations
  const authorizationObservations = ref<
    IFinancialObligationAuthorizationObservation[]
  >([])

  // basic data computed
  const basicData = computed(() => {
    if (!responseData.value) return null
    const data = responseData.value.basic_data
    return {
      business_trust_name: data.business_trust
        ? `${data.business_trust.code} - ${data.business_trust.name}`
        : '-',
      obligation_number: data.obligation_number ?? '-',
      holder_name: data.titular?.name ?? '-',
      holder_identification: data.titular?.nit?.toString() ?? '-',
      bank_name: data.bank?.description ?? '-',
      credit_type_name: data.credit_type?.name ?? '-',
      credit_value: formatCurrencyString(data.amount),
      rate: data.interest_rate ?? '-',
      rate_factor: data.factor
        ? `${data.factor.code} - ${data.factor.name}`
        : '-',
      payment_periodicity: data.periodicity?.name ?? '-',
      term: data.quotas ?? '-',
      payment_day: data.payment_day ?? '-',
      alert_days: data.alert_days ?? '-',
    }
  })

  // calculations computed
  const calculationsData = computed(() => {
    if (!responseData.value) return null
    const cfg = responseData.value.basic_data.payment_plan_configuration

    return {
      interest_calculation_method: cfg?.calculation_method ?? '-',
      calculation_base:
        cfg?.calculation_base !== undefined && cfg?.calculation_base !== null
          ? String(cfg.calculation_base)
          : '-',
      quota_type: cfg?.quota_type ?? '-',
      amortization_type: cfg?.amortization_type ?? '-',
    }
  })

  // payment plan summary computed
  const paymentPlanSummary = computed(() => {
    if (!responseData.value) return null
    const basicData = responseData.value.basic_data
    const quotas = responseData.value.payment_plan?.quotas ?? []
    const firstQuota = quotas[0]
    const lastQuota = quotas[quotas.length - 1]
    return {
      number_of_quotas: basicData.quotas ?? '-',
      start_date: firstQuota?.payment_date ?? '-',
      end_date: lastQuota?.payment_date ?? '-',
      initial_balance: formatCurrencyString(firstQuota?.initial_balance),
      capital_quota: formatCurrencyString(firstQuota?.capital_quota),
    }
  })

  // tabs
  const tabs: ITabs[] = [
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'observations',
      label: 'Observaciones',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ]

  const [initialTab] = tabs
  const tabActive = ref(initialTab.name)
  const tabActiveIdx = ref(tabs.indexOf(initialTab))

  // payment plan table
  const paymentPlanTableProperties = ref<
    IBaseTableProps<IFinancialObligationPaymentPlanItem>
  >({
    title: 'Listado de plan de pagos',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'number_quota',
        required: false,
        label: 'No. Cuota',
        align: 'center',
        field: 'number_quota',
        sortable: true,
      },
      {
        name: 'initial_balance',
        required: false,
        label: 'Saldo inicial',
        align: 'right',
        field: (row) => formatCurrencyString(row.initial_balance),
        sortable: true,
      },
      {
        name: 'interest_quota',
        required: false,
        label: 'Cuota interés',
        align: 'right',
        field: (row) => formatCurrencyString(row.interest_quota),
        sortable: true,
      },
      {
        name: 'capital_quota',
        required: false,
        label: 'Cuota capital',
        align: 'right',
        field: (row) => formatCurrencyString(row.capital_quota),
        sortable: true,
      },
      {
        name: 'total_quota',
        required: false,
        label: 'Valor total de la cuota',
        align: 'right',
        field: (row) => formatCurrencyString(row.total_quota),
        sortable: true,
      },
      {
        name: 'final_balance',
        required: false,
        label: 'Saldo final',
        align: 'right',
        field: (row) => formatCurrencyString(row.final_balance),
        sortable: true,
      },
      {
        name: 'payment_date',
        required: false,
        label: 'Fecha de pago',
        align: 'center',
        field: (row) => formatDate(row.payment_date, 'DD/MM/YYYY'),
        sortable: true,
      },
      {
        name: 'status_quota',
        required: false,
        label: 'Estado',
        align: 'center',
        field: 'status_quota',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  // observations table
  const observationsTableProperties = ref<
    IBaseTableProps<IFinancialObligationAuthorizationObservation>
  >({
    title: 'Observaciones de autorización del registro',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'observation',
        required: false,
        label: 'Observación',
        align: 'left',
        field: 'observation',
        sortable: true,
      },
      {
        name: 'user_name',
        required: false,
        label: 'Nombre del usuario',
        align: 'left',
        field: 'user_name',
        sortable: true,
      },
      {
        name: 'decision_date',
        required: false,
        label: 'Fecha de decisión',
        align: 'center',
        field: (row) =>
          row.decision_date ? formatDate(row.decision_date, 'DD/MM/YYYY') : '',
        sortable: true,
      },
      {
        name: 'status_name',
        required: false,
        label: 'Estado del registro',
        align: 'center',
        field: 'status_name',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  // actions
  const goToDocuments = () => {
    goToURL('FinancialObligationViewDocuments', { id: searchId })
  }

  const goToList = () => {
    goToURL('FinancialObligationList')
  }

  const downloadPaymentPlanExcel = async () => {
    if (paymentPlanTableProperties.value.rows.length === 0) return

    openMainLoader(true)
    await _downloadPaymentPlan(searchId)
    openMainLoader(false)
  }

  // pagination
  const updatePaymentPlanPage = (page: number) => {
    paymentPlanTableProperties.value.pages.currentPage = page
  }

  const updateObservationsPage = (page: number) => {
    observationsTableProperties.value.pages.currentPage = page
  }

  // lifecycle
  onBeforeMount(async () => {
    openMainLoader(true)

    responseData.value = await _getFinancialObligationById(searchId)
    isLoading.value = false

    openMainLoader(false)
  })

  onUnmounted(() => {
    responseData.value = null
  })

  // watchers
  watch(
    () => responseData.value,
    (val) => {
      if (!val) return

      const basicData = val.basic_data

      // audit info
      auditInfo.value = {
        status_id: basicData.obligation_status?.id ?? null,
        status_name: basicData.authorize_status ?? null,
        created_at: basicData.creation?.created_at ?? null,
        created_by: basicData.creation?.created_by
          ? typeof basicData.creation.created_by === 'string'
            ? basicData.creation.created_by
            : `${basicData.creation.created_by.name ?? ''} ${
                basicData.creation.created_by.last_name ?? ''
              }`.trim()
          : null,
        updated_at: null,
        updated_by: null,
      }

      // authorization observations
      const logs = val.authorizations?.logs ?? []
      authorizationObservations.value = logs.map(
        (log: Record<string, unknown>) => ({
          id: (log.id as number) ?? 0,
          observation: (log.observations as string) ?? null,
          user_name: log.created_by ? String(log.created_by) : null,
          decision_date: (log.created_at as string) ?? null,
          status_name: (log.status as string) ?? null,
        })
      )
      observationsTableProperties.value.rows = [
        ...authorizationObservations.value,
      ]

      // payment plan items
      paymentPlanTableProperties.value.rows = val.payment_plan?.quotas ?? []
    },
    { deep: true }
  )

  return {
    // state
    headerPropsView,
    isLoading,
    searchId,

    // tabs
    tabs,
    tabActive,
    tabActiveIdx,

    // data
    auditInfo,
    basicData,
    calculationsData,
    paymentPlanSummary,

    // tables
    paymentPlanTableProperties,
    observationsTableProperties,

    // icons
    defaultIconsLucide,
    excelIcon,

    // actions
    goToDocuments,
    goToList,
    downloadPaymentPlanExcel,
    updatePaymentPlanPage,
    updateObservationsPage,
    formatDate,
  }
}

export default useFinancialObligationView
