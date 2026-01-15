// Vue - pinia
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import {
  IBudgetAccountingHomologationItem,
  IBudgetAccountingHomologationPayload,
  IBudgetHomologationProcessData,
  IHomologationPendingDocumentsItem,
} from '@/interfaces/customs/budget/BudgetAccountingHomologation'

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

const useBudgetAccountingHomologationCreate = () => {
  const { goToURL } = useGoToUrl()
  const {
    _getPendingOperations,
    _runHomologationProcess,
    _downloadBudgetAccountingHomologationErrors,
  } = useBudgetAccountingHomologationStore('v1')

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
      { label: 'Crear', route: 'BudgetAccountingHomologationCreate' },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'document_type',
      label: 'Tipo de documento',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
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
      class: 'col-12 col-md-3',
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
      class: 'col-12 col-md-3',
      options: budget_document_number,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Todos',
    },
    {
      name: 'from_business_trust',
      label: 'Negocio desde*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
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
      class: 'col-12 col-md-3',
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
      name: 'validity',
      label: 'Vigencia*',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Inserte',
      onChange: (value: string) => {
        filters.value['filter[validity]'] = value
      },
      rules: [
        (v: string) => useRules().is_required(v, 'La vigencia es requerida'),
      ],
    },
    {
      name: 'homologation_date',
      label: 'Fecha de homologación*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'AAAA-MM-DD',
      onChange: (value: string) => {
        filters.value['filter[homologation_date]'] = value
      },
      rules: [
        (v: string) =>
          useRules().is_required(v, 'La fecha de homologación es requerida'),
      ],
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
    IBaseTableProps<IHomologationPendingDocumentsItem>
  >({
    title: 'Listado de documentos a homologar',
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
        field: 'document_number',
        sortable: true,
      },
      {
        name: 'budget_resource',
        required: true,
        label: 'Recurso',
        align: 'left',
        field: (row) =>
          `${row.budget_resource?.code ?? ''} - ${
            row.budget_resource?.description ?? ''
          }`,
        sortable: true,
      },
      {
        name: 'budget_item',
        required: true,
        label: 'Rubro',
        align: 'left',
        field: (row) =>
          `${row.budget_item?.code ?? ''} - ${
            row.budget_item?.description ?? ''
          }`,
        sortable: true,
      },
      {
        name: 'responsibility_area',
        required: true,
        label: 'Área',
        align: 'left',
        field: (row) =>
          `${row.area?.code ?? ''} - ${row.area?.description ?? ''}`,
        sortable: true,
      },
      {
        name: 'code_movement',
        required: true,
        label: 'Código de movimiento',
        align: 'left',
        field: (row) =>
          `${row.code_movement?.code ?? ''} - ${
            row.code_movement?.description ?? ''
          }`,
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const homologationProcessData = ref<IBudgetHomologationProcessData[] | null>(
    null
  )

  const listBudgetAccountingHomologations = async () => {
    homologationProcessData.value = null
    filterConfig.value.forEach((filter) => {
      filter.disable = false
    })
    const currentFilters = {
      'filter[business_trust_range][from]':
        filters.value['filter[from_business_trust]'],
      'filter[business_trust_range][to]':
        filters.value['filter[to_business_trust]'],
      'filter[document_range][from]': filters.value['filter[from_document]'],
      'filter[document_range][to]': filters.value['filter[to_document]'],
      'filter[budget_document_type_id]': filters.value['filter[document_type]'],
      'filter[validity]': filters.value['filter[validity]'],
      page: filters.value.page,
      rows: filters.value.rows,
    }

    tableProperties.value.loading = true
    const budgetAccountingParameters = await _getPendingOperations(
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

  let selectedOperations: IBudgetAccountingHomologationPayload[] = []

  const selectDocuments = (event: {
    rows: number
    selected: IBudgetAccountingHomologationItem[]
  }) => {
    selectedOperations = event.selected.map((item) => ({
      operation_log_id: item.id,
      homologation_date: filters.value['filter[homologation_date]'] as string,
      is_from_operation_log: item.is_from_operation_log,
      validity: filters.value['filter[validity]'] as string,
      confirm_create: false,
    }))
  }

  const hasErrors = ref(false)

  const isRunningValidation = ref(false)
  const validateHomologation = async () => {
    if (selectedOperations.length === 0) return
    isRunningValidation.value = true
    filterConfig.value.forEach((filter) => {
      filter.disable = true
    })
    const payload: IBudgetAccountingHomologationPayload[] = selectedOperations
    homologationProcessData.value = await _runHomologationProcess(payload)
    hasErrors.value = !!homologationProcessData.value?.find(
      (item) => item.errors.length
    )
    tableProperties.value.rows = tableProperties.value.rows
      .map((row) => {
        const operation = homologationProcessData.value?.find(
          (item) => item.document_number === row.id
        )
        if (operation) {
          return {
            ...row,
            status: operation.errors.length ? 30 : 56,
          }
        }
        return row
      })
      .filter((row) => row.status !== undefined)

    tableProperties.value.columns.push({
      name: 'status',
      required: true,
      label: 'Estado',
      align: 'center',
      field: 'id',
    })
    isRunningValidation.value = false
  }

  const confirmHomologationModalRef = ref()

  const confirmHomologation = async () => {
    confirmHomologationModalRef.value.closeModal()
    openMainLoader(true)
    const payload: IBudgetAccountingHomologationPayload[] =
      selectedOperations.map((item) => ({
        ...item,
        confirm_create: true,
      }))
    homologationProcessData.value = await _runHomologationProcess(payload)
    hasErrors.value = !!homologationProcessData.value?.find(
      (item) => item.errors.length
    )
    if (homologationProcessData.value) {
      goToURL('BudgetAccountingHomologationList')
    }
    openMainLoader(false)
  }

  const createHomologation = () => {
    if (hasErrors.value) {
      confirmHomologationModalRef.value.openModal()
      return
    }
    confirmHomologation()
  }

  const downloadErrors = () => {
    _downloadBudgetAccountingHomologationErrors(
      homologationProcessData.value ?? []
    )
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
    hasErrors,
    headerProps,
    filterConfig,
    tableProperties,
    defaultIconsLucide,
    isRunningValidation,
    homologationProcessData,
    confirmHomologationModalRef,
    goToURL,
    updatePage,
    clearFilters,
    handleSearch,
    updatePerPage,
    validateRouter,
    downloadErrors,
    selectDocuments,
    createHomologation,
    confirmHomologation,
    validateHomologation,
  }
}

export default useBudgetAccountingHomologationCreate
