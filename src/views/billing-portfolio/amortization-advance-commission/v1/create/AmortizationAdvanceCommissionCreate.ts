import { useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useAmortizationAdvanceCommissionStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const useAmortizationAdvanceCommissionCreate = () => {
  const { openMainLoader } = useMainLoader()
  const {
    _postAmortizationAdvanceCommission,
    _getByIdAmortizationAdvanceCommission,
  } = useAmortizationAdvanceCommissionStore('v1')

  const {
    amortization_advance_commission_response,
    data_information_form,
    amortization_advance_commission_list,
  } = storeToRefs(useAmortizationAdvanceCommissionStore('v1'))

  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id

  const formInformationRef = ref()

  const headerProps = {
    title: 'Crear Amortización Comisión Anticipo',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Facturación y cartera',
        route: '',
      },
      {
        label: 'Amortización de Comisión por Anticipo',
        route: 'AmortizationAdvanceCommissionList',
      },
      {
        label: 'Crear Amortización',
        route: 'AmortizationAdvanceCommissionCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
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

  const makeDataRequest = () => {
    const { amortized_value } = data_information_form.value ?? {}

    return {
      amortized_value: amortized_value ?? null,
    }
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [formInformationRef]

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
    const success = await _postAmortizationAdvanceCommission(searchId, payload)
    if (success) {
      router.push({ name: 'AmortizationAdvanceCommissionList' })
      amortization_advance_commission_list.value = []
    }
    openMainLoader(false)
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getByIdAmortizationAdvanceCommission(searchId)
    openMainLoader(false)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformationRef,
    amortization_advance_commission_response,
    onSubmit,
  }
}
export default useAmortizationAdvanceCommissionCreate
