// vue | quasar | router
import { onUnmounted, ref, watch } from 'vue'

// store
import { storeToRefs } from 'pinia'
import {
  useInvestmentPortfolioResourceStore,
  useQualificationsMaintenanceStore,
} from '@/stores'

// utils
import { isEmptyOrZero } from '@/utils'
import { IQualificationsMaintenance } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

const useInformationForm = (props: {
  action: ActionType
  data?: IQualificationsMaintenance | null
}) => {
  const { _setDataInformationForm } = useQualificationsMaintenanceStore('v1')
  const { data_information_form } = storeToRefs(
    useQualificationsMaintenanceStore('v1')
  )
  const { cp_issuer_rating, lp_issuer_rating } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  // props
  const formElementRef = ref()

  const initialModelsValues: IQualificationsMaintenance = {
    id: null,
    document_third: null,
    description: '',
    history_issuers_counter_party: {
      created_at: '',
      creator_data: '',
      update_data: '',
      updated_at: '',
    },
    cp_issuer_rating: '',
    lp_issuer_rating: '',
    cp_issuer_rating_new: '',
    lp_issuer_rating_new: '',
  }

  const models = ref<IQualificationsMaintenance>({
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

  const setFormData = (data: IQualificationsMaintenance) => {
    models.value.document_third = data.document_third ?? null
    models.value.description = data.description ?? ''
    models.value.history_issuers_counter_party =
      data?.history_issuers_counter_party ?? {}
    models.value.cp_issuer_rating = data?.cp_issuer_rating ?? ''
    models.value.lp_issuer_rating = data?.lp_issuer_rating ?? ''
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

  // lifecycle hooks
  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  // watchers
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
    lp_issuer_rating,
    cp_issuer_rating,
    formElementRef,
    models,
  }
}

export default useInformationForm
