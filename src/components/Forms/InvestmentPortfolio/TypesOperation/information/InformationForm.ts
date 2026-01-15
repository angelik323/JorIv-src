//Vue-Pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
//Qasar
import { QForm } from 'quasar'
//Stores
import {
  useFicResourceStore,
  useInvestmentPortfolioResourceStore,
  useTreasuryResourceStore,
  useTypesOperationStore,
} from '@/stores'
//Interfaces
import { ITypesOperation, Nullable } from '@/interfaces/customs/'
//Constants
import {
  fic_menu_movement,
  originType,
  natureOperation,
} from '@/constants/resources'

export const useInformationForm = (props: {
  action: 'create' | 'edit'
  data?: ITypesOperation
}) => {
  const { data_information_form } = storeToRefs(useTypesOperationStore('v1'))

  const { movements } = storeToRefs(useFicResourceStore('v1'))
  const { inversion_types } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )
  const { treasury_movement_codes } = storeToRefs(
    useTreasuryResourceStore('v1')
  )

  const formInformation = ref<InstanceType<typeof QForm> | null>(null)
  const models = ref<Nullable<ITypesOperation>>({
    code: null,
    description: null,
    generates_fic_movement: null,
    fic_movement_code: null,
    operation_nature: null,
    accounting_origin: null,
    generates_papeleta: null,
    treasury_movement_code_id: null,
    inversion_type_id: null,
  })

  const handlerActionForm = (action: 'create' | 'edit') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
    }
    actionHandlers[action]?.()
  }

  const _setValueModel = () => {
    models.value.code = data_information_form.value?.code ?? null
    models.value.description = data_information_form.value?.description ?? null
    models.value.generates_fic_movement =
      data_information_form.value?.generates_fic_movement ?? null
    models.value.fic_movement_code =
      data_information_form.value?.fic_movement_code ?? null
    models.value.operation_nature =
      data_information_form.value?.operation_nature ?? null
    models.value.accounting_origin =
      data_information_form.value?.accounting_origin ?? null
    models.value.generates_papeleta =
      data_information_form.value?.generates_papeleta ?? null
    models.value.treasury_movement_code_id =
      data_information_form.value?.treasury_movement_code_id
    models.value.inversion_type_id =
      data_information_form.value?.inversion_type_id
  }

  const setFormEdit = () => {
    clearForm()
    models.value.code = data_information_form.value?.code ?? null
    models.value.description = data_information_form.value?.description ?? null
    models.value.generates_fic_movement =
      data_information_form.value?.generates_fic_movement ?? null
    models.value.fic_movement_code =
      data_information_form.value?.fic_movement_code ?? null
    models.value.operation_nature =
      data_information_form.value?.operation_nature ?? null
    models.value.accounting_origin =
      data_information_form.value?.accounting_origin ?? null
    models.value.generates_papeleta =
      data_information_form.value?.generates_papeleta ?? null
    models.value.treasury_movement_code_id =
      data_information_form.value?.treasury_movement_code_id
    models.value.inversion_type_id =
      data_information_form.value?.inversion_type_id
  }

  const clearForm = () => {
    models.value.code = null
    models.value.description = null
    models.value.generates_fic_movement = null
    models.value.fic_movement_code = null
    models.value.operation_nature = null
    models.value.accounting_origin = null
    models.value.generates_papeleta = null
    models.value.inversion_type_id = null
    models.value.treasury_movement_code_id = null
  }
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
    () => models.value.generates_fic_movement,
    (generates_fic_movement) => {
      if (generates_fic_movement === false) {
        models.value.fic_movement_code = null
      }
    }
  )

  return {
    formInformation,
    models,
    movements,
    fic_menu_movement,
    originType,
    natureOperation,
    treasury_movement_codes,
    inversion_types,
  }
}
