import { useMainLoader } from '@/composables'
import { IAccountingVoucher } from '@/interfaces/customs'
import { useCheckTreasuryReceiptStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onMounted, ref } from 'vue'

export const useAccountingVoucherView = (
  checkTreasuryReceiptId: number | string
) => {
  const { openMainLoader } = useMainLoader()

  const { accountingCoucherList } = storeToRefs(useCheckTreasuryReceiptStore())
  const { _getAccountingVoucherList } = useCheckTreasuryReceiptStore()

  const headerProperties = ref<{
    title: string
    breadcrumbs: Array<{ label: string; route: string }>
  }>({
    title: '',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Consulta comprobante contables',
        route: '',
      },
      {
        label: 'Ver',
        route: '',
      },
      {
        label: checkTreasuryReceiptId.toString(),
        route: '',
      },
    ],
  })

  const tableProps = ref({
    title: 'Consulta comprobante contables',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'center',
        sortable: true,
        required: true,
      },
      {
        name: 'type',
        label: 'Tipo',
        field: (row: IAccountingVoucher) =>
          row.receipt_information?.receipt_type ?? '',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'business',
        label: 'Negocio',
        field: (row: IAccountingVoucher) => row.business?.name ?? '',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'date',
        label: 'Fecha',
        field: (row: IAccountingVoucher) =>
          row.voucher_information?.registration_date ?? '',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'voucher',
        label: 'Comprobante',
        field: (row: IAccountingVoucher) =>
          row.voucher_information?.voucher_number ?? '',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'consecutive',
        label: 'Consecutivo',
        field: (row: IAccountingVoucher) =>
          row.voucher_information?.consecutive ?? '',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'value',
        label: 'Valor',
        field: (row: IAccountingVoucher) =>
          row.amounts?.movement_amount?.formatted ?? '',
        align: 'right',
        sortable: true,
        required: true,
      },
    ] as QTable['columns'],
    rows: accountingCoucherList,
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
    rowsPerPage: 20,
    selection: 'multiple',
  })

  onMounted(async () => {
    openMainLoader(true)
    await _getAccountingVoucherList(Number(checkTreasuryReceiptId))
    openMainLoader(false)
  })

  return {
    headerProperties,
    tableProps,
  }
}
