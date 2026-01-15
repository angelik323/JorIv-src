import { ref, computed, onMounted, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'
import {
  useReportingLimitsForChangesInEquityStore,
  useResourceManagerStore,
} from '@/stores'
import router from '@/router'
import { ITableRowLimit } from '@/interfaces/customs'
const useReportingLimitsForChangesInEquityEdit = () => {
  const { _updateReportingLimits } =
    useReportingLimitsForChangesInEquityStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const route = useRoute()

  const reportingLimitsChangesEquityForm = ref()
  const updatedRows = ref<ITableRowLimit[]>([])

  const businessFromList = computed(() =>
    typeof route.query.business === 'string' ? route.query.business : undefined
  )

  const limitType = computed(() =>
    typeof route.query.limit_type === 'string'
      ? route.query.limit_type
      : undefined
  )

  const businessId = route.query.business_trust_id

  const accountStructureFromList = computed(() =>
    typeof route.query.account_structure === 'string'
      ? route.query.account_structure
      : undefined
  )

  const headerProps = {
    title: 'Editar límites de reporte cambios en el patrimonio',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Límites de reporte cambios en el patrimonio',
        route: 'ReportingLimitsChangesEquityList',
      },
      {
        label: 'Editar',
        route: 'ReportingLimitsChangesEquityEdit',
        params: { id: accountStructureFromList },
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

  const onRowUpdated = (updatedRow: ITableRowLimit) => {
    const index = updatedRows.value.findIndex((r) => r.id === updatedRow.id)
    if (index !== -1) {
      updatedRows.value[index] = updatedRow
    } else {
      updatedRows.value.push(updatedRow)
    }
  }

  const onUpdate = async () => {
    const payload = {
      limits: updatedRows.value.map((row) => ({
        id: row.id ?? 0,
        from_account: row.from_account ?? '',
        to_account: row.to_account ?? '',
        limit_type: row.limit ?? '',
      })),
    }

    const success = await _updateReportingLimits(payload)
    if (success) {
      router.push({ name: 'ReportingLimitsChangesEquityList' })
    }
  }

  onMounted(async () => {
    await _getResources({ accounting: ['account_structures_with_purpose'] })
  })

  onBeforeMount(async () => {
    await _resetKeys({ accounting: ['account_structures_with_purpose'] })
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    reportingLimitsChangesEquityForm,
    businessFromList,
    accountStructureFromList,
    businessId,
    limitType,
    onUpdate,
    onRowUpdated,
  }
}

export default useReportingLimitsForChangesInEquityEdit
