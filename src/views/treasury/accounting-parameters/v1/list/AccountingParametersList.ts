import { onMounted, ref, watch } from 'vue'
import { IAccountingParameters, IFieldFilters } from '@/interfaces/customs'
import { useAccountingParamaterStore, useFiltersStore } from '@/stores'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'
import { useRouteValidator } from '@/composables'

interface UseAccountingParametersListProps {
  selectedIds: number[]
}

export const useAccountingParametersList = (
  props: UseAccountingParametersListProps
) => {
  const { setFiltersState } = useFiltersStore()
  const {
    perPage,
    accounting_parameters_pages,
    accounting_parameters_list,
    id_selected_edit,
  } = storeToRefs(useAccountingParamaterStore('v1'))
  const isOpenExpansionItem = ref(false)

  const { _getAccountParameters, _setDataIds, _setIdSelectedEdit } =
    useAccountingParamaterStore('v1')
  const { validateRouter } = useRouteValidator()

  const headerProps = {
    title: 'Bloques contables de recaudos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Bloques contables de recaudos',
        route: 'AccountingParametersList',
      },
    ],
  }

  const refIdEdit = ref(Number(id_selected_edit.value))

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'code',
      label: 'Código bloque',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-12',
      disable: false,
      prepend_icon: 'Search',
      clean_value: true,
      placeholder: 'Buscar por nombre o código',
    },
  ])

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rowsPerPage: number
    rows: IAccountingParameters[]
    pages: typeof accounting_parameters_pages
  }>({
    title: 'Partida contable',
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
        name: 'account_chart',
        label: 'Cuenta contable',
        align: 'left',
        field: (row) =>
          row.accounting_blocks_collection?.code +
          ' - ' +
          row.accounting_blocks_collection?.description,
        sortable: false,
      },
      {
        name: 'cost_center',
        label: 'Centro de costo',
        align: 'left',
        field: (row) =>
          (row.cost_center?.code ?? '') +
          ' - ' +
          (row.cost_center?.name ?? 'N/A'),
        sortable: true,
      },
      {
        name: 'third_party',
        label: 'Tercero',
        align: 'left',
        field: (row) => row.third_party?.name ?? 'N/A',
        sortable: true,
      },
      {
        name: 'cash_flow_structure',
        label: 'Flujo de caja',
        align: 'left',
        field: (row) => {
          const name = row.cash_flow_structure?.name
          const structure_code = row.cash_flow_structure?.structure_code
          return name && structure_code ? `${structure_code} - ${name}` : 'N/A'
        },
      },
    ] as QTable['columns'],
    rows: [],
    pages: accounting_parameters_pages,
    rowsPerPage: perPage.value,
  })

  const subTableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rowsPerPage: number
    rows: IAccountingParameters[]
    pages: typeof accounting_parameters_pages
  }>({
    title: 'Contrapartida contable',
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
        name: 'contra_cost_center',
        label: 'Cuenta contable',
        align: 'left',
        field: (row) => {
          const code = row.contra_cash_flow_structure?.code
          const name = row.contra_cash_flow_structure?.name
          return code && name ? `${code} - ${name}` : 'No registrado'
        },
        sortable: false,
      },
      {
        name: 'cost_center',
        label: 'Centro de costo',
        align: 'left',
        field: (row) => {
          const code = row.contra_cost_center?.code
          const name = row.contra_cost_center?.name
          return code && name ? `${code} - ${name}` : 'No registrado'
        },
        sortable: true,
      },
      {
        name: 'third_party',
        label: 'Tercero',
        align: 'left',
        field: (row) => row.contra_third_party?.name ?? 'No registrado',
        sortable: true,
      },
      {
        name: 'contra_cash_flow_structure',
        label: 'Flujo de caja',
        align: 'left',
        field: (row) => {
          const name = row.contra_cash_flow_structure?.name
          const structure_code = row.contra_cash_flow_structure?.structure_code
          return name && structure_code ? `${structure_code} - ${name}` : 'N/A'
        },
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IAccountingParameters[],
    pages: accounting_parameters_pages,
    rowsPerPage: perPage.value,
  })

  const thirdTable = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rowsPerPage: number
    rows: IAccountingParameters[]
    pages: typeof accounting_parameters_pages
  }>({
    title: 'Presupuesto asociado',
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
        name: 'rubro',
        label: 'Rubro',
        align: 'left',
        field: '',
      },
      {
        name: 'area',
        label: 'Área',
        align: 'left',
        field: '',
      },
      {
        name: 'recaudo',
        label: 'Recaudo',
        align: 'left',
        field: '',
      },
      {
        name: 'documento_presupuestal',
        label: 'Documento Presupuestal',
        align: 'left',
        field: '',
      },
      {
        name: 'documento_presupuestal',
        label: 'Movimiento Presupuestal',
        align: 'left',
        field: '',
      },
    ] as QTable['columns'],
    rows: [] as IAccountingParameters[],
    pages: accounting_parameters_pages,
    rowsPerPage: perPage.value,
  })

  watch(
    () => props.selectedIds,
    async (newVal) => {
      await _getAccountParameters(newVal[0])
      _setDataIds(props.selectedIds[0])
      const { id } = accounting_parameters_list.value[0]
      _setIdSelectedEdit(id)
      tableProps.value.rows = accounting_parameters_list.value
      isOpenExpansionItem.value = true
      subTableProps.value.rows = accounting_parameters_list.value
    },
    { deep: true }
  )

  watch(id_selected_edit, (newVal) => {
    refIdEdit.value = Number(newVal)
  })

  onMounted(async () => {
    setFiltersState(filterConfig.value)
  })

  return {
    headerProps,
    tableProps,
    subTableProps,
    refIdEdit,
    thirdTable,
    isOpenExpansionItem,
    validateRouter,
  }
}
