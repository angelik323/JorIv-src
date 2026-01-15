// vue - quasar - router - pinia
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'

// store
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { usePolicyStore } from '@/stores/trust-business/policy'

// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

// interfaces
import { IPolicyList } from '@/interfaces/customs/trust-business/Policy'
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

  const { _getListAction, _downloadByRowdData, _deletePolicy } =
    usePolicyStore('v1')

  const { policy_transfers_list, policy_transfers_pages } = storeToRefs(
    usePolicyStore('v1')
  )

  const {
    policy_insurers,
    business_trusts,
    policies_status,
    policies_record_status,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    trust_business: [
      'policy_insurers',
      'business_trusts',
      'policies_status',
      'policies_record_status',
    ],
  }

  const currentRowsPerPage = ref<number>(20)

  // props
  const headerProps = {
    title: 'Pólizas',
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
        label: 'Pólizas',
        route: 'PolicyList',
      },
    ],
  }

  // table
  const tableProps = ref({
    title: 'Listado de pólizas',
    loading: false,
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
        label: 'Nombre del negocio',
        align: 'left',
        field: (row) => row.business_trust?.name,
        sortable: true,
      },
      {
        name: 'policy_number',
        required: true,
        label: 'N° de póliza',
        align: 'left',
        field: (row) => row.policy_number,
        sortable: true,
      },
      {
        name: 'insurer',
        required: true,
        label: 'Aseguradora',
        align: 'left',
        field: (row) => row.insurer?.name,
        sortable: true,
      },
      {
        name: 'insured_value',
        required: true,
        label: 'Valor asegurado',
        align: 'left',
        field: (row) => row.insured_value,
        sortable: true,
      },
      {
        name: 'record_status_id',
        required: true,
        label: 'Estado del registro',
        align: 'left',
        field: (row) => row.record_status?.id,
        sortable: true,
      },
      {
        name: 'policy_status_id',
        required: true,
        label: 'Estado de la póliza',
        align: 'left',
        field: (row) => row.policy_status?.id,
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
    rows: [] as IPolicyList[],
    pages: policy_transfers_pages.value,
  })

  const filterConfig = ref([
    {
      name: 'business_id',
      label: 'Negocio fiduciario',
      type: 'q-select',
      value: route.query.trust_business
        ? Number(route.query.trust_business)
        : null,
      class: 'col-12 col-md-3',
      options: business_trusts,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'insurer_id',
      label: 'Aseguradora',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: policy_insurers,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'record_status_id',
      label: 'Estado del registro',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: policies_record_status,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'policy_status_id',
      label: 'Estado de la póliza',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: policies_status,
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
      class: 'col-12',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por número de póliza o por ID',
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

  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const downloadByRowExcel = async (id: number) => {
    await _downloadByRowdData(`ids[]=${id}`)
  }

  const downloadExcel = async () => {
    if (!tableProps.value.rows.length) return
    openMainLoader(true)
    const ids = tableProps.value.rows.map((item) => item.id)
    await _downloadByRowdData(`ids[]=${ids.join('&ids[]=')}`)
    openMainLoader(false)
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
    await _deletePolicy(alertModalConfig.value.entityId as number)
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

  onMounted(async () => {
    await _getResources(keys)

    const trustBusinessQuery = route.query.trust_business
    if (trustBusinessQuery) {
      filtersFormat.value = {
        ...filtersFormat.value,
        'filter[business_id]': trustBusinessQuery as string,
      }
      const queryString = formatParamsCustom(filtersFormat.value)
      await listAction(queryString ? '&' + queryString : '')
    }

    const reload = route.query.reload
    if (reload) {
      await listAction()
    }
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => policy_transfers_list.value,
    () => {
      tableProps.value.rows = policy_transfers_list.value
      tableProps.value.pages = policy_transfers_pages.value
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

    downloadExcel,
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
