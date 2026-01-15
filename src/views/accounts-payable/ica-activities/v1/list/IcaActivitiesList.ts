// core
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

// interfaces
import { IBaseTableProps, StatusID } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import {
  IIcaActivitiesItem,
  IIcaActivitiesFilters,
  IAvalibleCities,
} from '@/interfaces/customs/accounts-payable/IcaActivities'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useIcaActivitiesStore } from '@/stores/accounts-payable/ica-activities'

const useIcaActivitiesList = () => {
  // composables
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { formatCurrencyString, capitalize, defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { ciius } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { ica_activity_statuses } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )
  const { account_structures_payment_concepts } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const { _getAvalibleCities } = useIcaActivitiesStore('v1')

  const { _getActivityList, _toggleStatusActivity, _deleteActivity } =
    useIcaActivitiesStore('v1')

  // refs
  const keys = ref({
    third_party: ['ciius'],
    accounts_payable: ['ica_activity_statuses'],
    accounting: ['account_structures'],
  })
  const filtersFormat = ref<Record<string, string | number>>({})
  const showMore = ref(false)
  const showState = ref(false)
  const isListEmpty = ref(true)
  const alertModalRef = ref()
  const alertModalStatusRef = ref()
  const perPage = ref(20)
  const cities = ref()
  const filtersRef = ref()
  const thirdPartyId = ref()

  // configs
  const headerProps = {
    title: 'Actividades ICA',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Cuentas por pagar',
        route: '',
      },
      {
        label: 'Actividades ICA',
        route: 'IcaActivitiesList',
      },
    ],
    btn: {
      label: validateRouter('AccountsPayable', 'IcaActivitiesList', 'create')
        ? 'Crear actividad ICA'
        : undefined,
      icon: defaultIconsLucide.plusCircleOutline,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'city_id',
      label: 'Ciudad*',
      type: 'q-select',
      value: '',
      class: 'col-4',
      options: cities,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (val: string) => (val == null ? 'La ciudad es obligatoria' : true),
      ],
    },
    {
      name: 'third_party_id',
      label: 'NIT Tercero',
      type: 'q-input',
      value: '',
      class: 'col-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'periodicity',
      label: 'Periodicidad',
      type: 'q-input',
      value: '',
      class: 'col-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'economic_activity_id',
      label: 'Actividad económica',
      type: 'q-select',
      value: '',
      class: 'col-4',
      options: ciius,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'account_structure_id',
      label: 'Estructura contable',
      type: 'q-select',
      value: '',
      class: 'col-4',
      options: account_structures_payment_concepts,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: '',
      class: 'col-4',
      options: ica_activity_statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
  ])

  const tableProps = ref<IBaseTableProps<IIcaActivitiesItem>>({
    title: 'Listado de actividades ICA',
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
        name: 'city',
        required: false,
        label: 'Ciudad',
        align: 'left',
        field: (row) =>
          `${row.ica_relation?.city?.code ?? ''} - ${
            row.ica_relation?.city?.name ?? ''
          }`,
        sortable: true,
      },
      {
        name: 'economic_activity_id',
        required: false,
        label: 'Actividad económica',
        align: 'left',
        field: (row) => row.economic_activity?.code ?? '',
        sortable: true,
      },
      {
        name: 'economic_activity',
        required: false,
        label: 'Descripción actividad económica',
        align: 'left',
        field: (row) => row.economic_activity?.description ?? '',
        sortable: true,
      },
      {
        name: 'activity_type',
        required: false,
        label: 'Tipo de actividad',
        align: 'left',
        field: (row) => capitalize(row.activity_type),
        sortable: true,
      },
      {
        name: 'fiscal_charge_code',
        required: false,
        label: 'Cargo fiscal',
        align: 'left',
        field: (row) => row.fiscal_charge?.code ?? '',
        sortable: true,
      },
      {
        name: 'fiscal_charge',
        required: false,
        label: 'Descripción cargo fiscal',
        align: 'left',
        field: (row) => row.fiscal_charge?.name ?? '',
        sortable: true,
      },
      {
        name: 'applies_to_third_party',
        required: false,
        label: 'Aplica terceros registrados en cámara y comercio',
        align: 'center',
        field: 'applies_to_third_party',
        sortable: true,
      },
      {
        name: 'third_party_type',
        required: false,
        label: 'Tipo de tercero',
        align: 'left',
        field: (row) => capitalize(row.third_party_type),
        sortable: true,
      },
      {
        name: 'account_structure',
        required: false,
        label: 'Estructura contable',
        align: 'left',
        field: (row) => row.account_structure?.purpose ?? '',
        sortable: true,
      },
      {
        name: 'account_chart_code',
        required: false,
        label: 'Cuenta contable',
        align: 'left',
        field: (row) => row.account_chart?.code ?? '',
        sortable: true,
      },
      {
        name: 'account_chart',
        required: false,
        label: 'Descripción cuenta contable',
        align: 'left',
        field: (row) => row.account_chart?.name ?? '',
        sortable: true,
      },
      {
        name: 'settlement_concept',
        required: false,
        label: 'Concepto de liquidación',
        align: 'left',
        field: (row) => row.settlement_concept?.description ?? '',
        sortable: true,
      },
      {
        name: 'minimum_base_pesos',
        required: false,
        label: 'Base mínima en pesos',
        align: 'left',
        field: (item) => formatCurrencyString(item.minimum_base_pesos ?? 0),
        sortable: true,
      },
      {
        name: 'minimum_base_uvt',
        required: false,
        label: 'Base mínima en UVT',
        align: 'left',
        field: (item) => formatCurrencyString(item.minimum_base_uvt ?? 0),
        sortable: true,
      },
      {
        name: 'percentage',
        required: false,
        label: 'Porcentaje',
        align: 'left',
        field: (item) => (item.percentage ? `${item.percentage} %` : '-'),
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'left',
        field: 'actions',
        sortable: false,
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const alertModalConfig = ref({
    description: '¿Desea eliminar la actividad ICA?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
  })

  const alertModalStatusConfig = ref({
    description: '',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
    status_id: null as null | number,
  })

  // actions
  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const openAlertModal = (row: IIcaActivitiesItem) => {
    alertModalStatusConfig.value.id = row.id
    alertModalStatusConfig.value.status_id = row.status.id
    const statusText =
      row.status.id === StatusID.ACTIVE ? 'inactivar' : 'activar'
    alertModalStatusConfig.value.description = `¿Desea ${statusText} la actividad ICA?`
    alertModalStatusRef.value?.openModal()
  }

  const changeStatusAction = async () => {
    openMainLoader(true)
    const change = await _toggleStatusActivity(alertModalStatusConfig.value.id!)
    openMainLoader(false)

    if (change) {
      listAction(filtersFormat.value)
      alertModalStatusRef.value?.closeModal()
    }
  }

  const listAction = async (filters: typeof filtersFormat.value) => {
    tableProps.value.loading = true
    openMainLoader(true)

    if (!filters['filter[periodicity]']) {
      delete filters['filter[periodicity]']
    } else {
      filters['filter[periodicity]'] = String(
        filters['filter[periodicity]']
      ).toLowerCase()
    }

    const activity = await _getActivityList(filters)
    tableProps.value.rows = activity.data
    tableProps.value.pages = activity.pages

    openMainLoader(false)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: IIcaActivitiesFilters) => {
    filtersFormat.value = { ...$filters }

    if (filtersFormat.value['filter[third_party_id]'])
      filtersFormat.value['filter[third_party_id]'] = thirdPartyId.value ?? ''

    await listAction(filtersFormat.value)

    const hasResults = tableProps.value.rows.length > 0
    showState.value = filtersFormat.value ? true : false
    isListEmpty.value = !hasResults
  }

  const handleClearFilters = async () => {
    tableProps.value.rows = []
    tableProps.value.pages = {
      currentPage: 1,
      lastPage: 1,
    }
  }

  const handleShowFilters = () => {
    showMore.value = !showMore.value
    const hiddenFilters = [
      'economic_activity_id',
      'account_structure_id',
      'status_id',
    ]

    filterConfig.value.forEach((field) => {
      if (hiddenFilters.includes(field.name)) {
        field.hide = !showMore.value
      }
    })
  }

  const openDeleteModal = (id: number) => {
    alertModalConfig.value.id = id
    alertModalConfig.value.description = `¿Desea eliminar la actividad ICA número: ${id}?`
    alertModalRef.value?.openModal()
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.id) return

    openMainLoader(true)
    await alertModalRef.value.closeModal()
    const result = await _deleteActivity(alertModalConfig.value.id)

    if (result) {
      await listAction(filtersFormat.value)
    }
    openMainLoader(false)
  }

  const updatePage = async (page: number) => {
    await listAction({
      ...filtersFormat.value,
      rows: perPage.value,
      page,
    })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
      page: 1,
    }
    await listAction(filtersFormat.value)
  }

  const changeCity = ($event: IIcaActivitiesFilters) => {
    if (!$event['filter[city_id]']) {
      thirdPartyId.value = ''
      filtersRef.value.setFieldValueByName('third_party_id', '')
      filtersRef.value.setFieldValueByName('periodicity', '')
    } else {
      const cityFilter = parseInt($event['filter[city_id]'])

      if (cityFilter) {
        const city = cities.value.filter(
          (item: IAvalibleCities) => item.id == cityFilter
        )

        if (city) {
          thirdPartyId.value = city[0].third_party?.id ?? ''
          filtersRef.value.setFieldValueByName(
            'third_party_id',
            `${city[0].third_party?.document} ${
              city[0].third_party?.natural_person?.full_name ??
              city[0].third_party?.legal_person?.business_name ??
              ''
            }`
          )
          filtersRef.value.setFieldValueByName(
            'periodicity',
            capitalize(city[0].periodicity)
          )
        }
      }
    }
  }

  // lifecycle hooks
  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys.value)
    cities.value = await _getAvalibleCities({
      is_associated: true,
      has_activity: true,
    })
    cities.value = [{ value: '', label: 'Todas' }, ...cities.value]
    ciius.value = [{ value: '', label: 'Todas' }, ...ciius.value]
    account_structures_payment_concepts.value = [
      { value: '', label: 'Todos' },
      ...account_structures_payment_concepts.value,
    ]
    ica_activity_statuses.value = [
      { value: '', label: 'Todos' },
      ...ica_activity_statuses.value,
    ]
    openMainLoader(false)
  })

  onBeforeUnmount(() => _resetKeys(keys.value))

  return {
    // configs
    headerProps,
    filterConfig,
    tableProps,
    alertModalConfig,
    alertModalStatusConfig,

    // refs
    alertModalStatusRef,
    filtersRef,
    isListEmpty,
    showState,
    alertModalRef,

    // utils
    defaultIconsLucide,

    // methods
    handleFilter,
    handleClearFilters,
    handleShowFilters,
    handleDelete,
    openDeleteModal,
    openAlertModal,
    isRowActive,
    changeStatusAction,
    updatePage,
    updatePerPage,
    changeCity,
    goToURL,
    validateRouter,
  }
}

export default useIcaActivitiesList
