import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCostCenterStore } from '@/stores'
import { ITabs } from '@/interfaces/global'
import { defaultIconsLucide } from '@/utils'

const useCostCenterView = () => {
  const route = useRoute()
  const structureId = Number(route.params.structure_id)
  const chartId = Number(route.params.chart_id)

  const { _getCostCenter } = useCostCenterStore('v1')
  const costCenterRaw = ref<any>(null)

  const costCenter = computed(() => {
    if (!costCenterRaw.value) return {}
    return {
      structure_code: costCenterRaw.value.structure?.structure ?? '-',
      purpose: costCenterRaw.value.structure?.purpose ?? '-',
      structure_type: costCenterRaw.value.structure?.type ?? '-',
      secondary_structure_code: costCenterRaw.value.chart?.structure ?? '-',
      secondary_purpose: costCenterRaw.value.chart?.purpose ?? '-',
      secondary_structure_type: costCenterRaw.value.chart?.type ?? '-',
      status_id: costCenterRaw.value.cost_centers?.[0]?.status?.id ?? 1,
      status_name: costCenterRaw.value.cost_centers?.[0]?.status?.name ?? '-',
    }
  })

  const headerProps = {
    title: 'Ver centro de costos',
    breadcrumbs: [
      { label: 'Inicio', route: '' },
      { label: 'Contabilidad', route: '' },
      { label: 'Centro de costos', route: '' },
      { label: 'Ver', route: '' },
      {
        label: `${structureId}`,
        route: 'CostCenterView',
        params: { structure_id: structureId, chart_id: chartId },
      },
    ],
  }

  const tabs = ref<ITabs[]>([
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
  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(filteredTabs.value.findIndex((tab) => tab.name === tabActive.value))

  const costCenterCatalogTableProps = ref({
    title: 'Catálogo de centros de costo',
    loading: false,
    columns: [
      { name: 'index', label: '#', align: 'center' as const, field: 'index', sortable: false },
      { name: 'code', label: 'Código', align: 'center' as const, field: (row: any) => row.code ?? '-', sortable: true },
      { name: 'type', label: 'Tipo', align: 'center' as const, field: (row: any) => row.type ?? '-', sortable: true },
      {
        name: 'name',
        label: 'Nombre de centro de costo',
        align: 'center' as const,
        field: (row: any) => row.name ?? '-',
        sortable: true,
      },
    ],
    rows: [] as any[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  onMounted(async () => {
    const costCenterInfo = await _getCostCenter(structureId, chartId)
    costCenterRaw.value = costCenterInfo || {}

    costCenterCatalogTableProps.value.rows = (costCenterRaw.value.cost_centers ?? []).map((item: any, idx: number) => ({
      index: idx + 1,
      code: item.code,
      type: item.type,
      name: item.name,
      status: item.status,
    }))
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    costCenter,
    costCenterCatalogTableProps,
  }
}

export default useCostCenterView
