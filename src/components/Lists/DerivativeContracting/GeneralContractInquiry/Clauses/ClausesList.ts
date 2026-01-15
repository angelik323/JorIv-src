import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

//Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IContractClause } from '@/interfaces/customs/derivative-contracting/GeneralContractInquiry'

//Stores
import { useGeneralContractInquiryStore } from '@/stores/derivative-contracting/general-contract-inquiry'

//Composables
import { useUtils } from '@/composables/useUtils'

const useClausesList = (
  props: {
    contractId?: number | null
    sourceType?: string
  } = { sourceType: 'contrato' }
) => {

  const { _getClausesView } = useGeneralContractInquiryStore('v1')

  const { general_contract_inquiry_pages, clauses_view } = storeToRefs(
    useGeneralContractInquiryStore('v1')
  )

  let perPage = 20

  const { defaultIconsLucide } = useUtils()

  const tableProps_clauses = ref<IBaseTableProps<IContractClause>>({
    title: 'Cláusulas del contrato',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: (row) => row.id,
        sortable: true,
      },
      {
        name: 'order',
        required: true,
        label: 'Orden de cláusula',
        align: 'center',
        field: 'order',
        sortable: true,
      },
      {
        name: 'clause_type',
        required: true,
        label: 'Tipo de cláusula',
        align: 'left',
        field: (row) => row.clause_type?.name || 'N/A',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre de cláusula',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'clause',
        required: true,
        label: 'Cláusula',
        align: 'left',
        field: 'clause',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 }
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async () => {
    if (!props.contractId) return

    tableProps_clauses.value.rows = []
    tableProps_clauses.value.loading = true

    // Cargamos las cláusulas con el contractId y sourceType
    await _getClausesView(props.contractId, props.sourceType || 'contrato')

    tableProps_clauses.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    await listAction()
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
      page: 1,
    }

    await listAction()
  }

  onMounted(async () => {
    if (props.contractId) {
      filtersFormat.value = {
        rows: perPage,
      }
      await listAction()
    }
  })

  watch(
    () => clauses_view.value,
    () => {
      tableProps_clauses.value.rows = clauses_view.value

      const { currentPage, lastPage } = general_contract_inquiry_pages.value
      tableProps_clauses.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  watch(
    () => props.contractId,
    async (newId) => {
      if (newId) {
        filtersFormat.value = {
          rows: perPage,
        }
        await listAction()
      }
    }
  )

  return {
    defaultIconsLucide,
    tableProps_clauses,
    updatePage,
    updatePerPage,
  }
}

export default useClausesList
