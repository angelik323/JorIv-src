// Vue - Pinia
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces - Constants
import { IBulkUploadTemplatesList } from '@/interfaces/customs/fics/BulkUploadTemplates'
import { operation_bulk_upload_template } from '@/constants'
import { ActionType } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useBulkUploadTemplatesStore } from '@/stores/fics/bulk-upload-templates'

const useInformationForm = (props: {
  action: ActionType
  data?: IBulkUploadTemplatesList
}) => {
  const { isEmptyOrZero } = useUtils()

  const { data_information_form } = storeToRefs(
    useBulkUploadTemplatesStore('v1')
  )
  const { _setDataInformationForm } = useBulkUploadTemplatesStore('v1')

  const initialModelsValues: IBulkUploadTemplatesList = {
    id: null,
    description: '',
    transaction_method_id: '',
    transaction_method_options: [],
    optional_columns: [],
    operation: '',
    selector_modal: '',
    columns: [],
  }

  const participationHandlingDisabled = ref(false)
  const informationFormRef = ref()

  const models = ref<IBulkUploadTemplatesList>({
    ...initialModelsValues,
  })

  // handlers / actions
  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
      view: _setFormView,
    }
    actionHandlers[action]?.()
  }

  const setFormData = (data: IBulkUploadTemplatesList) => {
    models.value.description = data.description ?? ''
    models.value.operation = data.operation ?? ''
    models.value.transaction_method_id = data.transaction_method_id ?? ''
    models.value.description = data.description ?? ''
  }

  const setFormEdit = async () => {
    clearForm()
    if (props.data) setFormData(props.data)
  }

  const _setFormView = async () => {
    if (!data_information_form.value) return
    models.value.columns = data_information_form.value.columns ?? []
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
  onMounted(async () => {
    handlerActionForm(props.action)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  // watchers
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
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({ ...models.value })
      }
    },
    { deep: true }
  )

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
    operation_bulk_upload_template,
    participationHandlingDisabled,
    informationFormRef,
    models,
  }
}
export default useInformationForm
