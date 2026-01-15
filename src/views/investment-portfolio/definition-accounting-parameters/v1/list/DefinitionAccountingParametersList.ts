import {
  // IDefinitionAccountingParametersForm,
  IDefinitionAccountingParametersList,
  IFieldFilters,
} from '@/interfaces/customs'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { useDefinitionAccountingParametersStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { useMainLoader, useRouteValidator } from '@/composables'
import {
  useResourceManagerStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'

const useDefinitionAccountingParametersList = () => {
  const {
    _getDefinitionAccountingParameters,
    _deleteDefinitionAccountingParameters,
    _clearData,
  } = useDefinitionAccountingParametersStore('v1')
  const {
    definition_accounting_parameters_list,
    definition_accounting_parameters_pages,
  } = storeToRefs(useDefinitionAccountingParametersStore('v1'))

  const { paper_type, class_investment } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const keys = {
    investment_portfolio: ['paper_type', 'class_investment'],
  }

  const headerProps = {
    title: 'Parámetros contables',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
        route: '',
      },
      {
        label: 'Parámetros contables',
        route: 'DefinitionAccountingParametersList',
      },
    ],
    btnLabel: 'Crear',
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'paper_type',
      label: 'Tipo de papel',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-12 col-lg-4',
      options: paper_type,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'class_investment',
      label: 'Tipo de inversión',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-12 col-lg-4',
      options: class_investment,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscar',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-12 col-lg-4',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código',
    },
  ])

  const tableProps = ref({
    title: 'Listado de parámetros contables definidos',
    loading: false,
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
        name: 'system_code',
        required: false,
        label: 'Sistema',
        align: 'left',
        field: 'system_code',
        sortable: true,
      },
      {
        name: 'business_group',
        required: false,
        label: 'Grupo de negocio',
        align: 'left',
        field: 'business_group',
        sortable: true,
      },
      {
        name: 'accounting_structure',
        required: false,
        label: 'Estructura contable',
        align: 'left',
        field: 'accounting_structure',
        sortable: true,
      },
      {
        name: 'cost_center',
        required: false,
        label: 'Centro de costos',
        align: 'left',
        field: 'cost_center',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [] as IDefinitionAccountingParametersList,
    pages: definition_accounting_parameters_pages.value,
  })

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    entityId: null as number | null,
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getDefinitionAccountingParameters(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[paper_type]': string
    'filter[class_investment]'?: string
    'filter[search]': string
    [key: string]: string | undefined
  }) => {
    const filters = { ...$filters }
    if (filters['filter[class_investment]']) {
      filters['filter[investment_class]'] = filters['filter[class_investment]']
      delete filters['filter[class_investment]']
    }

    filtersFormat.value = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined)
    ) as Record<string, string | number>

    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const handleFilterClear = () => {
    filtersFormat.value = {}
    listAction()
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const openAlertModal = async (action: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.title = `¿Está seguro que desea ${action} el parámetro contable?`
    await alertModalRef.value.openModal()
  }

  const handleDeleteAction = async () => {
    if (!alertModalConfig.value.entityId) return

    await alertModalRef.value.closeModal()
    openMainLoader(true)
    await _deleteDefinitionAccountingParameters(alertModalConfig.value.entityId)
    openMainLoader(false)
  }

  watch(
    () => definition_accounting_parameters_list.value,
    () => {
      tableProps.value.rows = definition_accounting_parameters_list.value
      tableProps.value.pages = {
        ...tableProps.value.pages,
        ...definition_accounting_parameters_pages.value,
      }
    }
  )

  onMounted(async () => {
    _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _clearData()
  })

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
    handleFilter,
    handleFilterClear,
    updatePage,
    updatePerPage,
    alertModalRef,
    alertModalConfig,
    handleDeleteAction,
    openAlertModal,
    defaultIconsLucide,
    validateRouter,
  }
}

export default useDefinitionAccountingParametersList
