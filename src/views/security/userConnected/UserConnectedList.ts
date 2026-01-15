// Vue tools
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
// Utils
// Stores
import { useFiltersStore, useSecurityStore } from '@/stores'
// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { IFieldFilters, IUserConnectedList } from '@/interfaces/customs'
// Assets
import { createAndDownloadBlobByArrayBuffer } from '@/utils'
import { QTable } from 'quasar'
import { ApexOptions } from 'apexcharts'

export const useUserConnectedView = () => {
  // Tools and utils:
  const { openMainLoader } = useMainLoader()

  // Stores
  const { setFiltersState } = useFiltersStore()
  const { _getUserConnected, _exportConnectedUsers, _getConnectedUsersList } =
    useSecurityStore('v1')

  const { userConnectedCount, userConnectedList, pages } = storeToRefs(
    useSecurityStore('v1')
  )

  const isGraph = ref(true)
  const disableXlsxBtn = computed(() => userConnectedList.value?.length === 0)
  const filtersFormat = ref<Record<string, string | number>>({})

  const headerProperties = ref({
    title: 'Usuarios conectados',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Seguridad',
      },
      {
        label: 'Usuarios conectados',
        route: 'UserConnectedList',
      },
    ],
    showBackBtn: false,
  })

  // Props to filter
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'startDate',
      label: 'Desde fecha',
      type: 'q-date',
      value: 0,
      class: 'col-xs-12 col-sm-6 col-md-6 col-lg-6',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      rules: [(val: string) => !!val || 'Este campo es requerido'],
    },
    {
      name: 'endDate',
      label: 'Hasta fecha',
      type: 'q-date',
      value: 0,
      class: 'col-xs-12 col-sm-6 col-md-6 col-lg-6',
      disable: false,
      clean_value: true,
      rules: [(val: string) => !!val || 'Este campo es requerido'],
      placeholder: 'AAAA-MM-DD',
    },
  ])

  const configGraphic = ref({
    showGraphic: false,
    loader: false,
    chartData: [] as number[],
    chartOptions: {
      chart: {
        id: 'vuechart-donut',
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: { show: false },
              value: {
                show: false,
                fontSize: '20px',
                fontWeight: 'normal',
                color: '#000',
                formatter: (val: number) => val,
              },
              total: {
                show: true,
                style: {
                  fontSize: '20px',
                  fontWeight: 'normal',
                  color: '#000',
                },
              },
            },
          },
        },
      },
      colors: ['#FF5733', '#FFE6E2'],
      labels: ['Usuarios conectados', 'Usuarios desconectados'],
      legend: {
        show: false,
      },
    } as unknown as ApexOptions,
  })

  // Función para cargar datos del gráfico
  const loadChartData = async () => {
    configGraphic.value.loader = true

    try {
      await _getUserConnected()
      configGraphic.value.chartData = [userConnectedCount.value?.count ?? 0]
      const labels =
        configGraphic.value.chartOptions.plotOptions?.pie?.donut?.labels
      if (labels && labels.value) {
        labels.value.show = !!userConnectedCount.value?.count
      }
      configGraphic.value.showGraphic = true
    } finally {
      configGraphic.value.loader = false
    }
  }

  const clearTable = () => {
    if (userConnectedCount?.value) userConnectedCount.value = null
    configGraphic.value.chartData = []
    configGraphic.value.showGraphic = false
  }

  const setFilters = async () => {
    openMainLoader(true)
    setFiltersState(filterConfig.value)
    openMainLoader(false)
  }

  const tableProperties = ref({
    title: 'Listado de detalle de usuarios conectados',
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
        name: 'user',
        required: false,
        label: 'Usuario',
        align: 'left',
        field: (row) => row?.email,
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'name',
        required: false,
        label: 'Nombres',
        align: 'left',
        field: 'name',
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'last_name',
        required: false,
        label: 'Apellidos',
        align: 'left',
        field: 'last_name',
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'role',
        required: false,
        label: 'Cargo',
        align: 'left',
        field: 'role',
        sortable: true,
      },
      {
        name: 'profile_type',
        required: false,
        label: 'Tipo',
        align: 'left',
        field: 'profile_type',
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'date',
        required: false,
        label: 'Fecha / Hora ingreso',
        align: 'left',
        field: 'entry_time',
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'ip',
        required: false,
        label: 'IP',
        align: 'left',
        field: 'ip',
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
    ] as QTable['columns'],
    rows: [] as IUserConnectedList[],
    pages: pages,
  })

  const updatePage = async (pages: number) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true

    filtersFormat.value = {
      ...filtersFormat.value,
      page: pages,
    }

    await _getConnectedUsersList(filtersFormat.value)
  }

  const updateRows = async (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }

    await _getConnectedUsersList(filtersFormat.value)
  }

  const exportXlsx = async () => {
    try {
      openMainLoader(true)
      const stream = await _exportConnectedUsers()
      if (stream?.success === false) return

      createAndDownloadBlobByArrayBuffer(
        stream,
        'Listado_detalle_de_usuarios_conectados'
      )
    } finally {
      openMainLoader(false)
    }
  }

  const handleClick = async () => {
    headerProperties.value.showBackBtn = true

    openMainLoader(true)
    await _getConnectedUsersList(filtersFormat.value)
    tableProperties.value.rows = userConnectedList.value ?? []
    isGraph.value = false
    openMainLoader(false)
  }

  const handleBackView = async () => {
    headerProperties.value = {
      title: 'Usuarios conectados',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Seguridad',
        },
        {
          label: 'Usuarios conectados',
          route: 'UserConnectedList',
        },
      ],
      showBackBtn: false,
    }
    configGraphic.value.chartData = []
    isGraph.value = true
  }

  watch(
    isGraph,
    async (val) => {
      if (!val) return
      await loadChartData()
    },
    { immediate: true }
  )

  onMounted(async () => {
    clearTable()
    await setFilters()
  })

  onUnmounted(() => {
    clearTable()
    setFiltersState([])
  })

  return {
    isGraph,
    headerProperties,
    configGraphic,
    disableXlsxBtn,
    tableProperties,

    updateRows,
    handleClick,
    updatePage,
    exportXlsx,
    handleBackView,
  }
}
