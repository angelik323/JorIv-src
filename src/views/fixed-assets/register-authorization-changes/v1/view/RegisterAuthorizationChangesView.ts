// Vue
import { storeToRefs } from 'pinia'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import {
  INoveltyDetail,
  INoveltyView,
} from '@/interfaces/customs/fixed-assets/v1/Register-Authorization-Changes'

// Composables
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'

// components
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// Store
import { useFixedAssetsNoveltiesStore } from '@/stores/fixed-assets/register-authorization-changes'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useRegisterAuthorizationChangesView = () => {
  const route = useRoute()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { formatDate, formatCurrency, defaultIconsLucide } = useUtils()

  const noveltyId = Number(route.params.id)
  const { _getAction, _getNoveltyDocumentDownloadUrl } =
    useFixedAssetsNoveltiesStore('v1')

  const resourcesStore = useFixedAssetsResourceStore('v1')
  const { novelty } = storeToRefs(resourcesStore)
  const { _getResources } = useResourceManagerStore('v1')
  const { fixed_assets_configuration_subtypes } = storeToRefs(resourcesStore)

  const keys = {
    fixed_assets: ['fixed_assets_configuration_subtypes'],
  }

  const resolveAssetLabel = (assetId?: number): string => {
    if (!assetId) return '-'

    return (
      fixed_assets_configuration_subtypes.value.find(
        (item) => item.fixed_asset_code === assetId
      )?.label ?? String(assetId)
    )
  }

  const isLoaded = ref(false)
  const noveltyDetail = ref<INoveltyView>({
    novelty_code: '-',
    status: '-',
    asset: '-',
    created_at: '-',
    created_by: '-',
    updated_at: '-',
    updated_by: '-',
    novelty_type: '-',
    description: '-',
    solution_date: '-',
    cost: 0,
    generates_accounting: false,
    affectation_type: '-',
    additional_observation: '-',
    documents: [],
    accounting_voucher_id: null,
    accounting_voucher: null,
  })

  const headerProperties = {
    title: 'Ver novedad registrada',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Activos fijos' },
      {
        label: 'Registro y novedades de activos fijos/bienes',
        route: 'RegisterAuthorizationChangesList',
      },
      { label: 'Ver', route: 'RegisterAuthorizationChangesView' },
    ],
  }

  const generatesAccountingLabel = computed(() =>
    noveltyDetail.value.generates_accounting ? 'Sí' : 'No'
  )

  const resolveAffectationType = (noveltyTypeId?: number): string => {
    if (!noveltyTypeId) return '-'

    return (
      novelty.value.find((n) => n.value === noveltyTypeId)?.affectation_type ??
      '-'
    )
  }

  const mapDetailToView = (response: INoveltyDetail): INoveltyView => ({
    novelty_code: response.novelty_type?.code ?? '-',
    asset: resolveAssetLabel(response.asset_id),
    status: response.status?.status ?? '-',
    created_at: response.created_at,
    created_by: response.created_by ?? '-',
    updated_at: response.updated_at ?? '-',
    updated_by: response.updated_by ?? '-',
    novelty_type: response.novelty_type?.description ?? '-',
    description: response.description ?? '-',
    solution_date: response.solution_date ?? '-',
    cost: Number(response.cost ?? 0),
    generates_accounting: response.generates_accounting,
    affectation_type: resolveAffectationType(response.novelty_type?.id),
    additional_observation: '-',
    documents: response.documents ?? [],
    accounting_voucher_id: response.accounting_voucher_id ?? null,
    accounting_voucher: response.voucher_data
      ? {
          voucher_number: String(response.voucher_data.code ?? '-'),
          registration_date: response.voucher_data.registration_date ?? '-',
          status: response.voucher_data.status?.status ?? '-',
        }
      : null,
  })

  const openDocument = async (documentId: number): Promise<void> => {
    openMainLoader(true)

    const response = await _getNoveltyDocumentDownloadUrl(documentId)

    openMainLoader(false)

    if (!response?.download_url) return

    window.open(response.download_url, '_blank')
  }

  const loadNovelty = async (): Promise<void> => {
    openMainLoader(true)

    const response = await _getAction(noveltyId)

    openMainLoader(false)
    if (!response) return

    noveltyDetail.value = mapDetailToView(response)
    isLoaded.value = true
  }

  const goToAccountingVoucher = () => {
    const voucherId = noveltyDetail.value.accounting_voucher_id

    if (!voucherId) return

    goToURL('AccountingReceiptView', {
      id: voucherId,
    })
  }

  const init = async (): Promise<void> => {
    openMainLoader(true)

    await _getResources({
      fixed_assets: keys.fixed_assets,
    })

    await loadNovelty()

    openMainLoader(false)
  }

  const DATE_MASK = 'DD/MM/YYYY'

  onMounted(init)

  return {
    isLoaded,
    noveltyDetail,
    headerProperties,
    defaultIconsLucide,
    generatesAccountingLabel,
    DATE_MASK,
    goToAccountingVoucher,
    openDocument,
    formatDate,
    formatCurrency,
    goToURL,
  }
}

export default useRegisterAuthorizationChangesView
