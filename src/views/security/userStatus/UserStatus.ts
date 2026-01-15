/* eslint-disable*/

// Vue tools
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
// Utils
// Stores
import { useSecurityStore } from '@/stores'
// Composables
import { useMainLoader } from '@/composables'
import {
  ApexChartsCustom,
  IAnnotationPoint,
  IUsersStatusList,
} from '@/interfaces/customs'
// Assets
import { QTable } from 'quasar'
import { ApexOptions } from 'apexcharts'
// import { createAndDownloadBlobByArrayBuffer } from '@/utils'

export const useUserStatusView = () => {
  // Tools and utils:
  const { openMainLoader } = useMainLoader()

  // Stores
  const { _getUsersStatus, _exportUsersStatus, _getUsersStatusID } =
    useSecurityStore('v1')

  const { usersStatus, usersStatusList, pages } = storeToRefs(
    useSecurityStore('v1')
  )

  // Variables
  const disableXlsxBtn = computed(
    () => tableProperties.value?.rows?.length === 0 || !usersStatusId.value
  )
  const usersStatusId = ref<number | null>(null)
  const usersStatusName = ref<string | null>(null)
  const isGraph = ref(true)

  const defaultHeaderProperties = {
    title: 'Estado de usuarios',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Seguridad',
      },
      {
        label: 'Estado de usuarios',
      },
    ],
    showBackBtn: false,
  }

  const headerProperties = ref({ ...defaultHeaderProperties })

  const attachLabelClickHandlers = (chartContext: ApexChartsCustom) => {
    setTimeout(() => {
      const labels = chartContext.el.querySelectorAll('.apexcharts-xaxis-label')
      labels.forEach((labelEl: Element, index: number) => {
        const label = labelEl as HTMLElement
        label.style.cursor = 'pointer'
        label.onclick = () => handleUserStatusClick(index)
      })
    }, 100)
  }

  const configGraphic = ref({
    showGraphic: true,
    loader: false,
    chartData: [] as any[],
    chartOptions: {
      annotations: {
        points: [] as IAnnotationPoint[],
      },
      grid: {
        borderColor: '#ccc',
        strokeDashArray: 5,
        xaxis: { lines: { show: true } },
      },
      chart: {
        id: 'vuechart-failed-attempts',
        toolbar: {
          show: false,
        },
        animations: {
          initialAnimation: {
            enabled: true,
            easing: 'easeinout',
            speed: 500,
          },
        },
        events: {
          mounted: (chartContext: ApexChartsCustom) => {
            attachLabelClickHandlers(chartContext)
          },
          updated: (chartContext: ApexChartsCustom) => {
            attachLabelClickHandlers(chartContext)
          },
          dataPointSelection: function (
            _e: Event,

            _chartContext: any,

            opts: any
          ) {
            handleUserStatusClick(opts.dataPointIndex)
          },
        },
        redrawOnWindowResize: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '35%',
          borderRadius: 4,
          barHeight: '50%',
          borderRadiusApplication: 'end',
          dataLabels: {
            position: 'top',
            useHTML: true,
          },
        },
      },
      noData: {
        text: 'No hay datos que mostrar',
        align: 'center',
        verticalAlign: 'middle',
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#000'],
          fontWeight: 400,
        },
        useHTML: true,
        offsetY: -20,
        formatter: (val: number) => `${val} 👁️`,
      },
      yaxis: {
        type: 'string',
        title: {
          style: {
            fontSize: '12px',
            fontFamily: 'Nunito Sans, sans-serif',
            fontWeight: 400,
          },
        },
        labels: {
          formatter: (val: number) => (val % 2 === 0 ? `${val}` : ''),
        },
        forceNiceScale: false,
      },
      xaxis: {
        type: 'category',
        labels: {
          rotate: -45,
          style: {
            fontFamily: 'Nunito Sans, sans-serif',
            fontSize: '12px',
            colors: ['#000'],
          },
        },
        categories: [],
      },
    } as ApexOptions,
  })

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
        name: 'user',
        required: false,
        label: 'Usuario',
        align: 'left',
        field: (row) => row?.email,
        sortable: true,
        style: {
          'max-width': '250px',
          'min-width': '250px',
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
          'max-width': '250px',
          'min-width': '250px',
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
          'max-width': '250px',
          'min-width': '250px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'profile_type',
        required: false,
        label: 'Cargo',
        align: 'left',
        field: 'profile_type',
        sortable: true,
      },
      {
        name: 'status_name',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'status_name',
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'date',
        required: false,
        label: 'Fecha / Hora',
        align: 'left',
        field: 'date',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IUsersStatusList[],
    pages: pages,
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleUserStatusClick = async (index: number) => {
    let title = ''
    if (index !== 0) {
      const { status_id, status_name } =
        usersStatus.value[index > 0 ? index - 1 : index]

      usersStatusId.value = status_id
      title = `Usuarios en estado ${status_name.toLowerCase() || undefined}`
    } else {
      usersStatusId.value = null
      title = 'Estado de usuarios'
    }

    headerProperties.value = {
      title,
      breadcrumbs: [
        { label: 'Inicio', route: 'HomeView' },
        { label: 'Seguridad' },
        { label: 'Estado de usuarios', route: 'UserStatus' },
      ],
      showBackBtn: true,
    }

    openMainLoader(true)

    await _getUsersStatusID({ status_id: usersStatusId.value })
    tableProperties.value.rows = usersStatusList.value
    isGraph.value = false
    openMainLoader(false)
  }

  const updatePage = async (page: number) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true

    filtersFormat.value = {
      ...filtersFormat.value,
      status_id: usersStatusId.value ?? '',
      page,
    }

    await _getUsersStatusID({
      ...filtersFormat.value,
      status_id: usersStatusId.value ?? null,
      page,
    })
    tableProperties.value.loading = false
  }

  const updateRows = async (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }

    await _getUsersStatusID({
      ...filtersFormat.value,
      status_id: usersStatusId.value ?? null,
    })
  }

  const handleSearch = async () => {
    openMainLoader(true)

    if (await _getUsersStatus()) {
      if (usersStatus.value && usersStatus.value.length > 0) {
        const total = usersStatus.value.reduce(
          (acc: number, item: { count: number | string }) =>
            acc + Number(item.count),
          0
        )

        const dataChart = usersStatus.value.map(
          (item: {
            count: number
            status_id: number
            status_name: string
          }) => ({
            x: item.status_name,
            y: item.count,
          })
        )

        configGraphic.value.chartData = [
          {
            color: '#F45100',
            name: 'Estado de usuarios',
            data: [{ x: 'Total', y: total }, ...dataChart],
          },
        ]
      } else {
        configGraphic.value.chartData = [
          {
            color: '#F45100',
            name: 'Estado de usuarios',
            data: [],
          },
        ]
      }
      configGraphic.value.showGraphic = true
    }
    openMainLoader(false)
  }

  const exportXlsx = async () => {
    openMainLoader(true)
    await _exportUsersStatus({
      status_id: usersStatusId.value,
      page: pages.value.currentPage,
    })
    openMainLoader(false)
  }

  watch(
    () => usersStatusList.value,
    (val) => {
      tableProperties.value.rows = val
    }
  )

  watch(isGraph, (val) => {
    if (!val) return

    usersStatusId.value = null
    usersStatusName.value = null
    headerProperties.value = { ...defaultHeaderProperties }
  })

  onMounted(async () => {
    await handleSearch()
  })

  return {
    isGraph,
    headerProperties,
    configGraphic,
    exportXlsx,
    disableXlsxBtn,
    tableProperties,
    updatePage,
    updateRows,
  }
}
