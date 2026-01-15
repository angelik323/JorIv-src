import { ref, watch, computed } from 'vue'
import {
  IStructureTypeFormModel,
  IStructureTypeModel,
} from '@/interfaces/customs'
import { useRules } from '@/composables'
import type { ActionType } from '@/interfaces/global'

const useStructureTypeForm = (props: {
  action: ActionType
  data?: IStructureTypeModel
}) => {
  const structureTypeForm = ref()

  const models = ref<IStructureTypeFormModel>({
    code: '',
    name: '',
    status_id: 1,
  })

  const { is_required, max_length } = useRules()

  const codeRules = [
    (v: string) => is_required(v, 'El campo Código es requerido'),
    (v: string) => max_length(v, 10),
  ]

  const nameRules = [
    (v: string) => is_required(v, 'El campo Nombre es requerido'),
    (v: string) => max_length(v, 100),
  ]

  const isEdit = computed(() => props.action === 'edit')
  const isView = computed(() => props.action === 'view')

  const setFormData = () => {
    models.value.code = props.data?.code ?? ''
    models.value.name = props.data?.name ?? ''
    models.value.status_id = Number(props.data?.status_id ?? 1)
  }

  watch(
    () => props.data,
    () => setFormData(),
    { immediate: true }
  )

  const resetForm = () => {
    models.value = {
      code: '',
      name: '',
      status_id: 1,
    }
  }

  const handleCodeInput = (value: string) => {
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    models.value.code = cleanValue
  }

  return {
    structureTypeForm,
    models,
    codeRules,
    nameRules,
    isEdit,
    isView,
    resetForm,
    handleCodeInput,
  }
}

export default useStructureTypeForm
