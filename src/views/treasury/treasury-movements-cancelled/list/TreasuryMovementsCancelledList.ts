import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'
import { formatParamsCustom } from '@/utils'
import {
  IFieldFilters,
  FilterFields,
  ICancelledMovementItem,
  IExportMovementCancelledParam,
} from '@/interfaces/customs'
import {
  useFiltersStore,
  useMovementsCancelledStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
import { useAlert, useGoToUrl, useRules, useUtils } from '@/composables'
import moment from 'moment'

const useTreasuryMovementsCancelledList = () => {
  const { setFiltersState } = useFiltersStore()
  const { business_trusts_egreso } = storeToRefs(useTreasuryResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _listMovementsCancelled, _downloadExcelMovementsCancelled } =
    useMovementsCancelledStore('v1')
  const { movements_cancelled_list, movements_cancelled_pages } = storeToRefs(
    useMovementsCancelledStore('v1')
  )
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const keysTreasury = { treasury: ['business_trusts_egreso'] }

  let perPage = 20

  const headerProps = {
    title: 'Consulta de movimientos de tesorería anulados',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      { label: 'Consultas', route: '' },
      {
        label: 'Consulta de movimientos de tesorería anulados',
        route: 'TreasuryMovementsCancelledList',
      },
    ],
  }

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
          filterRef.value.setFieldValueByName('business_from', fromBusinessId)
          filtersFormat.value.business_from = fromBusinessId
        }
      } else {
        filterRef.value.setFieldValueByName('from_business_name', null)
        filterRef.value.setFieldValueByName('business_from', null)
        filtersFormat.value.business_from = null
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
          filterRef.value.setFieldValueByName('business_to', toBusinessId)
          filtersFormat.value.business_to = toBusinessId
        }
      } else {
        filterRef.value.setFieldValueByName('to_business_name', null)
        filterRef.value.setFieldValueByName('business_to', null)
        filtersFormat.value.business_to = null
      }
    }
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_from',
      label: 'Desde negocio*',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-3',
      disable: false,
      options: business_trusts_egreso,
      placeholder: 'Seleccione',
      autocomplete: true,
      onChange: selectedFromBusiness,
    },
    {
      name: 'from_business_name',
      label: 'Nombre del negocio',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'business_to',
      label: 'Hasta negocio*',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-3',
      disable: false,
      options: business_trusts_egreso,
      placeholder: 'Seleccione',
      autocomplete: true,
      onChange: selectedToBusiness,
    },
    {
      name: 'to_business_name',
      label: 'Nombre del negocio',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'period_from',
      label: 'Desde periodo*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'YYYY-MM',
      hide: false,
      mask: 'YYYY-MM',
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
        (v: string) => useRules().date_not_before_year_2000(v, 'YYYY-MM'),
      ],
    },
    {
      name: 'period_to',
      label: 'Hasta periodo*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'YYYY-MM',
      hide: false,
      mask: 'YYYY-MM',
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
        (v: string) => useRules().date_not_before_year_2000(v, 'YYYY-MM'),
      ],
    },
  ])

  const tableProps = ref({
    title: 'Listado de movimientos de tesorería anulados',
    loading: false,
    columns: [
      {
        name: 'index',
        label: '#',
        align: 'left',
        field: (row) => row.rowIndex,
      },
      {
        name: 'business',
        label: 'Negocio',
        align: 'left',
        field: (row) => row.business_information?.formatted_business || 'N/A',
      },
      {
        name: 'original_period',
        label: 'Periodo original',
        align: 'left',
        field: (row) => row.original_movement?.period || 'N/A',
      },
      {
        name: 'original_voucher',
        label: 'Comprobante original',
        align: 'left',
        field: (row) => row.original_movement?.voucher_id || 'N/A',
      },
      {
        name: 'original_consecutive',
        label: 'Consecutivo original',
        align: 'left',
        field: (row) => row.original_movement?.consecutive || 'N/A',
      },
      {
        name: 'original_record',
        label: 'Registro original',
        align: 'left',
        field: (row) => row.original_movement?.registry || 'N/A',
      },
      {
        name: 'cancellation_period',
        label: 'Periodo de anulación',
        align: 'left',
        field: (row) => row.cancellation_movement?.period || 'N/A',
      },
      {
        name: 'cancellation_voucher',
        label: 'Comprobante de anulación',
        align: 'left',
        field: (row) => row.cancellation_movement?.voucher_id || 'N/A',
      },
      {
        name: 'cancellation_consecutive',
        label: 'Consecutivo de anulación',
        align: 'left',
        field: (row) => row.cancellation_movement?.consecutive || 'N/A',
      },
      {
        name: 'cancellation_record',
        label: 'Registro de anulación',
        align: 'left',
        field: (row) => row.cancellation_movement?.registry || 'N/A',
      },
      {
        name: 'cancellation_reason',
        label: 'Motivo de anulación',
        align: 'left',
        field: (row) => row.cancellation_info?.cancellation_reason || 'N/A',
      },
      {
        name: 'cancelled_by',
        label: 'Anulado por',
        align: 'left',
        field: (row) => row.cancellation_info?.cancelled_by || 'N/A',
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: (row) => row,
      },
    ] as QTable['columns'],
    rows: [] as ICancelledMovementItem[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const normalizePeriods = (filters: FilterFields) => {
    const formatted: FilterFields = { ...filters }

    if (formatted['filter[period_from]']) {
      formatted.period_from = String(formatted['filter[period_from]']).replace(
        '-',
        ''
      )
      delete formatted['filter[period_from]']
    }
    if (formatted['filter[period_to]']) {
      formatted.period_to = String(formatted['filter[period_to]']).replace(
        '-',
        ''
      )
      delete formatted['filter[period_to]']
    }

    return formatted
  }

  const filtersFormat = ref<FilterFields>({})

  const handleFilter = ($filters: FilterFields) => {
    delete $filters['filter[from_business_name]']
    delete $filters['filter[to_business_name]']

    const normalized = normalizePeriods($filters)

    filtersFormat.value = {
      ...normalized,
      page: 1,
      rows: perPage,
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    filtersFormat.value.rows = perPage
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value.rows = perPage
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _listMovementsCancelled(filters)
    tableProps.value.loading = false
  }

  const handleClear = () => {
    filtersFormat.value = { page: 1, rows: perPage }
  }

  const handleDownloadExcel = async () => {
    if (!canDownload.value) return

    const params: Record<string, string> = {
      'filter[business_from]': String(
        filtersFormat.value['filter[business_from]'] ||
          filtersFormat.value.business_from ||
          ''
      ),
      'filter[business_to]': String(
        filtersFormat.value['filter[business_to]'] ||
          filtersFormat.value.business_to ||
          ''
      ),
      period_from: String(filtersFormat.value.period_from || '').replace(
        '-',
        ''
      ),
      period_to: String(filtersFormat.value.period_to || '').replace('-', ''),
    }

    await _downloadExcelMovementsCancelled(
      params as unknown as IExportMovementCancelledParam
    )
  }

  const goToShowView = (id: number) => {
    goToURL('TreasuryMovementsCancelledView', id)
  }

  onMounted(async () => {
    _getResources(keysTreasury)
    setFiltersState(filterConfig.value)
  })

  const canDownload = ref(false)

  watch(movements_cancelled_list, (newList) => {
    tableProps.value.rows = newList
    canDownload.value = Array.isArray(newList) && newList.length > 0
  })

  watch(movements_cancelled_list, () => {
    tableProps.value.rows = movements_cancelled_list.value
  })

  watch(
    () => [
      filterRef.value?.getFieldValueByName('period_from'),
      filterRef.value?.getFieldValueByName('period_to'),
    ],
    ([from, to]) => {
      if (from && to) {
        const fromDate = moment(from, 'YYYY-MM', true)
        const toDate = moment(to, 'YYYY-MM', true)

        if (
          fromDate.isValid() &&
          toDate.isValid() &&
          toDate.isBefore(fromDate)
        ) {
          showAlert(
            'El campo "Hasta periodo" no puede ser menor que "Desde periodo"',
            'error'
          )

          filterRef.value?.setFieldValueByName('period_to', null)
        }
      }
    }
  )
  watch(movements_cancelled_list, () => {
    const currentPage = movements_cancelled_pages.value.currentPage || 1
    const rowsPerPage = filtersFormat.value.rows || 20
    const totalItems = movements_cancelled_pages.value.total || 0
    const startIndex = (currentPage - 1) * rowsPerPage

    tableProps.value.rows = movements_cancelled_list.value.map((row, i) => ({
      ...row,
      rowIndex: totalItems - startIndex - i,
    }))
  })

  watch(movements_cancelled_pages, () => {
    tableProps.value.pages = movements_cancelled_pages.value
  })

  onBeforeMount(async () => {
    _resetKeys(keysTreasury)
  })

  return {
    headerProps,
    tableProps,
    filterConfig,
    filterRef,
    canDownload,
    defaultIconsLucide,
    goToShowView,
    handleClear,
    handleFilter,
    updatePage,
    updatePerPage,
    handleDownloadExcel,
  }
}

export default useTreasuryMovementsCancelledList
