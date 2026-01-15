// Vue - pinia - moment
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IPortfolioClassificationList } from '@/interfaces/customs/settlement-commissions/PortfolioClassification'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useTable,
  useUtils,
} from '@/composables'

// Stores
import { usePortfolioClassificationStore } from '@/stores/settlement-commissions/portfolio-classification'

const usePortfolioClassificationsList = () => {
  const {
    _getPortfolioClassificationList,
    _deletePortfolioClassification,
    _clearData,
  } = usePortfolioClassificationStore('v2')
  const {
    headerPropsDefault,
    portfolio_classifications_list,
    portfolio_classifications_pages,
  } = storeToRefs(usePortfolioClassificationStore('v2'))

  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const headerProperties = headerPropsDefault.value

  const tableProperties = ref<IBaseTableProps<IPortfolioClassificationList>>({
    title: 'Listado calificación de cartera',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'type',
        field: 'type',
        required: true,
        label: 'Calificación',
        align: 'left',
        sortable: true,
      },
      {
        name: 'days_start',
        field: 'days_start',
        required: true,
        label: 'Días de mora inicio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'days_end',
        field: 'days_end',
        required: true,
        label: 'Días de mora fin',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const { removeRowById } =
    useTable<IPortfolioClassificationList>(tableProperties)

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar la calificación de cartera?',
    id: null as number | null,
    statusId: null as number | null,
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    await _getPortfolioClassificationList(filters)
    tableProperties.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const openAlertModal = async (row: IPortfolioClassificationList) => {
    alertModalConfig.value.id = row.id
    await alertModalRef.value.openModal()
  }

  const updateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction(filtersFormat.value)
  }

  const handleDeleteAction = async () => {
    const { id } = alertModalConfig.value
    if (!id) return

    openMainLoader(true)
    const success = await _deletePortfolioClassification(id)
    if (success) {
      await alertModalRef.value.closeModal()
      removeRowById(id)
    }
    openMainLoader(false)
  }

  onMounted(async () => {
    _clearData()
    filtersFormat.value = {
      page: 1 as number,
      rows: 20,
    }
    await listAction({
      ...filtersFormat.value,
    })
  })

  watch(
    portfolio_classifications_list,
    () => {
      tableProperties.value.rows = [...portfolio_classifications_list.value]

      const { currentPage, lastPage } = portfolio_classifications_pages.value
      tableProperties.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    headerProperties,
    tableProperties,
    alertModalRef,
    alertModalConfig,
    defaultIconsLucide,

    updateRowsPerPage,
    updatePage,
    openAlertModal,
    handleDeleteAction,
    goToURL,
    validateRouter,
  }
}

export default usePortfolioClassificationsList
