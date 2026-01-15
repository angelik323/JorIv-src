// Vue - Pinia
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IGroundsBlockingInvestmentPlanItemList } from '@/interfaces/customs/fics/GroundsBlockingInvestmentPlan'
import { ActionType } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useGroundsBlockingInvestmentPlanStore } from '@/stores/fics/grounds-blocking-investment-plan'
import { useFicResourceStore } from '@/stores/resources-manager/fics'

const useInformationForm = (props: {
  action: ActionType
  data: IGroundsBlockingInvestmentPlanItemList | undefined | null
}) => {
  const { isEmptyOrZero } = useUtils()

  const { _setDataInformationForm } =
    useGroundsBlockingInvestmentPlanStore('v1')
  const { rounds_blocking_investment_plan_response } = storeToRefs(
    useGroundsBlockingInvestmentPlanStore('v1')
  )

  const { grounds_blocking_investment_status } = useFicResourceStore('v1')

  // props
  const formElementRef = ref()
  const initialModelsValues: IGroundsBlockingInvestmentPlanItemList = {
    code: null,
    description: '',
    status_id: '',
  }

  const models = ref<IGroundsBlockingInvestmentPlanItemList>({
    ...initialModelsValues,
  })

  // handlers / actions
  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: rounds_blocking_investment_plan_response.value
        ? _setValueModel
        : setFormEdit,
      view: _setFormView,
    }
    actionHandlers[action]?.()
  }

  const setFormData = (data: IGroundsBlockingInvestmentPlanItemList) => {
    models.value.code = data.code ?? null
    models.value.description = data.description ?? ''
    models.value.status_id = data?.status_id ?? ''
  }

  const setFormEdit = async () => {
    clearForm()
    if (props.data) setFormData(props.data)
  }

  const _setFormView = async () => {
    if (!rounds_blocking_investment_plan_response.value) return

    Object.assign(models.value, rounds_blocking_investment_plan_response.value)
  }

  const _setValueModel = () => {
    if (!rounds_blocking_investment_plan_response.value) return

    Object.assign(models.value, rounds_blocking_investment_plan_response.value)
  }

  const clearForm = () => {
    Object.assign(models.value, initialModelsValues)
  }

  // lifecycle hooks
  onMounted(async () => {
    handlerActionForm(props.action)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  // watchers
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
      if (isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => rounds_blocking_investment_plan_response.value,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true }
  )

  return {
    grounds_blocking_investment_status,
    formElementRef,
    models,
  }
}

export default useInformationForm
