// Vue - pinia
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'
import {
  IAccountingBudgetParameterItem,
  IBudgetAccountingParameterItem,
} from '@/interfaces/customs/budget/BudgetAccountingHomologationParameters'
import { IBudgetStructuresGenerate } from '@/interfaces/customs/resources/Accounting'

// Composables
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'

// Stores
import { useBudgetAccountingHomologationParametersStore } from '@/stores/budget/budget-accounting-homologation-parameters'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useRouteValidator } from '@/composables'
const useBudgetAccountingHomologationParametersList = () => {
  const { goToURL } = useGoToUrl()
  const {
    _getAccountingBudgetParameters,
    _getBudgetAccountingParameters,
    _downloadAccountingBudgetParameters,
    _downloadBudgetAccountingParameters,
    _deleteAccountingBudgetParameter,
    _deleteBudgetAccountingParameter,
  } = useBudgetAccountingHomologationParametersStore('v1')

  const { validateRouter } = useRouteValidator()

  const { budget_structures_generate } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide } = useUtils()

  const headerProps = {
    title: 'Parámetros homologación contabilidad vs presupuesto',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Parámetros homologación contabilidad vs presupuesto',
        route: 'BudgetAccountingHomologationParametersList',
      },
    ],
  }

  const budgetStructureFilters = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const businessFilters = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const budgetAccountingFilters = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const accountingBudgetFilters = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_trust',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-12',
      options: [],
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Todos',
    },
  ])

  const budgetStructureTableProperties = ref<
    IBaseTableProps<IBudgetStructuresGenerate & { index: number }>
  >({
    title: 'Estructura general de presupuestos',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'radio',
        label: 'Seleccionar',
        align: 'center',
        field: 'code',
      },
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'index',
        sortable: true,
      },
      {
        name: 'budget_structure',
        required: true,
        label: 'Estructura presupuestal',
        align: 'left',
        field: (row) => `${row.code || ''}`,
        sortable: true,
      },
      {
        name: 'budget_item_structure',
        required: true,
        label: 'Estructura de rubro presupuestal',
        align: 'left',
        field: (row) => `${row.rpp_structure.structure || ''}`,
        sortable: true,
      },
      {
        name: 'budget_resource_structure',
        required: true,
        label: 'Estructura de recurso',
        align: 'left',
        field: (row) => `${row.rcs_structure.structure || ''}`,
        sortable: true,
      },
      {
        name: 'budget_area_structure',
        required: true,
        label: 'Estructura de área',
        align: 'left',
        field: (row) => `${row.area_structure.structure || ''}`,
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  watch(
    () => budget_structures_generate.value,
    () => {
      let index = 0
      budgetStructureTableProperties.value.rows =
        budget_structures_generate.value.map((item) => {
          index += 1
          return {
            ...item,
            index,
          }
        })
    },
    { deep: true }
  )

  interface IBudgetBusinessItem {
    id: number
    business_trust: string
    business_trust_description: string
    accounting_structure: string
    cost_center_structure: string
  }

  const businessTableProperties = ref<IBaseTableProps<IBudgetBusinessItem>>({
    title: 'Negocios asociados',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'radio',
        label: 'Seleccionar',
        align: 'center',
        field: 'id',
      },
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
        label: 'Negocio',
        align: 'left',
        field: (row) => `${row.business_trust ?? ''}`,
        sortable: true,
      },
      {
        name: 'business_trust_description',
        required: true,
        label: 'Descripción del negocio',
        align: 'left',
        field: (row) => `${row.business_trust_description ?? ''}`,
        sortable: true,
      },
      {
        name: 'accounting_structure',
        required: true,
        label: 'Estructura contable',
        align: 'left',
        field: (row) => `${row.accounting_structure ?? ''}`,
        sortable: true,
      },
      {
        name: 'cost_center_structure',
        required: true,
        label: 'Estructura centro de costos',
        align: 'left',
        field: (row) => `${row.cost_center_structure ?? ''}`,
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const accountingBudgetTableProperties = ref<
    IBaseTableProps<IAccountingBudgetParameterItem>
  >({
    title: 'Listado de parámetros homologación contabilidad a presupuesto',
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
        name: 'accounting_account',
        required: true,
        label: 'Cuenta contable',
        align: 'left',
        field: (row) => `${row.accounting_account?.code_account || ''}`,
        sortable: true,
      },
      {
        name: 'nature',
        required: true,
        label: 'Naturaleza',
        align: 'left',
        field: (row) => `${row.nature || ''}`,
        sortable: true,
      },
      {
        name: 'from_cost_center',
        required: true,
        label: 'Desde centro de costo',
        align: 'left',
        field: (row) =>
          `${row.from_cost_center?.code || ''} - ${
            row.from_cost_center?.name || ''
          }`,
        sortable: true,
      },
      {
        name: 'to_cost_center',
        required: true,
        label: 'Hasta centro de costo',
        align: 'left',
        field: (row) =>
          `${row.to_cost_center?.code || ''} - ${
            row.to_cost_center?.name || ''
          }`,
        sortable: true,
      },
      {
        name: 'from_voucher_type',
        required: true,
        label: 'Desde tipo de comprobante',
        align: 'left',
        field: (row) =>
          `${row.from_voucher_type?.value || ''} - ${
            row.from_voucher_type?.label || ''
          }`,
        sortable: true,
      },
      {
        name: 'to_voucher_type',
        required: true,
        label: 'Hasta tipo de comprobante',
        align: 'left',
        field: (row) =>
          `${row.to_voucher_type?.value || ''} - ${
            row.to_voucher_type?.label || ''
          }`,
        sortable: true,
      },
      {
        name: 'from_auxiliary',
        required: true,
        label: 'Desde auxiliar',
        align: 'left',
        field: (row) => `${row.from_auxiliary?.full_name_code || ''}`,
        sortable: true,
      },
      {
        name: 'to_auxiliay',
        required: true,
        label: 'Hasta auxiliar',
        align: 'left',
        field: (row) => `${row.to_auxiliary?.full_name_code || ''}`,
        sortable: true,
      },
      {
        name: 'treasury_movement_code',
        required: true,
        label: 'Código de movimiento tesorería',
        align: 'left',
        field: (row) =>
          `${row.code_movement_treasury?.code || ''} - ${
            row.code_movement_treasury?.description || ''
          }`,
        sortable: true,
      },
      {
        name: 'budget_item',
        required: true,
        label: 'Rubro presupuestal',
        align: 'left',
        field: (row) =>
          `${row.budget_item?.code || ''} - ${
            row.budget_item?.description || ''
          }`,
        sortable: true,
      },
      {
        name: 'budget_resource',
        required: true,
        label: 'Recurso',
        align: 'left',
        field: (row) =>
          `${row.budget_resource?.code || ''} - ${
            row.budget_resource?.description || ''
          }`,
        sortable: true,
      },
      {
        name: 'responsibility_area',
        required: true,
        label: 'Área',
        align: 'left',
        field: (row) =>
          `${row.responsability_area?.code || ''} - ${
            row.responsability_area?.description || ''
          }`,
        sortable: true,
      },
      {
        name: 'document_type',
        required: true,
        label: 'Tipo de documento presupuestal',
        align: 'left',
        field: (row) =>
          `${row.budget_document_type?.code || ''} - ${
            row.budget_document_type?.description || ''
          }`,
        sortable: true,
      },
      {
        name: 'movement_code',
        required: true,
        label: 'Código de movimiento',
        align: 'left',
        field: (row) =>
          `${row.code_movement?.code ?? ''} - ${
            row.code_movement?.description
          }`,
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

  const listAccountingBudgetParameters = async () => {
    accountingBudgetTableProperties.value.loading = true
    const accountingBudgetParameters = await _getAccountingBudgetParameters(
      accountingBudgetFilters.value
    )
    if (accountingBudgetParameters) {
      accountingBudgetTableProperties.value.rows =
        accountingBudgetParameters.list
      accountingBudgetTableProperties.value.pages =
        accountingBudgetParameters.pages
    }
    accountingBudgetTableProperties.value.loading = false
  }

  const listBudgetAccountingParameters = async () => {
    budgetAccountingTableProperties.value.loading = true
    const budgetAccountingParameters = await _getBudgetAccountingParameters(
      budgetAccountingFilters.value
    )
    if (budgetAccountingParameters) {
      budgetAccountingTableProperties.value.rows =
        budgetAccountingParameters.list
      budgetAccountingTableProperties.value.pages =
        budgetAccountingParameters.pages
    }
    budgetAccountingTableProperties.value.loading = false
  }

  const updateAccountingBudgetPage = (page: number) => {
    accountingBudgetFilters.value.page = page
    listBudgetAccountingParameters()
  }

  const updateAccountingBudgetRowsPerPage = (rows: number) => {
    accountingBudgetFilters.value.rows = rows
    accountingBudgetFilters.value.page = 1
    listBudgetAccountingParameters()
  }

  const budgetAccountingTableProperties = ref<
    IBaseTableProps<IBudgetAccountingParameterItem>
  >({
    title: 'Listado de parámetros homologación  presupuesto a contabilidad',
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
        name: 'budget_item',
        required: true,
        label: 'Rubro presupuestal',
        align: 'left',
        field: (row) =>
          `${row.budget_item?.code || ''} - ${
            row.budget_item?.description || ''
          }`,
        sortable: true,
      },
      {
        name: 'responsibility_area',
        required: true,
        label: 'Área',
        align: 'left',
        field: (row) =>
          `${row.responsability_area?.code || ''} - ${
            row.responsability_area?.description || ''
          }`,
        sortable: true,
      },
      {
        name: 'budget_resource',
        required: true,
        label: 'Recurso',
        align: 'left',
        field: (row) =>
          `${row.budget_resource?.code || ''} - ${
            row.budget_resource?.description || ''
          }`,
        sortable: true,
      },
      {
        name: 'budget_document_type',
        required: true,
        label: 'Tipo de documento presupuestal',
        align: 'left',
        field: (row) =>
          `${row.budget_document_type?.code || ''} - ${
            row.budget_document_type?.description || ''
          }`,
        sortable: true,
      },
      {
        name: 'code_movement',
        required: true,
        label: 'Código de movimiento',
        align: 'left',
        field: (row) =>
          `${row.code_movement?.code || ''} - ${
            row.code_movement?.description || ''
          }`,
        sortable: true,
      },
      {
        name: 'voucher_type',
        required: true,
        label: 'Tipo de comprobante',
        align: 'left',
        field: (row) =>
          `${row.voucher_type?.value || ''} - ${row.voucher_type?.label || ''}`,
        sortable: true,
      },
      {
        name: 'sub_voucher_type',
        required: true,
        label: 'Tipo de subcomprobante',
        align: 'left',
        field: (row) =>
          `${row.sub_voucher_type?.value || ''} - ${
            row.sub_voucher_type?.label || ''
          }`,
        sortable: true,
      },
      {
        name: 'nature',
        required: true,
        label: 'Naturaleza',
        align: 'left',
        field: (row) => `${row.nature || ''}`,
        sortable: true,
      },
      {
        name: 'source_accounting_account',
        required: true,
        label: 'Cuenta contable partida',
        align: 'left',
        field: (row) => `${row.source_accounting_account?.code_account || ''}`,
        sortable: true,
      },
      {
        name: 'source_cost_center',
        required: true,
        label: 'Centro de costo partida',
        align: 'left',
        field: (row) =>
          `${row.source_cost_center?.code || ''} - ${
            row.source_cost_center?.name || ''
          }`,
        sortable: true,
      },
      {
        name: 'source_auxiliary',
        required: true,
        label: 'Auxiliar partida',
        align: 'left',
        field: (row) => `${row.source_auxiliary?.full_name_code || ''}`,
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

  const updateBudgetAccountingPage = (page: number) => {
    budgetAccountingFilters.value.page = page
    listBudgetAccountingParameters()
  }

  const updateBudgetAccountingRowsPerPage = (rows: number) => {
    budgetAccountingFilters.value.rows = rows
    budgetAccountingFilters.value.page = 1
    listBudgetAccountingParameters()
  }

  const downloadAccountingBudgetParameters = () => {
    _downloadAccountingBudgetParameters()
  }

  const downloadBudgetAccountingParameters = () => {
    _downloadBudgetAccountingParameters()
  }

  onMounted(async () => {
    _resetKeys({ accounting: ['budget_structures_generate'] })
    _getResources(
      { accounting: ['budget_structures_generate'] },
      'paginate=1',
      'v2'
    )
    listAccountingBudgetParameters()
    listBudgetAccountingParameters()
  })

  const deleteAccountingBudgetParameterModalRef = ref()
  const deleteBudgetAccountingParameterModalRef = ref()

  let paramToDelete: number | null = null

  const openDeleteAccountingBudgetParameterModal = (paramId: number) => {
    paramToDelete = paramId
    deleteAccountingBudgetParameterModalRef.value.openModal()
  }

  const openDeleteBudgetAccountingParameterModal = (paramId: number) => {
    paramToDelete = paramId
    deleteBudgetAccountingParameterModalRef.value.openModal()
  }

  const deleteAccountingBudgetParameter = async () => {
    if (paramToDelete) await _deleteAccountingBudgetParameter(paramToDelete)

    deleteAccountingBudgetParameterModalRef.value.closeModal()
    listAccountingBudgetParameters()
  }

  const deleteBudgetAccountingParameter = async () => {
    if (paramToDelete) await _deleteBudgetAccountingParameter(paramToDelete)

    deleteBudgetAccountingParameterModalRef.value.closeModal()
    listBudgetAccountingParameters()
  }

  return {
    headerProps,
    filterConfig,
    defaultIconsLucide,
    businessTableProperties,
    budgetStructureTableProperties,
    accountingBudgetTableProperties,
    budgetAccountingTableProperties,
    deleteAccountingBudgetParameterModalRef,
    deleteBudgetAccountingParameterModalRef,
    budgetStructureFilters,
    businessFilters,
    goToURL,
    validateRouter,
    updateAccountingBudgetPage,
    updateBudgetAccountingPage,
    updateAccountingBudgetRowsPerPage,
    updateBudgetAccountingRowsPerPage,
    downloadAccountingBudgetParameters,
    downloadBudgetAccountingParameters,
    openDeleteAccountingBudgetParameterModal,
    openDeleteBudgetAccountingParameterModal,
    deleteAccountingBudgetParameter,
    deleteBudgetAccountingParameter,
  }
}

export default useBudgetAccountingHomologationParametersList
