import { ref, onBeforeMount, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore, useThirdPartyBillingStore } from '@/stores'

// Interfaces
import {
  IThirdPartyBillingForm,
  IThirdPartyBillingResponse,
} from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

const useThirdPartyBillingEdit = () => {
  const { _updateThirdPartyBilling, _getByIdThirdPartyBilling, _clearData } =
    useThirdPartyBillingStore('v1')
  const { third_party_billing_response } = storeToRefs(
    useThirdPartyBillingStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    assets: ['countries', 'departments', 'cities'],
    trust_business: ['third_parties'],
  }

  // Data de formularios
  const data_information_form = ref<IThirdPartyBillingForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()

  const headerProps = {
    title: 'Editar terceros de facturación',
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
        label: 'Editar',
        route: 'ThirdPartyBillingEdit',
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

  const setFormEdit = (data: IThirdPartyBillingResponse) => {
    data_information_form.value = {
      third_party_id: data.third_party_id,
      created_date: data.created_date,
      addresses: data.address,
      emails: data.email,
      phones: data.phones,
    }
  }

  // Datos básicos form
  const makeBaseInfoRequest = (data: IThirdPartyBillingForm | null) => {
    if (!data) return {}

    const request: Partial<IThirdPartyBillingForm> = {
      third_party_id: data.third_party_id,
      created_date: data.created_date,
      addresses: data.addresses,
      emails: data.emails,
      phones: data.addresses.map((e) => ({
        id: null,
        phone_number: e.phone,
        is_main: false,
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
    const success = await _updateThirdPartyBilling(payload, searchId)
    if (success) {
      router.push({ name: 'ThirdPartyBillingList' })
    }
    openMainLoader(false)
  }

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdThirdPartyBilling(searchId)
    await _getResources(keys)
    openMainLoader(false)
  })

  watch(
    () => third_party_billing_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    third_party_billing_response,
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

export default useThirdPartyBillingEdit
