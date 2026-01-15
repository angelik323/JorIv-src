// vue - router - quasar - pinia
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/global/Tabs'

// composables - utils
import { useUtils } from '@/composables/useUtils'

// stores
import { useAccountingReceiptsStore } from '@/stores/accounting/accounting-receipt'

const useAccountingReceiptView = () => {
  const { defaultIconsLucide } = useUtils()
  const route = useRoute()
  const accountingReceiptId = ref(+route.params.id)
  const componentKey = ref(0)
  const accountingReceiptForm = ref()
  const { accounting_receipt } = storeToRefs(useAccountingReceiptsStore('v2'))

  const headerProps = computed(() => ({
    title: 'Ver comprobante contable',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Comprobantes contables',
        route: 'AccountingReceiptList',
      },
      {
        label: 'Ver',
        route: 'AccountingReceiptView',
      },
      {
        label: `${accountingReceiptId.value}`,
        route: 'AccountingReceiptView',
      },
    ],
  }))

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
    {
      name: 'view_logs',
      label: 'Novedades',
      icon: defaultIconsLucide.stretchHorizontal,
      outlined: true,
      disable: true,
      show: false,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const changeTab = (direction: 'next' | 'back') => {
    tabActiveIdx.value =
      direction === 'next' ? tabActiveIdx.value + 1 : tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  watch(accounting_receipt, () => {
    const status_accounting_receipt =
      accounting_receipt.value.authorization_status?.status
    if (
      status_accounting_receipt === 'Rechazado' ||
      status_accounting_receipt === 'Aprobado'
    ) {
      tabs.value[1].show = true
    }
  })

  watch(
    () => route.params.id,
    (newId) => {
      if (newId) {
        accountingReceiptId.value = +newId
        componentKey.value++
        tabs.value[1].show = false
        tabActiveIdx.value = 0
        tabActive.value = filteredTabs.value[tabActiveIdx.value].name
      }
    }
  )

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    accountingReceiptForm,
    accountingReceiptId,
    componentKey,
    defaultIconsLucide,
    changeTab,
  }
}

export default useAccountingReceiptView
