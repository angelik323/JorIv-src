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

const ASSOCIATED_TAX_OPTIONS = [
  { id: 1, value: 'IVA', label: 'IVA' },
  { id: 2, value: 'Retención', label: 'Retención' },
  { id: 3, value: 'No aplica', label: 'No aplica' }
]

const useSaleInformationForm = (
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
  const { configuration_type, type, fixed_assets_for_sales } = storeToRefs(
    useFixedAssetsResourceStore('v1')
  )
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { business_trusts, business_trust_accounting } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { coins } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  // Keys resources
  const keysThirdParty = { third_party: ['third_parties'] }
  const keysFixedAssets = { fixed_assets: ['configuration_type', 'type', 'fixed_assets_for_sales'] }
  const keysTrustBusiness = { trust_business: ['business_trusts'] }
  const keysTrustBusinessAccounting = { trust_business: ['business_trust_accounting'] }
  const keysInvestmentPortfolio = { investment_portfolio: ['coins'] }

  const resourcesLoaded = ref(false)
  const isLoadingEditData = ref(false)
  const isLoadingFromFixedAsset = ref(false)
  const information_form_ref = ref()

  // models
  const model = ref<IBuySaleFixedAssetsFormBase>({
    id_fixed_asset_property: null,
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

  const associatedTaxes = ref<string[]>([])
  const utilityValue = ref<number | null>(null)
  const responsiblePartyId = ref<number | null>(null)

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
  const fixedAssetsForSalesOptions = fixed_assets_for_sales
  const businessTrustOptions = business_trusts
  const thirdPartyOptions = third_parties
  const configurationTypeOptions = configuration_type
  const currencyOptions = coins
  const costCenterOptions = business_trust_accounting
  const associatedTaxOptionsRef = ref(ASSOCIATED_TAX_OPTIONS)
  const assetCategoryOptions = type

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

  // field states
  const fieldStates = computed(() => ({
    id_fixed_asset_property: {
      disabled: !isCreateAction.value,
      show: isCreateAction.value
    },
    business_trust: {
      disabled: true,
      show: true
    },
    asset_category: {
      disabled: !isCreateAction.value,
      show: true
    },
    third_party: {
      disabled: true,
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
      disabled: true,
      show: true
    },
    configuration_subtype: {
      disabled: true,
      show: true
    },
    cost_center: {
      disabled: true,
      show: true
    },
    responsible: {
      disabled: isViewAction.value,
      show: true
    },
    utility: {
      disabled: isViewAction.value,
      show: true
    },
    associated_taxes: {
      disabled: isViewAction.value,
      show: isAssetFixed.value
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
    () => model.value.id_fixed_asset_property,
    async (newFixedAssetId, oldFixedAssetId) => {
      if (!newFixedAssetId || newFixedAssetId === oldFixedAssetId) return

      const selectedAsset = fixedAssetsForSalesOptions.value.find(
        (item) => item.id === newFixedAssetId || item.value === newFixedAssetId
      )

      if (!selectedAsset) return

      if (!isLoadingEditData.value) {
        model.value.business_trust_id = null
        model.value.third_party_id = null
        model.value.currency_id = null
        model.value.configuration_type_id = null
        model.value.configuration_subtype_id = null
        model.value.cost_center_id = null
      }

      const assetTransaction = selectedAsset.asset_transaction
      const businessTrustId = selectedAsset.business_trust_id
      const thirdPartyId = assetTransaction?.third_party_id
      const currencyId = assetTransaction?.currency_id
      const configurationTypeId = selectedAsset.configuration_type_id
      const configurationSubtypeId = selectedAsset.configuration_subtype_id

      const resourcePromises: Promise<void>[] = []

      if (businessTrustId) {
        resourcePromises.push(
          _getResources(keysTrustBusiness, `filter[id]=${businessTrustId}`),
          _getResources(keysTrustBusinessAccounting, `filter[business_trust_id]=${businessTrustId}`)
        )
      }

      if (currencyId) {
        resourcePromises.push(_getResources(keysInvestmentPortfolio, `filter[id]=${currencyId}`))
      }

      if (configurationTypeId) {
        resourcePromises.push(
          _getResources(
            { fixed_assets: ['configuration_type'] },
            `filter[id]=${configurationTypeId}`
          )
        )
      }

      await Promise.all(resourcePromises)

      isLoadingFromFixedAsset.value = true
      await nextTick()

      model.value.business_trust_id = businessTrustId ?? null
      model.value.third_party_id = thirdPartyId ?? null
      model.value.currency_id = currencyId ? Number(currencyId) : null
      model.value.configuration_type_id = configurationTypeId ?? null
      model.value.configuration_subtype_id = configurationSubtypeId ?? null

      if (costCenterOptions.value && costCenterOptions.value.length > 0) {
        const firstOption = costCenterOptions.value[0] as { id?: number; value?: number }
        model.value.cost_center_id = firstOption.value ?? firstOption.id ?? null
      }

      await nextTick()
      isLoadingFromFixedAsset.value = false
    }
  )

  watch(
    () => model.value.configuration_type_id,
    (_, oldVal) => {
      if (!isLoadingEditData.value && !isLoadingFromFixedAsset.value && oldVal !== null) {
        model.value.configuration_subtype_id = null
      }
    }
  )

  watch(
    () => currencyOptions.value,
    (options) => {
      if (
        !isLoadingEditData.value &&
        !isLoadingFromFixedAsset.value &&
        options &&
        options.length === 1
      ) {
        const singleOption = options[0] as { id?: number; value?: number }
        model.value.currency_id = singleOption.value ?? singleOption.id ?? null
      }
    },
    { immediate: true }
  )

  watch(
    () => model.value,
    () => {
      emit('update:model', {
        ...model.value,
        responsible_party_id: responsiblePartyId.value,
        associated_taxes: associatedTaxes.value,
        utility_value: utilityValue.value
      })
    },
    { deep: true }
  )

  const getCurrentDateTime = () => {
    return getCurrentDateFormatted('YYYY-MM-DD HH:mm')
  }

  const initEmptyForm = () => {
    model.value = {
      id_fixed_asset_property: null,
      transaction_type: 'Venta',
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

    associatedTaxes.value = []
    utilityValue.value = null
    responsiblePartyId.value = null

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
      id_fixed_asset_property: data.id_fixed_asset_property,
      transaction_type: data.transaction_type,
      business_trust_id: data.business_trust_id,
      configuration_type_id: data.configuration_type_id,
      configuration_subtype_id:
        data.configuration_subtype_id ?? data.configuration_subtype?.id ?? null,
      asset_category: data.asset_category as AssetCategoryType,
      purchase_order_id: null,
      has_valoration: false,
      transaction_date: data.transaction_date ? data.transaction_date.slice(0, 10) : null,
      transaction_value: data.transaction_value ? Number(data.transaction_value) : null,
      third_party_id: data.third_party_id,
      currency_id: data.currency_id,
      cost_center_id: data.cost_center_id ?? null
    }

    associatedTaxes.value = []
    utilityValue.value = null
    responsiblePartyId.value = data.responsible_party_id

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

  const getRequestData = () => {
    return {
      id_fixed_asset_property: model.value.id_fixed_asset_property,
      transaction_type: model.value.transaction_type,
      business_trust_id: model.value.business_trust_id!,
      configuration_type_id: model.value.configuration_type_id!,
      configuration_subtype_id: model.value.configuration_subtype_id!,
      asset_category: model.value.asset_category!,
      purchase_order_id: null,
      has_valoration: false,
      transaction_date: model.value.transaction_date!,
      transaction_value: model.value.transaction_value!,
      third_party_id: model.value.third_party_id!,
      currency_id: model.value.currency_id!,
      cost_center_id: model.value.cost_center_id!,
      responsible_party_id: responsiblePartyId.value,
      associated_taxes: isAssetFixed.value ? associatedTaxes.value : undefined
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
    _resetKeys(keysFixedAssets)
  })

  return {
    // Refs
    information_form_ref,
    model,
    associatedTaxes,
    utilityValue,
    responsiblePartyId,
    auditFields,

    // Options
    fixedAssetsForSalesOptions,
    businessTrustOptions,
    thirdPartyOptions,
    configurationTypeOptions,
    filteredSubtypes,
    currencyOptions,
    costCenterOptions,
    assetCategoryOptions,
    associatedTaxOptionsRef,

    // Computed
    isCreateAction,
    fieldStates,

    // Methods
    validateForm,
    getRequestData
  }
}

export default useSaleInformationForm
