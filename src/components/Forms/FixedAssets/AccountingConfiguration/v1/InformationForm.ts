// vue - pinia
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import {
  IAccountingConfigurationForm,
  IAccountingParameters,
} from '@/interfaces/customs/fixed-assets/v1/AcountingConfiguration'
import { ActionType } from '@/interfaces/global'

// composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useRules } from '@/composables/useRules'
import { useUtils } from '@/composables/useUtils'

// stores
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import {
  useAccountingResourceStore,
  useResourceManagerStore,
} from '@/stores/resources-manager'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

const useInformationForm = (
  props: {
    action: ActionType
    data?: IAccountingConfigurationForm | null
  },
  emit: Function
) => {
  // imports
  const { is_required } = useRules()
  const { _getResources } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()
  const { getCurrentDateFormatted, formatDate } = useUtils()

  // general store
  const {
    business_trust_statuses,
    business_trusts,
    business_trust_accounting,
    account_structures,
    cost_centers_structures,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { type, configuration_type, transaction_side, novelty } = storeToRefs(
    useFixedAssetsResourceStore('v1')
  )
  const { receipt_types_with_sub_types } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const trustBusinessStatusesKeys = {
    trust_business: ['business_trust_statuses'],
  }
  const trustBusinessesKeys = {
    trust_business: ['business_trusts'],
  }
  const trustBusinessAccountingKeys = {
    trust_business: ['business_trust_accounting'],
  }
  const trustBusinnesAccountingStructureKeys = {
    trust_business: ['account_structures'],
  }
  const trustBusinnesCostCenterStructureKeys = {
    trust_business: ['cost_centers_structures'],
  }
  const fixedAssetsKeys = {
    fixed_assets: ['type', 'configuration_type', 'transaction_side', 'novelty'],
  }
  const accountingKeys = {
    accounting: ['receipt_types_with_sub_types'],
  }

  // models
  const initialModelsValues: IAccountingConfigurationForm = {
    created_at: null,
    source: null,
    business_trust_id: null,
    business_description: null,
    account_structures_description: null,
    cost_centers_structures_description: null,
    configuration_type_id: null,
    type_description: null,
    configuration_subtype_id: null,
    subtype_description: null,
    accounting_parameters: [] as IAccountingParameters[],
    receipt_type_id: null,
    receipt_subtype_id: null,
    receipt_type_description: null,
    receipt_subtype_description: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    models.value.created_at = getCurrentDateFormatted('YYYY-MM-DD HH:mm')
  }

  const setFormEdit = () => {
    if (!props.data) return

    const data = { ...props.data }

    if (data.accounting_parameters && data.accounting_parameters.length > 0) {
      const lastRow =
        data.accounting_parameters[data.accounting_parameters.length - 1]
      const isLastRowComplete = Boolean(
        lastRow.configuration_novelty_type_id &&
          lastRow.debit_nature &&
          lastRow.debit_accounts_chart_id &&
          lastRow.credit_nature &&
          lastRow.credit_accounts_chart_id &&
          lastRow.detail_transaction &&
          lastRow.detail_transaction.length >= 10
      )

      if (isLastRowComplete && props.action !== 'view') {
        data.accounting_parameters.push({
          configuration_novelty_type_id: null,
          debit_nature: null,
          debit_accounts_chart_id: null,
          credit_nature: null,
          credit_accounts_chart_id: null,
          detail_transaction: null,
        })
      }
    }
    models.value = data

    models.value.created_at = data.created_at
      ? formatDate(data.created_at, 'YYYY-MM-DD HH:mm')
      : null

    models.value.updated_at = data.updated_at
      ? formatDate(data.updated_at, 'YYYY-MM-DD HH:mm')
      : null

    models.value.type_description = data.configuration_type?.description
    models.value.configuration_type_code = data.configuration_type?.code
    models.value.subtype_description = data.configuration_subtype?.description
    models.value.business_trust_code = data?.business_trust?.business_code
    models.value.business_description = data?.business_trust?.name ?? ''
    models.value.configuration_subtype_code = data.configuration_subtype?.code
    models.value.account_structures_description =
      data?.business_accouting_structure?.purpose ?? null
    models.value.receipt_type_description =
      data?.receipt_type?.code + ' - ' + data?.receipt_type?.name
    models.value.receipt_subtype_description =
      data?.receipt_subtype?.code + ' - ' + data?.receipt_subtype?.name

    const structure = data?.business_cost_center_structure?.[0]
    const structureNAme = structure?.name
    const structureDescription = structure?.description
    models.value.cost_centers_structures_description =
      structureNAme && structureDescription
        ? `${structureNAme} - ${structureDescription}`
        : structureNAme || structureDescription || null
  }

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: () => _setValueModel(),
      edit: () => setFormEdit(),
      view: () => setFormEdit(),
    }
    actionHandlers[action]?.()
  }

  // form management
  const accountingParametersListRef = ref()

  const showAudit = computed(() => props.action !== 'create')
  const disableAllForm = computed(() => props.action === 'view')

  const hasAtLeastOneCompletedSetting = (): boolean => {
    if (
      !models.value.accounting_parameters ||
      models.value.accounting_parameters.length === 0
    ) {
      return false
    }

    const completedParams = models.value.accounting_parameters.filter(
      (param) => {
        return Boolean(
          param.configuration_novelty_type_id &&
            param.debit_nature &&
            param.debit_accounts_chart_id &&
            param.credit_nature &&
            param.credit_accounts_chart_id &&
            param.detail_transaction &&
            param.detail_transaction.length >= 10
        )
      }
    )

    return completedParams.length >= 1
  }

  const informationFormRef = ref()
  const showAccountingSettingsError = ref(false)

  const filteredSubtypes = computed(() => {
    if (!models.value.configuration_type_id) return []

    const selectedType = configuration_type.value.find(
      (t) => t.value === models.value.configuration_type_id
    )

    if (!selectedType?.subtypes) return []

    return selectedType.subtypes.map((subtype) => ({
      ...subtype,
      label: `${subtype.code} - ${subtype.description}`,
      value: subtype.id,
    }))
  })

  const filteredReceiptSubtypes = computed(() => {
    if (!models.value.receipt_type_id) return []

    const selectedReceiptType = receipt_types_with_sub_types.value.find(
      (r) => r.value === models.value.receipt_type_id
    )

    if (!selectedReceiptType?.sub_receipt_types) return []

    return selectedReceiptType.sub_receipt_types.map((subtype) => ({
      ...subtype,
      label: `${subtype.code} - ${subtype.name}`,
      value: subtype.id,
    }))
  })

  const validateAllForms = async (): Promise<{
    isValid: boolean
    errorType: 'form' | 'accounting_params' | null
    message: string
  }> => {
    const formIsValid = await informationFormRef.value?.validate(true)

    if (!formIsValid) {
      return {
        isValid: false,
        errorType: 'form',
        message: 'Complete todos los campos obligatorios',
      }
    }
    if (!hasAtLeastOneCompletedSetting()) {
      showAccountingSettingsError.value = true
      return {
        isValid: false,
        errorType: 'accounting_params',
        message: 'Debe agregar al menos un parámetro contable',
      }
    }

    return {
      isValid: true,
      errorType: null,
      message: '',
    }
  }

  // watchers
  const isInitializing = ref(true)

  // business_description
  watch(
    () => models.value.business_trust_id,
    (newBusinessId) => {
      if (isInitializing.value) return

      if (!newBusinessId) {
        models.value.business_description = null
        return
      }

      const business = business_trusts.value.find(
        (b) => b.value === newBusinessId
      )

      models.value.business_description = business?.name || null
      models.value.business_trust_code = business?.code || null
    }
  )

  // type_description
  watch(
    () => models.value.configuration_type_id,
    (newTypeId) => {
      if (isInitializing.value) return

      models.value.configuration_subtype_id = null
      models.value.configuration_subtype_code = null
      models.value.subtype_description = null

      if (!newTypeId) {
        models.value.type_description = null
        models.value.configuration_type_code = null
        return
      }

      const type = configuration_type.value.find((t) => t.value === newTypeId)

      models.value.type_description = type?.description || null
      models.value.configuration_type_code = type?.code || null
    }
  )

  // subtype_description
  watch(
    () => models.value.configuration_subtype_id,
    (newSubtypeId) => {
      if (isInitializing.value) return

      if (!newSubtypeId) {
        models.value.subtype_description = null
        models.value.configuration_subtype_code = null
        return
      }

      const subtype = filteredSubtypes.value.find(
        (st) => st.value === newSubtypeId
      )

      models.value.subtype_description = subtype?.description || null
      models.value.configuration_subtype_code = subtype?.code || null
    }
  )

  // receipt_type_description
  watch(
    () => models.value.receipt_type_id,
    (newReceiptTypeId) => {
      if (isInitializing.value) return

      models.value.receipt_subtype_id = null
      models.value.receipt_subtype_description = null

      if (!newReceiptTypeId) {
        models.value.receipt_type_description = null
        return
      }
      const receiptType = receipt_types_with_sub_types.value.find(
        (r) => r.value === newReceiptTypeId
      )

      models.value.receipt_type_description =
        receiptType?.code + ' - ' + receiptType?.name || null
    }
  )

  // receipt_subtype_description
  watch(
    () => models.value.receipt_subtype_id,
    (newReceiptSubtypeId) => {
      if (isInitializing.value) return

      if (!newReceiptSubtypeId) {
        models.value.receipt_subtype_description = null
        return
      }

      const receiptSubtype = filteredReceiptSubtypes.value.find(
        (st) => st.value === newReceiptSubtypeId
      )

      models.value.receipt_subtype_description =
        receiptSubtype?.code + ' - ' + receiptSubtype?.name || null
    }
  )

  // data
  watch(
    () => props.data,
    (val) => {
      if (!val) {
        emit('update:data', models.value)
        return
      }

      if (isInitializing.value) {
        setFormEdit()

        setTimeout(() => {
          isInitializing.value = false
        }, 100)
      }
    },
    { deep: true }
  )

  // business_trust
  const isLoadingStructures = ref(false)

  watch(
    () => props.data?.business_trust_id,
    async (newBusinessId, oldBusinessId) => {
      if (isInitializing.value) return
      if (!newBusinessId || newBusinessId === oldBusinessId) return

      isLoadingStructures.value = true

      await _getResources(
        trustBusinessAccountingKeys,
        `filter[business_trust_id]=${newBusinessId}`
      )

      if (!business_trust_accounting.value?.[0]) {
        isLoadingStructures.value = false
        return
      }

      const { accounting_structure_id, cost_center_structure_id } =
        business_trust_accounting.value[0]

      await Promise.all([
        _getResources(
          trustBusinnesAccountingStructureKeys,
          `filter[id]=${accounting_structure_id}`
        ),
        _getResources(
          trustBusinnesCostCenterStructureKeys,
          `filter[id]=${cost_center_structure_id}`
        ),
      ])

      models.value.account_structures_description =
        account_structures.value[0]?.label || null
      models.value.cost_centers_structures_description =
        cost_centers_structures.value[0]?.label || null

      isLoadingStructures.value = false
    }
  )

  // models
  watch(
    () => models.value,
    (newValue) => {
      if (isInitializing.value) return

      if (!disableAllForm.value) {
        emit('update:data', newValue)
      }
    },
    { deep: true }
  )

  // accounting_parameters
  watch(
    () => models.value.accounting_parameters,
    (newSettings) => {
      if (newSettings && newSettings.length > 1) {
        showAccountingSettingsError.value = false
      }
    },
    { deep: true }
  )

  // lifecycle
  onMounted(async () => {
    handlerActionForm(props.action)
    openMainLoader(true)
    if (props.action === 'create') {
      isInitializing.value = false
    }

    await Promise.all([
      _getResources(fixedAssetsKeys),
      _getResources(trustBusinessStatusesKeys),
      _getResources(
        accountingKeys,
        'filter[voucher_type]=Automático&filter[has_active_subtypes]=true',
        'v2'
      ),
    ])
    const validStatusIds = business_trust_statuses.value
      .filter((status) => ['Vigente', 'En liquidación'].includes(status.label))
      .map((status) => status.value)
      .join(',')

    if (validStatusIds) {
      await _getResources(
        trustBusinessesKeys,
        `filter[status_id]=${validStatusIds}`
      )
    }
    openMainLoader(false)
  })

  return {
    models,
    showAudit,
    disableAllForm,
    accountingParametersListRef,
    informationFormRef,
    showAccountingSettingsError,
    isLoadingStructures,

    type,
    configuration_type,
    transaction_side,
    novelty,
    business_trusts,
    filteredSubtypes,
    receipt_types_with_sub_types,
    filteredReceiptSubtypes,

    is_required,
    hasAtLeastOneCompletedSetting,
    validateAllForms,
  }
}

export default useInformationForm
