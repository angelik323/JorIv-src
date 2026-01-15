import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { useMainLoader, useRouteValidator } from '@/composables'
import { IAccountingBlockResponse, IFieldFilters } from '@/interfaces/customs'
import {
  useAccountingBlocksStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'

const useAccountingBlocksList = () => {
  const { _getAccountingBlocks, _deleteAccountingBlock } =
    useAccountingBlocksStore('v1')
  const { accounting_blocks_list, accounting_blocks_pages } = storeToRefs(
    useAccountingBlocksStore('v1')
  )

  const { account_structures_block } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const keys = {
    treasury: ['account_structures_block'],
  }

  const headerProps = {
    title: 'Bloques contables',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Bloques contables',
        route: 'AccountingBlocksList',
      },
    ],
    btnLabel: 'Crear',
    btnIcon: defaultIconsLucide.plusCircleOutline,
    btnColor: 'primary',
    btnTextColor: 'white',
    indentation: true,
    contentIndentation: true,
  }

  const tableProps = ref({
    title: 'Listado de bloques contables',
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
        name: 'structure',
        required: false,
        label: 'Estructura contable',
        align: 'left',
        field: 'structure',
        sortable: true,
      },
      {
        name: 'movement',
        required: false,
        label: 'Código movimiento de tesorería',
        align: 'left',
        field: 'movement',
        sortable: true,
      },
      {
        name: 'movement_nature',
        required: false,
        label: 'Naturaleza',
        align: 'left',
        field: 'movement_nature',
        sortable: true,
      },
      {
        name: 'accounting_account',
        required: false,
        label: 'Cuenta contable contrapartida',
        align: 'left',
        field: (row: IAccountingBlockResponse) => {
          const code = row.accounting_account?.code ?? ''
          const name = row.accounting_account?.name ?? ''
          return code || name ? `${code} ${name}`.trim() : ''
        },
        sortable: true,
      },
      {
        name: 'third_type',
        required: false,
        label: 'Tipo de tercero contrapartida',
        align: 'center',
        field: 'third_type',
        sortable: true,
      },
      {
        name: 'third_party',
        required: false,
        label: 'Tercero',
        align: 'left',
        field: (row: IAccountingBlockResponse) => {
          const code = row.third_party?.code ?? ''
          const name = row.third_party?.name ?? ''
          return code || name ? `${code} ${name}`.trim() : ''
        },
        sortable: true,
      },
      {
        name: 'movement_funds_processes',
        required: false,
        label: 'Movimiento para proceso de fondos',
        align: 'center',
        field: 'movement_funds_processes',
        sortable: true,
      },
      {
        name: 'code_movement_funds',
        required: false,
        label: 'Código movimiento fondos',
        align: 'left',
        field: 'code_movement_funds',
        sortable: true,
      },
      {
        name: 'gmf_associate_affects',
        required: false,
        label: 'GMF asociado afecta fondos',
        align: 'center',
        field: 'gmf_associate_affects',
        sortable: true,
      },
      {
        name: 'demand_investment_plan',
        required: false,
        label: 'Exige plan de inversión',
        align: 'center',
        field: 'demand_investment_plan',
        sortable: true,
      },
      {
        name: 'amortizes_funds',
        required: false,
        label: 'Amortiza en los fondos',
        align: 'center',
        field: 'amortizes_funds',
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
    rows: [] as IAccountingBlockResponse[],
    pages: accounting_blocks_pages.value,
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'structure',
      label: 'Estructura contable',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      options: account_structures_block,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscar',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código',
    },
  ])

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    entityId: null as number | null,
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getAccountingBlocks(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[structure]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const handleFilterClear = () => {
    tableProps.value.rows = []
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
    alertModalConfig.value.title = `¿Está seguro que desea ${action} el bloque contable?`
    await alertModalRef.value.openModal()
  }

  const changeStatusAction = async () => {
    if (!alertModalConfig.value.entityId) return

    await alertModalRef.value.closeModal()
    openMainLoader(true)
    await _deleteAccountingBlock(alertModalConfig.value.entityId)
    openMainLoader(false)
  }

  watch(
    () => accounting_blocks_list.value,
    () => {
      tableProps.value.rows = accounting_blocks_list.value
      tableProps.value.pages = {
        ...tableProps.value.pages,
        ...accounting_blocks_pages.value,
      }
    }
  )

  onMounted(async () => {
    _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
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
    changeStatusAction,
    openAlertModal,
    defaultIconsLucide,
    validateRouter,
  }
}

export default useAccountingBlocksList
