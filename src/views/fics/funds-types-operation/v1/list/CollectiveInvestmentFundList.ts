// Vue - Pinia - Quasar
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IFundsTypes } from '@/interfaces/customs/fics/FundsTypes'
import { ITabs } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useFundsTypeStore } from '@/stores/fics/funds-types'

export const useCollectiveInvestmentFundList = () => {
  const { defaultIconsLucide } = useUtils()

  const { funds_types_pages, funds_types_list, funds_types_operation_list } =
    storeToRefs(useFundsTypeStore('v1'))
  const { _getFundsTypesList, _getFundsTypesOperationList } =
    useFundsTypeStore('v1')

  const headerProps = {
    title: 'Tipo de fondos y de operación',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Tipo de fondos y de operación',
        route: 'CollectiveInvestmentFundList',
      },
    ],
  }
  const tabs = ref<ITabs[]>([
    {
      name: 'Tipos de fondos',
      label: 'Tipos de fondos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
    {
      name: 'Tipos de operación',
      label: 'Tipos de operación',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])

  const activeTab = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === activeTab.value)
  )

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IFundsTypes[]
    pages: typeof funds_types_pages
    rowsPerPage: number
  }>({
    title: 'Tipos de fondos',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: false,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'description',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'abbreviation',
        required: false,
        label: 'Abreviatura',
        align: 'left',
        field: (row) => row.abbreviation?.toUpperCase() || '',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [],
    pages: funds_types_pages,
    rowsPerPage: 10,
  })

  const tableTypesProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IFundsTypes[]
    pages: typeof funds_types_pages
    rowsPerPage: number
  }>({
    title: 'Tipos de operación',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: false,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'description',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [],
    pages: funds_types_pages,
    rowsPerPage: 10,
  })

  onMounted(() => _getFundsTypesList())

  watch(
    () => funds_types_list.value,
    () => {
      tableProps.value.rows = funds_types_list.value
    }
  )

  watch(
    () => activeTab.value,
    (newTab) => {
      if (newTab === 'Tipos de operación') {
        _getFundsTypesOperationList()
      }
    }
  )

  watch(
    () => funds_types_operation_list.value,
    () => {
      tableTypesProps.value.rows = funds_types_operation_list.value
    }
  )

  return {
    tabs,
    activeTab,
    tableProps,
    headerProps,
    tabActiveIdx,
    tableTypesProps,
  }
}
