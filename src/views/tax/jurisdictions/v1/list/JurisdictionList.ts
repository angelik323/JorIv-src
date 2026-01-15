import { ref } from 'vue'

// Composables
import { useUtils, useGoToUrl, useMainLoader } from '@/composables'

// Interfaces
import { IFieldFilters, ITableProps } from '@/interfaces/customs'
import { ITaxJurisdictionList } from '@/interfaces/customs/tax/Jurisdiction'

// Stores
import { useJurisdictionsStore } from '@/stores/tax/jurisdictions'

// Constants
import { default_statuses_boolean } from '@/constants/resources'
import { levels } from '@/constants/resources/tax'

const useJurisdictionsList = () => {
  const { goToURL } = useGoToUrl()

  const title: string = 'Jurisdicciones'
  const breadcrumbs = [
    { label: 'Inicio', route: 'HomeView' },
    { label: 'Tributario', route: '' },
    { label: 'Jurisdicciones', route: 'JurisdictionsList' },
  ]
  const filtersConfig = ref<IFieldFilters[]>([
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      class: 'col-12 col-md-4',
      options: default_statuses_boolean,
      value: null,
      autocomplete: true,
      disable: false,
      clean_value: false,
    },
    {
      name: 'level',
      label: 'Nivel',
      type: 'q-select',
      class: 'col-12 col-md-4',
      options: levels,
      value: null,
      autocomplete: true,
      disable: false,
      clean_value: false,
    },
    {
      name: 'name',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      prepend_icon: useUtils().defaultIconsLucide.magnify,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por nombre, departamento o municipio',
    },
  ])

  const tableProps = ref<ITableProps<ITaxJurisdictionList>>({
    loading: false,
    title: 'Listado de jurisdicciones',
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'level',
        required: true,
        label: 'Nivel',
        align: 'left',
        field: 'level',
        sortable: true,
      },
      {
        name: 'country',
        required: true,
        label: 'País',
        align: 'left',
        field: (row: ITaxJurisdictionList) =>
          row.country_code ? `${row.country_code} - ${row.country_name}` : '',
        sortable: true,
      },
      {
        name: 'department',
        required: true,
        label: 'Departamento',
        align: 'left',
        field: (row: ITaxJurisdictionList) =>
          row.department_code
            ? `${row.department_code} - ${row.department_name}`
            : '',
        sortable: true,
      },
      {
        name: 'city',
        required: true,
        label: 'Municipio',
        align: 'left',
        field: (row: ITaxJurisdictionList) =>
          row.municipality_code
            ? `${row.municipality_code} - ${row.municipality_name}`
            : '',
        sortable: true,
      },
      {
        name: 'tax_authority',
        required: true,
        label: 'Autoridad Tributaria',
        align: 'left',
        field: 'tax_authority',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ],
    rows: [],
    customColumns: ['actions', 'status'],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const filtersFormat = ref<Record<string, string | number | boolean>>({})

  const alertModalProps = ref({
    title: 'Advertencia',
    description: '',
    id: null as number | null,
    type: '',
  })

  const alertModalRef = ref()

  const openAlertModal = async (action: string, row: ITaxJurisdictionList) => {
    alertModalProps.value.id = row.id
    alertModalProps.value.type = action

    const actions: Record<string, () => string> = {
      delete: () => setAlertModalDescriptionDelete(),
      status: () => setAlertModalDescriptionChangeStatus(row),
    }

    alertModalProps.value.description = actions[action]()
    await alertModalRef.value.openModal()
  }

  const closeAlertModal = async () => {
    await alertModalRef.value.closeModal()
  }

  const setAlertModalDescriptionDelete = () => {
    return `¿Está seguro que desea eliminar la Jurisdicción?`
  }

  const setAlertModalDescriptionChangeStatus = (row: ITaxJurisdictionList) => {
    return `¿Está seguro que desea ${
      !row.is_active ? 'activar' : 'inactivar'
    } la jurisdicción ${row.name} ?`
  }

  const handlerAlertModal = async () => {
    const dispatch: Record<string, () => Promise<boolean>> = {
      delete: () =>
        useJurisdictionsStore('v1')._deleteJurisdiction(
          alertModalProps.value.id as number
        ),
      status: () =>
        useJurisdictionsStore('v1')._changeStatusJurisdiction(
          alertModalProps.value.id as number
        ),
    }

    useMainLoader().openMainLoader(true)
    const success = await dispatch[alertModalProps.value.type]()
    useMainLoader().openMainLoader(false)
    if (success) {
      closeAlertModal()
      listAction('')
    }
  }

  const handlerFilter = (
    filters: Record<string, string | number | boolean>
  ) => {
    filtersFormat.value = {
      ...filters,
    }

    const queryString = useUtils().formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '?' + queryString : '')
  }

  const listAction = async (params: string) => {
    tableProps.value.loading = true
    const response = await useJurisdictionsStore('v1')._getJurisdictions(params)
    tableProps.value.rows = response?.data ?? []
    tableProps.value.pages = response?.pages

    setTimeout(() => {
      tableProps.value.loading = false
    }, 1000)
  }

  const updatePage = async (page: number, rows: number = 20) => {
    const queryString = useUtils().formatParamsCustom({
      ...filtersFormat.value,
      page,
      rows,
    })
    await listAction(queryString ? '?' + queryString : '')
  }

  const handlerClear = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
    tableProps.value.pages = { currentPage: 1, lastPage: 1 }
  }

  return {
    title,
    breadcrumbs,
    defaultIconsLucide: useUtils().defaultIconsLucide,
    filtersConfig,
    tableProps,
    alertModalProps,
    alertModalRef,
    goToURL,
    handlerFilter,
    openAlertModal,
    closeAlertModal,
    handlerAlertModal,
    updatePage,
    handlerClear,
  }
}

export default useJurisdictionsList
