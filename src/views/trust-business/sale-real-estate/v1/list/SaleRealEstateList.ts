// vue - quasar - router - pinia
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'

// store
import { useSaleRealEstateStore } from '@/stores/trust-business/sale-real-estate'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

// interfaces
import { ISaleRealEstateList } from '@/interfaces/customs/trust-business/SaleRealEstate'

// composables
import { useRouteValidator, useRules } from '@/composables'

const useSaleRealEstateList = () => {
  // imports
  const router = useRouter()
  const route = useRoute()

  const { validateRouter } = useRouteValidator()

  const { _getListAction } = useSaleRealEstateStore('v1')

  const { sale_real_estate_list, sale_real_estate_pages } = storeToRefs(
    useSaleRealEstateStore('v1')
  )

  const {
    business_trust_third_parties,
    business_trust_real_estate_project,
    project_stage,
    business_trust_properties,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    trust_business: ['business_trust_real_estate_project'],
  }
  const keys2 = {
    trust_business: ['third_parties'],
  }
  const keys3 = {
    trust_business: ['project_stage'],
  }

  const currentRowsPerPage = ref<number>(20)

  // props
  const headerProps = {
    title: 'Venta de inmueble',
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
        label: 'Venta de inmueble',
        route: 'SaleRealEstateList',
      },
    ],
  }

  // table
  const tableProps = ref({
    title: 'Listado de ventas de inmueble',
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
        name: 'buyer',
        required: true,
        label: 'Comprador',
        align: 'center',
        field: (row) => row.buyers[0].name,
        sortable: true,
      },
      {
        name: 'project_name',
        required: true,
        label: 'Nombre del proyecto',
        align: 'center',
        field: (row) => row.real_estate_project?.project_name,
        sortable: true,
      },
      {
        name: 'stage',
        required: true,
        label: 'Etapa',
        align: 'center',
        field: (row) => row.real_estate_project_stage?.stage_number,
        sortable: true,
      },
      {
        name: 'house',
        required: true,
        label: 'Apartamento/Casa',
        align: 'center',
        field: (row) => row.real_estate_project_nomenclature?.nomenclature,

        sortable: true,
      },
      {
        name: 'number',
        required: true,
        label: 'Número de encargo',
        align: 'center',
        field: (row) => row.fiduciary_mandate?.fiduciary_mandate_value,
        sortable: true,
      },
      {
        name: 'finance',
        required: true,
        label: 'Obligación financiera',
        align: 'center',
        field: (row) => row.financial_obligation,
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
    rows: [] as ISaleRealEstateList[],
    pages: sale_real_estate_pages.value,
  })

  const filterConfig = ref([
    {
      name: 'third_party_id',
      label: 'Comprador',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trust_third_parties,
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
      name: 'real_estate_project_stage_id',
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
      name: 'real_estate_project_nomenclature_id',
      label: 'Apartamento / Casa',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trust_properties,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
      disable: false,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-8',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por número de encargo u obligación financiera',
      rules: [
        (val: string) => useRules().max_length(val, 50),
        (val: string) => useRules().only_alphanumeric(val),
      ],
    },
  ])

  const lastFilterValues = ref<{
    projectId?: string | number
    stageId?: string | number
  }>({})

  const filtersUpdate = async (values: Record<string, string | number>) => {
    const projectId = values['filter[real_estate_project_id]']
    const stageId = values['filter[real_estate_project_stage_id]']

    if (
      lastFilterValues.value.projectId === projectId &&
      lastFilterValues.value.stageId === stageId
    ) {
      return
    }

    lastFilterValues.value = { projectId, stageId }

    const projectStageFilter = projectId
      ? [
          `project_stage&filter[business_trust_real_estate_project_id]=${projectId}`,
        ]
      : ['project_stage']

    await _getResources({ trust_business: projectStageFilter })

    const propertiesFilter = `business_trust_properties&filter[business_trust_real_estate_project_stage_id]=${stageId}`

    business_trust_properties.value = []
    await _getResources({ trust_business: [propertiesFilter] })
  }

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[third_party_id]': string
    'filter[real_estate_project_id]': string
    'filter[real_estate_project_stage_id]': string
    'filter[real_estate_project_nomenclature_id]': string
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
  })

  watch(
    () => sale_real_estate_list.value,
    () => {
      tableProps.value.rows = sale_real_estate_list.value
      tableProps.value.pages = sale_real_estate_pages.value
    },
    { immediate: true, deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,

    handleFilter,
    handlerGoTo,
    updatePage,
    handleClearFilters,
    filtersUpdate,
    updateRowsPerPage,
    validateRouter,
  }
}

export default useSaleRealEstateList
