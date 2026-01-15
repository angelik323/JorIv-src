import { useUtils } from '@/composables'
import { IChartAccount } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import {
  useAccountingResourceStore,
  useChartAccountsStore,
  useFicResourceStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const useInformationFormModal = (props: {
  action: ActionType
  data?: IChartAccount | null
}) => {
  const { data_modal } = storeToRefs(useChartAccountsStore('v1'))
  const { _setDataModalForm } = useChartAccountsStore('v1')

  const { isEmptyOrZero } = useUtils()

  const {
    account_chart_types,
    account_chart_by_account_structure,
    third_parties_formatted,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { movements_codes } = storeToRefs(useFicResourceStore('v1'))
  const { coins } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const formInformationModal = ref()

  const models = ref<{
    id?: number
    code?: string
    name: string
    type: string | null
    nature: boolean
    status_id?: boolean
    currency_id?: number | null
    has_cost_center: boolean
    applies_ica_withholding_income: boolean
    applies_withholding_profits: boolean
    is_currency_reexpressed: boolean
    reexpression_settings: {
      positive: {
        account_code_id: number | null
        third_party_id: number | null
        fund_movement_id?: number | null
      }
      negative: {
        account_code_id: number | null
        third_party_id: number | null
        fund_movement_id?: number | null
      }
    }
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
    reexpression_settings: {
      positive: {
        account_code_id: null,
        third_party_id: null,
        fund_movement_id: null,
      },
      negative: {
        account_code_id: null,
        third_party_id: null,
        fund_movement_id: null,
      },
    },
  })

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: clearForm,
      edit: setFormEdit,
      view: setFormEdit,
    }
    actionHandlers[action]?.()
  }

  const setFormEdit = async () => {
    const data = props.data
    if (data && !models.value.id) {
      models.value.id = data.id ?? undefined
      models.value.code = data.code ?? ''
      models.value.name = data.name ?? ''
      models.value.type = data.type ?? null
      models.value.currency_id = data.currency_id ?? null
      models.value.nature = data.nature === 'Débito' ? true : false
      models.value.status_id = data.status_id === 1 ? true : false
      models.value.has_cost_center = data.has_cost_center ?? false
      models.value.applies_ica_withholding_income =
        data.applies_ica_withholding_income ?? false
      models.value.applies_withholding_profits =
        data.applies_withholding_profits ?? false
      models.value.is_currency_reexpressed =
        data.is_currency_reexpressed ?? false
      if (data.reexpression_settings?.positive) {
        models.value.reexpression_settings.positive =
          data.reexpression_settings.positive
      }
      if (data.reexpression_settings?.negative) {
        models.value.reexpression_settings.negative =
          data.reexpression_settings.negative
      }
    }
  }

  const clearForm = async () => {
    models.value.id = undefined
    models.value.code = ''
    models.value.name = ''
    models.value.type = null
    models.value.nature = false
    models.value.status_id = false
    models.value.currency_id = null
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
      if (isEmptyOrZero(models.value)) {
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
          currency_id: models.value.currency_id || undefined,
          reexpression_settings:
            models.value.reexpression_settings || undefined,
        })
      }
    },
    { deep: true }
  )

  watch(
    () => [
      models.value.reexpression_settings.positive?.account_code_id,
      models.value.reexpression_settings.negative?.account_code_id,
    ],
    () => {
      formInformationModal.value.resetValidation()
    }
  )

  const getFormData = () => {
    const data = { ...data_modal.value }
    if (!data.reexpression_settings?.positive?.account_code_id) {
      delete data.reexpression_settings?.positive
    }
    if (!data.reexpression_settings?.negative?.account_code_id) {
      delete data.reexpression_settings?.negative
    }
    return data
  }

  return {
    coins,
    models,
    movements_codes,
    account_chart_types,
    formInformationModal,
    third_parties_formatted,
    account_chart_by_account_structure,
    getFormData,
  }
}

export default useInformationFormModal
