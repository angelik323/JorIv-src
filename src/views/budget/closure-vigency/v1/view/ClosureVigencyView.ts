// vue - router - quasar - pinia
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
// Interfaces & types
import { IBaseTableProps } from '@/interfaces/global'
import type {
  IProcessedBusiness,
  IBusinessDocument,
} from '@/interfaces/customs/budget/ClosureVigency'
// Composable
import { useMainLoader } from '@/composables'
import { useGoToUrl } from '@/composables/useGoToUrl'
// Stores
import { useClosureVigencyStoreV1 } from '@/stores/budget/closure-vigency/closure-vigency-v1'

export const useClosureVigencyView = () => {
  const route = useRoute()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const {
    _getProcessDetailAction,
    _listProcessedBusinessesAction,
    _listBusinessDocumentsAction,
    _downloadErrorReportAction,
    _clearViewData,
  } = useClosureVigencyStoreV1()

  const {
    process_detail,
    processed_businesses,
    processed_businesses_pages,
    business_documents,
    business_documents_pages,
  } = storeToRefs(useClosureVigencyStoreV1())

  const processId = ref<string | number | null>(null)
  const selectedBusinessId = ref<string | number | null>(null)

  // Filtros para el listado de negocios procesados
  const filterBusiness = ref<string | number | null>(null)
  const filterStatus = ref<string | null>(null)

  // Opciones de estado para el filtro
  const statusOptions = [
    { label: 'Todos', value: null },
    { label: 'Exitoso', value: 'Exitoso' },
    { label: 'Con error', value: 'Con error' },
  ]

  // Título dinámico según tipo de proceso
  const headerProps = computed(() => ({
    title:
      process_detail.value?.action_type === 'undo'
        ? 'Ver cierre deshecho'
        : 'Ver cierre de vigencias',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      { label: 'Cierre de vigencia', route: 'BudgetValidityClosureList' },
      { label: 'Ver', route: 'BudgetValidityClosureView' },
    ],
  }))

  // TableProps para el listado de negocios procesados
  const tablePropsBusinesses = ref<IBaseTableProps<IProcessedBusiness>>({
    title: 'Listado de negocios procesados',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'select',
        required: true,
        label: 'Seleccione',
        field: 'selected',
        align: 'center',
        sortable: false,
      },
      {
        name: 'row_number',
        required: true,
        label: '#',
        field: '_row_number',
        align: 'center',
        sortable: false,
      },
      {
        name: 'business',
        required: true,
        label: 'Código/Negocio',
        field: (row: IProcessedBusiness) =>
          row.code && row.name ? `${row.code} - ${row.name}` : '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'closure_type',
        label: 'Tipo de cierre',
        field: 'closure_type',
        align: 'center',
        sortable: true,
      },
      {
        name: 'last_closed_vigency',
        label: 'Última vigencia cerrada',
        field: (row: IProcessedBusiness) =>
          row.last_closed_vigency ?? 'Sin cierre previo',
        align: 'center',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        field: 'status',
        align: 'center',
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  // TableProps para el listado de documentos del negocio
  const tablePropsDocuments = ref<IBaseTableProps<IBusinessDocument>>({
    title: 'Listado de documentos del negocio',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'row_number',
        required: true,
        label: '#',
        field: '_row_number',
        align: 'center',
        sortable: false,
      },
      {
        name: 'document_type',
        label: 'Tipo de documento',
        field: (row: IBusinessDocument) =>
          row.document_type_code && row.document_type_name
            ? `${row.document_type_code} - ${row.document_type_name}`
            : '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'document_number',
        label: 'Número de documento',
        field: 'document_number',
        align: 'left',
        sortable: true,
      },
      {
        name: 'new_document_type',
        label: 'Nuevo tipo de documento',
        field: (row: IBusinessDocument) =>
          row.new_document_type_code && row.new_document_type_name
            ? `${row.new_document_type_code} - ${row.new_document_type_name}`
            : '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'new_document_number',
        label: 'Nuevo número de documento',
        field: (row: IBusinessDocument) => row.new_document_number ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'last_closed_vigency',
        label: 'Última vigencia cerrada',
        field: (row: IBusinessDocument) =>
          row.last_closed_vigency ?? 'Sin cierre previo',
        align: 'center',
        sortable: true,
      },
      {
        name: 'level',
        label: 'Nivel',
        field: (row: IBusinessDocument) =>
          row.level_code && row.level_name
            ? `${row.level_code} - ${row.level_name}`
            : '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'budget_item',
        label: 'Rubro presupuestal',
        field: (row: IBusinessDocument) =>
          row.budget_item_code && row.budget_item_name
            ? `${row.budget_item_code} - ${row.budget_item_name}`
            : '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'resource',
        label: 'Recurso',
        field: (row: IBusinessDocument) =>
          row.resource_code && row.resource_name
            ? `${row.resource_code} - ${row.resource_name}`
            : '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'area',
        label: 'Área',
        field: (row: IBusinessDocument) =>
          row.area_code && row.area_name
            ? `${row.area_code} - ${row.area_name}`
            : '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'balance',
        label: 'Saldo',
        field: (row: IBusinessDocument) =>
          row.balance.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
          }),
        align: 'right',
        sortable: true,
      },
      {
        name: 'value',
        label: 'Valor',
        field: (row: IBusinessDocument) =>
          row.value.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
          }),
        align: 'right',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        field: 'status',
        align: 'center',
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  // Computed: opciones de negocio para el filtro (incluyendo "Todos")
  const businessFilterOptions = computed(() => {
    const options: Array<{ label: string; value: string | number | null }> = [
      { label: 'Todos', value: null },
    ]
    processed_businesses.value.forEach((business) => {
      options.push({
        label: `${business.code} - ${business.name}`,
        value: business.id,
      })
    })
    return options
  })

  // Computed: verificar si hay errores en los negocios procesados
  const hasErrors = computed(() => {
    return processed_businesses.value.some((b) => b.status === 'Con error')
  })

  // Formatear tipo de proceso
  const formatProcessType = (actionType: string | null | undefined) => {
    if (actionType === 'close') return 'Cierre'
    if (actionType === 'undo') return 'Deshacer cierre'
    return '-'
  }

  // Obtener color del badge de estado
  const getStatusColor = (status: string | null | undefined) => {
    if (status === 'Exitoso') return 'positive'
    if (status === 'Con error') return 'negative'
    if (status === 'Pendiente') return 'warning'
    if (status === 'Procesando') return 'info'
    return 'grey'
  }

  // Cargar datos iniciales
  const loadData = async () => {
    if (!processId.value) return

    openMainLoader(true)
    const detail = await _getProcessDetailAction(processId.value)

    if (!detail) {
      openMainLoader(false)
      goToURL('BudgetValidityClosureList')
      return
    }

    await loadBusinesses()
    openMainLoader(false)
  }

  // Cargar listado de negocios procesados
  const loadBusinesses = async () => {
    if (!processId.value) return

    tablePropsBusinesses.value.loading = true

    const params: Record<string, string | number> = {}
    if (filterBusiness.value) {
      params['filter[business_id]'] = filterBusiness.value
    }
    if (filterStatus.value) {
      params['filter[status]'] = filterStatus.value
    }

    await _listProcessedBusinessesAction(processId.value, params)
    tablePropsBusinesses.value.loading = false
  }

  // Cargar documentos del negocio seleccionado
  const loadBusinessDocuments = async () => {
    if (!processId.value || !selectedBusinessId.value) return

    tablePropsDocuments.value.loading = true
    await _listBusinessDocumentsAction(
      processId.value,
      selectedBusinessId.value,
      {}
    )
    tablePropsDocuments.value.loading = false
  }

  // Seleccionar un negocio (radio button)
  const handleSelectBusiness = (businessId: string | number) => {
    selectedBusinessId.value = businessId

    // Actualizar selección visual
    processed_businesses.value.forEach((business) => {
      business.selected = business.id === businessId
    })

    loadBusinessDocuments()
  }

  // Aplicar filtros
  const handleApplyFilters = async () => {
    selectedBusinessId.value = null
    business_documents.value.length = 0
    await loadBusinesses()
  }

  // Descargar reporte de errores
  const handleDownloadErrorReport = async () => {
    if (!processId.value) return

    openMainLoader(true)
    await _downloadErrorReportAction(processId.value)
    openMainLoader(false)
  }

  // Volver al listado (Finalizar)
  const handleFinish = () => {
    _clearViewData()
    goToURL('BudgetValidityClosureList')
  }

  // Actualizar página de negocios
  const handleUpdateBusinessPage = async (page: number) => {
    if (!processId.value) return

    tablePropsBusinesses.value.loading = true

    const params: Record<string, string | number> = { page }
    if (filterBusiness.value) {
      params['filter[business_id]'] = filterBusiness.value
    }
    if (filterStatus.value) {
      params['filter[status]'] = filterStatus.value
    }

    await _listProcessedBusinessesAction(processId.value, params)
    tablePropsBusinesses.value.loading = false
  }

  // Actualizar página de documentos
  const handleUpdateDocumentPage = async (page: number) => {
    if (!processId.value || !selectedBusinessId.value) return

    tablePropsDocuments.value.loading = true
    await _listBusinessDocumentsAction(
      processId.value,
      selectedBusinessId.value,
      {
        page,
      }
    )
    tablePropsDocuments.value.loading = false
  }

  // Watch para sincronizar datos de negocios con la tabla
  watch(
    () => processed_businesses.value,
    () => {
      tablePropsBusinesses.value.rows = processed_businesses.value
      tablePropsBusinesses.value.pages.currentPage =
        processed_businesses_pages.value.currentPage
      tablePropsBusinesses.value.pages.lastPage =
        processed_businesses_pages.value.lastPage
    },
    { deep: true }
  )

  // Watch para sincronizar datos de documentos con la tabla
  watch(
    () => business_documents.value,
    () => {
      tablePropsDocuments.value.rows = business_documents.value
      tablePropsDocuments.value.pages.currentPage =
        business_documents_pages.value.currentPage
      tablePropsDocuments.value.pages.lastPage =
        business_documents_pages.value.lastPage
    },
    { deep: true }
  )

  onMounted(async () => {
    processId.value = route.params.id as string
    if (processId.value) {
      await loadData()
    }
  })

  onBeforeUnmount(() => {
    _clearViewData()
  })

  return {
    headerProps,
    process_detail,
    tablePropsBusinesses,
    tablePropsDocuments,
    filterBusiness,
    filterStatus,
    statusOptions,
    businessFilterOptions,
    selectedBusinessId,
    hasErrors,
    formatProcessType,
    getStatusColor,
    handleSelectBusiness,
    handleApplyFilters,
    handleDownloadErrorReport,
    handleFinish,
    handleUpdateBusinessPage,
    handleUpdateDocumentPage,
  }
}
