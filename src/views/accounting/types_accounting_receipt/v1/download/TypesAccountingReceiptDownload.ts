// vue | quasar | router
import { QTable } from 'quasar'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

// store
import { storeToRefs } from 'pinia'
import {
  useFiltersStore,
  useTypeAccountingReceiptStore,
  useResourceStore,
} from '@/stores'

// composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// utils
import { formatParamsCustom } from '@/utils'
import { IResource } from '@/interfaces/global'

// interfaces
import { ITypeAccountingAction } from '@/interfaces/customs'
import { useRouteValidator } from '@/composables'

const useTypesAccountingReceiptDownload = () => {
  // imports
  const router = useRouter()

  const { validateRouter } = useRouteValidator()

  const { openMainLoader } = useMainLoader()

  const { setFiltersState, setFilterValue } = useFiltersStore()

  const { _getListAction, _getDataExcel, _cleanData } =
    useTypeAccountingReceiptStore('v2')

  const { type_accounting_receipt_list, type_accounting_receipt_pages } =
    storeToRefs(useTypeAccountingReceiptStore('v2'))

  const { receipt_types } = storeToRefs(useResourceStore('v1'))

  const { _getAccountingResources } = useResourceStore('v1')

  const from_receipt_types = ref<IResource[]>([])
  const to_receipt_types = ref<IResource[]>([])
  const changeRef = ref()

  // keys
  const keys = ['receipt_types']

  // props
  const headerProps = {
    title: 'Descargar tipos de comprobantes',
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
      {
        label: 'Descargar',
        route: 'TypeAccountingReceiptDownload',
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
        label: 'Comprobante',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'sub_code',
        required: true,
        label: 'Sub tipo comprobantes',
        align: 'left',
        field: (row) => row.code,
        sortable: true,
        style: {
          'padding-right': '0',
          'padding-top': '0',
          'padding-bottom': '0',
        },
      },
      {
        name: 'sub_name',
        required: true,
        label: 'Nombre sub tipo comprobante',
        align: 'left',
        field: (row) => row.name,
        sortable: true,
        style: {
          'padding-right': '0',
          'padding-left': '0',
          'padding-top': '0',
          'padding-bottom': '0',
        },
      },
      {
        name: 'is_cancellation',
        required: true,
        label: 'Anulación',
        align: 'left',
        field: 'is_cancellation',
        sortable: true,
        style: {
          'padding-right': '0',
          'padding-left': '0',
          'padding-top': '0',
          'padding-bottom': '0',
        },
      },

      {
        name: 'cancellation_association',
        required: true,
        label: 'Comprobante anulación',
        align: 'left',
        field: (row) => row.cancellation_association?.name,
        sortable: true,
        style: {
          'padding-right': '0',
          'padding-left': '0',
          'padding-top': '0',
          'padding-bottom': '0',
        },
      },
      {
        name: 'is_upload_receipt',
        required: true,
        label: 'Cargue',
        align: 'left',
        field: 'is_upload_receipt',
        sortable: true,
        style: {
          'padding-right': '0',
          'padding-left': '0',
          'padding-top': '0',
          'padding-bottom': '0',
        },
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row) => row.status_id,
        sortable: true,
        style: {
          'padding-right': '0',
          'padding-left': '0',
          'padding-top': '0',
          'padding-bottom': '0',
        },
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
      name: 'code_from',
      label: 'Desde compobante',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 col-lg-3 q-py-md',
      options: from_receipt_types,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'from_name',
      label: 'Nombre de comprobante',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 col-lg-3 q-py-md',
      disable: true,
      clean_value: false,
      placeholder: '',
    },
    {
      name: 'code_to',
      label: 'Hasta comprobante',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 col-lg-3 q-py-md',
      options: to_receipt_types,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'to_name',
      label: 'Nombre de comprobante',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 col-lg-3 q-py-md',
      disable: true,
      clean_value: true,
      placeholder: '',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[code_from]': string
    'filter[code_to]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    delete filtersFormat.value['filter[from_name]']
    delete filtersFormat.value['filter[to_name]']
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const onFilterChange = (filters: Record<string, string | number | null>) => {
    if ('filter[code_from]' in filters) {
      const fromName = receipt_types.value.find(
        (item) => item.value === filters['filter[code_from]']
      )?.label
      if (fromName) {
        setFilterValue('code_from', filters['filter[code_from]'])
        setFilterValue('from_name', fromName)
        changeRef.value = filters['filter[code_from]']
      }
    } else {
      setFilterValue('code_from', null)
      setFilterValue('from_name', null)
    }
    if ('filter[code_to]' in filters) {
      const toName = receipt_types.value.find(
        (item) => item.value === filters['filter[code_to]']
      )?.label
      if (toName) {
        setFilterValue('code_to', filters['filter[code_to]'])
        setFilterValue('to_name', toName)
      }
    } else {
      setFilterValue('code_to', null)
      setFilterValue('to_name', null)
    }
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
      page: 1,
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

  const exportExcel = async () => {
    const params = {} as {
      code_from: string | number
      code_to: string | number
    }
    if (filtersFormat.value['filter[code_from]']) {
      params.code_from = filtersFormat.value['filter[code_from]']
    }
    if (filtersFormat.value['filter[code_to]']) {
      params.code_to = filtersFormat.value['filter[code_to]']
    }

    const queryString = formatParamsCustom(params)
    openMainLoader(true)
    await _getDataExcel(queryString ? '?' + queryString : '')
    openMainLoader(false)
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  onMounted(async () => {
    await _getAccountingResources(`keys[]=${keys.join('&keys[]=')}`)
    setFiltersState(filterConfig.value)
  })
  // watch
  watch(
    () => type_accounting_receipt_list.value,
    () => {
      tableProps.value.rows = type_accounting_receipt_list.value
      tableProps.value.pages = type_accounting_receipt_pages.value
    },
    { deep: true }
  )

  watch(
    () => receipt_types.value,
    () => {
      from_receipt_types.value = receipt_types.value.map((item) => ({
        label: String(item.value ?? ''),
        value: item.value ?? '',
      }))
      to_receipt_types.value = receipt_types.value.map((item) => ({
        label: String(item.value ?? ''),
        value: item.value ?? '',
      }))
    },
    { immediate: true, deep: true }
  )

  watch(
    () => changeRef.value,
    () => {
      to_receipt_types.value = receipt_types.value
        .filter((item) => item.value >= changeRef.value)
        .map((item) => ({
          label: String(item.value ?? ''),
          value: item.value ?? '',
        }))
      setFilterValue('code_to', null)
      setFilterValue('to_name', null)
    },
    { immediate: true, deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
    updatePage,
    updateRows,
    _cleanData,
    onFilterChange,
    handleFilter,
    handlerGoTo,
    exportExcel,
    validateRouter,
  }
}

export default useTypesAccountingReceiptDownload
