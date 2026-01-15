// Vue
import { ref, onBeforeMount, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IPortfolioClassificationForm,
  IPortfolioClassificationResponse,
} from '@/interfaces/customs/settlement-commissions/PortfolioClassification'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { usePortfolioClassificationStore } from '@/stores/settlement-commissions/portfolio-classification'

const usePortfolioClassificationEdit = () => {
  const {
    _updatePortfolioClassification,
    _getByIdPorfolioClassification,
    _clearData,
  } = usePortfolioClassificationStore('v2')
  const { headerPropsDefault, portfolio_classifications_response } =
    storeToRefs(usePortfolioClassificationStore('v2'))

  // Data de formularios
  const data_information_form = ref<IPortfolioClassificationForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields, defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const headerProperties = {
    title: 'Editar calificación de cartera',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
        route: 'PortfolioClassificationEdit',
      },
      {
        label: `${searchId}`,
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

  const setFormEdit = (data: IPortfolioClassificationResponse) => {
    data_information_form.value = {
      type: data.type,
      days_start: data.days_start,
      days_end: data.days_end,
    }
  }

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
    const success = await _updatePortfolioClassification(payload, searchId)
    if (success) {
      goToURL('PortfolioClassificationList')
    }
    openMainLoader(false)
  }

  const isFormValid = computed(() => {
    if (!data_information_form.value) return false

    const data = data_information_form.value

    return !!(
      data.type &&
      data.days_start != null &&
      data.days_end != null &&
      Number(data.days_start) >= 0 &&
      Number(data.days_end) >= 0 &&
      Number(data.days_start) <= Number(data.days_end) &&
      Number(data.days_end) < 10000
    )
  })

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdPorfolioClassification(searchId)
    openMainLoader(false)
  })

  watch(
    () => portfolio_classifications_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

  return {
    data_information_form,
    basicDataFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    isFormValid,

    onSubmit,
    goToURL,
  }
}

export default usePortfolioClassificationEdit
