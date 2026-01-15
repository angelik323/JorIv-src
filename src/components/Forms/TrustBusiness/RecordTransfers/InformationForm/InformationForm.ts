// pinia - vue - quasar
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// stores
import {
  useRecordTransfersStore,
  useTrustBusinessResourceStore,
} from '@/stores'

// interfaces
import {
  IRecordTransfersResponse,
  IResponseRecordTransfers,
} from '@/interfaces/customs'

import { useUtils } from '@/composables/useUtils'
const isEmptyOrZero = useUtils().isEmptyOrZero

const useInformationForm = (props: {
  action: 'create' | 'edit' | 'view' | 'authorize'
  data?: IResponseRecordTransfers | null
}) => {
  const {
    _getMainData,
    _setDataInformationForm,
    _setSelectedThird,
    _setParticipation,
    _setListAssignees,
  } = useRecordTransfersStore('v1')

  const { business_trusts, participant_types } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { data_information_form } = storeToRefs(useRecordTransfersStore('v1'))

  const formInformation = ref()
  const formTables = ref()

  const models = ref<IRecordTransfersResponse>({
    id: undefined,
    business_id: null,
    business_name: '',
    participant_type_id: null,
  })

  // actions
  const handlerActionForm = (
    action: 'create' | 'edit' | 'view' | 'authorize'
  ) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setModelValue,
      edit: data_information_form.value ? _setModelValue : _setEditValue,
      view: _setEditValue,
      authorize: _setEditValue,
    }
    actionHandlers[action]?.()
  }

  const _setModelValue = () => {
    clearForm()
    const data_value = data_information_form.value
    if (data_value) {
      models.value.id = data_value.id
      models.value.business_id = data_value.business_id
      models.value.participant_type_id = data_value.participant_type_id
    }
  }

  const _setEditValue = () => {
    clearForm()
    const data_value = props.data

    if (data_value) {
      models.value.id = data_value.id
      models.value.business_id = data_value.business_trust?.id
      models.value.business_name = data_value.business_trust?.business_code
      models.value.name = data_value.business_trust?.name
      models.value.state_id = data_value.business_trust?.status.id
      models.value.participant_type_id = Number(data_value.transfer_type_id)
      models.value.date = data_value.created_at.split('T')[0]
      models.value.state_register = data_value.status.id
      models.value.transfer_type = data_value.transfer_type
      _setSelectedThird(data_value.transferee_id)
      _setParticipation(
        `${data_value.transferee_id}`,
        data_value.transferee_percentage
      )
      _setListAssignees(
        data_value.participant_transfers?.map((item) => ({
          id: item.third_party.id,
          _uid: item.third_party.id,
          third_party_id: item.third_party.id,
          received_percentage: Number(item.percentage_participation),
          type_resource: '',
          name: item.third_party.name,
          type: item.third_party.type,
          abbreviation: item.third_party.abbreviation,
          document_number: item.third_party.document_number,
        }))
      )
    }
  }

  const clearForm = async () => {
    models.value.id = undefined
    models.value.business_id = null
    models.value.participant_type_id = null
  }

  onMounted(() => {
    handlerActionForm(props.action)
  })

  // watch
  watch(
    () => props.data,
    () => {
      handlerActionForm(props.action)
    },
    { immediate: true }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({
          ...models.value,
        })
      }
    },
    { deep: true }
  )

  const isValidData = computed(
    () => models.value.business_id && models.value.participant_type_id
  )

  watch(
    () => models.value,
    async () => {
      if (isValidData.value) {
        await _getMainData(
          models.value.business_id!,
          models.value.participant_type_id!,
          props.action === 'create',
          models.value.id
        )
      }
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value.business_id,
    (val) => {
      if (val) {
        const dataIndex = business_trusts.value.find((item) => item.id === val)

        if (!dataIndex && props.action !== 'create') return
        models.value.name = dataIndex?.name
        models.value.state_id = dataIndex?.status_id
      }
    },
    { immediate: true }
  )

  return {
    formInformation,
    models,
    business_trusts,
    participant_types,
    isValidData,
    formTables,
  }
}
export default useInformationForm
