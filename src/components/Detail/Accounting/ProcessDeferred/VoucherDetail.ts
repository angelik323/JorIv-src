import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { QTable } from 'quasar'
import { IVoucherDetail } from '@/interfaces/customs'

import { useProcessDeferredStore } from '@/stores'

const useProcessDeferredList = () => {
  const { selected_deferred_voucher } = storeToRefs(
    useProcessDeferredStore('v1')
  )

  const styleColumn = (width: number = 200) => ({
    'white-space': 'pre-wrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-wrap': 'break-word',
  })

  const tableProps = ref({
    loading: false,
    columns: [
      {
        name: 'account',
        required: false,
        label: 'Cuenta',
        align: 'left',
        field: (row: IVoucherDetail) => `${row.account_chart.code}`,
        sortable: true,
      },
      {
        name: 'account_name',
        required: true,
        label: 'Nombre de cuenta',
        align: 'left',
        field: (row: IVoucherDetail) => `${row.account_chart.name}`,
        sortable: true,
      },
      {
        name: 'third_party',
        required: true,
        label: 'Auxiliar',
        align: 'left',
        field: (row: IVoucherDetail) =>
          `${row.third_party.document_type} - ${row.third_party.document} - ${
            row.third_party.name ?? ''
          }`,
        sortable: true,
      },
      {
        name: 'cost_center',
        required: true,
        label: 'Centro de costo',
        align: 'left',
        field: (row: IVoucherDetail) =>
          `${row.cost_center?.code ?? ''} -${row.cost_center?.name ?? ''}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'debit',
        required: true,
        label: 'Débito',
        align: 'left',
        field: (row: IVoucherDetail) => `${row.debit}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'credit',
        required: true,
        label: 'Crédito',
        align: 'left',
        field: (row: IVoucherDetail) => `${row.credit}`,
        sortable: true,
      },
      {
        name: 'details',
        required: true,
        label: 'Detalles del registro',
        align: 'center',
        field: (row: IVoucherDetail) => `${row.detail}`,
      },
    ] as QTable['columns'],
    rows: [] as IVoucherDetail[],
  })

  watch(
    () => selected_deferred_voucher.value,
    () => {
      if (!selected_deferred_voucher.value?.voucher_details) return
      tableProps.value.rows = selected_deferred_voucher.value.voucher_details
    }
  )

  onMounted(() => {
    if (!selected_deferred_voucher.value?.voucher_details) return
    tableProps.value.rows = selected_deferred_voucher.value.voucher_details
  })

  return {
    // Props
    tableProps,
    selected_deferred_voucher,
  }
}

export default useProcessDeferredList
