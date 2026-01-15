// Vue
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import {
  IBudgetRegistrationCertificateList,
  IBudgetRegistrationCertificatesGenerationStatuses,
} from '@/interfaces/customs/budget/BudgetRegistrationCertificate'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'
import { ResourceTypes } from '@/interfaces/customs'

// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

//Stores
import {
  useResourceManagerStore,
  useUserResourceStore,
} from '@/stores/resources-manager'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useBudgetRegistrationCertificateStore } from '@/stores/budget/budget-registration-certificate'

const useBudgetRegistrationCertificateList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, downloadFile } = useUtils()
  const { goToURL } = useGoToUrl()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    _listAction,
    _generateAction,
    _exportPDFAction,
    _bulkExportPDFAction,
    _getCertificatesGenerationStatus,
  } = useBudgetRegistrationCertificateStore('v1')
  const {
    business_trusts_with_budget_documents,
    budget_level_for_documents,
    budget_documents_by_level,
  } = storeToRefs(useBudgetResourceStore('v1'))
  const { users } = storeToRefs(useUserResourceStore('v1'))
  const isTableEmpty = ref(true)
  const showState = ref(0)

  const models = ref({
    business_trust_id: null as number | null,
    validity: new Date().getFullYear().toString(),
    budget_level_id: null as number | null,
    document_from: null as number | null,
    document_to: null as number | null,
    description_society: '',
    user_signature_id: null as number | null,
  })

  const keys: ResourceTypes = {
    budget: ['business_trusts_with_budget_documents', 'users'],
    user: ['users'],
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await Promise.all([
      _getResources(keys),
      _getResources({ budget: ['budget_levels'] }, 'filter[classexact]=CRP'),
    ])
    loadData(filtersFormat.value)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({ ...keys })
  })

  const filtersFormat = ref<
    {
      page: number
      per_page: number
    } & Record<string, string | number>
  >({
    page: 1,
    per_page: 20,
  })

  const headerProps = {
    title: 'Certificado de registro presupuestal',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Presupuesto',
      },
      {
        label: 'Certificado de registro presupuestal',
        route: 'BudgetRegistrationCertificateList',
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
      placeholder: 'Buscar por número de documento',
    },
  ])

  const tableProps = ref<IBaseTableProps<IBudgetRegistrationCertificateList>>({
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
        field: (row: IBudgetRegistrationCertificateList) =>
          row?.operation_log?.id ?? 0,
        sortable: true,
      },
      {
        name: 'fiscal_year',
        align: 'left',
        label: 'Vigencia',
        field: (row: IBudgetRegistrationCertificateList) =>
          row?.operation_log?.validity ?? 0,
        sortable: true,
      },
      {
        name: 'business',
        align: 'left',
        label: 'Negocio',
        field: (row: IBudgetRegistrationCertificateList) =>
          `${row?.operation_log?.business_trust?.business_code ?? ''} - ${
            row?.operation_log?.business_trust?.name ?? ''
          }`,
        sortable: true,
      },
      {
        name: 'generation_date',
        align: 'left',
        label: 'Fecha de generación',
        field: 'generated_at',
        sortable: true,
      },
      {
        name: 'status',
        align: 'left',
        label: 'Estado',
        field: (row: IBudgetRegistrationCertificateList) =>
          row?.operation_log?.status?.name ?? '',
        sortable: true,
      },
      {
        name: 'authorize_by',
        align: 'left',
        label: 'Usuario firma',
        field: (row: IBudgetRegistrationCertificateList) =>
          row?.user_signature?.full_name ?? '',
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

  const canCreateBulkPdfCertificates = computed<boolean>(() =>
    !fileExportableId.value ? true : false
  )

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

  const handleFilter = async ($filters: Record<string, string | number>) => {
    filtersFormat.value = {
      page: 1,
      per_page: filtersFormat.value.per_page,
      ...$filters,
    }
    await loadData(filtersFormat.value)
  }

  const handleClearFilters = async () => {
    filtersFormat.value = {
      page: 1,
      per_page: 20,
    }
    await loadData(filtersFormat.value)
  }

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page

    await loadData(filtersFormat.value)
  }

  const handleUpdatePerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.per_page = rows

    await loadData(filtersFormat.value)
  }

  const handleGenerateCertificate = async () => {
    const payload = {
      filter: {
        business_trust_id: models.value.business_trust_id,
        validity: Number(models.value.validity),
        budget_level_id: models.value.budget_level_id,
        document_from: models.value.document_from,
        document_to: models.value.document_to,
      },
      description_society: models.value.description_society,
      user_signature_id: models.value.user_signature_id,
    }

    openMainLoader(true)

    await _generateAction(payload)

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleViewCertificate = async (id: number) => {
    goToURL('BudgetRegistrationCertificateView', id)
  }

  const handleBulkCertificateCreation = async () => {
    if (fileExportableId.value) return

    openMainLoader(true)
    const res = await _bulkExportPDFAction()
    openMainLoader(false)

    if (res.success && res.data) {
      fileExportableId.value = res.data.file_exportable_id
      await loadData(filtersFormat.value)
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
      IBudgetRegistrationCertificatesGenerationStatuses.COMPLETED
    ) {
      alertModalConfig.value.title = ''
      alertModalConfig.value.descriptionMessage = ''

      if (res.file_url) {
        openMainLoader(true)
        await downloadFile(res.file_url)
        openMainLoader(false)
        fileExportableId.value = null
      }
      return
    }

    if (
      res.status_id ===
      IBudgetRegistrationCertificatesGenerationStatuses.PENDING
    ) {
      alertModalConfig.value.title =
        'El proceso de creación de certificados aún no ha sido completado'
      alertModalConfig.value.descriptionMessage = 'Estado actual: Pendiente'
    }

    if (
      res.status_id ===
      IBudgetRegistrationCertificatesGenerationStatuses.IN_PROCESS
    ) {
      alertModalConfig.value.title =
        'El proceso de creación de certificados aún no ha sido completado'

      alertModalConfig.value.descriptionMessage = 'Estado actual: Procesando'
    }

    if (
      res.status_id === IBudgetRegistrationCertificatesGenerationStatuses.ERRORS
    ) {
      alertModalConfig.value.title =
        'Se presentó un fallo durante el proceso de generación de los certificados'

      alertModalConfig.value.descriptionMessage =
        'Intente realizar nuevamente el proceso más tarde y si el problema persiste, póngase en contacto con el equipo de soporte'

      fileExportableId.value = null
    }

    await alertModalRef.value?.openModal()
  }

  const handleCloseAlertModal = () => alertModalRef.value?.closeModal()

  const downloadCertificate = async (id?: number) => {
    openMainLoader(true)
    if (id) await _exportPDFAction(id)
    else await _exportPDFAction()
    openMainLoader(false)
  }

  watch(
    [
      () => models.value.business_trust_id,
      () => models.value.validity,
      () => models.value.budget_level_id,
    ],
    async ([businessId, validity, levelId]) => {
      _resetKeys({ budget: ['budget_documents_by_level'] })
      if (businessId && validity && levelId) {
        openMainLoader(true)
        const filters = `filter[business_trust_id]=${businessId}&filter[document_year]=${validity}&filter[level]=${levelId}`
        await _getResources({ budget: ['budget_documents_by_level'] }, filters)
        openMainLoader(false)
      }
    }
  )

  return {
    showState,
    tableProps,
    headerProps,
    filterConfig,
    isTableEmpty,
    lastDescriptionSociety,
    business_trusts_with_budget_documents,
    budget_level_for_documents,
    users,
    budget_documents_by_level,
    models,
    canCreateBulkPdfCertificates,
    alertModalRef,
    alertModalConfig,
    handleFilter,
    handleUpdatePage,
    handleClearFilters,
    handleUpdatePerPage,
    handleGenerateCertificate,
    handleViewCertificate,
    handleBulkCertificateCreation,
    handleCertificatesGenerationStatus,
    handleCloseAlertModal,
    downloadCertificate,
  }
}

export default useBudgetRegistrationCertificateList
