import { IFieldFilters } from '@/interfaces/customs'
import { QTable } from 'quasar'
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountingResourceStore, useResourceManagerStore } from '@/stores'
import { useAccountingBalanceMovementsStore } from '@/stores/accounting/checking-balances-and-transactions-by-account'
import { useRules, useUtils } from '@/composables'
import { formatParamsCustom } from '@/utils'

const useCheckingBalancesAndTransactionsByAccount = () => {
  const {
    business_trusts_with_description,
    accounting_chart_operative_by_structure,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { _getResources } = useResourceManagerStore('v1')
  const { fetchBalanceMovements, exportBalanceMovements } =
    useAccountingBalanceMovementsStore('v1')

  const { movements_list, pagination } = storeToRefs(
    useAccountingBalanceMovementsStore('v1')
  )

  const { formatCurrencyString, isEmptyOrZero } = useUtils()

  const filtersFormat = ref<Record<string, any>>({})
  const selectedBusiness = ref()
  const keysBusiness = { accounting: ['business_trusts_with_description'] }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'from_business_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts_with_description,
      autocomplete: true,
      clean_value: true,
      disable: false,
      placeholder: 'Seleccione',
      rules: [
        (v: string) => useRules().is_required(v, 'El negocio es requerido'),
      ],
    },
    {
      name: 'accounting_structure',
      label: 'Estructura contable*',
      type: 'q-input',
      value: selectedBusiness.value?.accounting_structure ?? null,
      class: 'col-12 col-md-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
      isForceValue: true,
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
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) => useRules().is_required(v, 'La cuenta es requerida'),
      ],
    },
    {
      name: 'from_period',
      label: 'Desde periodo*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      options: '',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
      mask: 'YYYY-MM',
      rules: [
        (v: string) => useRules().is_required(v, 'La fecha desde es requerida'),
      ],
    },
    {
      name: 'to_period',
      label: 'Hasta periodo*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      options: '',
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'AAAA-MM',
      mask: 'YYYY-MM',
      rules: [
        (v: string) => useRules().is_required(v, 'La fecha hasta es requerida'),
      ],
    },
  ])

  const tableProps = ref({
    title: 'Listado de saldos y movimientos por cuenta',
    loading: false,
    columns: [
      {
        name: 'account_code',
        field: 'account_code',
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'date',
        field: 'date',
        label: 'Fecha',
        align: 'left',
        sortable: true,
      },
      {
        name: 'voucher',
        field: 'voucher',
        label: 'Comprobante',
        align: 'left',
        sortable: true,
      },
      {
        name: 'sub_receipt_type',
        field: 'sub_receipt_type',
        label: 'Subtipo comprobante',
        align: 'left',
        sortable: true,
      },
      {
        name: 'consecutive',
        field: 'consecutive',
        label: 'Consecutivo',
        align: 'left',
        sortable: true,
      },
      {
        name: 'auxiliary',
        field: 'auxiliary',
        label: 'Auxiliar',
        align: 'left',
        sortable: true,
      },
      {
        name: 'cost_center',
        field: 'cost_center',
        label: 'Centro de costos',
        align: 'left',
        sortable: true,
      },
      {
        name: 'register_detail',
        field: 'register_detail',
        label: 'Detalle del registro',
        align: 'left',
        sortable: true,
      },
      {
        name: 'initial_balance',
        field: 'initial_balance',
        label: 'Saldo inicial',
        align: 'left',
        sortable: true,
        format: (val: number) => formatCurrencyString(val),
      },
      {
        name: 'debit',
        field: 'debit',
        label: 'Débito',
        align: 'left',
        sortable: true,
        format: (val: number) => formatCurrencyString(val),
      },
      {
        name: 'credit',
        field: 'credit',
        label: 'Crédito',
        align: 'left',
        sortable: true,
        format: (val: number) => formatCurrencyString(val),
      },
      {
        name: 'final_balance',
        field: 'final_balance',
        label: 'Saldo final',
        align: 'left',
        sortable: true,
        format: (val: number) => formatCurrencyString(val),
      },
      {
        name: 'foreign_currency_balance',
        field: 'foreign_currency_balance',
        label: 'Mov. moneda extranjera',
        align: 'left',
        sortable: true,
        format: (val: number) => formatCurrencyString(val),
      },
      {
        name: 'foreign_balance',
        field: 'foreign_balance',
        label: 'Saldo moneda extranjera',
        align: 'left',
        sortable: true,
        format: (val: number) => formatCurrencyString(val),
      },
    ] as QTable['columns'],
    rows: [] as any,
    pages: {
      currentPage: 1,
      lastPage: 3,
    },
  })

  const headerProps = {
    title: 'Consulta de saldos y movimientos por cuenta',
    breadcrumbs: [
      { label: 'Inicio', route: '' },
      { label: 'Contabilidad', route: '' },
      {
        label: 'Consulta de saldos y movimientos por cuenta',
        route: 'CheckingBalancesAndTransactionsByAccount',
      },
    ],
  }

  const updateValue = async ($filters: {
    'filter[from_business_id]': number
    'filter[account_id]': string
    'filter[from_period]': string
    'filter[to_period]': string
  }) => {
    if (isEmptyOrZero($filters)) return

    filtersFormat.value = {
      from_business_id: $filters['filter[from_business_id]'],
      account_id: $filters['filter[account_id]'],
      from_period: $filters['filter[from_period]'],
      to_period: $filters['filter[to_period]'],
    }
    if (
      selectedBusiness.value &&
      selectedBusiness.value.value === $filters['filter[from_business_id]']
    )
      return
    selectedBusiness.value = business_trusts_with_description.value.find(
      (b) => b.value === $filters['filter[from_business_id]']
    )

    if (selectedBusiness.value) {
      filterConfig.value[1].value =
        String(selectedBusiness.value.accounting_structure) || null
      const keyAccountingChart = {
        accounting: [
          `accounting_chart_operative_by_structure&filter[account_structures_id]=${selectedBusiness.value.accounting_structure_id}`,
        ],
      }

      await _getResources(keyAccountingChart)
      accounting_chart_operative_by_structure.value =
        accounting_chart_operative_by_structure.value.map((item) => ({
          ...item,
          value: item.id ?? 0,
        }))
    } else {
      filterConfig.value[1].value = null
    }
  }

  const handleFilter = () => {
    listAction(filtersFormat.value)
  }

  const listAction = async ($params: Record<string, any>) => {
    tableProps.value.loading = true

    const queryString = formatParamsCustom({
      ...$params,
      paginate: 1,
    })

    await fetchBalanceMovements(new URLSearchParams(queryString))

    tableProps.value.rows = movements_list
    tableProps.value.pages.lastPage = pagination.value.lastPage
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    tableProps.value.pages.currentPage = page
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const handleClear = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
    filterConfig.value.forEach((field) => (field.value = null))
  }

  const downloadExcel = async () => {
    const queryString = formatParamsCustom({
      ...filtersFormat.value,
      paginate: 1,
    })

    await exportBalanceMovements(new URLSearchParams(queryString))
  }

  const isDisableDownloadExcel = computed(() => {
    return tableProps.value.rows.length === 0
  })

  onMounted(() => {
    _getResources(keysBusiness)
  })

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
    isDisableDownloadExcel,
    handleFilter,
    updatePage,
    updateValue,
    handleClear,
    downloadExcel,
  }
}

export default useCheckingBalancesAndTransactionsByAccount
