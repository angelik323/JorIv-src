// Vue - Vue Router - Quasar
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { QTable } from 'quasar'

// interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { ITabs } from '@/interfaces/global'
import {
  IInvestmentPlanRowData,
  IFicConsultUnitsDataBasicForm,
  IFicConsultUnitsInvestmentPlansDetails,
} from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// Composables
import { useGoToUrl, useMainLoader, useUtils, useRules } from '@/composables'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'

const useConsultUnitsView = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const {
    formatCurrency,
    formatUnitsString,
    formatParamsCustom,
    defaultIconsLucide,
  } = useUtils()

  const {
    _getByIdConsultUnitsBasicData,
    _getByIdConsultUnitsTable,
    _dowlanloadReport,
  } = useFiduciaryInvestmentPlanStore('v1')

  const consult_units_investment_plans_details =
    ref<IFicConsultUnitsInvestmentPlansDetails | null>(null)
  const consult_units_basic_data_form =
    ref<IFicConsultUnitsDataBasicForm | null>()
  const filtersFormat = ref<Record<string, string | number>>({})
  const tabActive = ref('information')
  const tabActiveIdx = ref(0)

  const searchId = +route.params.id

  const headerProps = {
    title: 'Consulta planes de inversión titular',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Fics', route: '' },
      {
        label: 'Planes de inversión fiduciarios',
        route: 'FiduciaryInvestmentPlanList',
      },
      { label: 'Consultar unidades', route: 'ConsultUnitsView' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [],
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (val: string) =>
          val ? useRules().date_before_or_equal_to_the_current_date(val) : true,
      ],
    },
  ])

  const listAction = async (filters: Record<string, string | number> = {}) => {
    openMainLoader(true)

    const queryString = formatParamsCustom(filters)
    consult_units_investment_plans_details.value =
      await _getByIdConsultUnitsTable(
        searchId,
        queryString ? '&' + queryString : ''
      )
    openMainLoader(false)
  }

  const handleFilter = async ($filters: {
    'filter[start_date]': string
    'filter[end_date]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    await listAction(filtersFormat.value)
  }

  const clearFilters = () => (tableProps.value.rows = [])

  const tableProps = ref({
    title: 'Detalle saldos planes de inversión',
    loading: false,
    columns: [
      {
        name: 'concept',
        field: 'concept',
        required: false,
        label: '',
        align: 'left',
        sortable: false,
      },
      {
        name: 'saldo_pesos',
        field: 'saldo_pesos',
        required: false,
        label: 'Saldo en pesos',
        align: 'right',
        sortable: false,
        format: (val: number) => formatCurrency(val, 'COP', 'symbol'),
      },
      {
        name: 'saldo_unidades',
        field: 'saldo_unidades',
        required: false,
        label: 'saldo en unidades',
        align: 'right',
        sortable: false,
        format: (val: number) => formatUnitsString(val),
      },
    ] as QTable['columns'],
    rows: [] as IInvestmentPlanRowData[],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const handleGoBack = () =>
    goToURL('FiduciaryInvestmentPlanList', undefined, { reload: true })

  const consultUnitsReport = async () =>
    await _dowlanloadReport(searchId, formatParamsCustom(filtersFormat.value))

  onMounted(async () => {
    openMainLoader(true)
    consult_units_basic_data_form.value = await _getByIdConsultUnitsBasicData(
      searchId
    )
    setTimeout(() => openMainLoader(false), 1000)
  })

  watch(
    () => consult_units_investment_plans_details.value,
    (newData) => {
      if (newData) {
        tableProps.value.rows = [
          {
            concept: 'Saldo plan inicial',
            saldo_pesos: newData.initial_balance?.[0] || 0,
            saldo_unidades: newData.initial_balance?.[1] || 0,
          },
          {
            concept: 'Aportes',
            saldo_pesos: newData.contributions?.[0] || 0,
            saldo_unidades: newData.contributions?.[1] || 0,
          },
          {
            concept: 'Retiros',
            saldo_pesos: newData.withdrawals?.[0] || 0,
            saldo_unidades: newData.withdrawals?.[1] || 0,
          },
          {
            concept: 'Ajustes',
            saldo_pesos: newData.adjustments?.[0] || 0,
            saldo_unidades: newData.adjustments?.[1] || 0,
          },
          {
            concept: 'Retención en la fuente',
            saldo_pesos: newData.retentions?.[0] || 0,
            saldo_unidades: newData.retentions?.[1] || 0,
          },
          {
            concept: 'GMF',
            saldo_pesos: newData.gmf_retentions?.[0] || 0,
            saldo_unidades: newData.gmf_retentions?.[1] || 0,
          },
          {
            concept: 'Anulaciones',
            saldo_pesos: newData.annulations?.[0] || 0,
            saldo_unidades: newData.annulations?.[1] || 0,
          },
          {
            concept: 'Saldo final',
            saldo_pesos: newData.final_balance?.[0] || 0,
            saldo_unidades: newData.final_balance?.[1] || 0,
          },
        ]
      } else {
        tableProps.value.rows = []
      }
    },
    { deep: true }
  )

  return {
    tabs,
    tabActive,
    tableProps,
    headerProps,
    tabActiveIdx,
    handleGoBack,
    handleFilter,
    clearFilters,
    filterConfig,
    consultUnitsReport,
    consult_units_basic_data_form,
  }
}

export default useConsultUnitsView
