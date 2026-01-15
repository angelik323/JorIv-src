import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { QTable } from 'quasar'
import {
  IFilterableVoucher,
  IHomologationModel,
  IHomologationProcess,
} from '@/interfaces/customs'

import { createAndDownloadBlobByArrayBuffer, formatParamsCustom } from '@/utils'
import { useUtils } from '@/composables'

import {
  useAccountingResourceStore,
  useHomologationProcessStore,
  useResourceManagerStore,
} from '@/stores'

const useHomologationForm = () => {
  const {
    _cleanHomologationProcessData,
    _selectiveHomologation,
    _downloadResults,
    _searchFilterableVouchers,
  } = useHomologationProcessStore('v1')

  const { processed_homologations, process_type, filterable_vouchers_list } =
    storeToRefs(useHomologationProcessStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    vouchers_mappings_process_name_types,
    vouchers_mapping_process_logs_statuses,
    account_structures_active_revert_vouchers: account_structures_active,
    vouchers_mappings_process_types,
    business_trusts_by_account_structure_and_equivalence: business_trusts,
    homologation_receipt_types: receipt_types,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const informationForm = ref()

  const basicForm = ref<IHomologationModel>({
    process_type: null,
    source_structure_id: null,
    period: null,
    destination_structure_id: null,
    business_trust_start_id: null,
    receipt_type_id: null,
    sub_receipt_type_id: null,
    voucher_ids: [],
  })

  watch<[number, number]>(
    () => [
      basicForm.value.source_structure_id ?? 0,
      basicForm.value.destination_structure_id ?? 0,
    ],
    ([newSource, newDestination], [oldSource, oldDestination]) => {
      if (
        newSource &&
        (newSource !== oldSource || newDestination !== oldDestination)
      ) {
        const structureFilter =
          `filter[source_structure_id]=${newSource}` +
          (newDestination
            ? `&filter[destination_structure_id]=${newDestination}`
            : '')
        _getResources(
          {
            accounting: [
              'business_trusts_by_account_structure_and_equivalence',
            ],
          },
          structureFilter,
          'v2'
        )
      }
      if (!newSource) {
        basicForm.value.business_trust_start_id = null
        _resetKeys({
          accounting: ['business_trusts_by_account_structure_and_equivalence'],
        })
      }
    }
  )

  const styleColumn = (width: number = 200) => ({
    'white-space': 'nowrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-x': 'hidden',
    'text-overflow': 'ellipsis',
  })

  const selectedSourceStructure = computed(() =>
    account_structures_active.value.find(
      (item) => item.value === basicForm.value.source_structure_id
    )
  )
  const selectedDestinationStructure = computed(() =>
    account_structures_active.value.find(
      (item) => item.value === basicForm.value.destination_structure_id
    )
  )

  const filterableVoucherTableProps = ref({
    title: 'Listado de comprobantes',
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
        name: 'period',
        required: true,
        label: 'Fecha',
        align: 'left',
        field: (row: IFilterableVoucher) =>
          `${useUtils().formatDate(row.registration_date, 'YYYY-MM-DD')}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'receipt_type',
        required: true,
        label: 'Tipo de comprobante',
        align: 'left',
        field: (row: IFilterableVoucher) =>
          `${row.receipt_type.code} - ${row.receipt_type.name}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'sub_receipt_type',
        required: true,
        label: 'Subtipo de comprobante',
        align: 'left',
        field: (row: IFilterableVoucher) =>
          `${row.sub_receipt_type.code} - ${row.sub_receipt_type.name}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'consecutive',
        required: true,
        label: 'Consecutivo',
        align: 'left',
        field: (row: IFilterableVoucher) => `${row.code}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'from_structure',
        required: true,
        label: 'Estructura origen',
        align: 'left',
        field: () => `${selectedSourceStructure?.value?.label || ''}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'to_structure',
        required: true,
        label: 'Estructura destino',
        align: 'left',
        field: () => `${selectedDestinationStructure?.value?.label || ''}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'status',
        required: true,
        label: 'Estado del comprobante',
        align: 'left',
        field: (row: IFilterableVoucher) => `${row.status}`,
        sortable: true,
        style: styleColumn(200),
      },
    ] as QTable['columns'],
    rows: filterable_vouchers_list.value,
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  watch(
    () => filterable_vouchers_list.value,
    () => {
      filterableVoucherTableProps.value.rows = filterable_vouchers_list.value
    },
    { deep: true }
  )

  const vouchersPerPage = ref(20)

  const setNumberOfVoucherPages = () => {
    const numberOfPages = filterable_vouchers_list.value.length
      ? Math.ceil(filterable_vouchers_list.value.length / vouchersPerPage.value)
      : 1

    filterableVoucherTableProps.value.pages.currentPage = 1
    filterableVoucherTableProps.value.pages.lastPage = numberOfPages
  }

  watch(
    () => filterable_vouchers_list.value,
    () => {
      filterable_vouchers_list.value.forEach((item) => {
        item.disabled = item.status.id !== 88
        return item
      })
      setNumberOfVoucherPages()

      filterableVoucherTableProps.value.rows =
        filterable_vouchers_list.value.slice(
          (filterableVoucherTableProps.value.pages.currentPage - 1) *
            vouchersPerPage.value,
          filterableVoucherTableProps.value.pages.currentPage *
            vouchersPerPage.value
        )
    }
  )

  const updateVouchersPage = (page: number) => {
    filterableVoucherTableProps.value.pages.currentPage = page
    filterableVoucherTableProps.value.rows =
      filterable_vouchers_list.value.slice(
        (page - 1) * vouchersPerPage.value,
        page * vouchersPerPage.value
      )
  }

  const updateVouchersPerPage = (newPerPage: number) => {
    vouchersPerPage.value = newPerPage
    setNumberOfVoucherPages()
    filterableVoucherTableProps.value.rows =
      filterable_vouchers_list.value.slice(0, newPerPage)
  }

  const processedHomologationsTableProps = ref({
    title: 'Listado de proceso de homologación',
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
        field: (row: IHomologationProcess) => `${row.business}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'period',
        required: true,
        label: 'Periodo',
        align: 'left',
        field: (row: IHomologationProcess) => `${row.period}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'receipt_type',
        required: true,
        label: 'Tipo de comprobante',
        align: 'left',
        field: (row: IHomologationProcess) => `${row.receipt}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'consecutive',
        required: true,
        label: 'Consecutivo',
        align: 'left',
        field: (row: IHomologationProcess) => `${row.consecutive}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'from_structure',
        required: true,
        label: 'Estructura origen',
        align: 'left',
        field: (row: IHomologationProcess) => `${row.source_structure}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'to_structure',
        required: true,
        label: 'Estructura destino',
        align: 'left',
        field: (row: IHomologationProcess) => `${row.destination_structure}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'status',
        required: true,
        label: 'Estado del comprobante',
        align: 'left',
        field: (row: IHomologationProcess) => `${row.status}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: processed_homologations.value,
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const processedPerPage = ref(20)

  const setNumberOfPages = () => {
    const numberOfPages = processed_homologations.value.length
      ? Math.ceil(processed_homologations.value.length / processedPerPage.value)
      : 1

    processedHomologationsTableProps.value.pages.currentPage = 1
    processedHomologationsTableProps.value.pages.lastPage = numberOfPages
  }

  watch(
    () => processed_homologations.value,
    () => {
      setNumberOfPages()

      processedHomologationsTableProps.value.rows =
        processed_homologations.value.slice(
          (processedHomologationsTableProps.value.pages.currentPage - 1) *
            processedPerPage.value,
          processedHomologationsTableProps.value.pages.currentPage *
            processedPerPage.value
        )
    }
  )

  const updateProcessedPage = (page: number) => {
    processedHomologationsTableProps.value.pages.currentPage = page
    processedHomologationsTableProps.value.rows =
      processed_homologations.value.slice(
        (page - 1) * processedPerPage.value,
        page * processedPerPage.value
      )
  }

  const updateProcessedPerPage = (newPerPage: number) => {
    processedPerPage.value = newPerPage
    setNumberOfPages()
    processedHomologationsTableProps.value.rows =
      processed_homologations.value.slice(0, newPerPage)
  }

  const selectProcessType = (processType: null | 1 | 2 | 3 | 4) => {
    process_type.value = processType
  }

  const cleanForm = () => {
    basicForm.value = {
      process_type: basicForm.value.process_type,
      source_structure_id: null,
      period: null,
      destination_structure_id: null,
      business_trust_start_id: null,
      receipt_type_id: null,
      sub_receipt_type_id: null,
      voucher_ids: basicForm.value.voucher_ids,
    }
    nextTick(() => {
      informationForm.value.resetValidation()
    })
  }

  const searchVouchers = async () => {
    if (await informationForm.value.validate()) {
      filterableVoucherTableProps.value.loading = true
      const params = {
        process_type: basicForm.value.process_type!,
        'filter[source_structure_id]': basicForm.value.source_structure_id!,
        'filter[period]': basicForm.value.period!,
        'filter[destination_structure_id]':
          basicForm.value.destination_structure_id!,
        'filter[business_trust_id]': basicForm.value.business_trust_start_id!,
        'filter[receipt_type_id]': basicForm.value.receipt_type_id!,
        'filter[sub_receipt_type_id]': basicForm.value.sub_receipt_type_id!,
      }
      filterable_vouchers_list.value = []
      await _searchFilterableVouchers(formatParamsCustom(params))
      filterableVoucherTableProps.value.loading = false
    }
  }

  const handleVoucherSelection = (event: {
    rows: number
    selected: IFilterableVoucher[]
  }) => {
    basicForm.value.voucher_ids = event.selected.map(
      (item: IFilterableVoucher) => item.id
    )
  }

  const homologate = async () => {
    if (await informationForm.value.validate()) {
      const payload = {
        process_type: basicForm.value.process_type!,
        source_structure_id: basicForm.value.source_structure_id!,
        period: basicForm.value.period!,
        destination_structure_id: basicForm.value.destination_structure_id!,
        business_trust_start_id: basicForm.value.business_trust_start_id!,
        voucher_ids: basicForm.value.voucher_ids,
      }
      processedHomologationsTableProps.value.loading = true
      _cleanHomologationProcessData()
      await _selectiveHomologation(payload)
      basicForm.value.voucher_ids = []
      processedHomologationsTableProps.value.loading = false
    }
  }

  const customSelectionFilter = (selected: IFilterableVoucher[]) =>
    selected.filter((item: IFilterableVoucher) => item.status.id === 88)

  const subReceiptTypes = ref()

  const selectReceiptType = (receipt_type_id: number) => {
    basicForm.value.receipt_type_id = receipt_type_id
    basicForm.value.sub_receipt_type_id = null
    const selectedReceiptType = receipt_types.value.find(
      (item) => item.id === receipt_type_id
    )
    if (selectedReceiptType) {
      subReceiptTypes.value = selectedReceiptType.related
    }
  }

  const downloadResults = () => {
    if (processed_homologations.value.length) {
      const payload = {
        process_type: basicForm.value.process_type!,
        results: processed_homologations.value,
      }

      _downloadResults(payload).then((xlsResponse) => {
        if (xlsResponse) {
          createAndDownloadBlobByArrayBuffer(
            xlsResponse,
            `Proceso_de_homologación_`,
            new Date()
          )
        }
      })
    }
  }

  const getStatus = (statusName: string) => {
    const status = vouchers_mapping_process_logs_statuses.value.find(
      (item) => item.status === statusName
    )
    return status?.id ? status.id : 1
  }

  onMounted(() => {
    basicForm.value.process_type = process_type.value
  })

  onBeforeUnmount(() => {
    _cleanHomologationProcessData()
  })

  return {
    informationForm,
    basicForm,
    filterableVoucherTableProps,
    processedHomologationsTableProps,
    vouchers_mappings_process_name_types,
    account_structures_active,
    vouchers_mappings_process_types,
    business_trusts,
    receipt_types,
    subReceiptTypes,
    updateVouchersPage,
    updateVouchersPerPage,
    updateProcessedPage,
    updateProcessedPerPage,
    selectProcessType,
    selectReceiptType,
    cleanForm,
    searchVouchers,
    downloadResults,
    _cleanHomologationProcessData,
    handleVoucherSelection,
    homologate,
    customSelectionFilter,
    getStatus,
  }
}

export default useHomologationForm
