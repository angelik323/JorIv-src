// Vue - pinia
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ICausationWithoutPaymentInstructionsForm } from '@/interfaces/customs/accounts-payable/CausationWithoutPaymentInstructions'

// Composables
import { useUtils } from '@/composables/useUtils'

// Stores
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBasicDataForm = (
  props: {
    data?: ICausationWithoutPaymentInstructionsForm | null
    selectedBusinessId?: number | null
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  const { causation_resource_source } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  const { fiduciary_investment_plans, funds } = storeToRefs(
    useFicResourceStore('v1')
  )

  const { banks, bank_account } = storeToRefs(useTreasuryResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basicDataFormRef = ref()

  const models = ref<ICausationWithoutPaymentInstructionsForm>({
    tax_provision: null,
    resource_source: null,
    fund_or_bank_id: null,
    plan_or_account_id: null,
  })

  const filteredFundBanks = computed(() => {
    if (models.value.resource_source === 'investment_plan') {
      return funds.value
    }

    if (models.value.resource_source === 'bank_account') {
      return banks.value
    }

    return []
  })

  const filteredPlanAccounts = computed(() => {
    if (models.value.resource_source === 'investment_plan') {
      return fiduciary_investment_plans.value
    }

    if (models.value.resource_source === 'bank_account') {
      return bank_account.value
    }

    return []
  })

  watch(
    () => models.value.tax_provision,
    () => {
      if (models.value.tax_provision === false) {
        models.value.resource_source = null
        models.value.fund_or_bank_id = null
        models.value.plan_or_account_id = null
      }
    }
  )

  watch(
    () => models.value.resource_source,
    () => {
      models.value.fund_or_bank_id = null
      models.value.plan_or_account_id = null
    }
  )

  watch(
    () => models.value.fund_or_bank_id,
    (val) => {
      _resetKeys({
        treasury: ['bank_account'],
        fics: ['fiduciary_investment_plans'],
      })
      if (!val || !props.selectedBusinessId) return

      if (models.value.resource_source === 'investment_plan') {
        _getResources(
          {
            fics: ['fiduciary_investment_plans'],
          },
          `filter[fipParameters.business_trust_id]=${props.selectedBusinessId}&filter[collective_investment_fund_id]=${val}`
        )
      }

      if (models.value.resource_source === 'bank_account') {
        _getResources(
          {
            treasury: ['bank_account'],
          },
          `filter[business_id]=${props.selectedBusinessId}&filter[bank_id]=${val}`
        )
      }
    }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    {
      deep: true,
    }
  )

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  return {
    basicDataFormRef,
    models,
    causation_resource_source,
    filteredFundBanks,
    filteredPlanAccounts,
  }
}

export default useBasicDataForm
