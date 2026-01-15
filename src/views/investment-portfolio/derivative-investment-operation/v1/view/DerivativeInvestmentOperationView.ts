import { useGoToUrl, useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useDerivativeInvestmentOperationStore } from '@/stores/investment-portfolio/derivative-investment-operation'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export const useDerivativeInvestmentOperationView = () => {
  const route = useRoute()
  const { goToURL } = useGoToUrl()

  const derivativeInvestmentOperationId = +route.params.id

  const { openMainLoader } = useMainLoader()

  const { _getDerivativeInvestmentOperationById, _settlement } =
    useDerivativeInvestmentOperationStore('v1')

  const { data_information_view } = storeToRefs(
    useDerivativeInvestmentOperationStore('v1')
  )

  const alertModalRef = ref()

  const headerProps = ref({
    title: 'Ver liquidación de forward divisa USD / COP ',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
        route: '',
      },
      {
        label: 'Operaciones de inversión derivados',
        route: 'DerivativeInvestmentOperationsList',
      },
      {
        label: 'Ver',
        route: 'DerivativeInvestmentOperationsView',
      },
      {
        label: route.params.id.toString(),
      },
    ],
  })

  const tabs = ref<ITabs[]>([
    {
      name: 'InformationForm',
      label: 'Datos básicos',
      icon: useUtils().defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const openAlertModal = async () => {
    alertModalRef.value = true
  }

  const settlement = async () => {
    alertModalRef.value = false
    openMainLoader(true)
    if (data_information_view.value) {
      await _settlement(
        derivativeInvestmentOperationId,
        data_information_view.value
      )
    }
    openMainLoader(false)
    goToURL('DerivativeInvestmentOperationsList')
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getDerivativeInvestmentOperationById(derivativeInvestmentOperationId)

    openMainLoader(false)
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    alertModalRef,
    openAlertModal,
    settlement,
    goToURL,
  }
}
