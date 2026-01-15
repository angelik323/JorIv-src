import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { QTable } from 'quasar'
import { ActionType, IResource } from '@/interfaces/global'
import {
  IDeferredDataModel,
  IParameter,
  IVoucherParameter,
} from '@/interfaces/customs'

import { useAccountingResourceStore, useScheduleDeferralStore } from '@/stores'

const useAutomaticVoucherParameterForm = (props: {
  action: ActionType
  id?: number
  data: IDeferredDataModel
}) => {
  const { schedule_deferral } = storeToRefs(useScheduleDeferralStore('v1'))

  const {
    third_parties_label: third_parties,
    deferred_receipt_types: receipt_types,
    cost_center_codes_by_structure: cost_centers,
    accounting_chart_operative_by_structure: account_charts,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const automaticVoucherParameterForm = ref()

  const styleColumn = (width: number = 200) => ({
    'white-space': 'pre-wrap',
    width: `${width}px`,
    'overflow-wrap': 'break-word',
  })

  const parameters = ref<IParameter[]>([])

  watch(parameters.value, (val) => {
    schedule_deferral.value.parameters = val
  })

  const columns = [
    {
      name: 'id',
      required: true,
      label: '#',
      align: 'left',
      field: 'id',
      style: styleColumn(200),
      sortable: true,
    },
    {
      name: 'receipt_type',
      required: true,
      label: 'Tipo de comprobante',
      align: 'left',
      field: (row: IVoucherParameter) => `${row.receipt_type?.code}`,
      sortable: true,
    },
    {
      name: 'sub_receipt_type',
      required: true,
      label: 'Sub tipo de comprobante',
      align: 'left',
      field: (row: IVoucherParameter) => `${row.sub_receipt_type?.code}`,
      sortable: true,
    },
    {
      name: 'percentage',
      required: true,
      label: 'Porcentaje (%)*',
      align: 'left',
      field: (row: IVoucherParameter) => `${Number(row.percentage)}%`,
      sortable: true,
    },
    {
      name: 'counterpart_chart',
      required: true,
      label: 'Cuenta contrapartida*',
      align: 'left',
      field: (row: IVoucherParameter) =>
        `${row.counterpart_account?.account?.code} - ${row.counterpart_account?.account?.name}`,
      sortable: true,
    },
    {
      name: 'counterpart_aux',
      required: true,
      label: 'Auxiliar contrapartida*',
      align: 'left',
      field: (row: IVoucherParameter) =>
        `${row.counterpart_auxiliary?.document} - ${
          row.counterpart_auxiliary?.name ?? ''
        }`,
      sortable: true,
    },
    {
      name: 'counterpart_cost_center',
      required: true,
      label: 'Centro de costo contrapartida*',
      align: 'left',
      field: (row: IVoucherParameter) =>
        `${row.counterpart_cost_center?.code ?? ''} - ${
          row.counterpart_cost_center?.name ?? ''
        }`,
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
  ]

  const adjustedColumns =
    props.action !== 'view'
      ? columns
      : columns.filter((col) => col.name !== 'actions')

  const parameterTableProps = ref({
    title: 'Listado',
    loading: false,
    columns: adjustedColumns as QTable['columns'],
    rows: [] as IParameter[] | IVoucherParameter[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const basicData = ref({
    installments: 0,
    installment_amount: '',
    start_period: '',
  })

  const changeQuota = (quotas: number) => {
    if (!props.data.voucher_data) return
    basicData.value.installments = Number(quotas)
    const totalValue =
      props.data.voucher_data.nature === 'Débito'
        ? Number(props.data.voucher_data.debit)
        : Number(props.data.voucher_data.credit)
    const divisor = quotas > 0 ? quotas : 1

    basicData.value.installment_amount = `${totalValue / divisor}`
  }

  const selectReceiptType = (row: IParameter, receiptTypeId: number) => {
    row.receipt_type_id = receiptTypeId
    row.sub_receipt_type_id = 0
  }

  const subReceiptTypesByParent = (receiptTypeId: number) => {
    const receiptType = receipt_types.value.find(
      (type) => type.value === receiptTypeId
    )
    return receiptType ? receiptType.related : []
  }

  const percentage = ref<number>()

  const validatePercentage = () => {
    let totalPercentage = 0
    for (const param of parameters.value) {
      totalPercentage += Number(param.percentage)
    }
    percentage.value = totalPercentage
    return totalPercentage === 100 ? true : ''
  }

  const hasCostCenter = (row: IParameter, chart_id: number) => {
    row.counterpart_cost_center_id = 0
    const selectedAccount = account_charts.value.find(
      (chart: IResource) => chart.value === chart_id
    )

    return !!selectedAccount?.has_cost_center
  }

  const validateScheduleDeferral = () => {
    return automaticVoucherParameterForm.value?.validate()
  }

  const getPayloadData = () => {
    return { ...basicData.value, parameters: parameters.value }
  }

  const addParameter = () => {
    parameters.value.push({
      receipt_type_id: 0,
      sub_receipt_type_id: 0,
      percentage: 0,
      counterpart_account_id: 0,
      counterpart_auxiliary_id: 0,
      counterpart_cost_center_id: 0,
    })
  }

  const deleteParameter = (row: IParameter) => {
    const index = parameterTableProps.value.rows.indexOf(row)
    if (index > -1) {
      parameterTableProps.value.rows.splice(index, 1)
    }
  }

  onMounted(() => {
    if (props.action === 'create') {
      addParameter()
      parameterTableProps.value.rows = parameters.value
    } else {
      basicData.value.installment_amount = `${props.data.installment_amount}`
      basicData.value.installments = props.data.installments ?? 0
      basicData.value.start_period = `${props.data.start_period}`
      props.data.parameters.forEach((parameter: IParameter) => {
        parameters.value.push(parameter)
      })
      changeQuota(basicData.value.installments)
      validatePercentage()
      if (props.action === 'view') {
        parameterTableProps.value.rows = schedule_deferral.value.parameters
      } else {
        parameterTableProps.value.rows = parameters.value
      }
    }
  })

  return {
    automaticVoucherParameterForm,
    parameterTableProps,
    schedule_deferral,
    receipt_types,
    third_parties,
    account_charts,
    cost_centers,
    percentage,
    basicData,
    subReceiptTypesByParent,
    addParameter,
    deleteParameter,
    changeQuota,
    selectReceiptType,
    validatePercentage,
    hasCostCenter,
    getPayloadData,
    validateScheduleDeferral,
  }
}

export default useAutomaticVoucherParameterForm
