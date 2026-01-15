import { useMainLoader, useUtils } from '@/composables'
import { IBillingAndPortfolioClousureInformationForm } from '@/interfaces/customs/billing-portfolio/BillingAndPortfolioClousure'
import { ITabs } from '@/interfaces/global'
import { useBillingPortfolioClosureStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const useBillingAndPortfolioClosureConfirm = () => {
  const {
    billing_portfolio_clouser_response,
    billing_portfolio_clouser_validated_response,
    billing_portfolio_clouser_list,
  } = storeToRefs(useBillingPortfolioClosureStore('v1'))
  const { _getByIdBillingPortfolioClosure, _postBillingPortfolioClosure } =
    useBillingPortfolioClosureStore('v1')

  const { _clearData } = useBillingPortfolioClosureStore('v1')

  const formInformationRef = ref()
  const route = useRoute()
  const router = useRouter()

  const { openMainLoader } = useMainLoader()

  const searchId = +route.params.id

  const headerProps = {
    title: 'Confirmar cierre de facturación y cartera',
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
        label: 'Confirmar',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: useUtils().defaultIconsLucide.bulletList,
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

  onBeforeMount(() => {
    _clearData()
  })

  onMounted(async () => {
    openMainLoader(true)
    await _getByIdBillingPortfolioClosure(searchId)
    openMainLoader(false)
  })
  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    alertModalRef,
    basic_data_form,
    alertModalConfig,
    formInformationRef,
    billing_portfolio_clouser_response,
    billing_portfolio_clouser_validated_response,

    onSubmit,
    confirmBillingAndPortfolioClosure,
  }
}

export default useBillingAndPortfolioClosureConfirm
