// Vue - Pinie - Router - Quasar
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces - Constants
import { IFreezeResources } from '@/interfaces/customs/fics/FreezeResources'
import { typeFormFreezeOptions, typeFreezeOptions } from '@/constants'
import { IFieldFilters } from '@/interfaces/customs/Filters'

// Composables
import {
  useUtils,
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
} from '@/composables'

// Stores
import { useFreezeResourcesStore } from '@/stores/fics/freeze-resources'

export const useFreezeResourcesList = () => {
  const { defaultIconsLucide, formatDate, formatCurrency } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _getListFreeze } = useFreezeResourcesStore('v1')

  const { freeze_resources_list, freeze_resources_pages } = storeToRefs(
    useFreezeResourcesStore('v1')
  )

  const filtersFormat = ref<Record<string, string | number>>({})
  const isTableEmpty = ref(true)
  const showState = ref(0)

  let perPage = 20

  const headerProps = {
    title: 'Congelamiento y descongelamiento de recursos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Congelamiento y descongelamiento de recursos',
        route: 'FreezeResourcesList',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircleOutline,
      options: [
        {
          label: 'Descongelamiento',
          icon: defaultIconsLucide.flame,
          routeName: 'UnFreezeResourcesCreate',
        },
        {
          label: 'Congelamiento',
          icon: defaultIconsLucide.snowflake,
          routeName: 'FreezeResourcesCreate',
        },
      ],
      color: 'primary',
      textColor: 'white',
      size: 'md',
      class: 'btn-header',
      outline: false,
      disable: false,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'operation_date',
      label: 'Fecha de registro',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 col-lg-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
    },
    {
      name: 'operation_type',
      label: 'Tipo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 col-lg-3',
      options: typeFreezeOptions,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'freeze_type',
      label: 'Forma',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 col-lg-3',
      options: typeFormFreezeOptions,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 q-py-md',
      disable: false,
      prepend_icon: useUtils().defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o nombre',
    },
  ])

  const tableProps = ref({
    title: 'Listado de recursos',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'operation_date',
        label: 'Fecha',
        field: (row) => formatDate(row.operation_date, 'YYYY-MM-DD') || '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'investment_plan',
        label: 'Plan de inversión',
        field: (row) => row.plan?.plan_code ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'titular_identification',
        label: 'Identificación titular',
        field: (row) => row.holder_plan?.document,
        align: 'left',
        sortable: true,
      },
      {
        name: 'titular_name',
        label: 'Nombre titular',
        field: (row) => row.holder_plan?.name,
        align: 'left',
        sortable: true,
      },
      {
        name: 'investment_plan_balance',
        label: 'Saldo plan de inversión',
        field: (row) => formatCurrency(row.plan.plan_balance ?? 0),
        align: 'left',
        sortable: true,
      },
      {
        name: 'operation_type',
        label: 'Tipo',
        field: 'operation_type',
        align: 'left',
        sortable: true,
      },
      {
        name: 'freeze_type',
        label: 'Forma',
        field: 'freeze_type',
        align: 'left',
        sortable: true,
      },
      {
        name: 'freeze_value',
        label: 'Valor',
        field: (row) => {
          if (row.operation_type === 'Congelamiento') {
            return formatCurrency(row.freeze_value) || 0
          } else {
            return formatCurrency(row.unfreeze_value) || 0
          }
        },
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'center',
      },
    ] as QTable['columns'],
    rows: [] as IFreezeResources[],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const handleFilter = async (filters: Record<string, string | number>) =>
    await listAction({ ...filters, page: 1 })

  const handleClear = () => {
    showState.value = 0
    isTableEmpty.value = true
    tableProps.value.rows = []
  }

  const listAction = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProps.value.rows = []

    await _getListFreeze(filters)

    const hasResults = freeze_resources_list.value.length > 0

    isTableEmpty.value = !hasResults
    showState.value = filters ? 1 : 0

    setTimeout(() => openMainLoader(false), 1000)
  }

  const updatePage = async (page: number) =>
    await listAction({ ...filtersFormat.value, page: page, rows: perPage })

  const updatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    await listAction({ ...filtersFormat.value, rows: perPage })
  }

  onMounted(async () => {
    if (route.query.reload === 'true') await listAction({})
  })

  watch(
    freeze_resources_list,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } = freeze_resources_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    goToURL,
    showState,
    tableProps,
    updatePage,
    handleClear,
    headerProps,
    filterConfig,
    isTableEmpty,
    handleFilter,
    updatePerPage,
    validateRouter,
    defaultIconsLucide,
  }
}
