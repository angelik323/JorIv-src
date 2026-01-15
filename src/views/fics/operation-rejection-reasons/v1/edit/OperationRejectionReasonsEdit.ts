// Vue - Vue Router - Pinia
import { ref, onBeforeMount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IRejectionReasonInformationForm,
  IRejectionReasonResponse,
  IRejectionReasonToEdit,
} from '@/interfaces/customs/fics/OperationRejectionReasons'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useOperationRejectionReasonsStore } from '@/stores/fics/operation-rejection-reasons'

const useOperationRejectionReasonsEdit = () => {
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _updateRejectionReason, _getByIdRejectionReason, _clearData } =
    useOperationRejectionReasonsStore('v1')
  const { rejection_reasons_response } = storeToRefs(
    useOperationRejectionReasonsStore('v1')
  )

  const data_information_form = ref<IRejectionReasonInformationForm | null>(
    null
  )
  const informationFormRef = ref()

  const searchId = +route.params.id

  const headerProps = {
    title: 'Editar causal de rechazo de operación',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Causales de rechazo de operación',
        route: 'OperationRejectionReasonsList',
      },
      {
        label: 'Editar',
        route: 'OperationRejectionReasonsEdit',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const setFormEdit = (data: IRejectionReasonResponse) => {
    const { code, description, status_id } = data

    data_information_form.value = {
      code: code?.toString() ?? null,
      description: description ?? null,
      status: status_id ?? null,
    }
  }

  const makeBaseInfoRequest = (
    data: IRejectionReasonInformationForm | null
  ) => {
    if (!data) return {}

    const request: Partial<IRejectionReasonToEdit> = {
      description: data.description ?? null,
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IRejectionReasonToEdit> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    const forms = [informationFormRef]

    if (tabActiveIdx >= 0 && tabActiveIdx < forms.length) {
      const form = forms[tabActiveIdx]?.value
      const result = form?.validateForm ? await form.validateForm() : false
      return result
    }

    return false
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _updateRejectionReason(payload, searchId)

    if (success) handleGoToList()

    openMainLoader(false)
  }

  const handleGoToList = () =>
    goToURL('OperationRejectionReasonsList', undefined, { reload: true })

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdRejectionReason(searchId)
    openMainLoader(false)
  })

  watch(
    () => rejection_reasons_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

  return {
    tabs,
    onSubmit,
    tabActive,
    headerProps,
    tabActiveIdx,
    handleGoToList,
    informationFormRef,
    data_information_form,
    rejection_reasons_response,
  }
}

export default useOperationRejectionReasonsEdit
