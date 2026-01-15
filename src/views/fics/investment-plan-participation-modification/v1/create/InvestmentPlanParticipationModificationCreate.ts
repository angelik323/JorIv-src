// Vue - Pinia
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

// // Interfaes
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'
import {
  IInvestmentPlan,
  IInvestmentPlanParticipationModificationFormFilters,
} from '@/interfaces/customs/fics/InvestmentPlanParticipationModification'

// Composables
import { useGoToUrl, useMainLoader, useRules, useUtils } from '@/composables'

// Stores
import { useInvestmentPlanParticipationModificationStore } from '@/stores/fics/investment-plan-participation-modification'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useInvestmentPlanParticipationModificationCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { formatCurrency } = useUtils()
  const { is_required } = useRules()
  const { goToURL } = useGoToUrl()

  const {
    funts_to_investment_plans,
    fiduciary_investment_plans,
    fic_business_lines,
  } = storeToRefs(useFicResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getListCreate, _create } =
    useInvestmentPlanParticipationModificationStore('v1')
  const {
    investment_plan_participation_modification_create_list,
    investment_plan_participation_modification_create_pages,
  } = storeToRefs(useInvestmentPlanParticipationModificationStore('v1'))

  const formData = ref<IInvestmentPlanParticipationModificationFormFilters>({})
  const filtersFormat = ref<Record<string, string | number>>({})
  const selectedRows = ref<IInvestmentPlan[]>([])
  const isTableEmpty = ref(true)
  const showState = ref(0)
  const filtersRef = ref()
  const tableKey = ref(0)

  let perPage = 20

  const headerProps = ref({
    title: 'Crear solicitud de modificación tipo de participación',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Modificación Tipo de Participación',
        route: 'InvestmentPlanParticipationModificationList',
      },
      {
        label: 'Crear',
        route: 'InvestmentPlanParticipationModificationCreate',
      },
    ],
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'collective_investment_fund_id',
      label: 'Código fondo de inversión*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: funts_to_investment_plans,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [
        (val: string) =>
          is_required(val, 'Código fondo de inversión es requerido'),
      ],
      onChange: async (val: string | number) => {
        filtersRef.value?.setFieldValueByName('code', null)

        if (val) {
          await _getResources(
            { fics: ['fiduciary_investment_plans'] },
            `filter[collective_investment_fund_id]=${val}`
          )
        }
      },
    },
    {
      name: 'code',
      label: 'Código plan de inversión',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: fiduciary_investment_plans,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
  ])

  const tableProps = ref<IBaseTableProps<IInvestmentPlan>>({
    title: 'Planes de inversión',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'center',
      },
      {
        name: 'collective_investment_fund',
        label: 'Fondo de inversión',
        field: (row: IInvestmentPlan) => row.collective_investment_fund || '',
        align: 'left',
        sortable: true,
      },
      {
        name: 'fiduciary_investment_plan',
        label: 'Plan de inversión',
        field: 'fiduciary_investment_plan',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_line_code',
        label: 'Línea de negocio actual',
        field: 'business_line_code',
        align: 'left',
        sortable: true,
      },
      {
        name: 'plan_status',
        label: 'Estado del plan de inversión',
        field: (row) => row.plan_status.id,
        align: 'center',
      },
      {
        name: 'plan_description',
        label: 'Descripción del plan',
        field: 'plan_description',
        align: 'left',
        sortable: true,
      },
      {
        name: 'plan_balance',
        label: 'Saldo del plan de inversión',
        field: (row: IInvestmentPlan) => formatCurrency(row.plan_balance ?? 0),
        align: 'left',
        sortable: true,
      },
      {
        name: 'new_business_line_id',
        label: 'Nueva línea de negocio',
        field: 'new_business_line_id',
        align: 'left',
      },
      {
        name: 'authorization_status',
        label: 'Estado de autorización',
        field: (row: IInvestmentPlan) => row.authorization_status.status,
        align: 'center',
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const loadResources = async () => {
    openMainLoader(true)

    await _getResources({
      fics: ['status_investment_plan_status_modification'],
    })
    await _getResources(
      { fics: ['funts_to_investment_plans'] },
      'filter[has_participation_types]=true'
    )

    setTimeout(() => openMainLoader(false), 1000)
  }

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProps.value.rows = []

    await _getListCreate(filters)

    const hasResults =
      investment_plan_participation_modification_create_list.value.length > 0

    showState.value = filters ? 1 : 0
    isTableEmpty.value = !hasResults

    setTimeout(() => openMainLoader(false), 1000)
  }

  const canSubmit = computed(() => {
    if (selectedRows.value.length === 0) return false

    return selectedRows.value.every(
      (row) => row.new_business_line_id && row.new_business_line_id > 0
    )
  })

  const handleClear = () => {
    showState.value = 0
    formData.value = {}
    selectedRows.value = []
    isTableEmpty.value = true
    tableProps.value.rows = []
    tableKey.value++
  }

  const handleSearch = async ($filters: {
    'filter[collective_investment_fund_id]': string
    'filter[code]': string
  }) => {
    if ($filters['filter[code]']) {
      const filterCode = String($filters['filter[code]'])
      const selectedPlan = fiduciary_investment_plans.value.find(
        (plan) =>
          String(plan.value) === filterCode || String(plan.id) === filterCode
      )
      if (selectedPlan && selectedPlan.code) {
        $filters['filter[code]'] = selectedPlan.code
      }
    }

    selectedRows.value = []
    tableProps.value.rows = []
    showState.value = 0
    formData.value = {}
    tableKey.value++
    filtersFormat.value = { ...$filters }

    await loadData({ ...$filters })
  }

  const updatePage = async (page: number) =>
    await loadData({ ...filtersFormat.value, page, rows: perPage })

  const updatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    await loadData({ ...filtersFormat.value, rows: perPage })
  }

  const onSubmit = async () => {
    const payload = selectedRows.value.map((row) => ({
      fund_id: Number(row.fund_id),
      fiduciary_investment_plan_id: row.id,
      business_line_id: row.business_line,
      new_business_line_id: Number(row.new_business_line_id),
    }))

    const result = await _create(payload)

    if (result.success) {
      selectedRows.value = []
      tableProps.value.rows = []

      goToURL('InvestmentPlanParticipationModificationList', undefined, {
        reload: true,
      })
    }
  }

  onMounted(async () => await loadResources())

  onBeforeUnmount(() =>
    _resetKeys({
      fics: [
        'funts_to_investment_plans',
        'fiduciary_investment_plans',
        'status_investment_plan_status_modification',
        'fic_business_lines',
      ],
    })
  )

  watch(
    investment_plan_participation_modification_create_list,
    async (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } =
        investment_plan_participation_modification_create_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }

      const fundId =
        filtersFormat.value['filter[collective_investment_fund_id]']
      if (fundId) {
        await _getResources(
          { fics: ['fic_business_lines'] },
          `filter[fund_id]=${fundId}`
        )
      }
    },
    { deep: true }
  )

  return {
    goToURL,
    onSubmit,
    canSubmit,
    showState,
    tableProps,
    updatePage,
    headerProps,
    handleClear,
    isTableEmpty,
    filterConfig,
    selectedRows,
    handleSearch,
    updatePerPage,
    filtersRef,
    fic_business_lines,
    tableKey,
  }
}

export default useInvestmentPlanParticipationModificationCreate
