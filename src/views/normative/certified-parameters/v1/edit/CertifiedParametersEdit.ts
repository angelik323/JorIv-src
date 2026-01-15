// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ICertifiedParametersInformationForm,
  ICertifiedParametersResponse,
  ICertifiedParametersToEdit,
} from '@/interfaces/customs/normative/CertifiedParameters'

// Composables - constants
import { useUtils, useMainLoader, useGoToUrl } from '@/composables'

// Stores
import { useCertifiedParametersStore } from '@/stores/normative/certified-parameters'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useCertifiedParametersEdit = () => {
  const { _getCertifiedParametersById, _updateCertifiedParameters } =
    useCertifiedParametersStore('v1')
  const { headerPropsDefault } = useCertifiedParametersStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const router = useRouter()
  const parameterId = Number(router.currentRoute.value.params.id)

  const information_form = ref<ICertifiedParametersInformationForm | null>(null)

  const informationFormRef = ref()

  const headerProperties = {
    title: 'Editar parámetros certificados',
    breadcrumbs: [
      ...headerPropsDefault.breadcrumbs,
      {
        label: 'Editar',
        route: 'CertifiedParametersEdit',
      },
      {
        label: parameterId.toString(),
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

  const setFormEdit = (data: ICertifiedParametersResponse) => {
    information_form.value = {
      code: data.code,
      certificate_type_id: data.certificate_type_id,
      name: data.name,
      person_type_id: data.person_type_id,
      html_header: data.html_header ?? null,
      html_body: data.html_body ?? null,
      html_footer: data.html_footer ?? null,
      generation_date: useUtils().formatDate(
        data.generation_date ?? '',
        'YYYY-MM-DD'
      ),
      html_content: [
        data.html_header ?? '',
        data.html_body ?? '',
        data.html_footer ?? '',
      ]
        .filter(Boolean)
        .join('---'),
    }
  }

  const makeBaseInfoRequest = (
    data: ICertifiedParametersInformationForm | null
  ) => {
    if (!data) return {}

    const sanitizedHtml = useUtils().sanitizeHtml(data.html_content || '')
    const contentArray = sanitizedHtml ? sanitizedHtml.split('---') : []

    const html_foot_clean = contentArray[2].replaceAll('<br>', '').trim()

    const request: ICertifiedParametersToEdit = {
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

    if (uploadedFiles?.logo && uploadedFiles.logo instanceof File) {
      formData.append('assets[logo]', uploadedFiles.logo)
    }

    if (uploadedFiles?.firma && uploadedFiles.firma instanceof File) {
      formData.append('assets[firma]', uploadedFiles.firma)
    }

    if (uploadedFiles?.marca_agua && uploadedFiles.marca_agua instanceof File) {
      formData.append('assets[marca_agua]', uploadedFiles.marca_agua)
    }

    return formData
  }

  const onSubmit = async () => {
    if (!(await informationFormRef.value?.validateForm())) return

    openMainLoader(true)

    const formData = makeDataRequest()
    const success = await _updateCertifiedParameters(formData, parameterId)

    if (success) {
      goToURL('CertifiedParametersList')
    }

    openMainLoader(false)
  }

  const keys = {
    normative: ['certificate_types', 'person_types'],
  }

  const keyFixedVariables = {
    normative: ['fixed_variables'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await Promise.all([
      _getResources(keys),
      _getResources(keyFixedVariables, 'filter[certificate_type]=2'),
    ])
    const response = await _getCertifiedParametersById(parameterId)
    if (response) {
      setFormEdit(response)
    }
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

export default useCertifiedParametersEdit
