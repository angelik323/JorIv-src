// Vue - pinia
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'

// Interfaces
import { IMovementConsecutivesResponse } from '@/interfaces/customs/treasury/ConsecutiveVoucher'
import { IFieldFilters } from '@/interfaces/customs/Filters'

// Composables - Utils
import { filtersToParams, defaultIcons } from '@/utils'

import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

import { QTable } from 'quasar'

// Store
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useConsecutiveMovementsStore } from '@/stores/treasury/consecutive-movements'

const useConsecutiveVouchersList = () => {
  const {
    receipt_type,
    business_trusts_egreso,
    users_movement_vouchers_request,
  } = storeToRefs(useTreasuryResourceStore('v1'))
  const { consecutiveMovemenPages, consecutiveMovementList } = storeToRefs(
    useConsecutiveMovementsStore('v1')
  )

  const { _getConsecutiveMovementList, _downloadExcelAction } =
    useConsecutiveMovementsStore('v1')
  const { _getResources } = useResourceManagerStore('v1')
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const hideFilters = ref<boolean>(true)

  const headerProps = {
    title: 'Consecutivos de movimientos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Consecutivos de movimientos',
        route: 'ConsecutiveVouchersList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de consecutivo de movimientos',
    loading: false,
    columns: [
      { name: 'id', field: 'id', label: '#', align: 'left', sortable: true },
      {
        name: 'business',
        label: 'Negocio',
        align: 'left',
        field: (row) => row.business?.name ?? '-',
        sortable: true,
      },
      {
        name: 'voucher_type',
        label: 'Tipo de comprobante',
        align: 'left',
        field: (row) => row.voucher?.receipt_type_name ?? '-',
        sortable: true,
      },
      {
        name: 'voucher_number',
        label: 'Número',
        align: 'left',
        field: (row) => row.voucher?.voucher_number ?? '-',
        sortable: true,
      },
      {
        name: 'amount',
        label: 'Valor',
        align: 'left',
        field: (row) => row.amount?.formatted ?? '-',
        sortable: true,
      },
      {
        name: 'currency',
        label: 'Moneda',
        align: 'left',
        field: (row) => row.currency?.code ?? '-',
        sortable: true,
      },
      {
        name: 'movement_date',
        label: 'Fecha comprobante',
        align: 'left',
        field: (row) => row.dates?.movement_date ?? '-',
        sortable: true,
      },
      {
        name: 'created_at',
        label: 'Fecha creación',
        align: 'left',
        field: (row) => row.dates?.created_at ?? '-',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        align: 'left',
        field: (row) => row.status?.name ?? '-',
        sortable: true,
      },
      { name: 'actions', field: 'actions', label: 'Acciones', align: 'center' },
    ] as QTable['columns'],
    rows: [] as IMovementConsecutivesResponse[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const filterRef = ref()
  const selectedFromBusiness = (fromBusinessId: string | null) => {
    if (filterRef.value) {
      if (fromBusinessId) {
        const business = business_trusts_egreso.value.find(
          (item) => item.id === Number(fromBusinessId)
        )
        if (business) {
          filterRef.value.setFieldValueByName(
            'from_business_name',
            business.name
          )
          filterRef.value.setFieldValueByName(
            'from_business_id',
            fromBusinessId
          )
          filtersFormat.value.business_from = fromBusinessId
        }
      } else {
        filterRef.value.setFieldValueByName('from_business_name', null)
        filterRef.value.setFieldValueByName('from_business_id', null)
      }
    }
  }

  const selectedToBusiness = (toBusinessId: string | null) => {
    if (filterRef.value) {
      if (toBusinessId) {
        const business = business_trusts_egreso.value.find(
          (item) => item.id === Number(toBusinessId)
        )
        if (business) {
          filterRef.value.setFieldValueByName('to_business_name', business.name)
          filterRef.value.setFieldValueByName('to_business_id', toBusinessId)
          filtersFormat.value.to_business_id = toBusinessId
        }
      } else {
        filterRef.value.setFieldValueByName('to_business_name', null)
        filterRef.value.setFieldValueByName('to_business_id', null)
      }
    }
  }

  const selectedFromReceiptType = (fromReceiptTypeId: string | null) => {
    if (filterRef.value) {
      if (fromReceiptTypeId) {
        const receipt = receipt_type.value.find(
          (item) => item.value === Number(fromReceiptTypeId)
        )
        if (receipt) {
          filterRef.value.setFieldValueByName(
            'from_receipt_type_name',
            receipt.label
          )
          filterRef.value.setFieldValueByName(
            'from_receipt_type_id',
            fromReceiptTypeId
          )
          filtersFormat.value.from_receipt_type_id = fromReceiptTypeId
        }
      } else {
        filterRef.value.setFieldValueByName('from_receipt_type_name', null)
        filterRef.value.setFieldValueByName('from_receipt_type_id', null)
      }
    }
  }

  const selectedToReceiptType = (toReceiptTypeId: string | null) => {
    if (filterRef.value) {
      if (toReceiptTypeId) {
        const receipt = receipt_type.value.find(
          (item) => item.value === Number(toReceiptTypeId)
        )
        if (receipt) {
          filterRef.value.setFieldValueByName(
            'to_receipt_type_name',
            receipt.label
          )
          filterRef.value.setFieldValueByName(
            'to_receipt_type_id',
            toReceiptTypeId
          )
          filtersFormat.value.to_receipt_type_id = toReceiptTypeId
        }
      } else {
        filterRef.value.setFieldValueByName('to_receipt_type_name', null)
        filterRef.value.setFieldValueByName('to_receipt_type_id', null)
      }
    }
  }

  const holidays = ref<string[]>([])

  const handlerHolidays = async (year: number) => {
    holidays.value = await useUtils().getHolidaysByYear(year)
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'from_business_id',
      label: 'Desde negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trusts_egreso,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: selectedFromBusiness,
    },
    {
      name: 'from_receipt_type_id',
      label: 'Desde comprobante*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: receipt_type,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: selectedFromReceiptType,
    },
    {
      name: 'from_business_name',
      label: 'Nombre negocio',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: 'Nombre negocio',
    },
    {
      name: 'from_receipt_type_name',
      label: 'Nombre comprobante',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: true,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Nombre comprobante',
    },
    {
      name: 'to_business_id',
      label: 'Hasta negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trusts_egreso,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: selectedToBusiness,
    },
    {
      name: 'to_receipt_type_id',
      label: 'Hasta comprobante*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: receipt_type,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: selectedToReceiptType,
    },
    {
      name: 'to_business_name',
      label: 'Nombre negocio',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: true,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Nombre negocio',
    },
    {
      name: 'to_receipt_type_name',
      label: 'Nombre comprobante',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: true,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Nombre comprobante',
    },
    {
      name: 'start_date',
      label: 'Fecha inicial*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-6',
      hide: true,
      disable: false,
      prepend_icon: defaultIcons.magnify,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
        (v: string) => useRules().valid_format_date(v, 'YYYY-MM-DD'),
        (v: string) => useRules().date_before_or_equal_to_the_current_date(v),
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
      name: 'created_by',
      label: 'Creador por',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: users_movement_vouchers_request,
      disable: false,
      hide: true,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'end_date',
      label: 'Fecha hasta*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-6',
      hide: true,
      disable: false,
      prepend_icon: defaultIcons.magnify,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
        (v: string) => useRules().valid_format_date(v, 'YYYY-MM-DD'),
        (v: string) => useRules().date_before_or_equal_to_the_current_date(v),
      ],
      navigation_max_year: new Date().getFullYear().toString(),
      navigation_min_year: '1000/01',
      option_calendar: ($event) =>
        useUtils().isDateAllowed($event, holidays.value),
      onNavigation: async ({ year }: { year: number }) => {
        handlerHolidays(year)
      },
    },
  ])

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const listAction = async (filters: Record<string, string | number>) => {
    const cleanedFilters = { ...filters }

    delete cleanedFilters['filter[from_business_name]']
    delete cleanedFilters['filter[to_business_name]']
    delete cleanedFilters['filter[from_receipt_type_name]']
    delete cleanedFilters['filter[to_receipt_type_name]']
    delete cleanedFilters.from_business_name
    delete cleanedFilters.to_business_name
    delete cleanedFilters.from_receipt_type_name
    delete cleanedFilters.to_receipt_type_name

    const cleaned = filtersToParams(cleanedFilters as Record<string, string>)
    const queryString = formatParamsCustom(cleaned)
    const cleanFilters = Object.fromEntries(new URLSearchParams(queryString))

    tableProps.value.rows = []
    tableProps.value.loading = true

    await _getConsecutiveMovementList(cleanFilters)

    tableProps.value.loading = false
  }

  const handleClearFilters = () => {
    tableProps.value.rows = []
  }

  const handleFilterSearch = async ($filters: Record<string, string>) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }
    await listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }
  const updateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction(filtersFormat.value)
  }

  const onDownloadExcel = async () => {
    const rawFilters = { ...filtersFormat.value }

    delete rawFilters['filter[from_business_name]']
    delete rawFilters['filter[to_business_name]']
    delete rawFilters['filter[from_receipt_type_name]']
    delete rawFilters['filter[to_receipt_type_name]']
    delete rawFilters.from_business_name
    delete rawFilters.to_business_name
    delete rawFilters.from_receipt_type_name
    delete rawFilters.to_receipt_type_name

    const cleaned = filtersToParams(rawFilters as Record<string, string>)
    const paramsTransform = formatParamsCustom(cleaned)

    try {
      openMainLoader(true)
      await _downloadExcelAction(paramsTransform)
    } finally {
      openMainLoader(false)
    }
  }

  const handleShowMoreFilters = () => {
    hideFilters.value = !hideFilters.value
    filterConfig.value[8].hide = hideFilters.value
    filterConfig.value[9].hide = hideFilters.value
    filterConfig.value[10].hide = hideFilters.value
  }

  watch(
    consecutiveMovementList,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } = consecutiveMovemenPages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  onMounted(async () => {
    handlerHolidays(new Date().getFullYear())
    openMainLoader(true)
    await _getResources({
      treasury: ['receipt_type ', 'business_trusts_egreso'],
    })
    await _getResources(
      { treasury: ['users_movement_vouchers_request'] },
      '',
      'v2'
    )

    openMainLoader(false)
  })

  return {
    headerProps,
    tableProps,
    filterConfig,
    filterRef,
    defaultIconsLucide,
    handleFilterSearch,
    updatePage,
    handleClearFilters,
    onDownloadExcel,
    handleShowMoreFilters,
    updateRowsPerPage,
    goToURL,
    validateRouter,
  }
}

export default useConsecutiveVouchersList
