// Vue - pinia
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import {
  IAreasResponsibilityBasicDataForm,
  IAreasResponsibilityBasicDataResponse,
} from '@/interfaces/customs/budget/AreasResponsibility'
import { WriteActionType } from '@/interfaces/global'

// Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useBudgetAreasResponsibilityStore } from '@/stores/budget/areas-responsibility'

// Composables
import { useRules, useUtils } from '@/composables'

const useBasicDataAreasResponsibilityForm = (props: {
  action: WriteActionType
  data?: IAreasResponsibilityBasicDataResponse | null
}) => {
  const { is_required, max_length } = useRules()
  const { isEmptyOrZero } = useUtils()
  const { data_areas_responsibility_form } = storeToRefs(
    useBudgetAreasResponsibilityStore('v1')
  )

  const { _setDataAreasResponsibilityForm } =
    useBudgetAreasResponsibilityStore('v1')

  const { third_parties, cost_center_active } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { areas_resposabilities_types } = storeToRefs(
    useBudgetResourceStore('v1')
  )

  const areasResponsibilityBasicData = ref()

  const models = ref<IAreasResponsibilityBasicDataForm>({
    id: 0,
    code: '',
    description: null,
    type: null,
    structure_cost_center: {
      code: null,
      description: null,
    },
    auxiliary_description: null,
    structure_area: {
      code: null,
      description: null,
    },
    cost_center: {
      code: null,
      description: null,
    },
    structure_cost_center_id: null,
    structure_area_id: null,
    cost_center_id: null,
    auxiliary_id: null,
  })

  const handlerActionForm = (action: WriteActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: setFormEdit,
    }
    actionHandlers[action]?.()
  }

  const selectStructureCostCenter = (event: number) => {
    models.value.cost_center_id = null
    models.value.cost_center = {}
    models.value.structure_cost_center_id = event
  }

  const selectedCostCenter = computed(() =>
    cost_center_active.value.find(
      (item) => item.id === models.value.cost_center_id
    )
  )

  const selectAuxiliary = (event: number) => {
    models.value.auxiliary_description = ''
    models.value.auxiliary_id = event

    const auxiliarySelected = third_parties.value.find(
      (item) => item.id === event
    )

    if (auxiliarySelected) {
      models.value.auxiliary_description =
        auxiliarySelected.natural_person?.full_name ??
        auxiliarySelected.legal_person?.business_name ??
        ''
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value.id = data?.id
      models.value.code = data?.code
      models.value.description = data?.description
      models.value.type = data?.type
      models.value.structure_cost_center = data?.structure_cost_center
      models.value.structure_area = data?.structure_area
      models.value.cost_center = data?.cost_center
      models.value.structure_cost_center_id = data?.structure_cost_center_id
      models.value.structure_area_id = data?.structure_area_id
      models.value.cost_center_id = data?.cost_center_id
      models.value.auxiliary_id = data?.auxiliary_id

      const aux = data.auxiliary
      if (models.value.cost_center && data.cost_center)
        models.value.cost_center.description = data.cost_center.name

      models.value.auxiliary_description =
        aux.natural_person?.full_name ?? aux.legal_person?.business_name ?? ''
    }
  }

  const clearForm = () => {
    models.value.id = 0
    models.value.code = null
    models.value.description = ''
    models.value.type = null
    models.value.structure_cost_center = {}
    models.value.auxiliary_description = ''
    models.value.structure_area = {}
    models.value.cost_center = {}
    models.value.structure_cost_center_id = null
    models.value.structure_area_id = null
    models.value.cost_center_id = null
    models.value.auxiliary_id = null
  }

  const _setValueModel = () => {
    if (data_areas_responsibility_form.value) {
      models.value = { ...data_areas_responsibility_form.value }
    }
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  onBeforeMount(async () => {
    _setDataAreasResponsibilityForm(null)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataAreasResponsibilityForm(null)
      } else {
        _setDataAreasResponsibilityForm({
          id: models.value.id,
          structure_area_id: models.value.structure_area_id,
          structure_cost_center_id: models.value.structure_cost_center_id,
          code: models.value.code,
          description: models.value.description,
          type: models.value.type,
          cost_center_id: models.value.cost_center_id,
          auxiliary_id: models.value.auxiliary_id,
        })
      }
    },
    { deep: true }
  )

  return {
    models,
    areasResponsibilityBasicData,
    areas_resposabilities_types,
    cost_center_active,
    third_parties,
    selectedCostCenter,
    is_required,
    max_length,
    selectStructureCostCenter,
    selectAuxiliary,
  }
}

export default useBasicDataAreasResponsibilityForm
