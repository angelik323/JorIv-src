// vue && pinia
import { storeToRefs } from 'pinia'
import { ref, watch, onMounted, computed } from 'vue'
// Interfaces
import { ITreasuryTypeReceiveList } from '@/interfaces/customs'
import { ITypesCollectionDetail } from '@/interfaces/customs/TypesCollection'
import { WriteActionType } from '@/interfaces/global'
// Composables
import { useUtils } from '@/composables/useUtils'
// Stores
import { useTypesCollectionStore, useResourceStore } from '@/stores'

const useInformationForm = (props: {
  action: WriteActionType
  data?: ITypesCollectionDetail
}) => {
  const { data_information_form } = storeToRefs(useTypesCollectionStore('v1'))
  const { treasury_type_receive } = storeToRefs(useResourceStore('v1'))
  const { _setDataBasicCollection } = useTypesCollectionStore('v1')
  const { status } = storeToRefs(useResourceStore('v1'))

  const { isEmptyOrZero } = useUtils()

  const formInformation = ref()
  const models = ref<{
    description: string | null
    type_receive: string | null
    redemption_days?: string | null
    status_id?: number | string | null
    code?: string | null
  }>({
    description: '',
    type_receive: '',
    redemption_days: '',
    status_id: null,
    code: null,
  })

  const handlerActionForm = (action: 'create' | 'edit') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
    }
    actionHandlers[action]?.()
  }

  const paymentMethods: ITreasuryTypeReceiveList = Array.isArray(
    treasury_type_receive.value
  )
    ? treasury_type_receive.value.map((item) => ({
        label: item.label,
        value: item.value.toString(),
      }))
    : []

  const setFormEdit = async () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value.code = data.code
      models.value.description = data.description
      models.value.type_receive = data.type_receive
      models.value.status_id = data.status_id
    }

    const redemptionDaysStr =
      data?.redemption_days != null ? String(data?.redemption_days) : ''
    models.value.redemption_days = redemptionDaysStr
  }

  const clearForm = () => {
    models.value.description = ''
    models.value.type_receive = ''
    models.value.redemption_days = ''
  }

  const _setValueModel = () => {
    if (data_information_form.value) {
      models.value = { ...data_information_form.value }
    }
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  const updatePaymentType = (value: string) => {
    models.value.type_receive = value
  }

  const selectedPaymentType = computed(() => models.value.type_receive)

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataBasicCollection(null)
      } else {
        _setDataBasicCollection({
          redemption_days: models.value.redemption_days ?? '',
          type_receive: models.value.type_receive ?? '',
          description: models.value.description ?? null,
          status_id: models.value.status_id ?? '',
        } as ITypesCollectionDetail)
      }
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  watch(
    () => models.value.type_receive,
    (newType) => {
      if (newType !== 'Cheque') {
        models.value.redemption_days = ''
        formInformation.value?.resetValidation()
        return
      }
      const redemptionDaysStr =
        models.value.redemption_days != null
          ? String(models.value.redemption_days)
          : ''
      models.value.redemption_days = redemptionDaysStr
    }
  )

  return {
    status,
    models,
    formInformation,
    paymentMethods,
    selectedPaymentType,

    updatePaymentType,
  }
}

export default useInformationForm
