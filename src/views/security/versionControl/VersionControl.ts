// Vue tools
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
// Utils
import { formatParamsCustom } from '@/utils'
// Stores
import { useSecurityStore } from '@/stores'
// Composables
import { useMainLoader } from '@/composables'
// Assets
import { QTable } from 'quasar'
import moment from 'moment'

export const useVersionControlView = () => {
  // Tools and utils:
  const { openMainLoader } = useMainLoader()

  // Stores
  const { versionControlList, pages } = storeToRefs(useSecurityStore('v1'))
  const { _getVersionControlList, _exportXlsxVersionControlList } =
    useSecurityStore('v1')

  // Variables
  const filtersFormat = ref<Record<string, string | number>>({})
  const headerProperties = {
    title: 'Control de versión de módulos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Seguridad',
      },
      {
        label: 'Control de versión de módulos',
      },
    ],
  }

  const tableProperties = ref({
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
        name: 'module',
        required: false,
        label: 'Módulo',
        align: 'left',
        field: 'description',
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'version',
        required: false,
        label: 'Versión',
        align: 'left',
        field: 'version',
        sortable: true,
      },
      {
        name: 'date',
        required: false,
        label: 'Fecha actualización',
        align: 'left',
        field: (row) => moment(row.created_at).format('DD/MM/YYYY'),
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'status_name',
        required: false,
        label: 'Estado',
        align: 'left',
        field: (row) => row.status.status,
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
    ] as QTable['columns'],
    rows: [],
    pages: pages,
  })

  const disableXlsxBtn = computed(() => versionControlList?.value?.length === 0)

  const clearTable = () => {
    if (versionControlList?.value) versionControlList.value = []
    versionControlList.value = []
  }

  const listVersionControl = async () => {
    tableProperties.value.loading = true
    const queryString = formatParamsCustom(filtersFormat.value)
    await _getVersionControlList(queryString ? '&' + queryString : '')
    tableProperties.value.loading = false
  }

  const updatePage = (pageNumber: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: pageNumber as number,
    }
    listVersionControl()
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1 as number,
      rows: rowsPerPage as number,
    }
    listVersionControl()
  }

  const exportXlsx = async () => {
    openMainLoader(true)
    await _exportXlsxVersionControlList()
    openMainLoader(false)
  }

  onMounted(async () => {
    clearTable()
    filtersFormat.value = {
      page: 1 as number,
      rows: 20,
    }
    listVersionControl()
  })

  onUnmounted(() => {
    clearTable()
  })

  watch(
    () => versionControlList.value,
    () => {
      tableProperties.value.rows = versionControlList.value
    }
  )

  return {
    headerProperties,
    tableProperties,
    disableXlsxBtn,
    updatePage,
    exportXlsx,
    updateRowsPerPage,
  }
}
