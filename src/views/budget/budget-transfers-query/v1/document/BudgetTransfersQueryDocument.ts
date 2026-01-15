// Vue - Vue Router - Quasar
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
// Interfaces
import { IBaseTableProps, ITabs } from '@/interfaces/global'
// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'
import { IBudgetTransferQueryDocument } from '@/interfaces/customs/budget/BudgetTransferQuery'
// Stores
import { useBudgetTransferStore } from '@/stores/budget/budget-transfer-query'

const useBudgetTransferQueryDocument = () => {
  const { defaultIconsLucide, formatCurrency } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const { _listDocumentAction } = useBudgetTransferStore('v1')

  const id = route.params.id as string

  const headerProperties = {
    title: 'Lista de documentos asociados',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Presupuestos',
      },
      {
        label: 'Consultas de traslados presupuestales',
        route: 'BudgetTransfersQueryList',
      },
      {
        label: 'Documentos asociados',
        route: 'BudgetTransfersQueryDocument',
      },
      {
        label: id,
      },
    ],
  }

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

  const tableProperties = ref<
    IBaseTableProps<IBudgetTransferQueryDocument & { '#'?: number }>
  >({
    title: 'Lista de documentos asociados',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'vigency',
        label: 'Vigencia',
        align: 'left',
        field: 'vigency',
        sortable: true,
      },
      {
        name: 'document_type',
        label: 'Tipo de documento',
        align: 'left',
        field: (row) => row.document_type || 'N/A',
        sortable: true,
      },
      {
        name: 'document_number',
        label: 'Número de documento',
        align: 'left',
        field: 'document_number',
        sortable: true,
      },
      {
        name: 'value',
        label: 'Valor',
        align: 'left',
        field: (row) => formatCurrency(Number(row.value || 0)),
        sortable: true,
      },

      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'id',
        sortable: false,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const loadData = async () => {
    openMainLoader(true)

    const { success, data } = await _listDocumentAction(Number(id))

    if (success) {
      tableProperties.value.rows = data
    }

    openMainLoader(false)
  }

  const handleGoToList = () =>
    goToURL('BudgetTransfersQueryList', undefined, { reload: true })

  const handleViewDocument = (documentId: number) => {
    goToURL('BudgetDocumentsView', documentId)
  }

  onMounted(() => loadData())

  return {
    tabs,
    tabActive,
    tabActiveIdx,
    tableProperties,
    headerProperties,
    handleGoToList,
    handleViewDocument,
  }
}

export default useBudgetTransferQueryDocument
