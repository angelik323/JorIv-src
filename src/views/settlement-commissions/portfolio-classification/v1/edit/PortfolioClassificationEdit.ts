import { ref, onBeforeMount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { usePortfolioClassificationStore } from '@/stores'

// Interfaces
import {
  IPortfolioClassificationForm,
  IPortfolioClassificationResponse,
} from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

const usePortfolioClassificationEdit = () => {
  const {
    _updatePortfolioClassification,
    _getByIdPorfolioClassification,
    _clearData,
  } = usePortfolioClassificationStore('v1')
  const { portfolio_classifications_response } = storeToRefs(
    usePortfolioClassificationStore('v1')
  )

  // Data de formularios
  const data_information_form = ref<IPortfolioClassificationForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()

  const headerProps = {
    title: 'Editar calificación de cartera',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
        route: '',
      },
      {
        label: 'Calificación de cartera',
        route: 'PortfolioClassificationList',
      },
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
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
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
      days_start: data.days_start ?? null,
      days_end: data.days_end ?? null,
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
      router.push({ name: 'PortfolioClassificationList' })
    }
    openMainLoader(false)
  }

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
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    onSubmit,
  }
}

export default usePortfolioClassificationEdit
