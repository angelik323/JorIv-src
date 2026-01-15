import { useMainLoader, useRouteValidator } from '@/composables'
import {
  useResourceManagerStore,
  useTrustBusinessResourceStore,
  useTrustBusinessDocumentStructureStore,
} from '@/stores'
import { formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const useTrustBusinessDocumentStructureList = () => {
  const router = useRouter()
  const route = useRoute()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const {
    headerPropsDefault,
    pages,
    data_trust_business_document_structure_list,
  } = storeToRefs(useTrustBusinessDocumentStructureStore('v1'))
  const { _getListTrustBusinessDocumentStructure, _deleteAction } =
    useTrustBusinessDocumentStructureStore('v1')

  const headerProperties = headerPropsDefault.value

  const { document_structure_type } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const filters = [
    {
      name: 'type',
      label: 'Tipo datos',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      disable: false,
      options: document_structure_type,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      disable: false,
      icon: 'mdi-magnify',
      clean_value: true,
      placeholder: 'Buscar por código o descripción características',
    },
  ]
  const filterConfig = ref(filters)
  const filtersFormat = ref<Record<string, string | number>>({})

  const tableProperties = ref({
    title: 'Listado de estructura documento negocios fiduciarios',
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
        name: 'characteristic_code',
        required: true,
        label: 'Código de característica',
        align: 'left',
        field: 'characteristic_code',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción de característica',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo dato',
        align: 'left',
        field: 'type',
        sortable: true,
      },
      {
        name: 'is_obligatory',
        required: true,
        label: 'Obligatoriedad',
        align: 'left',
        field: (row) => (row.is_obligatory ? 'Sí' : 'No'),
        sortable: true,
      },
      {
        name: 'alert',
        required: true,
        label: 'Alerta',
        align: 'left',
        field: (row) => (row.alert ? 'Sí' : 'No'),
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
    rows: data_trust_business_document_structure_list.value,
    pages: pages,
    wrapCells: true,
  })

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar la estructura documento de negocio?',
    id: null as number | null,
  })

  const listAction = async () => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    const queryString = formatParamsCustom(filtersFormat.value)
    await _getListTrustBusinessDocumentStructure(
      queryString ? '&' + queryString : ''
    )
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

  const handlerGoTo = (goURL: string, id?: number) => {
    router.push({ name: goURL, params: { id } })
  }

  const openModalDelete = async (id: number) => {
    if (id) {
      alertModalConfig.value.id = id
      await alertModalRef.value.openModal()
    }
  }

  const handleDelete = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return
    await _deleteAction(alertModalConfig.value.id)
    await listAction()
    openMainLoader(false)
  }

  watch(
    () => data_trust_business_document_structure_list.value,
    () => {
      tableProperties.value.rows =
        data_trust_business_document_structure_list.value
    }
  )

  const keys = { trust_business: ['document_structure_type'] }

  onMounted(async () => {
    _getResources(keys)
    const reload = route.query.reload
    if (reload) {
      await listAction()
    }
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProperties,
    filterConfig,
    tableProperties,
    alertModalRef,
    alertModalConfig,
    handlerGoTo,
    handleFilterSearch,
    handleClearFilters,
    updatePage,
    updateRowsPerPage,
    openModalDelete,
    handleDelete,
    validateRouter,
  }
}

export default useTrustBusinessDocumentStructureList
