import { onBeforeMount, ref } from 'vue'
import { ITabs } from '@/interfaces/global'
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'
import { useClientsStore } from '@/stores/clients'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

const useTrustorEntity = () => {
  const { openMainLoader } = useMainLoader()
  const { _getByIdTrustorClient } = useClientsStore('v1')
  const { trustor_client_request } = storeToRefs(useClientsStore('v1'))
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  const route = useRoute()

  const trustorClientId = +route.params.id

  const headerProps = {
    title: 'Ver persona fideicomiso',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Clientes', route: '' },
      { label: 'Vinculación de clientes', route: 'ClientsList' },
      { label: 'Ver persona fideicomiso', route: 'TrustorPersonView' },
      { label: `${trustorClientId}` },
    ],
    showBackBtn: true,
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Información básica',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const formInformation = ref()

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    openMainLoader(true)
    goToURL('ClientsList')

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdTrustorClient(trustorClientId)
    openMainLoader(false)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    trustor_client_request,
    goToURL,
    onSubmit,
    nextTab,
    backTab,
  }
}

export default useTrustorEntity
