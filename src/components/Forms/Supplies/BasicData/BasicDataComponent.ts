import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'

// Stores
import { useResourcesStore, useSuppliesStore } from '@/stores'

// Interfaces
import { ISuppliesRequest } from '@/interfaces/global'

const useBasicDataComponent = (props: any) => {
  const { data_basic_supplies } = storeToRefs(useSuppliesStore('v1'))
  const { measure_units } = storeToRefs(useResourcesStore())
  const { _setDataBasicSupplies } = useSuppliesStore('v1')

  const basicDataFormRef = ref()

  const models = ref({
    code: null as string | null,
    name: null as string | null,
    measurement_unit: null as string | null,
    description: null as string | null,
  })

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_basic_supplies.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data: ISuppliesRequest = props.data
    if (data) {
      models.value.code = data?.code ?? null
      models.value.name = data.name ?? null
      models.value.measurement_unit = data.measurement_unit ?? null
      models.value.description = data.description ?? null
    }
  }
  const setFormEdit = () => {
    clearForm()
    const data: ISuppliesRequest = props.data
    if (data) {
      models.value.code = data?.code ?? null
      models.value.name = data.name ?? null
      models.value.measurement_unit = data.measurement_unit ?? null
      models.value.description = data.description ?? null
    }
  }

  const _setValueModel = () => {
    if (data_basic_supplies.value) {
      models.value = { ...data_basic_supplies.value }
    }
  }
  const clearForm = () => {
    models.value.code = null
    models.value.name = null
    models.value.measurement_unit = null
    models.value.description = null
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => [
      models.value.code,
      models.value.name,
      models.value.measurement_unit,
      models.value.description,
    ],
    () => {
      if (isEmpty(models.value)) {
        _setDataBasicSupplies(null)
      } else {
        _setDataBasicSupplies({
          code: models.value.code as string,
          name: models.value.name ?? '',
          measurement_unit: models.value.measurement_unit ?? '',
          description: models.value.description ?? '',
        })
      }
    }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  return { models, basicDataFormRef, measure_units }
}

export default useBasicDataComponent
