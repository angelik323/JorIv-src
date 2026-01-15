// Vue - Vue Router - Pinia - Quasar
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces - Constants
import { IFieldFilters } from '@/interfaces/customs'
import { IOperatingOfficeExtended } from '@/interfaces/customs/fics/OperatingOffices'
import { StatusID } from '@/interfaces/global'
import { status } from '@/constants'

// Composables
import { useGoToUrl, useMainLoader, useRouteValidator, useUtils } from '@/composables'

// Stores
import { useOperatingOfficesStore } from '@/stores/fics/operating-offices'

const useOperationOfficesList = () => {
  const { _getOperatingOfficesList, _patchOperatingOffices } =
    useOperatingOfficesStore('v1')
  const { operating_offices_list, operating_offices_pages } = storeToRefs(
    useOperatingOfficesStore('v1')
  )

  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const filtersFormat = ref<Record<string, string | number>>({})
  const alertModalStatusRef = ref()
  const isTableEmpty = ref(true)
  const showState = ref(0)

  const alertModalStatusConfig = ref({
    title: 'Advertencia',
    description: '',
    id: null as unknown as number,
  })

  const headerProps = {
    title: 'Oficinas de operación',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Oficinas de operación',
        route: 'OperatingOfficesList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      options: status,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código del registro',
    },
  ])

  const tableProps = ref({
    title: 'Listado de oficinas de operación',
    loading: false,
    columns: [
      {
        name: 'regional_code',
        required: false,
        label: 'Código Regional',
        align: 'left',
        field: 'regional_code',
        sortable: true,
      },
      {
        name: 'regional_description',
        required: false,
        label: 'Descripción Regional',
        align: 'left',
        field: 'regional_description',
        sortable: true,
      },
      {
        name: 'offices',
        required: false,
        label: 'Oficinas físicas y virtuales',
        align: 'left',
        field: (row: { offices: { office_description: string }[] }) =>
          row.offices.map((office) => office.office_description).join(', '),
        sortable: false,
      },
      {
        name: 'web',
        required: false,
        label: 'Web',
        align: 'left',
        field: (row) => (row.web ? 'Si' : 'No'),
        sortable: true,
      },
      {
        name: 'status_id',
        label: 'Estado',
        align: 'center',
        field: 'status_id',
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IOperatingOfficeExtended[],
    pages: operating_offices_pages,
  })

  const updatePage = async (page: number) =>
    await listAction({ ...filtersFormat.value, page })

  const updatePerPage = async (rowsPerPage: number) =>
    await listAction({ ...filtersFormat.value, rows: rowsPerPage })

  const listAction = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProps.value.rows = []

    await _getOperatingOfficesList(filters)

    const hasResults = operating_offices_list.value.length > 0

    isTableEmpty.value = !hasResults
    showState.value = filters ? 1 : 0

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }
  const handleFilter = async ($filters: {
    'filter[from_business]': string
    'filter[from_name_business]': string
  }) => await listAction({ ...$filters })

  const handleClear = () => {
    showState.value = 0
    isTableEmpty.value = true
    tableProps.value.rows = []
    filterConfig.value[0].value = null
    filterConfig.value[1].value = null
  }

  const handleOptions = async (option: string, id: number) => {
    switch (option) {
      case 'edit':
        goToURL('OperatingOfficesEdit', id)
        break
      case 'view':
        goToURL('OperatingOfficesView', id)
        break
      default:
        break
    }
  }

  const openAlertModal = async (row: IOperatingOfficeExtended) => {
    alertModalStatusConfig.value.description = setAlertModalDescription(
      row.status_id
    )
    alertModalStatusConfig.value.id = row.id
    await alertModalStatusRef.value.openModal()
  }
  const setAlertModalDescription = (statusId: number) => {
    const action = statusId === StatusID.ACTIVE ? 'inactivar' : 'activar'
    return `¿Desea ${action} esta región?`
  }
  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const changeStatusAction = async () => {
    openMainLoader(true)
    await alertModalStatusRef.value.closeModal()

    await _patchOperatingOffices(alertModalStatusConfig.value.id)
    openMainLoader(false)

    await listAction({ ...filtersFormat.value })
  }

  watch(
    () => operating_offices_list.value,
    () => (tableProps.value.rows = operating_offices_list.value)
  )

  onMounted(async () => {
    if (route.query.reload === 'true') await listAction({})
  })

  return {
    goToURL,
    showState,
    tableProps,
    updatePage,
    headerProps,
    handleClear,
    isRowActive,
    filterConfig,
    handleFilter,
    isTableEmpty,
    handleOptions,
    updatePerPage,
    openAlertModal,
    validateRouter,
    changeStatusAction,
    defaultIconsLucide,
    alertModalStatusRef,
    alertModalStatusConfig,
  }
}

export default useOperationOfficesList
