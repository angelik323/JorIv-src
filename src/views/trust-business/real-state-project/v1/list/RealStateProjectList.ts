// vue - quasar - router - pinia
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'

// store
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useRealStateProjectStore } from '@/stores/trust-business/real-state-project'

// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

// interfaces
import { IRealStateProject } from '@/interfaces/customs'
import { TrustBusinessStatusID } from '@/interfaces/global'

// composables
import { useMainLoader, useRules, useRouteValidator } from '@/composables'

const useRealStateProjectList = () => {
  // router
  const router = useRouter()
  const route = useRoute()

  // imports
  const { validateRouter } = useRouteValidator()

  const { openMainLoader } = useMainLoader()

  const { _getListAction, _downloadByRowdData, _deleteRealStateProject } =
    useRealStateProjectStore('v1')

  const {
    real_state_project_transfers_list,
    real_state_project_transfers_pages,
  } = storeToRefs(useRealStateProjectStore('v1'))

  const { project_type, project_status } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    trust_business: ['project_type', 'project_status'],
  }

  const currentRowsPerPage = ref<number>(20)

  // props
  const headerProps = {
    title: 'Proyectos inmobiliarios',
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
        label: 'Proyecto inmobiliario',
        route: 'RealStateProjectList',
      },
    ],
  }

  // table
  const tableProps = ref({
    title: 'Listado de proyectos inmobiliarios',
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
        name: 'business_id',
        required: true,
        label: 'Negocio fiduciario',
        align: 'center',
        field: (row) => row.business_trust?.name,
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
        name: 'project_type',
        required: true,
        label: 'Tipo de proyecto',
        align: 'center',
        field: 'project_type',
        sortable: true,
      },
      {
        name: 'num_stages',
        required: true,
        label: 'N° de etapas',
        align: 'center',
        field: 'num_stages',
        sortable: true,
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado del proyecto',
        align: 'left',
        field: 'status_id',
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
    rows: [] as IRealStateProject[],
    pages: real_state_project_transfers_pages.value,
  })

  const filterConfig = ref([
    {
      name: 'status_id',
      label: 'Estado del proyecto',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: project_status,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'project_type',
      label: 'Tipo de proyecto',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: project_type,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: route.query.trust_business ?? null,
      class: 'col-12 col-md-6',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por negocio o nombre del proyecto',
      rules: [
        (val: string) => useRules().max_length(val, 50),
        (val: string) => useRules().only_alphanumeric(val),
      ],
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[status_id]': string
    'filter[project_type]': string
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

  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const downloadByRowExcel = async (id: number) => {
    await _downloadByRowdData(id)
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

  const deleteRealStateProject = async () => {
    alertModalRef.value.closeModal()
    openMainLoader(true)
    await _deleteRealStateProject(alertModalConfig.value.entityId as number)
    openMainLoader(false)

    filtersFormat.value = {
      ...filtersFormat.value,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  onMounted(async () => {
    openMainLoader(true)

    await _getResources(keys)

    const trustBusinessQuery = route.query.trust_business
    if (trustBusinessQuery) {
      filtersFormat.value = {
        ...filtersFormat.value,
        'filter[search]': trustBusinessQuery as string,
      }
      const queryString = formatParamsCustom(filtersFormat.value)

      await listAction(queryString ? '&' + queryString : '')
    }

    const reload = route.query.reload
    if (reload) {
      await listAction()
    }

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => real_state_project_transfers_list.value,
    () => {
      tableProps.value.rows = real_state_project_transfers_list.value
      tableProps.value.pages = real_state_project_transfers_pages.value
    },
    { immediate: true, deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
    alertModalRef,
    TrustBusinessStatusID,

    handleFilter,
    handlerGoTo,
    updatePage,
    handleClearFilters,
    downloadByRowExcel,
    deleteRealStateProject,
    openAlertModal,
    validateRouter,
    updateRowsPerPage,
  }
}

export default useRealStateProjectList
