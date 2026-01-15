// Vue
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'
import {
  INoveltyListItem,
  INoveltyListResponseItem,
} from '@/interfaces/customs/fixed-assets/v1/Register-Authorization-Changes'

// Composables
import {
  useUtils,
  useGoToUrl,
  useRules,
  useMainLoader,
  useRouteValidator,
} from '@/composables'
import { fixed_asset_source_options } from '@/constants/resources/index'

// Stores
import { useFixedAssetsNoveltiesStore } from '@/stores/fixed-assets/register-authorization-changes'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useFixedAssetsNoveltiesList = () => {
  const store = useFixedAssetsNoveltiesStore('v1')
  const { _listAction, _authorizeAction, _cancelAction } = store
  const { _getResources } = useResourceManagerStore('v1')
  const {
    statuses_fixed_assets,
    fixed_assets_configuration_subtypes,
    novelty_code,
  } = storeToRefs(useFixedAssetsResourceStore('v1'))

  const keys = {
    fixed_assets: [
      'novelty_code',
      'statuses_fixed_assets',
      'fixed_assets_configuration_subtypes',
    ],
  }

  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()
  const { max_length } = useRules()
  const { openMainLoader } = useMainLoader()
  const headerProperties = {
    title: 'Registro y autorización de novedad de activos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Activos Fijos', route: 'RegisterAuthorizationChangesList' },
      {
        label: 'Registro y autorización de novedades',
        route: 'FixedAssetsNoveltiesList',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
      routeName: 'RegisterAuthorizationChangesCreate',
      color: 'primary',
      textColor: 'white',
      size: 'md',
      class: 'btn-header',
      outline: false,
      disable: false,
    },
  }

  const filterComponentRef = ref()
  const hasSearched = ref(false)

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'source',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Fuente',
      placeholder: 'Seleccione',
      options: fixed_asset_source_options,
      value: null,
      clean_value: true,
      disable: false,
    },
    {
      name: 'search',
      type: 'q-input',
      class: 'col-12 col-md-3',
      label: 'Buscador',
      placeholder: 'Buscar por descripción',
      value: null,
      clean_value: true,
      rules: [(val: string) => max_length(val, 100)],
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
    },
    {
      name: 'id',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Código novedad',
      placeholder: 'Seleccione',
      disable: false,
      options: novelty_code,
      value: null,
      clean_value: true,
    },
    {
      name: 'fixed_asset',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Activo fijo / Bien',
      placeholder: 'Seleccione',
      options: fixed_assets_configuration_subtypes,
      value: null,
      clean_value: true,
      disable: false,
    },
    {
      name: 'status_id',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Estado activo',
      placeholder: 'Seleccione',
      options: statuses_fixed_assets,
      value: null,
      clean_value: true,
      disable: false,
    },
  ])

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const tableProperties = ref<IBaseTableProps<INoveltyListItem>>({
    title: 'Listado activos fijos/bienes con novedad',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'novelty_id',
        label: 'Código novedad',
        align: 'left',
        field: (row) => row.id,
        sortable: true,
      },
      {
        name: 'novelty_description',
        label: 'Descripción novedad',
        align: 'left',
        field: 'novelty_description',
        sortable: true,
      },
      {
        name: 'source',
        label: 'Fuente',
        align: 'left',
        field: 'source',
        sortable: true,
      },
      {
        name: 'novelty_type',
        label: 'Tipo de novedad',
        align: 'left',
        field: (row) => row.novelty_type.description,
        sortable: true,
      },
      {
        name: 'estimated_solution_date',
        label: 'Fecha de solución',
        align: 'left',
        field: 'estimated_solution_date',
        sortable: true,
      },
      {
        name: 'cost',
        label: 'Costo',
        align: 'right',
        field: 'cost',
        sortable: true,
      },
      {
        name: 'asset_status',
        label: 'Estado activo',
        align: 'left',
        field: (row) => row.asset_status.status,
        sortable: true,
      },
      {
        name: 'novelty_status',
        label: 'Estado novedad',
        align: 'left',
        field: (row) => row.novelty_status.status,
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const listAction = async () => {
    tableProperties.value.loading = true

    const response = await _listAction({
      paginate: true,
      ...filtersFormat.value,
    })

    tableProperties.value.loading = false

    if (!response) {
      tableProperties.value.rows = []
      tableProperties.value.pages = { currentPage: 1, lastPage: 1 }
      return
    }

    tableProperties.value.rows = response.data.map(
      (item: INoveltyListResponseItem): INoveltyListItem => ({
        id: item.id,
        novelty_code: item.novelty_type?.code ?? '-',
        novelty_description: item.description,
        source: item.source,
        novelty_type: item.novelty_type,
        estimated_solution_date: item.solution_date,
        cost: Number(item.cost),
        asset_status: item.asset_status,
        novelty_status: item.status,
      })
    )

    tableProperties.value.pages = {
      currentPage: response.current_page,
      lastPage: response.last_page,
    }
  }

  const confirmModalRef = ref<{
    openModal: () => void
    closeModal: () => void
  } | null>(null)

  const confirmActionType = ref<'authorize' | 'cancel' | null>(null)
  const selectedNovelty = ref<INoveltyListItem | null>(null)
  const confirmModalTitle = computed(() =>
    confirmActionType.value === 'authorize'
      ? 'Autorizar novedad'
      : 'Anular novedad'
  )

  const confirmModalMessage = computed(() =>
    confirmActionType.value === 'authorize'
      ? '¿Desea autorizar la novedad registrada en el activo?'
      : '¿Desea anular la novedad registrada en el activo?'
  )

  const openAuthorizeModal = (row: INoveltyListItem) => {
    selectedNovelty.value = row
    confirmActionType.value = 'authorize'
    confirmModalRef.value?.openModal()
  }

  const openCancelModal = (row: INoveltyListItem) => {
    selectedNovelty.value = row
    confirmActionType.value = 'cancel'
    confirmModalRef.value?.openModal()
  }

  const confirmAction = async () => {
    if (!selectedNovelty.value || !confirmActionType.value) return

    openMainLoader(true)

    const success =
      confirmActionType.value === 'authorize'
        ? await _authorizeAction(selectedNovelty.value.id)
        : await _cancelAction(selectedNovelty.value.id)

    confirmModalRef.value?.closeModal()
    selectedNovelty.value = null
    confirmActionType.value = null

    if (success) {
      await listAction()
    }

    openMainLoader(false)
  }

  const handleFilterSearch = async (
    filters: Record<string, string | number>
  ) => {
    filtersFormat.value = {
      ...filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    hasSearched.value = true
    await listAction()
  }

  const handleClearFilters = async () => {
    filtersFormat.value = {
      page: 1,
      rows: filtersFormat.value.rows,
    }

    hasSearched.value = false
    tableProperties.value.rows = []
    tableProperties.value.pages = { currentPage: 1, lastPage: 1 }
  }

  const updatePage = async (page: number) => {
    if (!hasSearched.value) return
    filtersFormat.value.page = page
    await listAction()
  }

  const updateRowsPerPage = async (rows: number) => {
    if (!hasSearched.value) return
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    await listAction()
  }

  onMounted(async () => {
    openMainLoader(true)

    await _getResources({
      fixed_assets: keys.fixed_assets,
    })

    openMainLoader(false)
  })

  return {
    defaultIconsLucide,
    headerProperties,
    tableProperties,
    filterComponentRef,
    filterConfig,
    fixed_asset_source_options,
    confirmModalTitle,
    confirmModalMessage,
    selectedNovelty,
    confirmModalRef,
    validateRouter,
    goToURL,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
    openAuthorizeModal,
    openCancelModal,
    confirmAction,
  }
}

export default useFixedAssetsNoveltiesList
