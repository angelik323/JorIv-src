// Vue - Moment
import { onMounted, ref, watch } from 'vue'
import moment from 'moment'

// Interfaces
import { IFicConsultUnitsViewPropsForm } from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'
import { ActionType } from '@/interfaces/global'

const useConsultUnitsForm = (props: IFicConsultUnitsViewPropsForm) => {
  const models = ref({
    registration_date: '',
    investment_fund: '',
    investment_plan: '',
    holder_identification: '',
    holder_description: '',
    investment_plan_status: 1,
  })

  const setFormData = () => {
    const data = props.data
    if (data) {
      models.value.registration_date = moment().format('YYYY-MM-DD') || ''
      models.value.investment_fund = `${data.fund_code} - ${data.fund_name}`
      models.value.investment_plan = data.plan_code ?? ''
      models.value.holder_identification = data.holder?.document ?? ''
      models.value.holder_description = data.holder?.name ?? ''
      models.value.investment_plan_status = data.status?.id ?? 1
    }
  }

  const setFormView = () => {
    setFormData()
  }

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: setFormView,
      edit: setFormView,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  onMounted(async () => {
    if (props.action) {
      handlerActionForm(props.action)
    }
  })

  watch(
    () => props.data,
    (val) => {
      if (val && props.action) {
        handlerActionForm(props.action)
      }
    },
    { immediate: true }
  )
  return {
    models,
  }
}

export default useConsultUnitsForm
