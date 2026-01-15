import { ref, onBeforeMount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useBillingTrustsStore } from '@/stores'

// Interfaces
import { IAccountingParametersForm } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

const useAccountingParametersCreate = () => {
  const route = useRoute()

  const { _createAccountingParameters, _getByIdBillingTrusts, _clearData } =
    useBillingTrustsStore('v1')

  // Data de formularios
  const data_information_form = ref<IAccountingParametersForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()
  const searchId = +route.params.id

  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()

  const headerProps = {
    title: 'Crear parámetros contables',
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
        label: 'Definición inicial fideicomiso para facturación',
        route: 'BillingTrustList',
      },
      {
        label: 'Crear',
        route: 'AccountingParametersCreate',
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

  // Datos básicos form
  const makeBaseInfoRequest = (data: IAccountingParametersForm | null) => {
    if (!data) return {}

    const request: Partial<IAccountingParametersForm> = {
      business_code: data.business_code ?? null,
      business_name: data.business_name ?? null,
      who_pays: data.who_pays ?? null,
      accounts: data.accounts ?? null,
      generates_iva: data.generates_iva ?? null,
      iva: data.iva ?? null,
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IAccountingParametersForm> = {
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

  const nextTab = async () => {
    if (!(await validateForms())) return
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createAccountingParameters(searchId, payload)
    if (success) {
      router.push({ name: 'BillingTrustList' })
    }
    openMainLoader(false)
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getByIdBillingTrusts(searchId)
    openMainLoader(false)
  })

  onBeforeMount(async () => {
    _clearData()
  })

  return {
    data_information_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    nextTab,
    backTab,
    onSubmit,
  }
}

export default useAccountingParametersCreate
