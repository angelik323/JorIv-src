// Vue - Vue Router - Quasar
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { QTable } from 'quasar'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IVariableCommission,
  IFiduciaryCommission,
} from '@/interfaces/customs/fics/FiduciaryCommission'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useFiduciaryCommissionStore } from '@/stores/fics/fiduciary-comission'

const useFiduciaryCommissionView = () => {
  const { defaultIconsLucide, formatCurrency } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _showAction } = useFiduciaryCommissionStore('v1')

  const id = route.params.id as string

  const initialData = ref<IFiduciaryCommission>({
    id: 0,
    code: '',
    type: 2,
    type_description: 0,
    liquidation_base: 'SFF - Saldo final fondo',
    liquidation_base_abv: '',
    rate_type: 'EF - Efectiva',
    rate_type_abv: '',
    fixed_rate_percentage: '',
    description: '',
    variable_rates: [],
  })

  const headerProperties = {
    title: 'Ver comisión fiduciaria',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Comisión fiduciaria',
        route: 'FiduciaryCommissionList',
      },
      {
        label: 'Ver',
        route: 'FiduciaryCommissionView',
      },
      {
        label: id,
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tableProperties = ref({
    title: '',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'initial_balance',
        required: true,
        label: 'Saldo inicial',
        align: 'left',
        field: (row) => formatCurrency(row.initial_balance),
        sortable: true,
      },
      {
        name: 'final_balance',
        required: true,
        label: 'Saldo final',
        align: 'left',
        field: (row) => formatCurrency(row.final_balance),
        sortable: true,
      },
      {
        name: 'rate_percentage',
        required: true,
        label: 'Tasa comisión',
        align: 'left',
        field: 'rate_percentage',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IVariableCommission[],
  })

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const loadData = async () => {
    openMainLoader(true)

    const success = await _showAction(Number(id))

    if (success) {
      initialData.value = success

      if (Array.isArray(success.variable_rates))
        tableProperties.value.rows = success.variable_rates
    }

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleGoToList = () =>
    goToURL('FiduciaryCommissionList', undefined, { reload: true })

  onMounted(() => loadData())

  return {
    tabs,
    tabActive,
    initialData,
    tabActiveIdx,
    handleGoToList,
    tableProperties,
    headerProperties,
  }
}

export default useFiduciaryCommissionView
