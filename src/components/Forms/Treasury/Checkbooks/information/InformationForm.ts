import {
  ICheckbookInformationForm,
  ICheckbookResponse,
} from '@/interfaces/customs'
import { onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRules } from '@/composables'
import {
  useTreasuryResourceStore,
  useCheckbooksStore,
  useResourceManagerStore,
} from '@/stores'

const useInformationForm = (props: any) => {
  const { _setDataInformationForm } = useCheckbooksStore('v1')
  const { data_information_form } = storeToRefs(useCheckbooksStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    business_trust,
    banks_record_expenses,
    bank_accounts_with_name,
    reason_return_status,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const {
    is_required,
    is_valid_range,
    date_before_or_equal_to_the_current_date,
  } = useRules()

  const formElementRef = ref()

  const initialModelsValues: ICheckbookInformationForm = {
    business_trust_id: null,
    bank_id: null,
    bank_account_id: null,
    range_from: null,
    range_to: null,
    assignment_date: null,
    status_id: null,
    code: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const handlerActionForm = (action: 'create' | 'edit') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
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
    const data: ICheckbookResponse = props.data
    if (!data) return

    const {
      business_trust_id,
      bank_id,
      bank_account_id,
      code,
      range_from,
      range_to,
      assignment_date,
      status_id,
    } = data

    models.value.business_trust_id = business_trust_id ?? null
    models.value.bank_id = bank_id ?? null
    models.value.bank_account_id = bank_account_id ?? null
    models.value.range_from = range_from ?? null
    models.value.range_to = range_to ?? null
    models.value.assignment_date = assignment_date ?? null
    models.value.status_id = status_id ?? null
    models.value.code = code ?? null
  }

  const _setValueModel = () => {
    if (!data_information_form.value) return

    const {
      business_trust_id,
      bank_id,
      bank_account_id,
      code,
      range_from,
      range_to,
      assignment_date,
      status_id,
    } = data_information_form.value

    models.value.business_trust_id = business_trust_id ?? null
    models.value.bank_id = bank_id ?? null
    models.value.bank_account_id = bank_account_id ?? null
    models.value.range_from = range_from ?? null
    models.value.range_to = range_to ?? null
    models.value.assignment_date = assignment_date ?? null
    models.value.status_id = status_id ?? null
    models.value.code = code ?? null
  }
  const keys = {
    treasury: [
      'bank_account',
      'banks_record_expenses',
      'bank_accounts_with_name',
    ],
  }

  const clearForm = () => {
    Object.assign(models.value, initialModelsValues)
  }

  onMounted(async () => {
    const businessId = props.data.business_trust_id

    if (props.action === 'edit' && businessId) {
      await Promise.all([
        _getResources(
          { treasury: ['banks_record_expenses'] },
          `business_trust_id=${businessId}`
        ),
        _getResources(
          { treasury: ['bank_account'] },
          `business_trust_id=${businessId}`
        ),
      ])
    }

    handlerActionForm(props.action)
  })
  onBeforeMount(() => {
    _resetKeys(keys)
  })
  onUnmounted(async () => {
    _setDataInformationForm(null)
  })
  watch(
    () => models.value.bank_id,
    async (newValue) => {
      if(props.action === 'edit') return

      const bank_accounts_keys = {
        treasury: [`bank_account`],
      }
      _resetKeys({
        treasury: ['bank_account', 'bank_accounts_with_name'],
      })
      models.value.bank_account_id = null

      if (!newValue) return

      await _getResources(
        bank_accounts_keys,
        `filter[business_id]=${models.value.business_trust_id}&filter[bank_id]=${newValue}`
      )
    }
  ) 
  watch(
    () => models.value.business_trust_id,
    async (newValue) => {
      if(props.action === 'edit') return

      const bank_keys = {
        treasury: [`banks_record_expenses`],
      }
      _resetKeys({
        treasury: [
          'bank_account',
          'bank_accounts_with_name',
          'banks_record_expenses',
        ],
      })
      models.value.bank_id = null
      models.value.bank_account_id = null
      if (!newValue) return

      await _getResources(bank_keys, `business_trust_id=${newValue}`)
    }
  ) 
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
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({ ...models.value })
      }
    },
    { deep: true }
  )

  return {
    models,
    formElementRef,
    business_trust,
    banks_record_expenses,
    bank_accounts_with_name,
    reason_return_status,
    is_required,
    is_valid_range,
    date_before_or_equal_to_the_current_date,
  }
}

export default useInformationForm
