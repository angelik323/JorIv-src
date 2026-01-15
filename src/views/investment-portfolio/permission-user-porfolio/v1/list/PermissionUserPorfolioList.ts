// vue | quasar | router
import { ref, watch } from 'vue'
import { QTable } from 'quasar'
import { useRouter } from 'vue-router'

// store
import { storeToRefs } from 'pinia'
import { usePermissionUserPorfolioStore } from '@/stores'

// composables
import { useMainLoader, useRouteValidator } from '@/composables'

// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { IPermissionUserPortfolioItemList } from '@/interfaces/customs'

const usePermissionUserPorfolioList = () => {
  const router = useRouter()
  const { validateRouter } = useRouteValidator()
  const { _getListAction, _deletePermissionUserPorfolio, _cleanData } =
    usePermissionUserPorfolioStore('v1')
  const { permission_user_porfolio_list, permission_user_porfolio_pages } =
    storeToRefs(usePermissionUserPorfolioStore('v1'))
  const { openMainLoader } = useMainLoader()

  // props
  const headerProps = {
    title: 'Permisos usuarios por portafolio',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
        route: '',
      },
      {
        label: 'Permisos usuarios por portafolio',
        route: 'PermissionUserPorfolioList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de permisos por portafolio',
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
        name: 'investment_portfolio_code',
        required: false,
        label: 'Código portafolio',
        align: 'left',
        field: 'investment_portfolio_code',
        sortable: true,
      },
      {
        name: 'investment_portfolio_name',
        required: true,
        label: 'Descripción portafolio',
        align: 'left',
        field: 'investment_portfolio_name',
        sortable: true,
      },
      {
        name: 'document',
        required: true,
        label: 'Código de usuario',
        align: 'left',
        field: 'document',
        sortable: true,
      },
      {
        name: 'user_name',
        required: true,
        label: 'Nombre de usuario',
        align: 'left',
        field: 'user_name',
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
    rows: [] as IPermissionUserPortfolioItemList[],
    pages: permission_user_porfolio_pages,
  })

  // filter
  const filtersFormat = ref<Record<string, string | number>>({})

  const filterConfig = ref([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-12 col-lg-12',
      disable: false,
      clean_value: true,
      prepend_icon: defaultIconsLucide.magnify,
      placeholder: 'Buscar por código o coincidencia',
    },
  ])

  // handlers / actions
  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const handleClearFilters = () => {
    _cleanData()
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []

    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: 20,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  // modal
  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const openAlertModal = async (row: IPermissionUserPortfolioItemList) => {
    alertModalConfig.value.entityId = row.id ?? null
    alertModalConfig.value.description = setAlertModalDescription(row)
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (row: IPermissionUserPortfolioItemList) => {
    return `¿Desea eliminar el permiso del usuario ${row.user_name} sobre el portafolio ${row.investment_portfolio_name}?`
  }
  const changeStatusAction = async () => {
    await alertModalRef.value.closeModal()
    openMainLoader(true)
    await _deletePermissionUserPorfolio(
      alertModalConfig.value.entityId as number
    )
    listAction('')
    openMainLoader(false)
  }

  // watchers
  watch(
    () => permission_user_porfolio_list.value,
    () => {
      tableProps.value.rows = permission_user_porfolio_list.value
      tableProps.value.pages = permission_user_porfolio_pages.value
    }
  )

  return {
    alertModalConfig,
    alertModalRef,
    filtersFormat,
    filterConfig,
    headerProps,
    tableProps,
    changeStatusAction,
    openAlertModal,
    updatePerPage,
    handleFilter,
    handleClearFilters,
    handlerGoTo,
    updatePage,
    validateRouter,
  }
}

export default usePermissionUserPorfolioList
