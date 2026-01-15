// vue | quasar | router
import { onBeforeMount, onUnmounted, ref, watch } from 'vue'

// store
import { storeToRefs } from 'pinia'
import {
  useInvestmentPortfolioResourceStore,
  useManualUnitValueStore,
} from '@/stores'

// utils
import { isEmptyOrZero } from '@/utils'
import { ActionType } from '@/interfaces/global'
import { IManualUnitValueForm } from '@/interfaces/customs'

const useInformationForm = (props: {
  action: ActionType
  data?: IManualUnitValueForm | null
}) => {
  const { _setDataInformationForm } = useManualUnitValueStore('v1')
  const { data_information_form } = storeToRefs(useManualUnitValueStore('v1'))
  const { manual_unit_emitters, manual_unit_actions } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const formElementRef = ref()

  // props
  const initialModelsValues: IManualUnitValueForm = {
    id: null,
    emitter_id: null,
    description: '',
    participation_description: '',
    action_type: '',
    start_date: '',
    end_date: '',
    has_participations: false,
    has_actions: false,
    unit_value: null,
    created_at: '',
    creator_data: '',
    updated_at: '',
    updated_by_user: '',
    document_third: '',
    radio: undefined,
  }

  const models = ref<IManualUnitValueForm>({
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

  const setFormData = (data: IManualUnitValueForm) => {
    models.value.emitter_id = data.emitter_id ?? null
    models.value.description = data.description ?? ''
    models.value.participation_description =
      data.participation_description ?? ''
    models.value.action_type = data.action_type ?? ''
    models.value.start_date = data.start_date ?? ''
    models.value.end_date = data.end_date ?? ''
    models.value.has_participations = data.has_participations ?? false
    models.value.has_actions = data.has_actions ?? false
    models.value.unit_value = data.unit_value ?? null
    models.value.created_at = data.created_at ?? ''
    models.value.creator_data = data.creator_data ?? ''
    models.value.updated_at = data.updated_at ?? ''
    models.value.updated_by_user = data.updated_by_user ?? ''
    models.value.document_third = data.document_third ?? ''
  }

  const setFormEdit = async () => {
    clearForm()
    if (props.data) setFormData(props.data)
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

  const onUpdateEmitter = (item: { value: number; description: string }) => {
    models.value.emitter_id = item?.value ?? null
    models.value.description = item?.description ?? ''
  }

  // lifecycle hooks
  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  onBeforeMount(async () => {
    handlerActionForm(props.action)
  })

  // watchers
  watch(
    () => models.value.radio,
    (val) => {
      if (val) {
        models.value.has_participations = true
        models.value.has_actions = false
        models.value.action_type = ''
      } else {
        models.value.has_actions = true
        models.value.has_participations = false
        models.value.participation_description = ''
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

  watch(
    () => models.value,
    () => {
      if (props.action === 'view') return
      if (isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({ ...models.value })
      }
    },
    { deep: true }
  )
  return {
    manual_unit_emitters,
    manual_unit_actions,
    formElementRef,
    models,
    onUpdateEmitter,
  }
}

export default useInformationForm
