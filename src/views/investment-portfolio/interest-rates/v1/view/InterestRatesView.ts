import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ITabs } from '@/interfaces/global'
import { defaultIconsLucide } from '@/utils'
import { useInterestRatesStore } from '@/stores'
import {
  IInterestRateViewModel,
  IInterestRateResponse,
} from '@/interfaces/customs'

const useInterestRatesView = () => {
  const route = useRoute()
  const interestRateId = Number(route.params.id)

  const { _getInterestRate } = useInterestRatesStore('v1')
  const interestRateRaw = ref<IInterestRateResponse | null>(null)

  const interestRate = computed<IInterestRateViewModel>(() => {
    if (!interestRateRaw.value) return {} as IInterestRateViewModel

    const item = interestRateRaw.value

    return {
      id: item.id ?? undefined,
      interest_rate_code: item.interest_rate_code ?? '',
      mode_code: item.mode_code ?? '',
      payment_frequency_code: item.payment_frequency_code ?? '',
      code: item.code ?? '',
      interest_rate_description: item.interest_rate_description ?? '',
      mode: item.mode ?? '',
      payment_frequency: item.payment_frequency ?? '',
      periodicity_description: item.periodicity_description ?? '',
      modality_description: item.modality_description ?? '',
      date: item.date ?? '',
      rate_value: item.rate_value ?? '',
      number_months: Number(item.number_months ?? 0),
      created_at: item.history_interest_rate?.created_at ?? '',
      updated_at: item.history_interest_rate?.updated_at ?? '',
      creator_data: item.history_interest_rate?.creator_data ?? '',
      update_data: item.history_interest_rate?.update_data ?? '',
    }
  })

  const headerProps = {
    title: 'Ver tasa de interés',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      { label: 'Tasas de interés', route: '' },
      { label: 'Ver', route: '' },
      {
        label: `${interestRateId}`,
        route: 'InterestRateView',
        params: { id: interestRateId },
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])
  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  onMounted(async () => {
    const response = await _getInterestRate(interestRateId)
    interestRateRaw.value = response ?? null
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    interestRate,
  }
}

export default useInterestRatesView
