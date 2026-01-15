import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { QTable } from 'quasar'
import { ActionType, IResource } from '@/interfaces/global'
import {
  IAccountingClosingParameterModel,
  IAccountStructure,
  IStructure,
} from '@/interfaces/customs'

import { useAccountingResourceStore, useResourceManagerStore } from '@/stores'
import { usePeriodClosureParametersStore } from '@/stores/accounting/period-closure-parameters'

const useInformationForm = (props: { action: ActionType; id?: number }) => {
  const {
    account_closing_natures,
    available_accounting_structures,
    accounting_chart_operative_by_structure,
    accounting_closing_parameter_third_parties,
    accounting_closing_parameter_cost_centers,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const { period_closure_parameter } = storeToRefs(
    usePeriodClosureParametersStore('v1')
  )
  const { _cleanPeriodClosureParametersData } =
    usePeriodClosureParametersStore('v1')

  const { _getResources } = useResourceManagerStore('v1')

  const informationForm = ref()

  const isView = computed(() => props.action === 'view')

  const selectedAccountStructure = ref<IAccountStructure | null>(null)

  const styleColumn = (width: number = 200) => ({
    'white-space': 'pre-wrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-wrap': 'break-word',
  })

  const eventsTableProps = ref({
    title: 'Listado de eventos',
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
        name: 'event',
        required: true,
        label: 'Evento',
        align: 'left',
        field: (row: IAccountingClosingParameterModel) => `${row.event}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'nature',
        required: true,
        label: 'Naturaleza',
        align: 'left',
        field: (row: IAccountingClosingParameterModel) => `${row.nature}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'chart_id',
        required: true,
        label: 'Partida',
        align: 'left',
        field: (row: IAccountingClosingParameterModel) =>
          `${
            isView
              ? `${row.chart?.code || ''} - ${row.chart?.name || ''}`
              : row.chart_id
          }`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'third_party_id',
        required: true,
        label: 'Tercero',
        align: 'left',
        field: (row: IAccountingClosingParameterModel) =>
          `${
            isView
              ? `${row.third_party?.document || ''} - ${row.third_party?.name}`
              : row.third_party_id
          }`,
        sortable: true,
        style: styleColumn(300),
      },
      {
        name: 'cost_center_id',
        required: true,
        label: 'Centro de costos',
        align: 'left',
        field: (row: IAccountingClosingParameterModel) =>
          isView ? `${row.cost_center?.name || '-'}` : row.cost_center_id,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'counterpart_nature',
        required: true,
        label: 'Naturaleza',
        align: 'left',
        field: (row: IAccountingClosingParameterModel) =>
          `${row.counterpart_nature}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'counterpart_chart_id',
        required: true,
        label: 'Contra partida',
        align: 'left',
        field: (row: IAccountingClosingParameterModel) =>
          `${
            isView
              ? `${row.counterpart_chart?.code || ''} - ${
                  row.counterpart_chart?.name || ''
                }`
              : row.counterpart_chart_id
          }`,
        sortable: true,
        style: styleColumn(200),
      },

      {
        name: 'counterpart_third_party_id',
        required: true,
        label: 'Tercero',
        align: 'left',
        field: (row: IAccountingClosingParameterModel) =>
          `${
            isView
              ? `${row.counterpart_third_party?.document || ''} - ${
                  row.counterpart_third_party?.name
                }`
              : row.counterpart_third_party_id
          }`,
        sortable: true,
        style: styleColumn(300),
      },
      {
        name: 'counterpart_cost_center_id',
        required: true,
        label: 'Centro de costos',
        align: 'left',
        field: (row: IAccountingClosingParameterModel) =>
          `${
            isView
              ? `${row.counterpart_cost_center?.name || '-'}`
              : row.counterpart_cost_center_id
          }`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: period_closure_parameter.value.parameters,
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const selectAccountStructure = (event: number) => {
    const selectedStructure = available_accounting_structures.value.find(
      (accountStructure) => accountStructure.id === event
    )
    _cleanPeriodClosureParametersData().finally(() => {
      informationForm.value.resetValidation()
    })
    if (selectedStructure) {
      period_closure_parameter.value.structure = selectedStructure
      _getResources(
        { accounting: ['accounting_chart_operative_by_structure'] },
        `filter[account_structures_id]=${selectedStructure.id}`
      )
      _getResources(
        { accounting: ['accounting_closing_parameter_cost_centers'] },
        `filter[accounts_chart_id]=${selectedStructure.id}`
      )
    }
  }

  const clearEvent = (row: IAccountingClosingParameterModel) => {
    row.nature = ''
    row.chart_id = 0
    row.third_party_id = 0
    row.cost_center_id = 0
    row.counterpart_nature = ''
    row.counterpart_chart_id = 0
    row.counterpart_third_party_id = 0
    row.counterpart_cost_center_id = 0
    setTimeout(() => {
      informationForm.value.resetValidation()
    }, 300)
  }

  watch(
    () => period_closure_parameter.value.parameters,
    () => {
      eventsTableProps.value.rows = period_closure_parameter.value.parameters
    }
  )

  const customColumns =
    props.action === 'view'
      ? ['actions']
      : [
          'event',
          'nature',
          'chart_id',
          'third_party_id',
          'cost_center_id',
          'counterpart_nature',
          'counterpart_chart_id',
          'counterpart_third_party_id',
          'counterpart_cost_center_id',
          'actions',
        ]

  const validateNature = (parameter: IAccountingClosingParameterModel) => {
    let isValid = !!parameter
    if (parameter?.nature === parameter?.counterpart_nature) {
      isValid = false
    }
    return isValid
  }

  const account_charts = computed(() => {
    return accounting_chart_operative_by_structure.value.map(
      (item: IResource) => ({
        ...item,
        value: item.id ?? '',
        label: `${(item as IStructure).code_name}`,
      })
    )
  })

  const selectAccount = (
    row: IAccountingClosingParameterModel,
    chart_id: number
  ) => {
    row.chart_id = chart_id
    row.cost_center_id = 0
  }

  const selectCounterpartAccount = (
    row: IAccountingClosingParameterModel,
    chart_id: number
  ) => {
    row.counterpart_chart_id = chart_id
    row.counterpart_cost_center_id = 0
  }

  const hasCostCenter = (chart_id: number) => {
    const selectedAccount = account_charts.value.find(
      (chart: IResource) => chart.id === chart_id
    )

    return !!selectedAccount?.has_cost_center
  }

  onBeforeUnmount(() => {
    _cleanPeriodClosureParametersData()
  })

  return {
    period_closure_parameter,
    account_closing_natures,
    available_accounting_structures,
    account_charts,
    accounting_closing_parameter_third_parties,
    accounting_closing_parameter_cost_centers,
    eventsTableProps,
    informationForm,
    selectedAccountStructure,
    customColumns,
    selectAccountStructure,
    selectAccount,
    selectCounterpartAccount,
    clearEvent,
    validateNature,
    hasCostCenter,
  }
}

export default useInformationForm
