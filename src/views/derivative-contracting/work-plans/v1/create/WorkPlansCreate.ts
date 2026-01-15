// Vue - Pinia - Router - Quasar
import { onBeforeMount, onBeforeUnmount, ref } from 'vue'

// Interfaces
import type { ITabs } from '@/interfaces/global'
import type { ITypeWorkPlanForm } from '@/interfaces/customs/derivative-contracting/WorkPlans'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Stores
import { useWorkPlansStore } from '@/stores/derivative-contracting/work-plans'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { storeToRefs } from 'pinia'

const useWorkPlansCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { work_plan } = storeToRefs(useDerivativeContractingResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    derivative_contracting: ['work_plan'],
  }

  const store = useWorkPlansStore('v1')
  const { _createWorkPlan } = store

  const informationFormRef = ref()
  const basicDataForm = ref<ITypeWorkPlanForm | null>(null)

  const headerProps = {
    title: 'Crear plan de obra',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada' },
      { label: 'Planes de obra', route: 'WorkPlansList' },
      { label: 'Crear', route: 'WorkPlansCreate' },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const makeDataRequest = (): ITypeWorkPlanForm => {
    const d = basicDataForm.value ?? ({} as ITypeWorkPlanForm)
    return {
      structure_plan_code_id: Number(d.structure_plan_code_id ?? 0),
      structure_name: d.structure_name ?? '',
      purpose: d.purpose ?? '',
      type: d.type ?? '',
      code: d.code ?? '',
      name: d.name ?? '',
      status_id: d.status_id ?? 1,
    }
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return
    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _createWorkPlan(payload)

    if (success) {
      goToURL('WorkPlansList')
    }

    openMainLoader(false)
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    informationFormRef,
    basicDataForm,
    work_plan,
    goToURL,
    onSubmit,
  }
}

export default useWorkPlansCreate
