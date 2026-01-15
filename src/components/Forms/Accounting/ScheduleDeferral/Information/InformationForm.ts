import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'

import { storeToRefs } from 'pinia'
import {
  IBusinessTrust,
  IDeferredBasicModel,
  IDeferredDataModel,
  IFieldFilters,
  IScheduleItem,
  IVoucherParameter,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import { useUtils } from '@/composables'
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

import {
  useScheduleDeferralStore,
  useAccountingResourceStore,
  useResourceManagerStore,
} from '@/stores'

const useInformationForm = (
  props: {
    action: ActionType
    id?: number
    data?: IDeferredBasicModel
  },
  emits: Function
) => {
  const {
    voucher_natures,
    account_structures_active_revert_vouchers: account_structures,
    deferred_schedule_business_trusts: business_trust,
    accounting_chart_operative_by_structure,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const {
    deferral_business_trust,
    business_vouchers,
    selected_voucher_data,
    schedule_deferral,
  } = storeToRefs(useScheduleDeferralStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')

  const {
    _cleanScheduleDeferralsData,
    _getBusiness,
    _getVouchers,
    _saveParameter,
    _updateParameters,
  } = useScheduleDeferralStore('v1')

  const voucherDataId = props.id || 0

  const informationForm = ref()

  const dataModel = ref<IDeferredDataModel>({
    structure_id: null,
    from_business_trust_id: null,
    to_business_trust_id: null,
    business_trust_id: null,
    voucher_data_id: null,
    installments: null,
    installment_amount: null,
    start_period: null,
    voucher_data: null,
    parameters: [],
  })

  const getAccountsAndCostCenterByStructure = (accountStructureId: number) => {
    const accountStructuresFilter = `filter[account_structures_id]=${accountStructureId}`
    _getResources(
      {
        accounting: ['accounting_chart_operative_by_structure'],
      },
      accountStructuresFilter
    ).then(() => {
      accounting_chart_operative_by_structure.value =
        accounting_chart_operative_by_structure.value.map((account_chart) => ({
          ...account_chart,
          value: account_chart.id ?? '',
        }))
    })
    _getResources(
      { accounting: ['cost_center_codes_by_structure'] },
      accountStructuresFilter
    )
  }

  const selectAccountStructure = (accountStructureId: number) => {
    if (
      !accountStructureId ||
      dataModel.value.structure_id === accountStructureId
    )
      return
    _cleanScheduleDeferralsData()
    dataModel.value.structure_id = accountStructureId
    dataModel.value.from_business_trust_id = 0
    dataModel.value.to_business_trust_id = 0
    const accountStructureFilter = `filter[account_structure_id]=${dataModel.value.structure_id}`
    _getResources(
      {
        accounting: ['deferred_impairment_business_trusts'],
      },
      accountStructureFilter
    )
    getAccountsAndCostCenterByStructure(dataModel.value.structure_id)
  }

  const loadBusiness = async () => {
    if (await informationForm.value.validate()) {
      scheduleTableProps.value.rows = []
      dataModel.value.business_trust_id = null
      filtersFormat.value = {
        ...filtersFormat.value,
        'filter[account_structure_id]': dataModel.value.structure_id ?? '',
        'filter[from_business_trust_id]':
          dataModel.value.from_business_trust_id ?? '',
        'filter[to_business_trust_id]':
          dataModel.value.to_business_trust_id ?? '',
        rows: businessPerPage,
        page: 1,
      }
      const params = formatParamsCustom(filtersFormat.value)
      listBusiness(params)
    }
  }

  const listBusiness = (params: string) => {
    _getBusiness(params)
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 q-pt-none',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o nombre',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      ...$filters,
    }

    if (!$filters['filter[search]']) {
      delete filtersFormat.value['filter[search]']
    }

    const queryString = formatParamsCustom(filtersFormat.value)

    listBusiness(queryString ? '&' + queryString : '')
  }

  let businessPerPage = 20

  const updateBusinessPage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: businessPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listBusiness(queryString ? '&' + queryString : '')
  }

  const updateBusinessPerPage = (rowsPerPage: number) => {
    businessPerPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: businessPerPage,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listBusiness(queryString ? '&' + queryString : '')
  }

  const styleColumn = (width: number = 200) => ({
    'white-space': 'pre-wrap',
    width: `${width}px`,
    'overflow-wrap': 'break-word',
  })

  const businessTableProps = ref({
    loading: false,
    columns: [
      {
        name: 'check',
        required: true,
        label: '',
        align: 'left',
        field: 'check',
        style: styleColumn(200),
      },
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'business',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row: IBusinessTrust) => `${row.business_code} - ${row.name}`,
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IBusinessTrust[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  watch(deferral_business_trust, (val) => {
    businessTableProps.value.rows = val.list
    businessTableProps.value.pages = val.pages
  })

  const selectBusinessTrust = async (rowId: number, value: boolean) => {
    scheduleTableProps.value.rows = []
    if (value) {
      dataModel.value.business_trust_id = rowId
      scheduleTableProps.value.loading = true
      await _getVouchers(`filter[business_trust_id]=${rowId}`)
      scheduleTableProps.value.loading = false
    } else if (dataModel.value.business_trust_id === rowId) {
      dataModel.value.business_trust_id = 0
    }
  }

  let schedulePerPage = 20

  const scheduleTableProps = ref({
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        style: styleColumn(200),
      },
      {
        name: 'period',
        required: false,
        label: 'Periodo',
        align: 'left',
        field: (row: IScheduleItem) =>
          row?.period
            ? useUtils().formatDate(row.period, 'YYYY-MM', 'MM/YYYY')
            : '',
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'receipt_type',
        required: true,
        label: 'Tipo de comprobante',
        align: 'left',
        field: (row: IScheduleItem) => `${row.receipt_type.code}`,
        sortable: true,
      },
      {
        name: 'sub_receipt_type',
        required: true,
        label: 'Sub tipo de comprobante',
        align: 'left',
        field: (row: IScheduleItem) => `${row.sub_receipt_type.code}`,
        sortable: true,
      },
      {
        name: 'serial',
        required: true,
        label: 'Consecutivo',
        align: 'left',
        field: (row: IScheduleItem) => `${row.consecutive}`,
        sortable: true,
      },
      {
        name: 'register',
        required: true,
        label: 'Registro',
        align: 'left',
        field: (row: IScheduleItem) => `${row.voucher_data_id}`,
        sortable: true,
      },
      {
        name: 'account',
        required: true,
        label: 'Cuenta',
        align: 'left',
        field: (row: IScheduleItem) => `${row.account.code}`,
        sortable: true,
      },
      {
        name: 'third_party',
        required: true,
        label: 'Auxiliar',
        align: 'left',
        field: (row: IScheduleItem) => `${row.third_party.document}`,
        sortable: true,
      },
      {
        name: 'detail',
        required: true,
        label: 'Detalle',
        align: 'left',
        field: (row: IScheduleItem) => `${row.register_detail}`,
        sortable: true,
      },
      {
        name: 'value',
        required: true,
        label: 'Valor',
        align: 'left',
        field: (row: IScheduleItem) =>
          row.nature === 'Débito'
            ? `${useUtils().formatCurrencyString(row.debit)}`
            : `${useUtils().formatCurrencyString(row.credit)}`,
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row: IScheduleItem) => `${row?.status?.id}`,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IScheduleItem[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const voucherFilterFormat = ref<Record<string, string | number>>({})

  const updateVouchersPage = (page: number) => {
    voucherFilterFormat.value = {
      ...voucherFilterFormat.value,
      'filter[business_trust_id]': dataModel.value.business_trust_id ?? '',
      page: page,
      rows: schedulePerPage,
    }
    const queryString = formatParamsCustom(voucherFilterFormat.value)

    listVouchers(queryString ? '&' + queryString : '')
  }

  const updateVouchersPerPage = (rowsPerPage: number) => {
    schedulePerPage = rowsPerPage
    voucherFilterFormat.value = {
      ...voucherFilterFormat.value,
      'filter[business_trust_id]': dataModel.value.business_trust_id ?? '',
      rows: schedulePerPage,
      page: 1,
    }
    const queryString = formatParamsCustom(voucherFilterFormat.value)

    listVouchers(queryString ? '&' + queryString : '')
  }

  const listVouchers = (params: string) => {
    _getVouchers(params)
  }

  watch(business_vouchers, (val) => {
    scheduleTableProps.value.rows = val.list
    scheduleTableProps.value.pages = val.pages
  })

  const validateScheduleDeferral = () => {
    return informationForm.value?.validate()
  }

  const editParameter = (parameter: IScheduleItem) => {
    selected_voucher_data.value = parameter
    dataModel.value.voucher_data = parameter
    parameterModalRef.value.openModal()
  }

  const parameterModalRef = ref()
  const parameterFormRef = ref()

  const prepareParametersData = () => {
    const deferredData = {
      voucher_data_id:
        props.action === 'create'
          ? selected_voucher_data.value.voucher_data_id
          : undefined,
      parameters: [] as IVoucherParameter[],
    }

    const automaticVoucherFormData = parameterFormRef.value.getFormData()

    automaticVoucherFormData.parameters.forEach(
      (parameter: IVoucherParameter) => {
        const paramData = {
          ...parameter,
          installments: automaticVoucherFormData.installments,
          installment_amount: automaticVoucherFormData.installment_amount,
          start_period: automaticVoucherFormData.start_period,
        }
        if (paramData.counterpart_cost_center_id === 0) {
          delete paramData.counterpart_cost_center_id
        }
        deferredData.parameters.push(paramData)
      }
    )
    return deferredData
  }

  const saveParameter = async () => {
    if (!(await parameterFormRef.value.validateForm())) return
    const deferredData = prepareParametersData()
    _saveParameter(deferredData).then((success) => {
      if (!success) return
      parameterModalRef.value.closeModal()
      emits('saved')
    })
  }

  const updateParameter = async () => {
    if (!(await parameterFormRef.value.validateForm())) return
    const deferredData = prepareParametersData()
    _updateParameters(voucherDataId, deferredData).then((success) => {
      if (success) {
        emits('saved')
      }
    })
  }

  onMounted(() => {
    if (props.action === 'create') return
    dataModel.value.parameters = props.data!.parameters
    dataModel.value.installment_amount = Number(props.data!.installment_amount)
    dataModel.value.installments = props.data!.installments
    dataModel.value.start_period = props.data!.start_period
    dataModel.value.voucher_data = props.data!.voucher_data
    if (props.action !== 'view' && schedule_deferral.value.voucher_data) {
      getAccountsAndCostCenterByStructure(
        schedule_deferral.value.voucher_data.account_structure.id
      )
    }
  })

  onBeforeUnmount(() => {
    _cleanScheduleDeferralsData()
  })

  return {
    informationForm,
    filterConfig,
    businessTableProps,
    scheduleTableProps,
    voucher_natures,
    account_structures,
    business_trust,
    parameterModalRef,
    parameterFormRef,
    dataModel,
    schedule_deferral,
    validateScheduleDeferral,
    selectAccountStructure,
    selectBusinessTrust,
    loadBusiness,
    handleFilter,
    updateBusinessPage,
    updateBusinessPerPage,
    updateVouchersPage,
    updateVouchersPerPage,
    saveParameter,
    editParameter,
    updateParameter,
  }
}

export default useInformationForm
