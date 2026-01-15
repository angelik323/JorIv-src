import { useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useAmortizationAdvanceCommissionStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const useAmortizationAdvanceCommissionView = () => {
  const { openMainLoader } = useMainLoader()
  const { _getByIdAmortizationAdvanceCommission } =
    useAmortizationAdvanceCommissionStore('v1')

  const {
    amortization_advance_commission_response,
    amortization_advance_commission_list,
  } = storeToRefs(useAmortizationAdvanceCommissionStore('v1'))

  const route = useRoute()

  const searchId = +route.params.id

  // Referencias a formularios
  const formInformationRef = ref()

  const headerProps = {
    title: 'Ver Amortización Comisión Anticipo',
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
        label: 'Ver Amortización',
        route: 'AmortizationAdvanceCommissionView',
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

  const update = async () => {
    await _getByIdAmortizationAdvanceCommission(searchId)
  }

  onUnmounted(() => {
    openMainLoader(true)
    amortization_advance_commission_list.value = []
    openMainLoader(false)
  })

  onMounted(async () => {
    openMainLoader(true)
    await update()
    openMainLoader(false)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformationRef,
    amortization_advance_commission_response,
    update,
  }
}
export default useAmortizationAdvanceCommissionView
