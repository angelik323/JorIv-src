// Vue - pinia - moment
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { QTable } from 'quasar'
import { IPortfolioClassificationList } from '@/interfaces/customs'
import { StatusID } from '@/interfaces/global'

// Composables
import { useMainLoader, useTable } from '@/composables'

// Stores
import { usePortfolioClassificationStore } from '@/stores'

const usePortfolioClassificationsList = () => {
  const { _getPortfolioClassificationList, _changeStatus, _clearData } =
    usePortfolioClassificationStore('v1')
  const { portfolio_classifications_list, portfolio_classifications_pages } =
    storeToRefs(usePortfolioClassificationStore('v1'))

  const { openMainLoader } = useMainLoader()
  let perPage = 20

  const headerProps = {
    title: 'Calificación de cartera',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
        route: '',
      },
      {
        label: 'Calificación de cartera',
        route: 'PortfolioClassificationList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado calificación de cartera',
    loading: false,
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
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IPortfolioClassificationList[],
    pages: portfolio_classifications_pages.value,
  })

  const { updateRowById } = useTable<IPortfolioClassificationList>(tableProps)

  const filtersFormat = ref<Record<string, string | number>>({})

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    id: null as number | null,
    statusId: null as number | null,
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getPortfolioClassificationList(filters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    await listAction({
      ...filtersFormat.value,
      page,
      rows: perPage,
    })
  }

  const setAlertModalDescription = (statusId: number) => {
    const action = statusId === StatusID.ACTIVE ? 'inactivar' : 'activar'
    return `¿Desea ${action} la calificación?`
  }

  const openAlertModal = async (row: IPortfolioClassificationList) => {
    alertModalConfig.value.description = setAlertModalDescription(
      row.comission_settlement_statuses_id
    )
    alertModalConfig.value.id = row.id
    alertModalConfig.value.statusId = row.comission_settlement_statuses_id
    await alertModalRef.value.openModal()
  }

  const changeStatusAction = async () => {
    const { id, statusId } = alertModalConfig.value
    if (!id || !statusId) return

    alertModalRef.value.closeModal()

    const nextStatusId =
      statusId === StatusID.ACTIVE ? StatusID.INACTIVE : StatusID.ACTIVE

    openMainLoader(true)
    const success = await _changeStatus(id)
    if (success)
      updateRowById(id, { comission_settlement_statuses_id: nextStatusId })
    openMainLoader(false)
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }

    await listAction({
      ...filtersFormat.value,
    })
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
      tableProps.value.rows = [...portfolio_classifications_list.value]

      const { currentPage, lastPage } = portfolio_classifications_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    headerProps,
    tableProps,
    alertModalRef,
    alertModalConfig,
    updatePerPage,
    updatePage,
    openAlertModal,
    changeStatusAction,
  }
}

export default usePortfolioClassificationsList
