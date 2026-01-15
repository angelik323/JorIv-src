import { useMainLoader } from '@/composables'
import {
  IAccountingConsolidation,
  IConsolidatedBusiness,
} from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import { useAccountingConsolidationStore } from '@/stores'
import { defaultIconsLucide, transformDate } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onUnmounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export const useAccountingConsolidationCreate = () => {
  const { _createAccountingConsolidation, _setAccountingBussinessRequest } =
    useAccountingConsolidationStore('v1')
  const {
    data_accounting_consolidation_form_create,
    data_search_id,
    data_accounting_consolidation_view,
  } = storeToRefs(useAccountingConsolidationStore('v1'))
  const headerProps = {
    title: 'Crear Consolidación de Contabilidades',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      {
        label: 'Consolidación de Contabilidades',
        route: 'AccountingConsolidationList',
      },
      {
        label: 'Crear consolidación de contabilidades',
        route: 'AccountingConsolidationCreate',
      },
    ],
  }

  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const tabs = reactive<ITabs[]>([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])
  const activeTab = ref(tabs[0].name)

  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )

  const tableProps = ref<{
    title: string
    loading: boolean
    rows: IConsolidatedBusiness[]
    columns: QTable['columns']
    pages: number
  }>({
    title: 'Negocios consolidados',
    loading: false,
    rows: [],
    columns: [
      {
        name: 'bussiness_code',
        label: 'Código del negocio',
        field: 'business_code',
        align: 'left',
        sortable: true,
      },
      {
        name: 'bussiness_name',
        label: 'Nombre del negocio',
        field: 'name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'now_period',
        label: 'Periodo actual',
        field: (row) => transformDate(row.current_period, true),
        align: 'left',
        sortable: true,
      },
      {
        name: 'last_verified',
        label: 'Último verificado',
        field: (row) => transformDate(row.last_verified),
        align: 'left',
        sortable: true,
      },
      {
        name: 'close-daily',
        label: 'Genera cierre diario',
        field: 'generates_daily_closure',
        align: 'left',
        sortable: true,
      },
      {
        name: 'consolidation',
        label: 'Consolidador',
        field: 'is_consolidator',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status_id',
        label: 'Estado',
        field: (row) => row.status.status,
        align: 'left',
        sortable: true,
      },
    ] as QTable['columns'],
    pages: 0,
  })

  const onSubmit = async () => {
    const payload = {
      business_trust_id: data_search_id.value,
    }
    if (await _createAccountingConsolidation(payload)) {
      router.push({ name: 'AccountingConsolidationList' })
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 5000)
  }

  watch(
    () => data_accounting_consolidation_form_create.value,
    (data) => {
      tableProps.value.rows = data.flatMap(
        (row: IAccountingConsolidation) => row.consolidated_children || []
      )
    }
  )

  watch(
    () => data_accounting_consolidation_view.value,
    (data) => {
      if (!data || data.id === 0 || data.id === null) {
        tableProps.value.rows = []
      }
    }
  )

  onUnmounted(() => {
    _setAccountingBussinessRequest(null)
  })

  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    tableProps,
    onSubmit,
  }
}
