import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'

import { defaultIconsLucide } from '@/utils'

import { ITabs } from '@/interfaces/global'

const useAccountingReceiptView = () => {
  const route = useRoute()
  const router = useRouter()
  const accountingReceiptId = +route.params.id
  const accountingReceiptForm = ref()

  const headerProps = {
    title: 'Ver comprobante contable',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: '',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Comprobantes contables',
        route: '',
      },
      {
        label: 'Ver',
        route: '',
      },
      {
        label: `${accountingReceiptId}`,
        route: '',
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

  const goToList = () => {
    router.push({ name: 'AccountingReceiptList' })
  }

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    accountingReceiptForm,
    accountingReceiptId,
    goToList,
  }
}

export default useAccountingReceiptView
