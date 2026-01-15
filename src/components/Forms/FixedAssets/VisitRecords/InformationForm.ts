// vue - pinia
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { ActionType } from '@/interfaces/global'
import { IVisitRecordForm } from '@/interfaces/customs/fixed-assets/v1/VisitRecords'

// composables
import { useRules } from '@/composables/useRules'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useUtils } from '@/composables/useUtils'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets/'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'

const useInformationForm = (
  props: {
    action: ActionType
    data?: IVisitRecordForm | null
  },
  emit: Function
) => {
  // imports
  const { is_required } = useRules()
  const { openMainLoader } = useMainLoader()
  const { getCurrentDateFormatted, formatDate } = useUtils()

  // keys
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { configuration_type, visit_reason, physical_condition, asset_rating } =
    storeToRefs(useFixedAssetsResourceStore('v1'))
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))

  // data selects
  const fixedAssetsKeys = {
    fixed_assets: [
      'configuration_type',
      'visit_reason',
      'physical_condition',
      'asset_rating',
    ],
  }
  const thirdPartiesKeys = {
    third_party: ['third_parties'],
  }
  const trustBusinessKeys = {
    trust_business: ['business_trusts'],
  }

  // models
  const initialModelsValues: IVisitRecordForm = {
    created_at: null,
    business_trust_id: null,
    configuration_types_id: null,
    configuration_subtypes_id: null,
    details: [],
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    models.value.created_at = getCurrentDateFormatted('YYYY-MM-DD HH:mm')
  }

  const setFormEdit = () => {
    if (!props.data) return

    const data = { ...props.data }

    if (data.details && data.details.length > 0) {
      data.details = data.details.map((detail) => ({
        ...detail,
        visit_date: detail.visit_date
          ? formatDate(detail.visit_date, 'YYYY-MM-DD')
          : null,
      }))

      const lastRow = data.details[data.details.length - 1]
      const isLastRowComplete = Boolean(
        lastRow.visit_date &&
          lastRow.responsible_id &&
          lastRow.visitor_id &&
          lastRow.visit_reason &&
          lastRow.physical_condition &&
          lastRow.asset_rating &&
          lastRow.recommendations
      )

      if (isLastRowComplete && props.action === 'edit') {
        data.details.push({
          visit_date: null,
          responsible_id: null,
          visitor_id: null,
          visit_reason: null,
          physical_condition: null,
          asset_rating: null,
          recommendations: null,
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
  const visitDetailsRef = ref()

  const showAudit = computed(() => props.action !== 'create')
  const disableAllForm = computed(() => props.action === 'view')

  const hasAtLeastOneDetail = computed(
    () => models.value.details && models.value.details.length > 0
  )

  const informationFormRef = ref()
  const showVisitDetailError = ref(false)

  const filteredSubtypes = computed(() => {
    if (!models.value.configuration_types_id) return []

    const selectedType = configuration_type.value.find(
      (t) => t.value === models.value.configuration_types_id
    )

    if (!selectedType?.subtypes) return []

    return selectedType.subtypes.map((subtype) => ({
      ...subtype,
      label: `${subtype.code} - ${subtype.description}`,
      value: subtype.id,
    }))
  })

  const validateAllForms = async (): Promise<{
    isValid: boolean
    errorType: 'form' | 'visit_details' | null
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

    if (!hasAtLeastOneDetail.value) {
      showVisitDetailError.value = true
      return {
        isValid: false,
        errorType: 'visit_details',
        message: 'Debe agregar al menos un detalle de visita',
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
        models.value.business_trust = null
        return
      }

      const business = business_trusts.value.find(
        (business) => business.value === newBusinessId
      )

      models.value.business_trust = business?.label || null
    }
  )

  // asset type
  watch(
    () => models.value.configuration_types_id,
    (newConfigurationTypeId) => {
      if (isInitializing.value) return

      models.value.configuration_subtypes_id = null
      models.value.asset_subtype = null

      if (!newConfigurationTypeId) {
        models.value.asset_type = null
        return
      }

      const configurationType = configuration_type.value.find(
        (configurationType) =>
          configurationType.value === newConfigurationTypeId
      )

      models.value.asset_type = configurationType?.label || null
    }
  )

  // asset subtype
  watch(
    () => models.value.configuration_subtypes_id,
    (newConfigurationSubtypeId) => {
      if (isInitializing.value) return

      if (!newConfigurationSubtypeId) {
        models.value.asset_subtype = null
        return
      }

      const configurationSubtype = filteredSubtypes.value.find(
        (configurationSubtype) =>
          configurationSubtype.value === newConfigurationSubtypeId
      )

      models.value.asset_subtype = configurationSubtype?.label || null
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

  // visit details
  watch(
    () => models.value.details,
    (newDetail) => {
      if (newDetail && newDetail.length > 1) {
        showVisitDetailError.value = false
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
      _getResources(trustBusinessKeys, 'filter[effect]=true'),
      _getResources(
        thirdPartiesKeys,
        'include=legalPerson,naturalPerson&keys[]=third_parties&fields[]=id,document'
      ),
    ])
    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    await Promise.all([
      _resetKeys(fixedAssetsKeys),
      _resetKeys(thirdPartiesKeys),
      _resetKeys(trustBusinessKeys),
    ])
  })
  return {
    models,
    showAudit,
    disableAllForm,
    visitDetailsRef,
    informationFormRef,
    showVisitDetailError,
    hasAtLeastOneDetail,

    visit_reason,
    physical_condition,
    asset_rating,
    third_parties,
    configuration_type,
    filteredSubtypes,
    business_trusts,

    is_required,
    validateAllForms,
  }
}

export default useInformationForm
