// Vue - Pinia - Router - Quasar
import { computed, ref, watch } from 'vue'

// Composables
import { useUtils } from '@/composables'

// Tipos
import type { ActionType } from '@/interfaces/global'
import type { IGenericResource } from '@/interfaces/customs'
import type { ITypeWorkPlanForm } from '@/interfaces/customs/derivative-contracting/WorkPlans'

// Stores
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { storeToRefs } from 'pinia'

const useWorkPlansInformationForm = (
  props: {
    action: ActionType
    basicDataForm?: ITypeWorkPlanForm | null
    structureCodes?: IGenericResource[]
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()
  const formElementRef = ref()

  const models = ref<ITypeWorkPlanForm>({
    structure_plan_code_id: 0,
    structure_name: '',
    purpose: '',
    type: '',
    code: '',
    name: '',
    status_id: 1,
    structure: '',
  })

  const { work_plan } = storeToRefs(useDerivativeContractingResourceStore('v1'))

  const workPlanOptions = computed(() =>
    work_plan.value.map((item) => ({
      ...item,
      label: item.label_code_purpose,
      value: item.value,
    }))
  )
  const _setValueModel = () => {
    if (!props.basicDataForm) return
    Object.assign(models.value, props.basicDataForm)
  }

  watch(
    () => props.basicDataForm,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    (val) => {
      emit('update:basic-data-form', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => models.value.structure_plan_code_id,
    (val) => {
      if (!val) return

      const selected = work_plan.value.find((item) => item.value === val)
      if (!selected) return

      models.value.structure_name = selected.structure_name ?? ''
      models.value.structure = selected.structure?.[0]?.structure ?? ''
      models.value.purpose = selected.structure?.[0]?.purpose ?? ''
    },
    { immediate: true }
  )

  return {
    work_plan,
    workPlanOptions,
    models,
    formElementRef,
    structureCodes: props.structureCodes,
  }
}

export default useWorkPlansInformationForm
