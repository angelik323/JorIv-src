import { IFieldFilters, ICheckBankTransfer } from '@/interfaces/customs'
import {
  useCheckBankTransfersStore,
  useFicResourceStore,
  useResourceManagerStore,
} from '@/stores'
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'
import { formatParamsCustom } from '@/utils'
import { QTable } from 'quasar'
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

const useCheckBankTransfersList = () => {
  const { _getCheckBankTransfers, _exportCheckBankTransfers } =
    useCheckBankTransfersStore('v1')
  const { checkBankTransfersList, checkBankTransfersPages, perPage } =
    storeToRefs(useCheckBankTransfersStore('v1'))
  const { offices } = storeToRefs(useFicResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const filtersFormat = ref<Record<string, string | number>>({})
  const bankTransferSelected = ref<ICheckBankTransfer | null>(null)
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()

  const headerProps = {
    title: 'Consulta traslados bancarios',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Consulta traslados bancarios',
        route: 'useCheckBankTransfersList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de consulta traslados bancarios',
    loading: false,
    columns: [
      {
        name: 'select',
        label: '',
        field: 'id',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'transfer_number',
        label: '# Traslado',
        field: 'id',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'status',
        label: 'Estado',
        field: 'status',
        align: 'left',
        format: (_, item) => item.status.id,
        sortable: true,
        required: true,
      },
      {
        name: 'charge',
        label: 'Cargue',
        field: 'charge',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'office',
        label: 'Oficina',
        field: (row: ICheckBankTransfer) =>
          row.name_office ? row.name_office : 'Sin información',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'register_type',
        label: 'Tipo de registro',
        field: 'register_type',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'investment',
        label: 'Inversiones',
        field: 'investment',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'nature',
        label: 'Naturaleza',
        field: 'nature',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'business',
        label: 'Negocio',
        field: 'business',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'register',
        label: 'Registro',
        field: 'register',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'date',
        label: 'Fecha',
        field: 'date',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'movement_code',
        label: 'Movimiento',
        field: 'movement_code',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'bank',
        label: 'Banco',
        field: 'bank',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'bank_account',
        label: 'Cuenta Bancaria',
        field: 'bank_account',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'fund',
        label: 'Fondo',
        field: 'fund',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'investment_plan',
        label: 'Plan de Inversión',
        field: 'investment_plan',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'amount',
        label: 'Valor',
        field: 'amount',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'cost_center',
        label: 'Centro de Costos',
        field: 'cost_center',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'cash_flow',
        label: 'Flujo de Caja',
        field: 'cash_flow',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'foreign_amount',
        label: 'Monto Extranjero',
        field: 'foreign_amount',
        align: 'left',
        sortable: true,
        required: false,
      },
      {
        name: 'currency',
        label: 'Moneda',
        field: 'currency',
        align: 'left',
        sortable: true,
        required: false,
      },
      {
        name: 'trm',
        label: 'TRM',
        field: 'trm',
        align: 'left',
        sortable: true,
        required: false,
      },
    ] as QTable['columns'],
    rows: [] as ICheckBankTransfer[],
    pages: checkBankTransfersPages.value,
    rowsPerPage: perPage.value,
    selection: 'multiple',
    selected: ref([]),
  })

  const originData = computed(() => {
    const details = bankTransferSelected.value?.origin_details
    return [
      [
        {
          label: 'Nombre del negocio',
          value: details?.business_trust?.name || '',
        },
        { label: 'Banco', value: details?.bank?.description || '' },
      ],
      [
        {
          label: 'Fondo',
          value:
            details?.bank_account?.account_number &&
            details?.bank_account?.account_name
              ? `${details?.bank_account?.account_number} - ${details?.bank_account?.account_name}`
              : 'Sin datos',
        },
        {
          label: 'Movimiento',
          value: details?.movement?.description || 'Sin datos',
        },
      ],
      [
        {
          label: 'Centro de costo',
          value: details?.cost_center?.name || 'Sin datos',
        },
        {
          label: 'Flujo de caja',
          value: details?.cash_flow?.name || 'Sin datos',
        },
      ],
    ]
  })

  const destinyData = computed(() => {
    const details = bankTransferSelected.value?.destination_details
    return [
      [
        {
          label: 'Nombre del negocio',
          value: details?.business_trust?.name || '',
        },
        { label: 'Banco', value: details?.bank?.description || '' },
      ],
      [
        {
          label: 'Fondo',
          value:
            details?.bank_account?.account_number &&
            details?.bank_account?.account_name
              ? `${details?.bank_account?.account_number} - ${details?.bank_account?.account_name}`
              : 'Sin datos',
        },
        {
          label: 'Movimiento',
          value: details?.movement?.description || 'Sin datos',
        },
      ],
      [
        {
          label: 'Centro de costo',
          value: details?.cost_center?.name || 'Sin datos',
        },
        {
          label: 'Flujo de caja',
          value: details?.cash_flow?.name || 'Sin datos',
        },
      ],
    ]
  })

  const holidays = ref<string[]>([])

  const handlerHolidays = async (year: number) => {
    holidays.value = await useUtils().getHolidaysByYear(year)
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'start_date',
      label: 'Desde fecha *',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      mask: 'YYYY-MM-DD',
      rules: [
        (val: string) => useRules().is_required(val, 'La fecha es obligatoria'),
        (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
      ],
      navigation_max_year: new Date().getFullYear().toString(),
      navigation_min_year: '1000/01',
      option_calendar: ($event) =>
        useUtils().isDateAllowed($event, holidays.value),
      onNavigation: async ({ year }: { year: number }) => {
        handlerHolidays(year)
      },
    },
    {
      name: 'end_date',
      label: 'Hasta fecha *',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      mask: 'YYYY-MM-DD',
      rules: [
        (val: string) => useRules().is_required(val, 'La fecha es obligatoria'),
        (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
      ],
      navigation_max_year: new Date().getFullYear().toString(),
      navigation_min_year: '1000/01',
      option_calendar: ($event) =>
        useUtils().isDateAllowed($event, holidays.value),
      onNavigation: async ({ year }: { year: number }) => {
        handlerHolidays(year)
      },
    },
    {
      name: 'start_office',
      label: 'Desde oficina',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: offices,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'name_start_office',
      label: 'Nombre oficina',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-6',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'end_office',
      label: 'Hasta oficina',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: offices,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'name_end_office',
      label: 'Nombre oficina',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-6',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
  ])

  const downloadExcel = async (id: number) => {
    const filters = { ...filtersFormat.value }
    filters['filter[id]'] = id
    const queryString = formatParamsCustom(filters)
    await _exportCheckBankTransfers(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: Record<string, string | number>) => {
    bankTransferSelected.value = null
    openMainLoader(true)
    await _getCheckBankTransfers(filters)
    openMainLoader(false)
    tableProps.value.rows = checkBankTransfersList.value
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[start_date]': string
    'filter[end_date]': string
    'filter[start_office]': string
    'filter[name_start_office]': string
    'filter[end_office]': string
    'filter[name_end_office]': string
  }) => {
    const {
      'filter[name_start_office]': _,
      'filter[name_end_office]': __,
      ...restFilters
    } = $filters
    filtersFormat.value = {
      ...restFilters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)
  }

  const handleClear = () => {
    tableProps.value.rows = []
    filterConfig.value.forEach((filter) => {
      filter.value = null
    })
  }

  const filter_component_ref = ref()
  const filterUpdate = ($filters: {
    'filter[start_office]': string
    'filter[end_office]': string
  }) => {
    const start_office = $filters['filter[start_office]']

    if (start_office !== undefined) {
      const start_office_name = offices.value.find(
        (office) => office.value === start_office
      )?.office_description
      filter_component_ref.value.setFieldValueByName(
        'name_start_office',
        start_office_name || ''
      )
    } else {
      filter_component_ref.value.cleanFiltersByNames(['name_start_office'])
    }

    const end_office = $filters['filter[end_office]']
    if (end_office !== undefined) {
      const end_office_name = offices.value.find(
        (office) => office.value === end_office
      )?.office_description

      filter_component_ref.value.setFieldValueByName(
        'name_end_office',
        end_office_name || ''
      )
    } else {
      filter_component_ref.value.cleanFiltersByNames(['name_end_office'])
    }
  }
  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }
  const updateRows = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction(filtersFormat.value)
  }

  const isTreasuryVoucherDisabled = computed(() => {
    const selected = bankTransferSelected.value
    if (!selected) return true

    const origin = selected.origin_details
    const treasury = selected.treasury_movement

    const requiredFields = [
      selected.office_id,
      origin?.business_trust?.id,
      origin?.movement?.receipt_types_id,
      origin?.movement?.sub_receipt_types_id,
      selected.date,
      treasury?.accounting_consecutive,
      treasury?.period,
    ]

    const hasMissingFields = requiredFields.some(
      (field) => field === null || field === undefined
    )

    const isOriginInactive =
      origin?.movement?.receipt_types_status?.status?.toLowerCase() ===
      'inactivo'

    return hasMissingFields || isOriginInactive
  })

  const sendInformationToVoucherTreausury = () => {
    const selected = bankTransferSelected.value
    if (!selected) return

    goToURL('CheckTreasuryReceiptList', undefined, {
      office_id: Number(selected.office_id),
      business_id: selected.origin_details.business_trust?.id,
      original_status: Number('71'),
      original_voucher_id: selected.origin_details.movement?.receipt_types_id,
      original_subvoucher_id:
        selected.origin_details.movement?.sub_receipt_types_id,
      original_date: selected.date,
      original_consecutive:
        selected.treasury_movement?.accounting_consecutive ?? '',
      original_period: selected.treasury_movement?.period ?? '',
    })
  }

  onMounted(() => {
    _getResources({ fics: ['offices'] })
  })

  onBeforeMount(() => {
    handlerHolidays(new Date().getFullYear())
  })

  onBeforeUnmount(() => {
    _resetKeys({ fics: ['offices'] })
  })

  return {
    headerProps,
    filterConfig,
    tableProps,
    originData,
    destinyData,
    filter_component_ref,
    bankTransferSelected,
    handleFilter,
    updateRows,
    updatePage,
    handleClear,
    filterUpdate,
    downloadExcel,
    goToURL,
    sendInformationToVoucherTreausury,
    validateRouter,
    isTreasuryVoucherDisabled,
  }
}

export default useCheckBankTransfersList
