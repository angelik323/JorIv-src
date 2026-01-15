import { nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { QTable } from 'quasar'
import {
  IFieldFilters,
  IHomologationProcessVoucher,
} from '@/interfaces/customs'

import { useRules, useUtils } from '@/composables'
import { createAndDownloadBlobByArrayBuffer } from '@/utils'

import {
  useAccountingResourceStore,
  useHomologationProcessStore,
  useResourceManagerStore,
} from '@/stores'

const useDetailedViewForm = (props: { id: number }) => {
  const {
    account_structures_active_revert_vouchers: account_structures,
    business_trusts_by_account_structure_and_equivalence: business_trusts,
    voucher_consecutives_by_business_trust_and_receipt_type,
    vouchers_mapping_process_logs_statuses,
    homologation_receipt_types: receipt_types,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _getHomologationProcessLogs, _downloadDetailedResults } =
    useHomologationProcessStore('v1')

  const { selected_homologation_process, homologation_process_vouchers } =
    storeToRefs(useHomologationProcessStore('v1'))

  const subReceiptTypes = ref()

  const filterComponentRef = ref()

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'period',
      label: 'Periodo*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
      mask: 'YYYY-MM',
      rules: [
        (v: string) => useRules().is_required(v, 'El periodo es requerido'),
      ],
    },
    {
      name: 'date',
      label: 'Fecha*',
      type: 'q-date',
      value: useUtils().formatDate(
        selected_homologation_process.value.created_at,
        'YYYY-MM-DD'
      ),
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (v: string) => useRules().is_required(v, 'La fecha es requerida'),
      ],
    },
    {
      name: 'source_structure_id',
      label: 'Estructura origen*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: account_structures,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) =>
          useRules().is_required(v, 'La estrutura de origen es requerida'),
      ],
    },
    {
      name: 'destination_structure_id',
      label: 'Estructura destino',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: account_structures,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) =>
          useRules().is_required(v, 'La estrutura de destino es requerida'),
      ],
    },
    {
      name: 'business_trust_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 q-py-md',
      options: business_trusts,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) => useRules().is_required(v, 'El negocio es requerido'),
      ],
    },
    {
      name: 'receipt_type_id',
      label: 'Tipo de comprobante',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 q-py-md',
      options: receipt_types,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) =>
          useRules().is_required(v, 'El tipo de comprobante es requerido'),
      ],
    },
    {
      name: 'sub_receipt_type_id',
      label: 'Subtipo de comprobante*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 q-py-md',
      options: subReceiptTypes,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) =>
          useRules().is_required(v, 'El subtipo de comprobante es requerido'),
      ],
    },
    {
      name: 'code',
      label: 'Consecutivo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 q-py-md',
      options: voucher_consecutives_by_business_trust_and_receipt_type,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) => useRules().is_required(v, 'El consecutivo es requerido'),
      ],
    },
  ])

  const selectReceiptType = (receipt_type_id: number) => {
    filterComponentRef.value.cleanFiltersByNames(['sub_receipt_type_id'])
    const selectedReceiptType = receipt_types.value.find(
      (item) => item.id === receipt_type_id
    )
    if (selectedReceiptType) {
      subReceiptTypes.value = selectedReceiptType.related
    }
  }

  const filtersFormat = ref<Record<string, string | number>>({
    rows: 20,
    page: 1,
    query_type: 'detailed',
    exportable: 1,
  })

  const getBusinessOptions = ($filters: {
    'filter[source_structure_id]': string
    'filter[destination_structure_id]': string
  }) => {
    const sourceStructureId = $filters['filter[source_structure_id]']
    const destinationStructureId = $filters['filter[destination_structure_id]']
    if (
      sourceStructureId &&
      (filtersFormat.value['filter[source_structure_id]'] !==
        sourceStructureId ||
        filtersFormat.value['filter[destination_structure_id]'] !==
          destinationStructureId)
    ) {
      const structureFilter =
        `filter[source_structure_id]=${sourceStructureId}` +
        (destinationStructureId
          ? `&filter[destination_structure_id]=${destinationStructureId}`
          : '')
      _getResources(
        {
          accounting: ['business_trusts_by_account_structure_and_equivalence'],
        },
        structureFilter,
        'v2'
      )
    }
    if (
      !sourceStructureId &&
      filtersFormat.value['filter[source_structure_id]'] &&
      filtersFormat.value['filter[business_trust_id]']
    ) {
      filterComponentRef.value.cleanFiltersByNames(['business_trust_id'])
      nextTick(() => {
        _resetKeys({
          accounting: ['business_trusts_by_account_structure_and_equivalence'],
        })
      })
    }
  }

  const getConsecutives = ($filters: {
    'filter[receipt_type_id]': number
    'filter[business_trust_id]': number
    'filter[period]': string
  }) => {
    const receiptTypeId = $filters['filter[receipt_type_id]']
    const businessTrustId = $filters['filter[business_trust_id]']
    const period = $filters['filter[period]']
    if (
      receiptTypeId &&
      businessTrustId &&
      period &&
      (receiptTypeId !== filtersFormat.value['filter[receipt_type_id]'] ||
        businessTrustId !== filtersFormat.value['filter[business_trust_id]'] ||
        period !== filtersFormat.value['filter[period]'])
    ) {
      const consecutiveFilters = `?filter[business_trust_id]=${businessTrustId}&filter[receipt_type_id]=${receiptTypeId}&filter[period]=${period}`
      _getResources(
        {
          accounting: [
            'voucher_consecutives_by_business_trust_and_receipt_type',
          ],
        },
        consecutiveFilters,
        'v2'
      )
    }
  }

  const setFilters = ($filters: Record<string, string | number>) => {
    filtersFormat.value = {
      rows: filtersFormat.value.rows,
      page: filtersFormat.value.page,
      query_type: 'detailed',
      exportable: 1,
      ...$filters,
    }
  }

  const setSubReceiptTypes = ($filters: {
    'filter[receipt_type_id]': number
  }) => {
    const receiptTypeId = $filters['filter[receipt_type_id]']
    if (
      receiptTypeId &&
      filtersFormat.value['filter[receipt_type_id]'] !== receiptTypeId
    ) {
      selectReceiptType(receiptTypeId)
    }
  }

  const handleFilterUpdate = ($filters: {
    'filter[source_structure_id]': string
    'filter[destination_structure_id]': string
    'filter[receipt_type_id]': number
    'filter[business_trust_id]': number
    'filter[period]': string
  }) => {
    getBusinessOptions($filters)
    setSubReceiptTypes($filters)
    getConsecutives($filters)
    setFilters($filters)
  }

  const handleFilter = ($filters: {}) => {
    setFilters($filters)
    _getHomologationProcessLogs(props.id, filtersFormat.value)
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    _getHomologationProcessLogs(props.id, filtersFormat.value)
  }

  const updatePerPage = (newPerPage: number) => {
    filtersFormat.value.rows = newPerPage
    filtersFormat.value.page = 1
    _getHomologationProcessLogs(props.id, filtersFormat.value)
  }

  const styleColumn = (width: number = 200) => ({
    'white-space': 'nowrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-x': 'hidden',
    'text-overflow': 'ellipsis',
  })

  const tableProps = ref({
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
        name: 'receipt_type',
        required: true,
        label: 'Tipo de comprobante',
        align: 'left',
        field: (row: IHomologationProcessVoucher) => `${row.receipt}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'sub_receipt_type',
        required: true,
        label: 'Subtipo de comprobante',
        align: 'left',
        field: (row: IHomologationProcessVoucher) => `${row.sub_receipt}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'code',
        required: true,
        label: 'Consecutivo',
        align: 'left',
        field: (row: IHomologationProcessVoucher) => `${row.consecutive}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'source_structure',
        required: true,
        label: 'Estructura origen',
        align: 'left',
        field: (row: IHomologationProcessVoucher) => `${row.source_structure}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'destination_structure',
        required: true,
        label: 'Estructura destino',
        align: 'left',
        field: (row: IHomologationProcessVoucher) =>
          `${row.destination_structure}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'status',
        required: true,
        label: 'Estado del comprobante',
        align: 'left',
        field: (row: IHomologationProcessVoucher) => `${row.status}`,
        sortable: true,
        style: styleColumn(200),
      },
    ] as QTable['columns'],
    rows: [] as IHomologationProcessVoucher[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  watch(
    () => homologation_process_vouchers.value,
    () => {
      tableProps.value.rows = homologation_process_vouchers.value.list
      tableProps.value.pages = homologation_process_vouchers.value.pages
    },
    { deep: true }
  )

  const getStatus = (statusName: string) => {
    const status = vouchers_mapping_process_logs_statuses.value.find(
      (item) => item.status === statusName
    )
    return status?.id ? status.id : 1
  }

  const downloadResults = () => {
    if (homologation_process_vouchers.value.list.length) {
      const payload = {
        results: homologation_process_vouchers.value.list,
      }

      _downloadDetailedResults(payload).then((xlsResponse) => {
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

  return {
    tableProps,
    filterComponentRef,
    filterConfig,
    handleFilterUpdate,
    handleFilter,
    updatePage,
    updatePerPage,
    getStatus,
    downloadResults,
  }
}

export default useDetailedViewForm
