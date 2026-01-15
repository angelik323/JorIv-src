import { useAlert, useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useAmortizationTableStore, useResourceManagerStore } from '@/stores/'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAmortizationTitleTableCreate = () => {
  const { openMainLoader } = useMainLoader()
  const router = useRouter()
  const { data_information_form } = storeToRefs(useAmortizationTableStore('v1'))
  const { _createAmortizationTitle, _getAmortizationTableList } =
    useAmortizationTableStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { showAlert } = useAlert()
  const keys = ['interest_rate_payment_frequency']
  const headerProps = {
    title: 'Crear tabla de títulos amortizables',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: 'HomeView' },
      {
        label: 'Tablas de títulos amortizables',
        route: 'AmortizationTitleTableList',
      },
      {
        label: 'Crear',
        route: 'AmortizationTitleTableCreate',
      },
    ],
  }

  const tabs = reactive<ITabs[]>([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])
  const activeTab = ref(tabs[0].name)

  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )
  const makeDataRequest = () => {
    return {
      mnemonic: data_information_form.value?.mnemonic ?? null,
      payment_frequency: data_information_form.value?.payment_frequency ?? null,
      modality: data_information_form.value?.modality
        ? 'Anticipado'
        : 'Vencido',
      flow_type: data_information_form.value?.flow_type ?? 'Regular',
      issue_date: data_information_form.value?.issue_date ?? '',
      maturity_date: data_information_form.value?.maturity_date ?? '',
      details: Array.isArray(data_information_form.value?.details)
        ? data_information_form.value.details.map((detail) => ({
            id: detail?.id,
            date: detail?.date ?? '',
            percentage: detail?.percentage ?? 0,
            origin: detail?.origin ?? '',
          }))
        : [],
    }
  }

  const onSubmit = async () => {
    openMainLoader(true)
    const payload = makeDataRequest()
    const maturityDate = data_information_form.value?.maturity_date ?? null

    const totalPercentage = payload.details
      .map((d) => Number(d.percentage) || 0)
      .reduce((acc, curr) => acc + curr, 0)

    const roundedTotal = Math.round(totalPercentage * 100) / 100

    if (roundedTotal !== 100) {
      openMainLoader(false)
      showAlert(
        'La suma de los porcentajes debe ser exactamente 100%',
        'warning'
      )
      return
    }

    if (payload.details.length > 0) {
      const lastDetail = payload.details[payload.details.length - 1]
      if (lastDetail.date !== maturityDate) {
        openMainLoader(false)
        showAlert(
          'La última fecha agregada debe coincidir con la fecha de vencimiento',
          'warning'
        )
        return
      }
    }

    if (await _createAmortizationTitle(payload)) {
      router.push({ name: 'AmortizationTitleTableList' })
    }

    openMainLoader(false)
  }

  onMounted(async () => {
    await _getResources({
      investment_portfolio: keys,
    })
  })
  onUnmounted(async () => {
    await _getAmortizationTableList()
    _resetKeys({
      investment_portfolio: keys,
    })
  })

  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    onSubmit,
  }
}
