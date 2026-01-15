// Vue - Vue Router - Pinia - Quasar
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IFicCheckBalancesPlansList } from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// Composables
import { useGoToUrl, useMainLoader, useUtils, useRules } from '@/composables'

// Stores
import { useInvestmentPlanOperationStore } from '@/stores/fics/investment-plan-operations'
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useCheckBalancesPlanList = () => {
  const { defaultIconsLucide, formatCurrencyString, formatParamsCustom } =
    useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { only_number } = useRules()
  const route = useRoute()
  const { operation_number } = storeToRefs(
    useInvestmentPlanOperationStore('v1')
  )
  const { resetOperationNumber } = useInvestmentPlanOperationStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    movements,
    movement_nature_movement_codes,
    movement_classes_movement_codes,
  } = storeToRefs(useFicResourceStore('v1'))

  const {
    _clearData,
    _getByIdCheckBalancesPlan,
    _exportExcelCheckBalancesPlan,
    _getByIdCheckBalancesBasicData,
  } = useFiduciaryInvestmentPlanStore('v1')

  const { check_balances_plan_list, check_balances_plan_list_pages } =
    storeToRefs(useFiduciaryInvestmentPlanStore('v1'))

  const filtersFormatRef = ref<Record<string, string | number>>({})
  const filterComponentRef = ref()

  const searchId = +route.params.id

  const keys = {
    fics: [
      'movements',
      'movement_nature_movement_codes',
      'movement_classes_movement_codes',
    ],
  }

  const headerProperties = {
    title: 'Movimientos plan de inversión',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Planes de inversión fiduciarios',
        route: 'FiduciaryInvestmentPlanList',
      },
      {
        label: 'Movimientos plan de inversión',
        route: 'CheckBalancesPlanList',
      },
    ],
  }

  const filterConfigRef = ref([
    {
      name: 'start_date',
      label: 'Fecha inicio',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'end_date',
      label: 'Fecha fin',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'movement_codes',
      label: 'Código de movimiento',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: movements,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      display_value: 'code',
    },
    {
      name: 'movement_class',
      label: 'Clase de movimiento',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: movement_classes_movement_codes,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      display_value: 'code',
    },
    {
      name: 'movement_nature',
      label: 'Naturaleza',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: movement_nature_movement_codes,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      display_value: 'code',
    },
    {
      name: 'operation_number',
      label: 'Operación',
      type: 'q-input',
      value: operation_number,
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      prepend_icon: defaultIconsLucide.magnify,
      placeholder: 'Buscar por código de operación',
      rules: [(val: string) => !val || only_number(val)],
    },
  ])

  const tableProps = ref({
    loading: false,
    columns: [
      {
        name: 'operation',
        required: true,
        label: '#',
        align: 'left',
        field: '__index',
        sortable: false,
        format: (item) => item || '-',
      },
      {
        name: 'movement_date',
        required: true,
        label: 'Fecha de movimiento',
        align: 'left',
        field: 'movement_date',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'movement_code_number',
        required: true,
        label: 'Código de movimiento',
        align: 'left',
        field: 'movement_code_number',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'movement_description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'movement_description',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'movement_class',
        required: true,
        label: 'Clase',
        align: 'left',
        field: 'movement_class',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'movement_nature',
        required: true,
        label: 'Naturaleza',
        align: 'left',
        field: 'movement_nature',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'operation_number',
        required: true,
        label: 'Operación',
        align: 'left',
        field: 'operation_number',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'value',
        required: true,
        label: 'Valor movimiento',
        align: 'left',
        field: 'value',
        sortable: true,
        format: (item) => (item ? formatCurrencyString(item) : '-'),
      },
      {
        name: 'is_annuled',
        required: true,
        label: 'Operación anulada',
        align: 'left',
        field: 'is_annuled',
        sortable: true,
        format: (item) => item || '-',
      },
    ] as QTable['columns'],
    rows: [] as IFicCheckBalancesPlansList[],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const listAction = async (filters: string = '') => {
    openMainLoader(true)

    await _getByIdCheckBalancesPlan(searchId, filters ? `&${filters}` : '')

    openMainLoader(false)
  }

  const handleClearFilters = () => {
    tableProps.value.rows = []
    operation_number.value = null
    delete filtersFormatRef.value['filter[operation_number]']
  }

  const handleFilter = async ($filters: {
    'filter[movement_nature]': string
    'filter[movement_class]': string
    'filter[movement_codes]': string
    'filter[end_date]': string
    'filter[start_date]': string
    'filter[operation_number]': string
  }) => {
    filtersFormatRef.value = {
      ...$filters,
    }
    await listAction(formatParamsCustom(filtersFormatRef.value))
  }

  const updatePage = async (page: number) => {
    filtersFormatRef.value = {
      ...filtersFormatRef.value,
      page: page,
    }
    await listAction(formatParamsCustom(filtersFormatRef.value))
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    filtersFormatRef.value = {
      ...filtersFormatRef.value,
      page: 1,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormatRef.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const exportExcel = async () => {
    openMainLoader(true)

    await _exportExcelCheckBalancesPlan(
      searchId,
      formatParamsCustom(filtersFormatRef.value)
    )

    openMainLoader(false)
  }

  const handleGoBack = () =>
    goToURL('CheckBalancesView', searchId, { reload: true })

  onMounted(async () => {
    _clearData()

    openMainLoader(true)
    await _getByIdCheckBalancesBasicData(searchId)

    if (operation_number.value) {
      filtersFormatRef.value = {
        page: 1,
        'filter[operation_number]': operation_number.value,
      }

      await listAction(formatParamsCustom(filtersFormatRef.value))
    }

    await _getResources(keys)

    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    _resetKeys(keys)
    handleClearFilters()
    resetOperationNumber()
  })

  watch(
    () => check_balances_plan_list.value,
    (val) => {
      tableProps.value.rows = val.map((row, index) => ({
        ...row,
        __index: index + 1,
      }))

      tableProps.value.pages = check_balances_plan_list_pages.value
    }
  )

  return {
    filterComponentRef,
    headerProperties,
    filterConfigRef,
    tableProps,
    handleClearFilters,
    updateRowsPerPage,
    handleFilter,
    handleGoBack,
    exportExcel,
    updatePage,
  }
}

export default useCheckBalancesPlanList
