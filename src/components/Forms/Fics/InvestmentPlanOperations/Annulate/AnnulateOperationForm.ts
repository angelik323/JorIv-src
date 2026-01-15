// Vue - Pinia - Quasar
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IInvestmentPlanOperationDetail } from '@/interfaces/customs/fics/InvestmentPlanOperations'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useInvestmentPlanOperationStore } from '@/stores/fics/investment-plan-operations'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'

const useAnnulateOperationDetailForm = () => {
  const {
    operation_collection_types: type_receive,
    banks,
    bank_account,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const styleColumn = (width: number = 200) => ({
    'white-space': 'nowrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'text-overflow': 'ellipsis',
  })

  const tableProps = ref({
    title: 'Detalle de operación de registro',
    loading: false,
    columns: [
      {
        name: 'radio',
        required: false,
        label: '',
        align: 'left',
        field: 'id',
        sortable: true,
        style: styleColumn(50),
      },
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
        style: styleColumn(50),
      },
      {
        name: 'collection_type',
        required: true,
        label: 'Forma de pago/recaudo',
        align: 'left',
        field: (row: IInvestmentPlanOperationDetail) =>
          `${row.collection_form}`,
        sortable: true,
        style: styleColumn(150),
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción forma de pago/recaudo',
        align: 'left',
        field: (row: IInvestmentPlanOperationDetail) =>
          `${row.collection_form}`,
        sortable: true,
      },
      {
        name: 'value',
        required: true,
        label: 'Valor pago/recaudo',
        align: 'left',
        field: (row: IInvestmentPlanOperationDetail) =>
          `${useUtils().formatCurrency(row.value)}`,
        sortable: true,
        style: styleColumn(150),
      },
      {
        name: 'check',
        required: true,
        label: 'Cheque',
        align: 'left',
        field: (row: IInvestmentPlanOperationDetail) => `${row.check || '-'}`,
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IInvestmentPlanOperationDetail[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const selectedRow = ref()

  const selectDetail = (selected: IInvestmentPlanOperationDetail) => {
    tableProps.value.rows.forEach((row) => {
      row.selected = false
      if (row === selected) {
        row.selected = true
      }
    })
    selectedRow.value = selected
  }

  const totalValue = computed(() =>
    tableProps.value.rows.reduce(
      (accumulator: number, item: IInvestmentPlanOperationDetail) => {
        return !isNaN(Number(item.value))
          ? accumulator + Number(item.value)
          : accumulator
      },
      0
    )
  )

  const operationDetailForm = ref()

  const validateDetailData = () => {
    return operationDetailForm.value?.validate()
  }

  const getFormData = () => {
    return selectedRow.value
  }

  const { investment_plan_operation } = storeToRefs(
    useInvestmentPlanOperationStore('v1')
  )

  watch(
    () => investment_plan_operation.value,
    () => {
      tableProps.value.rows = investment_plan_operation.value.details || []
    },
    { deep: true }
  )

  return {
    banks,
    tableProps,
    totalValue,
    selectedRow,
    type_receive,
    bank_account,
    investment_plan_operation,
    getFormData,
    selectDetail,
    validateDetailData,
  }
}

export default useAnnulateOperationDetailForm
