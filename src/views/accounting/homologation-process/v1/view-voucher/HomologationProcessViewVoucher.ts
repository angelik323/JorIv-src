import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { defaultIconsLucide } from '@/utils'

import { ITabs } from '@/interfaces/global'
import { useGoToUrl } from '@/composables'

const useHomologationProcessViewVoucher = () => {
  const route = useRoute()

  const { goToURL } = useGoToUrl()

  const processId = +route.params.id
  const voucherId = +route.params.voucherId

  const headerProps = {
    title: 'Ver comprobante ',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Proceso de homologación', route: 'HomologationProcessList' },
      { label: 'Ver' },
      { label: `${processId}` },
    ],
    showBackBtn: true,
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

export default useHomologationProcessViewVoucher
