import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

//Composables
import {
  useUtils,
  useRules,
  useRouteValidator,
  useMainLoader,
  useGoToUrl,
} from '@/composables'

//Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IAttachedDocumentsList } from '@/interfaces/customs/AttachedDocuments'

//Constants
import { default_statuses } from '@/constants/resources'

//store
import { useAttachedDocumentsStore } from '@/stores/derivative-contracting/attached-documents'

const useAttachedDocumentsList = () => {
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { attached_documents_list, attached_documents_pages } = storeToRefs(
    useAttachedDocumentsStore('v1')
  )

  let perPage = 20

  const { defaultIconsLucide } = useUtils()

  const {
    _getAttachedDocuments,
    _clearData,
    _changeStatus,
    _deleteAttachedDocument,
  } = useAttachedDocumentsStore('v1')

  const { min_length, max_length } = useRules()

  const headerProps = {
    title: 'Definición de documentos anexos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada' },
      {
        label: 'Definición de documentos anexos',
        route: 'AttachedDocumentsList',
      },
    ],
    actionLabel: 'Crear',
    actionIcon: defaultIconsLucide.plusCircle,
  }

  const tableProps = ref<IBaseTableProps<IAttachedDocumentsList>>({
    title: 'Listado de documentos anexos',
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
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre de documento anexo',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'stage',
        required: true,
        label: 'Etapa',
        align: 'left',
        field: 'stage',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'center',
        field: 'status',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'id',
        sortable: false,
      },
    ],
    rows: [],
    pages: attached_documents_pages.value,
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-6',
      options: default_statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por nombre o código',
      rules: [
        (val: string) => max_length(val, 50),
        (val: string) => min_length(val, 3),
      ],
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const alertModalDeleteRef = ref()
  const alertModalStatusRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    entityId: null as number | null,
    action: '',
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getAttachedDocuments(filters)
    tableProps.value.loading = false
    // Los datos se actualizan automáticamente a través de la reactividad del store
  }

  const handleFilter = async ($filters: {
    'filter[state]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      rows: perPage,
    }
    await listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) => {
    await listAction({ ...filtersFormat.value, page })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
      page: 1,
    }

    await listAction(filtersFormat.value)
  }

  const handleClear = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  onMounted(async () => {
    _clearData()
  })

  const openAlertModal = async (action: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.title = `¿Desea ${action} el documento anexo?`
    alertModalConfig.value.action =
      action === 'activar' ? 'activate' : 'inactivate'

    action === 'eliminar'
      ? await alertModalDeleteRef.value.openModal()
      : await alertModalStatusRef.value.openModal()
  }

  const changeStatusAction = async () => {
    if (!alertModalConfig.value.entityId) return

    openMainLoader(true)
    await _changeStatus(
      alertModalConfig.value.entityId,
      alertModalConfig.value.action
    )

    // Recargar la lista después de cambiar el estado para reflejar los cambios visuales
    await listAction(filtersFormat.value)

    openMainLoader(false)
    await alertModalStatusRef.value.closeModal()
  }

  const deleteAction = async () => {
    if (!alertModalConfig.value.entityId) return

    openMainLoader(true)
    await _deleteAttachedDocument(alertModalConfig.value.entityId)
    openMainLoader(false)
    await alertModalDeleteRef.value.closeModal()
  }

  watch(
    () => attached_documents_list.value,
    () => {
      tableProps.value.rows = attached_documents_list.value

      const { currentPage, lastPage } = attached_documents_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    alertModalDeleteRef,
    alertModalStatusRef,
    alertModalConfig,

    validateRouter,
    handleFilter,
    updatePage,
    updatePerPage,
    handleClear,
    headerProps,
    defaultIconsLucide,
    filterConfig,
    tableProps,
    goToURL,

    openAlertModal,
    changeStatusAction,
    deleteAction,
  }
}

export default useAttachedDocumentsList
