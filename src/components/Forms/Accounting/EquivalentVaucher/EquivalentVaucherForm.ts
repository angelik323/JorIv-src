import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { useAlert } from '@/composables'
import { useAccountingResourceStore, useResourceManagerStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { ISelectOption, ITableRow } from '@/interfaces/customs'

export const useEquivalentVoucherForm = () => {
  const { showAlert } = useAlert()
  const { sub_receipt_types_voucher } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keysSubReceiptTypes = { accounting: ['sub_receipt_types'] }

  const tableData = ref<ITableRow[]>([])
  const perPage = ref(20)

  const validate = () => {
    if (tableData.value.length === 0) {
      showAlert('Debe agregar al menos un subtipo de comprobante.', 'warning')
      return false
    }

    return true
  }

  const tableProps = ref({
    title: 'Datos del comprobante',
    loading: false,
    columns: [
      {
        name: 'index',
        label: '#',
        field: () => '',
        align: 'center',
        sortable: true,
      },
      {
        name: 'subtype_receipt_origin',
        label: 'Subtipo comprobante origen',
        field: (row: ITableRow) => row.subtype_receipt_origin ?? '',
        align: 'center',
        sortable: true,
      },
      {
        name: 'equivalent_voucher_subtype',
        label: 'Subtipo comprobante equivalente',
        field: (row: ITableRow) => row.equivalent_voucher_subtype ?? '',
        align: 'center',
        sortable: true,
      },
      {
        name: 'tax_receipt_subtype',
        label: 'Subtipo comprobante fiscal',
        field: (row: ITableRow) => row.tax_receipt_subtype ?? '',
        align: 'center',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'center',
      },
    ] as QTable['columns'],
    rows: [] as ITableRow[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const addRow = () => {
    tableData.value.push({
      subtype_receipt_origin: null,
      equivalent_voucher_subtype: null,
      tax_receipt_subtype: null,
    })

    syncTableRows()
  }

  const getSelectedSubtypeRows = () => {
    return tableData.value.map((item) => ({
      subtype_receipt_origin: item.subtype_receipt_origin,
      equivalent_voucher_subtype: item.equivalent_voucher_subtype,
      tax_receipt_subtype: item.tax_receipt_subtype,
    }))
  }

  const getLabelByValue = (value: number | string | null) => {
    const item = sub_receipt_types_voucher.value.find(
      (opt: ISelectOption) => opt.value === value
    )
    return item ? item.label : value
  }

  const removeRow = (index: number) => {
    tableData.value.splice(index, 1)
    syncTableRows()
  }

  const syncTableRows = () => {
    tableProps.value.rows = [...tableData.value].reverse()
  }

  const updatePagination = () => {
    const total = tableData.value.length
    const { currentPage } = tableProps.value.pages

    tableProps.value.pages.lastPage = Math.max(
      1,
      Math.ceil(total / perPage.value)
    )

    if (currentPage > tableProps.value.pages.lastPage) {
      tableProps.value.pages.currentPage = tableProps.value.pages.lastPage
    }

    const start = (tableProps.value.pages.currentPage - 1) * perPage.value
    const end = start + perPage.value

    tableProps.value.rows = tableData.value.slice(start, end).reverse()
  }

  const updatePage = (page: number) => {
    tableProps.value.pages.currentPage = page
    updatePagination()
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    updatePagination()
  }

  watch(
    () => tableData.value,
    () => updatePagination(),
    { deep: true }
  )

  onMounted(() => {
    _getResources(keysSubReceiptTypes)
  })

  onBeforeMount(async () => {
    await _resetKeys(keysSubReceiptTypes)
  })

  return {
    tableData,
    tableProps,
    sub_receipt_types_voucher,
    perPage,
    updatePage,
    updatePerPage,
    addRow,
    removeRow,
    validate,
    getLabelByValue,
    getSelectedSubtypeRows,
  }
}
