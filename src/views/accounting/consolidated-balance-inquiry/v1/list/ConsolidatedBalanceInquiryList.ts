import { useMainLoader, useRules } from '@/composables'
import {
  IConsolidatedBalanceInquiryList,
  IFieldFilters,
} from '@/interfaces/customs'
import { useAccountingResourceStore, useResourceManagerStore } from '@/stores'
import { useConsolidatedBalanceInquiryStore } from '@/stores/accounting/consolidated-balance-inquiry'
import { defaultIcons, defaultIconsLucide, formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRouteValidator } from '@/composables/useRoutesValidator'

const useConsolidatedBalanceInquiryList = () => {
  const { validateRouter } = useRouteValidator()
  const keys = {
    accounting: ['consolidator_business_trust_with_account_structure'],
  }

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { consolidator_business_trust_with_account_structure } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { consolidatedBalanceInquiryPages, consolidatedBalanceInquiryList } =
    storeToRefs(useConsolidatedBalanceInquiryStore('v1'))
  const {
    _getConsolidatedBalanceInquiryList,
    _exportConsolidateBalanceInquiryListXLS,
  } = useConsolidatedBalanceInquiryStore('v1')
  const { openMainLoader } = useMainLoader()

  const headerProps = {
    title: 'Consulta de saldos consolidados',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: 'ConsolidatedBalanceInquiryList',
      },
      {
        label: 'Consulta de saldos consolidados',
        route: 'ConsolidatedBalanceInquiryList',
      },
    ],
  }
  const showState = ref(0)
  const isConsolidatedBalanceInquiryEmpty = ref(true)

  const filtersFormat = ref<Record<string, string | number>>({})

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_trust_id',
      label: 'Negocio *',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: consolidator_business_trust_with_account_structure,
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
      name: 'accounting_structure',
      label: 'Estructura contable',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'from_period',
      label: 'Desde periodo *',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      prepend_icon: defaultIcons.magnify,
      clean_value: true,
      placeholder: 'AAAA-MM',
      mask: 'YYYY-MM',
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
        (v: string) => useRules().valid_format_date(v, 'YYYY-MM'),
      ],
    },
    {
      name: 'to_period',
      label: 'Hasta periodo *',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      prepend_icon: defaultIcons.magnify,
      clean_value: true,
      placeholder: 'AAAA-MM',
      mask: 'YYYY-MM',
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
        (v: string) => useRules().valid_format_date(v, 'YYYY-MM'),
      ],
    },
  ])

  const tableProps = ref({
    title: 'Listado de saldos consolidados',
    loading: false,
    columns: [
      {
        name: 'index',
        required: false,
        label: '#',
        align: 'left',
        field: 'index',
        sortable: true,
      },
      {
        name: 'account',
        required: false,
        label: 'Cuenta',
        align: 'left',
        field: (row) => row.account.code,
        sortable: true,
      },
      {
        name: 'account_name',
        required: true,
        label: 'Nombre de la cuenta',
        align: 'left',
        field: (row) => row.account.name,

        sortable: true,
      },
      {
        name: 'business',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row) => `${row.business.code} - ${row.business.name}`,

        sortable: true,
      },
      {
        name: 'initial_balance',
        required: true,
        label: 'Saldo Inicial',
        align: 'left',
        field: 'initial_balance',
        sortable: true,
      },
      {
        name: 'debit',
        required: true,
        label: 'Débito',
        align: 'left',
        field: 'debit',
        sortable: true,
      },
      {
        name: 'credit',
        required: true,
        label: 'Crédito',
        align: 'left',
        field: 'credit',
        sortable: true,
      },
      {
        name: 'final_balance',
        required: true,
        label: 'Saldo Final',
        align: 'left',
        field: 'final_balance',
        sortable: true,
      },
      {
        name: 'foreign_currency_balance',
        required: true,
        label: 'Saldo moneda extranjera',
        align: 'left',
        field: 'foreign_currency_balance',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IConsolidatedBalanceInquiryList[],
    pages: consolidatedBalanceInquiryPages,
  })

  const handleFilter = ($filter: Record<string, string>) => {
    delete $filter['filter[accounting_structure]']
    filtersFormat.value = { ...$filter }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []

    await _getConsolidatedBalanceInquiryList(filters)
    tableProps.value.loading = false
    const hasResults = consolidatedBalanceInquiryList.value.length > 0
    showState.value = filters ? 1 : 0
    isConsolidatedBalanceInquiryEmpty.value = !hasResults
  }

  const handleClear = () => {
    tableProps.value.rows = []
    filterConfig.value[0].value = null
    filterConfig.value[1].value = null
    filterConfig.value[2].value = null
    filterConfig.value[3].value = null
    showState.value = 0
    isConsolidatedBalanceInquiryEmpty.value = true
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

  const filtersRef = ref()

  const onFilterChange = (filters: Record<string, string | number | null>) => {
    const businessTrustId = filters['filter[business_trust_id]']
    if (businessTrustId) {
      const selectedBusiness =
        consolidator_business_trust_with_account_structure.value.find(
          (item) => item.value === businessTrustId
        )
      if (selectedBusiness && filtersRef.value) {
        filtersRef.value.setFieldValueByName(
          'accounting_structure',
          selectedBusiness.accounting_structure_code
        )
      }
    } else {
      filtersRef.value.setFieldValueByName('accounting_structure', null)
    }
  }

  const downloadExcel = async () => {
    openMainLoader(true)
    const values = Object.fromEntries(
      Object.entries({
        'filter[business_trust_id]':
          filtersFormat.value['filter[business_trust_id]'],
        'filter[from_period]':
          filtersFormat.value['filter[from_period]'] ?? null,
        'filter[to_period]': filtersFormat.value['filter[to_period]'] ?? null,
      }).filter(([_, value]) => value !== null)
    )

    const queryString = formatParamsCustom(values)
    await _exportConsolidateBalanceInquiryListXLS(queryString)

    openMainLoader(false)
  }

  onMounted(async () => {
    await _getResources(keys)
  })

  onBeforeMount(() => {
    _resetKeys(keys)
  })

  watch(
    () => consolidatedBalanceInquiryList.value,
    () => {
      tableProps.value.rows = consolidatedBalanceInquiryList.value
    }
  )

  watch(
    () => consolidatedBalanceInquiryPages.value,
    () => {
      tableProps.value.pages = consolidatedBalanceInquiryPages.value
    }
  )

  return {
    headerProps,
    filterConfig,
    tableProps,
    filtersRef,
    showState,
    isConsolidatedBalanceInquiryEmpty,
    downloadExcel,
    handleFilter,
    handleClear,
    updatePage,
    updatePerPage,
    onFilterChange,
    validateRouter,
  }
}

export default useConsolidatedBalanceInquiryList
