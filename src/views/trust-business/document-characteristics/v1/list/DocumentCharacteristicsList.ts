// Composables
import { useMainLoader, useRouteValidator } from '@/composables'

// Stores
import { useDocumentCharacteristicsStore } from '@/stores/trust-business/document-characteristics'

import { formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const useDocumentCharacteristicsList = () => {
  const router = useRouter()
  const route = useRoute()
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()

  const { headerPropsDefault, pages, data_document_characteristics_list } =
    storeToRefs(useDocumentCharacteristicsStore('v1'))
  const { _deleteAction, _getListDocumentCharacteristics } =
    useDocumentCharacteristicsStore('v1')

  const headerProperties = headerPropsDefault.value

  const filters = [
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      disable: false,
      icon: 'mdi-magnify',
      clean_value: true,
      placeholder: 'Buscar por nombre del negocio o descripción del documento',
    },
    {
      name: 'created_at',
      label: 'Fecha de creación',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      disable: false,
      clean_value: true,
      placeholder: 'YYYY-MM-DD',
      mask: 'YYYY-MM-DD',
    },
  ]
  const filterConfig = ref(filters)
  const filtersFormat = ref<Record<string, string | number>>({})

  const tableProperties = ref({
    title: 'Listado de características de documento',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business_name',
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        field: (row) =>
          `${row.business_trust?.business_code} - ${row.business_trust?.name}`,
        sortable: true,
      },
      {
        name: 'document_description',
        required: true,
        label: 'Descripción del documento',
        align: 'left',
        field: (row) =>
          `${row.business_trust_document_type?.document_code} - ${row.business_trust_document_type?.document_description}`,
        sortable: true,
      },
      {
        name: 'created_at',
        required: true,
        label: 'Fecha de creación',
        align: 'left',
        field: 'created_at',
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
    rows: data_document_characteristics_list.value,
    pages: pages,
    wrapCells: true,
  })

  const listAction = async () => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    const queryString = formatParamsCustom(filtersFormat.value)
    await _getListDocumentCharacteristics(queryString ? '&' + queryString : '')
    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }

  const handleFilterSearch = ($filters: {}) => {
    filtersFormat.value = {
      ...$filters,
      rows: filtersFormat.value.rows || 20,
      page: 1,
    }
    listAction()
  }

  const updatePage = (pageNumber: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: pageNumber as number,
    }
    listAction()
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1 as number,
      rows: rowsPerPage as number,
    }
    listAction()
  }

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar las características del documento?',
    id: null as number | null,
  })

  const openModalDelete = async (id: number) => {
    if (id) {
      alertModalConfig.value.id = id
      await alertModalRef.value.openModal()
    }
  }

  const handleDelete = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) {
      return
    }
    await _deleteAction(alertModalConfig.value.id)
    await listAction()
    openMainLoader(false)
  }

  const handlerGoTo = (goURL: string, id?: number) => {
    router.push({ name: goURL, params: { id } })
  }

  // lifecycle
  onMounted(async () => {
    const reload = route.query.reload
    if (reload) {
      await listAction()
    }
  })

  watch(
    () => data_document_characteristics_list.value,
    () => {
      tableProperties.value.rows = data_document_characteristics_list.value
    }
  )

  return {
    headerProperties,
    filterConfig,
    tableProperties,
    alertModalRef,
    alertModalConfig,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
    handlerGoTo,
    openModalDelete,
    handleDelete,
    validateRouter,
  }
}

export default useDocumentCharacteristicsList
