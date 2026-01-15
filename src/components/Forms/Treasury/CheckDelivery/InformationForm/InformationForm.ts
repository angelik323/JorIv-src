// vue | quasar | router
import { onBeforeMount, onUnmounted, ref, watch } from 'vue'

// stores
import { storeToRefs } from 'pinia'
import { useCheckDeliveryStore, useTreasuryResourceStore } from '@/stores'

// utils
import { ActionType } from '@/interfaces/global'
import {
  ICheckDeliveryList,
  ITreasutyCheckDeliveryResponse,
} from '@/interfaces/customs'

const useInformationForm = (props: {
  action: ActionType
  data?: ICheckDeliveryList | null
}) => {
  const { _setDataInformationForm } = useCheckDeliveryStore('v1')
  const { data_information_form } = storeToRefs(useCheckDeliveryStore('v1'))
  const { document_type, third_parties } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  // props
  const formElementRef = ref()
  const initialModelsValues: ICheckDeliveryList = {
    id: null,
    created_by: '',
    created_at: '',
    check_number: null,
    status: {
      id: null,
      name: '',
    },
    expense_date: '',
    beneficiary: {
      nit: '',
      name: '',
    },
    value: '',
    authorized_by: {
      document_number: null,
      identification: null,
    },
    instructions: '',
    delivery_date: '',
    is_delivered: false,
  }

  const models = ref<ICheckDeliveryList>({
    ...initialModelsValues,
  })

  // handlers / actions
  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: setFormEdit,
      view: _setFormView,
    }
    actionHandlers[action]?.()
  }

  const setFormData = (data: ICheckDeliveryList) => {
    const dataModel = data as unknown as ITreasutyCheckDeliveryResponse
    models.value.check_number = dataModel.check_number ?? null
    models.value.status = dataModel.status ?? {}
    models.value.beneficiary = dataModel.beneficiary ?? {}
    models.value.value = dataModel.value ?? ''
    models.value.authorized_by = dataModel.authorized_by ?? {}
    models.value.instructions = dataModel.instructions ?? ''
    models.value.delivery_date = dataModel.delivery_date ?? ''
    models.value.authorized_document = dataModel.authorized_document?.id ?? null
    models.value.authorized_identification = dataModel.authorized_by?.id ?? null
  }

  const setFormEdit = async () => {
    clearForm()
    if (data_information_form.value) setFormData(data_information_form.value)
  }

  const _setFormView = async () => {
    if (!data_information_form.value) return

    Object.assign(models.value, data_information_form.value)
  }

  const _setValueModel = () => {
    if (!data_information_form.value) return

    Object.assign(models.value, data_information_form.value)
  }

  const clearForm = () => {
    Object.assign(models.value, initialModelsValues)
  }

  // lifecycle hooks
  onUnmounted(async () => {
    _setDataInformationForm(null)
  })
  onBeforeMount(() => {
    handlerActionForm(props.action)
  })

  // watchers
  watch(
    () => data_information_form.value,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true }
  )

  return {
    formElementRef,
    document_type,
    third_parties,
    models,
  }
}

export default useInformationForm
