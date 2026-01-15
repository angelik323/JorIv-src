// vue | quasar | router
import { QTable } from 'quasar'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

// store
import { storeToRefs } from 'pinia'
import { useResourceStore, useTypeAccountingReceiptStore } from '@/stores'

// composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// utils
import { formatParamsCustom } from '@/utils'

// interfaces
import { ITypeAccountingAction } from '@/interfaces/customs'

const useTypesAccountingReceiptList = () => {
  // imports
  const router = useRouter()

  const { openMainLoader } = useMainLoader()

  const { _getListAction, _changeStatusAction } =
    useTypeAccountingReceiptStore('v1')

  const { type_accounting_receipt_list, type_accounting_receipt_pages } =
    storeToRefs(useTypeAccountingReceiptStore('v1'))

  const { status } = storeToRefs(useResourceStore('v1'))

  // props
  const headerProps = {
    title: 'Administración tipos de comprobantes contables',
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
        label: 'Tipos de comprobantes',
        route: 'TypeAccountingReceiptList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de tipos de comprobantes',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: true,
        label: 'Código de comprobante',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre de comprobante',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado',
        align: 'center',
        field: 'status_id',
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
    rows: [] as ITypeAccountingAction[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  // filter
  const filterConfig = ref([
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-6 col-lg-6 q-py-md',
      options: status.value.filter((item) => item.value !== 0),
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-6 col-lg-6 q-py-md',
      disable: false,
      icon: 'mdi-magnify',
      clean_value: true,
      placeholder: 'Buscar por nombre o código',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

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

  const handleFilter = ($filters: {
    'filter[status_id]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  // actions
  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const changeStatusAction = async () => {
    await alertModalRef.value.closeModal()
    openMainLoader(true)
    await _changeStatusAction(alertModalConfig.value.entityId as number)
    openMainLoader(false)
  }

  // modal
  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
    statusId: null as number | null,
  })

  const openAlertModal = async (
    status: string,
    entityId: number,
    statusId: number
  ) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    alertModalConfig.value.statusId = statusId
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Está seguro que desea ${status} el plan de cuentas?`
  }

  // watch
  watch(
    () => type_accounting_receipt_list.value,
    () => {
      tableProps.value.rows = type_accounting_receipt_list.value
      tableProps.value.pages = type_accounting_receipt_pages.value
    },
    { deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
    alertModalRef,

    handleFilter,
    handlerGoTo,
    openAlertModal,
    changeStatusAction,
    updatePage,
    updateRows,
  }
}

export default useTypesAccountingReceiptList
