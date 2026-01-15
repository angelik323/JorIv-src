// Vue - Pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IAccountsPayableClosingForm } from '@/interfaces/customs/accounts-payable/AccountsPayableClosing'
import { ActionType } from '@/interfaces/global'

// Constants
import {
  ACCOUNTS_PAYABLE_CLOSING_ACTION_OPTIONS,
  ACCOUNTS_PAYABLE_CLOSING_MODE_OPTIONS,
} from '@/constants/resources/accounts-payable-closing'

// Composables
import { useRules } from '@/composables/useRules'

// Stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

const useBasicDataForm = (
  props: { data?: IAccountsPayableClosingForm | null; action: ActionType },
  emit: (
    event: 'update:data',
    value: IAccountsPayableClosingForm | null
  ) => void
) => {
  // hooks
  const { is_required } = useRules()

  // stores
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))

  // refs
  const basicDataFormRef = ref()
  const isInternalUpdate = ref(false)
  const models = ref<IAccountsPayableClosingForm>({
    action_type: props.data?.action_type ?? null,
    closing_mode: props.data?.closing_mode ?? null,
    closing_date: props.data?.closing_date ?? null,
    business_from: props.data?.business_from ?? null,
    business_to: props.data?.business_to ?? null,
  })

  // computed
  const actionOptions = ACCOUNTS_PAYABLE_CLOSING_ACTION_OPTIONS
  const closingModeOptions = ACCOUNTS_PAYABLE_CLOSING_MODE_OPTIONS
  const businessOptions = business_trusts

  // watchers
  watch(
    () => props.data,
    (val) => {
      if (!isInternalUpdate.value && val) {
        models.value = {
          action_type: val.action_type,
          closing_mode: val.closing_mode,
          closing_date: val.closing_date,
          business_from: val.business_from,
          business_to: val.business_to,
        }
      }
      isInternalUpdate.value = false
    },
    { deep: true }
  )

  watch(
    models,
    (val) => {
      isInternalUpdate.value = true
      emit('update:data', val)
    },
    { deep: true }
  )

  return {
    // refs
    basicDataFormRef,
    models,

    // computed
    actionOptions,
    closingModeOptions,
    businessOptions,

    // methods
    is_required,
  }
}

export default useBasicDataForm
