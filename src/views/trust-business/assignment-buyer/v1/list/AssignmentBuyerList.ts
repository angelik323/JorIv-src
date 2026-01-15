// vue - quasar - router - pinia
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'

// store
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useAssignmentBuyerStore } from '@/stores/trust-business/assignment-buyer'
import { useResourceManagerStore } from '@/stores/resources-manager'

// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

// interfaces
import { IAssignmentBuyerList } from '@/interfaces/customs/trust-business/AssignmentBuyer'

// composables
import { useMainLoader, useRules, useRouteValidator } from '@/composables'

const useAssignmentBuyer = () => {
  // imports
  const router = useRouter()
  const route = useRoute()

  const { openMainLoader } = useMainLoader()

  const { _getListAction, _deleteAction, _setDataAuthorize } =
    useAssignmentBuyerStore('v1')

  const { assignment_buyer_list, assignment_buyer_pages } = storeToRefs(
    useAssignmentBuyerStore('v1')
  )

  const {
    business_trusts,
    property_transfer_statuses,
    business_trust_real_estate_project,
    project_stage,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    trust_business: ['property_transfer_statuses', 'project_stage'],
  }

  const keys2 = {
    trust_business: ['business_trusts&filter[can_project]=true'],
  }

  const currentRowsPerPage = ref<number>(20)

  const keys3 = {
    trust_business: ['business_trust_real_estate_project'],
  }

  // props
  const headerProps = {
    title: 'Cesión de comprador',
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
        label: 'Cesión de comprador',
        route: 'AssignmentBuyerList',
      },
    ],
  }

  // table
  const tableProps = ref({
    title: 'Listado de cesión de comprador',
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
        name: 'business_trust',
        required: true,
        label: 'Nombre del negocio',
        align: 'center',
        field: (row) =>
          row.business_trust_property?.business_trust_real_estate_project_stages
            ?.business_trust_real_estate_project?.business_trust?.name,
        sortable: true,
      },
      {
        name: 'project_name',
        required: true,
        label: 'Nombre del proyecto',
        align: 'center',
        field: (row) =>
          row.business_trust_property?.business_trust_real_estate_project_stages
            ?.business_trust_real_estate_project.project_name,
        sortable: true,
      },
      {
        name: 'stage',
        required: true,
        label: 'Etapa',
        align: 'center',
        field: (row) =>
          row.business_trust_property?.business_trust_real_estate_project_stages
            ?.stage_number,
        sortable: true,
      },
      {
        name: 'house',
        required: true,
        label: 'Apartamento/Casa',
        align: 'center',
        field: (row) => row.business_trust_property?.nomenclature,

        sortable: true,
      },
      {
        name: 'date',
        required: true,
        label: 'Fecha de registro',
        align: 'center',
        field: (row) => row.created_at,
        sortable: true,
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado de cesión de comprador',
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
    rows: [] as IAssignmentBuyerList[],
    pages: assignment_buyer_pages.value,
  })

  // filters
  const filterConfig = ref([
    {
      name: 'created_at',
      label: 'Fecha de registro',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
    },
    {
      name: 'status_id',
      label: 'Estado de cesión de comprador',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: property_transfer_statuses,
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
      name: 'project_id',
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
      placeholder: 'Buscar por apartamento o casa',
      rules: [(val: string) => useRules().max_length(val, 50)],
    },
  ])

  const lastFilterValues = ref<{
    projectId?: string | number
  }>({})
  const filtersUpdate = async (values: Record<string, string | number>) => {
    const projectId = values['filter[project_id]']

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
    'filter[created_at]': string
    'filter[status_id]': string
    'filter[business_trust_id]': string
    'filter[project_id]': string
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

  const updateRowsPerPage = async (rowsPerPage: number) => {
    currentRowsPerPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
      page: 1,
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

  const deleteAssignmentBuyer = async () => {
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

  const allKeys = [keys, keys2, keys3]
  onMounted(async () => {
    await Promise.all(allKeys.map((k) => _getResources(k)))

    const reload = route.query.reload
    if (reload) {
      await listAction()
    }
    _setDataAuthorize('')
  })

  onBeforeUnmount(async () => {
    await Promise.all(allKeys.map((k) => _resetKeys(k)))
  })

  watch(
    () => assignment_buyer_list.value,
    () => {
      tableProps.value.rows = assignment_buyer_list.value
      tableProps.value.pages = assignment_buyer_pages.value
    },
    { immediate: true, deep: true }
  )

  const { validateRouter } = useRouteValidator()

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
    alertModalRef,

    filtersUpdate,
    openAlertModal,
    deleteAssignmentBuyer,
    handleFilter,
    handlerGoTo,
    updatePage,
    updateRowsPerPage,
    handleClearFilters,
    validateRouter,
  }
}

export default useAssignmentBuyer
