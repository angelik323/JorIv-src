//Vue - Pinia
import { ref, watch, onBeforeUnmount, computed } from 'vue'
import { storeToRefs } from 'pinia'

//Interfaces
import {
  IFieldFilters,
  IRestatementGenericResource,
} from '@/interfaces/customs'
import {
  IExchangedDifferenceRestatementDataForm,
  IExchangeDifferenceRestatementFiltersVoucher,
  IExchangeDifferenceRestatementListCalculationsItem,
  IExchangeDifferenceRestatementListDetailsItem,
  IExchangeDifferenceRestatementListItemChildrenVoucher,
  IExchangeDifferenceRestatementListUndoItem,
} from '@/interfaces/customs/accounting/AccountingRestatement'
import { IBaseTableProps, ActionTypeProcess } from '@/interfaces/global'

// Stores
import { useAccountingRestatementStore } from '@/stores/accounting/accounting-restatement'
import {
  useAccountingResourceStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'

// Constants
import { consolidation_type_options } from '@/constants/resources'

// Composables
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables/useUtils'
import { useMainLoader } from '@/composables'
import { useRoute } from 'vue-router'

const useInformationForm = (
  props: {
    action: ActionTypeProcess
    data?: IExchangedDifferenceRestatementDataForm | null
  },
  emit: Function
) => {
  // Desestructuring stores and refs
  const {
    account_structures,
    business_trusts_by_structure_and_closing_type,
    status_by_id,
    accounts_chart,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const { coins } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  //Route for request
  const route = useRoute()
  const paramsRoute = route.params.id

  // Store and methods
  const {
    reexpresion_identifier_voucher_id,
    reexpresion_difference_calculation_list,
    reexpresion_difference_voucher_list,
    reexpresion_difference_undo_process_list,
    reexpresion_difference_details_list,
    pages_calculations,
    pages_undo_process,
  } = storeToRefs(useAccountingRestatementStore('v2'))

  const {
    _generateProcessExchangeDifferenceRestatement,
    _getExchangeDifferenceRestatementProcessList,
    _getExchangeDifferenceRestatementListVouchers,
    _getExchangeDifferenceRestatementListUndo,
    _exportCalculationsExchangeDifferenceRestatement,
    _exportVouchersExchangeDifferenceRestatement,
  } = useAccountingRestatementStore('v2')

  // Icons
  const { defaultIconsLucide } = useUtils()
  // Navigate
  const { goToURL } = useGoToUrl()
  // Resource manager store
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  //Loader
  const { openMainLoader } = useMainLoader()
  // Value ref definitions
  const informationFormRef = ref()
  const showFilterAndTable = ref(false)
  const businessTrustsByStructure = ref<IRestatementGenericResource[]>([])
  const businessTrustsToOptions = ref<IRestatementGenericResource[]>([])
  const fromBusinessName = ref('')
  const toBusinessName = ref('')
  const typeStatusRow = ref(false)
  const selectedRows = ref<
    IExchangeDifferenceRestatementListCalculationsItem[]
  >([])

  //Filter models for request
  const modelsFilterVoucher = ref<IExchangeDifferenceRestatementFiltersVoucher>(
    {
      period: '',
      accounting_structure_id: 0,
      from_business_code: '',
      to_business_code: '',
      generation_date: '',
      closing_type: '',
    }
  )

  // Initial model value for the form
  const initialModelValue: IExchangedDifferenceRestatementDataForm = {
    voucher_data: {
      restatement_ids: [],
      sub_receipt_type_id: 0,
    },
    undo_data: {
      ids: [],
      filter: {
        period: '',
        structure_id: 0,
        from_business: '',
        to_business: '',
        undo_date: '',
        closing_type: '',
      },
    },
    process_data: {
      proceso: '',
      fecha_proceso: '',
      periodo: '',
      estructura_contable: '',
      desde_negocio: '',
      hasta_negocio: '',
      estado: '',
      Es_proceso_de_deshacer: false,
    },
    view_data: {
      process_info: {
        name: '',
        status: '',
        date: '',
        structure: '',
      },
      restatement_detail: {
        id: 0,
        negocio: '',
        periodo: '',
        fecha: '',
        cuenta_contable: '',
        tercero: '',
        saldo_moneda_extranjera: '',
        moneda: '',
        saldo_moneda_local: '',
        trm_dia: '',
        saldo_reexpresado: '',
        diferencia: '',
        estado: '',
        novedades: [],
      },
      related_records: [],
    },
  }

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  // Model ref for the form
  const models = ref<typeof initialModelValue>({ ...initialModelValue })

  // Filter configuration for child components
  const filterConfigChildren = ref<IFieldFilters[]>([
    {
      name: 'business_trust_id',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Desde negocio',
      placeholder: 'Seleccione',
      value: null,
      options:
        props.action === 'process' || props.action === 'undo'
          ? business_trusts_by_structure_and_closing_type
          : account_structures,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'currency_id',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Moneda',
      placeholder: 'Seleccione',
      value: null,
      options: coins,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'account_id',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Cuenta contable',
      placeholder: 'Seleccione',
      value: null,
      options: accounts_chart,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'status_id',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Estado',
      placeholder: 'Seleccione',
      value: null,
      options: status_by_id,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
  ])

  // Table properties definitions
  const tablePropertiesCalculation = ref<
    IBaseTableProps<IExchangeDifferenceRestatementListCalculationsItem>
  >({
    title: 'Datos de base de cálculo',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'radio',
        required: false,
        label: '',
        align: 'left',
        field: 'id',
      },
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'period',
        required: false,
        label: 'Período',
        align: 'left',
        field: 'periodo',
        sortable: true,
      },
      {
        name: 'date',
        required: false,
        label: 'Fecha',
        align: 'left',
        field: 'fecha',
        sortable: true,
      },
      {
        name: 'accounting_account',
        required: false,
        label: 'Cuenta contable',
        align: 'left',
        field: 'cuenta_contable',
        sortable: true,
      },
      {
        name: 'third_party',
        required: false,
        label: 'Tercero',
        align: 'left',
        field: 'tercero',
        sortable: true,
      },
      {
        name: 'cash_money_foreign',
        required: false,
        label: 'Efectivo moneda extranjera',
        align: 'left',
        field: 'saldo_moneda_extranjera',
        sortable: true,
      },
      {
        name: 'money',
        required: false,
        label: 'Moneda',
        align: 'left',
        field: 'moneda',
        sortable: true,
      },
      {
        name: 'cash_money_local',
        required: false,
        label: 'Efectivo moneda local',
        align: 'left',
        field: 'saldo_moneda_local',
        sortable: true,
      },
      {
        name: 'TRM',
        required: false,
        label: 'TRM',
        align: 'left',
        field: 'trm_dia',
        sortable: true,
      },
      {
        name: 'cash_reexpresion',
        required: false,
        label: 'Reexpresión efectivo',
        align: 'left',
        field: 'saldo_reexpresado',
        sortable: true,
      },
      {
        name: 'difference_exchange',
        required: false,
        label: 'Diferencia en cambio',
        align: 'left',
        field: 'diferencia',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: (row) => row.estado?.status ?? '-',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tablePropertiesVoucher = ref<
    IBaseTableProps<IExchangeDifferenceRestatementListItemChildrenVoucher>
  >({
    title: 'Listado de comprobantes generados',
    loading: false,
    wrapCells: true,
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
        name: 'business',
        required: false,
        label: 'Negocio',
        align: 'left',
        field: 'negocio',
        sortable: true,
      },
      {
        name: 'voucher_type',
        required: false,
        label: 'Tipo de comprobante',
        align: 'left',
        field: 'tipo_comprobante',
        sortable: true,
      },
      {
        name: 'incremental_number',

        required: false,
        label: 'Consecutivo',
        align: 'left',
        field: 'consecutivo',
        sortable: true,
      },
      {
        name: 'estado',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'estado',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tableUndoProcess = ref<
    IBaseTableProps<IExchangeDifferenceRestatementListUndoItem>
  >({
    title: 'Datos de base de cálculo',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'radio',
        required: false,
        label: '',
        align: 'left',
        field: 'id',
      },
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'negocio',
        required: false,
        label: 'Negocio',
        align: 'left',
        field: 'negocio',
        sortable: true,
      },
      {
        name: 'periodo',
        required: false,
        label: 'Período',
        align: 'left',
        field: 'periodo',
        sortable: true,
      },
      {
        name: 'fecha',
        required: false,
        label: 'Fecha',
        align: 'left',
        field: 'fecha',
        sortable: true,
      },
      {
        name: 'cuenta_contable',
        required: false,
        label: 'Cuenta contable',
        align: 'left',
        field: 'cuenta_contable',
        sortable: true,
      },
      {
        name: 'tercero',
        required: false,
        label: 'Tercero',
        align: 'left',
        field: 'tercero',
        sortable: true,
      },
      {
        name: 'saldo_moneda_extranjera',
        required: false,
        label: 'Efectivo moneda extranjera',
        align: 'left',
        field: 'saldo_moneda_extranjera',
        sortable: true,
      },
      {
        name: 'moneda',
        required: false,
        label: 'Moneda',
        align: 'left',
        field: 'moneda',
        sortable: true,
      },
      {
        name: 'saldo_moneda_local',
        required: false,
        label: 'Efectivo moneda local',
        align: 'left',
        field: 'saldo_moneda_local',
        sortable: true,
      },
      {
        name: 'trm_dia',
        required: false,
        label: 'TRM',
        align: 'left',
        field: 'trm_dia',
        sortable: true,
      },
      {
        name: 'saldo_reexpresado',
        required: false,
        label: 'Reexpresión efectivo',
        align: 'left',
        field: 'saldo_reexpresado',
        sortable: true,
      },
      {
        name: 'diferencia',
        required: false,
        label: 'Diferencia en cambio',
        align: 'left',
        field: 'diferencia',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'estado',
        sortable: true,
      },
      {
        name: 'novedades',
        required: false,
        label: 'Novedades',
        align: 'left',
        field: 'novedades',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tableDetails = ref<
    IBaseTableProps<IExchangeDifferenceRestatementListDetailsItem>
  >({
    title: 'Detalle del proceso',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'negocio',
        required: false,
        label: 'Negocio',
        align: 'left',
        field: 'negocio',
        sortable: true,
      },
      {
        name: 'fecha_proceso',
        required: false,
        label: 'Fecha de proceso',
        align: 'left',
        field: 'fecha_proceso',
        sortable: true,
      },
      {
        name: 'novedad',
        required: false,
        label: 'Novedad',
        align: 'left',
        field: 'novedad',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  //Methods for tables

  const formatFiltersToString = (
    filters: Record<string, string | number>
  ): Record<string, string> => {
    return Object.fromEntries(
      Object.entries(filters).map(([k, v]) => [k, String(v)])
    )
  }

  const handleFilterSearch = async ($filters: {
    'filter[status_id]': string
    'filter[business_trust_id]': string
    'filter[account_id]': string
    'filter[currency_id]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }
    const formattedFilters = formatFiltersToString(filtersFormat.value)
    await _getExchangeDifferenceRestatementProcessList(
      reexpresion_identifier_voucher_id.value,
      formattedFilters
    )
  }
  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    const formattedFilters = formatFiltersToString(filtersFormat.value)
    await _getExchangeDifferenceRestatementProcessList(
      reexpresion_identifier_voucher_id.value,
      formattedFilters
    )
  }

  const updateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    const formattedFilters = formatFiltersToString(filtersFormat.value)
    await _getExchangeDifferenceRestatementProcessList(
      reexpresion_identifier_voucher_id.value,
      formattedFilters
    )
  }

  const handleClear = async () => {
    tablePropertiesCalculation.value.rows = []
    models.value = { ...initialModelValue }
    tableUndoProcess.value.rows = []
  }

  const clearFilters = () => {
    modelsFilterVoucher.value = {
      period: '',
      accounting_structure_id: '',
      from_business_code: '',
      to_business_code: '',
      generation_date: '',
      closing_type: '',
    }
    fromBusinessName.value = ''
    toBusinessName.value = ''
  }

  // Method to set model values based on props data

  const _setValueModel = () => {
    if (!props.data) return

    if (props.data?.process_data) {
      models.value.process_data = {
        proceso: props.data.process_data.proceso || '',
        fecha_proceso: props.data.process_data.fecha_proceso || '',
        periodo: props.data.process_data.periodo || '',
        estructura_contable: props.data.process_data.estructura_contable || '',
        desde_negocio: props.data.process_data.desde_negocio || '',
        hasta_negocio: props.data.process_data.hasta_negocio || '',
        estado: props.data.process_data.estado || '',
        Es_proceso_de_deshacer:
          props.data.process_data.Es_proceso_de_deshacer || false,
      }
    }
    if (props.data?.view_data?.process_info) {
      models.value.view_data = {
        process_info: {
          name: props.data.view_data.process_info?.name || '',
          status: props.data.view_data.process_info?.status || '',
          date: props.data.view_data.process_info?.date || '',
          structure: props.data.view_data.process_info?.structure || '',
        },
        restatement_detail: {
          id: props.data.view_data?.restatement_detail?.id || 0,
          negocio: props.data.view_data?.restatement_detail?.negocio || '',
          periodo: props.data.view_data?.restatement_detail?.periodo || '',
          fecha: props.data.view_data?.restatement_detail?.fecha || '',
          cuenta_contable:
            props.data.view_data?.restatement_detail?.cuenta_contable || '',
          tercero: props.data.view_data?.restatement_detail?.tercero || '',
          saldo_moneda_extranjera:
            props.data.view_data?.restatement_detail?.saldo_moneda_extranjera ||
            '',
          moneda: props.data.view_data?.restatement_detail?.moneda || '',
          saldo_moneda_local:
            props.data.view_data?.restatement_detail?.saldo_moneda_local || '',
          trm_dia: props.data.view_data?.restatement_detail?.trm_dia || '',
          saldo_reexpresado:
            props.data.view_data?.restatement_detail?.saldo_reexpresado || '',
          diferencia:
            props.data.view_data?.restatement_detail?.diferencia || '',
          estado: props.data.view_data?.restatement_detail?.estado || '',
          novedades: props.data.view_data?.restatement_detail?.novedades || [],
        },
      }
    }
  }

  //Filters params for requests excel and tables
  const filterParams = computed<Record<string, string>>(() => ({
    period: String(modelsFilterVoucher.value.period || ''),
    accounting_structure_id: String(
      modelsFilterVoucher.value.accounting_structure_id || ''
    ),
    from_business_code: String(
      modelsFilterVoucher.value.from_business_code || ''
    ),
    to_business_code: String(modelsFilterVoucher.value.to_business_code || ''),
    generation_date: String(modelsFilterVoucher.value.generation_date || ''),
  }))

  // Submit process for search data in reexpresion or undo process
  const restatementSubmitProcess = async () => {
    openMainLoader(true)
    if (props.action === 'undo') {
      const resp = await _getExchangeDifferenceRestatementListUndo(
        filterParams.value
      )
      showFilterAndTable.value = true
      openMainLoader(false)
      emit('changeUndo:process', resp)
      return
    }

    const resp = await _generateProcessExchangeDifferenceRestatement(
      filterParams.value
    )
    if (resp) {
      await _getExchangeDifferenceRestatementProcessList(
        reexpresion_identifier_voucher_id.value,
        filterParams.value
      )
      showFilterAndTable.value = true
      await _getExchangeDifferenceRestatementListVouchers(
        reexpresion_identifier_voucher_id.value
      )
    }
    openMainLoader(false)
  }

  const downloadExcelCalculation = async () => {
    await _exportCalculationsExchangeDifferenceRestatement(
      reexpresion_identifier_voucher_id.value,
      filterParams.value
    )
  }

  const downloadExcelVoucher = async () => {
    if (props.action === 'view') {
      await _exportVouchersExchangeDifferenceRestatement(
        Number(paramsRoute),
        filterParams.value
      )
      return
    }
    await _exportVouchersExchangeDifferenceRestatement(
      reexpresion_identifier_voucher_id.value,
      filterParams.value
    )
  }
  // Event emit for control modal process
  const openModalRef = () => emit('modal:process', true)

  // Lifecycle hook for cleanup
  onBeforeUnmount(() => {
    _resetKeys({
      accounting: ['business_trusts_by_structure_and_closing_type'],
    })
  })

  // Watchers for dynamic data fetching
  watch(
    () => modelsFilterVoucher.value.accounting_structure_id,
    async (newVal) => {
      if (!newVal) {
        businessTrustsByStructure.value = []
        modelsFilterVoucher.value.from_business_code = ''
        modelsFilterVoucher.value.to_business_code = ''
        fromBusinessName.value = ''
        toBusinessName.value = ''
        return
      }
      await _getResources(
        {
          accounting: [
            `business_trusts_by_structure_and_closing_type&filter[accounting_structure_id]=${newVal}`,
          ],
        },
        '',
        'v2'
      )
      await _getResources(
        {
          accounting: [
            `accounts_chart&filter[is_currency_reexpressed]=true&filter[type]=Operativo&filter[status_id]=1&filter[account_structure_id]=${newVal}`,
          ],
        },
        '',
        'v2'
      )
      businessTrustsByStructure.value = [
        ...business_trusts_by_structure_and_closing_type.value,
      ]
    },
    { deep: true, immediate: true }
  )

  watch(
    () => modelsFilterVoucher.value.from_business_code,
    async (newVal) => {
      if (!newVal) {
        fromBusinessName.value = ''
        businessTrustsToOptions.value = []
        modelsFilterVoucher.value.to_business_code = ''
        toBusinessName.value = ''
        return
      }

      await _getResources(
        {
          accounting: [
            `business_trusts_by_structure_and_closing_type&filter[accounting_structure_id]=${modelsFilterVoucher.value.accounting_structure_id}&filter[reference_business_id]=${newVal}`,
          ],
        },
        '',
        'v2'
      )
      businessTrustsToOptions.value = [
        ...business_trusts_by_structure_and_closing_type.value,
      ]

      const foundToBusiness = businessTrustsToOptions.value.find(
        (item) => item.value === modelsFilterVoucher.value.from_business_code
      )
      modelsFilterVoucher.value.closing_type =
        foundToBusiness?.closing_type ?? ''
      modelsFilterVoucher.value.generation_date =
        foundToBusiness?.fecha_a_generar ?? ''
      fromBusinessName.value = foundToBusiness?.name ?? ''
    },
    { deep: true, immediate: true }
  )

  watch(
    () => modelsFilterVoucher.value.to_business_code,
    (newVal) => {
      if (!newVal) {
        toBusinessName.value = ''
        return
      }
      const foundToBusiness = businessTrustsToOptions.value.find(
        (item) => item.value === modelsFilterVoucher.value.to_business_code
      )
      toBusinessName.value = foundToBusiness?.name ?? ''
    }
  )

  watch(
    () => modelsFilterVoucher.value,
    () => {
      if (models.value.undo_data) {
        if (models.value.undo_data.filter) {
          models.value.undo_data.filter.period =
            modelsFilterVoucher.value.period
          models.value.undo_data.filter.structure_id = modelsFilterVoucher.value
            .accounting_structure_id
            ? Number(modelsFilterVoucher.value.accounting_structure_id)
            : 0
          models.value.undo_data.filter.from_business = String(
            modelsFilterVoucher.value.from_business_code || ''
          )
          models.value.undo_data.filter.to_business = String(
            modelsFilterVoucher.value.to_business_code || ''
          )
          models.value.undo_data.filter.undo_date =
            modelsFilterVoucher.value.generation_date || ''
          models.value.undo_data.filter.closing_type =
            modelsFilterVoucher.value.closing_type || ''
        }
      }
    },
    { deep: true }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', useUtils().isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => reexpresion_difference_calculation_list.value,
    () => {
      tablePropertiesCalculation.value.rows = [
        ...reexpresion_difference_calculation_list.value,
      ]
      const { currentPage, lastPage } = pages_calculations.value
      tablePropertiesCalculation.value.pages = {
        currentPage: currentPage,
        lastPage: lastPage,
      }
    },
    { deep: true }
  )

  watch(
    () => reexpresion_difference_voucher_list.value,
    () => {
      tablePropertiesVoucher.value.rows = [
        ...reexpresion_difference_voucher_list.value,
      ]
    },
    { deep: true }
  )

  watch(
    () => reexpresion_difference_undo_process_list.value,
    () => {
      tableUndoProcess.value.rows = [
        ...reexpresion_difference_undo_process_list.value,
      ]
      const { currentPage, lastPage } = pages_undo_process.value
      tableUndoProcess.value.pages = {
        currentPage: currentPage,
        lastPage: lastPage,
      }
    },
    { deep: true }
  )

  watch(
    () => reexpresion_difference_details_list.value,
    () => {
      tableDetails.value.rows = [...reexpresion_difference_details_list.value]
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => selectedRows.value,
    (selected) => {
      const hasNotSuccessful = selected.some(
        (row) => row.estado?.status !== 'Exitoso'
      )
      typeStatusRow.value = hasNotSuccessful

      const selectedIds = selected
        .map((row) => row.id)
        .filter((id): id is number => typeof id === 'number')

      if (models.value.voucher_data) {
        models.value.voucher_data.restatement_ids = selectedIds
      }
      if (models.value.undo_data) {
        models.value.undo_data.ids = selectedIds
      }
    },
    { deep: true }
  )

  return {
    //Header properties and filter methods
    filterConfigChildren,
    handleClear,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
    clearFilters,
    //Tables properties
    tablePropertiesCalculation,
    tablePropertiesVoucher,
    tableDetails,
    tableUndoProcess,

    //Selectors
    account_structures,
    consolidation_type_options,
    businessTrustsByStructure,
    businessTrustsToOptions,
    toBusinessName,
    fromBusinessName,

    //States
    modelsFilterVoucher,
    showFilterAndTable,
    models,
    selectedRows,
    typeStatusRow,

    //Refs
    informationFormRef,

    //Icons
    defaultIconsLucide,

    //Functions
    restatementSubmitProcess,
    openModalRef,
    goToURL,
    downloadExcelVoucher,
    downloadExcelCalculation,
  }
}

export default useInformationForm
