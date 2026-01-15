import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { defaultIconsLucide } from '@/utils'

import { ITabs } from '@/interfaces/global'

import { useHomologationProcessStore } from '@/stores'
import { useGoToUrl } from '@/composables'

const useHomologationProcessVoucherLogs = () => {
  const route = useRoute()

  const { goToURL } = useGoToUrl()

  const processId = +route.params.id
  const voucherId = +route.params.voucherId

  const { _getVoucherLogs } = useHomologationProcessStore('v1')

  const headerProps = {
    title: 'Ver comprobante ',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Proceso de homologación', route: 'HomologationProcessList' },
      { label: 'Ver' },
      { label: `${processId}` },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  onMounted(async () => {
    await _getVoucherLogs(processId, voucherId)
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    voucherId,
    processId,
    goToURL,
  }
}

export default useHomologationProcessVoucherLogs
