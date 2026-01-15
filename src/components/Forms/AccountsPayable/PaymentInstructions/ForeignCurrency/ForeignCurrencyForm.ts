// Core
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IPaymentInstructionsForeignCurrencyForm } from '@/interfaces/customs/accounts-payable/PaymentInstructions'

// Composables
import { useUtils } from '@/composables/useUtils'

// Stores
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'

const useForeignCurrencyForm = (
  props: {
    action?: ActionType
    data?: IPaymentInstructionsForeignCurrencyForm | null
  },
  emit: Function
) => {
  // Composables
  const { isEmptyOrZero } = useUtils()

  // Refs
  const headerFormRef = ref()

  // Stores
  const { coins } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const models = ref<IPaymentInstructionsForeignCurrencyForm>({
    provision_value: null,
    currency_id: null,
    trm_day: null,
    trm_final: null,
    final_value_pesos: null,
    final_value_foreign: null,
    net_value: null,
  })

  watch(
    () => models.value.currency_id,
    (val) => {
      if (!val) return

      const coin = coins.value.find((item) => item.value == val)
      models.value.trm_day = Number(coin?.coin_value).toFixed(6) ?? null
      models.value.trm_final = Number(coin?.coin_value).toFixed(6) ?? null
    }
  )

  watch(
    () => [models.value.trm_final, models.value.net_value],
    ([trmFinal, net]) => {
      if (!trmFinal || !net) {
        models.value.final_value_pesos = null
        models.value.final_value_foreign = null
        return
      }

      const trm = Number(trmFinal)
      const netValue = Number(net)

      models.value.final_value_pesos = netValue
      models.value.final_value_foreign = netValue / trm
    }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val && props.data) models.value = props.data
    },
    { immediate: true }
  )

  return {
    models,
    headerFormRef,

    // Selects
    coins,
  }
}

export default useForeignCurrencyForm
