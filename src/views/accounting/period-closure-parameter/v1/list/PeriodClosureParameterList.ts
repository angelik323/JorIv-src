import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { QTable } from 'quasar'
import {
  IAccountingClosingParameterItem,
  IFieldFilters,
} from '@/interfaces/customs'

import { defaultIconsLucide, formatParamsCustom } from '@/utils'

import { usePeriodClosureParametersStore } from '@/stores/accounting/period-closure-parameters'
import { useRouteValidator } from '@/composables'

const usePeriodClosureParameterList = () => {
  const { _getPeriodClosureParameterList, _cleanPeriodClosureParametersData } =
    usePeriodClosureParametersStore('v1')
  const { period_closure_parameter_list, period_closure_parameter_pages } =
    storeToRefs(usePeriodClosureParametersStore('v1'))
  const router = useRouter()
  const { validateRouter } = useRouteValidator()

  let perPage = 20

  const tableProps = ref({
    title: 'Listado de parámetros',
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
        name: 'structure',
        required: true,
        label: 'Estructura',
        align: 'left',
        field: (row: IAccountingClosingParameterItem) => `${row.structure}`,
        sortable: true,
      },
      {
        name: 'purpose',
        required: true,
        label: 'Finalidad',
        align: 'left',
        field: (row: IAccountingClosingParameterItem) => `${row.purpose}`,
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
    rows: [] as IAccountingClosingParameterItem[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const headerProps = {
    title: 'Parámetros cierre de período',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Parámetros cierre de período',
        route: 'PeriodClosureParameterList',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código de estructura y/o finalidad',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getPeriodClosureParameterList(filters)
    tableProps.value.loading = false
  }

  const handleGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  onMounted(async () => {
    _cleanPeriodClosureParametersData()
    tableProps.value.rows = period_closure_parameter_list.value
  })

  watch(
    () => period_closure_parameter_list.value,
    () => {
      tableProps.value.rows = period_closure_parameter_list.value
    }
  )

  watch(
    () => period_closure_parameter_pages.value,
    () => {
      tableProps.value.pages = period_closure_parameter_pages.value
    }
  )

  return {
    // Props
    headerProps,
    tableProps,
    filterConfig,
    // Methods
    handleFilter,
    handleGoTo,
    updatePage,
    updatePerPage,
    _cleanPeriodClosureParametersData,
    validateRouter,
  }
}

export default usePeriodClosureParameterList
