import { IFieldFilters, ITreasuryClosingItem } from '@/interfaces/customs'
import {
  useResourceManagerStore,
  useTreasuryClosingStore,
  useTreasuryResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export const useTreasuryClosingList = () => {
  const router = useRouter()
  const {
    treasury_closing_list,
    treasury_closing_pages,
    treasury_closing_execution_list,
    treasury_closing_execution_pages,
    treasury_closing_execution_id,
    treasury_closing_execution_ended,
  } = storeToRefs(useTreasuryClosingStore('v1'))
  const {
    _getTreasuryClosingList,
    _executeTreasuryClosing,
    _getTreasuryClosingExecutionLogs,
    _resetExecutionKeys,
    _getMinimumDate,
  } = useTreasuryClosingStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { treasury_closing_business } = storeToRefs(
    useTreasuryResourceStore('v1')
  )

  const showState = ref(0)
  const isTreasuryCloseListEmpty = ref(true)
  const fromBusinessSelected = ref()
  const upBusinessSelected = ref()
  const isTreasureExecutionListEmpty = ref(true)
  const interval = ref()

  const perPage = ref(20)

  const perPageExecution = ref(20)
  const filtersComponentRef = ref()

  const keys = ['treasury_closing_business']

  const headerProps = {
    title: 'Cierre de tesorería',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Cierre de tesoreria',
        route: 'treasuryCloseList',
      },
    ],
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: ITreasuryClosingItem[]
    pages: typeof treasury_closing_pages
  }>({
    title: 'Listado de cierres',
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
        name: 'business_code',
        required: false,
        label: 'Codigo',
        align: 'left',
        field: 'business_code',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Negocio',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'type_closing',
        required: false,
        label: 'Tipo de cierre',
        align: 'left',
        field: 'type_closing',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [],
    pages: treasury_closing_pages,
  })

  const assignBankAccountFromBusiness = async (
    business_id: number,
    name: string
  ) => {
    filtersFormat.value[name] = business_id

    if (
      filtersFormat.value['filter[from_business]'] &&
      filtersFormat.value['filter[up_business]']
    ) {
      const filters = `business_from=${filtersFormat.value['filter[from_business]']}&business_end=${filtersFormat.value['filter[up_business]']}`

      const minDate = await _getMinimumDate(filters)
      filtersComponentRef.value?.setFieldValueByName('closing_date', minDate)
    }
  }

  // filter
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'from_business',
      label: 'Desde negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: treasury_closing_business,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => !!val || 'El negocio desde es requerido'],
      onChange: assignBankAccountFromBusiness,
    },
    {
      name: 'from_business_name',
      label: 'Nombre negocio',
      type: 'q-input',
      value: '-',
      class: 'col-12 col-md-6',
      options: [],
      disable: true,
      clean_value: true,
      isForceValue: true,
    },
    {
      name: 'up_business',
      label: 'Hasta negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: treasury_closing_business,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => !!val || 'El negocio hasta es requerido'],
      onChange: assignBankAccountFromBusiness,
    },
    {
      name: 'up_business_name',
      label: 'Nombre negocio',
      type: 'q-input',
      value: '-',
      class: 'col-12 col-md-6',
      options: [],
      disable: true,
      clean_value: true,
      placeholder: '-',
      isForceValue: true,
    },
    {
      name: 'closing_type',
      label: 'Tipo Cierre',
      type: 'q-select',
      value: 'Todos',
      class: 'col-12 col-md-6',
      options: [
        { label: 'Todos', value: 'Todos' },
        { label: 'Diario', value: 'Diario' },
        { label: 'Mensual', value: 'Mensual' },
      ],
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => !!val || 'El tipo de cierre es requerido'],
    },
    {
      name: 'procces',
      label: 'Proceso',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: [
        { label: 'Generar cierre', value: 'Generar cierre' },
        { label: 'Deshacer cierre', value: 'Deshacer cierre' },
      ],
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => !!val || 'El proceso es requerido'],
    },
    {
      name: 'closing_date',
      label: 'Fecha Cierre',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-6',
      options: [],
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => !!val || 'La fecha de cierre es requerida'],
      hide: false,
    },
    {
      name: 'undo_closure',
      label: 'Deshacer Cierre',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-6',
      options: [],
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (val: string) => !!val || 'La fecha de deshacer cierre es requerida',
      ],
      hide: false,
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = async ($filters: {
    'filter[from_business]': number
    'filter[from_business_name]'?: string
    'filter[up_business]': number
    'filter[up_business_name]'?: string
    'filter[closing_type]': string
    'filter[procces]': string
    'filter[closing_date]'?: string
    'filter[undo_closure]'?: string
  }) => {
    delete $filters['filter[from_business_name]']
    delete $filters['filter[up_business_name]']
    if (
      $filters['filter[procces]'] == 'Generar cierre' &&
      $filters['filter[undo_closure]']
    ) {
      delete $filters['filter[undo_closure]']
    }

    if (
      $filters['filter[procces]'] == 'Deshacer cierre' &&
      $filters['filter[closing_date]']
    ) {
      delete $filters['filter[closing_date]']
    }

    filtersFormat.value = {
      ...$filters,
    }
    tableProps.value.loading = true

    await _listAction(filtersFormat.value)
    _resetExecutionKeys()
    clearInterval(interval.value)

    const hasResults = treasury_closing_list.value.length > 0

    showState.value = filtersFormat.value ? 1 : 0
    isTreasuryCloseListEmpty.value = !hasResults
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage.value,
    }
    await _listAction(filtersFormat.value)
  }

  const updateRowsPerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage.value,
    }

    await _listAction(filtersFormat.value)
  }

  const _listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getTreasuryClosingList(filters)
    tableProps.value.loading = false
  }

  const onChangeFilter = async ($filters: {
    'filter[from_business]': number
    'filter[up_business]': number
    'filter[procces]': string
  }) => {
    if ($filters['filter[from_business]']) {
      fromBusinessSelected.value = treasury_closing_business.value.find(
        (b) => b.value === $filters['filter[from_business]']
      )

      if (fromBusinessSelected.value) {
        const index_filter_from_business = filterConfig.value.findIndex(
          (filter) => filter.name == 'from_business_name'
        )
        filterConfig.value[index_filter_from_business].value =
          String(fromBusinessSelected.value.business_name) || null
      }
    }

    if ($filters['filter[up_business]']) {
      upBusinessSelected.value = treasury_closing_business.value.find(
        (b) => b.value === $filters['filter[up_business]']
      )

      if (upBusinessSelected.value) {
        const index_filter_up_business = filterConfig.value.findIndex(
          (filter) => filter.name == 'up_business_name'
        )
        filterConfig.value[index_filter_up_business].value =
          String(upBusinessSelected.value.business_name) || null
      }
    }

    if (
      !$filters['filter[from_business]'] ||
      !$filters['filter[up_business]']
    ) {
      filtersComponentRef.value?.setFieldValueByName('closing_date', null)
    }

    const val_process = $filters['filter[procces]']

    if (val_process != undefined) {
      if (val_process == 'Generar cierre') {
        const index_filter = filterConfig.value.findIndex(
          (filter) => filter.name == 'undo_closure'
        )
        filterConfig.value[index_filter].hide = true

        const index_filter_closing_date = filterConfig.value.findIndex(
          (filter) => filter.name == 'closing_date'
        )
        filterConfig.value[index_filter_closing_date].hide = false
      } else {
        const index_filter = filterConfig.value.findIndex(
          (filter) => filter.name == 'closing_date'
        )
        filterConfig.value[index_filter].hide = true

        const index_filter_undo_closure_date = filterConfig.value.findIndex(
          (filter) => filter.name == 'undo_closure'
        )
        filterConfig.value[index_filter_undo_closure_date].hide = false
      }
    }
  }

  const clearFilters = async () => {
    const index_filter_from_business = filterConfig.value.findIndex(
      (filter) => filter.name == 'from_business_name'
    )
    filterConfig.value[index_filter_from_business].value = '-'

    const index_filter_up_business = filterConfig.value.findIndex(
      (filter) => filter.name == 'up_business_name'
    )
    filterConfig.value[index_filter_up_business].value = '-'
  }

  const businessCodeNameFilterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Codigo o Nombre',
      type: 'q-input',
      value: null,
      class: 'col-12',
      disable: false,
      clean_value: true,
      placeholder: 'Busca por código o nombre',
      rules: [(val: string) => !!val || 'El codigo del negocio es requerido'],
    },
  ])

  const tableExecutionProps = ref<{
    loading: boolean
    columns: QTable['columns']
    rows: ITreasuryClosingItem[]
    pages: typeof treasury_closing_execution_pages
  }>({
    loading: false,
    columns: [
      {
        name: 'execution_procces',
        required: false,
        label: '#',
        align: 'left',
        field: 'execution_procces',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [],
    pages: treasury_closing_execution_pages,
  })

  const handleBusinessCodeNameFilter = async ($filters: {
    'filter[search]': string
  }) => {
    tableProps.value.loading = true
    await _listAction({ ...filtersFormat.value, ...$filters })

    const hasResults = treasury_closing_list.value.length > 0

    showState.value = filtersFormat.value ? 1 : 0
    isTreasuryCloseListEmpty.value = !hasResults
    tableProps.value.loading = false
  }

  const makeDataRequest = () => {
    return {
      procces: filtersFormat.value['filter[procces]'],
      date:
        filtersFormat.value['filter[procces]'] == 'Generar cierre'
          ? filtersFormat.value['filter[closing_date]']
          : filtersFormat.value['filter[undo_closure]'],
      business: [
        {
          id: filtersFormat.value['filter[from_business]'],
        },
        {
          id: filtersFormat.value['filter[up_business]'],
        },
      ],
    }
  }

  const filtersExecutionFormat = ref<Record<string, string | number | null>>({})

  const executeTreasuryClosing = async () => {
    const payload = makeDataRequest()
    await _executeTreasuryClosing(payload)
    if (
      treasury_closing_execution_id.value !== null &&
      filtersFormat.value['filter[procces]'] === 'Generar cierre'
    ) {
      interval.value = setInterval(async () => {
        if (!treasury_closing_execution_ended.value) {
          filtersExecutionFormat.value = {
            ...filtersExecutionFormat.value,
            'filter[closing_id]': treasury_closing_execution_id.value,
          }
          await getExecutionLogs(filtersExecutionFormat.value)
        } else {
          clearInterval(interval.value)
        }
      }, 10000)
    }
  }

  const getExecutionLogs = async (
    $filters: Record<string, string | number | null>
  ) => {
    tableExecutionProps.value.loading = true
    await _getTreasuryClosingExecutionLogs($filters)
    isTreasureExecutionListEmpty.value =
      treasury_closing_execution_list.value.length === 0
    tableExecutionProps.value.loading = false
  }

  const updateExecutionPage = async (page: number) => {
    filtersExecutionFormat.value = {
      ...filtersExecutionFormat.value,
      page: page,
      rows: perPageExecution.value,
    }
    await getExecutionLogs(filtersExecutionFormat.value)
  }

  const updateExecutionRowsPerPage = async (rowsPerPage: number) => {
    perPageExecution.value = rowsPerPage
    filtersExecutionFormat.value = {
      ...filtersExecutionFormat.value,
      rows: perPageExecution.value,
    }

    await getExecutionLogs(filtersExecutionFormat.value)
  }

  const goToSummary = () => {
    router.push({ name: 'TreasuryClosingSummaryList' })
  }

  const goToErrorsSummary = () => {
    router.push({ name: 'TreasuryClosingErrorsSummaryList' })
  }

  watch(
    () => treasury_closing_list.value,
    () => {
      tableProps.value.rows = treasury_closing_list.value
      tableProps.value.pages = treasury_closing_pages.value
    }
  )

  onMounted(async () => _getResources({ treasury: keys }, '', 'v2'))

  onBeforeUnmount(() => {
    _resetKeys({ treasury: keys })
    clearInterval(interval.value)
  })

  return {
    headerProps,
    filtersComponentRef,
    filterConfig,
    handleFilter,
    onChangeFilter,
    clearFilters,
    tableProps,
    updatePage,
    updateRowsPerPage,
    showState,
    isTreasuryCloseListEmpty,
    businessCodeNameFilterConfig,
    tableExecutionProps,
    updateExecutionPage,
    updateExecutionRowsPerPage,
    handleBusinessCodeNameFilter,
    executeTreasuryClosing,
    treasury_closing_execution_list,
    treasury_closing_execution_id,
    isTreasureExecutionListEmpty,
    goToSummary,
    goToErrorsSummary,
  }
}

export default useTreasuryClosingList
