// Vue - pinia - moment
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IRejectionReasonItemList } from '@/interfaces/customs/fics/OperationRejectionReasons'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { StatusID } from '@/interfaces/global'

// Composables
import {
  useRules,
  useTable,
  useUtils,
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
} from '@/composables'

// Stores
import { useOperationRejectionReasonsStore } from '@/stores/fics/operation-rejection-reasons'
import { useResourceStore } from '@/stores/resources-selects'

const useOperationRejectionReasonsList = () => {
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { max_length } = useRules()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _getRejectionReasonsList, _changeStatus, _clearData } =
    useOperationRejectionReasonsStore('v1')
  const { rejection_reasons_list, rejection_reasons_pages } = storeToRefs(
    useOperationRejectionReasonsStore('v1')
  )
  const { status } = storeToRefs(useResourceStore('v1'))

  const filtersFormat = ref<Record<string, string | number>>({})
  const isTableEmpty = ref(true)
  const alertModalRef = ref()
  const showState = ref(0)

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
    statusId: null as number | null,
  })

  const headerProps = {
    title: 'Causales de rechazo de operación',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Causales de rechazo de operación',
        route: 'OperationRejectionReasonsList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de causales de rechazo de operación',
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
        name: 'code',
        field: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        sortable: true,
      },
      {
        name: 'description',
        field: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        field: 'status_id',
        required: true,
        label: 'Estado',
        align: 'center',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IRejectionReasonItemList[],
    pages: rejection_reasons_pages.value,
  })

  const { updateRowById } = useTable<IRejectionReasonItemList>(tableProps)

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: status,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por descripción o código',
      rules: [(val: string) => max_length(val, 50)],
    },
  ])

  const listAction = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProps.value.rows = []

    await _getRejectionReasonsList(filters)

    const hasResults = rejection_reasons_list.value.length > 0

    isTableEmpty.value = !hasResults
    showState.value = filters ? 1 : 0

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleFilter = async ($filters: {
    'filter[status_id]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    await listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) =>
    await listAction({
      ...filtersFormat.value,
      page,
    })

  const updateRowsPerPage = async (rowsPerPage: number) =>
    await listAction({ ...filtersFormat.value, rows: rowsPerPage })

  const setAlertModalDescription = (statusId: number) => {
    const action = statusId === StatusID.ACTIVE ? 'inactivar' : 'activar'
    return `¿Desea ${action} la causal de rechazo de operación?`
  }

  const openAlertModal = async (row: IRejectionReasonItemList) => {
    alertModalConfig.value.description = setAlertModalDescription(row.status_id)
    alertModalConfig.value.entityId = row.id
    alertModalConfig.value.statusId = row.status_id
    await alertModalRef.value.openModal()
  }

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const changeStatusAction = async () => {
    const { entityId, statusId } = alertModalConfig.value
    if (!entityId || !statusId) return

    alertModalRef.value.closeModal()

    const nextStatusId =
      statusId === StatusID.ACTIVE ? StatusID.INACTIVE : StatusID.ACTIVE

    openMainLoader(true)
    const success = await _changeStatus({ status_id: nextStatusId }, entityId)
    if (success) updateRowById(entityId, { status_id: nextStatusId })
    openMainLoader(false)
  }

  const handleClear = () => {
    showState.value = 0
    filtersFormat.value = {}
    isTableEmpty.value = true
    tableProps.value.rows = []
  }

  onMounted(async () => {
    _clearData()

    if (route.query.reload === 'true') await listAction({})
  })

  watch(
    rejection_reasons_list,
    () => {
      tableProps.value.rows = [...rejection_reasons_list.value]

      const { currentPage, lastPage } = rejection_reasons_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    goToURL,
    showState,
    tableProps,
    updatePage,
    isRowActive,
    handleClear,
    headerProps,
    filterConfig,
    handleFilter,
    isTableEmpty,
    alertModalRef,
    openAlertModal,
    validateRouter,
    alertModalConfig,
    updateRowsPerPage,
    defaultIconsLucide,
    changeStatusAction,
  }
}

export default useOperationRejectionReasonsList
