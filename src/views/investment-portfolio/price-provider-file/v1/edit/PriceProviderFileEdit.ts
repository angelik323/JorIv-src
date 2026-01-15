// Vue
import { onBeforeMount, ref } from 'vue'

// Composables & utils
import { defaultIconsLucide } from '@/utils'
import { useMainLoader } from '@/composables'

// Interfaces
import type { ITabs } from '@/interfaces/global'

// Stores
import { usePriceProviderFileStore } from '@/stores'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

export const usePriceProviderFileEdit = () => {
  const route = useRoute()
  const { openMainLoader } = useMainLoader()
  const { _getByIdPriceProviderFile } = usePriceProviderFileStore('v1')

  const { information_receipt_request } = storeToRefs(
    usePriceProviderFileStore('v1')
  )

  const priceProviderFileId = +route.params.id

  const headerProps = {
    title: 'Editar archivo proveedor de precios',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      {
        label: 'Definición archivos de proveedor de precios',
        route: 'PriceProviderFile',
      },
      { label: 'Editar', route: 'PriceProviderFileEdit' },
      {
        label: priceProviderFileId.toString(),
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const activeTab = ref<string>(tabs.value[0].name)
  const activeTabIdx = ref<number>(0)

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdPriceProviderFile(priceProviderFileId)
    openMainLoader(false)
  })

  return {
    headerProps,
    tabs,
    activeTab,
    activeTabIdx,
    information_receipt_request,
  }
}
