// Vue
import { ref, onBeforeMount } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IRejectionReasonInformationForm,
  IRejectionReasonToCreate,
} from '@/interfaces/customs/fics/OperationRejectionReasons'

// Composables
import {
  useMainLoader,
  useGoToUrl,
  useUtils,
} from '@/composables'

// Stores
import { useOperationRejectionReasonsStore } from '@/stores/fics/operation-rejection-reasons'

const useOperationRejectionReasonsCreate = () => {
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { _createRejectionReason, _clearData } =
    useOperationRejectionReasonsStore('v1')

  const data_information_form = ref<IRejectionReasonInformationForm | null>(
    null
  )
  const informationFormRef = ref()

  const headerProps = {
    title: 'Crear causal de rechazo de operación',
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
        label: 'Crear',
        route: 'OperationRejectionReasonsCreate',
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

  const makeBaseInfoRequest = (
    data: IRejectionReasonInformationForm | null
  ) => {
    if (!data) return {}

    const request: Partial<IRejectionReasonToCreate> = {
      code: data.code ?? null,
      description: data.description ?? null,
      status: Number(data.status),
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IRejectionReasonToCreate> = {
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
    const success = await _createRejectionReason(payload)

    if (success) handleGoToList()

    openMainLoader(false)
  }

  const handleGoToList = () =>
    goToURL('OperationRejectionReasonsList', undefined, { reload: true })

  onBeforeMount(() => _clearData())

  return {
    tabs,
    onSubmit,
    tabActive,
    headerProps,
    tabActiveIdx,
    handleGoToList,
    informationFormRef,
    data_information_form,
  }
}

export default useOperationRejectionReasonsCreate
