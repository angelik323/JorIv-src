//Vue - Pinia
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

//Quasar
import { QTable } from 'quasar'
//Interfaces
import { IFieldFilters, IQueryMovementAccount } from '@/interfaces/customs'
//Composables
import { useRules, useUtils, useRouteValidator } from '@/composables'

//Stores
import {
  useAccountingResourceStore,
  useQueryMovementAccountStore,
  useResourceManagerStore,
} from '@/stores/'

export const useQueryMovementAccountsList = () => {
  const { query_movement_account_pages, query_movement_list, excel_data_url } =
    storeToRefs(useQueryMovementAccountStore('v1'))
  const { _getUrlReport, _getQueryMovementAccounts, _downloadFile } =
    useQueryMovementAccountStore('v1')

  const {
    business_trusts_with_description,
    structure_by_business,
    accounting_chart_operative_by_structure,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { formatParamsCustom } = useUtils()
  const idReference = ref('')
  const filtersRef = ref()
  const { validateRouter } = useRouteValidator()
  let perPage = 20
  const headerProps = {
    title: 'Consulta de movimientos por cuenta',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Consulta de movimientos por cuenta',
        route: 'QueryMovementAccountsList',
      },
    ],
  }
  const filtersFormat = ref<Record<string, string | number | null>>({})

  const selectBusiness = async (business_id: number) => {
    filtersFormat.value['filter[business_trust_id]'] = business_id
    filtersRef.value.cleanFiltersByNames([
      'accounting_structure_id',
      'account_id',
    ])
    _resetKeys({
      accounting: [
        'structure_by_business',
        'accounting_chart_operative_by_structure',
      ],
    })
    if (!business_id) {
      filtersRef.value.setFieldValueByName('accounting_structure_id', null)
      return
    }

    await _getResources({
      accounting: [`structure_by_business&filter[business_id]=${business_id}`],
    })

    if (!structure_by_business.value?.length) return

    const selectedStructure = structure_by_business.value[0]
    filtersRef.value.setFieldValueByName(
      'accounting_structure_id',
      selectedStructure.value
    )
    await _getResources({
      accounting: [
        `accounting_chart_operative_by_structure&filter[account_structures_id]=${selectedStructure.value}`,
      ],
    })
  }

  const filters = ref<IFieldFilters[]>([
    {
      name: 'business_trust_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      options: business_trusts_with_description,
      class: 'col-12 col-md-4',
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: selectBusiness,
      rules: [(v: string) => useRules().is_required(v)],
    },
    {
      name: 'accounting_structure_id',
      label: 'Estructura*',
      type: 'q-select',
      options: structure_by_business,
      value: '',
      class: 'col-12 col-md-4',
      disable: true,
      clean_value: true,
      autocomplete: true,
      placeholder: '-',
    },
    {
      name: 'account_id',
      label: 'Cuenta*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: accounting_chart_operative_by_structure,
      disable: false,
      autocomplete: true,
      clean_value: false,
      placeholder: 'Seleccione',
      rules: [(v: string) => useRules().is_required(v)],
    },
    {
      name: 'from_period',
      label: 'Desde periodo*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      hide: true,
      placeholder: 'AAAA-MM',
      mask: 'YYYY-MM',
      rules: [(v: string) => useRules().is_required(v)],
    },
    {
      name: 'to_period',
      label: 'Hasta periodo*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      hide: true,
      placeholder: 'AAAA-MM',
      mask: 'YYYY-MM',
      rules: [(v: string) => useRules().is_required(v)],
    },
  ])

  const handleShowMoreFilters = (showMore: boolean) => {
    const hiddenFilters = ['to_period', 'from_period']
    filters.value.forEach((field) => {
      if (hiddenFilters.includes(field.name)) {
        field.hide = !showMore
      }
    })
  }

  const getReportIdFromExcelUrl = (url: string): string => {
    if (!url) return ''
    const matchUrl = url.match(/\/get-url-report\/([^\/?#]+)/)
    if (!matchUrl) return ''
    return matchUrl[1]
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IQueryMovementAccount[]
    pages: typeof query_movement_account_pages
    rowsPerPage: number
  }>({
    title: 'Listado de movimientos de cuentas',
    loading: false,
    columns: [
      {
        name: 'period',
        required: false,
        label: 'Periodo',
        align: 'left',
        field: 'period',
        sortable: true,
      },
      {
        name: 'account_code',
        required: false,
        label: 'Cuenta',
        align: 'left',
        field: 'account_code',
        sortable: true,
      },
      {
        name: 'account_name',
        required: false,
        label: 'Nombre de la cuenta',
        align: 'right',
        field: 'account_name',
        sortable: true,
      },
      {
        name: 'voucher_id',
        required: false,
        label: 'Comprobante',
        align: 'center',
        field: 'voucher_id',
        sortable: false,
      },
      {
        name: 'sub_receipt_type',
        required: false,
        label: 'Subtipo de comprobante',
        align: 'center',
        field: 'sub_receipt_type',
        sortable: false,
      },
      {
        name: 'consecutive',
        required: false,
        label: 'Consecutivo',
        align: 'center',
        field: 'consecutive',
        sortable: false,
      },
      {
        name: 'registration_date',
        required: false,
        label: 'Fecha',
        align: 'center',
        field: 'registration_date',
        sortable: false,
      },
      {
        name: 'auxiliary',
        required: false,
        label: 'Auxiliar',
        align: 'center',
        field: 'auxiliary',
        sortable: false,
      },
      {
        name: 'cost_center',
        required: false,
        label: 'Centro de costo',
        align: 'center',
        field: 'cost_center',
        sortable: false,
      },
      {
        name: 'debit',
        required: false,
        label: 'Debito',
        align: 'center',
        field: 'debit',
        sortable: false,
      },
      {
        name: 'credit',
        required: false,
        label: 'Crédito',
        align: 'center',
        field: 'credit',
        sortable: false,
      },
      {
        name: 'foreign_currency',
        required: false,
        label: 'Moneda extranjera',
        align: 'center',
        field: 'foreign_currency',
        sortable: false,
      },
      {
        name: 'detail',
        required: false,
        label: 'Detalle del registro',
        align: 'center',
        field: 'detail',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [],
    pages: query_movement_account_pages,
    rowsPerPage: 20,
  })

  const handleFilter = async ($filters: {
    business_trust_id: number | string
    accounting_structure_id: number | string
    account_id: number | string
    from_period: number | string
    to_period: number | string
  }) => {
    filtersFormat.value = {
      ...$filters,
      rows: perPage,
      page: filtersFormat.value.page || 1,
    }
    listAction()
  }

  const downloadTemplate = async () => {
    const urlObtained = await _getUrlReport(idReference.value)
    if (!urlObtained) return

    const downloaded = await _downloadFile()
    if (!downloaded) return

    handleClear()
  }

  const handleClear = () => {
    tableProps.value.rows = []
    filtersFormat.value = {}
  }

  const listAction = async () => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    const cleanedFilters: Record<string, string | number | null> = {}
    Object.entries(filtersFormat.value).forEach(([key, value]) => {
      const match = RegExp(/^filter\[(.+)\]$/).exec(key)
      if (match) {
        cleanedFilters[match[1]] = value
      } else {
        cleanedFilters[key] = value
      }
    })
    cleanedFilters.paginate = 1
    const queryString = formatParamsCustom(cleanedFilters)
    await _getQueryMovementAccounts(queryString ? '&' + queryString : '')
    tableProps.value.loading = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value = { ...filtersFormat.value, page, rows: perPage }
    listAction()
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = { ...filtersFormat.value, rows: perPage, page: 1 }
    listAction()
  }

  onMounted(async () => {
    await _getResources({
      accounting: ['business_trusts_with_description', 'template'],
    })
  })

  onUnmounted(() => {
    _resetKeys({
      accounting: ['business_trusts_with_description', 'template'],
    })
  })

  watch(
    () => excel_data_url.value,
    (urlVal) => {
      idReference.value = getReportIdFromExcelUrl(urlVal)
    }
  )

  watch(
    () => query_movement_list.value,
    () => {
      tableProps.value.rows = query_movement_list.value
    }
  )

  return {
    headerProps,
    filters,
    tableProps,
    filtersRef,
    validateRouter,
    handleShowMoreFilters,
    handleFilter,
    handleClear,
    updatePage,
    updatePerPage,
    downloadTemplate,
  }
}
