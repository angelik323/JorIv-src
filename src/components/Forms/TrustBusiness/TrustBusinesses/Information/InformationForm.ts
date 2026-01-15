// vue - pinia
import { onMounted, ref, computed, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import {
  BusinessType,
  ITrustBusinessInformationForm,
  ITrustBusinessResponse,
} from '@/interfaces/customs/trust-business/TrustBusinesses'
import { ActionType, TrustBusinessStatusID } from '@/interfaces/global'

// composables
import { useRules, useUtils } from '@/composables'

// stores
import { useTrustBusinessStore } from '@/stores/trust-business/trust-businesses'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useResourceStore } from '@/stores/resources-selects'

// constants
import { default_yes_no } from '@/constants/resources'

const useInformationForm = (props: {
  action: ActionType
  data?: ITrustBusinessResponse | null
}) => {
  const { _setDataInformationForm, _setBusinessType, _validateCode } =
    useTrustBusinessStore('v1')
  const { data_information_form } = storeToRefs(useTrustBusinessStore('v1'))

  const {
    business_trust_fideico_types,
    business_trust_society_types,
    business_trust_subtypes,
    business_trust_mode,
    business_trust_classification,
    business_trust_periodicity_accountability,
    business_trust_third_parties,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { users } = storeToRefs(useResourceStore('v1'))

  const {
    is_required,
    max_length,
    only_alphanumeric,
    date_before_or_equal_to_the_current_date,
    date_after_or_equal_to_specific_date,
    custom_rule,
    not_start_with_zero,
    is_required_boolean,
  } = useRules()

  const { getFutureDateByYears } = useUtils()

  const formElementRef = ref()
  const isLoadingValidateCode = ref(false)
  const codeLoading = ref('')

  const initialModelsValues: ITrustBusinessInformationForm = {
    register_type: 'Fideicomiso',
    business_code: null,
    name: null,
    business_mod: null,
    classification: null,
    filing_date_sfc: null,
    start_date: null,
    end_date: null,
    start_date_commission: null,
    has_extend: false,
    extend_date: null,
    accountability_period: 'S - Semestral', // Por defecto
    consortium: null,
    manage_budget: null,
    derivate_contracting: null,
    has_policy: null,
    has_guarantee: null,
    has_real_estate_project: null,
    observations: null,
    status_id: TrustBusinessStatusID.PREOPERATIONAL, // Estado preoperativo
    business_manager: null,
    business_subtype: null,
    business_type: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })
  const isSociety = computed(
    () => models.value.register_type === 'Sociedad' || false
  )
  const isInitializing = ref(true)

  const filtered_business_types = computed(() => {
    if (!models.value.register_type) return []
    return models.value.register_type === 'Fideicomiso'
      ? business_trust_fideico_types.value
      : business_trust_society_types.value
  })

  const filtered_business_subtypes = computed(() => {
    if (!models.value.business_type || !business_trust_subtypes.value) return []
    return business_trust_subtypes.value.filter(
      (item) => item.business_type_id === models.value.business_type
    )
  })

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setFormEdit = async () => {
    clearForm()
    const data: ITrustBusinessResponse | null | undefined = props.data

    if (!data) return

    const {
      register_type,
      business_code,
      name,
      business_mod,
      classification,
      filing_date_sfc,
      start_date,
      end_date,
      start_date_commission,
      has_extend,
      extend_date,
      accountability_period,
      consortium,
      manage_budget,
      derivate_contracting,
      has_policy,
      has_guarantee,
      has_real_estate_project,
      observations,
      status,
      business_manager,
      business_subtype,
      business_type,
    } = data

    models.value.register_type = (register_type as BusinessType) ?? null
    models.value.business_code = business_code ?? null
    models.value.name = name ?? null
    models.value.business_mod = business_mod ?? null
    models.value.classification = classification ?? null
    models.value.filing_date_sfc = filing_date_sfc ?? null
    models.value.start_date = start_date ?? null
    models.value.end_date = end_date ?? null
    models.value.start_date_commission = start_date_commission ?? null
    models.value.has_extend = has_extend ?? false
    models.value.extend_date = extend_date ?? null
    models.value.accountability_period = accountability_period ?? null
    models.value.consortium = consortium
    models.value.manage_budget = manage_budget
    models.value.derivate_contracting = derivate_contracting
    models.value.has_policy = has_policy
    models.value.has_guarantee = has_guarantee
    models.value.has_real_estate_project = has_real_estate_project
    models.value.observations = observations ?? null
    models.value.status_id = status?.id ?? TrustBusinessStatusID.PREOPERATIONAL // Default preoperativo si no hay status
    models.value.business_manager = business_manager?.id ?? null
    models.value.business_subtype = business_subtype?.id ?? null
    models.value.business_type = business_type?.id ?? null
    codeLoading.value = business_code
  }

  const setFormView = () => {
    clearForm()
    const data: ITrustBusinessResponse | null | undefined = props.data
    if (!data) return

    const {
      register_type,
      business_code,
      name,
      business_mod,
      classification,
      filing_date_sfc,
      start_date,
      end_date,
      start_date_commission,
      has_extend,
      extend_date,
      accountability_period,
      consortium,
      manage_budget,
      derivate_contracting,
      has_policy,
      has_guarantee,
      has_real_estate_project,
      observations,
      status,
      business_manager,
      business_subtype,
      business_type,
    } = data

    models.value.register_type = (register_type as BusinessType) ?? null
    models.value.business_code = business_code ?? null
    models.value.name = name ?? null
    models.value.business_mod = business_mod ?? null
    models.value.classification = classification ?? null
    models.value.filing_date_sfc = filing_date_sfc ?? null
    models.value.start_date = start_date ?? null
    models.value.end_date = end_date ?? null
    models.value.start_date_commission = start_date_commission ?? null
    models.value.has_extend = has_extend ?? false
    models.value.extend_date = extend_date ?? null
    models.value.accountability_period = accountability_period ?? null
    models.value.consortium = consortium
    models.value.manage_budget = manage_budget
    models.value.derivate_contracting = derivate_contracting
    models.value.has_policy = has_policy
    models.value.has_guarantee = has_guarantee
    models.value.has_real_estate_project = has_real_estate_project
    models.value.observations = observations ?? null
    models.value.status_id = status?.id ?? TrustBusinessStatusID.PREOPERATIONAL
    models.value.business_manager = business_manager?.full_name ?? null
    models.value.business_subtype = `${business_subtype?.code ?? ''} - ${
      business_subtype?.name
    }`
    models.value.business_type = `${business_type?.code ?? ''} - ${
      business_type?.name
    }`
    codeLoading.value = business_code
  }

  const _setValueModel = () => {
    if (!data_information_form.value) return

    const {
      register_type,
      business_code,
      name,
      business_mod,
      classification,
      filing_date_sfc,
      start_date,
      end_date,
      start_date_commission,
      has_extend,
      extend_date,
      accountability_period,
      consortium,
      manage_budget,
      derivate_contracting,
      has_policy,
      has_guarantee,
      has_real_estate_project,
      observations,
      status_id,
      business_manager,
      business_subtype,
      business_type,
    } = data_information_form.value

    models.value.register_type = register_type ?? null
    models.value.business_code = business_code ?? null
    models.value.name = name ?? null
    models.value.business_mod = business_mod ?? null
    models.value.classification = classification ?? null
    models.value.filing_date_sfc = filing_date_sfc ?? null
    models.value.start_date = start_date ?? null
    models.value.end_date = end_date ?? null
    models.value.start_date_commission = start_date_commission ?? null
    models.value.has_extend = has_extend ?? null
    models.value.extend_date = extend_date ?? null
    models.value.accountability_period = accountability_period ?? null
    models.value.consortium = consortium ?? null
    models.value.manage_budget = manage_budget ?? null
    models.value.derivate_contracting = derivate_contracting ?? null
    models.value.has_policy = has_policy ?? null
    models.value.has_guarantee = has_guarantee ?? null
    models.value.has_real_estate_project = has_real_estate_project ?? null
    models.value.observations = observations ?? null
    models.value.status_id = status_id ?? null
    models.value.business_manager = business_manager ?? null
    models.value.business_subtype = business_subtype ?? null
    models.value.business_type = business_type ?? null
    codeLoading.value = business_code ?? ''
  }

  const validateCode = async (val: string) => {
    if (props.action === 'edit' && val === codeLoading.value) return true
    isLoadingValidateCode.value = true

    const available: boolean = await _validateCode(val)

    isLoadingValidateCode.value = false

    return available
  }

  const clearForm = () => {
    models.value = { ...initialModelsValues }
  }
  onMounted(async () => {
    handlerActionForm(props.action)
    await nextTick()
    isInitializing.value = false
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (useUtils().isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.register_type,
    async (newType, oldType) => {
      if (!newType) return
      _setBusinessType(newType)

      // Evita reseteo durante la inicialización del formulario
      if (isInitializing.value) return

      if (newType !== oldType) {
        models.value.business_type = null
        models.value.business_subtype = null
      }
    },
    { immediate: true }
  )

  return {
    models,
    isSociety,
    formElementRef,
    filtered_business_types,
    filtered_business_subtypes,
    business_trust_mode,
    business_trust_classification,
    business_trust_periodicity_accountability,
    business_trust_third_parties,
    default_yes_no,
    users,
    isLoadingValidateCode,

    is_required,
    max_length,
    only_alphanumeric,
    date_before_or_equal_to_the_current_date,
    date_after_or_equal_to_specific_date,
    getFutureDateByYears,
    validateCode,
    custom_rule,
    not_start_with_zero,
    is_required_boolean,
  }
}

export default useInformationForm
