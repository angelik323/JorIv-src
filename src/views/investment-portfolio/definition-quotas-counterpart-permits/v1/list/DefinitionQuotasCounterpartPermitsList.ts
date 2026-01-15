import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { useMainLoader, useRouteValidator } from '@/composables'
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import {
  IDefinitionQuotaCounterpartPermitList,
  IFieldFilters,
} from '@/interfaces/customs'
import { useDefinitionQuotaCounterpartPermitStore } from '@/stores'

const useDefinitionQuotaCounterpartPermitList = () => {
  const { _getListAction, _deleteAction, _clearData } =
    useDefinitionQuotaCounterpartPermitStore('v1')

  const { data_list, data_pages } = storeToRefs(
    useDefinitionQuotaCounterpartPermitStore('v1')
  )

  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const headerProps = {
    title: 'Definición cupos y permisos contraparte',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
        route: '/tesoreria',
      },
      {
        label: 'Definición cupos y permisos contraparte',
        route:
          '/portafolio-de-inversiones/definición-cupos-y-permisos-contraparte',
      },
    ],
    btnLabel: 'Crear',
    btnIcon: defaultIconsLucide.plusCircleOutline,
    btnColor: 'primary',
    btnTextColor: 'white',
    indentation: true,
    contentIndentation: true,
  }

  const tableProps = ref({
    title: 'Listado de cupos y permisos contraparte',
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
        name: 'document_counterpart',
        required: false,
        label: 'ID contraparte',
        align: 'left',
        field: 'document_counterpart',
        sortable: true,
      },
      {
        name: 'description_counterpart_name',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'description_counterpart_name',
        sortable: true,
      },
      {
        name: 'portfolio_code',
        required: false,
        label: 'Código Portafolio',
        align: 'left',
        field: 'portfolio_code',
        sortable: true,
      },
      {
        name: 'description_portfolio_name',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'description_portfolio_name',
        sortable: true,
      },
      {
        name: 'type_of_investment',
        required: false,
        label: 'Tipo de inversión',
        align: 'center',
        field: 'type_of_investment',
        sortable: true,
      },
      {
        name: 'papers',
        required: false,
        label: 'Papeles',
        align: 'center',
        field: 'papers',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [] as IDefinitionQuotaCounterpartPermitList,
    pages: data_pages.value,
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 q-py-md',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o coincidencia',
    },
  ])

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    entityId: null as number | null,
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const handleFilterClear = () => {
    filtersFormat.value = {}
    _clearData()
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
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

  const openAlertModal = async (action: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.title = `¿Desea ${action} el cupo y permiso contraparte?`
    await alertModalRef.value.openModal()
  }

  const deleteAction = async () => {
    if (!alertModalConfig.value.entityId) return

    await alertModalRef.value.closeModal()
    openMainLoader(true)
    await _deleteAction(alertModalConfig.value.entityId)
    await listAction()
    openMainLoader(false)
  }

  watch(
    () => data_list.value,
    () => {
      tableProps.value.rows = data_list.value
      tableProps.value.pages = {
        ...tableProps.value.pages,
        ...data_pages.value,
      }
    }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
    handleFilter,
    handleFilterClear,
    updatePage,
    updatePerPage,
    alertModalRef,
    alertModalConfig,
    openAlertModal,
    deleteAction,
    defaultIconsLucide,
    validateRouter,
  }
}

export default useDefinitionQuotaCounterpartPermitList
