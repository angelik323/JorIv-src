import { ITreasuryClosingErrorSummary } from '@/interfaces/customs'
import {
  useTreasuryClosingErrorsSummaryStore,
  useTreasuryClosingStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export const useTreasuryClosingErrorsSummaryList = () => {
  const router = useRouter()
  const { treasury_closing_execution_id } = storeToRefs(
    useTreasuryClosingStore('v1')
  )
  const {
    treasury_closing_errors_summary_list,
    treasury_closing_errors_summary_pages,
  } = storeToRefs(useTreasuryClosingErrorsSummaryStore('v1'))
  const {
    _getTreasuryClosingErrorsSummaryList,
    _downloadExcelTreasuryClosingErrorsSumaryList,
  } = useTreasuryClosingErrorsSummaryStore('v1')

  const isTreasuryClosingErrorsSummaryListEmpty = ref(true)
  const perPage = ref(20)

  const headerProps = {
    title: 'Log´s errores de cierre de tesorería',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Cierre de tesoreria',
        route: 'treasuryClosingList',
      },
    ],
  }

  const tableProps = ref<{
    loading: boolean
    columns: QTable['columns']
    rows: ITreasuryClosingErrorSummary[]
    pages: typeof treasury_closing_errors_summary_pages
  }>({
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
        required: false,
        label: 'Negocio',
        align: 'left',
        field: 'business',
        sortable: true,
      },
      {
        name: 'bank_account',
        required: false,
        label: 'Cuenta bancaria',
        align: 'left',
        field: 'bank_account',
        sortable: true,
      },
      {
        name: 'process',
        required: false,
        label: 'Proceso',
        align: 'left',
        field: 'process',
        sortable: true,
      },
      {
        name: 'message',
        required: false,
        label: 'Mensaje de error',
        align: 'left',
        field: 'message',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [],
    pages: treasury_closing_errors_summary_pages,
  })
  const filtersFormat = ref<Record<string, string | number>>({})

  const _listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getTreasuryClosingErrorsSummaryList({
      ...filters,
      'filter[closing_id]': treasury_closing_execution_id.value,
    })
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage.value,
    }
    await _listAction(filtersFormat.value)
  }

  const updateRowsPerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage.value,
    }

    await _listAction(filtersFormat.value)
  }

  const handleGoBack = () => {
    router.push({ name: 'TreasuryClosingList' })
  }

  const downloadAction = () => {
    if (!treasury_closing_execution_id.value) {
      return
    }
    _downloadExcelTreasuryClosingErrorsSumaryList({
      'filter[closing_id]': treasury_closing_execution_id.value,
    })
  }

  watch(
    () => treasury_closing_errors_summary_list.value,
    () => {
      tableProps.value.rows = treasury_closing_errors_summary_list.value
    }
  )

  onMounted(async () => {
    if (!treasury_closing_execution_id.value) {
      router.push({ name: 'TreasuryClosingList' })
      return
    }
    tableProps.value.loading = true
    await _listAction({
      page: treasury_closing_errors_summary_pages.value.currentPage,
    })
    isTreasuryClosingErrorsSummaryListEmpty.value =
      treasury_closing_errors_summary_list.value.length === 0
    tableProps.value.loading = false
  })

  return {
    headerProps,
    handleGoBack,
    tableProps,
    isTreasuryClosingErrorsSummaryListEmpty,
    updatePage,
    updateRowsPerPage,
    downloadAction,
  }
}

export default useTreasuryClosingErrorsSummaryList
