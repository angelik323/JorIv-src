// vue - pinia
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { ITrustBusinessAdditionalInformation } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// composables
import { useRules, useUtils } from '@/composables'
const { isEmptyOrZero } = useUtils()

// constants
import { default_yes_no } from '@/constants/resources'

// stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

const useAdditionalInformation = (
  props: {
    action: ActionType
    data?: ITrustBusinessAdditionalInformation | null
  },
  emit: Function
) => {
  // imports
  const {
    business_trust_third_parties,
    business_trust_periodicity_accountability,
    users_with_document_and_abbreviation,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  // rules
  const { is_required, is_required_boolean } = useRules()

  // computed
  const is_view = computed(() => props.action === 'view')
  const is_edit = computed(() => props.action === 'edit')

  const models = ref<ITrustBusinessAdditionalInformation>({
    accountability_period: null,
    business_manager_id: null,
    business_accountant_id: null,
    consortium: null,
    manage_budget: null,
    derivate_contracting: null,
    has_accounts_payable: null,
    has_billing: null,
    has_assets: null,
    has_policy: null,
    has_guarantee: null,
    has_real_estate_project: null,
    has_secured_creditor: null,
    has_normative: null,
    has_budget: null,
  })

  // refs & init
  const additional_form_ref = ref()

  const _setValueModel = () => {
    if (props.data) {
      models.value = { ...props.data }
    }
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
    additional_form_ref,
    default_yes_no,
    business_trust_third_parties,
    business_trust_periodicity_accountability,
    users_with_document_and_abbreviation,
    is_view,
    is_edit,
    // rules
    is_required,
    is_required_boolean,
  }
}

export default useAdditionalInformation
