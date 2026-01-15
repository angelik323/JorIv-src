// Vue - Vue Router - Pinia
import { useRoute } from 'vue-router'
import { onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useMovementCodesStore } from '@/stores/fics/movement-codes'

const useTrustBusinessesRead = () => {
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { openMainLoader } = useMainLoader()

  const { _getByIdMovementCodes, _clearData } = useMovementCodesStore('v1')

  const { movement_codes_response } = storeToRefs(useMovementCodesStore('v1'))

  const searchId = +route.params.id

  const headerProps = {
    title: 'Ver código de movimiento',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Códigos de Movimiento',
        route: 'MovementCodesList',
      },
      {
        label: 'Ver',
        route: 'MovementCodesRead',
      },
      {
        label: searchId.toString(),
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const onSubmit = async () =>
    goToURL('MovementCodesList', undefined, { reload: true })

  onBeforeMount(async () => {
    _clearData()

    openMainLoader(true)

    await _getByIdMovementCodes(searchId)

    openMainLoader(false)
  })

  return {
    tabs,
    goToURL,
    onSubmit,
    tabActive,
    headerProps,
    tabActiveIdx,
    movement_codes_response,
  }
}

export default useTrustBusinessesRead
