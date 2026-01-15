// Vue - Pinia
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  IFicCheckBalancesView,
  IFicCheckBalancesViewPropsForm,
} from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'

const useCheckBalancesPlanListForm = (
  props: IFicCheckBalancesViewPropsForm
) => {
  // store
  const { check_balances_basic_data_form } = storeToRefs(
    useFiduciaryInvestmentPlanStore('v1')
  )

  // props
  const formInformation = ref()
  const models = ref<IFicCheckBalancesView>({
    fund_code: '',
    fund_name: '',
    business: '',
    last_closing_date: '',
    fiduciary_investment_plan: null,
  })

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: setFormView,
      edit: setFormView,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setFormData = () => {
    const data = check_balances_basic_data_form.value
    if (data) {
      models.value.fund_code = data.fund_code ?? ''
      models.value.fund_name = data.fund_name ?? ''
      models.value.business = data.business_trust?.business_code
        ? `${data.business_trust?.business_code} - ${data.business_trust?.name}`
        : ''
      models.value.last_closing_date = data.last_closing_date ?? ''
      models.value.fiduciary_investment_plan = data.plan_code ?? ''
    }
  }

  const setFormView = () => {
    setFormData()
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => check_balances_basic_data_form.value,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  return {
    formInformation,
    models,
  }
}

export default useCheckBalancesPlanListForm
