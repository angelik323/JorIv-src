import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { defaultIcons, formatParamsCustom } from '@/utils'
import { IClientList, IFieldFilters } from '@/interfaces/customs'
import { ActionType, DropdownOption } from '@/interfaces/global'
import {
  ClientPersonType,
  ClientType,
  PersonType,
} from '@/interfaces/global/Clients'
import { useResourceStore } from '@/stores'
import { useClientsStore } from '@/stores/clients'
import { QTable } from 'quasar'
import moment from 'moment'
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

const useClientList = () => {
  const { _getListAction, _changeStatusAction, _setClientContext } =
    useClientsStore('v2')
  const { status, customer_status } = storeToRefs(useResourceStore('v1'))
  const { clients_list, clients_pages } = storeToRefs(useClientsStore('v2'))
  const { getResources } = useResourceStore('v1')
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  const { normalizeText } = useUtils()

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
          routeParams: {
            clientPersonType: ClientPersonType.NATURAL_DIRECT,
            clientType: ClientType.DIRECT,
            personType: PersonType.NATURAL,
          },
        },
        {
          label: 'Persona jurídica',
          icon: 'Briefcase',
          routeName: 'LegalEntity',
          routeParams: {
            clientPersonType: ClientPersonType.LEGAL_DIRECT,
            clientType: ClientType.DIRECT,
            personType: PersonType.LEGAL,
          },
        },
        {
          label: 'Fideicomiso',
          icon: 'Book',
          routeName: 'TrustorPersonCreate',
          routeParams: {
            clientPersonType: ClientPersonType.TRUST,
            clientType: ClientType.DIRECT,
            personType: PersonType.TRUST,
          },
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
          routeName: 'NaturalPersonCreateV2',
          routeParams: {
            clientPersonType: ClientPersonType.NATURAL_INDIRECT,
            clientType: ClientType.INDIRECT,
            personType: PersonType.NATURAL,
          },
        },
        {
          label: 'Persona jurídica',
          icon: 'Briefcase',
          routeName: 'LegalEntityV2',
          routeParams: {
            clientPersonType: ClientPersonType.LEGAL_INDIRECT,
            clientType: ClientType.INDIRECT,
            personType: PersonType.LEGAL,
          },
        },
      ],
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

  const handleBtnSelect = (option: DropdownOption) => {
    _setClientContext({
      clientPersonType: option.routeParams?.clientPersonType,
      clientType: option.routeParams?.clientType,
      personType: option.routeParams?.personType,
    })
  }

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
    const typePerson = normalizeText(row.type_person)
    const typeClient = normalizeText(row.third_party_category)

    const validPersonTypes = Object.values(PersonType)
    const validClientTypes = Object.values(ClientType)

    if (!validPersonTypes.some((type) => normalizeText(type) === typePerson)) {
      return
    }

    if (
      !validClientTypes.includes(typeClient as ClientType) &&
      typePerson !== PersonType.TRUST
    ) {
      return
    }

    const compositeKey =
      typePerson === PersonType.TRUST
        ? PersonType.TRUST
        : `${typePerson}_${typeClient}`

    const routes: Record<
      ClientPersonType,
      {
        view: string
        edit: string
        clientType: ClientType
        personType: PersonType
      }
    > = {
      [ClientPersonType.LEGAL_DIRECT]: {
        view: 'LegalPersonView',
        edit: 'LegalPersonEdit',
        clientType: ClientType.DIRECT,
        personType: PersonType.LEGAL,
      },
      [ClientPersonType.LEGAL_INDIRECT]: {
        view: 'LegalPersonViewV2',
        edit: 'LegalPersonEditV2',
        clientType: ClientType.INDIRECT,
        personType: PersonType.LEGAL,
      },
      [ClientPersonType.NATURAL_DIRECT]: {
        view: 'NaturePersonView',
        edit: 'NaturalPersonEdit',
        clientType: ClientType.DIRECT,
        personType: PersonType.NATURAL,
      },
      [ClientPersonType.NATURAL_INDIRECT]: {
        view: 'NaturalPersonViewV2',
        edit: 'NaturalPersonEditV2',
        clientType: ClientType.INDIRECT,
        personType: PersonType.NATURAL,
      },
      [ClientPersonType.TRUST]: {
        view: 'TrustorPersonView',
        edit: 'TrustorPersonUpdate',
        clientType: ClientType.BOTH,
        personType: PersonType.TRUST,
      },
    }

    const selectedType = compositeKey as ClientPersonType
    const route = routes[selectedType]

    if (!route) {
      return
    }

    _setClientContext({
      clientPersonType: selectedType,
      clientType: route.clientType,
      personType: route.personType,
    })

    const viewName = action === 'view' ? route.view : route.edit

    goToURL(viewName, row.id)
  }

  onMounted(async () => {
    getResources(`keys[]=${keys.join('&keys[]=')}`)
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
      tableProps.value.pages = clients_pages.value
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

    handleBtnSelect,
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
