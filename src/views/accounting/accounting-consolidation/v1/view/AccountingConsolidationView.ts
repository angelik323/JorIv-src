import { useMainLoader, useUtils } from '@/composables'
import {
  IAccountingConsolidationList,
  IConsolidatedBusiness,
} from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import { useAccountingConsolidationStore } from '@/stores'
import { transformDate } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onBeforeMount, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useAccountingConsolidationView = () => {
  const route = useRoute()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const accountingConsolidationId = +route.params.id
  const { data_accounting_consolidation_view } = storeToRefs(
    useAccountingConsolidationStore('v1')
  )
  const { _getAccountingConsolidationDetails, _setAccountingBussinessRequest } =
    useAccountingConsolidationStore('v1')

  const headerProps = ref<{
    title: string
    breadcrumbs: Array<{ label: string; route: string }>
  }>({
    title: 'Ver Consolidación de Contabilidades',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      {
        label: 'Consolidación de contabilidades',
        route: 'AccountingConsolidationList',
      },
      {
        label: 'Ver consolidación de contabilidades',
        route: 'AccountingConsolidationView',
      },
      {
        label: String(accountingConsolidationId),
        route: '',
      },
    ],
  })
  const tabs = ref<ITabs[]>([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: useUtils().defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const activeTab = ref<string>(tabs.value[0].name)

  const tabActiveIdx = ref<number>(
    tabs.value.findIndex((tab) => tab.name === activeTab.value)
  )
  const tabActive = ref<string>(tabs.value[0].name)

  const handlerGoTo = (goURL: string): void => {
    router.push({ name: goURL })
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getAccountingConsolidationDetails(String(accountingConsolidationId))
    openMainLoader(false)
  })

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IAccountingConsolidationList[]
    pages: number
    rowsPerPage: number
  }>({
    title: 'Negocios consolidados',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_code',
        label: 'Código del negocio',
        field: 'business_code',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_name',
        label: 'Nombre del negocio',
        field: 'business_name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'nowPeriod',
        label: 'Periodo actual',
        field: (row) => transformDate(row.nowPeriod),
        align: 'left',
        sortable: true,
      },
      {
        name: 'lastVerified',
        label: 'Último verificado',
        field: (row) => transformDate(row.lastVerified),
        align: 'left',
        sortable: true,
      },
      {
        name: 'closeDaily',
        label: 'Genera cierre diario',
        field: (row) => (row.closeDaily ? 'Sí' : 'No'),
        align: 'left',
        sortable: true,
      },
      {
        name: 'consolidation',
        label: 'Consolidador',
        field: 'status',
        align: 'left',
        sortable: true,
      },
      {
        name: 'estado',
        label: 'Estado',
        field: 'status',
        align: 'left',
        sortable: true,
      },
    ],
    rows: [],
    pages: 0,
    rowsPerPage: 10,
  })

  watch(
    () => data_accounting_consolidation_view.value,
    () => {
      tableProps.value.rows =
        data_accounting_consolidation_view.value.consolidated_businesses.map(
          (item: IConsolidatedBusiness) => ({
            id: data_accounting_consolidation_view.value.business_trust_id,
            business_code: item.business_code,
            business_name: item.business_name,
            nowPeriod: item.current_period,
            lastVerified: item.last_closing_daily ?? '',
            closeDaily: item.generates_daily,
            consolidation: item.is_consolidator ?? '',
            status: item.status ?? '',
            current_period: item.accounting_period,
          })
        )
    }
  )

  onUnmounted(() => {
    _setAccountingBussinessRequest(null)
  })

  return {
    tabs,
    activeTab,
    headerProps,
    tabActiveIdx,
    data_accounting_consolidation_view,
    tabActive,
    tableProps,
    handlerGoTo,
  }
}
