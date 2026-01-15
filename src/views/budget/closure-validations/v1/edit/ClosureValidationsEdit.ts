// vue - router - quasar - pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// composables
import { useGoToUrl, useUtils } from '@/composables'

// Stores
import {
  useResourceManagerStore,
} from '@/stores/resources-manager'
import { useClosureValidationsModuleStore } from '@/stores/budget/closure-validations'
import { IClosureValidation, IClosureValidationForm } from '@/interfaces/customs/budget/ClosureValidations'
import { watch } from 'vue'

const useClosureValidationsEdit = () => {
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const { _updateAction, _getByClosureValidationId } = useClosureValidationsModuleStore()
  const { selected_closure_validation } = storeToRefs(
    useClosureValidationsModuleStore()
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const closureValidationId = Number(route.params.id)

  const headerProps = {
    title: 'Editar validaciones de cierre de vigencia',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      { label: 'Configuración' },
      {
        label: 'Validaciones de cierre de vigencia',
        route: 'ClosureValidationsList',
      },
      { label: 'Editar', route: 'ClosureValidationsEdit' },
      { label: closureValidationId.toString() },
    ],
  }

  const tabs = ref([
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
  const tabActiveIdx = ref(0)

  const information_data_form = ref<IClosureValidationForm | null>(null)


  // Forms
  const informationFormRef = ref()


  const setInformationDataForm = (data: IClosureValidation) => {
    if (!data) return
    information_data_form.value = {
      id: data.id,
      level_id: data.level?.id ?? null,
      level_code: data.level?.name ?? '',
      level_description: data.level?.description ?? '',
      cancellation_code_id: data.cancellation_code?.id ?? null,
      cancellation_movement_code: data.cancellation_code?.code ?? '',
      cancellation_movement_description: data.cancellation_code?.description ?? '',
      constitution_code_id: data.constitution_code?.id ?? null,
      constitution_movement_code: data.constitution_code?.code ?? '',
      constitution_movement_description: data.constitution_code?.description ?? '',
    }
  }

  const onSubmit = async () => {
    if (!(await informationFormRef.value?.validateForm?.())) return

    const formData = informationFormRef.value.getFormData()

    // Payload para actualizar: solo enviar campos editables
    const dataToSend = {
      id: closureValidationId,
      cancellation_code_id: formData.cancellation_code_id,
      constitution_code_id: formData.constitution_code_id,
    }

    const success = await _updateAction(dataToSend)

    if (success) goToURL('ClosureValidationsList')
  }

  const BudgetKeys = ['budget_levels', 'code_movements']

  onMounted(async () => {
    _getResources({ budget: BudgetKeys })

    if (
      !selected_closure_validation.value ||
      Number(selected_closure_validation.value.id) !== closureValidationId
    ) {
      await _getByClosureValidationId(closureValidationId.toString())
    }
  })

  onBeforeUnmount(() => {
    _resetKeys({ budget: BudgetKeys })
  })

  watch(
    () => selected_closure_validation.value,
    (val) => {
      if (!val) return
      setInformationDataForm(val)
    }
  )

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    informationFormRef,
    information_data_form,
    onSubmit,
    goToURL,
  }
}

export default useClosureValidationsEdit

