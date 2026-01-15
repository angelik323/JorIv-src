// Vue - pinia
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs'
import { IBaseTableProps } from '@/interfaces/global'
import { IAreasResponsibilityBasicDataResponse } from '@/interfaces/customs/budget/AreasResponsibility'

// Composables
import { useUtils, useMainLoader, useGoToUrl } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useBudgetAreasResponsibilityStore } from '@/stores/budget/areas-responsibility'

export const useBudgetAreasResponsibilityList = () => {
  const { goToURL } = useGoToUrl()
  const {
    _getListAction,
    _setDataAreasResponsibilityForm,
    _deleteAreasResponsibility,
    _downloadAreasResponsibility,
  } = useBudgetAreasResponsibilityStore('v1')
  const {
    headerPropsDefault,
    data_areas_responsibility_list,
    data_areas_responsibility_pages,
  } = storeToRefs(useBudgetAreasResponsibilityStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { budget_account_structures: account_structures } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { areas_resposabilities_types } = storeToRefs(
    useBudgetResourceStore('v1')
  )

  const area_structures = ref()
  const cost_center_structures = ref()

  const { openMainLoader } = useMainLoader()

  const { defaultIconsLucide, formatParamsCustom } = useUtils()

  const headerProperties = headerPropsDefault.value

  let perPage = 20

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
    cancelText: 'Cancelar',
    confirmText: 'Eliminar',
  })

  const filterFields = ref<IFieldFilters[]>([
    {
      name: 'structure_area_id',
      label: 'Estructura de área',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: area_structures,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'structure_cost_center_id',
      label: 'Estructura de centro de costo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: cost_center_structures,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'type',
      label: 'Tipo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: areas_resposabilities_types,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      autocomplete: false,
      clean_value: true,
      placeholder: 'Buscar por código y descripción',
    },
  ])

  const tableProperties = ref<
    IBaseTableProps<IAreasResponsibilityBasicDataResponse>
  >({
    title: 'Listado de áreas de responsabilidad',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: (row: IAreasResponsibilityBasicDataResponse) =>
          `${row.code} - ${row.description ?? ''}`,
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo',
        align: 'left',
        field: (row: IAreasResponsibilityBasicDataResponse) =>
          `${row.type ?? ''}`,
        sortable: true,
      },
      {
        name: 'structure_cost_center',
        required: true,
        label: 'Estructura centro de costo',
        align: 'left',
        field: (row: IAreasResponsibilityBasicDataResponse) =>
          `${row.structure_cost_center?.code} - ${
            row.structure_cost_center?.description ?? ''
          }`,
        sortable: true,
      },
      {
        name: 'auxiliary',
        required: true,
        label: 'Auxiliar',
        align: 'left',
        field: (row: IAreasResponsibilityBasicDataResponse) => {
          if (row.auxiliary) {
            return row.auxiliary?.natural_person
              ? `${row.auxiliary.document ?? ''} - ${
                  row.auxiliary?.natural_person?.full_name ?? ''
                }`
              : `${row.auxiliary.document ?? ''} - ${
                  row.auxiliary?.legal_person?.business_name ?? ''
                }`
          }
          return '-'
        },
        sortable: true,
      },
      {
        name: 'structure_area',
        required: true,
        label: 'Estructura de área',
        align: 'left',
        field: (row: IAreasResponsibilityBasicDataResponse) =>
          `${row.structure_area?.code} - ${
            row.structure_area?.description ?? ''
          }`,
        sortable: true,
      },
      {
        name: 'cost_center',
        required: true,
        label: 'Centro de costo',
        align: 'left',
        field: (row: IAreasResponsibilityBasicDataResponse) =>
          `${row.cost_center?.code ?? ''} - ${row.cost_center?.name ?? ''}`,
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

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: string = '') => {
    tableProperties.value.loading = true
    tableProperties.value.rows = []
    await _getListAction(filters)
    tableProperties.value.loading = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const downloadAction = async () => {
    _downloadAreasResponsibility(filtersFormat.value)
  }

  const openAlertModal = async (status: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Desea ${status} el área de responsabilidad?`
  }

  const changeStatusAction = async () => {
    alertModalRef.value.closeModal()
    openMainLoader(true)
    await _deleteAreasResponsibility(alertModalConfig.value.entityId as number)

    filtersFormat.value = {
      ...filtersFormat.value,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
    openMainLoader(false)
  }

  const handleClear = () => {
    tableProperties.value.rows = []
  }

  const handleFilterSearch = async ($filters: {
    'filter[structure_area_id]': string
    'filter[structure_cost_center_id]': string
    'filter[type]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  onMounted(async () => {
    await _getResources(
      { accounting: ['account_structures'] },
      'filter[type]=Catálogo de unidades ejecutoras&filter[status_id]=Activo'
    )
    area_structures.value = account_structures.value
    await _getResources(
      { accounting: ['account_structures'] },
      'filter[type]=Catálogo de centros de costo&filter[status_id]=Activo'
    )
    cost_center_structures.value = account_structures.value
    await _getResources({
      budget: ['areas_resposabilities_types'],
    })
  })

  onBeforeUnmount(() => {
    _resetKeys({
      accounting: ['account_structures'],
      budget: ['areas_resposabilities_types'],
    })
    _setDataAreasResponsibilityForm(null)
  })

  watch(
    () => data_areas_responsibility_list.value,
    () => {
      tableProperties.value.rows = data_areas_responsibility_list.value
    }
  )

  watch(
    () => data_areas_responsibility_pages.value,
    () => {
      tableProperties.value.pages = data_areas_responsibility_pages.value
    }
  )

  return {
    headerProperties,
    filterFields,
    tableProperties,
    defaultIconsLucide,
    area_structures,
    alertModalRef,
    listAction,
    updatePage,
    updatePerPage,
    handleClear,
    handleFilterSearch,
    openAlertModal,
    changeStatusAction,
    downloadAction,
    goToURL,
  }
}
export default useBudgetAreasResponsibilityList
