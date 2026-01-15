// Vue
import { ref, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { IPortfolioClassificationForm } from '@/interfaces/customs/settlement-commissions/PortfolioClassification'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { usePortfolioClassificationStore } from '@/stores/settlement-commissions/portfolio-classification'

const usePortfolioClassificationCreate = () => {
  const { _createPorfolioClassification, _clearData } =
    usePortfolioClassificationStore('v2')

  const { headerPropsDefault } = storeToRefs(
    usePortfolioClassificationStore('v2')
  )

  // Data de formularios
  const data_information_form = ref<IPortfolioClassificationForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()
  const { goToURL } = useGoToUrl()

  const headerProperties = {
    title: 'Crear calificación de cartera',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'PortfolioClassificationCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // Datos básicos form
  const makeBaseInfoRequest = (data: IPortfolioClassificationForm | null) => {
    if (!data) return {}

    const request: Partial<IPortfolioClassificationForm> = {
      type: data.type ?? null,
      days_start: Number(data.days_start ?? null),
      days_end: Number(data.days_end ?? null),
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IPortfolioClassificationForm> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [basicDataFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createPorfolioClassification(payload)
    if (success) {
      goToURL('PortfolioClassificationList')
    }
    openMainLoader(false)
  }

  onBeforeUnmount(async () => {
    _clearData()
  })

  return {
    data_information_form,
    basicDataFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,

    onSubmit,
    goToURL,
  }
}

export default usePortfolioClassificationCreate
