// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IFormatGenerationInformationForm,
  IFormatGenerationToCreate,
} from '@/interfaces/customs/normative/FormatGeneration'

// Composables
import { useUtils, useMainLoader, useGoToUrl } from '@/composables'

// Stores
import { useFormatGenerationStore } from '@/stores/normative/format-generation'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useFormatGenerationCreate = () => {
  const { _createFormatGeneration, _clearData, _downloadExcel, _downloadTxt } =
    useFormatGenerationStore('v1')
  const { headerPropsDefault, data_to_create } = storeToRefs(
    useFormatGenerationStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const dataCreate = ref<boolean>(true)

  // Data de formularios
  const information_form = ref<IFormatGenerationInformationForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProperties = {
    title: 'Crear formato 523 - Rentabilidades fics',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'FormatGenerationCreate',
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

  const validateForms = async () => {
    let valid = false
    const forms = [informationFormRef]

    if (tabActiveIdx >= 0 && tabActiveIdx < forms.length) {
      try {
        valid = (await forms[tabActiveIdx]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  // Information form
  const makeBaseInfoRequest = (
    data: IFormatGenerationInformationForm | null
  ) => {
    if (!data) return {}

    const request: IFormatGenerationToCreate = {
      date: data.date as string,
      fic_id: Number(data.fund),
    }

    return cleanEmptyFields(request, true)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IFormatGenerationToCreate> = {
      ...makeBaseInfoRequest(information_form.value),
    }

    return apiRequestBody
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _createFormatGeneration(payload)

    if (success) {
      dataCreate.value = true
    }

    openMainLoader(false)
  }

  const handleDownloadTxt = async () => {
    if (!(await validateForms())) return
    openMainLoader(true)
    const payload = makeDataRequest()
    await _downloadTxt(payload)
    openMainLoader(false)
  }

  const handleDownloadExcel = async () => {
    if (!(await validateForms())) return
    openMainLoader(true)
    const payload = makeDataRequest()
    await _downloadExcel(payload)
    openMainLoader(false)
  }

  const key = {
    fics: ['funds'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(key)
    _clearData()
    dataCreate.value = false
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(key)
  })

  return {
    information_form,
    informationFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    dataCreate,
    data_to_create,
    goToURL,
    onSubmit,
    handleDownloadTxt,
    handleDownloadExcel,
  }
}

export default useFormatGenerationCreate
