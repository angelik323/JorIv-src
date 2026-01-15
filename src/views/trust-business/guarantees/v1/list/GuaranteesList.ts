// Vue - pinia - quasar
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { useRoute } from 'vue-router'

// Interfaces
import { IGuaranteesList } from '@/interfaces/customs'

// Stores
import { useGuaranteesStore } from '@/stores/trust-business/guarantees'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useResourcesManagerV1 } from '@/stores/resources-manager/resources-manager-v1'

// Utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

// Composables
import { useMainLoader, useRouteValidator } from '@/composables'

const useGuaranteesList = () => {
  // router
  const route = useRoute()

  const { _getGuaranteesList, _clearData, _downloadExcel, _deleteAction } =
    useGuaranteesStore('v1')
  const { guarantees_list, guarantees_pages } = storeToRefs(
    useGuaranteesStore('v1')
  )

  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const { _getResources, _resetKeys } = useResourcesManagerV1()
  const { guarantees_types, guarantees_status, guarantees_record_status } =
    storeToRefs(useTrustBusinessResourceStore('v1'))

  const keys = {
    trust_business: [
      'guarantees_types',
      'guarantees_status',
      'guarantees_record_status',
    ],
  }

  const currentRowsPerPage = ref<number>(20)

  const filterConfig = ref([
    {
      name: 'guarantee_type',
      label: 'Tipo de garantía',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: guarantees_types,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'guarantee_status_id',
      label: 'Estado de la garantía',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: guarantees_status,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'registration_status_id',
      label: 'Estado del registro',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: guarantees_record_status,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'registration_date',
      label: 'Fecha de registro',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'YYYY-MM-DD',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: route.query.trust_business ?? null,
      class: 'col-12',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por negocio fiduciario o ID de garantía',
    },
  ])

  const headerProps = {
    title: 'Garantías',
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
        label: 'Garantías',
        route: 'GuaranteesList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de garantías',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'name',
        field: (row) => row.business_trust?.name,
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'registration_date',
        field: 'registration_date',
        required: true,
        label: 'Fecha de registro',
        align: 'left',
        sortable: true,
      },
      {
        name: 'guarantee_type',
        field: 'guarantee_type',
        required: true,
        label: 'Tipo de garantía',
        align: 'left',
        sortable: true,
      },
      {
        name: 'registration_status',
        field: (row) => row.registration_status?.id,
        required: true,
        label: 'Estado del registro',
        align: 'left',
        sortable: true,
      },
      {
        name: 'guarantee_status',
        field: (row) => row.guarantee_status?.id,
        required: true,
        label: 'Estado de la garantía',
        align: 'left',
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
    rows: [] as IGuaranteesList[],
    pages: guarantees_pages.value,
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getGuaranteesList(filters)
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

  const handleFilter = async ($filters: {
    'filter[guarantee_type]': string
    'filter[registration_status_id]': string
    'filter[registration_date]': string
    'filter[guarantee_status_id]': string
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

  const downloadByRowExcel = async (id: number) => {
    await _downloadExcel(`ids[]=${id}`)
  }

  const uploadFileExcel = async () => {
    if (!tableProps.value.rows.length) return
    const ids = tableProps.value.rows.map((item) => item.id)
    await _downloadExcel(`ids[]=${ids.join('&ids[]=')}`)
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
    await _deleteAction(alertModalConfig.value.entityId as number)
    openMainLoader(false)

    filtersFormat.value = {
      ...filtersFormat.value,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
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
        'filter[search]': trustBusinessQuery as string,
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
    _clearData()
  })

  watch(
    () => guarantees_list.value,
    () => {
      tableProps.value.rows = guarantees_list.value
      tableProps.value.pages = guarantees_pages.value
    },
    { immediate: true, deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    alertModalRef,

    uploadFileExcel,
    handleFilter,
    updatePage,
    downloadByRowExcel,
    deleteRealStateProject,
    openAlertModal,
    handleClearFilters,
    validateRouter,
    updateRowsPerPage,
  }
}

export default useGuaranteesList
