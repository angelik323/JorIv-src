import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { ICostCenterModel, ICostCenterResponse } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import { useResourceStore, useCostCenterStore } from '@/stores'

const useCostCenterEdit = () => {
  const route = useRoute()
  const router = useRouter()

  const costCenterForm = ref()
  const { openMainLoader } = useMainLoader()
  const { _getCostCenter, _updateCostCenter } = useCostCenterStore('v1')
  const structureId = Number(route.params.structure_id)
  const chartId = Number(route.params.chart_id)
  const { _getAccountingResources } = useResourceStore('v1')

  const headerProps = {
    title: 'Editar centro de costo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Centro de costos', route: 'CostCenterList' },
      {
        label: 'Editar',
      },
      {
        label: `${structureId}`,
        route: 'CostCenterEdit',
        params: { structure_id: structureId, chart_id: chartId },
      },
    ],
    showBackBtn: true,
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
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

  const model = ref<ICostCenterModel>({
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

  const isValidCatalog = computed(
    () =>
      model.value.costCenters.length > 0 &&
      model.value.costCenters.every((item) =>
        ['code', 'type', 'name'].every(
          (key) => !!item[key as keyof typeof item]
        )
      )
  )

  const loadCostCenter = () => {
    const structureId = Number(route.params.structure_id)
    const chartId = Number(route.params.chart_id)
    _getCostCenter(structureId, chartId)
      .then((costCenterInfo: ICostCenterResponse | null) => {
        if (costCenterInfo) {
          const data = costCenterInfo as ICostCenterResponse

          model.value = {
            id: data.cost_centers[0].id,
            account_structure_id: data.structure.id,
            account_chart_id: data.chart.id,
            account_chart: data.chart.structure,
            code_structure: data.structure.structure,
            estructura: data.structure.structure,
            purpose: data.structure.purpose,
            type: data.structure.type,
            status_id: 1,
            cost_center_type: data.cost_centers[0].type,
            costCenters: data.cost_centers.map((item) => ({
              id: item.id,
              code: item.code,
              name: item.name,
              type: item.type,
            })),
          }
        }
      })
      .finally(() => {
        openMainLoader(false)
      })
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getAccountingResources(
      'keys[]=available_account_charts&keys[]=available_cost_center_structures'
    )

    await loadCostCenter()

    openMainLoader(false)
  })

  const handleFormUpdate = () => {
    if (
      costCenterForm.value &&
      typeof costCenterForm.value.getFormData === 'function'
    ) {
      model.value = costCenterForm.value.getFormData()
    }
  }

  const onUpdate = async () => {
    const okForm = await costCenterForm.value?.validate?.()

    if (!okForm || !isValidCatalog.value) {
      return
    }

    const payloadToSend = {
      account_structure_id: model.value.account_structure_id,
      account_chart_id: model.value.account_chart_id,
      code_structure: model.value.code_structure,
      estructura: model.value.estructura,
      purpose: model.value.purpose,
      type: model.value.type,
      status_id: model.value.status_id,
      cost_center_type: model.value.cost_center_type,
      centers: model.value.costCenters.map((item) => {
        const base: any = {
          id: item.id,
          name: item.name,
          type: item.type,
        }
        if (!item.id) {
          base.code = item.code
        }
        return base
      }),
    }

    try {
      const success = await _updateCostCenter(
        model.value.account_structure_id,
        model.value.account_chart_id,
        payloadToSend
      )

      if (!success) {
        return
      }

      router.push({ name: 'CostCenterList' })
    } catch (error: any) {}
  }

  return {
    headerProps,
    model,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    costCenterForm,
    isValidCatalog,
    handleFormUpdate,
    onUpdate,
  }
}

export default useCostCenterEdit
