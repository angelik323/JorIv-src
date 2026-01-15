// Vue - Router
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ISeizuresDetail } from '@/interfaces/customs/seizures/Seizures'

// Composables
import { useMainLoader, useGoToUrl } from '@/composables'

// Constants
import { SeizureManagementTypes } from '@/constants/resources/seizures'

// Stores
import { useSeizuresStore } from '@/stores/seizures'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useSeizureCreateManage = () => {
  const route = useRoute()
  const seizureId = Number(route.params.id)
  const procedureTypeId = computed<number>(() => {
    return Number(route.query.type)
  })

  const keys = {
    accounts_payable: ['orpa_authorizations'],
  }

  const procedureTypeMap: Record<number, SeizureManagementTypes> = {
    1: SeizureManagementTypes.ACTIVATE,
    2: SeizureManagementTypes.CERTIFY_UNSEIZABLE,
    3: SeizureManagementTypes.FOLLOW_UP,
    4: SeizureManagementTypes.LIFT,
    5: SeizureManagementTypes.PAYMENT_ORDER,
  }

  const managementType = computed<SeizureManagementTypes>(() => {
    return procedureTypeMap[procedureTypeId.value]
  })

  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const seizuresStore = useSeizuresStore('v1')
  const { _getAction, _manageSeizureProcedureAction } = seizuresStore

  const { _resetKeys, _getResources } = useResourceManagerStore('v1')

  const formRef = ref<{
    getPayload: () => FormData
    resetForm: () => void
  } | null>(null)

  const isLoaded = ref(false)
  const seizureDetail = ref<ISeizuresDetail | null>(null)

  const titleMap: Record<SeizureManagementTypes, string> = {
    [SeizureManagementTypes.ACTIVATE]: 'Gestión: Activar embargo',
    [SeizureManagementTypes.FOLLOW_UP]: 'Gestión: Seguimiento',
    [SeizureManagementTypes.PAYMENT_ORDER]: 'Gestión: Relacionar orden de pago',
    [SeizureManagementTypes.LIFT]: 'Gestión: Levantamiento',
    [SeizureManagementTypes.CERTIFY_UNSEIZABLE]:
      'Gestión: Certificar inembargabilidad',
  }

  const headerProps = computed(() => ({
    title: titleMap[managementType.value],
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Embargos', route: 'SeizuresList' },
      {
        label: 'Ver',
        route: 'SeizuresView',
        params: { id: seizureId },
      },
      { label: titleMap[managementType.value] },
      { label: seizureId.toString() },
    ],
  }))

  const loadInitial = async () => {
    openMainLoader(true)

    const detail = await _getAction(seizureId)

    if (!detail) {
      openMainLoader(false)
      handleGoToView()
      return
    }

    seizureDetail.value = detail
    isLoaded.value = true
    if (managementType.value === SeizureManagementTypes.PAYMENT_ORDER) {
      await _getResources({ accounts_payable: keys.accounts_payable })
    }

    openMainLoader(false)
  }

  const canSubmit = computed(() => {
    return isLoaded.value && canExecute.value
  })

  const canExecute = computed(() => !!seizureDetail.value)

  const onSubmit = async () => {
    if (!formRef.value || !canSubmit.value) return

    const payload = formRef.value.getPayload()
    if (!payload) return

    payload.append('seizure_id', String(seizureId))
    payload.append('seizure_procedure_type_id', String(procedureTypeId.value))

    openMainLoader(true)

    const success = await _manageSeizureProcedureAction(seizureId, payload)

    openMainLoader(false)

    if (success) {
      formRef.value.resetForm()
      handleGoToView()
    }
  }

  const handleGoToView = () => goToURL('SeizuresView', { id: seizureId })

  onMounted(loadInitial)
  onBeforeUnmount(() => _resetKeys({}))

  return {
    headerProps,
    formRef,
    isLoaded,
    seizureDetail,
    managementType,
    canExecute,
    canSubmit,
    handleGoToView,
    onSubmit,
  }
}

export default useSeizureCreateManage
