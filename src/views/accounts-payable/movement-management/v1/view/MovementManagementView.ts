// core
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// interfaces
import { ITabs } from '@/interfaces/global'
import { IMovementManagementForm } from '@/interfaces/customs/accounts-payable/MovementManagement'

// stores
import { useMovementManagementStore } from '@/stores/accounts-payable/movement-management'

const useMovementManagementView = () => {
  // hooks
  const route = useRoute()
  const movementId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  // stores
  const { _getMovementById } = useMovementManagementStore('v1')

  // refs
  const basicDataFormRef = ref()
  const movement_management_form = ref<IMovementManagementForm | null>()

  // configs
  const headerProps = {
    title: 'Ver tipos de movimiento por pagar',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Cuentas por pagar',
        route: '',
      },
      {
        label: 'Gestión de movimientos de cuentas por pagar',
        route: 'MovementManagementList',
      },
      {
        label: 'Ver',
        route: 'MovementManagementView',
      },
      {
        label: `${movementId}`,
        route: '',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircleOutline,
    },
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
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

  // actions
  const handleView = async () => {
    goToURL('MovementManagementList')
  }

  // lifecycle hooks
  onMounted(async () => {
    openMainLoader(true)
    movement_management_form.value = await _getMovementById(movementId)
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  return {
    // configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    // refs
    basicDataFormRef,
    movement_management_form,

    // methods
    handleView,
  }
}

export default useMovementManagementView
