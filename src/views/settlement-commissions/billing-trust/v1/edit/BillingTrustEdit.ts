import { ref, onBeforeMount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useBillingTrustsStore } from '@/stores'

// Interfaces
import { IBillingTrustForm, IBillingTrustResponse } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

const useBillingTrustEdit = () => {
  const { _updateBillingTrusts, _getByIdBillingTrusts, _clearData } =
    useBillingTrustsStore('v1')
  const { billing_trusts_response } = storeToRefs(useBillingTrustsStore('v1'))

  // Data de formularios
  const data_information_form = ref<IBillingTrustForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()

  const headerProps = {
    title: 'Editar periodo de facturación',
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
        label: 'Editar',
        route: 'BillingTrustEdit',
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

  const setFormEdit = (data: IBillingTrustResponse) => {
    data_information_form.value = {
      business_code: data.business_code_snapshot,
      business_name: data.business_name_snapshot,
      start_date: data.start_date,
      end_date: data.end_date,
      periodicity: data.periodicity,
      other: data.other,
    }
  }

  // Datos básicos form
  const makeBaseInfoRequest = (data: IBillingTrustForm | null) => {
    if (!data) return {}

    const request: Partial<IBillingTrustForm> = {
      business_code: data.business_code ?? null,
      business_name: data.business_name ?? null,
      start_date: data.start_date ?? null,
      end_date: data.end_date ?? null,
      periodicity: data.periodicity ?? null,
      other: data.other ?? null,
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IBillingTrustForm> = {
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
    const success = await _updateBillingTrusts(payload, searchId)
    if (success) {
      router.push({ name: 'BillingTrustList' })
    }
    openMainLoader(false)
  }

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdBillingTrusts(searchId)
    openMainLoader(false)
  })

  watch(
    () => billing_trusts_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

  return {
    billing_trusts_response,
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

export default useBillingTrustEdit
