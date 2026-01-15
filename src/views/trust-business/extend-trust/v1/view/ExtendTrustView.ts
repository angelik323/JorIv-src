// vue - quasar - router
import { ref, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// utils
import { defaultIconsLucide } from '@/utils'

// composables
import { useMainLoader } from '@/composables'

// stores
import { useExtendTrustStore } from '@/stores/trust-business/extend-trust'

// interfaces
import { ITabs } from '@/interfaces/global'

const useExtendTrustView = () => {
  // imports
  const router = useRouter()
  const route = useRoute()

  const extendTrustId = +route.params.id

  const { openMainLoader } = useMainLoader()

  const { extend_trust_request } = storeToRefs(useExtendTrustStore('v1'))

  const { _getExtendById } = useExtendTrustStore('v1')

  const headerProps = {
    title: 'Ver prórroga fideicomiso',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios Fiduciarios',
      },
      {
        label: 'Prórroga fideicomiso',
        route: 'ExtendTrustList',
      },
      {
        label: 'Ver',
      },
      { label: `${extendTrustId}` },
    ],
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const formInformation = ref()

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getExtendById(extendTrustId)
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    extend_trust_request,
    formInformation,
    handlerGoTo,
  }
}

export default useExtendTrustView
