// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ICertifiedParametersInformationForm,
  ICertifiedParametersToCreate,
} from '@/interfaces/customs/normative/CertifiedParameters'

// Composables - constants
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useMainLoader } from '@/composables'

// Stores
import { useCertifiedParametersStore } from '@/stores/normative/certified-parameters'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useCertifiedParametersCreate = () => {
  const { _createCertifiedParameters } = useCertifiedParametersStore('v1')
  const { headerPropsDefault } = storeToRefs(useCertifiedParametersStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const information_form = ref<ICertifiedParametersInformationForm | null>(null)

  const informationFormRef = ref()

  const headerProperties = {
    title: 'Crear parámetros certificados',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
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
    data: ICertifiedParametersInformationForm | null
  ) => {
    if (!data) return {}

    const sanitizedHtml = useUtils().sanitizeHtml(data.html_content || '')

    const contentArray = sanitizedHtml ? sanitizedHtml.split('---') : []

    const html_foot_clean = (contentArray[2] || '')
      .replaceAll('<br>', '')
      .trim()

    const request: ICertifiedParametersToCreate = {
      certificate_type_id: Number(data.certificate_type_id),
      name: String(data.name),
      person_type_id: Number(data.person_type_id),
      html_header: contentArray[0] || undefined,
      html_body: contentArray[1] || undefined,
      html_footer: html_foot_clean || undefined,
      assets: {
        logo: data.logo || undefined,
        firma: data.firma || undefined,
        marca_agua: data.marca_agua || undefined,
      },
    }

    return cleanEmptyFields(request, true)
  }

  const makeDataRequest = (): FormData => {
    const processedData = makeBaseInfoRequest(information_form.value)

    const formData = new FormData()

    processedData.certificate_type_id &&
      formData.append(
        'certificate_type_id',
        String(processedData.certificate_type_id)
      )

    processedData.name && formData.append('name', String(processedData.name))

    processedData.person_type_id &&
      formData.append('person_type_id', String(processedData.person_type_id))

    processedData.html_header &&
      formData.append('html_header', processedData.html_header)

    processedData.html_body &&
      formData.append('html_body', processedData.html_body)

    processedData.html_footer &&
      formData.append('html_footer', processedData.html_footer)

    const uploadedFiles = informationFormRef.value?.getUploadFiles?.()

    uploadedFiles?.logo && formData.append('assets[logo]', uploadedFiles.logo)

    uploadedFiles?.firma &&
      formData.append('assets[firma]', uploadedFiles.firma)

    uploadedFiles?.marca_agua &&
      formData.append('assets[marca_agua]', uploadedFiles.marca_agua)

    return formData
  }

  const onSubmit = async () => {
    if (!(await informationFormRef.value?.validateForm())) return

    openMainLoader(true)

    const formData = makeDataRequest()

    const success = await _createCertifiedParameters(formData)
    if (success) {
      goToURL('CertifiedParametersList')
    }

    openMainLoader(false)
  }

  const keys = {
    normative: ['certificate_types', 'person_types'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

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

export default useCertifiedParametersCreate
