// Vue - pinia
import { ref } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IGenerationCertificateInformationForm,
  IGenerationCertificateToCreate,
} from '@/interfaces/customs/normative/GenerationCertificate'

// Composables - constants
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useMainLoader } from '@/composables'

// Stores
import { useGenerationCertificateStore } from '@/stores/normative/generation-certificate'

const useGmfCertificateCreate = () => {
  const { _createGenerationCertificate } = useGenerationCertificateStore('v1')
  const { headerPropsDefault } = useGenerationCertificateStore('v1')

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const information_form = ref<IGenerationCertificateInformationForm | null>(
    null
  )

  const informationFormRef = ref()

  const headerProperties = {
    title: 'Generación de certificados GMF',
    breadcrumbs: [
      ...headerPropsDefault.breadcrumbs,
      {
        label: 'Crear',
        route: 'CertifiedParametersCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information_form',
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
    data: IGenerationCertificateInformationForm | null
  ) => {
    if (!data) return {}

    const request: IGenerationCertificateToCreate = {
      person_types: data.person_types,
      start_client_id: data.start_client_id,
      end_client_id: data.end_client_id,
      validity: data.validity,
      start_period: data.start_period,
      end_period: data.end_period,
    }

    if (!data.massive && data.start_client_id) {
      request.end_client_id = data.start_client_id
    }

    return cleanEmptyFields(request, true)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IGenerationCertificateToCreate> = {
      ...makeBaseInfoRequest(information_form.value),
    }

    return apiRequestBody
  }

  const onSubmit = async () => {
    if (!(await informationFormRef.value?.validateForm())) return

    openMainLoader(true)

    const payload = makeDataRequest()

    const success = await _createGenerationCertificate('gmf', payload)
    if (success) goToURL('GmfGroupList')

    openMainLoader(false)
  }

  return {
    information_form,
    informationFormRef,
    headerProperties,
    tabs,
    tabActive,
    onSubmit,
    tabActiveIdx,
    goToURL,
  }
}

export default useGmfCertificateCreate
