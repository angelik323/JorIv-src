import { IChartAccount } from '@/interfaces/customs'
import { useChartAccountsStore, useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const useInformationFormModal = (props: {
  action: 'create' | 'edit' | 'view'
  data?: IChartAccount | null
}) => {
  const { _setDataModalForm } = useChartAccountsStore('v1')

  const { account_chart_types } = storeToRefs(useResourceStore('v1'))

  const formInformationModal = ref()

  const models = ref<{
    id?: number
    code?: string
    name: string
    type: string
    nature: boolean
    status_id?: boolean
    has_cost_center: boolean
    applies_ica_withholding_income: boolean
    applies_withholding_profits: boolean
    is_currency_reexpressed: boolean
  }>({
    code: '',
    name: '',
    type: '',
    nature: false,
    status_id: false,
    has_cost_center: false,
    applies_ica_withholding_income: false,
    applies_withholding_profits: false,
    is_currency_reexpressed: false,
  })

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: clearForm,
      edit: setFormEdit,
      view: setFormEdit,
    }
    actionHandlers[action]?.()
  }

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const setFormEdit = async () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value.id = data.id ?? undefined
      models.value.code = data.code ?? ''
      models.value.name = data.name ?? ''
      models.value.type = data.type ?? ''
      models.value.nature = data.nature === 'Débito' ? true : false
      models.value.status_id = data.status_id === 1 ? true : false
      models.value.has_cost_center = data.has_cost_center ?? false
      models.value.applies_ica_withholding_income =
        data.applies_ica_withholding_income ?? false
      models.value.applies_withholding_profits =
        data.applies_withholding_profits ?? false
      models.value.is_currency_reexpressed =
        data.is_currency_reexpressed ?? false
    }
  }

  const clearForm = async () => {
    models.value.id = undefined
    models.value.code = ''
    models.value.name = ''
    models.value.type = ''
    models.value.nature = false
    models.value.status_id = false
    models.value.has_cost_center = false
    models.value.applies_ica_withholding_income = false
    models.value.applies_withholding_profits = false
    models.value.is_currency_reexpressed = false
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  onUnmounted(() => {
    _setDataModalForm(null)
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
      if (isEmpty(models.value)) {
        _setDataModalForm(null)
      } else {
        _setDataModalForm({
          id: models.value.id,
          code: models.value.code ?? '',
          name: models.value.name ?? '',
          type: models.value.type ?? '',
          nature: models.value.nature ? 'Débito' : 'Crédito',
          status_id: models.value.status_id ? 1 : 2,
          has_cost_center: models.value.has_cost_center ?? false,
          applies_ica_withholding_income:
            models.value.applies_ica_withholding_income ?? false,
          applies_withholding_profits:
            models.value.applies_withholding_profits ?? false,
          is_currency_reexpressed:
            models.value.is_currency_reexpressed ?? false,
        })
      }
    },
    { deep: true }
  )

  return {
    models,
    formInformationModal,
    account_chart_types,
  }
}

export default useInformationFormModal
