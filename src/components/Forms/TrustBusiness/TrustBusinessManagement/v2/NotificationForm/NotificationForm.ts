// vue - pinia
import { onMounted, ref, watch } from 'vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import {
  INotificationAuthorizeTrustBusiness,
  ITrustbusinessNotificationForm,
} from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// composables
import { useAlert, useUtils } from '@/composables'
const { isEmptyOrZero } = useUtils()

const useNotificationForm = (
  props: {
    data?: ITrustbusinessNotificationForm | null
    action: ActionType
  },
  emit: Function
) => {
  const { showAlert } = useAlert()
  // computed
  const models = ref<ITrustbusinessNotificationForm>({
    business_notifications: [],
  })

  const notify_data_raw = ref()
  const authorize_data_raw = ref()
  const isLoading = ref(false)

  const _setValueModel = async () => {
    if (props.data) {
      models.value = {
        ...props.data,
      }
    }
    await setDataTables()
  }

  // actions
  const updateModels = (
    type: string,
    updatedList: INotificationAuthorizeTrustBusiness[] | []
  ) => {
    const remaining = models.value.business_notifications?.filter(
      (item) => item.type !== type
    )
    models.value.business_notifications = [...(remaining ?? []), ...updatedList]
  }

  const setDataTables = async () => {
    notify_data_raw.value =
      (await models.value.business_notifications?.filter(
        (item) => item.type === 'Notificación'
      )) ?? []

    authorize_data_raw.value =
      (await models.value.business_notifications?.filter(
        (item) => item.type === 'Autorización'
      )) ?? []
  }

  const validateForm = () => {
    const isValid =
      models.value.business_notifications?.some(
        (item) => item.type === 'Notificación'
      ) &&
      models.value.business_notifications?.some(
        (item) => item.type === 'Autorización'
      )

    if (!isValid) {
      showAlert('Campos requeridos no diligenciados', 'warning')
    }

    return isValid
  }

  // lifecycle
  onMounted(async () => {
    isLoading.value = true
    await _setValueModel()
    isLoading.value = false
  })

  // watchs
  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        emit('update:models', null)
      } else {
        emit('update:models', models.value)
      }
    },
    {
      deep: true,
    }
  )

  return {
    models,
    notify_data_raw,
    authorize_data_raw,
    isLoading,
    updateModels,
    validateForm,
  }
}

export default useNotificationForm
