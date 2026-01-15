import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { useUtils } from '@/composables'

import {ICommissionParametersList} from '@/interfaces/customs/treasury/CommissionParameters'

import { useCommissionParametersStore } from '@/stores'

const useCommissionParametersList = (props: { controls?: boolean, data: number | null }) => {

  const {
    commission_accounting_parameters_list,
    commission_accounting_parameters_pages,
  } = storeToRefs(useCommissionParametersStore('v1'))

  const { _getCommissionAccountingParameters } = useCommissionParametersStore('v1')

  const { defaultIconsLucide, formatParamsCustom } = useUtils()

  const hasCommisionAccountList = ref(false)
  const commissionAccountingParamId = ref<number | null>(null)

  const headerProps = {
    title: `Parámetros contables comisiones`,
    breadcrumbs: [],
  }

  const accountingEntry = ref({
    title: 'Partida contable',
    loading: false,
    columns: [
      {
        name: 'account_chart',
        field: (row) => row.account_chart ? `${row.account_chart.code} - ${row.account_chart.name}` : '',
        label: 'Cuenta contable',
        required: false,
        align: 'left',
        sortable: true,
      },
      {
        name: 'cost_center',
        field: (row) => row.cost_center ? `${row.cost_center.code} - ${row.cost_center.name}` : '',
        label: 'Centro costos',
        required: false,
        align: 'left',
        sortable: true,
      },
      {
        name: 'tipo_auxiliar',
        field: (row) => row.aux_type ? `${row.aux_type}` : '',
        label: 'Tipo auxiliar',
        required: false,
        align: 'left',
        sortable: true,
      },
      {
        name: 'tercero',
        field: (row) => row.third_party ? `${row.third_party.document} - ${row.third_party.name}` : '',
        label: 'Tercero',
        required: false,
        align: 'left',
        sortable: true,
      },
      {
        name: 'flujo_caja',
        field: (row) => row.cash_flow_structure ? `${row.cash_flow_structure.code} - ${row.cash_flow_structure.name}` : '',
        label: 'Flujo de caja',
        required: false,
        align: 'left',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as ICommissionParametersList[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
    rowsPerPage: 20,
    selection: 'multiple',
    selected: ref([]),
  })

  const accountingOffset = ref({
    title: 'Contrapartida contable',
    loading: false,
    columns: [
      {
        name: 'account_chart',
        field: (row) => row.contra_account_chart ? `${row.contra_account_chart.code} - ${row.contra_account_chart.name}` : '',
        label: 'Cuenta contable',
        required: false,
        align: 'left',
        sortable: true,
      },
      {
        name: 'cost_center',
        field: (row) => row.contra_cost_center ? `${row.contra_cost_center.code} - ${row.contra_cost_center.name}` : '',
        label: 'Centro costos',
        required: false,
        align: 'left',
        sortable: true,
      },
      {
        name: 'tipo_auxiliar',
        field: (row) => row.contra_aux_type ? `${row.contra_aux_type}` : '',
        label: 'Tipo auxiliar',
        required: false,
        align: 'left',
        sortable: true,
      },
      {
        name: 'tercero',
        field: (row) => row.contra_third_party ? `${row.contra_third_party.document} - ${row.contra_third_party.name}` : '',
        label: 'Tercero',
        required: false,
        align: 'left',
        sortable: true,
      },
      {
        name: 'flujo_caja',
        field: (row) => row.contra_cash_flow_structure ? `${row.contra_cash_flow_structure.code} - ${row.contra_cash_flow_structure.name}` : '',
        label: 'Flujo de caja',
        required: false,
        align: 'left',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as ICommissionParametersList[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
    rowsPerPage: 20,
    selection: 'multiple',
    selected: ref([]),
  })

  const associatedBudget = ref({
    title: 'Presupuesto asociado',
    loading: false,
    columns: [
      {
        name: 'rubro',
        field: (row) => row.budget_item ? `${row.budget_item.code} - ${row.budget_item.description}` : '',
        required: false,
        label: 'Rubro',
        align: 'left',
        sortable: true,
      },
      {
        name: 'area',
        field: (row) => row.budget_area ? `${row.budget_area.code} - ${row.budget_area.description}` : '',
        required: false,
        label: 'Area',
        align: 'left',
        sortable: true,
      },
      {
        name: 'recurso',
        field: (row) => row.budget_resource ? `${row.budget_resource.code} - ${row.budget_resource.description}` : '',
        required: false,
        label: 'Recurso',
        align: 'left',
        sortable: true,
      },
      {
        name: 'presupesto_documental',
        field: (row) => row.budget_document_type ? `${row.budget_document_type.code} - ${row.budget_document_type.description}` : '',
        required: false,
        label: 'Presupuesto documental',
        align: 'left',
        sortable: true,
      },
      {
        name: 'movimiento_presupuestal',
        field: (row) => row.budget_movement_code ? `${row.budget_movement_code.code} - ${row.budget_movement_code.description}` : '',
        required: false,
        label: 'Movimiento presupuestal',
        align: 'left',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as ICommissionParametersList[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
    rowsPerPage: 20,
    selection: 'multiple',
    selected: ref([]),
  })

  const listAction = async () => {
    accountingEntry.value.loading = true
    accountingOffset.value.loading = true
    associatedBudget.value.loading = true

    accountingEntry.value.rows = []
    accountingOffset.value.rows = []
    associatedBudget.value.rows = []

    const queryString = formatParamsCustom({
      accounting_blocks_collection_id: props.data ?? 0,
      paginate: 1,
      rows: 20,
    })
    
    await _getCommissionAccountingParameters(queryString)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      listAction()
    },
    { deep: true, immediate: true }
  )

  watch(
    commission_accounting_parameters_list,
    () => {
      const { currentPage, lastPage } = commission_accounting_parameters_pages.value
      
      accountingEntry.value.rows = [...commission_accounting_parameters_list.value] as ICommissionParametersList[]
      accountingEntry.value.pages = {
        currentPage,
        lastPage,
      }
      accountingEntry.value.loading = false
      
      accountingOffset.value.rows = [...commission_accounting_parameters_list.value] as ICommissionParametersList[]
      accountingOffset.value.pages = {
        currentPage,
        lastPage,
      }
      accountingOffset.value.loading = false

      associatedBudget.value.rows = [...commission_accounting_parameters_list.value] as ICommissionParametersList[]
      associatedBudget.value.pages = {
        currentPage,
        lastPage,
      }
      associatedBudget.value.loading = false

      hasCommisionAccountList.value = commission_accounting_parameters_list.value.length > 0
      commissionAccountingParamId.value = hasCommisionAccountList.value ? commission_accounting_parameters_list.value[0].id : null
    },
    { deep: true }
  )

  return {
    headerProps,
    defaultIconsLucide,
    accountingEntry,
    accountingOffset,
    associatedBudget,
    hasCommisionAccountList,
    commissionAccountingParamId,
  }
}

export default useCommissionParametersList
