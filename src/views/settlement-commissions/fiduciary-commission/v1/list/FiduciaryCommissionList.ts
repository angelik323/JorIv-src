// Vue - pinia - moment
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { QTable } from 'quasar'
import { IFieldFilters, IFiduciaryCommissionList } from '@/interfaces/customs'

// Utils
import { defaultIconsLucide } from '@/utils'
import { useMainLoader, useRules, useUtils } from '@/composables'

// Stores
import { useFiduciaryCommissionsStore } from '@/stores'

const useFiduciaryCommissionList = () => {
  const {
    _getFiduciaryCommissionList,
    _liquidateFiduciaryCommission,
    _clearData,
  } = useFiduciaryCommissionsStore('v1')
  const { fiduciary_commission_list, fiduciary_commission_pages } = storeToRefs(
    useFiduciaryCommissionsStore('v1')
  )

  const utils = useUtils()
  const { max_length } = useRules()
  const { openMainLoader } = useMainLoader()
  const selectedRows = ref<IFiduciaryCommissionList[]>([])
  let perPage = 20

  const headerProps = {
    title: 'Liquidación de comisión fiduciaria',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
        route: '',
      },
      {
        label: 'Liquidación de comisión fiduciaria',
        route: 'SettlementFiduciaryCommissionsList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado liquidación de comisión fiduciaria',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'base_amount',
        field: 'base_amount',
        required: true,
        label: 'Valor base',
        align: 'left',
        sortable: true,
        format: (val) => utils.formatCurrencyString(val),
      },
      {
        name: 'iva_percentage',
        field: (row) => row.iva_percentage + ' %',
        required: true,
        label: '% IVA',
        align: 'left',
        sortable: true,
      },
      {
        name: 'iva_amount',
        field: 'iva_amount',
        required: true,
        label: 'Valor IVA',
        align: 'left',
        sortable: true,
        format: (val) => utils.formatCurrencyString(val),
      },
      {
        name: 'total_amount',
        field: 'total_amount',
        required: true,
        label: 'Valor total',
        align: 'left',
        sortable: true,
        format: (val) => utils.formatCurrencyString(val),
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IFiduciaryCommissionList[],
    pages: fiduciary_commission_pages.value,
  })

  const filterConfig = computed<IFieldFilters[]>(() => [
    {
      name: 'period_date',
      label: 'Periodo a liquidar',
      type: 'q-date',
      value: '',
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
    },
    {
      name: 'created_at',
      label: 'Fecha',
      type: 'q-date',
      value: '',
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o nombre del negocio',
      rules: [(val: string) => max_length(val, 50)],
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: Record<string, string | number>) => {
    selectedRows.value = []
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getFiduciaryCommissionList(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[period_date]': string
    'filter[created_at]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    await listAction(filtersFormat.value)
  }

  const handleClear = () => {
    tableProps.value.rows = []
    selectedRows.value = []
  }

  const updatePage = async (page: number) => {
    await listAction({
      ...filtersFormat.value,
      rows: perPage,
      page,
    })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    await listAction({ ...filtersFormat.value, page: 1 })
  }

  const handleLiquidate = async () => {
    openMainLoader(true)
    const success = await _liquidateFiduciaryCommission({
      ids: selectedRows.value.map((row) => row.id),
    })
    if (success) {
      setTimeout(() => {
        listAction({
          ...filtersFormat.value,
        })
        openMainLoader(false)
      }, 4000)
    }
  }

  onMounted(async () => {
    _clearData()
  })

  watch(
    fiduciary_commission_list,
    () => {
      tableProps.value.rows = [...fiduciary_commission_list.value]

      const { currentPage, lastPage } = fiduciary_commission_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    selectedRows,

    handleFilter,
    updatePage,
    updatePerPage,
    handleClear,
    handleLiquidate,
  }
}

export default useFiduciaryCommissionList
