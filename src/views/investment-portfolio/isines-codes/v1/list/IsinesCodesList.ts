// vue | quasar | router
import { QTable } from 'quasar'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

// store
import { storeToRefs } from 'pinia'
import { useIsinesCodesStore } from '@/stores'

// composables
import { useMainLoader, useRouteValidator } from '@/composables'

// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { IIsinesCodesForm } from '@/interfaces/customs'

const useIsinesCodesList = () => {
  const router = useRouter()
  const { validateRouter } = useRouteValidator()
  const { _getListAction, _deleteIsinesCodes } = useIsinesCodesStore('v1')
  const { isines_codes_list, isines_codes_pages } = storeToRefs(
    useIsinesCodesStore('v1')
  )
  const { openMainLoader } = useMainLoader()

  // props
  const headerProps = {
    title: 'Códigos ISINES',
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
        label: 'Códigos ISINES',
        route: 'IsinesCodesList',
      },
    ],
  }
  const tableProps = ref({
    title: 'Listado de códigos ISINES',
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
        name: 'isin_code',
        required: false,
        label: 'Código ISIN',
        align: 'left',
        field: 'isin_code',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'mnemonic',
        required: true,
        label: 'Nemotécnico',
        align: 'left',
        field: 'mnemonic',
        sortable: true,
      },
      {
        name: 'issuer_code',
        required: true,
        label: 'Código emisor',
        align: 'left',
        field: 'issuer_code',
        sortable: true,
      },
      {
        name: 'title_class',
        required: true,
        label: 'Clase de título',
        align: 'left',
        field: 'title_class',
        sortable: true,
      },
      {
        name: 'issue_date',
        required: true,
        label: 'Fecha de emisión',
        align: 'left',
        field: 'issue_date',
        sortable: true,
      },
      {
        name: 'maturity_date',
        required: true,
        label: 'Fecha de vencimiento',
        align: 'left',
        field: 'maturity_date',
        sortable: true,
      },
      {
        name: 'perioricity',
        required: true,
        label: 'Periodicidad',
        align: 'left',
        field: 'perioricity',
        sortable: true,
      },
      {
        name: 'rate_type',
        required: true,
        label: 'Tipo de tasa',
        align: 'left',
        field: 'rate_type',
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
    rows: [] as IIsinesCodesForm[],
    pages: isines_codes_pages,
  })

  // filter
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

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  // handlers / actions
  const listAction = async (filters: string = '', page = 1) => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getListAction(filters, page)
    tableProps.value.loading = false
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const handleChangePage = async (page: number) => {
    const queryString = formatParamsCustom(filtersFormat.value)
    const filters = queryString ? `&${queryString}` : ''
    await listAction(filters, page)
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const handleClearFilters = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  // modal
  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const openAlertModal = async (entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription()
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = () => {
    return `¿Desea eliminar el código ISIN?`
  }

  const changeStatusAction = async () => {
    await alertModalRef.value.closeModal()
    openMainLoader(true)
    await _deleteIsinesCodes(alertModalConfig.value.entityId as number)
    listAction('')
    openMainLoader(false)
  }

  // watchers
  watch(
    () => isines_codes_list.value,
    () => {
      tableProps.value.rows = isines_codes_list.value
      tableProps.value.pages = isines_codes_pages.value
    }
  )

  return {
    alertModalConfig,
    filtersFormat,
    alertModalRef,
    filterConfig,
    headerProps,
    tableProps,
    changeStatusAction,
    handleClearFilters,
    handleChangePage,
    openAlertModal,
    updatePerPage,
    handleFilter,
    handlerGoTo,
    validateRouter,
  }
}

export default useIsinesCodesList
