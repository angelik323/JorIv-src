import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'
import { useInterestRatesStore } from '@/stores'
import { IInterestRateFormModel, IInterestRate } from '@/interfaces/customs'

const useInterestRatesCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _createInterestRate } = useInterestRatesStore('v1')

  const interestRatesForm = ref()

  const headerProps = {
    title: 'Crear tasa de interés',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      { label: 'Tasa de interés', route: 'InterestRatesList' },
      { label: 'Crear', route: 'InterestRatesCreate' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const models = ref<IInterestRateFormModel>({
    code: '',
    interest_rate_description: '',
    mode: '',
    mode_code: '',
    payment_frequency: '',
    payment_frequency_code: '',
    number_months: 0,
    date: '',
    rate_value: '',
  })

  const alertModalRef = ref()

  const validateForms = async () => interestRatesForm.value?.validate?.()

  const handleFormUpdate = () => {
    if (interestRatesForm.value?.getFormData) {
      models.value = interestRatesForm.value.getFormData()
    }
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      handleFormUpdate()

      const payload: IInterestRate = {
        code: models.value.code,
        interest_rate_description:
          models.value.interest_rate_description?.trim() ?? '',
        mode: models.value.mode,
        payment_frequency: models.value.payment_frequency,
        date: models.value.date,
        number_months: models.value.number_months,
        rate_value: Number(models.value.rate_value),
      }

      if (await _createInterestRate(payload)) {
        router.push({ name: 'InterestRateList' })
      }

      setTimeout(() => openMainLoader(false), 1000)
    }
  }

  const isFormValid = computed(() => interestRatesForm.value?.isValid ?? false)

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    models,
    alertModalRef,
    interestRatesForm,
    isFormValid,
    onSubmit,
    handleFormUpdate,
  }
}

export default useInterestRatesCreate
