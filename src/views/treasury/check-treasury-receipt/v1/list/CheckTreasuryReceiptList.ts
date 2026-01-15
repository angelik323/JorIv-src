import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { QTable } from 'quasar'
import { IFieldFilters, ICheckTreasuryReceiptList } from '@/interfaces/customs'

import {
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

import {
  useFicResourceStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
  useCheckTreasuryReceiptStore,
} from '@/stores'

const useCheckTreasuryReceiptList = () => {
  const router = useRouter()
  const { formatParamsCustom } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { checkTreasuryReceiptList } = storeToRefs(
    useCheckTreasuryReceiptStore()
  )
  const { _getCheckTreasuryReceipts, _downloadCheckTreasuryReceipts } =
    useCheckTreasuryReceiptStore()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { offices } = storeToRefs(useFicResourceStore('v1'))
  const {
    business_trusts_egreso,
    receipt_type_with_code,
    sub_receipt_type_with_code,
    movement_statuses,
  } = storeToRefs(useTreasuryResourceStore('v1'))
  const { openMainLoader } = useMainLoader()

  const filter_component_ref = ref()
  const filtersFormat = ref<Record<string, string | number | null>>({})
  let perPage = 20
  const isApplyingQueryFilters = ref(false)

  const holidays = ref<string[]>([])
  const selectorSubVoucherQuery = ref<string | null>(null)

  const headerProps = {
    title: 'Consulta movimiento de tesorería',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería' },
      {
        label: 'Consulta movimiento de tesorería',
        route: 'CheckTreasuryReceiptList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de movimientos',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'center',
        sortable: true,
        required: true,
      },
      {
        name: 'number',
        label: 'Nro',
        field: 'number',
        align: 'center',
        sortable: true,
        required: true,
      },
      {
        name: 'registry',
        label: 'Registro',
        field: 'registry',
        align: 'center',
        sortable: true,
        required: true,
      },
      {
        name: 'movement',
        label: 'Movimiento',
        field: (row) => `${row.movement?.code} - ${row.movement?.description}`,
        align: 'center',
        sortable: true,
        required: true,
      },
      {
        name: 'bank',
        label: 'Banco',
        field: (row) =>
          row.bank
            ? `${row.bank.code} - ${row.bank.description}`
            : 'Sin información',
        align: 'center',
        sortable: true,
        required: true,
      },
      {
        name: 'account',
        label: 'Cuenta',
        field: (row) =>
          `${row.account?.account_number} - ${row.account?.account_type}`,

        align: 'center',
        sortable: true,
        required: true,
      },
      {
        name: 'date',
        label: 'Fecha',
        field: 'date',
        align: 'center',
        sortable: true,
        required: true,
      },
      {
        name: 'nature',
        label: 'Naturaleza',
        field: 'nature',
        align: 'center',
        sortable: true,
        required: true,
      },
      {
        name: 'amount',
        label: 'Valor',
        field: (row: ICheckTreasuryReceiptList) =>
          row.amount ? `${row.amount.formatted}` : '',
        align: 'center',
        sortable: true,
        required: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'center',
        sortable: false,
        required: false,
      },
    ] as QTable['columns'],
    rows: [] as ICheckTreasuryReceiptList[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
    rowsPerPage: perPage,
    selection: 'multiple',
  })

  const setOffice = (office_id: string, fromQuery = false) => {
    const office = offices.value.find(
      (off) => Number(off.value) === Number(office_id)
    )

    if (!office) {
      ;['office_id', 'office_name'].forEach((field) =>
        filter_component_ref.value.setFieldValueByName(field, null)
      )
      return
    }

    filter_component_ref.value.setFieldValueByName('office_id', office.value)
    filter_component_ref.value.setFieldValueByName(
      'office_name',
      office.office_description
    )

    if (fromQuery) {
      filter_component_ref.value.setVisualValueByName?.('office_id', {
        label: `${office.office_code} - ${office.office_description}`,
        value: office.value,
      })
    }
  }

  const setBusiness = (business_id: string, fromQuery = false) => {
    const business = business_trusts_egreso.value.find(
      (bus) => Number(bus.value) === Number(business_id)
    )

    if (!business) {
      ;['business_id', 'business_name', 'consecutive'].forEach((field) =>
        filter_component_ref.value.setFieldValueByName(field, null)
      )
      return
    }

    filter_component_ref.value.setFieldValueByName(
      'business_id',
      business.value
    )
    filter_component_ref.value.setFieldValueByName(
      'business_name',
      business.name
    )

    if (fromQuery) {
      filter_component_ref.value.setVisualValueByName?.('business_id', {
        label: `${business.business_code} - ${business.name}`,
        value: business.value,
      })
      return
    }

    if (isApplyingQueryFilters.value) return

    filter_component_ref.value.setFieldValueByName('consecutive', null)
    filter_component_ref.value.setVisualValueByName?.('consecutive', null)
  }

  const setReceiptType = async (receipt_type_id: string, fromQuery = false) => {
    const receipt = receipt_type_with_code.value.find(
      (rec) => Number(rec.value) === Number(receipt_type_id)
    )

    if (!receipt) {
      filter_component_ref.value.setFieldValueByName(
        'sub_receipt_type_id',
        null
      )
      filter_component_ref.value.setFieldValueByName('voucher_subname', null)
      filter_component_ref.value.setFieldValueByName('voucher_name', null)
      sub_receipt_type_with_code.value = []
      return
    }

    filter_component_ref.value.setFieldValueByName(
      'receipt_type_id',
      receipt.value
    )
    filter_component_ref.value.setFieldValueByName('voucher_name', receipt.name)

    if (fromQuery) {
      filter_component_ref.value.setVisualValueByName?.('receipt_type_id', {
        label: receipt.label,
        value: receipt.value,
      })
    }

    await _getResources(
      { treasury: ['sub_receipt_type'] },
      `receipt_type_id=${receipt_type_id}`
    )

    if (sub_receipt_type_with_code.value.length === 1) {
      const sub = sub_receipt_type_with_code.value[0]
      filter_component_ref.value.setFieldValueByName(
        'sub_receipt_type_id',
        sub.value
      )
      filter_component_ref.value.setFieldValueByName(
        'voucher_subname',
        sub.label
      )

      if (fromQuery) {
        filter_component_ref.value.setVisualValueByName?.('sub_receipt_type_id')
      }
    }
    if (sub_receipt_type_with_code.value.length > 1) {
      const sub = sub_receipt_type_with_code.value.find(
        (rec) => Number(rec.value) === Number(selectorSubVoucherQuery.value)
      )

      filter_component_ref.value.setFieldValueByName(
        'sub_receipt_type_id',
        sub?.value
      )
      filter_component_ref.value.setFieldValueByName('voucher_subname', null)
    }
  }

  const setRecordStatus = (record_status_id: string, fromQuery = false) => {
    const status = movement_statuses.value.find(
      (st) => Number(st.value) === Number(record_status_id)
    )

    if (!status) return

    filter_component_ref.value.setFieldValueByName(
      'record_status_id',
      status.value
    )
    filter_component_ref.value.setFieldValueByName(
      'record_status_name',
      status.label
    )

    if (fromQuery) {
      filter_component_ref.value.setVisualValueByName?.('record_status_id', {
        label: status.label,
        value: status.value,
      })
    }
  }

  const handlerHolidays = async (year: number) => {
    holidays.value = await useUtils().getHolidaysByYear(year)
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 q-py-md',
      options: business_trusts_egreso,
      disable: false,
      rules: [
        (val: string) => useRules().is_required(val, 'El negocio es requerido'),
      ],
      onChange: (value: string) => {
        setBusiness(value, false)
      },
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'business_name',
      label: 'Nombre negocio',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 q-py-md',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'movement_date',
      label: 'Fecha*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 q-py-md',
      disable: false,
      clean_value: true,
      placeholder: 'YYYY-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (val: string) =>
          useRules().is_required(val, 'La fecha de movimiento es requerida'),
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
      name: 'period',
      label: 'Periodo*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 q-py-md',
      clean_value: true,
      placeholder: 'YYYY-MM',
      disable: false,
      mask: 'YYYY-MM',
      rules: [
        (val: string) => useRules().is_required(val, 'El periodo es requerido'),
      ],
    },
    {
      name: 'receipt_type_id',
      label: 'Comprobante*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 q-py-md',
      options: receipt_type_with_code,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (val: string) =>
          useRules().is_required(val, 'El comprobante es requerido'),
      ],
      onChange: setReceiptType,
      autocomplete: true,
    },
    {
      name: 'voucher_name',
      label: 'Nombre comprobante',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 q-py-md',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'sub_receipt_type_id',
      label: 'Sub Comprobante*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 q-py-md',
      options: sub_receipt_type_with_code,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (val: string) =>
          useRules().is_required(val, 'El sub comprobante es requerido'),
      ],
      autocomplete: true,
    },
    {
      name: 'consecutive',
      label: 'Consecutivo*',
      type: 'q-input',
      rules: [
        (val: string) =>
          useRules().is_required(val, 'El consecutivo es requerido'),
        (val: string) => useRules().only_number(val),
        (val: string) => useRules().max_length(val, 8),
      ],
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 q-py-md',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
    },
    {
      name: 'office_id',
      label: 'Oficina*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      options: offices,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: setOffice,
      rules: [
        (val: string) => useRules().is_required(val, 'La oficina es requerida'),
      ],
      autocomplete: true,
    },
    {
      name: 'office_name',
      label: 'Nombre oficina',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'record_status_id',
      label: 'Estado registro*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      options: movement_statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (val: string) =>
          useRules().is_required(val, 'El estado de registro es requerido'),
      ],
    },
  ])

  const listAction = async (filters: string) => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getCheckTreasuryReceipts(filters)
    tableProps.value.rows = checkTreasuryReceiptList.value
    tableProps.value.loading = false
  }

  const handleFilter = ($filters: Record<string, string>) => {
    if ($filters['filter[period]']) {
      $filters['filter[period]'] = (
        $filters['filter[period]'] as string
      ).replace(/-/g, '')
    }
    const {
      'filter[business_name]': _,
      'filter[voucher_name]': __,
      'filter[office_name]': ___,
      ...restFilters
    } = $filters
    filtersFormat.value = { ...restFilters }
    let queryString = formatParamsCustom(filtersFormat.value)
    queryString = queryString.replace(/filter\[(.*?)\]=/g, '$1=')
    if (queryString.startsWith('&')) queryString = queryString.slice(1)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePage = (page: number) => {
    filtersFormat.value = { ...filtersFormat.value, page, rows: perPage }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = { ...filtersFormat.value, rows: perPage, page: 1 }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const handleClear = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  const handleGoToView = (id: number) => {
    router.push({ name: 'CheckTreasuryReceiptView', params: { id } })
  }

  const downloadAction = async () => {
    openMainLoader(true)
    const filters = { ...filtersFormat.value }
    filters['filter[period]'] = filters['filter[period]']
      ? (filters['filter[period]'] as string).replace(/-/g, '')
      : null
    const queryString = formatParamsCustom(filters)
    let cleanQuery = queryString.replace(/filter\[(.*?)\]=/g, '$1=')
    if (cleanQuery.startsWith('&')) cleanQuery = cleanQuery.slice(1)
    cleanQuery += (cleanQuery ? '&' : '') + 'format=xls&limit=1000'
    await _downloadCheckTreasuryReceipts('?' + cleanQuery)
    openMainLoader(false)
  }
  const route = useRoute()

  const loadResources = async () => {
    await _getResources({
      fics: ['offices'],
      treasury: ['business_trusts_egreso', 'receipt_type'],
    })

    await _getResources({ treasury: ['movement_statuses'] }, '', 'v2')
  }

  const applyQueryFilters = async () => {
    const query = route.query
    if (Object.keys(query).length === 0) return

    isApplyingQueryFilters.value = true
    await nextTick()

    const prefix = query.annulled_date ? 'annulled' : 'original'

    const mapKeys: Record<string, string> = {
      [`${prefix}_date`]: 'movement_date',
      [`${prefix}_period`]: 'period',
      [`${prefix}_voucher_id`]: 'receipt_type_id',
      [`${prefix}_subvoucher_id`]: 'sub_receipt_type_id',
      [`${prefix}_consecutive`]: 'consecutive',
      [`${prefix}_status`]: 'record_status_id',
      business_id: 'business_id',
      office_id: 'office_id',
    }

    const filters: Record<string, string> = {}

    filterConfig.value.forEach((f) => {
      const queryKey = Object.keys(mapKeys).find((k) => mapKeys[k] === f.name)
      if (queryKey && query[queryKey] !== undefined) {
        const val = query[queryKey] as string
        filter_component_ref.value.setFieldValueByName(f.name, val)
        filters[`filter[${f.name}]`] = val
      }
    })

    filtersFormat.value = { ...filters }

    if (query.business_id) await setBusiness(query.business_id as string, true)
    if (query.office_id) await setOffice(query.office_id as string, true)
    if (filterConfig.value[4].value && query[`${prefix}_voucher_id`]) {
      await setReceiptType(query[`${prefix}_voucher_id`] as string, true)
    }
    if (query[`${prefix}_status`])
      setRecordStatus(query[`${prefix}_status`] as string, true)

    handleFilter(filters)
    selectorSubVoucherQuery.value = query[`${prefix}_subvoucher_id`]
      ? (query[`${prefix}_subvoucher_id`] as string)
      : null
    setTimeout(() => {
      isApplyingQueryFilters.value = false
    }, 300)
  }
  onMounted(async () => {
    await loadResources()
    applyQueryFilters()
  })

  onBeforeUnmount(() => {
    _resetKeys({
      fics: ['offices'],
      treasury: [
        'business_trusts_egreso',
        'receipt_type',
        'movement_statuses',
        'sub_receipt_type',
      ],
    })
  })

  watch(
    () => checkTreasuryReceiptList,
    () => {
      tableProps.value.rows = checkTreasuryReceiptList.value
    },
    { deep: true }
  )

  return {
    headerProps,
    filterConfig,
    tableProps,
    filter_component_ref,
    handleFilter,
    handleClear,
    updatePage,
    updatePerPage,
    handleGoToView,
    downloadAction,
    validateRouter,
  }
}

export default useCheckTreasuryReceiptList
