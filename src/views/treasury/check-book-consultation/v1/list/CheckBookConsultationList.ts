import { ref, onMounted, watch, onBeforeMount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { formatParamsCustom } from '@/utils'
import { QTable } from 'quasar'
import {
  useCheckbookQuery,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
import { ICheckbookQuery, IFieldFilters } from '@/interfaces/customs'
import { useUtils } from '@/composables'

const useCheckbookQueryList = () => {
  const router = useRouter()
  const { optionsMaxCalendar, formatCurrencyString } = useUtils()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    business_trust,
    banks_record_expenses,
    bank_accounts_with_name,
    check_book_inquiry_checkbooks,
  } = storeToRefs(useTreasuryResourceStore('v1'))
  const { checkbook_query_list } = storeToRefs(useCheckbookQuery('v1'))
  const { _getListAction, _cleanList } = useCheckbookQuery('v1')

  const getCheckbookOptions = computed(() =>
    (check_book_inquiry_checkbooks.value ?? []).map((item) => ({
      label: `${item.code} (${item.range_from} - ${item.range_to})`,
      value: item.id,
      payload: item,
    }))
  )

  const filtersRef = ref()
  const bankReferenceId = ref()
  const accountBankId = ref()

  const headerProps = {
    title: 'Libro de cheques',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería' },
      { label: 'Libro de cheques', route: 'CheckbookQueryList' },
    ],
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: ICheckbookQuery[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: 'Listado de libro de cheques',
    loading: false,
    columns: [
      { name: 'id', label: '#', align: 'left', field: 'id', sortable: true },
      {
        name: 'checkbook',
        label: 'Chequera',
        align: 'left',
        field: (row) => row.checkbook?.code || '—',
        sortable: true,
      },
      {
        name: 'check_number',
        label: 'Número de cheque',
        align: 'left',
        field: (row) => row.check_number,
        sortable: true,
      },
      {
        name: 'check_date',
        label: 'Fecha de cheque',
        align: 'left',
        field: (row) => row.check_date,
        sortable: true,
      },
      {
        name: 'beneficiary',
        label: 'Beneficiario',
        align: 'left',
        field: (row) =>
          row.beneficiary_document && row.beneficiary
            ? `${row.beneficiary_document} - ${row.beneficiary}`
            : '—',
        sortable: true,
      },
      {
        name: 'value',
        label: 'Valor',
        align: 'left',
        field: (row) => formatCurrencyString(row.value),
        sortable: true,
      },
      {
        name: 'conciliation',
        label: 'Conciliación',
        align: 'left',
        field: (row) => row.conciliation || '—',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        align: 'left',
        field: (row) => row.status?.name || '—',
        sortable: true,
      },
      { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const getCheckBookByBusiness = async (businessId: number) => {
    if (!businessId) return
    await _getResources(
      {
        treasury: [`check_book_inquiry_checkbooks`],
      },
      `filter[business_trust_id]=${businessId}`,
      'v2'
    )

    await _getResources({
      treasury: [`banks_record_expenses&business_trust_id=${businessId}`],
    })
  }

  const filters = ref<IFieldFilters[]>([
    {
      name: 'business_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trust,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: getCheckBookByBusiness,
    },
    {
      name: 'bank_id',
      label: 'Banco',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: banks_record_expenses,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'bank_account_id',
      label: 'Cuenta bancaria',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: bank_accounts_with_name,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'period',
      label: 'Periodo',
      type: 'q-date',
      value: '',
      class: 'col-xs-12 col-sm-6 col-md-6 q-py-md',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
      mask: 'YYYY-MM',
      rules: [],
      option_calendar: optionsMaxCalendar,
    },
    {
      name: 'checkbook_id',
      label: 'Chequera',
      type: 'q-select',
      value: null,
      options: getCheckbookOptions,
      class: 'col-xs-12 col-sm-6 col-md-6 q-py-md',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
  ])

  const handleUpdateValues = (
    filters: Record<string, string | number | null>
  ) => {
    const bussinesId = filters['filter[business_id]']
    const bankId = filters['filter[bank_id]']
    if (bussinesId) {
      const selectedStructure = business_trust.value.find(
        (item) => item.value === Number(bussinesId)
      )
      bankReferenceId.value = selectedStructure?.value ?? null
    }

    if (bankId) {
      const selectedBank = banks_record_expenses.value.find(
        (item) => item.value === Number(bankId)
      )
      accountBankId.value = selectedBank?.id ?? null
    } else {
      filtersRef.value.setFieldValueByName('bank_account_id', null)
    }
  }

  const modelFilters = ref<Record<string, unknown>>({
    business: null,
    bank: null,
    bank_account: '',
    period: '',
    checkbook: null,
    page: 1,
    rows: 25,
  })

  const handleClearFilters = () => {
    _cleanList()
    tableProps.value.rows = []
    tableProps.value.pages = { currentPage: 1, lastPage: 1 }
  }

  const handleUpdateFilters = (data: {
    'filter[bank]': number | null
    'filter[bank_account]': number | null
    'filter[bussiness]': number | null
    'filter[period]': string | null
  }) => {
    modelFilters.value = data

    if (data['filter[period]'])
      modelFilters.value['filter[period]'] = data['filter[period]']
        .trim()
        .replace('-', '')

    const q = formatParamsCustom(modelFilters.value)
    listAction(q ? '&' + q : '')
  }

  const listAction = async (params = '') => {
    tableProps.value.loading = true
    await _getListAction(params)
    tableProps.value.loading = false
  }

  const updatePage = (page: number) => {
    modelFilters.value.page = page
    const q = formatParamsCustom(modelFilters.value)
    listAction(q ? '&' + q : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    modelFilters.value.rows = rowsPerPage
    const q = formatParamsCustom(modelFilters.value)
    listAction(q ? '&' + q : '')
  }

  const handleOptions = (option: string, id: number) => {
    if (option === 'view') {
      router.push({ name: 'CheckbookConsultationView', params: { id } })
    }
  }

  onMounted(async () => {
    await _getResources({
      treasury: ['business_trust'],
    })
  })

  onBeforeMount(() =>
    _resetKeys({
      treasury: [
        'business_trust',
        'check_book_inquiry_checkbooks',
        'banks_record_expenses',
        'bank_accounts_with_name',
        'bank_account',
      ],
    })
  )

  watch(
    () => accountBankId.value,
    async () => {
      if (!accountBankId.value) return
      await _getResources({
        treasury: [
          `bank_account&filter[business_id]=${bankReferenceId.value}&filter[bank_id]=${accountBankId.value}`,
        ],
      })
    },
    { deep: true }
  )
  watch(
    checkbook_query_list,
    () => {
      tableProps.value.rows = checkbook_query_list.value
    },
    { deep: true }
  )

  return {
    headerProps,
    tableProps,
    filters,
    modelFilters,
    filtersRef,
    handleUpdateValues,
    handleClearFilters,
    handleUpdateFilters,
    updatePage,
    updatePerPage,
    handleOptions,
  }
}

export default useCheckbookQueryList
