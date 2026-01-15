import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainLoader } from '@/composables'
import { storeToRefs } from 'pinia'
import { defaultIconsLucide } from '@/utils'
import { IInterestRateModel, IInterestRate } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import { useInterestRatesStore, useResourceStore } from '@/stores'

const useInterestRatesEdit = () => {
  const route = useRoute()
  const router = useRouter()

  const interestRateSForm = ref()
  const { openMainLoader } = useMainLoader()
  const { _getInterestRate, _updateInterestRate } = useInterestRatesStore('v1')
  const interestRateId = Number(route.params.id)

  const {
    interest_rate_payment_code_options,
    interest_rate_mode_code_options,
  } = storeToRefs(useResourceStore('v1'))

  const headerProps = {
    title: 'Editar tasa de interés',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      { label: 'Tasas de interés', route: 'InterestRatesList' },
      {
        label: 'Editar',
        route: 'InterestRatesEdit',
        params: { id: interestRateId },
      },
    ],
    showBackBtn: true,
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

  const model = ref<IInterestRateModel>({
    id: undefined,
    interest_rate_code: '',
    mode_code: '',
    payment_frequency_code: '',
    code: '',
    mode: '',
    payment_frequency: '',
    interest_rate_description: '',
    periodicity_description: '',
    modality_description: '',
    date: '',
    rate_value: '',
    number_months: 0,
  })

  const findCodeFromLabel = (
    label: string,
    options: { label: string; value: string }[]
  ): string => {
    return (
      options.find((opt) => opt.label.toLowerCase() === label?.toLowerCase())
        ?.value ?? ''
    )
  }

  const loadInterestRate = async () => {
    openMainLoader(true)

    const data = await _getInterestRate(interestRateId)

    if (data) {
      const mode_code = findCodeFromLabel(
        data.mode,
        interest_rate_mode_code_options.value as {
          label: string
          value: string
        }[]
      )

      const payment_frequency_code = findCodeFromLabel(
        data.payment_frequency,
        interest_rate_payment_code_options.value as {
          label: string
          value: string
        }[]
      )

      model.value = {
        id: data.id ?? undefined,
        interest_rate_code: '',
        mode_code,
        payment_frequency_code,
        code: data.code ?? '',
        interest_rate_description: data.interest_rate_description ?? '',
        mode: data.mode ?? '',
        payment_frequency: data.payment_frequency ?? '',
        number_months: Number(data.number_months ?? 0),
        date: data.date ?? '',
        rate_value: String(data.rate_value ?? ''),
        periodicity_description: data.periodicity_description ?? '',
        modality_description: data.modality_description ?? '',
      }
    }

    openMainLoader(false)
  }

  onMounted(async () => {
    await loadInterestRate()
  })

  const handleFormUpdate = () => {
    if (
      interestRateSForm.value &&
      typeof interestRateSForm.value.getFormData === 'function'
    ) {
      const formData = interestRateSForm.value.getFormData()
      model.value = { ...formData }
    }
  }

  const onUpdate = async () => {
    handleFormUpdate()

    const isFormValid = await interestRateSForm.value?.validate?.()
    if (!isFormValid) return

    const payloadToSend: IInterestRate = {
      code: model.value.code,
      interest_rate_description: model.value.interest_rate_description,
      mode: model.value.mode,
      mode_code: model.value.mode_code,
      payment_frequency: model.value.payment_frequency,
      payment_frequency_code: model.value.payment_frequency_code,
      number_months: model.value.number_months,
      date: model.value.date,
      rate_value: model.value.rate_value,
    }

    const success = await _updateInterestRate(interestRateId, payloadToSend)
    if (success) {
      router.push({ name: 'InterestRateList' })
    }
  }

  return {
    headerProps,
    model,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    interestRateSForm,
    handleFormUpdate,
    onUpdate,
  }
}

export default useInterestRatesEdit
