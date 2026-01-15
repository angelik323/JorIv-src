import { useMainLoader, useRouteValidator, useRules } from '@/composables'
import {
  IBalanceInquiryByBusinessResponse,
  IFieldFilters,
} from '@/interfaces/customs'
import {
  useAccountingResourceStore,
  useBalanceInquiryByBusinessStore,
  useResourceManagerStore,
} from '@/stores'
import { formatParamsCustom } from '@/utils'
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'

const useBalanceInquiryByBusinessList = () => {
  const {
    balance_inquiry_by_business_pages,
    balance_inquiry_by_business_list,
  } = storeToRefs(useBalanceInquiryByBusinessStore('v1'))
  const {
    account_structures_by_businness,
    accounting_structure_from_to_business,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    accounting: ['account_structures_active'],
  }

  const {
    _getBalanceInquiryByBusinnesList,
    _exportBalanceInquiryByBusinessListXLS,
  } = useBalanceInquiryByBusinessStore('v1')

  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const hideFilters = ref<boolean>(true)
  const headerProps = {
    title: 'Consultar saldos por negocio',
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
        label: 'Consultar saldos por negocio',
        route: 'BalanceInquiryByBusinessList',
      },
    ],
  }

  const filterComponentRef = ref()
  type FilterFormatType = Record<string, string | number | null>
  const filtersFormat = ref<FilterFormatType>({})
  const lastBusinessCode = ref<string | number | null>(null)

  const accountStructureOptions = computed(() => {
    return account_structures_by_businness.value
  })

  const bussinessOptions = computed(() => {
    return accounting_structure_from_to_business.value
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'account_structure_id',
      label: 'Estructura contable *',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      options: accountStructureOptions,
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
      ],
    },
    {
      name: 'from_business_trust_id',
      label: 'Desde negocio *',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      disable: computed((): boolean => !lastBusinessCode.value),
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      options: bussinessOptions,
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
      ],
    },
    {
      name: 'to_business_trust_id',
      label: 'Hasta negocio *',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      disable: computed((): boolean => !lastBusinessCode.value),
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      options: bussinessOptions,
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
      ],
    },
    {
      name: 'from_period',
      label: 'Desde periodo *',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      autocomplete: true,
      hide: true,
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
      class: 'col-12 col-md-4',
      disable: false,
      hide: true,
      autocomplete: true,
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
    title: 'Listado saldos por negocio',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: (row) => row.business.id,
        sortable: true,
      },
      {
        name: 'code_business',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row) => `${row.business.code} - ${row.business.name}`,
        sortable: true,
      },
      {
        name: 'code_acount',
        required: true,
        label: 'Cuenta ',
        align: 'left',
        field: (row) => row.account.code,
        sortable: true,
      },
      {
        name: 'name_acount',
        required: true,
        label: 'Nombre de la cuenta ',
        field: (row) => row.account.name,
        align: 'left',
        sortable: true,
      },
      {
        name: 'initial_balance',
        required: true,
        label: 'Saldo inicial',
        align: 'right',
        field: 'initial_balance',
        sortable: true,
      },
      {
        name: 'total_debits',
        required: true,
        label: 'Débito',
        align: 'left',
        field: 'total_debits',
        sortable: true,
      },

      {
        name: 'total_credits',
        required: true,
        label: 'Crédito',
        align: 'left',
        field: 'total_credits',
        sortable: true,
      },
      {
        name: 'final_balance',
        required: true,
        label: 'Saldo final',
        align: 'right',
        field: 'final_balance',
        sortable: true,
      },
      {
        name: 'total_foreign_currency_balance',
        required: false,
        label: 'Saldo moneda extranjera',
        align: 'center',
        field: 'total_foreign_currency_balance',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [] as IBalanceInquiryByBusinessResponse[],
    pages: balance_inquiry_by_business_pages,
  })

  const handleShowMoreFilters = () => {
    hideFilters.value = !hideFilters.value
    filterConfig.value[3].hide = hideFilters.value
    filterConfig.value[4].hide = hideFilters.value
  }

  const handleFilter = ($filters: {
    'filter[account_structure_id]': number | string
    'filter[from_business_trust_id]': number | string
    'filter[to_business_trust_id]': number | string
    'filter[from_period]': string
    'filter[to_period]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      'filter[account_structure_id]':
        account_structures_by_businness.value.find(
          (item) => item.code === $filters['filter[account_structure_id]']
        )?.id ?? null,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getBalanceInquiryByBusinnesList(filters)

    tableProps.value.loading = false
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
    const values = Object.fromEntries(
      Object.entries({
        'filter[account_structure_id]':
          filtersFormat.value['filter[account_structure_id]'],
        'filter[from_business_trust_id]':
          filtersFormat.value['filter[from_business_trust_id]'] ?? null,
        'filter[to_business_trust_id]':
          filtersFormat.value['filter[to_business_trust_id]'] ?? null,
        'filter[from_period]':
          filtersFormat.value['filter[from_period]'] ?? null,
        'filter[to_period]': filtersFormat.value['filter[to_period]'] ?? null,
      }).filter(([_, value]) => value !== null)
    )

    const queryString = formatParamsCustom(values)
    await _exportBalanceInquiryByBusinessListXLS(queryString)

    openMainLoader(false)
  }

  const handleClear = () => {
    lastBusinessCode.value = null
    tableProps.value.rows = []
    setBusinessTrustsWithDescriptionByAccountStructure([])
  }

  const onFilterChange = async (
    filters: Record<string, string | number | null>
  ) => {
    const businessCode = filters['filter[account_structure_id]']

    if (businessCode !== lastBusinessCode.value) {
      lastBusinessCode.value = businessCode

      if (businessCode) {
        const selectedAccountStructureId =
          account_structures_by_businness.value.find(
            (item) => item.code === businessCode
          )?.id

        if (selectedAccountStructureId) {
          clearBusinessTrustFilters()
          await fetchBusinessTrustsByAccountStructure(
            selectedAccountStructureId
          )
        }
      } else {
        clearBusinessTrustFilters()
      }
    }
  }

  const clearBusinessTrustFilters = () => {
    filterComponentRef?.value?.cleanFiltersByNames([
      'from_business_trust_id',
      'to_business_trust_id',
    ])
    setBusinessTrustsWithDescriptionByAccountStructure([])
  }

  const fetchBusinessTrustsByAccountStructure = async (structureId: number) => {
    const keys = {
      accounting: [
        `business_trusts_with_description_by_account_structure&filter[account_structures_id]=${structureId}`,
      ],
    }
    await _getResources(keys)
  }

  const setBusinessTrustsWithDescriptionByAccountStructure = (value: []) => {
    accounting_structure_from_to_business.value = value
  }

  onMounted(async () => {
    openMainLoader(true)
    setBusinessTrustsWithDescriptionByAccountStructure([])
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeMount(() => {
    _resetKeys(keys)
  })

  watch(
    () => balance_inquiry_by_business_list.value,
    () => {
      tableProps.value.rows = balance_inquiry_by_business_list.value
    }
  )

  watch(
    () => balance_inquiry_by_business_pages,
    () => {
      tableProps.value.pages = balance_inquiry_by_business_pages.value
    }
  )

  return {
    balance_inquiry_by_business_pages,
    hideFilters,
    headerProps,
    filterComponentRef,
    filterConfig,
    tableProps,

    handleFilter,
    handleShowMoreFilters,
    updatePerPage,
    updatePage,
    downloadExcel,
    handleClear,
    onFilterChange,
    validateRouter
  }
}

export default useBalanceInquiryByBusinessList
