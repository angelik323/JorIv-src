import { useUtils } from '@/composables'
import { ICreateBankingEntitiesAccountingParametersCommissions } from '@/interfaces/customs'
import {
  useBankingEntitiesAccountingParametersCommissionsStore,
  useResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const useInformationForm = (props: {
  action: 'create' | 'edit'
  data?: ICreateBankingEntitiesAccountingParametersCommissions | null
}) => {
  const { data_information_form } = storeToRefs(
    useBankingEntitiesAccountingParametersCommissionsStore('v1')
  )
  const { _setDataInformationForm } =
    useBankingEntitiesAccountingParametersCommissionsStore('v1')

  const {
    banks_initial_balance,
    treasury_movement_codes,
    commission_rate_options,
    validates_collection_method_options,
  } = storeToRefs(useResourceStore('v1'))

  const formInformation = ref()

  const models = ref<ICreateBankingEntitiesAccountingParametersCommissions>({
    bank_id: null,
    description: '',
    accounting_blocks_collection_id: 0,
    treasury_movement_code_id: null,
    validates_collection_method: false,
    commission_rate: '',
    commission_percentage: null,
    fixed_value: null,
    observations: '',
  })

  const handlerActionForm = (action: 'create' | 'edit') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
    }
    actionHandlers[action]?.()
  }

  const _setValueModel = () => {
    if (data_information_form.value) {
      models.value.bank_id = data_information_form.value.bank_id ?? null
      models.value.description = data_information_form.value.description ?? ''
      models.value.accounting_blocks_collection_id =
        data_information_form.value.accounting_blocks_collection_id ?? 0
      models.value.treasury_movement_code_id =
        data_information_form.value.treasury_movement_code_id ?? null
      models.value.validates_collection_method =
        data_information_form.value.validates_collection_method ?? false
      models.value.commission_rate =
        data_information_form.value.commission_rate ?? ''
      models.value.commission_percentage =
        data_information_form.value.commission_percentage ?? null
      models.value.fixed_value = data_information_form.value.fixed_value ?? null
      models.value.observations = data_information_form.value.observations ?? ''
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data = data_information_form.value
    if (data) {
      Object.assign(models.value, { ...data })
    }
  }

  const clearForm = () => {
    models.value.bank_id = null
    models.value.description = ''
    models.value.accounting_blocks_collection_id = 0
    models.value.treasury_movement_code_id = null
    models.value.validates_collection_method = false
    models.value.commission_rate = ''
    models.value.commission_percentage = null
    models.value.fixed_value = null
    models.value.observations = ''
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  const assignModelValues = (
    val: ICreateBankingEntitiesAccountingParametersCommissions
  ) => {
    models.value.bank_id = val?.bank_id
    models.value.description = val?.description
    models.value.accounting_blocks_collection_id =
      val?.accounting_blocks_collection_id
    models.value.treasury_movement_code_id = val?.treasury_movement_code_id
    models.value.validates_collection_method = val?.validates_collection_method
    models.value.commission_rate = val?.commission_rate
    models.value.commission_percentage = val?.commission_percentage
    models.value.fixed_value = val?.fixed_value
    models.value.observations = val?.observations
  }
  watch(
    () => props.data,
    (val) => {
      if (!val) {
        clearForm()
        return
      }
      assignModelValues(val)
    },
    { immediate: true, deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (useUtils().isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
        return
      }

      _setDataInformationForm({
        bank_id: models.value.bank_id ?? null,
        description: models.value.description ?? '',
        accounting_blocks_collection_id:
          models.value.accounting_blocks_collection_id ?? 0,
        treasury_movement_code_id:
          models.value.treasury_movement_code_id ?? null,
        validates_collection_method:
          models.value.validates_collection_method ?? false,
        commission_rate: models.value.commission_rate ?? '',
        commission_percentage: models.value.commission_percentage ?? null,
        fixed_value: models.value.fixed_value ?? null,
        observations: models.value.observations ?? '',
      })
    },
    { deep: true }
  )

  return {
    models,
    formInformation,
    banks_initial_balance,
    treasury_movement_codes,
    commission_rate_options,
    validates_collection_method_options,
  }
}
export default useInformationForm
