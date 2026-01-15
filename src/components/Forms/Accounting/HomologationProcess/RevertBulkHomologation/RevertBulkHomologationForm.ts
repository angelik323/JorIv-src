import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { QTable } from 'quasar'
import {
  IBulkHomologationModel,
  IHomologationProcess,
} from '@/interfaces/customs'

import { createAndDownloadBlobByArrayBuffer } from '@/utils'

import {
  useAccountingResourceStore,
  useHomologationProcessStore,
  useResourceManagerStore,
} from '@/stores'
import { useGoToUrl } from '@/composables'

const useRevertBulkHomologationForm = () => {
  const { _cleanHomologationProcessData, _bulkHomologation, _downloadResults } =
    useHomologationProcessStore('v1')

  const { processed_homologations, process_type } = storeToRefs(
    useHomologationProcessStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { goToURL } = useGoToUrl()

  const {
    vouchers_mappings_process_name_types,
    account_structures_active_revert_vouchers: account_structures_active,
    vouchers_mappings_process_types,
    business_trusts_by_account_structure_and_equivalence: business_trusts,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const informationForm = ref()

  const basicForm = ref<IBulkHomologationModel>({
    process_type: null,
    source_structure_id: null,
    period: null,
    type: null,
    destination_structure_id: null,
    business_trust_start_id: null,
    business_trust_end_id: null,
    homologation_date: null,
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
        basicForm.value.business_trust_end_id = null
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

  const perPage = ref(20)

  const setNumberOfPages = () => {
    const numberOfPages = processed_homologations.value.length
      ? Math.ceil(processed_homologations.value.length / perPage.value)
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
            perPage.value,
          processedHomologationsTableProps.value.pages.currentPage *
            perPage.value
        )
    }
  )

  const updatePage = (page: number) => {
    processedHomologationsTableProps.value.pages.currentPage = page
    processedHomologationsTableProps.value.rows =
      processed_homologations.value.slice(
        (page - 1) * perPage.value,
        page * perPage.value
      )
  }

  const updatePerPage = (newPerPage: number) => {
    perPage.value = newPerPage
    setNumberOfPages()
    processedHomologationsTableProps.value.rows =
      processed_homologations.value.slice(0, newPerPage)
  }

  const selectProcessType = (processType: null | 1 | 2 | 3 | 4) => {
    process_type.value = processType
  }

  const cleanForm = () => {
    basicForm.value = {
      homologation_date: null,
      process_type: basicForm.value.process_type,
      source_structure_id: null,
      period: null,
      type: null,
      destination_structure_id: null,
      business_trust_start_id: null,
      business_trust_end_id: null,
    }
    nextTick(() => {
      informationForm.value.resetValidation()
    })
  }

  const revertBulkHomologation = async () => {
    if (await informationForm.value.validate()) {
      const payload = {
        process_type: basicForm.value.process_type!,
        source_structure_id: basicForm.value.source_structure_id!,
        period: basicForm.value.period!,
        type: basicForm.value.type!,
        destination_structure_id: basicForm.value.destination_structure_id!,
        business_trust_start_id: basicForm.value.business_trust_start_id!,
        business_trust_end_id: basicForm.value.business_trust_end_id!,
        homologation_date: basicForm.value.homologation_date!,
      }
      _bulkHomologation(payload)
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

  onMounted(() => {
    basicForm.value.process_type = process_type.value
  })

  onBeforeUnmount(() => {
    _cleanHomologationProcessData()
  })

  return {
    informationForm,
    basicForm,
    processedHomologationsTableProps,
    vouchers_mappings_process_name_types,
    account_structures_active,
    vouchers_mappings_process_types,
    business_trusts,
    goToURL,
    updatePage,
    updatePerPage,
    selectProcessType,
    cleanForm,
    revertBulkHomologation,
    downloadResults,
    _cleanHomologationProcessData,
  }
}

export default useRevertBulkHomologationForm
