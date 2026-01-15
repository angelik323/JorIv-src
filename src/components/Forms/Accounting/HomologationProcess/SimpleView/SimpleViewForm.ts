import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { QTable } from 'quasar'
import {
  IFieldFilters,
  IHomologationProcessVoucher,
} from '@/interfaces/customs'

import { useRules } from '@/composables'

import {
  useAccountingResourceStore,
  useHomologationProcessStore,
  useResourceManagerStore,
} from '@/stores'

const useSimpleViewForm = (props: { id: number }) => {
  const {
    business_trusts_by_account_structure_and_equivalence: business_trusts,
    vouchers_mapping_process_logs_statuses,
    homologation_receipt_types: receipt_types,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { _getResources } = useResourceManagerStore('v1')

  const { _getHomologationProcessLogs } = useHomologationProcessStore('v1')

  const { selected_homologation_process, homologation_process_vouchers } =
    storeToRefs(useHomologationProcessStore('v1'))

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_trust_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: business_trusts,
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
      name: 'status_id',
      label: 'Estado de homologación comprobante',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: vouchers_mapping_process_logs_statuses,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'receipt_type_id',
      label: 'Comprobante origen',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: receipt_types,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({
    rows: 20,
    page: 1,
  })

  const handleFilter = ($filters: {}) => {
    filtersFormat.value = {
      rows: filtersFormat.value.rows,
      page: filtersFormat.value.page,
      ...$filters,
    }

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
        name: 'source_structure',
        required: true,
        label: 'Estructura origen',
        align: 'left',
        field: (row: IHomologationProcessVoucher) => `${row.source_structure}`,
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
        name: 'destination_voucher',
        required: true,
        label: 'Comprobante destino',
        align: 'left',
        field: (row: IHomologationProcessVoucher) =>
          `${row.new_voucher_id ?? '-'}`,
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
        style: styleColumn(400),
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
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

  const updatePage = (page: number) => {
    tableProps.value.pages.currentPage = page
    _getHomologationProcessLogs(props.id, filtersFormat.value)
  }

  const updatePerPage = (newPerPage: number) => {
    filtersFormat.value.rows = newPerPage
    filtersFormat.value.page = 1
    _getHomologationProcessLogs(props.id, filtersFormat.value)
  }

  const getStatus = (statusName: string) => {
    const status = vouchers_mapping_process_logs_statuses.value.find(
      (item) => item.status === statusName
    )
    return status?.id ? status.id : 1
  }

  const getBusinessTrusts = (
    sourceStructureId: number,
    destinationStructureId: number
  ) => {
    const structureFilter =
      `?source_structure_id=${sourceStructureId}` +
      (destinationStructureId
        ? `&destination_structure_id=${destinationStructureId}`
        : '')
    _getResources(
      {
        accounting: ['business_trusts_by_account_structure_and_equivalence'],
      },
      structureFilter,
      'v2'
    )
  }

  watch(selected_homologation_process, (newVal) => {
    getBusinessTrusts(
      newVal.source_structure.id,
      newVal.destination_structure.id
    )
  })

  return {
    selected_homologation_process,
    tableProps,
    filterConfig,
    handleFilter,
    updatePage,
    updatePerPage,
    getStatus,
  }
}

export default useSimpleViewForm
