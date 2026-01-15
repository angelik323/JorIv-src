/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { formatParamsCustom } from '@/utils'
import type { QTable } from 'quasar'
import {
  useOpeningRecordStore,
  useFiltersStore,
  useResourceStore,
} from '@/stores'
import { IOpeningRecord } from '@/interfaces/customs'
import { IFilters } from '@/interfaces/global'
import { useRouteValidator } from '@/composables'

const useOpeningRecordList = () => {
  const router = useRouter()
  const { validateRouter } = useRouteValidator()
  const { setFiltersState } = useFiltersStore()
  const { _getAccountingResources } = useResourceStore('v1')

  const {
    _getListOpeningRecord,
    _toggleOpeningRecordStatus,
    _selectOpeningRecord,
  } = useOpeningRecordStore('v1')
  const { opening_record_list, opening_record_pages, selected_opening_record } =
    storeToRefs(useOpeningRecordStore('v1'))
  const { opening_record_structures } = storeToRefs(useResourceStore('v1'))

  const perPage = ref(20)

  const keys = ['account_structures_with_purpose']

  const headerProps = {
    title: 'Apertura de período contable',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Registro de apertura de período', route: 'OpeningRecordList' },
    ],
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IOpeningRecord[]
    pages: typeof opening_record_pages
  }>({
    title: 'Listado de apertura de período',
    loading: false,
    columns: [
      { name: 'id', label: '#', align: 'left', field: 'id', sortable: true },

      {
        name: 'name',
        label: 'Periodo actual',
        align: 'left',
        field: (row) => row.current_period,
        sortable: true,
      },
      {
        name: 'accounting_structure',
        label: 'Estructura contable',
        align: 'left',
        field: (row) => row.accounting_structure,
        sortable: true,
      },
      {
        name: 'business_trust',
        label: 'Negocio',
        align: 'left',
        field: (row) => row.business_trust,
        sortable: true,
      },
    ],
    rows: [],
    pages: opening_record_pages,
  })

  const filtersFormat = ref<Record<string, string | number | null>>({})

  const filterConfig = ref([
    {
      name: 'accounting_structure_id',
      label: 'Estructura contable*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: opening_record_structures,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (val: string) => val !== null || 'La estructura contable es requerida',
      ],
    },
    {
      name: 'period',
      label: 'Periodo actual',
      type: 'q-date',
      value: null,
      mask: 'YYYY-MM',
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      prepend_icon: 'mdi-magnify',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por nombre o descripción...',
    },
  ])

  const listAction = async (params = '') => {
    tableProps.value.loading = true
    await _getListOpeningRecord(params)
    tableProps.value.loading = false
  }

  const handleFilter = (filters: IFilters) => {
    filtersFormat.value = { ...filters }
    filtersFormat.value.rows = perPage.value
    const q = formatParamsCustom(filtersFormat.value)
    listAction(q ? '&' + q : '&paginate=1')
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    filtersFormat.value.rows = perPage.value
    const q = formatParamsCustom(filtersFormat.value)
    listAction(q ? '&' + q : '')
  }

  const updateRowsPerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage.value,
    }
    const q = formatParamsCustom(filtersFormat.value)
    listAction(q ? '&' + q : '')
  }
  const handleClear = () => {
    tableProps.value.rows = []
  }

  const handleGoTo = (routeName: string) => {
    router.push({ name: routeName })
  }

  const costCenterStatus = computed(() => {
    const id =
       
      (selected_opening_record.value?.status as any)?.id ??
      selected_opening_record.value?.status_id
    return id === 1 ? 'inactivar' : 'activar'
  })

  onMounted(async () => {
    await _getAccountingResources(`keys[]=${keys.join('&keys[]=')}`)
    setFiltersState(filterConfig.value)
  })

  watch(
    () => opening_record_list.value,
    () => {
      tableProps.value.rows = opening_record_list.value
    }
  )

  // watch(opening_record_pages, () => {
  //   tableProps.value.pages = {
  //     currentPage: opening_record_pages.value.currentPage,
  //     lastPage: opening_record_pages.value.lastPage,
  //   }
  // })

  return {
    headerProps,
    tableProps,
    selected_opening_record,
    opening_record_structures,
    costCenterStatus,
    filterFields: filterConfig,
    handleFilter,
    handleClear,
    handleGoTo,
    updatePage,
    updateRowsPerPage,
    _selectOpeningRecord,
    _toggleOpeningRecordStatus,
    validateRouter,
  }
}

export default useOpeningRecordList
