import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { defaultIcons, formatParamsCustom } from '@/utils'
import { IClientList, IFieldFilters } from '@/interfaces/customs'
import { ActionType, DropdownOption } from '@/interfaces/global'
import { useClientsStore, useResourceStore } from '@/stores'
import { QTable } from 'quasar'
import moment from 'moment'
import { useGoToUrl, useMainLoader, useRouteValidator } from '@/composables'

const useClientList = () => {
  const { _getListAction, _cleanClientsData, _changeStatusAction } =
    useClientsStore('v1')
  const { status, customer_status } = storeToRefs(useResourceStore('v1'))
  const { clients_list, client_pages } = storeToRefs(useClientsStore('v1'))
  const { getResources } = useResourceStore('v1')
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()

  const tableProps = ref({
    title: 'Listado de clientes',
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
        name: 'name',
        required: true,
        label: 'Nombre o razón social',
        align: 'left',
        field: (row: IClientList) => `${row.name_or_razon_social}`,
        sortable: true,
        style: {
          'max-width': '200px',
          'min-width': '200px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'client_type',
        required: true,
        label: 'Tipo de cliente',
        align: 'left',
        field: (row: IClientList) =>
          `${row.third_party_category ?? 'Sin información'}`,
        sortable: true,
      },
      {
        name: 'person_type',
        required: true,
        label: 'Tipo de persona',
        align: 'left',
        field: (row: IClientList) => `${row.type_person}`,
        sortable: true,
      },
      {
        name: 'document_number',
        required: true,
        label: 'Número de documento',
        align: 'left',
        field: (row: IClientList) => `${row.document}`,
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
    ] as QTable['columns'],
    rows: [] as IClientList[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const headerProps = {
    title: 'Vinculación de clientes',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Clientes',
        route: '',
      },
      {
        label: 'Vinculación de clientes',
        route: 'ClientsList',
      },
    ],
    dropdowns_options: [
      {
        label: 'Crear cliente natural',
        icon: 'User',
        routeName: 'NaturalPersonCreate',
      },
      {
        label: 'Crear cliente jurídico',
        icon: 'Building',
        routeName: 'LegalPersonCreate',
      },
    ],
  }

  const optionsCalendar = (date: string) =>
    date <= moment().format('YYYY/MM/DD')

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: [...status.value, { label: 'Bloqueado', value: 51 }],
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'third_party_category',
      label: 'Tipo de cliente',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: [
        {
          label: 'Todos',
          value: null,
        },
        {
          label: 'Directo',
          value: 'directo',
        },
        {
          label: 'Indirecto',
          value: 'indirecto',
        },
      ],
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'person_type',
      label: 'Tipo de persona',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: [
        {
          label: 'Natural',
          value: 'natural',
        },
        {
          label: 'Jurídica',
          value: 'legal',
        },
        {
          label: 'Fideicomiso',
          value: 'trust',
        },
      ],
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      prepend_icon: defaultIcons.magnify,
      clean_value: true,
      placeholder: 'Buscar por nombre / razón social o número de documento',
    },
    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: '',
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      option_calendar: optionsCalendar,
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: '',
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      option_calendar: optionsCalendar,
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const optionsClient = ref<DropdownOption[]>([
    {
      label: 'Crear cliente directo',
      icon: 'User',
      type: 'group',
      children: [
        {
          label: 'Persona natural',
          icon: 'SquareUser',
          routeName: 'NaturalPersonCreate',
          routeParams: { client_type: 'direct', person_type: 'natural' },
        },
        {
          label: 'Persona jurídica',
          icon: 'Briefcase',
          routeName: 'LegalEntity',
          routeParams: { client_type: 'direct', person_type: 'legal' },
        },
        {
          label: 'Fideicomiso',
          icon: 'Book',
          routeName: 'TrustorPersonCreate',
          routeParams: { client_type: 'direct', person_type: 'trust' },
        },
      ],
    },
    {
      label: 'Crear cliente indirecto',
      icon: 'Users',
      type: 'group',
      children: [
        {
          label: 'Persona natural',
          icon: 'SquareUser',
          routeName: 'NaturalPersonCreate',
          routeParams: { client_type: 'indirect', person_type: 'natural' },
        },
        {
          label: 'Persona jurídica',
          icon: 'Briefcase',
          routeName: 'LegalEntity',
          routeParams: { client_type: 'indirect', person_type: 'legal' },
        },
      ],
    },
    {
      label: 'Ambos',
      icon: 'Copy',
      type: 'item',
      routeName: 'ClientsBoth',
      routeParams: { client_type: 'both' },
    },
  ])

  const modelModalClient = ref<{ status: number | null; reason: string }>({
    status: null,
    reason: '',
  })

  const keys = ['customer_status']

  const alertModalRef = ref()

  const formModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const setAlertModalDescription = (status: string) => {
    return `¿Está seguro que desea ${status} el cliente?`
  }

  const openAlertModal = async (status: string, entityId: number) => {
    modelModalClient.value.status = null
    modelModalClient.value.reason = ''
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    await alertModalRef.value.openModal()
  }

  const handleFilter = ($filters: {
    'filter[status_id]': string
    'filter[client_type]': string
    'filter[person_type]': string
    'filter[search]': string
    'filter[start_date]': string
    'filter[end_date]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const changeStatusAction = () => {
    formModalRef.value.validate().then(async (success: boolean) => {
      if (success) {
        await alertModalRef.value.closeModal()
        openMainLoader(true)
        await _changeStatusAction(alertModalConfig.value.entityId as number, {
          status_id: modelModalClient.value.status as number,
          comment: modelModalClient.value.reason,
        })
        openMainLoader(false)
      }
    })
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    await listAction(queryString ? '&' + queryString : '')
  }

  const updateRows = (rows: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      limit: rows,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const handleClear = async () => {
    tableProps.value.rows = []
    filtersFormat.value = {}
  }

  const goToView = (action: ActionType, row: IClientList) => {
    let viewName = ''
    const typeFormatted = row.type_person
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()

    switch (typeFormatted) {
      case 'juridica':
        viewName = action == 'view' ? 'LegalPersonView' : 'LegalPersonEdit'
        break
      case 'natural':
        viewName = action == 'view' ? 'NaturePersonView' : 'NaturalPersonEdit'
        break
      case 'fideicomiso':
        viewName =
          action == 'view' ? 'TrustorPersonView' : 'TrustorPersonUpdate'
        break
    }

    goToURL(viewName, row.id)
  }

  onMounted(async () => {
    getResources(`keys[]=${keys.join('&keys[]=')}`)
    _cleanClientsData()
  })

  watch(
    () => clients_list.value,
    () => {
      tableProps.value.rows = clients_list.value
    }
  )

  watch(
    () => clients_list.value,
    () => {
      tableProps.value.pages = client_pages.value
    }
  )

  return {
    headerProps,
    defaultIcons,
    tableProps,
    optionsClient,
    alertModalRef,
    alertModalConfig,
    customer_status,
    modelModalClient,
    formModalRef,
    filterConfig,
    goToView,
    handleClear,
    handleFilter,
    openAlertModal,
    changeStatusAction,
    updatePage,
    updateRows,
    validateRouter,
  }
}

export default useClientList
