// vue - quasar - pinia
import { ref, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// composables
import { useMainLoader } from '@/composables'

// stores
import { useTrustBusinessMovementCodesStore } from '@/stores/trust-business/movement-codes'

// intertaces
import { ITabs } from '@/interfaces/global'

// utils
import { defaultIconsLucide } from '@/utils'

const useTrustBusinessMovementCodeView = () => {
  const router = useRouter()
  const route = useRoute()

  const trustBusinessMovementCodeId = +route.params.id

  const { openMainLoader } = useMainLoader()

  const { business_trust_movement_codes_request } = storeToRefs(
    useTrustBusinessMovementCodesStore('v1')
  )

  const { _getTrustBusinessResourcesById } =
    useTrustBusinessMovementCodesStore('v1')

  const headerProps = {
    title: 'Ver código de movimiento de negocios',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios Fiduciarios',
      },
      {
        label: 'Código de movimiento de negocio',
        route: 'TrustBusinessMovementCodesList',
      },
      {
        label: 'Ver',
        route: 'TrustBusinessMovementCodesView',
      },
      { label: `${trustBusinessMovementCodeId}` },
    ],
  }

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

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const onSubmit = async () => {
    openMainLoader(true)

    router.push({ name: 'TrustBusinessMovementCodesList' })

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getTrustBusinessResourcesById(trustBusinessMovementCodeId)
    openMainLoader(false)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    business_trust_movement_codes_request,
    handlerGoTo,
    onSubmit,
  }
}

export default useTrustBusinessMovementCodeView
