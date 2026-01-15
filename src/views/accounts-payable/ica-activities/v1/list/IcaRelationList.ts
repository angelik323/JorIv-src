// core
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
  useRules,
  useAlertV2,
} from '@/composables'

// interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import {
  IAvalibleCities,
  IIcaRelationsFilters,
  IIcaRelationsForm,
  IIcaRelationsItem,
  IIcaRelationsPayload,
} from '@/interfaces/customs/accounts-payable/IcaActivities'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useIcaActivitiesStore } from '@/stores/accounts-payable/ica-activities'

const useIcaRelationsList = () => {
  // composables
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { is_required } = useRules()
  const { showAlert } = useAlertV2()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { periodicity } = storeToRefs(useAccountsPayableResourceStore('v1'))

  const {
    _getRelationsList,
    _createRelation,
    _getRelationById,
    _updateRelation,
    _deleteRelation,
    _getAvalibleCities,
  } = useIcaActivitiesStore('v1')

  // refs
  const keys = ref({
    accounts_payable: ['periodicity'],
  })
  const keysParams = ref({
    third_party: ['third_parties'],
  })
  const filtersFormat = ref<Record<string, string | number>>({})
  const showState = ref(false)
  const isListEmpty = ref(true)
  const alertModalRef = ref()
  const alertModalFormRef = ref()
  const perPage = ref(20)
  const formRef = ref()
  const cities = ref()
  const citiesAssociated = ref()
  const thirdParties = ref()

  const models = ref<IIcaRelationsPayload>({
    id: null,
    city_id: null,
    third_party_id: null,
    periodicity: null,
  })

  // configs
  const headerProps = {
    title: 'Relaciones ciudad - tercero',
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
      {
        label: 'Relaciones ciudad - tercero',
        route: 'IcaRelationList',
      },
    ],
    btn: {
      label: validateRouter('AccountsPayable', 'IcaActivitiesList', 'create')
        ? 'Crear'
        : undefined,
      icon: defaultIconsLucide.plusCircleOutline,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'city_id',
      label: 'Ciudad',
      type: 'q-select',
      value: '',
      class: 'col-4',
      options: citiesAssociated,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'third_party_id',
      label: 'NIT tercero',
      type: 'q-select',
      value: '',
      class: 'col-4',
      options: thirdParties,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'periodicity',
      label: 'Periodicidad',
      type: 'q-select',
      value: '',
      class: 'col-4',
      options: periodicity,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
  ])

  const tableProps = ref<IBaseTableProps<IIcaRelationsItem>>({
    title: 'Listado relación ciudad - tercero',
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
        name: 'city_code',
        required: false,
        label: 'Código ciudad',
        align: 'left',
        field: (row) => row.city?.code,
        sortable: true,
      },
      {
        name: 'city',
        required: false,
        label: 'Descripción ciudad',
        align: 'left',
        field: (row) => row.city?.name,
        sortable: true,
      },
      {
        name: 'third_party_nit',
        required: false,
        label: 'NIT tercero',
        align: 'left',
        field: (row) => row.third_party.document,
        sortable: true,
      },
      {
        name: 'third_party',
        required: false,
        label: 'Descripción tercero',
        align: 'left',
        field: (row) =>
          row.third_party.legal_person?.business_name ??
          row.third_party.natural_person?.full_name,
        sortable: true,
      },
      {
        name: 'periodicity',
        required: false,
        label: 'Periodicidad',
        align: 'left',
        field: (row) => row.periodicity.label,
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
    description: '¿Desea eliminar el registro de relación ciudad - tercero?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
  })

  const alertModalFormConfig = ref({
    title: '',
    description: '',
    textBtnConfirm: '',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
  })

  // actions
  const listAction = async (filters: typeof filtersFormat.value) => {
    tableProps.value.loading = true
    openMainLoader(true)

    const relation = await _getRelationsList(filters)
    tableProps.value.rows = relation.data
    tableProps.value.pages = relation.pages

    openMainLoader(false)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: IIcaRelationsFilters) => {
    filtersFormat.value = { ...$filters }

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

  const handleCreate = () => {
    alertModalFormConfig.value.title = 'Crear relación ciudad - tercero'
    alertModalFormConfig.value.description = ''
    alertModalFormConfig.value.textBtnConfirm = 'Crear'

    models.value = {
      id: null,
      city_id: null,
      third_party_id: null,
      periodicity: null,
    }

    alertModalFormRef.value?.openModal()
  }

  const handleEdit = async (id: number) => {
    alertModalFormConfig.value.title = 'Editar relación ciudad - tercero'
    alertModalFormConfig.value.description =
      'Cambiar el NIT tercero o la periodicidad, afectará la generación de los certificados previamente emitidos.'
    alertModalFormConfig.value.textBtnConfirm = 'Actualizar'

    openMainLoader(true)
    const relation: IIcaRelationsForm | null = await _getRelationById(id)
    openMainLoader(false)

    if (relation) {
      const { id, periodicity, city, third_party } = relation

      models.value.id = id
      models.value.periodicity = periodicity
      models.value.city_id = city.id
      models.value.third_party_id = third_party.id
    }

    alertModalFormRef.value?.openModal()
  }

  const changeThirdPartyNit = ($event: number) => {
    models.value.third_party_id = $event
    if (models.value.id) {
      showAlert({
        message:
          'Cambiar el NIT tercero afectará la generación de los certificados previamente emitidos. Asegúrese de que esta modificación es necesaria antes de continuar.',
        type: 'error',
        timeout: 0,
      })
    }
  }

  const changePeriodicity = ($event: string) => {
    models.value.periodicity = $event
    if (models.value.id) {
      showAlert({
        message:
          'Cambiar la periodicidad afectará la generación de los certificados previamente emitidos. Asegúrese de que esta modificación es necesaria antes de continuar.',
        type: 'error',
        timeout: 0,
      })
    }
  }

  const makePayload = () => {
    const { id, ...payload } = models.value

    return payload as IIcaRelationsPayload
  }

  const handleAction = async () => {
    if (await formRef.value.validate()) {
      const payload = makePayload()

      openMainLoader(true)
      if (models.value.id) {
        if (await _updateRelation(payload, models.value.id)) {
          alertModalFormRef.value?.closeModal()
          await listAction(filtersFormat.value)
        }
      } else {
        if (await _createRelation(payload)) {
          alertModalFormRef.value?.closeModal()

          citiesAssociated.value = await _getAvalibleCities({
            is_associated: true,
          })

          thirdParties.value = citiesAssociated.value.map(
            (item: IAvalibleCities) => ({
              value: item.third_party?.id,
              label: `${item.third_party?.document} ${
                item.third_party?.natural_person?.full_name ??
                item.third_party?.legal_person?.business_name ??
                ''
              }`,
            })
          )

          thirdParties.value = Array.from(
            new Set(
              thirdParties.value.map((obj: IAvalibleCities) =>
                JSON.stringify(obj)
              )
            )
          )
            .map((str) => JSON.parse(str as string))
            .sort((a, b) => {
              const numA = parseInt(a.label.split('-')[0], 10)
              const numB = parseInt(b.label.split('-')[0], 10)
              return numA - numB
            }) as IAvalibleCities[]

          thirdParties.value = [
            { value: '', label: 'Todos' },
            ...thirdParties.value,
          ]
          await listAction(filtersFormat.value)
        }
      }
      openMainLoader(false)
    }
  }

  const openDeleteModal = (id: number) => {
    alertModalConfig.value.id = id
    alertModalRef.value?.openModal()
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.id) return

    openMainLoader(true)
    await alertModalRef.value.closeModal()
    const result = await _deleteRelation(alertModalConfig.value.id)

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

  // lifecycle hooks
  const periodicityList = computed(() => {
    return periodicity.value.filter((item) => item.label != 'Todos')
  })

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys.value)
    await _getResources(
      keysParams.value,
      'sort=document&include[]=legalPerson&include[]=naturalPerson&fields[third_parties]=id,document,validator_digit,status_id,third_party_type,document_type_id&fields[legal_people]=third_party_id,id,business_name&fields[natural_people]=third_party_id,id,name,middle_name,last_name,second_last_name'
    )
    cities.value = await _getAvalibleCities({ is_associated: false })
    citiesAssociated.value = await _getAvalibleCities({ is_associated: true })

    thirdParties.value = citiesAssociated.value.map(
      (item: IAvalibleCities) => ({
        value: item.third_party?.id,
        label: `${item.third_party?.document} ${
          item.third_party?.natural_person?.full_name ??
          item.third_party?.legal_person?.business_name ??
          ''
        }`,
      })
    )

    thirdParties.value = Array.from(
      new Set(
        thirdParties.value.map((obj: IAvalibleCities) => JSON.stringify(obj))
      )
    )
      .map((str) => JSON.parse(str as string))
      .sort((a, b) => {
        const numA = parseInt(a.label.split('-')[0], 10)
        const numB = parseInt(b.label.split('-')[0], 10)
        return numA - numB
      }) as IAvalibleCities[]

    thirdParties.value = [{ value: '', label: 'Todos' }, ...thirdParties.value]
    periodicity.value = [{ value: '', label: 'Todos' }, ...periodicity.value]
    citiesAssociated.value = [
      { value: '', label: 'Todos' },
      ...citiesAssociated.value,
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
    alertModalFormConfig,

    // selects
    cities,
    citiesAssociated,
    third_parties,
    periodicityList,

    // refs
    models,
    isListEmpty,
    showState,
    alertModalRef,
    alertModalFormRef,
    formRef,

    // utils
    defaultIconsLucide,

    // methods
    handleFilter,
    handleClearFilters,
    handleDelete,
    openDeleteModal,
    updatePage,
    updatePerPage,
    goToURL,
    validateRouter,
    handleCreate,
    handleEdit,
    handleAction,
    changeThirdPartyNit,
    changePeriodicity,
    is_required,
  }
}

export default useIcaRelationsList
