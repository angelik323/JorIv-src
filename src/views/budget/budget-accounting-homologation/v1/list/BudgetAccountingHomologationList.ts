// Vue - pinia
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBudgetAccountingHomologationItem } from '@/interfaces/customs/budget/BudgetAccountingHomologation'

// Composables
import { useMainLoader } from '@/composables'
import { useRules } from '@/composables/useRules'
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useRouteValidator } from '@/composables/useRoutesValidator'

// Stores
import { useBudgetAccountingHomologationStore } from '@/stores/budget/budget-accounting-homologation'
import {
  useAccountingResourceStore,
  useBudgetResourceStore,
  useResourceManagerStore,
} from '@/stores/resources-manager'

const useBudgetAccountingHomologationList = () => {
  const { goToURL } = useGoToUrl()
  const { _getBudgetAccountingHomologations } =
    useBudgetAccountingHomologationStore('v1')

  const { business_trusts_selector } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const { budget_document_types, budget_document_number } = storeToRefs(
    useBudgetResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()

  const { validateRouter } = useRouteValidator()

  const { defaultIconsLucide } = useUtils()

  const headerProps = {
    title: 'Homologación contabilidad vs presupuesto',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Homologación contabilidad vs presupuesto',
        route: 'BudgetAccountingHomologationList',
      },
    ],
    btn: {
      label: 'Crear ',
      icon: defaultIconsLucide.plusCircleOutline,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'from_business_trust',
      label: 'Negocio desde*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts_selector,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) => useRules().is_required(v, 'El negocio es requerido'),
      ],
    },
    {
      name: 'to_business_trust',
      label: 'Negocio hasta*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts_selector,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) => useRules().is_required(v, 'El negocio es requerido'),
      ],
    },
    {
      name: 'document_type',
      label: 'Tipo de documento',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: budget_document_types,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'from_document',
      label: 'Número de documento desde',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: budget_document_number,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Todos',
    },
    {
      name: 'to_document',
      label: 'Número de documento hasta',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: budget_document_number,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Todos',
    },
    {
      name: 'validity',
      label: 'Vigencia',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Inserte',
    },
  ])

  const filters = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const tableProperties = ref<
    IBaseTableProps<IBudgetAccountingHomologationItem>
  >({
    title: 'Listado de documentos homologados',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business_trust',
        required: true,
        label: 'Código / Negocio',
        align: 'left',
        field: (row) =>
          `${row.business?.business_code ?? ''} - ${row.business?.name ?? ''}`,
        sortable: true,
      },
      {
        name: 'validity',
        required: true,
        label: 'Vigencia',
        align: 'left',
        field: (row) => `${row.validity ?? ''}`,
        sortable: true,
      },
      {
        name: 'document_type',
        required: true,
        label: 'Tipo de documento',
        align: 'left',
        field: (row) =>
          `${row.document_type?.code ?? ''} - ${
            row.document_type?.description ?? ''
          }`,
        sortable: true,
      },
      {
        name: 'document_number',
        required: true,
        label: 'Número de documento',
        align: 'left',
        field: (row) => `${row.document_number ?? ''}`,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const listBudgetAccountingHomologations = async () => {
    const currentFilters = {
      'filter[business_trust_range][from]':
        filters.value['filter[from_business_trust]'],
      'filter[business_trust_range][to]':
        filters.value['filter[to_business_trust]'],
      'filter[budget_document_type_id]': filters.value['filter[document_type]'],
      'filter[document_range][from]': filters.value['filter[from_document]'],
      'filter[document_range][to]': filters.value['filter[to_document]'],
      'filter[validity]': filters.value['filter[validity]'],
      page: filters.value.page,
      rows: filters.value.rows,
    }
    tableProperties.value.loading = true
    const budgetAccountingParameters = await _getBudgetAccountingHomologations(
      currentFilters
    )
    if (budgetAccountingParameters) {
      tableProperties.value.rows = budgetAccountingParameters.list
      tableProperties.value.pages = budgetAccountingParameters.pages
    }
    tableProperties.value.loading = false
  }

  const handleSearch = ($filters: Record<string, string | number>) => {
    filters.value = {
      page: 1,
      rows: filters.value.rows,
      ...$filters,
    }
    listBudgetAccountingHomologations()
  }

  const updatePage = (page: number) => {
    filters.value.page = page
    listBudgetAccountingHomologations()
  }

  const updatePerPage = (rows: number) => {
    filters.value.rows = rows
    filters.value.page = 1
    listBudgetAccountingHomologations()
  }

  const clearFilters = () => {
    filters.value = {
      page: 1,
      rows: filters.value.rows,
    }
    tableProperties.value.rows = []
  }

  onMounted(async () => {
    openMainLoader(true)
    _resetKeys({
      budget: ['budget_document_types', 'budget_document_number'],
      accounting: ['business_trusts_selector'],
    })
    Promise.all([
      _getResources({ accounting: ['business_trusts_selector'] }, '', 'v2'),
      _getResources({
        budget: ['budget_document_types', 'budget_document_number'],
      }),
    ]).finally(() => {
      openMainLoader(false)
    })
  })

  return {
    headerProps,
    filterConfig,
    defaultIconsLucide,
    tableProperties,
    goToURL,
    updatePage,
    updatePerPage,
    validateRouter,
    clearFilters,
    handleSearch,
  }
}

export default useBudgetAccountingHomologationList
