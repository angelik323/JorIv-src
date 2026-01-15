// Vue - pinia - moment
import { ref, watch } from 'vue'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IPaginated, IPaginatedFiltersFormat } from '@/interfaces/customs'
import { IBudgetDocumentsListItem } from '@/interfaces/customs/budget/BudgetDocuments'

// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Composables
import { useGoToUrl } from '@/composables/useGoToUrl'
import { usePaginatedTableList } from '@/composables/useTableList'
import { useRouteValidator } from '@/composables/useRoutesValidator'
import { useUtils } from '@/composables/useUtils'

// Stores
import { useBudgetDocumentsStore } from '@/stores/budget/budget-documents'

const useAssociatedBudgetDocumentsDetailsList = (props: {
  documentId: number
}) => {
  const { formatCurrency, formatDate, defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()

  const { _getDocumentById } = useBudgetDocumentsStore('v1')

  // Refs and computed props
  const tableProps = ref<IBaseTableProps<IBudgetDocumentsListItem>>({
    title: 'Detalle listado de documentos asociados',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        label: '#',
        sortable: true,
        align: 'left',
      },
      {
        name: 'business',
        field: (row) => row.business_trust?.code ?? '-',
        label: 'Negocio',
        sortable: true,
        align: 'left',
      },
      {
        name: 'business_description',
        field: (row) => row.business_trust?.name ?? '-',
        label: 'Descripción negocio',
        sortable: true,
        align: 'left',
      },
      {
        name: 'validity',
        field: 'vigency',
        label: 'Vigencia',
        sortable: true,
        align: 'left',
      },
      {
        name: 'date',
        field: (row) => formatDate(row.date, 'YYYY-MM-DD'),
        label: 'Fecha',
        sortable: true,
        align: 'left',
      },
      {
        name: 'document_type',
        field: (row) => row.budget_document_type.code ?? '-',
        label: 'Tipo de documento',
        sortable: true,
        align: 'left',
      },
      {
        name: 'document_type_description',
        field: (row) => row.budget_document_type.description ?? '-',
        label: 'Descripción de tipo documento',
        sortable: true,
        align: 'left',
      },
      {
        name: 'document_number',
        field: 'budget_document_number',
        label: 'Número de documento',
        sortable: true,
        align: 'left',
      },
      {
        name: 'addition',
        field: (row) => row.operation_log_document?.id ?? '-',
        label: 'Adición',
        sortable: true,
        align: 'left',
      },
      {
        name: 'responsability_area',
        field: (row) => row.responsability_area.code ?? '-',
        label: 'Área solicitante',
        sortable: true,
        align: 'left',
      },
      {
        name: 'responsability_area_description',
        field: (row) => row.responsability_area.description ?? '-',
        label: 'Descripción área solicitante',
        sortable: true,
        align: 'left',
      },
      {
        name: 'city',
        field: (row) => row.city?.id ?? '-',
        label: 'Ciudad',
        sortable: true,
        align: 'left',
      },
      {
        name: 'city_description',
        field: (row) => row.city?.name ?? '-',
        label: 'Descripción ciudad',
        sortable: true,
        align: 'left',
      },
      {
        name: 'third_party',
        field: (row) => {
          if (!row.third_party) return '-'
          return row.third_party.document
        },
        label: 'Beneficiario',
        sortable: true,
        align: 'left',
      },
      {
        name: 'third_party_description',
        field: (row) => {
          if (!row.third_party) return '-'
          return (
            row.third_party.name ??
            row.third_party.legal_person?.business_name ??
            row.third_party.natural_person?.full_name ??
            '-'
          )
        },
        label: 'Descripción beneficiario',
        sortable: true,
        align: 'left',
      },
      {
        name: 'value',
        field: (row) => formatCurrency(row.value),
        label: 'Valor',
        sortable: true,
        align: 'left',
      },
      {
        name: 'observations',
        field: (row) => row.observations ?? '-',
        label: 'Observaciones',
        sortable: true,
        align: 'left',
      },
      {
        name: 'status',
        field: 'status',
        label: 'Estado',
        required: false,
        sortable: false,
        align: 'left',
      },
      {
        name: 'actions',
        field: 'id',
        label: 'Acciones',
        required: false,
        sortable: false,
        align: 'left',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tableCustomColumns = ['status', 'actions']

  const selectedDocumentAccountingVoucher =
    ref<IBudgetDocumentsListItem | null>(null)

  const selectedDocumentOrderPayment = ref<IBudgetDocumentsListItem | null>(
    null
  )

  const accountingVoucherModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const paymentOrderModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  // Functions/Methods

  const listPromiseFn = async (
    _filters: IPaginatedFiltersFormat
  ): Promise<IPaginated<IBudgetDocumentsListItem>> => {
    const res = await _getDocumentById(props.documentId)

    return {
      list: !res ? [] : [res],
      pages: { currentPage: 0, lastPage: 0 },
    }
  }

  const { getFilterFormatValues, handleFilterSearch } = usePaginatedTableList({
    tableProps,
    listPromiseFn,
  })

  const isEnabledViewAction = (): boolean => {
    if (!validateRouter('Budget', 'BudgetDocumentsList', 'show')) return false
    return true
  }

  const handleGoToDetailView = (row: IBudgetDocumentsListItem) => {
    goToURL('BudgetDocumentsView', row.id)
  }

  const handleAccountingVoucherActionClick = async (
    row: IBudgetDocumentsListItem
  ) => {
    selectedDocumentAccountingVoucher.value = row
    await accountingVoucherModalRef.value?.openModal()
  }

  const handlePaymentOrderActionClick = async (
    row: IBudgetDocumentsListItem
  ) => {
    selectedDocumentOrderPayment.value = row
    await paymentOrderModalRef.value?.openModal()
  }

  // Watchers
  watch(
    () => props.documentId,
    async (documentId) => {
      await handleFilterSearch({
        ...getFilterFormatValues(),
        documentId,
      })
    },
    { immediate: true }
  )

  // Life cycle hooks

  return {
    // composable refs and variables
    defaultIconsLucide,

    // Refs and computed props
    tableProps,
    tableCustomColumns,
    accountingVoucherModalRef,
    paymentOrderModalRef,
    selectedDocumentAccountingVoucher,
    selectedDocumentOrderPayment,

    // Functions/Methods
    isEnabledViewAction,
    handleGoToDetailView,
    handleAccountingVoucherActionClick,
    handlePaymentOrderActionClick,
  }
}

export default useAssociatedBudgetDocumentsDetailsList
