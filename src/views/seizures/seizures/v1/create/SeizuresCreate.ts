// Vue
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Interfaces
import { ISeizedAssetsList } from '@/interfaces/customs/seizures/Seizures'

// Composables
import { useMainLoader, useGoToUrl } from '@/composables'

// Stores
import { useSeizuresStore } from '@/stores/seizures'
import { useResourceManagerStore } from '@/stores/resources-manager'

// Forms
import useSeizuresCreateForm from '@/components/Forms/Seizures/SeizuresForm/SeizuresForm'

const useSeizuresCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const seizuresStore = useSeizuresStore('v1')
  const { _createIndividualAction } = seizuresStore

  const { _resetKeys, _getResources } = useResourceManagerStore('v1')

  const formRef = ref()
  const documentFile = ref<File | null>(null)

  const { formData, isViewMode, resetForm } = useSeizuresCreateForm({
    action: 'create',
  })

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

  const isLoaded = ref(false)

  const headerProps = {
    title: 'Registrar embargo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Embargos', route: 'SeizuresList' },
      { label: 'Crear', route: 'SeizuresCreate' },
    ],
  }

  const loadInitial = async () => {
    openMainLoader(true)
    await new Promise((r) => setTimeout(r, 200))
    isLoaded.value = true
    openMainLoader(false)
  }

  const validateForm = async () => {
    return (await formRef.value?.validateForm?.()) ?? false
  }

  const sanitizeOptional = (value: unknown): number | null => {
    const n = Number(value)
    return n === 0 || Number.isNaN(n) ? null : n
  }

  const makeRequestBody = () => {
    const data = formRef.value.getModels()

    return {
      process_number: data.process_number,
      order_number: data.order_number,
      court_id: sanitizeOptional(data.court_id),
      claimant_id: sanitizeOptional(
        data.claimant_object?.value ?? data.claimant_object?.id
      ),
      type_defendant_id: Number(data.type_defendant_id),
      defendant_id: Number(
        data.defendant_object?.value ?? data.defendant_object?.id
      ),
      has_assigned_business: data.has_assigned_business ? 1 : 0,

      business_trusts_id: sanitizeOptional(
        data.business_trusts_object?.value ?? data.business_trusts_object?.id
      ),
      order_date: data.order_date,
      awareness_date: data.awareness_date,
      seizure_date: data.seizure_date,
      value_seizure: Number(data.value_seizure),
      value_paid: Number(data.value_paid ?? 0),
      active_seizure_total: sanitizeOptional(data.active_seizure_total),
      city_id: sanitizeOptional(
        data.city_object?.value ?? data.city_object?.id
      ),
      management_area_id: sanitizeOptional(data.management_area_id),
      process_type_id: sanitizeOptional(data.process_type_id),
      document: data.document,
      observations: data.observations,
      claimant: data.claimant_object,
      defendant: data.defendant_object,
      assets: data.assets.map((item: ISeizedAssetsList) => ({
        seizure_assets_products_type_id:
          item.seizure_assets_products_type_id ?? null,
        description: item.description,
        asset_value: Number(item.asset_value ?? item.value),
        asset_class: item.asset_class,
        assetable_type: item.assetable_type,
        assetable_id: Number(item.assetable_id),
      })),
      origin: 'Core',
      status: {
        id: 63,
        status: 'Registrado',
      },
    }
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return

    const payload = makeRequestBody()

    openMainLoader(true)

    const success = await _createIndividualAction(payload)

    openMainLoader(false)

    if (!success) {
      return
    }

    resetForm()
    handleGoToList()
  }

  const handleGoToList = () => goToURL('SeizuresList')

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

    loadInitial()
    openMainLoader(false)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    headerProps,
    formData,
    formRef,
    isViewMode,
    isLoaded,
    documentFile,
    handleGoToList,
    onSubmit,
  }
}

export default useSeizuresCreate
