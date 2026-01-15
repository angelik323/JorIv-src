// vue - router - quasar - pinia
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

// interfaces
import { ITabs } from '@/interfaces/global'

// composables - utils
import { defaultIcons } from '@/utils'

const useAccountingReceiptView = () => {
  const route = useRoute()
  const accountingReceiptId = +route.params.id
  const accountingReceiptForm = ref()

  const headerProps = {
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
      icon: defaultIcons.bulletList,
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

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    accountingReceiptForm,
    accountingReceiptId,
  }
}

export default useAccountingReceiptView
