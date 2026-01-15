import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import router from '@/router'

import { useMainLoader, useUtils } from '@/composables'
import { formatParamsCustom } from '@/utils'

import { IFieldFilters, IRiskRatingAgencies } from '@/interfaces/customs'
import { risk_rating_agencies } from '@/constants'

import { useRiskRatingAgenciesStore } from '@/stores'

const useRiskRatingAgenciesList = () => {
  const { defaultIconsLucide, capitalize } = useUtils()
  const { openMainLoader } = useMainLoader()
  const route = useRoute()

  const { risk_rating_agencies_list, risk_rating_agencies_pages } = storeToRefs(
    useRiskRatingAgenciesStore('v1')
  )
  const { _listAction } = useRiskRatingAgenciesStore('v1')

  const filtersFormat = ref<Record<string, string | number>>({})
  const isRiskRatingAgencieEmpty = ref(true)
  const showState = ref(0)

  let perPage = 20

  const headerProperties = {
    title: 'Calificadoras de riesgo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      {
        label: 'Calificadoras de riesgo',
        route: 'RiskRatingAgenciesList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'guy',
      label: 'Tipo',
      type: 'q-select',
      value: '',
      class: 'col-12 col-md-6',
      options: risk_rating_agencies['options'],
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      prepend_icon: defaultIconsLucide.magnify,
      placeholder: 'Buscar por código o coincidencia',
    },
  ])

  const tableProperties = ref({
    title: 'Listado de calificadoras de riesgo',
    loading: false,
    columns: [
      {
        name: 'id',
        align: 'left',
        label: '#',
        field: 'id',
        sortable: true,
        required: true,
      },
      {
        name: 'code',
        align: 'left',
        label: 'Código',
        field: 'code',
        sortable: true,
        required: true,
      },
      {
        name: 'description',
        align: 'left',
        label: 'Descripción',
        field: 'description',
        sortable: true,
        required: true,
      },
      {
        name: 'guy',
        align: 'left',
        label: 'Tipo',
        field: (row) => capitalize(row.guy),
        sortable: true,
        required: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [] as IRiskRatingAgencies[],
    pages: risk_rating_agencies_pages,
  })

  const loadData = async (filters: string = 'paginate=1') => {
    openMainLoader(true)

    await _listAction(filters)

    const hasResults = risk_rating_agencies_list.value.length > 0

    showState.value = filters ? 1 : 0
    isRiskRatingAgencieEmpty.value = !hasResults

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleFilter = ($filters: {
    'filter[guy]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      paginate: 1,
    }
    loadData(formatParamsCustom(filtersFormat.value))
  }

  const handleOptions = (option: string, id: number) => {
    if (option === 'edit') handleGoTo('RiskRatingAgenciesEdit', id)
    else if (option === 'view') handleGoTo('RiskRatingAgenciesView', id)
  }

  const handleClearFilters = () => {
    showState.value = 0
    filtersFormat.value = {}
    tableProperties.value.rows = []
    isRiskRatingAgencieEmpty.value = true
  }

  const handleUpdatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page,
    }
    loadData(formatParamsCustom(filtersFormat.value))
  }

  const handleUpdatePerPage = (limitsPerPage: number) => {
    perPage = limitsPerPage
    filtersFormat.value = {
      limit: perPage,
      paginate: 1,
    }
    loadData(formatParamsCustom(filtersFormat.value))
  }

  const handleGoTo = (route: string, id?: number) =>
    router.push({ name: route, params: { id } })

  watch(
    () => risk_rating_agencies_list.value,
    () => {
      tableProperties.value.rows = risk_rating_agencies_list.value
      tableProperties.value.pages = risk_rating_agencies_pages.value
    }
  )

  onMounted(async () => {
    if (route.query.reload === 'true') loadData()
  })

  return {
    showState,
    handleGoTo,
    handleFilter,
    filterConfig,
    handleOptions,
    tableProperties,
    headerProperties,
    handleUpdatePage,
    handleClearFilters,
    defaultIconsLucide,
    handleUpdatePerPage,
    isRiskRatingAgencieEmpty,
  }
}

export default useRiskRatingAgenciesList
