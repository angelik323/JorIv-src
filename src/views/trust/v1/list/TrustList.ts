import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs'
import { QTable } from 'quasar'

// Utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import moment from 'moment'

// Store
import { useFiltersStore, useResourceStore, useTrustStore } from '@/stores'

export const useTrustView = () => {
  const { setFiltersState } = useFiltersStore()
  const { status } = storeToRefs(useResourceStore('v1'))
  const { trust_list, trust_pages } = storeToRefs(useTrustStore('v1'))
  const { _getListAction } = useTrustStore('v1')

  const headerProps = {
    title: 'Consulta terceros fideicomiso',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Consulta de terceros fideicomisos',
        to: { name: 'TrustList' },
      },
    ],
  }

  const optionsCalendar = (date: string) =>
    date <= moment().format('YYYY/MM/DD')

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 col-lg-3',
      options: status.value,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 col-lg-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por nombre / razón social o fideicomiso',
    },
    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: '',
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      clean_value: true,
      option_calendar: optionsCalendar,
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: '',
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      clean_value: true,
      option_calendar: optionsCalendar,
    },
  ])

  const tableProps = ref({
    title: 'Listado de terceros fideicomiso',
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
        name: 'code',
        required: false,
        label: 'Código',
        align: 'left',
        field: '',
        // field: (row: ISupplies) => `${row.code ?? '--'}`,
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre',
        align: 'left',
        field: '',
        sortable: true,
        style: {
          'max-width': '140px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'created_at',
        required: false,
        label: 'Fecha de asociación',
        align: 'left',
        field: '',
        sortable: true,
      },
      {
        name: 'mechanical_inspection_date',
        required: false,
        label: 'Unidad de medida',
        align: 'left',
        field: '',
        sortable: true,
      },
      {
        name: 'quantity',
        required: false,
        label: 'Cantidad',
        align: 'left',
        field: '',
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado',
        align: 'left',
        field: '',
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
    rows: [] /* as ISupplies[] */,
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const handleFilter = ($filters: {
    'filter[insurance]': string
    'filter[armor_level]': string
    'filter[status_id]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = $filters
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  onMounted(async () => {
    setFiltersState(filterConfig.value)
  })

  return {
    headerProps,
    filterConfig,
    tableProps,
    trust_list,
    trust_pages,

    // Methods
    handleFilter,
  }
}

export default useTrustView
