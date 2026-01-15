import { useMainLoader, useRouteValidator, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useCheckTreasuryReceiptStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useCheckTreasuryReceiptView = () => {
  const route = useRoute()
  const router = useRouter()

  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const { data_information_form } = storeToRefs(useCheckTreasuryReceiptStore())
  const { _getByIdCheckTreasuryReceipts } = useCheckTreasuryReceiptStore()
  const checkTreasuryReceiptId = +route.params.id
  const tabs = ref<ITabs[]>([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: useUtils().defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])
  const activeTab = ref<string>(tabs.value[0].name)
  const headerProperties = ref<{
    title: string
    breadcrumbs: Array<{ label: string; route: string }>
  }>({
    title: 'Ver movimiento de tesorería',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Consulta movimiento de tesorería',
        route: 'CheckTreasuryReceiptList',
      },
      {
        label: 'Ver',
        route: 'CheckTreasuryReceiptView',
      },
      {
        label: checkTreasuryReceiptId.toString(),
        route: '',
      },
    ],
  })

  const tabActiveIdx = ref<number>(
    tabs.value.findIndex((tab) => tab.name === activeTab.value)
  )
  const tabActive = ref<string>(tabs.value[0].name)

  const handleGoToListAccountingVoucher = () => {
    router.push({
      name: 'AccountingReceiptView',
      params: {
        id: data_information_form.value?.general_information.voucher_id,
      },
    })
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getByIdCheckTreasuryReceipts(checkTreasuryReceiptId)
    openMainLoader(false)
  })

  return {
    tabs,
    activeTab,
    headerProperties,
    tabActiveIdx,
    tabActive,
    data_information_form,
    handleGoToListAccountingVoucher,
    validateRouter,
  }
}
