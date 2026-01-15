// vue - pinia
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { ITrustBusinessGeneralInformation } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// composables
import { useRules, useUtils } from '@/composables'
const { isEmptyOrZero } = useUtils()

// stores
import { useTrustBusinessStore } from '@/stores/trust-business/trust-businesses'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useFicResourceStore } from '@/stores/resources-manager/fics'

const useGeneralInformation = (
  props: {
    action: ActionType
    data?: ITrustBusinessGeneralInformation | null
    isSociety: boolean
    status_id: number
  },
  emit: Function
) => {
  // imports
  const { _validateCode } = useTrustBusinessStore('v2')

  const {
    business_trust_fideico_types,
    business_trust_society_types,
    business_trust_subtypes,
    business_trust_mode,
    business_trust_classification,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { offices: business_offices } = storeToRefs(useFicResourceStore('v1'))

  // rules
  const { is_required, max_length, custom_rule, not_start_with_zero } =
    useRules()

  // computed
  const is_edit = computed(() => props.action === 'edit')

  const not_active_subtype = computed(() => {
    return models.value.business_type_id === 16
  })

  const filtered_business_types = computed(() => {
    return !props.isSociety
      ? business_trust_fideico_types.value
      : business_trust_society_types.value
  })

  const filtered_business_subtypes = computed(() => {
    if (!models.value.business_type_id || !business_trust_subtypes.value)
      return []
    return business_trust_subtypes.value.filter(
      (item) => item.business_type_id === models.value.business_type_id
    )
  })

  const models = ref<ITrustBusinessGeneralInformation>({
    business_code: null,
    business_type_id: null,
    business_subtype_id: null,
    name: null,
    business_mod: null,
    classification: null,
    office_id: null,
    object: null,
  })

  // ref & init
  const general_information_ref = ref()
  const codeLoading = ref('') // guarda el codigo previo al entrar al edit
  const isLoadingValidateCode = ref(false)

  const _setValueModel = () => {
    if (props.data) {
      models.value = { ...props.data }
      codeLoading.value = models.value.business_code ?? ''
    }
  }

  // actions
  const validateCode = async (val: string) => {
    if (props.action === 'edit' && val === codeLoading.value) return true
    isLoadingValidateCode.value = true

    const available: boolean = await _validateCode(val)

    isLoadingValidateCode.value = false

    return available
  }

  // lifecycles
  onMounted(async () => {
    await _setValueModel()
  })

  // watchs
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
      deep: true,
    }
  )

  watch(
    () => props.data,
    async () => {
      await _setValueModel()
    },
    { deep: true }
  )

  return {
    models,
    general_information_ref,
    isLoadingValidateCode,
    filtered_business_types,
    filtered_business_subtypes,
    business_trust_mode,
    business_trust_classification,
    business_offices,
    is_edit,
    not_active_subtype,

    validateCode,

    // rules
    is_required,
    max_length,
    not_start_with_zero,
    custom_rule,
  }
}

export default useGeneralInformation
