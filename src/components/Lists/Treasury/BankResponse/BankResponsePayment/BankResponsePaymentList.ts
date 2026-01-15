import { ref, watch, onBeforeUnmount, nextTick, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

import { type_process_dispersion_group_list } from '@/constants/resources'
import {
  IBankResponsePaymentList,
  IBankResponsePayment,
  IFieldFilters,
  IBankResponseFilterForm,
} from '@/interfaces/customs'

import { TreasuryStatusID } from '@/interfaces/global'

import { useUtils, useMainLoader } from '@/composables'

import { useBankResponseStore } from '@/stores'

const useBankResponsePaymentList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, formatParamsCustom, formatCurrencyString } =
    useUtils()

  const {
    _getBankResponsePaymentList,
    _setBankResponseDescriptionForm,
    _clearBankResponse,
    _setBankResponsePaymentSelected,
    _setHasRejectedRecords,
  } = useBankResponseStore('v1')
  const {
    bank_response_payment_list,
    bank_response_payment_pages,
    bank_response_filter_form_response,
    bank_response_filter_form,
    bank_response_assign_form,
    bank_response_detail_reject_form,
    isAssignmentSuccessful,
  } = storeToRefs(useBankResponseStore('v1'))

  const tableRef = ref()
  const tableProps = ref({
    title: 'Opciones de respuesta',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'consecutive',
        required: true,
        label: 'Consecutivo',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business',
        required: true,
        label: 'Negocio',
        align: 'center',
        field: (row) =>
          row.business?.business_code && row.business?.name
            ? `${row.business?.business_code} - ${row.business?.name}`
            : '-',
        sortable: true,
      },
      {
        name: 'dispersion_date',
        required: true,
        label: 'Fecha dispersión',
        align: 'center',
        field: 'dispersion_group',
        format: (val: { dispersion_date: string }) =>
          val?.dispersion_date || '',
        sortable: true,
      },
      {
        name: 'dispersion_group',
        required: true,
        label: 'Grupo de dispersión',
        align: 'center',
        field: 'dispersion_group',
        format: (val: { id: number }) => val?.id?.toString() || '',
        sortable: true,
      },
      {
        name: 'validity',
        required: true,
        label: 'Vigencia',
        align: 'center',
        field: 'dispersion_group',
        format: (val: { validity: string }) => val?.validity || '',
        sortable: true,
      },
      {
        name: 'bank',
        required: true,
        label: 'Banco',
        align: 'center',
        field: 'bank',
        format: (val: { code: string; description: string }) =>
          val ? `${val.code} - ${val.description}` : '',
        sortable: true,
      },
      {
        name: 'bank_account',
        required: true,
        label: 'Cuenta',
        align: 'center',
        field: (row) =>
          row.bank_account?.account_number && row.bank_account?.account_name
            ? `${row.bank_account?.account_number} - ${row.bank_account?.account_name}`
            : '-',
        sortable: true,
      },
      {
        name: 'value',
        required: true,
        label: 'Valor',
        align: 'left',
        field: 'value',
        format: (_, row) => formatCurrencyString(row.value) || '-',
        sortable: true,
      },
      {
        name: 'third_party',
        required: true,
        label: 'Tercero',
        align: 'center',
        field: (row) =>
          row.third_party?.document && row.third_party?.name
            ? `${row.third_party?.document} - ${row.third_party?.name}`
            : '-',
        sortable: true,
      },
      {
        name: 'voucher',
        required: true,
        label: 'Comprobante',
        align: 'center',
        field: 'voucher',
        format: (val: { name: string }) => val?.name || '',
        sortable: true,
      },
      {
        name: 'voucher_number',
        required: true,
        label: 'Número de comprobante',
        align: 'center',
        field: 'voucher',
        format: (val: { code: number }) => val?.code?.toString() || '',
        sortable: true,
      },
      {
        name: 'movement_status',
        required: true,
        label: 'Estado movimiento',
        align: 'center',
        field: 'movement_status',
        format: (val: { status: string }) => val?.status || '',
        sortable: true,
      },
      {
        name: 'bank_response_status',
        required: true,
        label: 'Estado respuesta banco',
        align: 'center',
        field: 'bank_response_status',
        format: (val: { id: number }) => val?.id || '',
        sortable: true,
      },
      {
        name: 'reason_for_return',
        required: true,
        label: 'Causal devolución',
        align: 'center',
        field: (row) => {
          const cancellation_code = row?.cancellation_code

          if (
            cancellation_code === null ||
            cancellation_code === undefined ||
            cancellation_code === '' ||
            cancellation_code === 'null' ||
            cancellation_code === 'undefined'
          ) {
            return '-'
          }

          if (typeof cancellation_code === 'string') {
            return cancellation_code
          }

          const code = cancellation_code?.cancellation_code
          const desc = cancellation_code?.description

          if (code && desc) return `${code} - ${desc}`
          if (code) return code

          return '-'
        },
        sortable: true,
      },
      {
        name: 'check_reject',
        required: true,
        label: 'Rechazar',
        align: 'center',
        field: 'bank_response_status',
        sortable: false,
      },
      {
        name: 'check_apply',
        required: true,
        label: 'Aplicar',
        align: 'center',
        field: 'bank_response_status',
        sortable: false,
      },
      {
        name: 'check_debit',
        required: true,
        label: 'Debitar',
        align: 'center',
        field: 'bank_response_status',
        sortable: false,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: bank_response_payment_list.value as IBankResponsePaymentList,
    pages: bank_response_payment_pages.value,
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'type',
      label: 'Tipo de proceso',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-12 col-lg-12',
      options: [],
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})
  const filterAux = ref<Record<string, string | number>>({})
  const showModalBankResponseAssign = ref(false)
  const showModalBankResponseDescription = ref(false)
  const selectedRows = ref<IBankResponsePaymentList>([])

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getBankResponsePaymentList(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: { 'filter[type]': string }) => {
    filterAux.value = { ...$filters }
    await onSearchPaymentList()
  }

  const handleFilterClear = () => {
    filterAux.value = {}
    onSearchPaymentList()
  }

  const buildParamsFile = (
    type: string,
    content: {
      with_answer?: Record<string, string | null> | Array<{ id: string }>
      without_answer?: Record<string, string | null> | Array<{ id: string }>
    } | null
  ): Record<string, string> => {
    const params: Record<string, string> = {}

    if (!content) return params

    const addEntries = (
      items?: Record<string, string | null> | Array<{ id: string }>
    ) => {
      if (!items) return

      if (Array.isArray(items)) {
        items.forEach((item) => {
          if (item?.id) params[`ids[${item.id}]`] = item.id
        })
        return
      }

      Object.entries(items).forEach(([key, value]) => {
        params[`ids[${key}]`] = value === null ? 'null' : String(value)
      })
    }

    if (!type || type === 'Todo') {
      addEntries(content.with_answer)
      addEntries(content.without_answer)
    }

    if (type === 'Con respuesta') addEntries(content.with_answer)
    if (type === 'Sin respuesta') addEntries(content.without_answer)

    return params
  }

  const buildParamsManual = (
    form: IBankResponseFilterForm
  ): Record<string, string> => {
    const params: Record<string, string> = {}

    if (form.bank_id) params['filter[bank_id]'] = String(form.bank_id)
    if (form.dispersion_group_id) {
      params['filter[dispersion_group_id]'] = String(form.dispersion_group_id)
    }

    return params
  }

  const onSearchPaymentList = async () => {
    const filterForm = bank_response_filter_form.value
    const dispersion_group_id = filterForm?.dispersion_group_id

    if (!filterForm || !dispersion_group_id) return

    let params: Record<string, string> = {}

    if (filterForm.file_type === 'Archivo') {
      const content = bank_response_filter_form_response.value?.filters || null
      const selectedType = filterAux.value['filter[type]'] as string
      params = buildParamsFile(selectedType, content)
    }

    if (filterForm.file_type === 'Manual') {
      params = buildParamsManual(filterForm)
    }

    filtersFormat.value = {
      ...params,
    }

    tableRef.value.clearSelection()
    selectedRows.value = []

    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? `&${queryString}` : '')
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const onUpdateSelected = (val: IBankResponsePaymentList) => {
    selectedRows.value = val
  }

  const onUpdateTableStatus = () => {
    if (!bank_response_assign_form.value) return

    const updatedRows = tableProps.value.rows.map(
      (row: IBankResponsePayment) => {
        if (selectedRows.value.some((selected) => selected.id === row.id)) {
          return {
            ...row,
            bank_response_status: {
              ...(row.bank_response_status || {}),
              id: Number(bank_response_assign_form.value?.status),
            },
            reason_for_return:
              bank_response_assign_form.value?.reason_label || '',
          }
        }
        return row
      }
    )

    nextTick(() => {
      tableProps.value.rows = [...updatedRows]
    })
  }

  const handleShowModalBankResponseAssign = (value: boolean = false) => {
    showModalBankResponseAssign.value = value
  }

  const handleShowModalBankResponseDescription = async (
    id: number | null = null,
    value: boolean = false
  ) => {
    if (value) {
      openMainLoader(true)
      if (tableProps.value.rows.length === 0 || !id) return

      const foundItem = tableProps.value.rows.find((item) => item.id === id)
      if (foundItem) {
        await _setBankResponseDescriptionForm(foundItem)
      }
      openMainLoader(false)
    }
    showModalBankResponseDescription.value = value
  }

  const customSelectionFilter = (selected: IBankResponsePayment[]) =>
    selected.filter(
      (item: IBankResponsePayment) =>
        item.bank_response_status?.id !== TreasuryStatusID.APPLIED &&
        item.bank_response_status?.id !== TreasuryStatusID.REJECTED &&
        item.bank_response_status?.id !== TreasuryStatusID.DEBITED
    )

  onBeforeUnmount(() => {
    _clearBankResponse()
  })

  watch(
    () => bank_response_payment_list.value,
    () => {
      const isArchivo = bank_response_filter_form.value?.file_type === 'Archivo'

      tableProps.value.rows = bank_response_payment_list.value.map((row) => ({
        ...row,
        disabled:
          row.bank_response_status?.id === TreasuryStatusID.APPLIED ||
          row.bank_response_status?.id === TreasuryStatusID.REJECTED ||
          row.bank_response_status?.id === TreasuryStatusID.DEBITED,
      }))

      nextTick(() => {
        if (isArchivo) {
          selectedRows.value = [...tableProps.value.rows]
          tableRef.value?.setSelected(selectedRows.value)
        } else {
          selectedRows.value = []
          tableRef.value?.clearSelection()
        }
      })

      tableProps.value.pages = {
        ...tableProps.value.pages,
        ...bank_response_payment_pages.value,
      }
    }
  )

  watch(
    () => bank_response_filter_form.value?.file_type,
    () => {
      filterConfig.value[0].options =
        bank_response_filter_form.value?.file_type === 'Manual'
          ? type_process_dispersion_group_list.filter(
              (opt) => opt.value !== 'Con respuesta'
            )
          : [...type_process_dispersion_group_list]
    }
  )

  watch(
    () => bank_response_payment_list.value,
    (list) => {
      const hasRejected = list.some(
        (item) => item.bank_response_status?.id === TreasuryStatusID.REJECTED
      )
      _setHasRejectedRecords(hasRejected)
    },
    { deep: true }
  )

  watch(
    () => selectedRows.value,
    () => {
      _setBankResponsePaymentSelected(selectedRows.value)
    }
  )

  watch(
    () => bank_response_filter_form.value,
    (value, oldValue) => {
      if (JSON.stringify(value) !== JSON.stringify(oldValue)) {
        bank_response_payment_list.value = []
        bank_response_assign_form.value = null
        bank_response_detail_reject_form.value = null
      }
    },
    { deep: true }
  )

  watch(
    () => isAssignmentSuccessful.value,
    (newValue) => {
      if (newValue) {
        onUpdateTableStatus()
      }
    },
    { deep: true }
  )

  const isSelectionDisabled = computed(() => {
    return bank_response_filter_form.value?.file_type === 'Archivo'
  })

  return {
    defaultIconsLucide,
    filterConfig,
    tableProps,
    showModalBankResponseAssign,
    showModalBankResponseDescription,
    selectedRows,
    tableRef,
    isSelectionDisabled,
    handleFilter,
    handleFilterClear,
    updatePage,
    updatePerPage,
    handleShowModalBankResponseAssign,
    handleShowModalBankResponseDescription,
    onSearchPaymentList,
    onUpdateSelected,
    onUpdateTableStatus,
    customSelectionFilter,
  }
}

export default useBankResponsePaymentList
