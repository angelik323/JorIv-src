// vue - pinia - router
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// interfaces
import { QTableColumn } from 'quasar'
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters, ISelectorResources } from '@/interfaces/customs/Filters'
import {
  IVisitRecordsFilters,
  IVisitRecordsItemList,
} from '@/interfaces/customs/fixed-assets/v1/VisitRecords'

// composables
import { useCalendarRules, useMainLoader, useUtils } from '@/composables'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import { useVisitRecordsStore } from '@/stores/fixed-assets/visit-records'

const useVisitRecordsList = () => {
  // imports
  const { formatParamsCustom, defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const router = useRouter()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getVisitRecordsList, _clearData } = useVisitRecordsStore('v1')

  const { business_trust_visit_records, configuration_types_visit_records } =
    storeToRefs(useFixedAssetsResourceStore('v1'))
  const { headerPropsDefault, visit_records_list, visit_records_pages } =
    storeToRefs(useVisitRecordsStore('v1'))

  // data selects
  const trustBusinessKeys = {
    trust_business: ['business_trusts'],
  }
  const fixedAssetsKeys = {
    fixed_assets: [
      'configuration_type',
      'business_trust_visit_records',
      'configuration_types_visit_records',
    ],
  }

  // breadcrumb
  const headerPropsList = {
    title: headerPropsDefault.value.title,
    breadcrumbs: headerPropsDefault.value.breadcrumbs,
  }

  // filters
  const filtersFormat = ref<Record<string, string | number>>({})

  const filteredSubtypes = ref<ISelectorResources[]>([])
  const selectedFilteredTypeId = ref<number | null>(null)

  const handleUpdateFilters = (values: IVisitRecordsFilters) => {
    if (values['filter[configuration_types_id]']) {
      const newTypeId = values['filter[configuration_types_id]']

      if (selectedFilteredTypeId.value === newTypeId) {
        return
      }

      selectedFilteredTypeId.value = newTypeId

      const selectedType = configuration_types_visit_records.value.find(
        (type) => type.value === newTypeId
      )

      filteredSubtypes.value =
        selectedType?.subtypes.map((subtype) => ({
          ...subtype,
          label: `${subtype.code} - ${subtype.description}`,
          value: subtype.id,
        })) || []
    }
  }
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_trust_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trust_visit_records,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'configuration_types_id',
      label: 'Tipo de bien o activo fijo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: configuration_types_visit_records,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'configuration_subtypes_id',
      label: 'Subtipo de bien o activo fijo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: filteredSubtypes,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'start_date',
      label: 'Fecha incial',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      autocomplete: true,
      clean_value: true,
      option_calendar: useCalendarRules().only_until(
        new Date().toISOString().slice(0, 10).replace(/-/g, '/')
      ),
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      autocomplete: true,
      clean_value: true,
      option_calendar: useCalendarRules().only_until(
        new Date().toISOString().slice(0, 10).replace(/-/g, '/')
      ),
    },
  ])
  const handleFilter = async ($filters: IVisitRecordsFilters) => {
    filtersFormat.value = {
      ...$filters,
      rows: filtersFormat.value.rows || 20,
      page: 1,
    }

    const queryString = formatParamsCustom(filtersFormat.value)

    await listAction(queryString ? '&' + queryString : '')
  }
  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  // table
  const rowsPerPage = ref(10)
  const tableProps = ref<IBaseTableProps<IVisitRecordsItemList>>({
    title: 'Listado registro de visitas',
    loading: false,
    columns: [
      {
        name: 'id',
        field: (row) => row.id,
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_trust',
        field: (row) => row.business_trust ?? 'Falta definir',
        required: true,
        label: 'Negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'asset_type',
        field: (row) => row.asset_type ?? 'Falta definir',
        required: true,
        label: 'Tipo activo fijo o bien',
        align: 'left',
        sortable: true,
      },
      {
        name: 'asset_subtype',
        field: (row) => row.asset_subtype ?? 'Falta definir',
        required: true,
        label: 'Subtipo activo fijo o bien',
        align: 'left',
        sortable: true,
      },
      {
        name: 'created_at',
        field: (row) => row.created_at ?? 'Falta definir',
        required: true,
        label: 'Fecha de creación',
        align: 'left',
        sortable: true,
      },
      {
        name: 'created_by_name',
        field: (row) => row.created_by_name ?? 'Falta definir',
        required: true,
        label: 'Responsable',
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
    ] as QTableColumn<IVisitRecordsItemList>[],
    rows: [],
    pages: visit_records_pages.value,
  })

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updateRowsPerPage = (perPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1 as number,
      rows: perPage,
    }
    rowsPerPage.value = perPage
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  // actions
  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    await _getVisitRecordsList(filters)
    tableProps.value.loading = false
  }

  const handleView = (id: string) => {
    router.push({
      name: 'VisitRecordsRead',
      params: { id },
    })
  }
  const handleEdit = (id: string) => {
    router.push({
      name: 'VisitRecordsEdit',
      params: { id },
    })
  }

  // watch
  watch(
    () => visit_records_list.value,
    () => {
      tableProps.value.rows = visit_records_list.value
      tableProps.value.pages.currentPage = visit_records_pages.value.currentPage
      tableProps.value.pages.lastPage = visit_records_pages.value.lastPage
    },
    { deep: true }
  )

  // lifecycle
  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await Promise.all([
      _getResources(fixedAssetsKeys),
      _getResources(trustBusinessKeys, 'filter[effect]=true'),
    ])
    openMainLoader(false)
  })
  onBeforeUnmount(async () => {
    await Promise.all([
      _resetKeys(fixedAssetsKeys),
      _resetKeys(trustBusinessKeys),
    ])
  })
  return {
    tableProps,
    filterConfig,
    headerPropsList,
    defaultIconsLucide,

    handleFilter,
    handleClearFilters,
    handleUpdateFilters,
    handleEdit,
    handleView,

    updatePage,
    updateRowsPerPage,
  }
}
export default useVisitRecordsList
