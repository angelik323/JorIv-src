// Core
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useUtils } from '@/composables'

// Interfaces
import { ActionType, IBaseTableProps, IResource } from '@/interfaces/global'
import { IStructure } from '@/interfaces/customs/treasury/CollectionAccountingBlocks'
import { IAccountStructureResource } from '@/interfaces/customs/accounting/AccountStructure'
import {
  IAccountingClosingParamsResponse,
  IAccountingDailyClosingParameterModel,
} from '@/interfaces/customs/accounting/PeriodClosureParameter'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { usePeriodClosureParametersStore } from '@/stores/accounting/period-closure-parameters'

const useInformationForm = (props: {
  action: ActionType
  id?: number
  data?: IAccountingClosingParamsResponse
}) => {
  const {
    sub_receipt_types,
    account_closing_events,
    closing_third_party_types,
    account_closing_natures_full: account_closing_natures,
    account_structures_for_params: available_accounting_structures,
    accounting_chart_operative_by_structure,
    accounting_closing_parameter_third_parties,
    accounting_closing_parameter_third_parties_format,
    accounting_closing_parameter_cost_centers,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { _cleanPeriodClosureParametersData } =
    usePeriodClosureParametersStore('v2')

  const { _getResources } = useResourceManagerStore('v1')

  const { defaultIconsLucide } = useUtils()

  const informationForm = ref()

  const hasDailyParams = ref(false)
  const hasMonthlyParams = ref(false)
  const hasYearlyParams = ref(false)

  const isView = computed(() => props.action === 'view')

  const selectedAccountStructure = ref<IAccountStructureResource | undefined>()

  const dailyTableProps = ref<
    IBaseTableProps<IAccountingDailyClosingParameterModel>
  >({
    title: 'Parámetros de cierre diario',
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
        field: (row) => `${row.event || '-'}`,
        sortable: true,
      },
      {
        name: 'nature',
        required: true,
        label: 'Naturaleza',
        align: 'left',
        field: (row) => `${row.nature || '-'}`,
        sortable: true,
      },
      {
        name: 'accounts_chart_id',
        required: true,
        label: 'Partida contable',
        align: 'left',
        field: (row) =>
          `${isView ? `${row.account?.label || '-'}` : row.account?.id}`,
        sortable: true,
      },
      {
        name: 'third_party_type',
        required: true,
        label: 'Tercero',
        align: 'left',
        field: (row) =>
          `${isView ? `${row.third_party_type || '-'}` : row.third_party_type}`,
        sortable: true,
      },
      {
        name: 'third_party_id',
        required: true,
        label: 'Tercero específico',
        align: 'left',
        field: (row) =>
          `${isView ? `${row.third_party?.label || '-'}` : row.third_party_id}`,
        sortable: true,
      },
      {
        name: 'counterpart_accounts_chart_id',
        required: true,
        label: 'Contra partida',
        align: 'left',
        field: (row) =>
          `${
            isView
              ? `${row.counterpart_account?.label || '-'}`
              : row.counterpart_accounts_chart_id
          }`,
        sortable: true,
      },

      {
        name: 'counterpart_third_party_type',
        required: true,
        label: 'Tercero',
        align: 'left',
        field: (row) =>
          `${
            isView
              ? `${row.counterpart_third_party_type || '-'}`
              : row.counterpart_third_party_type
          }`,
        sortable: true,
      },
      {
        name: 'counterpart_third_party_id',
        required: true,
        label: 'Tercero específico',
        align: 'left',
        field: (row) =>
          `${
            isView
              ? `${row.counterpart_third_party?.label || '-'} `
              : row.counterpart_third_party_id
          }`,
        sortable: true,
      },
      {
        name: 'sub_receipt_type_id',
        required: true,
        label: 'Subtipo de comprobante',
        align: 'left',
        field: (row) =>
          `${
            isView
              ? `${row.sub_receipt_type?.label || '-'}`
              : row.sub_receipt_type_id
          }`,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const monthlyTableProps = ref({
    ...dailyTableProps.value,
    title: 'Parámetros de cierre mensual',
  })

  const yearlyTableProps = ref({
    ...dailyTableProps.value,
    columns: dailyTableProps.value.columns.filter(
      (column) =>
        ![
          'counterpart_accounts_chart_id',
          'counterpart_third_party_type',
          'counterpart_third_party_id',
        ].includes(column.name)
    ),
    title: 'Parámetros de cierre anual',
  })

  const customColumns =
    props.action === 'view'
      ? ['actions']
      : [
          'event',
          'nature',
          'accounts_chart_id',
          'third_party_type',
          'third_party_id',
          'counterpart_accounts_chart_id',
          'counterpart_third_party_type',
          'counterpart_third_party_id',
          'sub_receipt_type_id',
          'actions',
        ]

  const models = ref<{
    structure_id: null | number
    daily_parameters: IAccountingDailyClosingParameterModel[]
    monthly_parameters: IAccountingDailyClosingParameterModel[]
    yearly_parameters: IAccountingDailyClosingParameterModel[]
  }>({
    structure_id: null,
    daily_parameters: [],
    monthly_parameters: [],
    yearly_parameters: [],
  })

  const getClearParams = () => {
    return [
      {
        event: null,
        nature: null,
        accounts_chart_id: null,
        third_party_type: null,
        third_party_id: null,
        counterpart_accounts_chart_id: null,
        counterpart_third_party_type: null,
        counterpart_third_party_id: null,
        sub_receipt_type_id: null,
      },
      {
        event: null,
        nature: null,
        accounts_chart_id: null,
        third_party_type: null,
        third_party_id: null,
        counterpart_accounts_chart_id: null,
        counterpart_third_party_type: null,
        counterpart_third_party_id: null,
        sub_receipt_type_id: null,
      },
    ]
  }

  watch(
    () => hasDailyParams.value,
    () => {
      if (hasDailyParams.value && !models.value.daily_parameters.length) {
        models.value.daily_parameters = getClearParams()
      }
      dailyTableProps.value.rows = models.value.daily_parameters
    }
  )

  watch(
    () => hasMonthlyParams.value,
    () => {
      if (hasMonthlyParams.value && !models.value.monthly_parameters.length) {
        models.value.monthly_parameters = getClearParams()
      }
      monthlyTableProps.value.rows = models.value.monthly_parameters
    }
  )

  watch(
    () => hasYearlyParams.value,
    () => {
      if (hasYearlyParams.value && !models.value.yearly_parameters.length) {
        models.value.yearly_parameters = getClearParams()
      }
      yearlyTableProps.value.rows = models.value.yearly_parameters
    }
  )

  const selectAccountStructure = (structure_id: number) => {
    selectedAccountStructure.value = available_accounting_structures.value.find(
      (accountStructure) => accountStructure.id === structure_id
    )

    hasDailyParams.value = false
    models.value.daily_parameters = []
    dailyTableProps.value.rows = models.value.daily_parameters
    hasMonthlyParams.value = false
    models.value.monthly_parameters = []
    monthlyTableProps.value.rows = models.value.monthly_parameters
    hasYearlyParams.value = false
    models.value.yearly_parameters = []
    yearlyTableProps.value.rows = models.value.yearly_parameters

    informationForm.value.resetValidation()

    if (selectedAccountStructure.value) {
      models.value.structure_id = selectedAccountStructure.value.id
      _getResources(
        { accounting: ['accounting_chart_operative_by_structure'] },
        `filter[account_structures_id]=${selectedAccountStructure.value.id}`
      )
    }
  }

  const clearEvent = (row: IAccountingDailyClosingParameterModel) => {
    row.event = null
    row.nature = null
    row.accounts_chart_id = null
    row.third_party_type = null
    row.third_party_id = null
    row.counterpart_accounts_chart_id = null
    row.counterpart_third_party_type = null
    row.counterpart_third_party_id = null
    row.sub_receipt_type_id = null
    setTimeout(() => {
      informationForm.value.resetValidation()
    }, 300)
  }

  const validateEvent = (
    parameters: IAccountingDailyClosingParameterModel[]
  ) => {
    let isValid = true
    if (parameters[0].event === parameters[1].event) {
      isValid = false
    }
    return isValid || ''
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

  watch(
    () => props.data,
    () => {
      if (props.data && props.data.structure) {
        models.value.structure_id = props.data.structure.id
        selectedAccountStructure.value = props.data.structure

        hasDailyParams.value = !!props.data.parameters.daily_parameters.length
        hasMonthlyParams.value =
          !!props.data.parameters.monthly_parameters.length
        hasYearlyParams.value = !!props.data.parameters.yearly_parameters.length

        models.value.daily_parameters = props.data.parameters.daily_parameters
        dailyTableProps.value.rows = models.value.daily_parameters

        models.value.monthly_parameters =
          props.data.parameters.monthly_parameters
        monthlyTableProps.value.rows = models.value.monthly_parameters

        models.value.yearly_parameters = props.data.parameters.yearly_parameters
        yearlyTableProps.value.rows = models.value.yearly_parameters
      }
    }
  )

  onBeforeUnmount(() => {
    _cleanPeriodClosureParametersData()
  })

  return {
    models,
    customColumns,
    account_charts,
    hasDailyParams,
    dailyTableProps,
    informationForm,
    hasYearlyParams,
    hasMonthlyParams,
    yearlyTableProps,
    monthlyTableProps,
    sub_receipt_types,
    defaultIconsLucide,
    account_closing_events,
    account_closing_natures,
    selectedAccountStructure,
    closing_third_party_types,
    available_accounting_structures,
    accounting_closing_parameter_third_parties,
    accounting_closing_parameter_cost_centers,
    accounting_closing_parameter_third_parties_format,
    clearEvent,
    validateEvent,
    selectAccountStructure,
  }
}

export default useInformationForm
