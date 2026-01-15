/* eslint-disable*/

import { QTable } from 'quasar'
import { IAnnotationPoint, IFieldFilters } from '@/interfaces/customs'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'
// Stores
import { useFiltersStore, useSecurityStore } from '@/stores'
// Composables
import { useAlert, useMainLoader } from '@/composables'
import { ApexOptions } from 'apexcharts'

export const useCheckinTimeView = () => {
  // Tools and utils:
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()

  // Stores
  const { setFiltersState } = useFiltersStore()
  const { _getCheckinTimes, _getCheckinTimesList, _exportCheckInTimes } =
    useSecurityStore('v1')

  const { checkinTime, checkinTimeList, pages } = storeToRefs(
    useSecurityStore('v1')
  )

  // Variables
  const isGraph = ref(true)
  const filterList = ref()
  const totalUsers = ref(0)

  const headerProperties = ref({
    title: 'Horario de ingreso de usuarios',
    subtitle: '',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Seguridad',
      },
      {
        label: 'Horario de ingreso de usuarios',
      },
    ],
    showBackBtn: false,
  })

  // Props to filter
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'startDate',
      label: 'Desde fecha*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-6 col-lg-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      rules: [(val: string) => !!val || 'El campo "Desde fecha" es requerido'],
    },
    {
      name: 'startHour',
      label: 'Desde hora',
      type: 'q-time',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-6 col-lg-3',
      disable: false,
      clean_value: true,
      placeholder: '00:00',
    },
    {
      name: 'endDate',
      label: 'Hasta fecha*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-6 col-lg-3',
      disable: false,
      clean_value: true,
      rules: [(val: string) => !!val || 'El campo "Hasta fecha" es requerido'],
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'endHour',
      label: 'Hasta hora',
      type: 'q-time',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-6 col-lg-3',
      disable: false,
      clean_value: true,
      placeholder: '00:00',
    },
  ])

  const allRowsSelected = ref(false)

  const configGraphic = ref({
    showGraphic: false,
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
        padding: {
          left: 20,
          right: 20,
        },
      },
      markers: {
        size: 5,
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      },
      chart: {
        id: 'vuechart-failed-attempts',
        redrawOnWindowResize: true,
        toolbar: {
          show: false,
        },
        selection: {
          enabled: true,
        },
        animations: {
          initialAnimation: {
            enabled: true,
            easing: 'easeinout',
            speed: 500,
          },
        },
        events: {
          markerClick: async function (
            _e: Event,

            _chartContext: any,

            opts: any
          ) {
            const { login_hour } = checkinTime.value[opts.dataPointIndex] as {
              login_hour: string
            }

            headerProperties.value = {
              title: 'Consulta de usuarios que ingresan',
              subtitle: login_hour,
              breadcrumbs: [
                {
                  label: 'Inicio',
                  route: 'HomeView',
                },
                {
                  label: 'Seguridad',
                },
                {
                  label: 'Horario de ingreso de usuarios',
                  route: 'CheckinTime',
                },
              ],
              showBackBtn: true,
            }

            filterList.value = {
              ...filterList.value,
              'filter[date]': moment(login_hour).format('YYYY-MM-DD'),
              'filter[startHour]': login_hour.split(' ')[1],
            }

            allRowsSelected.value = false
            await _getCheckinTimesList({
              'filter[date]': filterList.value['filter[date]'],
              'filter[startHour]': filterList.value['filter[startHour]'],
            })
            isGraph.value = false
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
        enabled: false,
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
      },
      xaxis: {
        type: 'category',
        tickAmount: 20,
        labels: {
          rotate: -65,
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
        field: (row) => row.user?.email,
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
        field: (row) => row.user?.name,
        sortable: true,
      },
      {
        name: 'last_name',
        required: false,
        label: 'Apellidos',
        align: 'left',
        field: (row) => row.user?.last_name,
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'profile_type',
        required: false,
        label: 'Cargo',
        align: 'left',
        field: (row) => row.user?.profile_type,
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
        field: (row) => moment(row.created_at).format('YYYY-MM-DD HH:mm'),
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

  const handleSearch = async (filters: {
    'filter[startDate]': number | string | null
    'filter[endDate]': string | null
    'filter[startHour]': string | null
    'filter[endHour]': string | null
  }) => {
    const {
      'filter[startDate]': startDate,
      'filter[endDate]': endDate,
      'filter[startHour]': startHour,
      'filter[endHour]': endHour,
    } = filters

    // Validaciones
    const isInvalidDateRange =
      startDate && endDate && moment(startDate).isAfter(endDate)
    const isInvalidHourRange =
      startHour &&
      endHour &&
      moment(startHour, 'HH:mm').isAfter(moment(endHour, 'HH:mm'))

    if (isInvalidDateRange) {
      showAlert(
        'La fecha final debe ser mayor o igual a la fecha inicial',
        'error'
      )
      return
    }

    if (isInvalidHourRange) {
      showAlert(
        'La hora final debe ser mayor o igual a la hora inicial',
        'error'
      )
      return
    }

    filters = {
      ...filters,
      'filter[startHour]': startHour ?? '00:00',
      'filter[endHour]': endHour ?? '23:59',
    }
    filterList.value = { ...filters, paginate: 0 }

    openMainLoader(true)
    const successResponse = await _getCheckinTimes({ ...filterList.value })

    if (successResponse) {
      if (checkinTime.value && checkinTime.value.length > 0) {
        const total = checkinTime.value.reduce(
          (acc: number, item: { total_users: number | string }) =>
            acc + Number(item.total_users),
          0
        )

        const dataChart = checkinTime.value.map(
          (item: { login_hour: string; total_users: number | string }) => ({
            x: item.login_hour,
            y: item.total_users,
          })
        )

        configGraphic.value.chartData = [
          {
            color: '#F45100',
            name: 'Ingresos',
            data: dataChart,
          },
        ]
        totalUsers.value = total
      } else {
        configGraphic.value.chartData = [
          {
            color: '#F45100',
            name: 'Ingresos',
            data: [],
          },
        ]
      }
      configGraphic.value.showGraphic = true
    }
    openMainLoader(false)
  }

  const handleClear = async () => {
    clearTable()
  }

  const clearTable = () => {
    if (checkinTime?.value) checkinTime.value = []
    configGraphic.value.chartData = []
    configGraphic.value.showGraphic = false
  }

  const setFilters = async () => {
    openMainLoader(true)
    setFiltersState(filterConfig.value)
    openMainLoader(false)
  }

  const updatePage = async (page: number) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true

    const params = {
      'filter[date]': filterList.value['filter[date]'],
      'filter[startHour]': filterList.value['filter[startHour]'],
      rows: filterList.value.rows,
      page,
    }

    if (!allRowsSelected.value) {
      params['filter[date]'] = filterList.value['filter[startDate]']
    }

    await _getCheckinTimesList(params)
    tableProperties.value.loading = false
  }

  const updateRows = async (rowsPerPage: number) => {
    filterList.value = {
      ...filterList.value,
      rows: rowsPerPage,
    }

    const params = {
      'filter[date]': filterList.value['filter[date]'],
      'filter[startHour]': filterList.value['filter[startHour]'],
      rows: rowsPerPage,
    }

    await _getCheckinTimesList(params)
  }

  const handleBackView = async () => {
    headerProperties.value = {
      title: 'Horario de ingreso de usuarios',
      subtitle: '',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Seguridad',
        },
        {
          label: 'Horario de ingreso de usuarios',
        },
      ],
      showBackBtn: false,
    }
    configGraphic.value.chartData = []
    configGraphic.value.showGraphic = false
    isGraph.value = true
  }

  const exportXlsx = async () => {
    openMainLoader(true)
    await _exportCheckInTimes({
      'filter[date]': filterList.value['filter[date]'],
      'filter[startHour]': filterList.value['filter[startHour]'],
    })
    openMainLoader(false)
  }

  watch(
    () => checkinTimeList.value,
    (val) => {
      tableProperties.value.rows = val
    }
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
    totalUsers,
    handleSearch,
    handleClear,
    exportXlsx,
    configGraphic,
    tableProperties,
    updateRows,
    updatePage,
    handleBackView,
  }
}
