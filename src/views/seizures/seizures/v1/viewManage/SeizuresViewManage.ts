// Vue
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

// Vue Router
import { useRoute } from 'vue-router'

// Interfaces
import { ISeizureProcedure } from '@/interfaces/customs/seizures/Seizures'

// Composables
import { useMainLoader, useGoToUrl } from '@/composables'

// Constants
import { SeizureManagementTypes } from '@/constants/resources/seizures'

// Stores
import { useSeizuresStore } from '@/stores/seizures'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useSeizuresViewManage = () => {
  const route = useRoute()
  const seizureId = Number(route.params.id)
  const historyId = Number(route.query.historyId)
  const procedureTypeId = Number(route.query.type)

  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { _getAction } = useSeizuresStore('v1')
  const { _resetKeys } = useResourceManagerStore('v1')

  const managementData = ref<ISeizureProcedure | undefined>(undefined)
  const isLoaded = ref(false)

  const procedureTypeMap: Record<number, SeizureManagementTypes> = {
    1: SeizureManagementTypes.ACTIVATE,
    2: SeizureManagementTypes.CERTIFY_UNSEIZABLE,
    3: SeizureManagementTypes.FOLLOW_UP,
    4: SeizureManagementTypes.LIFT,
    5: SeizureManagementTypes.PAYMENT_ORDER,
  }

  const managementType = computed(() => procedureTypeMap[procedureTypeId])

  const headerProps = computed(() => ({
    title: 'Ver gestión de embargo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Embargos', route: 'SeizuresList' },
      {
        label: 'Ver',
        route: 'SeizuresView',
        params: { id: seizureId },
      },
      { label: 'Gestión' },
      { label: seizureId.toString() },
    ],
  }))

  const loadData = async () => {
    openMainLoader(true)

    const detail = await _getAction(seizureId)
    if (!detail) {
      openMainLoader(false)
      handleGoBack()
      return
    }

    managementData.value = detail.procedures?.find(
      (p: ISeizureProcedure) => p.id === historyId
    )

    isLoaded.value = true
    openMainLoader(false)
  }

  const handleGoBack = () => goToURL('SeizuresView', { id: seizureId })

  onMounted(loadData)
  onBeforeUnmount(() => _resetKeys({}))

  return {
    headerProps,
    managementType,
    managementData,
    isLoaded,
    handleGoBack,
  }
}

export default useSeizuresViewManage
