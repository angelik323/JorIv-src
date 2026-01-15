// vue
import { computed, onMounted, ref, watch } from 'vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import { IAssetContributor, IRegisterForm } from '@/interfaces/customs/fixed-assets/v1/Register'
import { ITrustBusinessResponse } from '@/interfaces/customs/trust-business/TrustBusinesses'
import { ICashUnitForm } from '@/interfaces/customs/fixed-assets/CashGeneratingUnit'

// composables
import { useUtils } from '@/composables/useUtils'
import { useAlert } from '@/composables/useAlert'
import { useRules } from '@/composables/useRules'
import { storeToRefs } from 'pinia'

// stores
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useRegisterStore } from '@/stores/fixed-assets/register'

export const useInformationForm = (
  props: {
    action: ActionType
    data?: IRegisterForm | null
  },
  emit: Function
) => {
  // imports
  const { isEmptyOrZero, formatDate } = useUtils()
  const { showAlert } = useAlert()
  const { is_required, min_length, max_length, max_integer_decimal } = useRules()

  // keys
  const {
    configuration_type,
    formated_locations,
    formated_third_parties,
    fixed_asset_statuses,
    fixed_asset_record_type,
    transactions_configuration_subtypes,
    fixed_asset_reference,
    uge,
    fixed_asset_measurement_model
  } = storeToRefs(useFixedAssetsResourceStore('v1'))
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { _getAmountUvtValues } = useRegisterStore('v1')

  // form
  const isLoading = ref<boolean>(false)

  const models = ref<IRegisterForm>({
    id: undefined,
    created_at: null,
    record_type: null,
    reference: null,
    configuration_type_id: null,
    configuration_subtype_id: null,
    business_trust_id: null,
    asset_transaction_id: null,
    business_trust_description: null,
    business_trust_code: null,
    chip_code: null,
    cadastral_id: null,
    folio_number: null,
    license_plate: null,
    chassis_number: null,
    responsible_id: null,
    status_id: null,
    guarantee_percentage: null,
    purchase_value: null,
    cash_generating_unit_id: null,
    property_tax_date: null,
    measurement_model: null,
    asset_contributors: [],
    major_amount_uvt: null,
    minor_amount_uvt: null,
    value: null,
    countable_value: null
  })

  const value_uvt = ref(0)
  const minor_value_uvt = ref(0)

  const is_minor_amount = computed(() => {
    const isTransfer = ['Transferencia', 'Donación'].includes(models.value.record_type as string)
    const assetValueAmount = isTransfer ? models.value.value : models.value.transaction_value
    const minor_limit = value_uvt.value * minor_value_uvt.value

    return Number(assetValueAmount ?? 0) <= minor_limit
  })

  const filteredSubtypes = computed(() => {
    if (!models.value.configuration_type_id) return []
    const selectedType = configuration_type.value.find(
      (type) => type.value === models.value.configuration_type_id
    )
    if (!selectedType?.subtypes) return []
    return selectedType.subtypes.map((subtype) => ({
      ...subtype,
      label: `${subtype.code} - ${subtype.description}`,
      value: subtype.id
    }))
  })

  const filteredUge = computed(() => {
    if (!models.value.configuration_type_id) return []

    return (uge.value as unknown as ICashUnitForm[]).filter(
      (unit) => unit.configuration_type_id === models.value.configuration_type_id
    )
  })

  const assetClass = computed(() => {
    const selectedType = configuration_type.value.find(
      (type) => type.value === models.value.configuration_type_id
    )

    return selectedType?.asset_class || null
  })

  const assetType = computed(() => {
    const selectedType = configuration_type.value.find(
      (type) => type.value === models.value.configuration_type_id
    )
    return selectedType?.type || null
  })

  const hasDepreciation = computed(() => {
    if (!models.value.asset_transaction_id) return false

    const transaction = transactions_configuration_subtypes.value.find(
      (transaction) => transaction.value === models.value.asset_transaction_id
    )

    return transaction?.has_depreciation ?? false
  })

  const isDepreciationDisabled = computed(() => {
    const recordType = models.value.record_type as string

    if (['Transferencia', 'Donación'].includes(recordType)) {
      return assetType.value === 'Bien'
    }
    return true
  })

  const isTransferOrDonation = computed(() => {
    return ['Transferencia', 'Donación'].includes(models.value.record_type as string)
  })

  const assetValue = computed({
    get: () => {
      return isTransferOrDonation.value ? models.value.value : models.value.transaction_value
    },
    set: (val: string | number | null) => {
      const stringValue = val !== null && val !== undefined ? String(val) : null
      if (isTransferOrDonation.value) {
        models.value.value = stringValue
        models.value.transaction_value = null 
      } else {
        models.value.transaction_value = stringValue
        models.value.value = null 
        models.value.countable_value = null 
      }
    }
  })

  const countableValue = computed({
    get: () => {
      return isTransferOrDonation.value
        ? models.value.countable_value
        : models.value.transaction_value
    },
    set: (val: string | number | null) => {
      const stringValue = val !== null && val !== undefined ? String(val) : null
      if (isTransferOrDonation.value) {
        models.value.countable_value = stringValue
        models.value.transaction_value = null 
      } else {
        models.value.transaction_value = stringValue
        models.value.value = null 
        models.value.countable_value = null
      }
    }
  })

  // refs
  const informationFormRef = ref()
  const assetsContributorsRef = ref()

  // init
  const _setValueModel = () => {
    if (props.data) {
      models.value = { ...props.data }
      if (props.action === 'view' || props.action === 'edit') {
        assetsContributorsFormData.value =
          props.data.contributors?.map((contributor) => ({
            id: contributor.id ?? null,
            nit: contributor.nit ?? null,
            description: contributor.description ?? null,
            guarantee_percentage: contributor.percentage ?? null,
            distribution_type: contributor.distribution_type ?? null
          })) ?? []
      } else {
        assetsContributorsFormData.value = models.value.asset_contributors ?? []
      }
      assetsContributorsFormData.value = models.value.asset_contributors ?? []
      const formattedDate = models.value.created_at
        ? formatDate(models.value.created_at, 'YYYY-MM-DD')
        : null
      models.value.created_at = formattedDate
      models.value.asset_type =
        props.data.configuration_type?.code && props.data.configuration_type?.description
          ? `${props.data.configuration_type.code} - ${props.data.configuration_type.description}`
          : null
      models.value.asset_subtype =
        props.data.configuration_subtype?.code && props.data.configuration_subtype?.description
          ? `${props.data.configuration_subtype.code} - ${props.data.configuration_subtype.description}`
          : null
      models.value.business_trust_description =
        props.data.business_trust?.business_code && props.data.business_trust?.name
          ? `${props.data.business_trust.business_code} - ${props.data.business_trust.name}`
          : null
    } else {
      models.value.created_at = new Date().toISOString().slice(0, 16).replace('T', ' ')
    }
  }

  const assetsContributorsFormData = ref<IAssetContributor[]>([])

  const setAssetsContributors = (data: IAssetContributor[]): void => {
    models.value = {
      ...models.value,
      asset_contributors: data ?? []
    }
  }

  const formatGuaranteePercentage = () => {
    const value = models.value.guarantee_percentage
    if (value === null || value === undefined || value === '') return

    const numValue = parseFloat(value as string)
    if (!isNaN(numValue)) {
      models.value.guarantee_percentage = numValue.toFixed(2)
    }
  }

  // lifecycle
  onMounted(async () => {
    isLoading.value = true
    await _setValueModel()
    isLoading.value = false
    const amountUvtValues = await _getAmountUvtValues()
    if (amountUvtValues) {
      value_uvt.value = parseFloat(amountUvtValues.value)
      minor_value_uvt.value = amountUvtValues.minor_amount
    }
  })

  const isInitialized = ref(false)

  // watch
  watch(
    () => props.data,
    (newData) => {
      if (newData?.id && !isInitialized.value) {
        _setValueModel()
        isInitialized.value = true
      }
    }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        emit('update:models', null)
      } else {
        emit('update:models', models.value)
      }
    },
    {
      deep: true
    }
  )

  // record type - limpiar valores según el tipo de registro
  watch(
    () => models.value.record_type,
    (newRecordType, oldRecordType) => {
      if (oldRecordType === null || oldRecordType === undefined) return

      const isTransfer = ['Transferencia', 'Donación'].includes(newRecordType as string)

      if (isTransfer) {
        // Cuando es transferencia/donación, limpiar transaction_value
        models.value.transaction_value = null
      } else {
        // Cuando es compra u otro, limpiar value y countable_value
        models.value.value = null
        models.value.countable_value = null
      }
    }
  )

  // configuration type
  watch(
    () => models.value.configuration_type_id,
    (newValue, oldValue) => {
      if (oldValue === null || oldValue === undefined) return

      models.value.configuration_subtype = null
      models.value.asset_subtype = null
      models.value.chip_code = null
      models.value.cadastral_id = null
      models.value.folio_number = null
      models.value.license_plate = null
      models.value.chassis_number = null

      const selectedtype = configuration_type.value.find((type) => type.value === newValue)
      models.value.asset_type = selectedtype?.label || null
    }
  )

  // configuration subtype
  watch(
    () => models.value.configuration_subtype_id,
    (newSubtype) => {
      if (!newSubtype) {
        models.value.configuration_subtype = null
        return
      }

      const configurationSubtype = filteredSubtypes.value.find(
        (subtype) => subtype.value === newSubtype
      )

      models.value.asset_subtype = configurationSubtype?.label || null
    }
  )

  // business trust
  watch(
    () => models.value.business_trust_id,
    (newBusinessId) => {
      if (!newBusinessId) {
        models.value.business_trust = null
        models.value.business_trust_description = null
        models.value.society = null
        return
      }

      const businessTrust = business_trusts.value.find((trust) => trust.value === newBusinessId)

      if (!businessTrust) return

      models.value.business_trust_description = businessTrust.label || null

      const businessRegisterType = business_trusts.value.find(
        (trust) => trust.value === newBusinessId
      ) as ITrustBusinessResponse | undefined

      if (businessRegisterType?.register_type === 'Sociedad') {
        models.value.society = businessRegisterType.business_code
      } else {
        models.value.society = null
      }
    }
  )

  // transaction value
  watch(
    () => models.value.asset_transaction_id,
    (newTransactionId, oldTransactionId) => {
      if ((oldTransactionId === null || oldTransactionId === undefined) && !newTransactionId) return

      if (!newTransactionId) {
        models.value.transaction_value = null
        models.value.purchase = null
        return
      }

      const transaction = transactions_configuration_subtypes.value.find(
        (transaction) => transaction.value === newTransactionId
      )

      models.value.transaction_value = transaction?.transaction_value as string
    }
  )

  watch(
    () => assetsContributorsFormData.value,
    (newContributors) => {
      setAssetsContributors(newContributors)
    },
    { deep: true }
  )

  watch(
    () => is_minor_amount.value,
    (isMinor) => {
      if (isMinor) {
        models.value.minor_amount_uvt = true
        models.value.major_amount_uvt = false
      } else {
        models.value.major_amount_uvt = true
        models.value.minor_amount_uvt = false
      }
    },
    { immediate: true }
  )

  const validateForm = async (): Promise<boolean> => {
    const formValid = await informationFormRef.value?.validate()

    if (!formValid) {
      showAlert('Campos requeridos no diligenciados', 'warning')
    }

    return formValid
  }

  return {
    isLoading,
    informationFormRef,
    assetsContributorsRef,
    filteredSubtypes,
    formated_locations,
    formated_third_parties,
    fixed_asset_statuses,
    fixed_asset_record_type,
    transactions_configuration_subtypes,
    business_trusts,
    fixed_asset_reference,
    configuration_type,
    filteredUge,
    fixed_asset_measurement_model,
    is_minor_amount,

    models,
    assetsContributorsFormData,
    assetClass,
    assetType,
    hasDepreciation,
    isDepreciationDisabled,
    isTransferOrDonation,
    assetValue,
    countableValue,
    formatGuaranteePercentage,

    formatDate,
    validateForm,

    is_required,
    min_length,
    max_length,
    max_integer_decimal
  }
}

export default useInformationForm
