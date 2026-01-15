import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'

import { useMainLoader } from '@/composables'
import { useAmortizationTableStore } from '@/stores'
import { IFieldFilters } from '@/interfaces/customs'
import { IAmortizationTitleTableRows } from '@/interfaces/customs/'
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

export const useAmortizationTitleTableList = () => {
  const {
    amortization_title_table_list,
    amortization_title_table_pages,
    document_data_table,
  } = storeToRefs(useAmortizationTableStore('v1'))
  const { _getAmortizationTableList, _deleteAmortizationTitle } =
    useAmortizationTableStore('v1')
  const { openMainLoader } = useMainLoader()
  const router = useRouter()
  let perPage = 20
  const headerProps = {
    title: 'Tabla títulos amortizables',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversión', route: '' },
      {
        label: 'Tabla títulos amortizable',
        route: 'AmortizationTitleTableList',
      },
    ],
  }
  const alertModalRef = ref()
  const filtersFormat = ref<Record<string, string | number>>({})
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar la tabla título amortizable?',
    id: null as number | null,
  })
  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IAmortizationTitleTableRows[]
    pages: typeof amortization_title_table_pages.value
    rowsPerPage: number
  }>({
    title: ' Listado de tablas de amortización',
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
        name: 'nemotecnico',
        required: false,
        label: 'Nemotécnico',
        align: 'left',
        field: 'mnemonic',
        sortable: true,
      },
      {
        name: 'Periodicidad de pago',
        required: false,
        label: 'Periodicidad de pago',
        align: 'left',
        field: 'payment_frequency',
        sortable: true,
      },
      {
        name: 'Modalidad',
        required: false,
        label: 'Modalidad',
        align: 'left',
        field: 'modality',
        sortable: true,
      },
      {
        name: 'Fecha de emisión',
        required: false,
        label: 'Fecha de emisión',
        align: 'left',
        field: 'issue_date',
        sortable: true,
      },
      {
        name: 'Fecha de vencimiento',
        required: false,
        label: 'Fecha de vencimiento',
        align: 'left',
        field: 'maturity_date',
        sortable: true,
      },
      {
        name: 'Tipo de flujo',
        required: false,
        label: 'Tipo de flujo',
        align: 'left',
        field: 'flow_type',
        sortable: true,
      },
      {
        name: 'Porcentaje total',
        required: false,
        label: 'Porcentaje total',
        align: 'left',
        field: 'percentage_total',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'left',
        field: 'actions',
        sortable: true,
        style: 'width: 150px;',
      },
    ],

    rows: [],
    pages: amortization_title_table_pages.value,
    rowsPerPage: 10,
  })

  const openAlertModal = (id: number) => {
    alertModalConfig.value.id = id
    alertModalRef.value.openModal()
  }

  const handleFilter = ($filter: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filter,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const filters = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-12',
      prepend_icon: defaultIconsLucide.magnify,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código o coincidencia',
    },
  ])

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getAmortizationTableList(filters)
    tableProps.value.loading = false
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

  const handleClear = async () => {
    tableProps.value.rows = []
    filtersFormat.value = {}
  }
  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }
  const changeStatus = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return
    await _deleteAmortizationTitle(alertModalConfig.value.id)
    await listAction()
    openMainLoader(false)
  }

  watch(
    () => amortization_title_table_list.value,
    () => {
      tableProps.value.rows = amortization_title_table_list.value
    }
  )

  watch(
    () => document_data_table.value,
    () => {
      tableProps.value.rows = document_data_table.value ?? []
    },
    { deep: true }
  )

  return {
    headerProps,
    tableProps,
    filters,
    alertModalConfig,
    alertModalRef,
    updatePage,
    updatePerPage,
    changeStatus,
    openAlertModal,
    handleFilter,
    handleClear,
    handlerGoTo,
  }
}
