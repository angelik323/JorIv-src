import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientsStore } from '@/stores'
import { ITrustorClientInternational } from '@/interfaces/customs/Clients'

const useInternationalForm = (props: any) => {
  const { data_trustor_international_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataTrustorCLientsInternational } = useClientsStore('v1')

  const formInternational = ref()

  const models = ref({
    can_performs_transactions: false as boolean | undefined,
    transaction_type: '' as null | string,
    operation_country_id: '' as null | string,
    currency: '' as null | string,
  })

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_trustor_international_form.value
        ? _setValueModel
        : setFormEdit,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data: ITrustorClientInternational = props.data
    if (data) {
      models.value.can_performs_transactions =
        data?.can_performs_transactions ?? undefined
      models.value.transaction_type = data?.transaction_type ?? null
      models.value.operation_country_id = data?.operation_country_id ?? null
      models.value.currency = data?.currency ?? null
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data: ITrustorClientInternational = props.data
    if (data) {
      models.value.can_performs_transactions =
        data?.can_performs_transactions ?? undefined
      models.value.transaction_type = data?.transaction_type ?? null
      models.value.operation_country_id = data?.operation_country_id ?? null
      models.value.currency = data?.currency ?? null
    }
  }

  const _setValueModel = () => {
    if (data_trustor_international_form.value) {
      models.value = { ...data_trustor_international_form.value }
    }
  }

  const clearForm = () => {
    models.value.can_performs_transactions = undefined
    models.value.transaction_type = null
    models.value.operation_country_id = null
    models.value.currency = null
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => [
      models.value.can_performs_transactions,
      models.value.transaction_type,
      models.value.operation_country_id,
      models.value.currency,
    ],
    () => {
      if (isEmpty(models.value)) {
        _setDataTrustorCLientsInternational(null)
      } else {
        _setDataTrustorCLientsInternational({
          can_performs_transactions:
            models.value.can_performs_transactions ?? undefined,
          transaction_type: models.value.transaction_type ?? null,
          operation_country_id: models.value.operation_country_id ?? null,
          currency: models.value.currency ?? null,
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

  return { models, formInternational }
}

export default useInternationalForm
