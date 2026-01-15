// vur
import { computed, ref, watch } from 'vue'

// store
import { useBankTransferStore } from '@/stores'

// composables
import { useGoToUrl } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { ITabs } from '@/interfaces/global'
import { storeToRefs } from 'pinia'

const useBankTransferCreate = () => {
  const { currentBankTransferTab } = storeToRefs(useBankTransferStore('v1'))

  const { goToURL } = useGoToUrl()
  const headerBreadcrumbs = {
    title: 'Crear traslado bancario',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Traslados bancarios',
        route: 'BankTransferList',
      },
      {
        label: 'Crear',
        route: '',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'origin-data',
      label: 'Datos de origen',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'destiny-data',
      label: 'Datos de destino',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'show-data',
      label: 'Ver datos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const getCurrentBankTransferTab = computed(() => currentBankTransferTab.value)

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  watch(
    getCurrentBankTransferTab,
    (newTab) => {
      tabActive.value = newTab
    },
    {
      deep: true,
    }
  )

  return {
    headerBreadcrumbs,
    goToURL,
    tabActive,
    filteredTabs,
    tabActiveIdx,
  }
}

export default useBankTransferCreate
