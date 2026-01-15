import { useMainLoader } from '@/composables'
import { useBankTransferStore, useResourceManagerStore } from '@/stores'
import { onBeforeUnmount, onMounted } from 'vue'

const useBankTransferList = () => {
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _resetAllBankTransfer } = useBankTransferStore('v1')

  const { openMainLoader } = useMainLoader()

  const headerBreadcrumbs = {
    title: 'Traslados bancarios',
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
        route: '',
      },
    ],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _resetAllBankTransfer()
    await _getResources({ fics: ['offices'] })
    openMainLoader(false)
  })

  onBeforeUnmount(() => _resetKeys({ fics: ['offices'] }))

  return {
    headerBreadcrumbs,
  }
}

export default useBankTransferList
