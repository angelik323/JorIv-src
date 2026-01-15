// Vue - Vue Router - Pinia - Quasar
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IBulkUploadList,
  IBulkUploadValidOperations,
} from '@/interfaces/customs/fics/BulkUpload'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useBulkUploadFicsStore } from '@/stores/fics/bulk-upload'

const useBulkUploadTemplatesView = () => {
  const { defaultIconsLucide, formatCurrency, formatParamsCustom } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const {
    _getApiOpePercent,
    _getApiValidOperations,
    _getByIdFieldsBulkUpload,
    _downloadDetailBulkUpload,
  } = useBulkUploadFicsStore('v1')
  const {
    data_ope_percent_list,
    data_ope_percent_pages,
    data_valid_operations_list,
    data_valid_operations_pages,
  } = storeToRefs(useBulkUploadFicsStore('v1'))

  const filtersFormat = ref<Record<string, string | number>>({})
  const informationFormRef = ref()

  const id = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id

  const headerProps = {
    title: 'Ver cargue masivo',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Cargues masivos',
        route: 'FicsBulkUploadList',
      },
      {
        label: 'Ver',
      },
      {
        label: id,
      },
    ],
  }

  const tableValidOperationsProps = ref({
    title: 'Operaciones validadas',
    loading: false,
    columns: [
      {
        name: 'line_number',
        required: false,
        label: '#',
        align: 'left',
        field: 'line_number',
        sortable: true,
      },
      {
        name: 'investment_plan',
        required: false,
        label: 'Plan de inversión',
        align: 'left',
        field: 'investment_plan',
        sortable: true,
        format: (_, item) => item.row?.codigo_plan_de_inversion || '',
      },
      {
        name: 'operation',
        required: false,
        label: 'Descripción operación',
        align: 'left',
        field: 'operation',
        sortable: true,
      },
      {
        name: 'value',
        required: false,
        label: 'Valor de la operación',
        align: 'left',
        field: 'value',
        sortable: true,
        format: (_, item) =>
          formatCurrency(
            item.row?.valor_del_aporte
              ? item.row?.valor_del_aporte
              : item.row?.valor_del_retiro
          ),
      },
      {
        name: 'pass_fund_limit',
        required: false,
        label: 'Supera porcentaje del fondo',
        align: 'center',
        field: 'pass_fund_limit',
        sortable: true,
        format: (_, item) => (item.pass_fund_limit ? 'Si' : 'No'),
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
        format: (_, item) => item.status?.id || '',
      },
    ] as QTable['columns'],
    rows: [] as IBulkUploadValidOperations[],
    pages: data_valid_operations_pages,
  })

  const tableOpePercentProps = ref({
    title: 'Operaciones que superan el porcentaje del fondo',
    loading: false,
    columns: [
      {
        name: 'line_number',
        required: false,
        label: '#',
        align: 'left',
        field: 'line_number',
        sortable: true,
      },
      {
        name: 'investment_plan',
        required: false,
        label: 'Plan de inversión',
        align: 'left',
        field: 'investment_plan',
        sortable: true,
        format: (_, item) => item.row?.codigo_plan_de_inversion || '',
      },
      {
        name: 'operation',
        required: false,
        label: 'Descripción operación',
        align: 'left',
        field: 'operation',
        sortable: true,
      },
      {
        name: 'value',
        required: false,
        label: 'Valor de la operación',
        align: 'left',
        field: 'value',
        sortable: true,
        format: (_, item) =>
          formatCurrency(
            item.row?.valor_del_aporte
              ? item.row?.valor_del_aporte
              : item.row?.valor_del_retiro
          ),
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
        format: (_, item) => item.status?.id || '',
      },
    ] as QTable['columns'],
    rows: [] as IBulkUploadList[],
    pages: data_ope_percent_pages,
  })

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const handleGoToBack = () =>
    goToURL('FicsBulkUploadList', undefined, { reload: true })

  const updatePageValidOperations = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listActionValidOperations(queryString ? '&' + queryString : '')
  }

  const updatePerPageValidOperations = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listActionValidOperations(queryString ? '&' + queryString : '')
  }

  const listActionValidOperations = async (filters: string = '') => {
    tableValidOperationsProps.value.loading = true
    tableValidOperationsProps.value.rows = []
    await _getApiValidOperations(Number(id), filters)
    tableValidOperationsProps.value.loading = false
  }

  const updatePageOpePercent = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listActionOpePercent(queryString ? '&' + queryString : '')
  }

  const updatePerPageOpePercent = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listActionOpePercent(queryString ? '&' + queryString : '')
  }

  const listActionOpePercent = async (filters: string = '') => {
    tableOpePercentProps.value.loading = true
    tableOpePercentProps.value.rows = []
    await _getApiOpePercent(Number(id), filters)
    tableOpePercentProps.value.loading = false
  }

  const exportExcel = async () => {
    openMainLoader(true)
    await _downloadDetailBulkUpload(id)
    openMainLoader(false)
  }

  onMounted(async () => {
    openMainLoader(true)

    await _getApiValidOperations(Number(id), '')
    await _getApiOpePercent(Number(id), '')
    await _getByIdFieldsBulkUpload(Number(id))

    openMainLoader(false)
  })

  watch(
    () => data_ope_percent_list.value,
    () => {
      tableOpePercentProps.value.rows = data_ope_percent_list.value
      tableOpePercentProps.value.pages = data_ope_percent_pages.value
    },
    { deep: true }
  )

  watch(
    () => data_valid_operations_list.value,
    () => {
      tableValidOperationsProps.value.rows = data_valid_operations_list.value
      tableValidOperationsProps.value.pages = data_valid_operations_pages.value
    },
    { deep: true }
  )

  return {
    tabs,
    tabActive,
    headerProps,
    exportExcel,
    tabActiveIdx,
    handleGoToBack,
    informationFormRef,
    updatePageOpePercent,
    tableOpePercentProps,
    updatePerPageOpePercent,
    updatePageValidOperations,
    tableValidOperationsProps,
    updatePerPageValidOperations,
  }
}

export default useBulkUploadTemplatesView
