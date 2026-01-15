// Vue - router
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import {
  IBackendSeizureAsset,
  ISeizuresCreateForm,
  ISeizuresDetail,
  ISeizedAssetsList,
} from '@/interfaces/customs/seizures/Seizures'

// Composables
import { useUtils, useMainLoader, useGoToUrl } from '@/composables'

// Stores
import { useSeizuresStore } from '@/stores/seizures'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useSeizureEdit = () => {
  const route = useRoute()
  const id = Number(route.params.id)

  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()
  const { goToURL } = useGoToUrl()

  const seizuresStore = useSeizuresStore('v1')

  const { _updateAction, _getAction } = seizuresStore

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const SeizuresFormRef = ref()
  const isLoaded = ref(false)

  const keys = {
    assets: ['cities'],
    third_party: ['third_parties'],
    trust_business: ['business_trusts', 'business_trust_participants'],
    fics: ['fiduciary_investment_plans'],
    treasury: ['bank_account'],
    fixed_assets: ['fixed_assets'],
    seizures: [
      'seizure_assets_products_types',
      'management_areas',
      'courst',
      'process_types',
      'type_defendants',
      'seizure_status',
    ],
  }

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
    document: null,
    observations: '',
    value_paid: 0,
    assets: [],
    claimant_object: null,
    defendant_object: null,
    business_trusts_object: null,
    city_object: null,
    status_id: null,
  })

  const headerProps = {
    title: 'Editar embargo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Embargos', route: 'EmbargoList' },
      { label: 'Editar', route: 'SeizuresEdit' },
      { label: id.toString() },
    ],
  }

  // NORMALIZADOR DE ASSETS
  const mapBackendAssetToForm = (
    asset: IBackendSeizureAsset,
    index: number
  ): ISeizedAssetsList => {
    const isMovable = asset.asset_class?.includes('MUB')

    return {
      id: index,
      backend_id: asset.id,
      asset_type: isMovable ? 2 : 1,
      seizure_assets_products_type_id: asset.product_type?.id ?? null,
      description: asset.description,
      asset_value: Number(asset.asset_value),
      value: Number(asset.asset_value),
      asset_class: asset.asset_class,
      assetable_type: asset.assetable?.type ?? '',
      assetable_id: asset.assetable?.id ?? 0,
      percentage:
        asset.product_type?.id === 4 ? Number(asset.asset_value) : null,
    }
  }

  const loadInitial = async () => {
    openMainLoader(true)

    const data: ISeizuresDetail | null = await _getAction(id)

    if (!data) {
      openMainLoader(false)
      goToURL('SeizuresList')
      return
    }

    Object.assign(formData.value, {
      process_number: data.process_number,
      order_number: data.order_number,
      court_id: Number(data.court_id ?? 0),
      claimant_id: Number(data.plaintiff_id ?? 0),
      type_defendant_id: Number(data.type_defendant_id ?? 0),
      defendant_id: Number(data.defendant_id ?? 0),
      business_trusts_id: Number(data.business_trusts_id ?? 0),
      order_date: data.order_date,
      awareness_date: data.awareness_date,
      seizure_date: data.seizure_date ?? data.embargo_date,
      value_seizure: data.value_seizure,
      active_seizure_total: Number(data.active_seizure_total ?? 0),
      city_id: Number(data.city_id ?? 0),
      management_area_id: Number(data.management_area_id ?? 0),
      process_type_id: Number(data.process_type_id ?? 0),
      observations: data.observations ?? '',
      value_paid: Number(data.value_paid ?? 0),
      status_id: data.status?.id ?? null,

      assets: Array.isArray(data.assets)
        ? data.assets.map((asset, index) =>
            mapBackendAssetToForm(
              asset as unknown as IBackendSeizureAsset,
              index
            )
          )
        : [],
    })

    if (data.type_defendant?.id) {
      formData.value.type_defendant_id = Number(data.type_defendant.id)
    }

    if (data.process_type?.id) {
      formData.value.process_type_id = Number(data.process_type.id)
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

    const cityFromApi = data.city?.cities?.[0] as
      | { id: number; name: string; code: string }
      | undefined
    formData.value.city_object = cityFromApi
      ? {
          value: Number(cityFromApi.id),
          label: cityFromApi.name,
          name: cityFromApi.name,
          code: cityFromApi.code,
        }
      : null

    updateBankAccountByBussinesId()

    isLoaded.value = true
    openMainLoader(false)
  }

  const updateBankAccountByBussinesId = async () => {
    const businessId =
      formData.value.business_trusts_object?.value ??
      formData.value.business_trusts_object?.id
    if (!businessId) return
    const params = `include=lastBalance&filter[business_id]=${businessId}`
    await _getResources({ treasury: keys.treasury }, params)
  }

  const validateForm = async () => {
    return (await SeizuresFormRef.value?.validate?.()) ?? true
  }

  const makeRequestBody = () => {
    const f = formData.value

    const payload = {
      order_number: f.order_number,
      court_id: Number(f.court_id),
      claimant_id: f.claimant_object?.id ?? Number(f.claimant_id),
      defendant_id: f.defendant_object?.id ?? Number(f.defendant_id),
      type_defendant_id: Number(f.type_defendant_id),
      business_trusts_id:
        f.business_trusts_object?.id ?? Number(f.business_trusts_id),
      order_date: f.order_date,
      awareness_date: f.awareness_date,
      seizure_date: f.seizure_date,
      value_seizure: Number(f.value_seizure),
      city_id: f.city_object?.value ?? Number(f.city_id),
      management_area_id: Number(f.management_area_id),
      process_type_id: Number(f.process_type_id),
      value_paid: Number(f.value_paid ?? 0),
      observations: f.observations,
      assets: f.assets.map((item) => ({
        seizure_assets_products_type_id: item.seizure_assets_products_type_id,
        description: item.description,
        asset_value: Number(item.asset_value),
        asset_class: item.asset_class,
        assetable_type: item.assetable_type,
        assetable_id: item.assetable_id,
      })),
    }

    return cleanEmptyFields(payload, true)
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return

    const payload = makeRequestBody()
    openMainLoader(true)

    const success = await _updateAction(id, payload)

    openMainLoader(false)
    if (!success) return

    goToURL('SeizuresList')
  }

  onMounted(async () => {
    openMainLoader(true)

    await _getResources(
      { third_party: keys.third_party },
      'include=status,addresses,legalPerson,naturalPerson' +
        '&filter[is_customer]=1' +
        '&fields[]=id' +
        '&fields[]=document' +
        '&fields[]=third_party_category' +
        '&fields[]=commercial_registration'
    )

    await _getResources({ trust_business: ['business_trusts'] })
    await _getResources(
      { trust_business: ['business_trust_participants'] },
      `filter[business_trust_id]&filter[type_resource]=2`
    )
    await _getResources({ assets: keys.assets })
    await _getResources({ fics: keys.fics })
    await _getResources({ fixed_assets: keys.fixed_assets })
    await _getResources({ seizures: keys.seizures })

    await loadInitial()
    openMainLoader(false)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    headerProps,
    SeizuresFormRef,
    formData,
    isLoaded,
    goToURL,
    onSubmit,
  }
}

export default useSeizureEdit
