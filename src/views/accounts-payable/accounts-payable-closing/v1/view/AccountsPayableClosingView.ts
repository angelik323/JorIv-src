// core
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import moment from 'moment'

// stores
import { useAccountsPayableClosingStore } from '@/stores/accounts-payable/accounts-payable-closing'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IBusinessClosingRow } from '@/interfaces/customs/accounts-payable/AccountsPayableClosing'
import { ITabs } from '@/interfaces/global'

const useAccountsPayableClosingView = () => {
  // hooks
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const route = useRoute()

  // stores
  const closingStore = useAccountsPayableClosingStore('v1')
  const { closing_detail_list } = storeToRefs(closingStore)
  const { _getDetailAction } = closingStore

  // state
  const businessTrustId = route.params.id ? String(route.params.id) : ''

  // props
  const headerProps = {
    title: 'Ver cierre de cuenta por pagar',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Cierre de negocios',
        route: 'AccountsPayableClosingList',
      },
      {
        label: 'Ver',
        route: 'AccountsPayableClosingView',
      },
      {
        label: businessTrustId,
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
  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const tableProps = ref<IBaseTableProps<IBusinessClosingRow>>({
    title: '',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business_trust',
        required: true,
        label: 'Código / Negocio',
        align: 'left',
        field: 'business_trust',
        sortable: true,
      },
      {
        name: 'period',
        required: true,
        label: 'Periodo',
        align: 'left',
        field: 'period',
        sortable: true,
        format: (val: string) => {
          if (!val) return '-'
          if (val.includes('-')) {
            return val.replace('-', '/')
          }
          if (val.length === 6 && /^\d{6}$/.test(val)) {
            return `${val.slice(0, 4)}/${val.slice(4)}`
          }
          return val
        },
      },
      {
        name: 'closure_type',
        required: true,
        label: 'Tipo de cierre',
        align: 'left',
        field: 'closure_type',
        sortable: true,
      },
      {
        name: 'closure_date',
        required: true,
        label: 'Fecha de cierre',
        align: 'left',
        field: 'closure_date',
        sortable: true,
        format: (val: string) => (val ? moment(val).format('DD/MM/YYYY') : '-'),
      },
      {
        name: 'user',
        required: true,
        label: 'Usuario cierre',
        align: 'left',
        field: 'user',
        sortable: true,
        format: (val: string | undefined) => val || '-',
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  // lifecycle
  onMounted(async () => {
    if (businessTrustId) {
      openMainLoader(true)
      tableProps.value.loading = true

      const queryFilters = route.query as Record<string, string>
      await _getDetailAction(businessTrustId, queryFilters)
      tableProps.value.rows = [
        ...(closing_detail_list.value as IBusinessClosingRow[]),
      ]

      tableProps.value.loading = false
      openMainLoader(false)
    }
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    tableProps,
    goToURL,
    defaultIconsLucide,
  }
}

export default useAccountsPayableClosingView
