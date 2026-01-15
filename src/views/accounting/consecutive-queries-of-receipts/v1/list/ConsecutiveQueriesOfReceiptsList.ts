import {
  IConsecutiveQueriesOfReceiptsList,
  IFieldFilters,
} from '@/interfaces/customs'
import { defaultIcons, defaultIconsLucide, formatParamsCustom } from '@/utils'
import { QTable } from 'quasar'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useRules } from '@/composables'
import {
  useAccountingResourceStore,
  useConsecutiveQueriesOfReceiptStore,
  useResourceManagerStore,
} from '@/stores'
import { storeToRefs } from 'pinia'

// Composables
import { useRouteValidator } from '@/composables/useRoutesValidator'

const useConsecutiveQueriesOfReceiptsList = () => {
  const { openMainLoader } = useMainLoader()
  const {
    _getConsecutiveQueriesOfReceiptsList,
    _exportXlsxConsecutiveQueriesOfReceiptsList,
  } = useConsecutiveQueriesOfReceiptStore('v1')
  const { business_by_code } = storeToRefs(useAccountingResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { validateRouter } = useRouteValidator()

  const {
    consecutiveQueriesOfReceiptspages,
    consecutiveQueriesOfReceiptsList,
  } = storeToRefs(useConsecutiveQueriesOfReceiptStore('v1'))

  const keys = {
    accounting: ['business_by_code'],
  }

  const headerProps = {
    title: 'Consulta de consecutivo de comprobantes',
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
        label: 'Consulta de consecutivo de comprobantes',
        route: '',
      },
    ],
  }
  const filtersFormat = ref<Record<string, string | number>>({})

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_code',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: business_by_code,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
      ],
    },
    {
      name: 'name_business',
      label: 'Nombre del negocio',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'code_accounting_structure',
      label: 'Código de estructura contable',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'finality',
      label: 'Finalidad',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'from_period',
      label: 'Desde periodo*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      prepend_icon: defaultIcons.magnify,
      clean_value: true,
      placeholder: 'MM-AAAA',
      mask: 'MM-YYYY',
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
        (v: string) => useRules().valid_format_date(v, 'MM-YYYY'),
      ],
    },
    {
      name: 'to_period',
      label: 'Hasta periodo*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      prepend_icon: defaultIcons.magnify,
      clean_value: true,
      placeholder: 'MM-AAAA',
      mask: 'MM-YYYY',
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
        (v: string) => useRules().valid_format_date(v, 'MM-YYYY'),
      ],
    },
  ])

  const tableProps = ref({
    title: 'Listado de consecutivos de comprobantes',
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
        name: 'period',
        required: false,
        label: 'Periodo',
        align: 'left',
        field: 'period',
        sortable: true,
      },
      {
        name: 'date',
        required: true,
        label: 'Fecha',
        align: 'left',
        field: 'date',
        sortable: true,
      },
      {
        name: 'receipt_code',
        required: true,
        label: 'Código tipo de comprobante',
        align: 'left',
        field: 'receipt_code',
        sortable: true,
      },
      {
        name: 'receipt_name',
        required: true,
        label: 'Nombre tipo de comprobante',
        align: 'left',
        field: 'receipt_name',
        sortable: true,
      },
      {
        name: 'sub_receipt_code',
        required: true,
        label: 'Código sub tipo de comprobante',
        align: 'left',
        field: 'sub_receipt_code',
        sortable: true,
      },
      {
        name: 'sub_receipt_name',
        required: true,
        label: 'Nombre sub tipo de comprobante',
        align: 'left',
        field: 'sub_receipt_name',
        sortable: true,
      },
      {
        name: 'consecutive',
        required: true,
        label: 'Consecutivo',
        align: 'left',
        field: 'consecutive',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IConsecutiveQueriesOfReceiptsList[],
    pages: consecutiveQueriesOfReceiptspages,
  })

  const handleFilter = ($filters: {
    'filter[business_code]': string
    'filter[from_period]': string
    'filter[to_period]': string
    'filter[name_business]'?: string
    'filter[code_accounting_structure]'?: string
    'filter[finality]'?: string
  }) => {
    delete $filters['filter[name_business]']
    delete $filters['filter[code_accounting_structure]']
    delete $filters['filter[finality]']

    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []

    await _getConsecutiveQueriesOfReceiptsList(filters)
    tableProps.value.loading = false
  }

  const handleClear = () => {
    tableProps.value.rows = []
    filterConfig.value[0].value = null
    filterConfig.value[1].value = null
    filterConfig.value[2].value = null
    filterConfig.value[3].value = null
  }

  const updatePage = (page: number) => {
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
  const downloadExcel = async () => {
    openMainLoader(true)

    let idsParams = ''
    if (tableProps.value.rows.length > 0) {
      const idsArray = tableProps.value.rows.map(
        (row, index) => `ids[${index}]=${row.id}`
      )
      idsParams = idsArray.join('&')
    }

    await _exportXlsxConsecutiveQueriesOfReceiptsList(idsParams)
    openMainLoader(false)
  }
  const filtersRef = ref()

  const onFilterChange = (filters: Record<string, string | number | null>) => {
    const businessCode = filters['filter[business_code]']
    if (businessCode) {
      const selectedBusiness = business_by_code.value.find(
        (item) => item.value === businessCode
      )
      if (selectedBusiness && filtersRef.value) {
        filtersRef.value.setFieldValueByName(
          'name_business',
          selectedBusiness.name
        )
        filtersRef.value.setFieldValueByName(
          'code_accounting_structure',
          selectedBusiness.accounting_structure_code
        )
        filtersRef.value.setFieldValueByName(
          'finality',
          selectedBusiness.accounting_structure_purpose
        )
      }
    } else {
      filtersRef.value.setFieldValueByName('name_business', null)
      filtersRef.value.setFieldValueByName('code_accounting_structure', null)
      filtersRef.value.setFieldValueByName('finality', null)
    }
  }

  watch(
    () => consecutiveQueriesOfReceiptsList.value,
    () => {
      tableProps.value.rows = consecutiveQueriesOfReceiptsList.value
    }
  )

  watch(
    () => consecutiveQueriesOfReceiptspages.value,
    () => {
      tableProps.value.pages = consecutiveQueriesOfReceiptspages.value
    }
  )

  onMounted(async () => {
    await _getResources(keys)
  })

  onBeforeMount(() => {
    _resetKeys(keys)
  })

  return {
    headerProps,
    filterConfig,
    tableProps,
    filtersRef,

    validateRouter,
    handleFilter,
    handleClear,
    updatePage,
    updatePerPage,
    downloadExcel,
    onFilterChange,
  }
}

export default useConsecutiveQueriesOfReceiptsList
