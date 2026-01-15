import { ref, reactive, onBeforeMount, onUnmounted, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useAmortizationTableStore, useResourceManagerStore } from '@/stores/'
import { defaultIconsLucide } from '@/utils'

export const useAmortizationTitleTableEdit = () => {
  const { openMainLoader } = useMainLoader()
  const router = useRouter()
  const route = useRoute()
  const idReference = +route.params.id
  const formInformation = ref()
  const { data_information_form } = storeToRefs(useAmortizationTableStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const keys = ['isin_code_mnemonics', 'interest_rate_payment_frequency']

  const {
    _updateAmortizationTitle,
    _getAmortizationTableList,
    _setDataInformationForm,
    _getAmortizationTableById,
  } = useAmortizationTableStore('v1')
  const headerProps = {
    title: 'Editar tabla de títulos amortizables',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      {
        label: 'Tablas de títulos amortizables',
        route: 'AmortizationTitleTableList',
      },
      {
        label: 'Editar',
        route: 'AmortizationTitleTableEdit',
      },
      {
        label: String(route.query.nemotecnico),
        route: '',
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
      issue_date: data_information_form.value?.issue_date ?? null,
      maturity_date: data_information_form.value?.maturity_date ?? null,
      modality: data_information_form.value?.modality
        ? 'Anticipado'
        : 'Vencido',
      flow_type: data_information_form.value?.flow_type ?? 'Regular',
      details: Array.isArray(data_information_form.value?.details)
        ? data_information_form.value.details.map((detail) => ({
            date: detail?.date ?? null,
            percentage: detail?.percentage ?? null,
            origin: detail?.origin ?? null,
          }))
        : [],
    }
  }

  const onSubmit = async () => {
    openMainLoader(true)
    const payload = makeDataRequest()
    if (await _updateAmortizationTitle(idReference, payload)) {
      router.push({
        name: 'AmortizationTitleTableList',
      })
      openMainLoader(false)
    } else {
      openMainLoader(false)
    }
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getAmortizationTableById(idReference)
    openMainLoader(false)
  })

  onMounted(async () => {
    await _getResources({
      investment_portfolio: keys,
    })
  })

  onUnmounted(async () => {
    await _getAmortizationTableList()
    _setDataInformationForm(null)
    _resetKeys({
      investment_portfolio: keys,
    })
  })

  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    data_information_form,
    formInformation,
    onSubmit,
  }
}
