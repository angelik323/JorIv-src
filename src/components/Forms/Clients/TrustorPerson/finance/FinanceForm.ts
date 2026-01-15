import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientsStore } from '@/stores'
import { ITrustorClientFinance } from '@/interfaces/customs/Clients'

const useFinanceForm = (props: any) => {
  const { data_trustor_finance_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataTrustorCLientsFinance } = useClientsStore('v1')

  const formFinance = ref()

  const models = ref({
    declares_income: false as boolean | undefined,
    total_operational_income: '' as string | number | null,
    total_expenses: '' as string | number | null,
    other_non_operational_income_concept: '' as string | number | null,
    total_non_operational_income: '' as string | number | null,
    assets: '' as string | number | null,
    liabilities: '' as string | number | null,
  })

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_trustor_finance_form.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data: ITrustorClientFinance = props.data
    if (data) {
      models.value.declares_income = data?.declares_income ?? undefined
      models.value.total_operational_income =
        data?.total_operational_income ?? null
      models.value.total_expenses = data?.total_expenses ?? null
      models.value.other_non_operational_income_concept =
        data?.other_non_operational_income_concept ?? null
      models.value.total_non_operational_income =
        data?.total_non_operational_income ?? null
      models.value.assets = data?.assets ?? null
      models.value.liabilities = data?.liabilities ?? null
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data: ITrustorClientFinance = props.data
    if (data) {
      models.value.declares_income = data?.declares_income ?? undefined
      models.value.total_operational_income =
        data?.total_operational_income ?? null
      models.value.total_expenses = data?.total_expenses ?? null
      models.value.other_non_operational_income_concept =
        data?.other_non_operational_income_concept ?? null
      models.value.total_non_operational_income =
        data?.total_non_operational_income ?? null
      models.value.assets = data?.assets ?? null
      models.value.liabilities = data?.liabilities ?? null
    }
  }

  const _setValueModel = () => {
    if (data_trustor_finance_form.value) {
      models.value = { ...data_trustor_finance_form.value }
    }
  }

  const clearForm = () => {
    models.value.declares_income = undefined
    models.value.total_operational_income = null
    models.value.total_expenses = null
    models.value.other_non_operational_income_concept = null
    models.value.total_non_operational_income = null
    models.value.assets = null
    models.value.liabilities = null
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => [
      models.value.declares_income,
      models.value.total_operational_income,
      models.value.total_expenses,
      models.value.other_non_operational_income_concept,
      models.value.total_non_operational_income,
      models.value.assets,
      models.value.liabilities,
    ],
    () => {
      if (isEmpty(models.value)) {
        _setDataTrustorCLientsFinance(null)
      } else {
        _setDataTrustorCLientsFinance({
          declares_income: models.value.declares_income ?? undefined,
          total_operational_income:
            models.value.total_operational_income ?? null,
          total_expenses: models.value.total_expenses ?? null,
          other_non_operational_income_concept:
            models.value.other_non_operational_income_concept ?? null,
          total_non_operational_income:
            models.value.total_non_operational_income ?? null,
          assets: models.value.assets ?? null,
          liabilities: models.value.liabilities ?? null,
        })
      }
    }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  return { models, formFinance }
}

export default useFinanceForm
