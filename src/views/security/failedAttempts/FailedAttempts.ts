// Vue tools
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
// Utils
// Stores
import { useFiltersStore, useSecurityStore } from '@/stores'
// Composables
import { useAlert } from '@/composables'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { IAnnotationPoint, IFieldFilters } from '@/interfaces/customs'
// Assets
import moment from 'moment'
import { ApexOptions } from 'apexcharts'
// import { createAndDownloadBlobByArrayBuffer } from '@/utils'

export const useFailedAttemptsView = () => {
  // Tools and utils:
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()

  // Stores
  const { setFiltersState } = useFiltersStore()

  const { _getFailedAttempts, _exportFailedAttempts } = useSecurityStore('v1')

  const { failedAttemptsChart } = storeToRefs(useSecurityStore('v1'))

  // Variables
  const disableXlsxBtn = computed(
    () => failedAttemptsChart?.value?.length === 0
  )
  const filtersExport = ref()
  const totalUsers = ref(0)

  const headerProperties = {
    title: 'Intentos fallidos de ingreso a la aplicación',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Seguridad',
      },
      {
        label: 'Intentos fallidos de ingreso',
      },
    ],
  }

  // Props to filter
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'startDate',
      label: 'Desde fecha*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-6 col-lg-6',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      rules: [(val: string) => !!val || 'El campo "Desde fecha" es requerido'],
    },
    {
      name: 'endDate',
      label: 'Hasta fecha*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-6 col-lg-6',
      disable: false,
      clean_value: true,
      rules: [(val: string) => !!val || 'El campo "Hasta fecha" es requerido'],
      placeholder: 'AAAA-MM-DD',
    },
  ])

  const configGraphic = ref({
    showGraphic: false,
    loader: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        redrawOnWindowResize: true,
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
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '35%',
          borderRadius: 4,
          barHeight: '30%',
          borderRadiusApplication: 'end',
          dataLabels: {
            position: 'top',
          },
        },
      },
      noData: {
        text: 'No hay datos que mostrar',
        align: 'center',
        verticalAlign: 'middle',
      },
      dataLabels: {
        enabled: false,
        formatter: (val: number) => val.toString(),
        style: {
          colors: ['#000'],
          fontWeight: 400,
        },
        offsetY: -20,
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
      },
      xaxis: {
        type: 'category',
        tickAmount: 20,
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

  const handleSearch = async (
    filters: {
      'filter[startDate]': number | string | null
      'filter[endDate]': string | null
    },
    noAlert?: boolean
  ) => {
    if (
      moment(filters['filter[startDate]']).isAfter(filters['filter[endDate]'])
    ) {
      showAlert(
        'La fecha final debe ser mayor o igual a la fecha inicial',
        'error'
      )
      return
    }
    filtersExport.value = filters

    openMainLoader(true)
    const responseSuccess = await _getFailedAttempts({ ...filters })

    if (responseSuccess === true && !noAlert) {
      if (failedAttemptsChart.value && failedAttemptsChart.value.length > 0) {
        const total = failedAttemptsChart.value.reduce(
          (acc: number, item: { count: number | string }) =>
            acc + Number(item.count),
          0
        )

        const dataChart = failedAttemptsChart.value.map(
          (item: { date: string; count: number | string }) => ({
            x: moment(item.date).format('DD/MM/YYYY'),
            y: Number(item.count),
          })
        )

        configGraphic.value.chartData = [
          {
            color: '#F45100',
            name: 'Intentos fallidos',
            data: dataChart,
          },
        ]
        totalUsers.value = total
      } else {
        configGraphic.value.chartData = [
          {
            color: '#F45100',
            name: 'Intentos fallidos',
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
    await _exportFailedAttempts(filtersExport.value)
    openMainLoader(false)
  }

  const handleClear = async () => {
    clearTable()
  }

  const clearTable = () => {
    if (failedAttemptsChart?.value) failedAttemptsChart.value = []
    configGraphic.value.chartData = []
    configGraphic.value.showGraphic = false
  }

  const setFilters = async () => {
    openMainLoader(true)
    setFiltersState(filterConfig.value)
    openMainLoader(false)
  }

  onMounted(async () => {
    clearTable()
    await setFilters()
  })

  onUnmounted(() => {
    clearTable()
    setFiltersState([])
  })

  return {
    headerProperties,
    totalUsers,
    handleSearch,
    handleClear,
    configGraphic,
    disableXlsxBtn,
    exportXlsx,
  }
}
