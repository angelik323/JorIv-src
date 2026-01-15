// Vue
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

// Vue Router
import { useRoute, useRouter } from 'vue-router'

// Interfaces
import {
  IBackendSeizureAsset,
  ISeizuresCreateForm,
  ISeizuresDetail,
  ISeizedAssetsList,
  ISeizureManagementHistory,
} from '@/interfaces/customs/seizures/Seizures'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import { useMainLoader, useGoToUrl, useUtils } from '@/composables'
import { storeToRefs } from 'pinia'

// Stores
import { useSeizuresStore } from '@/stores/seizures'
import {
  useResourceManagerStore,
  useSeizuresResourcesStore,
} from '@/stores/resources-manager'

const useSeizureView = () => {
  const route = useRoute()
  const router = useRouter()
  const id = Number(route.params.id)
  const { defaultIconsLucide } = useUtils()

  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const seizuresStore = useSeizuresStore('v1')
  const { _getAction } = seizuresStore

  const resourceManager = useResourceManagerStore('v1')
  const { _getResources, _resetKeys } = resourceManager
  const { procedures_type } = storeToRefs(useSeizuresResourcesStore('v1'))
  const isLoaded = ref(false)
  const canManageSeizure = computed(() => {
    return isLoaded.value && formData.value.status_name !== 'Levantado'
  })

  const manageModalRef = ref<{
    openModal: () => void
    closeModal: () => void
  } | null>(null)

  const formData = ref<ISeizuresCreateForm>({
    process_number: '',
    order_number: '',
    court_id: null,
    claimant_id: null,
    type_defendant_id: null,
    defendant_id: null,
    has_assigned_business: null,
    business_trusts_id: null,
    order_date: '',
    awareness_date: '',
    seizure_date: '',
    value_seizure: null,
    active_seizure_total: 0,
    city_id: null,
    management_area_id: null,
    process_type_id: null,
    observations: '',
    value_paid: 0,
    assets: [],
    claimant_object: null,
    defendant_object: null,
    business_trusts_object: null,
    city_object: null,
    document: null,
  })

  const headerProps = {
    title: 'Ver embargo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Embargos', route: 'EmbargoList' },
      { label: 'Ver', route: 'SeizuresView' },
      { label: id.toString() },
    ],
  }

  const historyTableProps = ref<IBaseTableProps<ISeizureManagementHistory>>({
    title: 'Histórico de gestiones',
    loading: false,
    wrapCells: true,
    columns: [
      { name: 'type', label: 'Tipo', field: 'type', align: 'left' },
      {
        name: 'description',
        label: 'Descripción',
        field: 'description',
        align: 'left',
      },
      { name: 'date', label: 'Fecha', field: 'date', align: 'left' },
      {
        name: 'created_by',
        label: 'Realizado por',
        field: 'created_by',
        align: 'left',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const historyPagination = ref({
    currentPage: 1,
    lastPage: 1,
    rowsPerPage: 20,
    rowsNumber: 0,
  })

  const updateHistoryPage = (page: number) => {
    historyPagination.value.currentPage = page
  }

  const updateHistoryRows = (rows: number) => {
    historyPagination.value.rowsPerPage = rows

    historyPagination.value.lastPage = Math.max(
      1,
      Math.ceil(
        historyPagination.value.rowsNumber / historyPagination.value.rowsPerPage
      )
    )
  }

  const handleConfirmManagement = () => {
    handleAcceptManagement()
  }

  const selectedManagement = ref<number | null>(null)

  const handleAcceptManagement = () => {
    if (!selectedManagement.value) return

    goToURL('SeizuresCreateManage', { id }, { type: selectedManagement.value })
  }

  const mapBackendAssetToView = (
    asset: IBackendSeizureAsset
  ): ISeizedAssetsList => {
    const isMovable = asset.asset_class?.includes('MUB')
    const isFiduciary = asset.product_type?.id === 4

    return {
      id: asset.id,
      asset_type: isMovable ? 2 : 1,
      seizure_assets_products_type_id: asset.product_type?.id ?? null,
      description: asset.description,
      asset_value: Number(asset.asset_value ?? 0),
      value: Number(asset.asset_value ?? 0),
      asset_class: asset.asset_class,
      assetable_type: asset.assetable?.type ?? '',
      assetable_id: asset.assetable?.id ?? 0,
      percentage: isFiduciary ? Number(asset.asset_value ?? 0) : null,
    }
  }

  const loadResources = async () => {
    await _getResources({
      seizures: [
        'courst',
        'management_areas',
        'process_types',
        'type_defendants',
        'seizure_status',
        'procedures_type',
      ],
      assets: ['cities'],
      third_party: ['third_parties'],
      trust_business: ['business_trusts'],
    })
  }

  const loadData = async () => {
    openMainLoader(true)

    await loadResources()

    const data: ISeizuresDetail | null = await _getAction(id)

    if (data?.business_trust?.id) {
      await _getResources(
        { treasury: ['bank_account'] },
        `include=bank,bank.contacts,lastBalance&filter[business_id]=${data.business_trust.id}`
      )
    }

    if (!data) {
      openMainLoader(false)
      router.push({ name: 'SeizuresList' })
      return
    }

    formData.value = {
      process_number: data.process_number,
      order_number: data.order_number,
      court_id: Number(data.court_id ?? 0),
      type_defendant_id: Number(data.type_defendant?.id ?? 0),
      process_type_id: Number(data.process_type?.id ?? 0),
      management_area_id: Number(data.management_area_id ?? 0),
      city_id: Number(data.city_id ?? 0),
      claimant_id:
        data.claimant_id !== null && data.claimant_id !== undefined
          ? Number(data.claimant_id)
          : null,
      defendant_id:
        data.defendant_id !== null && data.defendant_id !== undefined
          ? Number(data.defendant_id)
          : null,
      has_assigned_business: data.has_assigned_business,
      business_trusts_id:
        data.business_trusts_id !== null &&
        data.business_trusts_id !== undefined
          ? Number(data.business_trusts_id)
          : null,
      order_date: data.order_date,
      awareness_date: data.awareness_date,
      seizure_date: data.seizure_date ?? data.embargo_date,
      value_seizure: Number(data.value_seizure ?? 0),
      active_seizure_total: Number(data.active_seizure_total ?? 0),
      value_paid: Number(data.value_paid ?? 0),
      document: data.attachment ?? null,
      observations: data.observations ?? '',
      assets: Array.isArray(data.assets)
        ? data.assets.map((asset) =>
            mapBackendAssetToView(asset as unknown as IBackendSeizureAsset)
          )
        : [],

      claimant_object: null,
      defendant_object: null,
      business_trusts_object: null,
      city_object: null,
      status_id: data.status?.id ?? null,
      status_name: data.status?.status ?? null,
    }

    if (Array.isArray(data.procedures) && data.procedures.length > 0) {
      historyTableProps.value.rows = data.procedures.map((procedure) => {
        const createdBy = procedure.created_by

        return {
          id: procedure.id,
          type:
            procedure.procedures_type?.description ??
            procedures_type.value.find(
              (p) => p.id === procedure.seizure_procedure_type_id
            )?.label ??
            '—',
          description: procedure.observation ?? '',
          date: procedure.official_date,
          created_by: createdBy
            ? `${createdBy.document} - ${createdBy.name} ${createdBy.last_name}`
            : '—',
        }
      })
    } else {
      historyTableProps.value.rows = []
    }

    const claimant = data.claimant?.[0]
    formData.value.claimant_object = claimant
      ? {
          ...claimant,
          value: claimant.id,
          label:
            claimant.natural_person?.full_name ??
            claimant.legal_person?.business_name ??
            claimant.document,
          name:
            claimant.natural_person?.full_name ??
            claimant.legal_person?.business_name ??
            claimant.document,
        }
      : null

    const defendant = data.defendant
    formData.value.defendant_object = defendant
      ? {
          ...defendant,
          value: defendant.id,
          label: defendant.name ?? defendant.business_code ?? '—',
          name: defendant.name ?? defendant.business_code ?? '—',
        }
      : null

    const business = data.business_trust
    formData.value.business_trusts_object = business
      ? {
          ...business,
          value: business.id,
          label: `${business.business_code ?? ''} - ${business.name}`,
        }
      : null

    const city = data.city?.cities?.[0]
    formData.value.city_object = city
      ? {
          value: Number(city.code),
          label: city.name,
          code: city.code,
          name: city.name,
        }
      : null

    isLoaded.value = true
    openMainLoader(false)
  }

  const handleDownloadAttachment = () => {
    const attachment = formData.value.document as {
      s3_url_path?: string
      original_name?: string
      name?: string
    } | null

    if (!attachment?.s3_url_path) return

    const link = document.createElement('a')
    link.href = attachment.s3_url_path
    link.target = '_blank'
    link.download = attachment.original_name || attachment.name || 'oficio.pdf'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  onMounted(loadData)
  onBeforeUnmount(() => _resetKeys({}))

  return {
    headerProps,
    formData,
    historyTableProps,
    isLoaded,
    selectedManagement,
    manageModalRef,
    historyPagination,
    defaultIconsLucide,
    procedures_type,
    id,
    canManageSeizure,
    handleDownloadAttachment,
    updateHistoryPage,
    updateHistoryRows,
    handleConfirmManagement,
    handleAcceptManagement,
    goToURL,
  }
}

export default useSeizureView
