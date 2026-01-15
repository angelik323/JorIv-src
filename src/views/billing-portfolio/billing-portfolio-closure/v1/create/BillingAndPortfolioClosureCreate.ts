import { ITabs } from '@/interfaces/global'
import { onBeforeMount, ref } from 'vue'
import { useMainLoader, useUtils } from '@/composables'
import { useBillingPortfolioClosureStore } from '@/stores'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { IBillingAndPortfolioClousureInformationForm } from '@/interfaces/customs'

const useBillingAndPortfolioClousereCreate = () => {
  const { _postBillingPortfolioClosure } = useBillingPortfolioClosureStore('v1')
  const { billing_portfolio_clouser_list } = storeToRefs(
    useBillingPortfolioClosureStore('v1')
  )
  const { billing_portfolio_clouser_validated_response } = storeToRefs(
    useBillingPortfolioClosureStore('v1')
  )

  const { _clearData } = useBillingPortfolioClosureStore('v1')

  const router = useRouter()
  const formInformationRef = ref()
  const { defaultIconsLucide } = useUtils()

  const { openMainLoader } = useMainLoader()

  const headerProps = {
    title: 'Cierre de facturación y cartera',
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
        label: 'Cierre de facturación y cartera',
        route: 'BillingAndPortfolioClosureList',
      },
      {
        label: 'Crear',
        route: 'BillingAndPortfolioClosureCreate',
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

  // Data de formularios
  const basic_data_form =
    ref<IBillingAndPortfolioClousureInformationForm | null>(null)
  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

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

  // Basic data form
  const makeBaseInfoRequest = (
    data: IBillingAndPortfolioClousureInformationForm | null
  ) => {
    if (!data) return {}
    return {
      closing_period: data.period,
      observations: data.observations,
      validate_pending_requirements: data.validate_requirements_checked,
      comments: data.validations,
      confirm_period_valid: data.confirmed_validated,
    }
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IBillingAndPortfolioClousureInformationForm> =
      {
        ...makeBaseInfoRequest(basic_data_form.value),
      }

    return apiRequestBody
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    await alertModalRef.value.closeModal()
    const payload = makeDataRequest()
    const id = billing_portfolio_clouser_validated_response.value.id
    const success = await _postBillingPortfolioClosure(id, payload)
    if (success) {
      router.push({ name: 'BillingAndPortfolioClosureList' })
      billing_portfolio_clouser_list.value = []
    }
    openMainLoader(false)
  }

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    get description() {
      const period = useUtils().formatDate(
        billing_portfolio_clouser_validated_response.value?.period ?? '',
        'YYYY-MM'
      )
      const closingDate = useUtils().formatDate(
        billing_portfolio_clouser_validated_response.value?.closing_date ?? '',
        'YYYY-MM-DD'
      )
      return `¿Deseas realizar el cierre del periodo ${period}? Fecha de cierre: ${closingDate}`
    },
  })

  const confirmBillingAndPortfolioClosure = async () => {
    await alertModalRef.value.openModal()
  }

  onBeforeMount(() => {
    _clearData()
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformationRef,
    basic_data_form,
    billing_portfolio_clouser_validated_response,
    alertModalConfig,
    alertModalRef,
    onSubmit,
    confirmBillingAndPortfolioClosure,
  }
}

export default useBillingAndPortfolioClousereCreate
