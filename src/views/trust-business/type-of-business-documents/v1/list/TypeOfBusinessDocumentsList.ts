// Composables
import { useMainLoader, useRouteValidator } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useTypeOfBusinessDocumentsStore } from '@/stores/trust-business/type-of-business-documents'

import { formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const useTypeOfBusinessDocumentsList = () => {
  const router = useRouter()
  const route = useRoute()
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()

  const { headerPropsDefault, pages, data_type_of_business_documents_list } =
    storeToRefs(useTypeOfBusinessDocumentsStore('v1'))
  const { _getListTypeOfBusinessDocuments, _deleteAction } =
    useTypeOfBusinessDocumentsStore('v1')

  const headerProperties = headerPropsDefault.value

  const { business_trust_register_types } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const filters = [
    {
      name: 'apply_for',
      label: 'Aplica para',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      disable: false,
      options: business_trust_register_types,
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
      placeholder: 'Buscar por código o nombre de documento',
    },
  ]
  const filterConfig = ref(filters)
  const filtersFormat = ref<Record<string, string | number>>({})

  const tableProperties = ref({
    title: 'Listado de tipos de un documento',
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
        name: 'document_code',
        required: true,
        label: 'Código de documento',
        align: 'left',
        field: 'document_code',
        sortable: true,
      },
      {
        name: 'document_description',
        required: true,
        label: 'Descripción documento',
        align: 'left',
        field: 'document_description',
        sortable: true,
      },
      {
        name: 'current_business_requirements',
        required: true,
        label: 'Requisito para negocio vigente',
        align: 'left',
        field: (row) => (row.current_business_requirements ? 'Sí' : 'No'),
        sortable: true,
      },
      {
        name: 'apply_for',
        required: true,
        label: 'Aplica para',
        align: 'left',
        field: 'apply_for',
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
    rows: data_type_of_business_documents_list.value,
    pages: pages,
    wrapCells: true,
  })

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el tipo de documento?',
    id: null as number | null,
  })

  const listAction = async () => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    const queryString = formatParamsCustom(filtersFormat.value)
    await _getListTypeOfBusinessDocuments(queryString ? '&' + queryString : '')
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
    () => data_type_of_business_documents_list.value,
    () => {
      tableProperties.value.rows = data_type_of_business_documents_list.value
    }
  )

  const keys = { trust_business: ['business_trust_register_types'] }

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

export default useTypeOfBusinessDocumentsList
