// Vue - Pinia
import { onBeforeUnmount, onBeforeMount, ref, computed } from 'vue'

// Interfaces
import {
  IBudgetAvailabilityCertificateList,
  IBudgetAvailabilityCertificatesGenerationStatuses,
} from '@/interfaces/customs/budget/BudgetAvailabilityCertificate'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'

// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import InformationForm from '@/components/Forms/Budget/BudgetAvailabilityCertificate/InformationForm/InformationForm.vue'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useRouteValidator } from '@/composables/useRoutesValidator'

// Stores
import { useBudgetAvailabilityCertificateStore } from '@/stores/budget/budget-availability-certificate'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBudgetAvailabilityCertificateList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, downloadFile } = useUtils()
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()

  const {
    _listAction,
    _generateAction,
    _exportPDFActionById,
    _bulkExportPDFAction,
    _getCertificatesGenerationStatus,
  } = useBudgetAvailabilityCertificateStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref<InstanceType<typeof InformationForm> | null>(
    null
  )

  const keysClean = {
    budget: [
      'business_trusts_with_documents',
      'budget_document_number',
      'budget_levels',
    ],
  }

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const headerProps = {
    title: 'Certificado de disponibilidad presupuestal',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Presupuesto',
      },
      {
        label: 'Certificado de disponibilidad presupuestal',
        route: 'BudgetAvailabilityCertificateList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'document_number',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12',
      disable: false,
      clean_value: true,
      prepend_icon: defaultIconsLucide.magnify,
      placeholder: 'Buscar por código de estructura y/o finalidad',
    },
  ])

  const tableProps = ref<IBaseTableProps<IBudgetAvailabilityCertificateList>>({
    title: 'Listado historial de certificados generados',
    loading: false,
    columns: [
      {
        name: 'id',
        align: 'center',
        label: '#',
        field: 'id',
      },
      {
        name: 'document_number',
        align: 'left',
        label: 'Número de documento',
        field: (row) => row.operation_log.id,
        sortable: true,
      },
      {
        name: 'validity',
        align: 'left',
        label: 'Vigencia',
        field: (row) => row.operation_log.validity,
        sortable: true,
      },
      {
        name: 'business',
        align: 'left',
        label: 'Negocio',
        field: (row) =>
          `${row.operation_log.business_trust.business_code} - ${row.operation_log.business_trust.name}`,
        sortable: true,
      },
      {
        name: 'generated_at',
        align: 'left',
        label: 'Fecha de generación',
        field: 'generated_at',
        sortable: true,
      },
      {
        name: 'status',
        align: 'left',
        label: 'Estado',
        field: (row) => row.operation_log.status?.id ?? '-',
        sortable: true,
      },
      {
        name: 'created_by',
        align: 'left',
        label: 'Usuario elabora',
        field: (row) => {
          if (!row.operation_log.user_created) return '-'
          return `${row.operation_log.user_created.name} ${row.operation_log.user_created.last_name}`
        },
        sortable: true,
      },
      {
        name: 'authorize_by',
        align: 'left',
        label: 'Usuario autoriza',
        field: (row) => {
          if (!row.operation_log.authorized_user) return '-'
          return `${row.operation_log.authorized_user.name} ${row.operation_log.authorized_user.last_name}`
        },
        sortable: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'id',
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const loadResources = async () => {
    openMainLoader(true)

    await _getResources({
      budget: [
        'business_trusts_with_documents',
        'filter[operation_type]=operation',
      ],
    })
    await _getResources({ budget: ['budget_levels'] }, 'filter[class]=CDP')
    await _getResources(
      { budget: ['budget_document_number'] },
      'filter[operation_type]=operation&filter[statuses]=all'
    )

    setTimeout(() => openMainLoader(false), 1000)
  }

  const fileExportableId = ref<number | null>(null)
  const lastDescriptionSociety = ref('')

  const loadData = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    const response = await _listAction(filters)

    tableProps.value.rows = response.list
    tableProps.value.pages = response.pages

    fileExportableId.value = response.last_file_exportable_id
    lastDescriptionSociety.value = response.last_description_society

    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[document_number]': string
  }) => await loadData({ ...$filters })

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page

    await loadData(filtersFormat.value)
  }

  const handleUpdatePerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await loadData(filtersFormat.value)
  }

  const generateCertificate = async () => {
    if (!informationFormRef.value) return

    const isValid = await informationFormRef.value?.validateForm()
    if (!isValid) return

    openMainLoader(true)

    await _generateAction(informationFormRef.value.getValues())

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleGoToShowView = (row: IBudgetAvailabilityCertificateList) => {
    goToURL('BudgetAvailabilityCertificateView', row.id)
  }

  const canCreateBulkPdfCertificates = computed<boolean>(() =>
    !fileExportableId.value ? true : false
  )

  const handleBulkCertificateCreation = async () => {
    if (fileExportableId.value) return

    openMainLoader(true)
    const res = await _bulkExportPDFAction()
    openMainLoader(false)

    if (res.success && res.data) {
      fileExportableId.value = res.data.file_exportable_id
      return
    }
  }

  const alertModalRef = ref<InstanceType<typeof AlertModalComponent> | null>(
    null
  )
  const alertModalConfig = ref({
    title: '',
    descriptionMessage: '',
    showBtnCancel: false,
  })

  const handleCertificatesGenerationStatus = async () => {
    if (!fileExportableId.value) return

    const res = await _getCertificatesGenerationStatus(fileExportableId.value)

    if (!res) return

    if (
      res.status_id ===
      IBudgetAvailabilityCertificatesGenerationStatuses.COMPLETED
    ) {
      alertModalConfig.value.title = ''
      alertModalConfig.value.descriptionMessage = ''
      openMainLoader(true)
      await downloadFile(res.file_url)
      openMainLoader(false)
      return
    }

    if (
      res.status_id ===
      IBudgetAvailabilityCertificatesGenerationStatuses.PENDING
    ) {
      alertModalConfig.value.title =
        'Es proceso de creación de certificados aún no ha sido completado'
      alertModalConfig.value.descriptionMessage = 'Estado actual: Pendiente'
    }

    if (
      res.status_id ===
      IBudgetAvailabilityCertificatesGenerationStatuses.IN_PROCESS
    ) {
      alertModalConfig.value.title =
        'El proceso de creación de certificados aún no ha sido completado'

      alertModalConfig.value.descriptionMessage = 'Estado actual: Procesando'
    }

    if (
      res.status_id === IBudgetAvailabilityCertificatesGenerationStatuses.ERRORS
    ) {
      alertModalConfig.value.title =
        'Se presentó un fallo durante el proceso de generación de los certificados'

      alertModalConfig.value.descriptionMessage =
        'Intente realizar nuevamente el proceso más tarde y si el problema persiste, póngase en contacto con el equipo de soporte'
    }

    await alertModalRef.value?.openModal()
  }

  const handleCloseAlertModal = () => alertModalRef.value?.closeModal()

  const handleDownloadCertificateById = async (id: number) => {
    openMainLoader(true)
    await _exportPDFActionById(id)
    openMainLoader(false)
  }

  const canViewCertificateDetail = () =>
    validateRouter('Budget', 'BudgetAvailabilityCertificateList', 'show')

  const canExportCertificate = () =>
    validateRouter('Budget', 'BudgetAvailabilityCertificateList', 'export')

  onBeforeMount(async () => {
    await Promise.all([loadResources(), loadData(filtersFormat.value)])
  })

  onBeforeUnmount(() => _resetKeys(keysClean))

  return {
    tableProps,
    headerProps,
    filterConfig,
    lastDescriptionSociety,
    informationFormRef,
    canCreateBulkPdfCertificates,
    alertModalRef,
    alertModalConfig,
    handleFilter,
    handleUpdatePage,
    handleUpdatePerPage,
    generateCertificate,
    handleDownloadCertificateById,
    handleBulkCertificateCreation,
    handleCertificatesGenerationStatus,
    handleCloseAlertModal,
    handleGoToShowView,
    canViewCertificateDetail,
    canExportCertificate,
  }
}

export default useBudgetAvailabilityCertificateList
