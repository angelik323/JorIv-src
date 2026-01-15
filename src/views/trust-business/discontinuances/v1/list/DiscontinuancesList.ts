// vue - quasar - router - pinia
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'

// store
import { useDiscontinuancesStore } from '@/stores/trust-business/discontinuances'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useResourceManagerStore } from '@/stores/resources-manager'

// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

// interfaces
import { IDiscontinuancesList } from '@/interfaces/customs/trust-business/Discontinuances'

// composables
import { useMainLoader, useRouteValidator, useRules } from '@/composables'

const useDiscontinuancesList = () => {
  // imports
  const router = useRouter()
  const route = useRoute()

  const { validateRouter } = useRouteValidator()

  const { openMainLoader } = useMainLoader()

  const { _getListAction, _deleteAction } = useDiscontinuancesStore('v1')

  const { discontinuances_list, discontinuances_pages } = storeToRefs(
    useDiscontinuancesStore('v1')
  )

  const {
    business_trusts,
    business_trusts_property_withdrawals_states,
    business_trust_real_estate_project,
    project_stage,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    trust_business: [
      'business_trusts_property_withdrawals_states',
      'project_stage',
    ],
  }

  const keys2 = {
    trust_business: ['business_trusts'],
  }

  const keys3 = {
    trust_business: ['business_trust_real_estate_project'],
  }

  const currentRowsPerPage = ref<number>(20)

  // props
  const headerProps = {
    title: 'Desistimientos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
        route: '',
      },
      {
        label: 'Desistimientos',
        route: 'DiscontinuancesList',
      },
    ],
  }

  // table
  const tableProps = ref({
    title: 'Listado de desistimientos',
    loading: false,
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
        name: 'business_trust_name',
        required: true,
        label: 'Nombre del negocio',
        align: 'center',
        field: 'business_trust_name',
        sortable: true,
      },
      {
        name: 'project_name',
        required: true,
        label: 'Nombre del proyecto',
        align: 'center',
        field: 'project_name',
        sortable: true,
      },
      {
        name: 'project_stage',
        required: true,
        label: 'Etapa',
        align: 'center',
        field: 'project_stage',
        sortable: true,
      },
      {
        name: 'property_nomenclature',
        required: true,
        label: 'Apartamento/Casa',
        align: 'center',
        field: 'property_nomenclature',
        sortable: true,
      },
      {
        name: 'registration_date',
        required: true,
        label: 'Fecha de registro',
        align: 'center',
        field: 'registration_date',
        sortable: true,
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado del desistimiento',
        align: 'center',
        field: (row) => row.status_id,
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
    rows: [] as IDiscontinuancesList[],
    pages: discontinuances_pages.value,
  })

  const optionsMenu = ref([
    {
      label: 'Editar',
    },
    {
      label: 'Ver',
    },
    {
      label: 'Eliminar',
    },
    {
      label: 'Autorizar',
    },
  ])

  // filters
  const filterConfig = ref([
    {
      name: 'date_created',
      label: 'Fecha de registro',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
    },
    {
      name: 'status_id',
      label: 'Estado del desistimiento',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts_property_withdrawals_states,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'business_trust_id',
      label: 'Negocio fiduciario',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'real_estate_project_id',
      label: 'Proyecto inmobiliario',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trust_real_estate_project,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'project_stage_id',
      label: 'Etapa',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: project_stage,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por id del desistimiento o por inmueble',
      rules: [(val: string) => useRules().max_length(val, 50)],
    },
  ])

  const lastFilterValues = ref<{
    projectId?: string | number
  }>({})
  const filtersUpdate = async (values: Record<string, string | number>) => {
    const projectId = values['filter[real_estate_project_id]']

    if (lastFilterValues.value.projectId === projectId) {
      return
    }
    lastFilterValues.value = { projectId }

    const projectStageFilter = projectId
      ? [
          `project_stage&filter[business_trust_real_estate_project_id]=${projectId}`,
        ]
      : ['project_stage']

    await _getResources({ trust_business: projectStageFilter })
  }

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[date_created]': string
    'filter[status_id]': string
    'filter[business_trust_id]': string
    'filter[real_estate_project_id]': string
    'filter[project_stage_id]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      rows: currentRowsPerPage.value,
      page: 1,
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

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  const handlerGoTo = (goURL: string, idUrl?: number | string) => {
    router.push({
      name: goURL,
      ...(idUrl !== undefined ? { params: { id: idUrl } } : {}),
    })
  }

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const openAlertModal = async (status: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Está seguro que desea ${status} el negocio?`
  }

  const deleteDiscontinuances = async () => {
    alertModalRef.value.closeModal()
    openMainLoader(true)
    await _deleteAction(alertModalConfig.value.entityId as number)
    openMainLoader(false)

    filtersFormat.value = {
      ...filtersFormat.value,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    currentRowsPerPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1 as number,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const allKeys = [keys, keys2, keys3]
  onMounted(async () => {
    await Promise.all(allKeys.map((k) => _getResources(k)))
    const reload = route.query.reload
    if (reload) {
      await listAction()
    }
  })

  onUnmounted(async () => {
    await Promise.all(allKeys.map((k) => _resetKeys(k)))
    handleClearFilters()
    tableProps.value.rows = []
  })

  watch(
    () => discontinuances_list.value,
    () => {
      tableProps.value.rows = discontinuances_list.value
      tableProps.value.pages = discontinuances_pages.value
    },
    { immediate: true, deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
    optionsMenu,
    alertModalRef,

    deleteDiscontinuances,
    openAlertModal,
    handleFilter,
    handlerGoTo,
    updatePage,
    handleClearFilters,
    filtersUpdate,
    updateRowsPerPage,
    validateRouter,
  }
}

export default useDiscontinuancesList
