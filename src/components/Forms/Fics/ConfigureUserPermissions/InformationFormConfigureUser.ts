// Vue - Quasar
import type { QTable } from 'quasar'
import { ref } from 'vue'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import type { IRegionalResource } from '@/interfaces/customs/resources/Fics.ts'
import type { IOfficeItem } from '@/interfaces/customs/fics/ConfigureUserPermissions'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useConfigureUserPermissionsFicsStore } from '@/stores/fics/configure-user-permissions-fics-and-operations'

export const useOfficesForm = (regions: IRegionalResource[] = []) => {
  const { formatParamsCustom } = useUtils()

  const configureUserPermissionsFicsStore =
    useConfigureUserPermissionsFicsStore('v1')

  const offices = ref<IOfficeItem[]>([])
  const selectedOffices = ref<IOfficeItem[]>([])

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'regional_id',
      label: 'Región',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-6',
      disable: false,
      options: regions,
      placeholder: 'Seleccione',
      isForceValue: false,
    },
    {
      name: 'search',
      label: 'Oficina',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      prepend_icon: 'mdi-magnify',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código o nombre de la oficina',
    },
  ])

  const tableOfficesList = ref({
    loading: false,
    columns: [
      { name: 'id', field: 'id', label: '#', align: 'left', sortable: true },
      {
        name: 'region',
        field: (row) => row.region || '',
        label: 'Región',
        align: 'left',
        sortable: true,
      },
      {
        name: 'office_code',
        field: (row) => row.office_code || '',
        label: 'Código de oficina',
        align: 'left',
        sortable: true,
      },
      {
        name: 'office_description',
        field: (row) => row.office_description || '',
        label: 'Oficina',
        align: 'left',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IOfficeItem[],
    pages: {
      currentPage: 1,
      lastPage: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    },
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = (filters: {
    'filter[regional_id]'?: string | number
    'filter[search]'?: string
  }) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      ...filters,
      page: tableOfficesList.value.pages.currentPage,
      rows: tableOfficesList.value.pages.rowsPerPage,
      sort: 'id',
      order: 'desc',
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    listOffices(queryString ? '&' + queryString : '')
  }

  const listOffices = async (filters: string = '') => {
    tableOfficesList.value.loading = true
    try {
      await configureUserPermissionsFicsStore._listOffices(filters)

      const officesList = configureUserPermissionsFicsStore.offices_list
      const pages = configureUserPermissionsFicsStore.offices_list_pages

      tableOfficesList.value.rows = officesList
      tableOfficesList.value.pages = {
        currentPage: pages.currentPage,
        lastPage: pages.lastPage,
        rowsPerPage: tableOfficesList.value.pages.rowsPerPage,
        rowsNumber: pages.rowsNumber ?? 0,
      }
    } finally {
      tableOfficesList.value.loading = false
    }
  }

  const updatePage = async (page: number) => {
    tableOfficesList.value.pages.currentPage = page
    const queryString = formatParamsCustom({
      ...filtersFormat.value,
      page,
      rows: tableOfficesList.value.pages.rowsPerPage,
    })
    await listOffices(queryString ? '&' + queryString : '')
  }

  const updatePerPage = async (rowsPerPage: number) => {
    tableOfficesList.value.pages.rowsPerPage = rowsPerPage
    tableOfficesList.value.pages.currentPage = 1
    const queryString = formatParamsCustom({
      ...filtersFormat.value,
      page: 1,
      rows: rowsPerPage,
    })
    await listOffices(queryString ? '&' + queryString : '')
  }

  return {
    filterConfig,
    offices,
    selectedOffices,
    tableOfficesList,
    handleFilter,
    updatePage,
    updatePerPage,
  }
}
