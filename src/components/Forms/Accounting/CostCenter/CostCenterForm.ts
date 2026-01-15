import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ICostCenterModel } from '@/interfaces/customs'
import { useResourceStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'

const useCostCenterForm = (
  props: {
    action: 'create' | 'edit' | 'view'
    data?: ICostCenterModel
  },
  emits: Function
) => {
  const { _getAccountingResources } = useResourceStore('v1')
  const {
    available_account_charts,
    available_cost_center_structures,
    cost_center_types,
    account_structures,
    account_structures_available,
    account_chart_options,
    cost_center_structure_options,
  } = storeToRefs(useResourceStore('v1'))

  const costCenterForm = ref()
  const isEdit = computed(() => props.action === 'edit')

  const models = ref<ICostCenterModel>({
    id: undefined,
    account_structure_id: 0,
    account_chart_id: 0,
    account_chart: '',
    code_structure: '',
    estructura: '',
    purpose: '',
    type: '',
    status_id: 1,
    cost_center_type: '',
    costCenters: [],
  })

  if (props.action === 'edit' && props.data) {
    models.value = { ...models.value, ...props.data }
  }

  const pagination = ref({
    page: 1,
    rowsPerPage: 5,
  })

  const visibleCostCenters = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
    return models.value.costCenters
      .slice(start, start + pagination.value.rowsPerPage)
      .map((item, idx) => {
        ;(item as any).index = start + idx + 1
        ;(item as any)._originalIndex = start + idx
        return item
      })
  })

  const addCatalogRow = () => {
    models.value.costCenters.push({
      code: '',
      type: '',
      name: '',
    })
  }

  const removeCatalogRow = (index: number) => {
    if (index >= 0 && index < models.value.costCenters.length) {
      models.value.costCenters.splice(index, 1)

      const totalItems = models.value.costCenters.length
      const rowsPerPage = pagination.value.rowsPerPage
      const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage))

      if (pagination.value.page > totalPages) {
        pagination.value.page = totalPages
      }
    }
  }

  const selectedStructure = computed(() => {
    const list =
      props.action === 'edit'
        ? cost_center_structure_options.value || []
        : available_cost_center_structures.value || []

    const selected = list.find(
      (item) => Number(item.value) === Number(models.value.account_structure_id)
    )

    if (selected && 'purpose' in selected && 'type' in selected) {
      return {
        purpose: selected.purpose ?? '-',
        type: selected.type ?? '-',
      }
    }

    return {
      purpose: '-',
      type: '-',
    }
  })

  const selectedStructureChart = computed(() => {
    const list = available_account_charts.value as any[]
    const selected = list.find(
      (item) => item.id === models.value.account_chart_id
    )
    return selected
      ? { purpose: selected.purpose, type: selected.type }
      : { purpose: '-', type: '-' }
  })

  const validate = async () => {
    return await costCenterForm.value?.validate?.()
  }

  const setFormData = () => {
    if (!props.data) return
    models.value.code_structure = props.data.code_structure || ''
    models.value.estructura = props.data.estructura || ''
    models.value.purpose = props.data.purpose || ''
    models.value.type = props.data.type || ''
    models.value.status_id = props.data.status_id
    models.value.account_structure_id = props.data.account_structure_id
    models.value.account_chart_id = props.data.account_chart_id
    models.value.account_chart = props.data.account_chart

    models.value.costCenters = props.data.costCenters.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      type: item.type,
    }))
  }

  const getFormData = () => {
    return {
      ...models.value,
      costCenters: models.value.costCenters.map((item) => ({
        id: item.id ?? undefined,
        code: item.code,
        name: item.name,
        type: item.type,
      })),
    }
  }

  onMounted(async () => {
    await _getAccountingResources(
      'keys[]=available_account_charts&keys[]=available_cost_center_structures&keys[]=cost_center_types'
    )

    if (props.action === 'edit') {
      await _getAccountingResources(
        'keys[]=account_structures&keys[]=account_structures_available'
      )
    }
    setFormData()
  })

  watch(
    () => props.data,
    () => setFormData()
  )

  watch(models, () => emits('update'), { deep: true })

  return {
    costCenterForm,
    models,
    isEdit,
    pagination,
    visibleCostCenters,
    defaultIconsLucide,
    available_cost_center_structures,
    available_account_charts,
    cost_center_types,
    account_structures,
    cost_center_structure_options,
    account_structures_available,
    account_chart_options,
    selectedStructure,
    selectedStructureChart,
    addCatalogRow,
    removeCatalogRow,
    validate,
    getFormData,
  }
}

export default useCostCenterForm
