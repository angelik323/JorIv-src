// vue - pinia
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

// stores
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import {
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
  useThirdPartyResourceStore,
  useTrustBusinessResourceStore
} from '@/stores/resources-manager'

// interfaces
import { ActionType } from '@/interfaces/global'
import {
  IBuySaleFixedAssetsFormBase,
  IBuySaleTransactionData,
  type AssetCategoryType
} from '@/interfaces/customs/fixed-assets/BuySaleFixedAssets'

// composables
import { useUtils } from '@/composables/useUtils'

const useBuyInformationForm = (
  props: {
    action: ActionType
    data?: IBuySaleTransactionData | null
  },
  emit: Function
) => {
  // imports
  const { formatDate, getCurrentDateFormatted } = useUtils()

  // general stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { configuration_type, type } = storeToRefs(useFixedAssetsResourceStore('v1'))
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { business_trusts, business_trust_accounting } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { coins } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  // Keys resources
  const keysThirdParty = { third_party: ['third_parties'] }
  const keysFixedAssets = { fixed_assets: ['configuration_type', 'type'] }
  const keysTrustBusiness = { trust_business: ['business_trusts'] }
  const keysTrustBusinessAccounting = { trust_business: ['business_trust_accounting'] }
  const keysInvestmentPortfolio = { investment_portfolio: ['coins'] }

  const resourcesLoaded = ref(false)
  const isLoadingEditData = ref(false)
  const information_form_ref = ref()

  // models
  const model = ref<IBuySaleFixedAssetsFormBase>({
    transaction_type: null,
    business_trust_id: null,
    configuration_type_id: null,
    configuration_subtype_id: null,
    asset_category: null,
    purchase_order_id: null,
    has_valoration: false,
    transaction_date: null,
    transaction_value: null,
    third_party_id: null,
    currency_id: null,
    cost_center_id: null
  })

  // Campos adicionales específicos de COMPRA
  const plateCode = ref<string | null>(null)
  const responsiblePartyId = ref<number | null>(null)
  const description = ref<string | null>(null)
  const isDepreciationRequired = ref<boolean>(false)
  const isVisitRequired = ref<boolean>(false)

  // audit fields
  const auditFields = ref({
    created_at: null as string | null,
    created_by: null as string | null,
    updated_at: null as string | null,
    updated_by: null as string | null,
    authorized_at: null as string | null,
    authorized_by: null as string | null
  })

  // options
  const businessTrustOptions = business_trusts
  const thirdPartyOptions = third_parties
  const configurationTypeOptions = configuration_type
  const currencyOptions = coins
  const costCenterOptions = business_trust_accounting
  const assetCategoryOptions = type
  const booleanOptions = ref([
    { label: 'Sí', value: true },
    { label: 'No', value: false }
  ])

  const filteredSubtypes = computed(() => {
    if (!model.value.configuration_type_id) return []
    const types = configuration_type.value as Array<{
      value?: number | string
      id?: number
      subtypes?: Array<{ id: number; code: string; description: string }>
    }>
    const selectedType = types.find(
      (t) =>
        t.value === model.value.configuration_type_id || t.id === model.value.configuration_type_id
    )
    if (!selectedType?.subtypes) return []
    return selectedType.subtypes.map((subtype) => ({
      ...subtype,
      label: `${subtype.code} - ${subtype.description}`,
      value: subtype.id
    }))
  })

  // computed
  const isCreateAction = computed(() => props.action === 'create')
  const isEditAction = computed(() => props.action === 'edit')
  const isViewAction = computed(() => props.action === 'view')
  const isAssetFixed = computed(() => model.value.asset_category === 'Activo Fijo')
  const isAssetGood = computed(() => model.value.asset_category === 'Bien')

  // field states
  const fieldStates = computed(() => ({
    business_trust: {
      disabled: isEditAction.value || isViewAction.value,
      show: true
    },
    asset_category: {
      disabled: isEditAction.value || isViewAction.value,
      show: true
    },
    third_party: {
      disabled: isViewAction.value,
      show: true
    },
    transaction_date: {
      disabled: isViewAction.value,
      show: true
    },
    transaction_value: {
      disabled: isViewAction.value,
      show: true
    },
    currency: {
      disabled: true,
      show: true
    },
    configuration_type: {
      disabled: isViewAction.value,
      show: true
    },
    configuration_subtype: {
      disabled: isViewAction.value,
      show: true
    },
    cost_center: {
      disabled: isEditAction.value || isViewAction.value,
      show: true
    },
    asset_tag_code: {
      disabled: isEditAction.value || isViewAction.value,
      show: true
    },
    responsible: {
      disabled: isViewAction.value,
      show: true
    },
    has_valoration: {
      disabled: isViewAction.value,
      show: true
    },
    has_depreciation: {
      disabled: isViewAction.value,
      show: isAssetFixed.value
    },
    has_visit: {
      disabled: isViewAction.value,
      show: isAssetGood.value
    },
    description: {
      disabled: isViewAction.value,
      show: true
    },
    // Campos de auditoría
    audit: {
      show: isEditAction.value || isViewAction.value
    },
    authorization_audit: {
      show: isEditAction.value || isViewAction.value
    }
  }))

  // watches
  watch(
    () => model.value.configuration_type_id,
    (_, oldVal) => {
      if (!isLoadingEditData.value && oldVal !== null) {
        model.value.configuration_subtype_id = null
      }
    }
  )

  watch(
    () => model.value.business_trust_id,
    async (newBusinessId, oldBusinessId) => {
      if (!newBusinessId || newBusinessId === oldBusinessId) return

      if (!isLoadingEditData.value) {
        model.value.cost_center_id = null
        model.value.currency_id = null
      }

      const functionalCurrencyId = businessTrustOptions.value.find(
        (item) => item.id === newBusinessId
      )?.account?.functional_currency_id

      if (functionalCurrencyId) {
        await _getResources(keysInvestmentPortfolio, `filter[id]=${functionalCurrencyId}`)
      }
      await _getResources(keysTrustBusinessAccounting, `filter[business_trust_id]=${newBusinessId}`)
    }
  )

  watch(
    () => currencyOptions.value,
    (options) => {
      if (!isLoadingEditData.value && options && options.length === 1) {
        const singleOption = options[0] as { id?: number; value?: number }
        model.value.currency_id = singleOption.value ?? singleOption.id ?? null
      }
    },
    { immediate: true }
  )

  watch(
    () => model.value,
    () => {
      emit('update:model', getFormData())
    },
    { deep: true }
  )

  const getCurrentDateTime = () => {
    return getCurrentDateFormatted('YYYY-MM-DD HH:mm')
  }

  const initEmptyForm = () => {
    model.value = {
      transaction_type: 'Compra',
      business_trust_id: null,
      configuration_type_id: null,
      configuration_subtype_id: null,
      asset_category: null,
      purchase_order_id: null,
      has_valoration: false,
      transaction_date: null,
      transaction_value: null,
      third_party_id: null,
      currency_id: null,
      cost_center_id: null
    }

    plateCode.value = null
    responsiblePartyId.value = null
    description.value = null
    isDepreciationRequired.value = false
    isVisitRequired.value = false

    auditFields.value = {
      created_at: getCurrentDateTime(),
      created_by: null,
      updated_at: null,
      updated_by: null,
      authorized_at: null,
      authorized_by: null
    }
  }

  const setDataFromProps = async (data: IBuySaleTransactionData | null = props.data ?? null) => {
    if (!data) {
      initEmptyForm()
      return
    }

    isLoadingEditData.value = true

    if (data.business_trust_id) {
      await _getResources(
        keysTrustBusinessAccounting,
        `filter[business_trust_id]=${data.business_trust_id}`
      )
    }

    if (data.currency_id) {
      await _getResources(keysInvestmentPortfolio, `filter[id]=${data.currency_id}`)
    }

    await nextTick()

    model.value = {
      transaction_type: data.transaction_type,
      business_trust_id: data.business_trust_id,
      configuration_type_id: data.configuration_type_id,
      configuration_subtype_id:
        data.configuration_subtype_id ?? data.configuration_subtype?.id ?? null,
      asset_category: data.asset_category as AssetCategoryType,
      purchase_order_id: data.purchase_order_id ?? null,
      has_valoration: data.has_valoration ?? false,
      transaction_date: data.transaction_date ? data.transaction_date.slice(0, 10) : null,
      transaction_value: data.transaction_value ? Number(data.transaction_value) : null,
      third_party_id: data.third_party_id,
      currency_id: data.currency_id,
      cost_center_id: data.cost_center_id ?? null
    }

    plateCode.value = data.asset_tag_code ?? null
    responsiblePartyId.value = data.responsible_party_id
    description.value = data.description ?? null
    isDepreciationRequired.value = data.has_depreciation ?? false
    isVisitRequired.value = data.has_visit ?? false

    auditFields.value = {
      created_at: data.created_at ? formatDate(data.created_at, 'YYYY-MM-DD HH:mm') : null,
      created_by: data.created_by_user?.full_name ?? null,
      updated_at: data.updated_at ? formatDate(data.updated_at, 'YYYY-MM-DD HH:mm') : null,
      updated_by: data.updated_by_user?.full_name ?? null,
      authorized_at: data.approved_at ? formatDate(data.approved_at, 'YYYY-MM-DD HH:mm') : null,
      authorized_by: data.approval_responsible?.name ?? null
    }

    await nextTick()
    isLoadingEditData.value = false
  }

  const handleActionForm = async (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void | Promise<void>> = {
      create: initEmptyForm,
      edit: () => setDataFromProps(),
      view: () => setDataFromProps()
    }
    await actionHandlers[action]?.()
  }

  const validateForm = async (): Promise<boolean> => {
    const isValid = await information_form_ref.value?.validate()
    return isValid ?? false
  }

  const getFormData = () => {
    return {
      ...model.value,
      asset_tag_code: plateCode.value,
      responsible_party_id: responsiblePartyId.value,
      description: description.value,
      has_depreciation: isDepreciationRequired.value,
      has_visit: isVisitRequired.value
    }
  }

  const getRequestData = () => {
    return {
      transaction_type: model.value.transaction_type,
      business_trust_id: model.value.business_trust_id!,
      configuration_type_id: model.value.configuration_type_id!,
      configuration_subtype_id: model.value.configuration_subtype_id!,
      asset_category: model.value.asset_category!,
      purchase_order_id: model.value.purchase_order_id,
      has_valoration: model.value.has_valoration,
      transaction_date: model.value.transaction_date!,
      transaction_value: model.value.transaction_value!,
      third_party_id: model.value.third_party_id!,
      currency_id: model.value.currency_id!,
      cost_center_id: model.value.cost_center_id!,
      asset_tag_code: plateCode.value,
      responsible_party_id: responsiblePartyId.value,
      description: description.value || undefined,
      has_depreciation: isAssetFixed.value ? isDepreciationRequired.value : undefined,
      has_visit: isAssetGood.value ? isVisitRequired.value : undefined
    }
  }

  watch(
    () => props.data,
    async (newData) => {
      if (resourcesLoaded.value && newData) {
        await handleActionForm(props.action)
      }
    },
    { deep: true }
  )

  // lifecycle
  onMounted(async () => {
    await _getResources(
      keysThirdParty,
      'include=legalPerson,documentType,naturalPerson&keys[]=third_parties&fields[]=id,document,document_type_id&fields[natural_people]=third_party_id,id,name,middle_name,last_name,second_last_name&fields[legal_people]=third_party_id,id,business_name'
    )
    await _getResources(keysTrustBusiness, 'filter[effect]=true')
    await _getResources(keysFixedAssets)

    resourcesLoaded.value = true

    if (props.data) {
      await handleActionForm(props.action)
    } else if (props.action === 'create') {
      initEmptyForm()
    }
  })

  onBeforeUnmount(() => {
    _resetKeys(keysThirdParty)
    _resetKeys(keysTrustBusiness)
    _resetKeys(keysFixedAssets)
  })

  return {
    // Refs
    information_form_ref,
    model,
    plateCode,
    responsiblePartyId,
    description,
    isDepreciationRequired,
    isVisitRequired,
    auditFields,

    // Options
    businessTrustOptions,
    thirdPartyOptions,
    configurationTypeOptions,
    filteredSubtypes,
    currencyOptions,
    costCenterOptions,
    assetCategoryOptions,
    booleanOptions,

    // Computed
    isCreateAction,
    fieldStates,

    // Methods
    validateForm,
    getRequestData
  }
}

export default useBuyInformationForm
