// Vue - Pinia
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionTypeProcess, IBaseTableProps } from '@/interfaces/global'
import {
  IAccountingBusinessConsolidatingItem,
  IAccountingConsolidationAccountingItem,
  IAccountingConsolidationBasicData,
  IAccountingConsolidationChildrenViewItem,
  IAccountingConsolidationDataListDetail,
  IAccountingConsolidationDetailData,
  IAccountingConsolidationFilterList,
  IAccountingConsolidationViewData,
  IAccountingConsolidationViewRow,
} from '@/interfaces/customs/accounting/AccountingConsolidationV2'
import { IFieldFilters } from '@/interfaces/customs'

//Stores
import {
  useAccountingConsolidationStore,
  useAccountingResourceStore,
  useResourceManagerStore,
} from '@/stores'

//Composables
import { useMainLoader } from '@/composables'
import { useGoToUrl } from '@/composables/useGoToUrl'

// Constants
import { consolidation_type_options } from '@/constants/resources'

const useBasicDataForm = (props: {
  action: ActionTypeProcess
  data?: IAccountingConsolidationBasicData | null
}) => {
  const {
    _getDownloadFile,
    _getDownloadDetailsFile,
    _getBusinessAccounting,
    _processAccountingConsolidation,
    _getFilterBusinessConsolidation,
    _getDetailConsolidation,
  } = useAccountingConsolidationStore('v2')
  const {
    business_list,
    business_list_consolidate,
    consolidation_view_data_list,
  } = storeToRefs(useAccountingConsolidationStore('v2'))
  const {
    business_trusts_to_consolidate,
    account_chart_structure_accounting,
    consolidate_status,
  } = storeToRefs(useAccountingResourceStore('v1'))

  // Utils & Refs

  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const validateRef = ref(false)
  const hideFilters = ref<boolean>(true)
  const route = useRoute()
  const disabledBtnDownload = ref<boolean | null>(null)
  const disabledBtn = ref<boolean>(false)
  const structureRefByTable = ref<string>('')
  const businessId = ref<number | null>(null)
  const visibleBtn = ref<boolean>(true)
  const selectedIdConsolidationView = ref<number | string>('')
  const consolidationIdReferenceView = ref<IAccountingConsolidationViewRow>({
    id: 0,
    accounting_structure: '',
    last_update_date: '',
    status: {
      id: 0,
      status: '',
    },
    news: '',
  })

  const disabledBtnsViewExcel = ref<boolean>(false)
  const disabledBtnsViewExcelNovelty = ref<boolean>(false)
  const consolidationId = ref<number | string | null>(null)
  const consolidationHeaderId = ref<number | null | string>('')

  const initialFiltersData: IAccountingConsolidationViewData = {
    id: 0,
    process_code: '',
    date_last_consolidation: '',
    current_period: '',
    account_structure: {
      id: 0,
      code: '',
      description: '',
    },
    from_business: {
      id: 0,
      code: '',
      description: '',
    },
    to_business: {
      id: 0,
      code: '',
      description: '',
    },
    status: {
      id: 0,
      status: '',
    },
    parent_business_consolidations: [],
  }
  const fromBusinessName = ref('')
  const toBusinessName = ref('')
  const filterAndTableRef = ref<boolean>(false)
  useAccountingResourceStore('v1')
  const selectedRows = ref<IAccountingBusinessConsolidatingItem[]>([])
  const { _getResources } = useResourceManagerStore('v1')
  const initialModelsValue: IAccountingConsolidationViewData = {
    id: 0,
    process_code: '',
    date_last_consolidation: '',
    current_period: '',
    account_structure: {
      id: 0,
      code: '',
      description: '',
    },
    from_business: {
      id: 0,
      code: '',
      description: '',
    },
    to_business: {
      id: 0,
      code: '',
      description: '',
    },
    status: {
      id: 0,
      status: '',
    },
    parent_business_consolidations: [],
  }

  const initialDetailsModels: IAccountingConsolidationDetailData = {
    id: 0,
    business_trust: {},
    consolidation_header: {
      id: 0,
      process_code: '',
      date_last_consolidation: '',
      current_period: '',
      status: {
        id: 0,
        status: '',
      },
      account_structure: {
        id: 0,
        code: '',
        description: '',
      },
    },
    executions: [],
  }

  const modelsFilterAccounting = ref<IAccountingConsolidationFilterList>({
    accounting_structure_id: null,
    current_period: '',
    date_to_consolidate: '',
    from_consolidation_business_code: '',
    to_consolidation_business_code: '',
    daily_closing: null,
  })
  const modelsDetail = ref<typeof initialDetailsModels>({
    ...initialDetailsModels,
  })
  const preFilterData = ref<typeof initialFiltersData>({
    ...initialFiltersData,
  })
  const models = ref<typeof initialModelsValue>({ ...initialModelsValue })
  //Firts table render for businesses consolidating
  const tableBusinessesConsolidating = ref<
    IBaseTableProps<IAccountingBusinessConsolidatingItem>
  >({
    title: 'Listado de negocios consolidadores',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: (row) => row.consecutive,
        sortable: true,
      },
      {
        name: 'business_consolidator',
        required: false,
        label: 'Negocio consolidador',
        align: 'left',
        field: (row) => row.business?.concat,
        sortable: true,
      },
      {
        name: 'accounting_structure',
        required: false,
        label: 'Estructura contable',
        align: 'left',
        field: (row) =>
          row.account_structure_relation?.account_structure?.concat,
        sortable: true,
      },
      {
        name: 'number_businesses_consolidated',
        required: false,
        label: 'Cantidad de negocio a consolidar',
        align: 'left',
        field: (row) => row.business?.quantity_children_business,
        sortable: true,
      },
      {
        name: 'date_last_consolidation',
        required: false,
        label: 'Fecha última consolidación',
        align: 'left',
        field: (row) => row.account_structure_relation?.last_consolidation_date,
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: (row) => row?.last_consolidation?.status?.status,
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

  //Second table render for consolidation accounting
  const tableConsolidationAccounting = ref<
    IBaseTableProps<IAccountingConsolidationAccountingItem>
  >({
    title: 'Listado de negocios consolidados',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: (row) => row.id,
        sortable: true,
      },
      {
        name: 'business_consolidated',
        required: false,
        label: 'Negocio consolidador',
        align: 'left',
        field: (row) => row.concat,
        sortable: true,
      },
      {
        name: 'last_consolidation_date',
        required: false,
        label: 'Fecha de última consolidación',
        align: 'left',
        field: (row) =>
          row.consolidation_header?.consolidation?.last_date_consolidate,
        sortable: true,
      },
      {
        name: 'business_consolidated',
        required: false,
        label: 'Negocio consolidado',
        align: 'left',
        field: (row) => row.business_consolidated,
        sortable: true,
      },
      {
        name: 'accounting_structure',
        required: false,
        label: 'Estructura contable',
        align: 'left',
        field: (row) =>
          row.accounting_structure
            ? row.accounting_structure
            : structureRefByTable.value,
        sortable: true,
      },
      {
        name: 'close_type',
        required: false,
        label: 'Tipo de cierre',
        align: 'left',
        field: (row) => row.period_closing,
        sortable: true,
      },
      {
        name: 'period_closing',
        required: false,
        label: 'Periodo cierre',
        align: 'left',
        field: (row) => row.consolidation_header?.close_period,
        sortable: true,
      },
      {
        name: 'last_update_date',
        required: false,
        label: 'Fecha última actualización',
        align: 'left',
        field: (row) =>
          row.consolidation_header?.consolidation?.update_date ?? '',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tableViewConsolidatedAccounting = ref<
    IBaseTableProps<IAccountingConsolidationViewRow>
  >({
    title: 'Listado de negocios consolidadores',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: (row) => row.id,
        sortable: true,
      },
      {
        name: 'business_consolidator',
        required: false,
        label: 'Negocio consolidador',
        align: 'left',
        field: 'concat',
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
        name: 'number_businesses_consolidated',
        required: false,
        label: 'Cantidad de negocio a consolidar',
        align: 'left',
        field: 'quantity_children_business',
        sortable: true,
      },
      {
        name: 'last_update_date',
        required: false,
        label: 'Fecha de última consolidación',
        align: 'left',
        field: (row) => row.last_update_date ?? '',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: (row) => row.status?.status ?? '',
        sortable: true,
      },
      {
        name: 'news',
        required: false,
        label: 'Novedades',
        align: 'left',
        field: (row) => row.news,
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'left',
        field: 'id',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tableDetailAccounting = ref<
    IBaseTableProps<IAccountingConsolidationDetailData>
  >({
    title: '',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: (row) => row.business_trust.id,
        sortable: true,
      },
      {
        name: 'business_consolidator',
        required: false,
        label: 'Negocio consolidador',
        align: 'left',
        field: (row) => row.business_trust.concat,
        sortable: true,
      },
      {
        name: 'accounting_structure',
        required: false,
        label: 'Estructura contable',
        align: 'left',
        field: (row) => row.consolidation_header.account_structure.description,
        sortable: true,
      },
      {
        name: 'number_businesses_consolidated',
        required: false,
        label: 'Cantidad de negocio a consolidar',
        align: 'left',
        field: (row) => row.business_trust.quantity_children_business,
        sortable: true,
      },
      {
        name: 'last_date_consolidation',
        required: false,
        label: 'Fecha de última consolidación',
        align: 'left',
        field: (row) => row.consolidation_header.date_last_consolidation,
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: (row) => row.business_trust.status?.status,
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })
  const tableDetailAccountingShort = ref<
    IBaseTableProps<IAccountingConsolidationDataListDetail>
  >({
    title: 'Historial de ejecuciones',
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
        name: 'business',
        required: false,
        label: 'Negocio consolidador',
        align: 'left',
        field: 'business',
        sortable: true,
      },
      {
        name: 'process_date',
        required: false,
        label: 'Fecha del proceso',
        align: 'left',
        field: 'process_date',
        sortable: true,
      },
      {
        name: 'business_consolidator',
        required: false,
        label: 'Novedad',
        align: 'left',
        field: 'novelty',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tableViewDataChildren = ref<
    IBaseTableProps<IAccountingConsolidationChildrenViewItem>
  >({
    title: 'Listado de negocios consolidados',
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
        name: 'business_consolidation',
        required: false,
        label: 'Negocio consolidado',
        align: 'left',
        field: 'concat',
        sortable: true,
      },
      {
        name: 'closing_type',
        required: false,
        label: 'Tipo de cierre',
        align: 'left',
        field: 'closing_type',
        sortable: true,
      },
      {
        name: 'period_closing',
        required: false,
        label: 'Periodo de cierre',
        align: 'left',
        field: 'period_closing',
        sortable: true,
      },
      {
        name: 'last_date_consolidation',
        required: false,
        label: 'Fecha de última actualización',
        align: 'left',
        field: 'last_date_consolidation',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  //Filter components and ref properties
  const filterFunctionBusiness = (code: string | number) => {
    const BusinessId = business_trusts_to_consolidate.value.find(
      (item) => item.value === code
    )?.id
    businessId.value = BusinessId ?? null
  }

  const filterComponentRef = ref()

  const filterBasicDataConfig = ref<IFieldFilters[]>([
    {
      type: 'q-select',
      name: 'business_id',
      label: 'Negocio consolidador',
      value: null,
      disable: false,
      autocomplete: false,
      options: business_trusts_to_consolidate,
      class: 'col-12 col-md-4',
      placeholder: 'Seleccione',
      clean_value: true,
      onChange: (val: string | number) => filterFunctionBusiness(val),
    },
    {
      type: 'q-date',
      name: 'date_last_consolidate',
      label: 'Fecha última consolidación',
      value: null,
      disable: false,
      autocomplete: false,
      class: 'col-12 col-md-4',
      placeholder: 'AAAA-MM-DD',
      clean_value: true,
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: consolidate_status,
      disable: !visibleBtn,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const filterBasicDataViewConfig = ref<IFieldFilters[]>([
    {
      type: 'q-select',
      name: 'business_id',
      label: 'Negocio consolidador',
      value: null,
      disable: false,
      autocomplete: true,
      options: business_trusts_to_consolidate,
      class: 'col-12 col-md-4',
      placeholder: 'Seleccione',
      clean_value: true,
      onChange: (val: string | number) => filterFunctionBusiness(val),
    },
    {
      type: 'q-select',
      name: 'child_business_id',
      label: 'Negocio consolidado',
      options: business_trusts_to_consolidate,
      value: null,
      disable: false,
      autocomplete: true,
      class: 'col-12 col-md-4',
      placeholder: 'Seleccione',
      clean_value: true,
    },
    {
      type: 'q-date',
      name: 'last_consolidation_date',
      label: 'Fecha de última consolidación',
      value: null,
      disable: false,
      autocomplete: true,
      class: 'col-12 col-md-4',
      placeholder: 'Seleccione',
      clean_value: true,
    },
    {
      name: 'consolidation_status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: consolidate_status,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
  ])

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number | null>
  >({
    page: 1,
    rows: 20,
  })

  const filtersFormatCustom = ref<
    Record<string, string | number | boolean | null>
  >({})

  const handleFilterSearch = async ($filter: Record<string, string>) => {
    delete $filter['filter[business_id]']
    filtersFormatCustom.value = {
      ...filterParams.value,
      ...$filter,
      'filter[business_id]': businessId.value,
    }
    await _getBusinessAccounting(filtersFormatCustom.value)
  }

  const handleFilterSearchView = async ($filters: Record<string, string>) => {
    delete $filters['filter[business_id]']
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }
    const {
      account_structure,
      current_period,
      date_last_consolidation,
      from_business,
      to_business,
    } = preFilterData.value

    filtersFormat.value = {
      ...$filters,
      current_period: current_period || '',
      accounting_structure_id: account_structure?.id?.toString() || '',
      date_to_consolidate: date_last_consolidation || '',
      from_consolidation_business_code: from_business?.code || '',
      to_consolidation_business_code: to_business?.code || '',
      'filter[business_id]': businessId.value,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await _getFilterBusinessConsolidation(
      route.params.id.toString(),
      filtersFormat.value
    )
  }

  const handleClear = () => {
    filtersFormat.value = {
      page: 1,
      rows: 20,
    }
    tableConsolidationAccounting.value.rows = []
    tableBusinessesConsolidating.value.rows = []
  }

  const handleClearPrimaryFilter = () => {
    filtersFormat.value = {
      page: 1,
      rows: 20,
    }
    tableBusinessesConsolidating.value.rows = []
    tableConsolidationAccounting.value.rows = []
    tableViewConsolidatedAccounting.value.rows = []
    modelsFilterAccounting.value = {}
    filterAndTableRef.value = false
  }

  const handleClearView = () => {
    filtersFormat.value = {
      page: 1,
      rows: 20,
    }
    tableViewConsolidatedAccounting.value.rows = []
  }

  const handleShowMoreFilters = () => {
    hideFilters.value = !hideFilters.value
    filterBasicDataViewConfig.value[3].hide = hideFilters.value
    filterBasicDataViewConfig.value[4].hide = hideFilters.value
  }

  const filterParams = computed<Record<string, string | number | boolean>>(
    () => ({
      current_period: modelsFilterAccounting.value.current_period || '',
      accounting_structure_id:
        modelsFilterAccounting.value.accounting_structure_id?.toString() || '',
      date_to_consolidate:
        modelsFilterAccounting.value.date_to_consolidate || '',
      from_consolidation_business_code:
        String(modelsFilterAccounting.value.from_consolidation_business_code) ||
        '',
      to_consolidation_business_code:
        String(modelsFilterAccounting.value.to_consolidation_business_code) ||
        '',
      daily_closing:
        modelsFilterAccounting.value.daily_closing === 'Diario' ? true : false,
    })
  )

  const initialSearchAction = async () => {
    tableConsolidationAccounting.value.rows = []
    tableBusinessesConsolidating.value.rows = []
    visibleBtn.value = true
    openMainLoader(true)
    const resp = await _getBusinessAccounting(filterParams.value)
    if (resp) filterAndTableRef.value = true

    openMainLoader(false)
  }

  const modifyManualOptions = consolidation_type_options.filter(
    (item) => item.label !== 'Todos'
  )

  const obSubmitConsolidate = async () => {
    openMainLoader(true)
    const payload = {
      selected_businesses_id: selectedRows.value.map(
        (item) => item.business?.id || 0
      ),
      ...filterParams.value,
    }

    const resp = await _processAccountingConsolidation(payload)
    if (resp) {
      visibleBtn.value = false
    } else {
      visibleBtn.value = true
    }
    openMainLoader(false)
  }

  const _setValueModel = () => {
    if (!props.data) return
    models.value = props.data as IAccountingConsolidationViewData
    modelsDetail.value = props.data as IAccountingConsolidationDetailData
    preFilterData.value = props.data as IAccountingConsolidationViewData
    tableDetailAccounting.value.rows = [modelsDetail.value]
    tableDetailAccountingShort.value.rows = modelsDetail.value.executions
    consolidationId.value = models.value.id

    tableViewConsolidatedAccounting.value.rows = (
      models.value.parent_business_consolidations || []
    ).map((item) => ({
      id: item.business?.id,
      consolidation_business_code: item.business?.code,
      accounting_structure: item.business?.account?.description,
      number_business_of_consolidated:
        item.business?.quantity_children_business,
      status: item.business?.consolidation?.status,
      concat: item.business?.concat,
      quantity_children_business: item.business?.quantity_children_business,
      news: item.business?.consolidation?.details_novelties,
      last_update_date: item.business?.consolidation?.last_date_consolidate,
    }))
  }
  const downloadExcelFile = async () => {
    if (props.data) {
      await _getDownloadFile(String(models.value.id))
      return
    }
    await _getDownloadFile(String(consolidationHeaderId.value))
  }

  const downloadDetailsExcelFile = async () => {
    if (props.data) {
      await _getDownloadDetailsFile(String(models.value.id))
      return
    }
    await _getDownloadDetailsFile(consolidationHeaderId.value ?? '')
  }

  const selectRows = (event: {
    selected: IAccountingBusinessConsolidatingItem[]
  }) => {
    selectedRows.value = [...event.selected]
  }

  watch(
    () => props.data,
    (val) => {
      if (!val || Object.keys(val).length === 0) return

      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => business_list.value,
    (val) => {
      disabledBtnDownload.value = val.find(
        (item) => item.last_consolidation?.status?.id === 108
      )
        ? true
        : false
      disabledBtn.value = val.find(
        (item) => item.last_consolidation?.status?.id === 85
      )
        ? false
        : true
      tableBusinessesConsolidating.value.rows = val.map((item) => ({
        ...item,
        id: item.account_structure_relation?.id,
        last_consolidation: {
          ...item.last_consolidation,
          status: item.last_consolidation?.status ?? { status: '' },
        },
      }))

      structureRefByTable.value =
        val[0]?.account_structure_relation.account_structure.concat
    },
    {
      deep: true,
    }
  )

  watch(
    () => business_list_consolidate.value,
    (val) => {
      tableConsolidationAccounting.value.rows = val.map(
        (item): IAccountingConsolidationAccountingItem => {
          const last_date_consolidate =
            'last_date_consolidate' in
            (item.consolidation_header?.consolidation ?? {})
              ? (
                  item.consolidation_header?.consolidation as {
                    last_date_consolidate?: string
                  }
                )?.last_date_consolidate ?? ''
              : ''
          const consolidation_obj = {
            ...(item.consolidation_header?.consolidation ?? {}),
            last_date_consolidate,
            update_date:
              (
                item.consolidation_header?.consolidation as
                  | { update_date?: string }
                  | undefined
              )?.update_date ?? '',
          }
          const consolidation_header = item.consolidation_header
            ? {
                ...item.consolidation_header,
                consolidation: consolidation_obj,
              }
            : undefined
          return {
            id: item.consecutive ?? '',
            consolidation_business_code: item.consolidation_business_code ?? '',
            last_consolidation_date: item.last_consolidation_date ?? '',
            business_consolidated: item.business_consolidated ?? '',
            accounting_structure: item.accounting_structure ?? '',
            close_period: item.close_period ?? '',
            period_closing: item.period_closing ?? '',
            current_period: item.current_period ?? '',
            consolidation_header,
            concat: item.concat ?? '',
            close_type: item.close_type ?? item.period_closing ?? '',
            last_update_date: item.last_update_date ?? last_date_consolidate,
          }
        }
      )
    }
  )

  watch(
    () => modelsFilterAccounting.value.accounting_structure_id,
    async (newVal) => {
      if (!newVal) return
      await _getResources(
        {
          accounting: [
            `business_trusts_to_consolidate&filter[structure_id]=${newVal}&filter[current_period]=${modelsFilterAccounting.value.current_period}`,
          ],
        },
        '',
        'v2'
      )
    }
  )

  watch(
    () => modelsFilterAccounting.value.from_consolidation_business_code,
    (newVal) => {
      if (!newVal) {
        toBusinessName.value = ''
        fromBusinessName.value = ''
      }
      const fromBusiness = business_trusts_to_consolidate.value.find(
        (business) =>
          business.value ===
          modelsFilterAccounting.value.from_consolidation_business_code
      )
      const filterVal = business_trusts_to_consolidate.value.find(
        (item) => item.value === newVal
      )
      modelsFilterAccounting.value.daily_closing = filterVal?.period_closing
      fromBusinessName.value = fromBusiness?.name ?? ''
    }
  )

  watch(
    () => modelsFilterAccounting.value.to_consolidation_business_code,
    (newVal) => {
      if (!newVal) {
        toBusinessName.value = ''
      }
      const toBusiness = business_trusts_to_consolidate.value.find(
        (business) =>
          business.value ===
          modelsFilterAccounting.value.to_consolidation_business_code
      )
      toBusinessName.value = toBusiness?.name ?? ''
    }
  )

  watch(
    () => [selectedRows.value, business_list_consolidate.value],
    ([rows, businessListConsolidate]) => {
      if (!rows || rows.length === 0) return

      const businessId =
        (rows[0] as IAccountingBusinessConsolidatingItem).business?.id ??
        rows[0].id

      const filterData = businessListConsolidate.find(
        (item) => item.id === businessId
      )
      consolidationId.value =
        filterData?.consolidation_header?.consolidation?.id ?? null
      consolidationHeaderId.value = filterData?.consolidation_header?.id ?? null
    },
    { deep: true }
  )

  watch(
    () => consolidationIdReferenceView.value,
    async (newVal) => {
      selectedIdConsolidationView.value =
        models.value.parent_business_consolidations[0]?.business.consolidation.id
      disabledBtnsViewExcel.value =
        newVal.status?.status === 'Exitoso' ? true : false
      disabledBtnsViewExcelNovelty.value =
        newVal.status?.status === 'Con novedades' ? true : false

      const resp = await _getDetailConsolidation(
        selectedIdConsolidationView.value
      )
      if (resp) {
        tableViewDataChildren.value.rows = resp.data
      } else [(tableViewDataChildren.value.rows = [])]
    }
  )

  watch(
    () => consolidation_view_data_list.value,
    (newVal) => {
      if (!newVal) return
      tableViewConsolidatedAccounting.value.rows = (
        newVal?.parent_business_consolidations || []
      ).map((item) => ({
        id: item.business?.id,
        consolidation_business_code: item.business?.code,
        accounting_structure: item.business?.account?.description,
        number_business_of_consolidated:
          item.business?.quantity_children_business,
        status: item.business?.consolidation?.status,
        concat: item.business?.concat,
        quantity_children_business: item.business?.quantity_children_business,
        news: item.business?.consolidation?.details_novelties,
        last_update_date: item.business?.consolidation?.last_date_consolidate,
      }))
    },
    { deep: true }
  )

  return {
    validateRef,
    tableBusinessesConsolidating,
    tableConsolidationAccounting,
    tableViewConsolidatedAccounting,
    filterComponentRef,
    filterBasicDataViewConfig,
    filterBasicDataConfig,
    models,
    modelsFilterAccounting,
    account_chart_structure_accounting,
    filterAndTableRef,
    business_trusts_to_consolidate,
    selectedRows,
    toBusinessName,
    fromBusinessName,
    tableDetailAccounting,
    disabledBtnDownload,
    disabledBtn,
    tableDetailAccountingShort,
    consolidationId,
    modelsDetail,
    visibleBtn,
    selectedIdConsolidationView,
    tableViewDataChildren,
    consolidationIdReferenceView,
    modifyManualOptions,
    disabledBtnsViewExcel,
    disabledBtnsViewExcelNovelty,
    handleFilterSearchView,
    obSubmitConsolidate,
    downloadExcelFile,
    downloadDetailsExcelFile,
    initialSearchAction,
    handleFilterSearch,
    selectRows,
    goToURL,
    handleClear,
    handleClearView,
    handleShowMoreFilters,
    handleClearPrimaryFilter,
  }
}

export default useBasicDataForm
