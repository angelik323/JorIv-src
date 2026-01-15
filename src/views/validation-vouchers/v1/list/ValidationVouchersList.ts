import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { defaultIcons, formatParamsCustom } from '@/utils'
import { IFieldFilters, IVouncherValidationModel } from '@/interfaces/customs'
import {
  useAccountingResourceStore,
  useResourceManagerStore,
  useValidationVouchersStore,
} from '@/stores'
import { QTable } from 'quasar'
import { useRouter } from 'vue-router'
import { useMainLoader, useRouteValidator, useUtils } from '@/composables'

const useValidationvouchersList = () => {
  const { validateRouter } = useRouteValidator()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const {
    _getListAction,
    _cleanValidationVouchersData,
    _exportXlsxValidationVouchersList,
  } = useValidationVouchersStore('v1')

  const { validation_vouchers_list, validation_vouchers_pages } = storeToRefs(
    useValidationVouchersStore('v1')
  )

  const {
    business_trust_label,
    account_structures_code_active_revert_vouchers,
    vouchers_validation_status,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const alertModalRef = ref()
  const hideFilters = ref<boolean>(true)

  let perPage = 20

  const tableProps = ref({
    title: 'Validación de comprobantes',
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
        required: true,
        label: 'Periodo',
        align: 'left',
        field: (row: IVouncherValidationModel) =>
          `${useUtils().formatDate(row.period_date ?? '', 'MM/YYYY')}`,
        sortable: true,
      },
      {
        name: 'structure',
        required: true,
        label: 'Estructura contable',
        align: 'left',
        field: (row: IVouncherValidationModel) => `${row.structure}`,
        sortable: true,
      },
      {
        name: 'from',
        required: true,
        label: 'Desde negocio',
        align: 'left',
        field: (row: IVouncherValidationModel) =>
          `${row.from_business_trust_id?.business_name}`,
        sortable: true,
      },
      {
        name: 'to',
        required: true,
        label: 'Hasta negocio',
        align: 'left',
        field: (row: IVouncherValidationModel) =>
          `${row.to_business_trust_id?.business_name}`,
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row: IVouncherValidationModel) => `${row.status.id}`,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IVouncherValidationModel[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const headerProps = {
    title: 'Validación de comprobantes',
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
        label: 'Validación de comprobantes',
        route: 'ValidationVouchers',
      },
    ],
    btn: {
      label: 'Crear',
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'account_structure_code',
      label: 'Estructura contable',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: account_structures_code_active_revert_vouchers,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'period',
      label: 'Periodo',
      type: 'q-date',
      value: null,
      mask: 'MM/YYYY',
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
    },
    {
      name: 'from_business_trust_id',
      label: 'Desde negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: business_trust_label,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'to_business_trust_id',
      label: 'Hasta negocio',
      type: 'q-select',
      value: null,
      options: business_trust_label,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      prepend_icon: defaultIcons.magnify,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'initial_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      mask: 'DD/MM/YYYY',
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      hide: true,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'final_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      mask: 'DD/MM/YYYY',
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      hide: true,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: vouchers_validation_status,
      disable: false,
      hide: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const keys = [
    'account_structures_active',
    'business_trust',
    'vouchers_validation_status',
  ]

  const handleFilter = ($filters: {
    'filter[account_structure_code]': string
    'filter[period]': string
    'filter[from_business_trust_id]': string
    'filter[to_business_trust_id]': string
    'filter[initial_date]': string
    'filter[final_date]': string
    'filter[status]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const clearFilters = () => {
    _cleanValidationVouchersData()
  }

  const handleShowMoreFilters = () => {
    hideFilters.value = !hideFilters.value
    filterConfig.value[4].hide = hideFilters.value
    filterConfig.value[5].hide = hideFilters.value
    filterConfig.value[6].hide = hideFilters.value
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const downloadAction = async () => {
    openMainLoader(true)
    const queryString = formatParamsCustom(filtersFormat.value)
    await _exportXlsxValidationVouchersList(queryString)
    openMainLoader(false)
  }

  // Computed property to check if download button should be disabled
  const isDownloadDisabled = computed(() => {
    // Check if table has data
    const hasTableData =
      tableProps.value.rows && tableProps.value.rows.length > 0

    return !hasTableData
  })

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const handleGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  onMounted(async () => {
    await _getResources({ accounting: keys })
    vouchers_validation_status.value.push({
      label: 'Todos',
      value: 'ALL',
      status: '',
    })
    _cleanValidationVouchersData()
  })

  onBeforeUnmount(() => _resetKeys({ treasury: keys }))

  watch(
    () => validation_vouchers_list.value,
    () => {
      tableProps.value.rows = validation_vouchers_list?.value
    }
  )

  watch(
    () => validation_vouchers_pages.value,
    () => {
      tableProps.value.pages = validation_vouchers_pages.value
    }
  )

  return {
    headerProps,
    tableProps,
    alertModalRef,
    filterConfig,
    isDownloadDisabled,
    //
    handleFilter,
    clearFilters,
    handleShowMoreFilters,
    handleGoTo,
    updatePage,
    updatePerPage,
    downloadAction,
    validateRouter,
  }
}

export default useValidationvouchersList
