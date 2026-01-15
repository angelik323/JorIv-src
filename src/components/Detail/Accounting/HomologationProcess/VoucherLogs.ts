import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { QTable } from 'quasar'
import { IHomologationProcessVoucher } from '@/interfaces/customs'

import { useUtils } from '@/composables'

import { useHomologationProcessStore } from '@/stores'

const useVoucherLogs = () => {
  const { homologation_process_history } = storeToRefs(
    useHomologationProcessStore('v1')
  )

  const styleColumn = (width: number = 200) => ({
    'white-space': 'nowrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-x': 'hidden',
    'text-overflow': 'ellipsis',
  })

  const tableProps = ref({
    title: 'Datos del comprobante',
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
        name: 'business',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row: IHomologationProcessVoucher) => `${row.business}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'period',
        required: true,
        label: 'Periodo',
        align: 'left',
        field: (row: IHomologationProcessVoucher) => `${row.period}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'date',
        required: true,
        label: 'Fecha',
        align: 'left',
        field: (row: IHomologationProcessVoucher) =>
          `${useUtils().formatDate(row.date, 'YYYY-MM-DD')}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'origin_voucher',
        required: true,
        label: 'Comprobante origen',
        align: 'left',
        field: (row: IHomologationProcessVoucher) =>
          `${row.original_voucher_id}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'message',
        required: true,
        label: 'Novedad',
        align: 'left',
        field: (row: IHomologationProcessVoucher) => `${row.message ?? '-'}`,
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IHomologationProcessVoucher[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  watch(homologation_process_history, () => {
    tableProps.value.rows = homologation_process_history.value.logs
  })

  return {
    tableProps,
    homologation_process_history,
  }
}

export default useVoucherLogs
