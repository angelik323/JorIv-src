// Vue - pinia - moment
import { ref, onMounted, watch, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBillingPeriodList } from '@/interfaces/customs/settlement-commissions/BillingPeriodV2'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useTable,
  useUtils,
} from '@/composables'

// Stores
import { useBillingPeriodStore } from '@/stores/settlement-commissions/billing-period'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useSettlementCommissionsResourceStore } from '@/stores/resources-manager/settlement-commissions'

const useBillingPeriodList = () => {
  const { _getBillingPeriodList, _deleteBillingPeriod, _clearData } =
    useBillingPeriodStore('v2')
  const { headerPropsDefault, billing_period_list, billing_period_pages } =
    storeToRefs(useBillingPeriodStore('v2'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { periodicities, business_trusts_billing_trusts } = storeToRefs(
    useSettlementCommissionsResourceStore('v1')
  )

  const { validateRouter } = useRouteValidator()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { max_length } = useRules()
  const { openMainLoader } = useMainLoader()

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el periodo de liquidación de comisiones?',
    id: null as number | null,
  })

  const headerProperties = headerPropsDefault.value

  const tableProperties = ref<IBaseTableProps<IBillingPeriodList>>({
    title: 'Listado de periodos de liquidación de comisiones',
    loading: false,
    wrapCells: true,
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
        name: 'business_name',
        label: 'Código y nombre del negocio',
        required: true,
        align: 'left',
        field: (row) =>
          row.business_code_snapshot + ' - ' + row.business_name_snapshot,
        sortable: true,
      },
      {
        name: 'code',
        label: 'Código del periodo',
        required: true,
        align: 'left',
        field: 'code',
        sortable: true,
        format: (val) => val ?? '-',
      },
      {
        name: 'start_date',
        label: 'Fecha inicial',
        required: true,
        align: 'left',
        field: 'start_date',
        sortable: true,
      },
      {
        name: 'end_date',
        label: 'Fecha final',
        required: true,
        field: 'end_date',
        align: 'left',
        sortable: true,
      },
      {
        name: 'periodicity',
        required: true,
        label: 'Periodicidad',
        align: 'left',
        field: 'periodicity',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const { removeRowById } = useTable<IBillingPeriodList>(tableProperties)

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: '',
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: '',
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
    },
    {
      name: 'business_code_snapshot',
      label: 'Nombre del negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts_billing_trusts,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'periodicity',
      label: 'Periodicidad',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      options: periodicities,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
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
      placeholder: 'Buscar por código del periodo o negocio',
      rules: [(val: string) => max_length(val, 50)],
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
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    await _getBillingPeriodList(filters)
    tableProperties.value.loading = false
  }

  const handleFilterSearch = async ($filters: {
    'filter[start_date]': string
    'filter[end_date]': string
    'filter[business_code_snapshot]': string
    'filter[periodicity]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }
    await listAction(filtersFormat.value)
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
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

  const openAlertModal = async (id: number) => {
    alertModalConfig.value.id = id
    await alertModalRef.value.openModal()
  }

  const handleDeleteAction = async () => {
    const { id } = alertModalConfig.value
    if (!id) return

    openMainLoader(true)
    const success = await _deleteBillingPeriod(id)
    if (success) {
      removeRowById(id)
      await alertModalRef.value.closeModal()
    }
    openMainLoader(false)
  }

  const keys = {
    settlement_commissions: ['periodicities', 'business_trusts_billing_trusts'],
  }

  onBeforeMount(async () => {
    _clearData()
    _resetKeys(keys)
  })

  onMounted(async () => {
    _clearData()
    await _getResources(keys)
  })

  watch(
    billing_period_list,
    () => {
      tableProperties.value.rows = [...billing_period_list.value]

      const { currentPage, lastPage } = billing_period_pages.value
      tableProperties.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    headerProperties,
    tableProperties,
    defaultIconsLucide,
    filterConfig,
    alertModalConfig,
    alertModalRef,

    updatePage,
    updateRowsPerPage,
    goToURL,
    handleFilterSearch,
    handleClearFilters,
    handleDeleteAction,
    openAlertModal,
    validateRouter,
  }
}

export default useBillingPeriodList
