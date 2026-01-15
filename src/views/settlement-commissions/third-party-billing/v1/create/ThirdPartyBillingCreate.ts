import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore, useThirdPartyBillingStore } from '@/stores'

// Interfaces
import { IThirdPartyBillingForm } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

const useThirdPartyBillingCreate = () => {
  const { _createThirdPartyBilling, _clearData } =
    useThirdPartyBillingStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // Data de formularios
  const data_information_form = ref<IThirdPartyBillingForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()

  const keys = {
    assets: ['countries', 'departments', 'cities'],
    trust_business: ['third_parties'],
  }

  const headerProps = {
    title: 'Vincular terceros de facturación',
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
        label: 'Definir terceros de facturación',
        route: 'ThirdPartyBillingList',
      },
      {
        label: 'Vincular',
        route: 'ThirdPartyBillingCreate',
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
  const makeBaseInfoRequest = (data: IThirdPartyBillingForm | null) => {
    if (!data) return {}

    const request: Partial<IThirdPartyBillingForm> = {
      third_party_id: data.third_party_id,
      created_date: data.created_date,
      emails: data.emails,
      addresses: data.addresses,
      phones: data.addresses.map((e) => ({
        id: null,
        is_main: false,
        phone_number: e.phone,
        phone_type: 'mobile',
      })),
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IThirdPartyBillingForm> = {
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
    const success = await _createThirdPartyBilling(payload)
    if (success) {
      router.push({ name: 'ThirdPartyBillingList' })
    }
    openMainLoader(false)
  }

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
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

export default useThirdPartyBillingCreate
