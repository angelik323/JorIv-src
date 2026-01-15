import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

import { useGoToUrl, useUtils } from '@/composables'

import { IBulkUploadHistory } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

import { useBulkUploadStore, useResourceManagerStore } from '@/stores'

const useBulkUploadCreate = () => {
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const {
    _deleteAction,
    _listRecordAction,
    _getErrorsLogAction,
    _getCsvStructureAction,
  } = useBulkUploadStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { bulk_record_list, bulk_record_pages } = storeToRefs(
    useBulkUploadStore('v1')
  )

  const filtersFormat = ref<Record<string, string | number>>({})
  const bulkUploadFormRef = ref()
  const selectedType = ref('')

  let perPage = 20

  const bulkUploadId = computed(
    () => bulkUploadFormRef.value?.getValues().bulk_upload_id
  )

  const bulkUploadStatus = computed(
    () => bulkUploadFormRef.value?.getValues().status.id
  )

  const bulk_upload_options = {
    button: [
      {
        label: 'Cargue masivo de ingresos',
        action: () => _getCsvStructureAction('income'),
      },
      {
        label: 'Cargue masivo de egresos',
        action: () => _getCsvStructureAction('expense'),
      },
      {
        label: 'Cargue masivo de traslados',
        action: () => _getCsvStructureAction('transfer'),
      },
    ],
    table: [
      {
        label: 'Total registros',
        value: 'successful,with_errors',
      },
      {
        label: 'Existosos',
        value: 'successful',
      },
      {
        label: 'Errados',
        value: 'with_errors',
      },
    ],
  }

  const headerProperties = {
    title: 'Cargue masivo',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Cargue masivo de tesorería',
        route: 'BulkUploadCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'BulkUploadForm',
      label: 'Datos de entrada',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const tableProperties = ref({
    title: 'Listado de cargue masivo',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
        required: true,
      },
      {
        name: 'business_name',
        label: 'Negocio',
        align: 'left',
        field: (row) =>
          row.record_data?.business?.name ||
          `Fila ${row.row_number} - Error: ${row.error_message}` ||
          '-',
        sortable: true,
        required: true,
      },
      {
        name: 'bank_name',
        label: 'Banco',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'account_name',
        label: 'Cuenta',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'movement_code',
        label: 'Código de movimiento',
        align: 'left',
        sortable: true,
      },
      {
        name: 'nature',
        label: 'Naturaleza',
        align: 'left',
        sortable: true,
      },
      {
        name: 'beneficiary_nit',
        label: 'Nit beneficiario',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'total_value_formatted',
        label: 'Valor',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'status',
        label: 'Estado',
        align: 'center',
        field: (row) => row.status.id,
        sortable: true,
        required: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [] as IBulkUploadHistory[],
    pages: bulk_record_pages,
  })

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const loadData = async (filters: Record<string, string | number>) => {
    tableProperties.value.loading = true

    await _listRecordAction(bulkUploadId.value, filters)

    setTimeout(() => {
      tableProperties.value.loading = false
    }, 1000)
  }

  const handleDeleteBulkUpload = async (id: number) => {
    const success = await _deleteAction(id)

    if (success) {
      tableProperties.value.rows = []

      if (bulkUploadFormRef.value) bulkUploadFormRef.value.resetForm()
    }
  }

  const handleDownloadErrorsLog = async (id: number) =>
    await _getErrorsLogAction(id)

  const handleUpdatePage = async (page: number) =>
    await loadData({ ...filtersFormat.value, page })

  const handleUpdatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    await loadData({ ...filtersFormat.value, rows: perPage })
  }

  const handleGoTo = (goURL: string, recordId?: number) =>
    goToURL(goURL, { bulkUploadId: bulkUploadId.value, recordId })

  watch(bulkUploadId, async (newId) => {
    if (newId) await loadData({})
  })

  watch(selectedType, async (newValue) => {
    if (newValue) {
      const filters = {
        record_type: newValue,
        paginate: 1,
      }
      filtersFormat.value = filters

      await loadData({ ...filtersFormat.value })
    }
  })

  watch(
    () => bulk_record_list.value,
    () => {
      tableProperties.value.rows = bulk_record_list.value
      tableProperties.value.pages = bulk_record_pages.value
    }
  )

  onMounted(async () => {
    if (route.query.bulkUploadId) {
      bulkUploadFormRef.value.setValues(
        'bulk_upload_id',
        Number(route.query.bulkUploadId)
      )

      await loadData({})
    }

    await _getResources({
      treasury: ['business_trusts_egreso'],
      fics: ['offices'],
    })
  })

  onBeforeMount(() =>
    _resetKeys({
      treasury: ['business_trusts_egreso', 'business_bank_accounts'],
      fics: ['offices'],
    })
  )

  return {
    tabs,
    tabActive,
    handleGoTo,
    tabActiveIdx,
    bulkUploadId,
    selectedType,
    tableProperties,
    headerProperties,
    handleUpdatePage,
    bulkUploadStatus,
    bulkUploadFormRef,
    defaultIconsLucide,
    bulk_upload_options,
    handleUpdatePerPage,
    handleDeleteBulkUpload,
    handleDownloadErrorsLog,
  }
}

export default useBulkUploadCreate
