// vue | quasar | router
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { QTable } from 'quasar'
import moment from 'moment'

// store
import { storeToRefs } from 'pinia'
import { useAccoutingReportStore, useResourceManagerStore } from '@/stores'

// composables
import { useAlert, useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { ITabs } from '@/interfaces/global'
import {
  IAccountingReportListReceiptsTable,
  ReportTypes,
  TAccountingReportListReceiptsFilters,
} from '@/interfaces/customs'

const useAccountingReportListReceiptsCreate = () => {
  const listReceipts = useAccoutingReportStore(
    'v1',
    'listReceipts'
  ) as ReportTypes['listReceipts']

  const { _reportListReceipts, _downloadPdf, _downloadPdfIndividual } =
    listReceipts
  const { data_information_form, receipts_list, receipts_pages } =
    storeToRefs(listReceipts)

  const { _getResources } = useResourceManagerStore('v1')
  const { showAlert } = useAlert()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const informationFormRef = ref()
  const receiptFormRef = ref()
  const downloadType = ref<number | null>(0)

  // props
  const headerProps = {
    title: 'Crear listado de comprobantes contables',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
      },
      {
        label: 'Reportes',
      },
      {
        label: 'Reportes contables',
        route: 'AccoutingReportList',
      },
      {
        label: 'Listado de comprobantes contables',
        route: 'AccountingReportListReceiptsCreate',
      },
      {
        label: 'Crear',
      },
    ],
  }
  const tableReceiptProps = ref({
    title: '',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'center',
        style: 'width: 70px',
        headerStyle: 'text-align:center;',
      },
      {
        name: 'period',
        required: false,
        label: 'Periodo',
        align: 'left',
        field: 'period',
        sortable: true,
      },
      {
        name: 'voucher',
        required: true,
        label: 'Comprobante',
        align: 'left',
        field: 'voucher',
        sortable: true,
      },
      {
        name: 'voucher_subtype',
        required: true,
        label: 'Subtipo del comprobante',
        align: 'left',
        field: 'voucher_subtype',
        sortable: true,
      },
      {
        name: 'consecutive',
        required: true,
        label: 'Consecutivo',
        align: 'left',
        field: 'consecutive',
        sortable: true,
      },
      {
        name: 'register_date',
        required: true,
        label: 'Fecha',
        align: 'left',
        field: 'register_date',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IAccountingReportListReceiptsTable[],
    pages: receipts_pages,
  })
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'receipt',
      label: 'Comprobantes',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  // checkbox
  const selectedRows = ref<number[]>([])

  const selectAllRows = (event: {
    rows: number
    selected: IAccountingReportListReceiptsTable[]
  }) => {
    const allIds = event.selected
      .map((row) => row.id)
      .filter((id) => typeof id === 'number') as number[]

    selectedRows.value = [...allIds]
  }

  const selectedRow = async (id: number) => {
    // Si el id ya está seleccionado, lo quitamos; si no, lo agregamos
    const idx = selectedRows.value.indexOf(id)
    if (idx === -1) {
      selectedRows.value.push(id)
    } else {
      selectedRows.value.splice(idx, 1)
    }
    // Actualizamos el campo is_selected en las filas
    tableReceiptProps.value.rows = tableReceiptProps.value.rows.map((item) => ({
      ...item,
      is_selected:
        typeof item.id === 'number' && selectedRows.value.includes(item.id),
    }))
  }

  // tabs
  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )
  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  // handlers / actions
  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  //Function to map download type new implementation
  const getFileType = (): 'excel' | 'pdf' | 'all' | undefined => {
    const typeMap: Record<number, 'excel' | 'pdf' | 'all'> = {
      1: 'excel',
      2: 'pdf',
      3: 'all',
    }
    return downloadType.value === null ? undefined : typeMap[downloadType.value]
  }

  const makeDataRequest = () => {
    const form = data_information_form.value
    if (!form) return

    const format_to_period = moment(form.to_period, 'YYYY-MM-DD').format(
      'YYYY-MM'
    )
    const format_from_period = moment(form.from_period, 'YYYY-MM-DD').format(
      'YYYY-MM'
    )

    const format: TAccountingReportListReceiptsFilters = {
      'filter[accounting_structure_id]': form.accounting_structure_id,
      'filter[business_trust_id]': form.business_trust_id,
      'filter[from_consecutive]': form.from_consecutive,
      'filter[from_period]': format_from_period,
      'filter[from_receipt_types_id]': form.from_receipt_types_id,
      'filter[to_consecutive]': form.to_consecutive,
      'filter[to_period]': format_to_period,
      'filter[to_receipt_types_id]': form.to_receipt_types_id,
      report_template_id: form.report_template_id,
      file_type: getFileType(),
    }

    return formatParamsCustom(format)
  }

  const onListingReport = async () => {
    if (!(await validateForm())) {
      showAlert('El registro no pudo ser creado.', 'error')
      return
    }

    openMainLoader(true)
    const payload = makeDataRequest()
    if (!payload) return

    const success = await _reportListReceipts('&' + payload)
    if (success) {
      tabActiveIdx.value = tabActiveIdx.value + 1
      tabActive.value = tabs.value[tabActiveIdx.value].name
    }
    openMainLoader(false)
  }

  const onGenerate = async () => {
    const params = new URLSearchParams()
    if (downloadType.value === 0) {
      showAlert('Seleccione el tipo de descarga', 'error', undefined, 2000)
      return
    }
    if (selectedRows.value.length === 0) {
      showAlert(
        'Seleccione uno o varios elementos a descargar',
        'error',
        undefined,
        2000
      )
      return
    }

    openMainLoader(true)
    const payload = makeDataRequest()
    if (!payload) return

    selectedRows.value.forEach((id) => {
      params.append('voucherIds[]', String(id))
    })
    const success = await _downloadPdf(payload, params.toString())

    if (success) {
      setTimeout(() => {
        router.push({ name: 'AccoutingReportList' })
      }, 2000)
    }
    openMainLoader(false)
  }

  const onGenerateIndividual = async (id: string) => {
    const payload = makeDataRequest()
    openMainLoader(true)
    if (!payload) return
    await _downloadPdfIndividual(payload, Number(id))
    openMainLoader(false)
  }
  const listAction = async (filters: string = '') => {
    tableReceiptProps.value.rows = []
    tableReceiptProps.value.loading = true

    const payload = makeDataRequest()
    if (!payload) return
    await _reportListReceipts('&' + payload + filters)
    tableReceiptProps.value.loading = false
  }
  const updatePage = (page: number) => {
    const queryString = formatParamsCustom({ page: page })

    listAction(queryString ? '&' + queryString : '')
  }

  const updateRows = (rows: number) => {
    const queryString = formatParamsCustom({ rows: rows, page: 1 })

    listAction(queryString ? '&' + queryString : '')
  }

  // lifecycle hooks
  onMounted(async () => {
    const keys = {
      voucher_consecutives_by_business_trust_and_receipt_type: {
        accounting: ['voucher_consecutives_by_business_trust_and_receipt_type'],
      },
      business_trusts_with_description: {
        accounting: ['business_trusts_with_description'],
      },
      structure_by_business: {
        accounting: ['structure_by_business'],
      },
      template: {
        accounting: ['template'],
      },
    }

    await await Promise.all([
      _getResources(keys.business_trusts_with_description),
      _getResources(keys.structure_by_business, 'filter[business_id]=24'),
      _getResources(keys.template, '', 'v2'),
    ])
  })

  // watchers
  watch(
    () => receipts_list.value,
    () => {
      tableReceiptProps.value.rows = receipts_list.value.map((receipt) => ({
        is_selected: false,
        ...receipt,
      }))
      tableReceiptProps.value.pages = receipts_pages.value
    }
  )

  return {
    informationFormRef,
    tableReceiptProps,
    receiptFormRef,
    tabActiveIdx,
    downloadType,
    headerProps,
    tabActive,
    tabs,
    onGenerateIndividual,
    selectedRow,
    selectAllRows,
    onListingReport,
    onGenerate,
    updatePage,
    updateRows,
    backTab,
  }
}

export default useAccountingReportListReceiptsCreate
