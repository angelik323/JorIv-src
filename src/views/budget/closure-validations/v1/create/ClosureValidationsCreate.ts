// vue - router - quasar - pinia
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
// Interfaces & types
import { ITabs } from '@/interfaces/global'
// composable
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'
// Stores
import {
  useResourceManagerStore,
} from '@/stores/resources-manager'
import { useClosureValidationsModuleStore } from '@/stores/budget/closure-validations'

const useClosureValidationsCreate = () => {
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createAction } = useClosureValidationsModuleStore()
  const formRef = ref()
  const loading = ref(false)

  const headerProps = {
    title: 'Crear validaciones de cierre de vigencia',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      { label: 'Configuración' },
      {
        label: 'Validaciones de cierre de vigencia',
        route: 'ClosureValidationsList',
      },
      { label: 'Crear', route: 'ClosureValidationsCreate' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
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

  const validateForms = async () => {
    return formRef.value?.validateForm()
  }

  const createClosureValidation = async () => {
    if (!(await validateForms())) {
      return
    }

    loading.value = true
    openMainLoader(true)
    const formData = formRef.value.getFormData()
    
    // Payload para crear: solo enviar campos necesarios
    const payload = {
      level_id: formData.level_id,
      cancellation_code_id: formData.cancellation_code_id,
      constitution_code_id: formData.constitution_code_id,
    }
    
    const success = await _createAction(payload)
    loading.value = false
    openMainLoader(false)
    if (success) {
      goToURL('ClosureValidationsList')
    }
  }

  const BudgetKeys = ['budget_levels', 'code_movements']

  onMounted(async () => {
    _getResources({ budget: BudgetKeys })
  })

  onBeforeUnmount(() => {
    _resetKeys({ budget: BudgetKeys })
  })

  return {
    headerProps,
    loading,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    formRef,
    createClosureValidation,
    goToURL,
  }
}

export default useClosureValidationsCreate
