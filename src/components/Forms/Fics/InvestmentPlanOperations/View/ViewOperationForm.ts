// Vue - pinia
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { QTable } from 'quasar'

// Interfaces
import {
  IMonetaryOperation,
  IMonetaryOperationDetail,
} from '@/interfaces/customs/fics/InvestmentPlanOperations'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useInvestmentPlanOperationStore } from '@/stores/fics/investment-plan-operations'

const useViewOperationDetailForm = (props: { data: IMonetaryOperation }) => {
  const { formatCurrency, defaultIconsLucide } = useUtils()
  const { monetary_operations_list } = storeToRefs(
    useInvestmentPlanOperationStore('v1')
  )

  const selectedRow = ref<IMonetaryOperationDetail | null>(null)
  const modalDetailRef = ref()

  const formData = ref<IMonetaryOperation>({
    id: 0,
    operation_number: 0,
    operation_request: 0,
    operation_value: 0,
    type: '',
    request_date: '',
    compliance_date: '',
    closing_date: null,
    investment_plan: '',
    plan_balance: '',
    maximum_value: 0,
    business_trust_code: '',
    business_trust_name: '',
    plan_business_trust_code: '',
    fund_code: '',
    fund_name: '',
    office: '',
    office_code: '',
    holder_identification: '',
    holder_name: '',
  })

  const baseColumns: QTable['columns'] = [
    {
      name: 'radio',
      label: '',
      align: 'center',
      field: 'id',
    },
    {
      name: 'id',
      label: '#',
      align: 'center',
      field: 'id',
      sortable: true,
    },
    {
      name: 'collection_form',
      label: 'Forma de recaudo',
      align: 'left',
      field: (row: IMonetaryOperationDetail) => row.collection_form ?? '-',
      sortable: true,
    },
    {
      name: 'collection_bank',
      label: 'Descripción forma de recaudo',
      align: 'left',
      field: (row: IMonetaryOperationDetail) => row.collection_bank ?? '-',
      sortable: true,
    },
    {
      name: 'value',
      label: 'Valor',
      align: 'left',
      field: (row: IMonetaryOperationDetail) =>
        formatCurrency(row.value) ?? '-',
      sortable: true,
    },
    {
      name: 'check',
      label: 'Cheque',
      align: 'left',
      field: (row: IMonetaryOperationDetail) => row.check ?? '-',
      sortable: true,
    },
    {
      name: 'check_bank',
      label: 'Banco cheque',
      align: 'left',
      field: (row: IMonetaryOperationDetail) => row.check_bank ?? '-',
      sortable: true,
    },
  ]

  const withdrawalColumns: QTable['columns'] = [
    {
      name: 'radio',
      label: '',
      align: 'center',
      field: 'id',
    },
    {
      name: 'id',
      label: '#',
      align: 'center',
      field: 'id',
      sortable: true,
    },
    {
      name: 'collection_form',
      label: 'Forma de recaudo',
      align: 'left',
      field: (row: IMonetaryOperationDetail) => row.collection_form ?? '-',
      sortable: true,
    },
    {
      name: 'collection_bank',
      label: 'Descripción forma de recaudo',
      align: 'left',
      field: (row: IMonetaryOperationDetail) => row.collection_bank ?? '-',
      sortable: true,
    },
    {
      name: 'value',
      label: 'Valor',
      align: 'left',
      field: (row: IMonetaryOperationDetail) =>
        formatCurrency(row.value) ?? '-',
      sortable: true,
    },
    {
      name: 'account',
      label: 'Inscrita',
      align: 'left',
      field: (row: IMonetaryOperationDetail) => row.fic_account ?? '-',
      sortable: true,
    },
  ]

  const tableProps = ref({
    title: 'Detalle de la operación',
    loading: false,
    columns: baseColumns as QTable['columns'],
    rows: [] as IMonetaryOperationDetail[],
    rowsLength: [0],
  })

  const selectDetail = (selected: IMonetaryOperationDetail) => {
    tableProps.value.rows = tableProps.value.rows.map((row) => ({
      ...row,
      selected: row.id === selected.id,
    }))
    selectedRow.value = { ...selected }
  }

  const openDetailModal = (row: IMonetaryOperationDetail) => {
    selectedRow.value = { ...row }
    modalDetailRef.value?.openModal()
  }

  watch(
    () => formData.value.type,
    (newType) => {
      if (newType === 'retiro')
        tableProps.value.columns = [
          ...withdrawalColumns,
          {
            name: 'actions',
            label: 'Cuenta',
            align: 'center',
            field: 'actions',
          },
        ]
      else tableProps.value.columns = [...baseColumns]
    },
    { immediate: true }
  )

  watch(
    [() => props.data, () => monetary_operations_list.value],
    ([newData, newList]) => {
      if (newData) {
        formData.value = { ...newData }
      }

      tableProps.value.rows = Array.isArray(newList) ? [...newList] : []
    },
    { deep: true, immediate: true }
  )

  return {
    formData,
    tableProps,
    selectedRow,
    selectDetail,
    formatCurrency,
    modalDetailRef,
    openDetailModal,
    defaultIconsLucide,
  }
}

export default useViewOperationDetailForm
