// Vue
import { ref, onMounted } from 'vue'

// Composables
import { useMainLoader, useGoToUrl } from '@/composables'

// Stores
import { useSeizuresStore } from '@/stores/seizures'

// Interfaces
import { ISeizureMassiveCreatePayload } from '@/interfaces/customs/seizures/Seizures'

type MassiveFormExpose = {
  hasFileLoaded: boolean
  getMassivePayload: () => ISeizureMassiveCreatePayload | null
}

const useSeizuresCreateMassive = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const massiveFormRef = ref<MassiveFormExpose | null>(null)
  const isLoaded = ref(false)

  const seizuresStore = useSeizuresStore('v1')
  const { _createMassiveAction } = seizuresStore

  const headerProps = {
    title: 'Registrar embargos masivos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Embargos', route: 'SeizuresList' },
      { label: 'Crear', route: 'SeizuresCreate' },
      { label: 'Masivo', route: 'SeizuresCreateMassive' },
    ],
  }

  const handleGoToList = () => {
    goToURL('SeizuresList')
  }

  const loadInitial = async () => {
    openMainLoader(true)
    await new Promise((r) => setTimeout(r, 150))
    isLoaded.value = true
    openMainLoader(false)
  }

  onMounted(loadInitial)

  const onCreateMassive = async () => {
    const form = massiveFormRef.value
    if (!form || !form.hasFileLoaded) return

    const payload = form.getMassivePayload()
    if (!payload) return

    openMainLoader(true)
    const success = await _createMassiveAction(payload)
    openMainLoader(false)

    if (success) handleGoToList()
  }

  return {
    headerProps,
    isLoaded,
    handleGoToList,
    onCreateMassive,
    massiveFormRef,
  }
}

export default useSeizuresCreateMassive
