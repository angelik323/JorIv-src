import { onBeforeMount, ref } from 'vue'
import { defaultIconsLucide } from '@/utils'
import type { ITabs } from '@/interfaces/global'
import { useMainLoader } from '@/composables'
import { usePriceProviderFileStore } from '@/stores'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

export const usePriceProviderFileView = () => {
  const route = useRoute()
  const { openMainLoader } = useMainLoader()
  const { _getByIdPriceProviderFile, _clearData } =
    usePriceProviderFileStore('v1')
  const { information_receipt_request } = storeToRefs(
    usePriceProviderFileStore('v1')
  )

  const priceProviderFileId = +route.params.id

  const headerProps = {
    title: 'Ver archivo proveedor precios',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      {
        label: 'Definición archivos de proveedor de precios',
        route: 'PriceProviderFile',
      },
      { label: 'Ver', route: 'PriceProviderFileView' },
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
    _clearData()
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
