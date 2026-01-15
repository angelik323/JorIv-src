// vue - quasar - router
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount, onUnmounted, ref } from 'vue'
// pinia
import { storeToRefs } from 'pinia'

// store
import { usePolicyStore } from '@/stores/trust-business/policy'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { ITabs } from '@/interfaces/global'

const usePolicyView = () => {
  // router
  const router = useRouter()
  const route = useRoute()
  const policyId = +route.params.id

  // imports
  const { openMainLoader } = useMainLoader()
  const { policy_request } = storeToRefs(usePolicyStore('v1'))

  const { _getByIdPolicy, _setDataInformationForm } = usePolicyStore('v1')

  const headerProps = {
    title: 'Ver póliza',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Pólizas',
        route: 'PolicyView',
      },
      {
        label: 'Ver',
      },
      {
        label: `${policyId}`,
      },
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
    {
      name: 'auth',
      label: 'Autorizar*',
      icon: defaultIconsLucide.circleCheckBig,
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

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdPolicy(policyId)
    openMainLoader(false)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  const onSubmit = async () => {
    openMainLoader(true)

    const fromData = route.query.from

    if (typeof fromData === 'string') {
      const parsed = JSON.parse(fromData)
      router.push(parsed)
    } else {
      router.push({ name: 'PolicyList' })
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    policy_request,

    onSubmit,
    handlerGoTo,
    backTab,
    nextTab,
  }
}

export default usePolicyView
