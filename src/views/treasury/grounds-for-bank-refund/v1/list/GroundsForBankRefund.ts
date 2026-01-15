// vue | quasar | router
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'

// store
import { storeToRefs } from 'pinia'
import {
  useGroundsBankRefundStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'

// composables
import { useMainLoader, useRouteValidator } from '@/composables'

// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { IFieldFilters, IGroundsBankRefund } from '@/interfaces/customs'

const useGroundsForBankRefund = () => {
  const { _getApiGroundsBankRefund, _deleteGroundsBankRefund } =
    useGroundsBankRefundStore('v1')
  const { reason_return_apply, reason_return_status } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const { data_grounds_bank_list, data_gruonds_pages } = storeToRefs(
    useGroundsBankRefundStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const filtersFormat = ref<Record<string, string | number>>({})

  const keys = ['reason_return_apply', 'reason_return_status']

  const tableProps = ref({
    title: 'Causales de devolución bancaria',
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
        name: 'causal_code',
        field: 'causal_code',
        required: true,
        label: 'Código',
        align: 'left',
        sortable: true,
      },
      {
        name: 'name',
        field: 'name',
        required: true,
        label: 'Nombre',
        align: 'left',
        sortable: true,
      },
      {
        name: 'apply',
        field: 'apply',
        required: true,
        label: 'Aplica',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status',
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
    rows: [] as IGroundsBankRefund[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const headerProps = {
    title: 'Causales de devolución bancaria',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Causales de devolución bancaría',
        route: 'GroundsForBankRefund',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'apply',
      label: 'Aplica',
      type: 'q-select',
      value: '',
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: reason_return_apply,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      value: '',
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: reason_return_status,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por nombre o código',
    },
  ])

  // handlers / actions
  const handleFilter = ($filters: {
    'filter[apply]': string
    'filter[status]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }
  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getApiGroundsBankRefund(filters)
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

  const updateRows = (rows: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rows,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const clearRows = () => {
    tableProps.value.rows = []
  }

  // watchers
  watch(
    () => data_grounds_bank_list.value,
    () => {
      tableProps.value.pages.currentPage = data_gruonds_pages.value.currentPage
      tableProps.value.pages.lastPage = data_gruonds_pages.value.lastPage
      tableProps.value.rows = data_grounds_bank_list.value
    },
    { deep: true }
  )

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const openAlertModal = async (status: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Está seguro que desea ${status} la la causal de devolución bancaria?`
  }

  const changeStatusAction = async () => {
    await alertModalRef.value.closeModal()
    openMainLoader(true)
    await _deleteGroundsBankRefund(alertModalConfig.value.entityId as number)
    openMainLoader(false)
  }

  onMounted(async () => {
    await _getResources({ treasury: keys })
    reason_return_apply.value.push({ label: 'Todos', value: '' })
    reason_return_status.value.push({ label: 'Todos', value: '' })
  })

  onBeforeUnmount(() => _resetKeys({ treasury: keys }))

  return {
    alertModalRef,
    filterConfig,
    headerProps,
    tableProps,
    changeStatusAction,
    openAlertModal,
    handleFilter,
    updatePage,
    updateRows,
    clearRows,
    validateRouter,
  }
}

export default useGroundsForBankRefund
