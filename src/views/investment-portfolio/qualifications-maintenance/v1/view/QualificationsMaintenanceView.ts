// vue | quasar | router
import { ref, onBeforeMount, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { QTable } from 'quasar'

// store
import { storeToRefs } from 'pinia'
import { useQualificationsMaintenanceStore } from '@/stores'

// composables
import { useMainLoader } from '@/composables'

// utils
import { ITabs } from '@/interfaces/global'
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { IQualificationsMaintenance } from '@/interfaces/customs'

const useQualificationsMaintenanceView = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const route = useRoute()
  const id = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id

  const { _getByIdQualifications, _getByIdHistorial } =
    useQualificationsMaintenanceStore('v1')
  const { qualifications_historial_pages, qualifications_historial } =
    storeToRefs(useQualificationsMaintenanceStore('v1'))

  // props
  const headerProps = {
    title: 'Ver calificación emisor',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: 'Mantenimiento calificación emisor',
        route: 'QualificationsMaintenanceList',
      },
      {
        label: 'Ver',
      },
      {
        label: id,
      },
    ],
  }

  const tableHistorialProps = ref({
    title: 'Listado de emisores',
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
        name: 'cp_issuer_rating_former',
        required: false,
        label: 'Calificación CP antiguo',
        align: 'left',
        field: 'cp_issuer_rating_former',
        sortable: true,
      },
      {
        name: 'cp_issuer_rating_new',
        required: true,
        label: 'Calificación CP nuevo',
        align: 'left',
        field: 'cp_issuer_rating_new',
        sortable: true,
      },
      {
        name: 'lp_issuer_rating_former',
        required: true,
        label: 'Calificación LP antiguo',
        align: 'left',
        field: 'lp_issuer_rating_former',
        sortable: true,
      },
      {
        name: 'lp_issuer_rating_new',
        required: true,
        label: 'Calificación LP nuevo',
        align: 'left',
        field: 'lp_issuer_rating_new',
        sortable: true,
      },
      {
        name: 'history_maintenance_qualification',
        required: true,
        label: 'Fecha actualización',
        align: 'left',
        field: (row) =>
          row.history_maintenance_qualification.updated_at ?? 'Sin registro',
        sortable: true,
      },
      {
        name: 'group',
        required: true,
        label: 'Usuario',
        align: 'left',
        field: (row) =>
          row.history_maintenance_qualification.creator_data ?? 'Sin registro',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IQualificationsMaintenance[],
    pages: qualifications_historial_pages,
  })

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'historial',
      label: 'Historial de calificaciones',
      icon: defaultIconsLucide.representative,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const filtersFormat = ref({
    page: 1,
    per_page: 20,
  })

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value),
  )

  // handlers / actions
  const onClose = async () => {
    router.push({ name: 'QualificationsMaintenanceList' })
  }

  const listAction = async (filter: string) => {
    tableHistorialProps.value.loading = true
    tableHistorialProps.value.rows = []

    await _getByIdHistorial(Number(id), filter)
    tableHistorialProps.value.loading = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString)
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      per_page: rowsPerPage,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString)
  }

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  // lifecycle hooks
  onBeforeMount(async () => {
    openMainLoader(true)
    await Promise.all([
      _getByIdQualifications(Number(id)),
      _getByIdHistorial(Number(id), 'page=1&rows=20'),
    ])
    openMainLoader(false)
  })

  // watchers
  watch(
    () => qualifications_historial.value,
    () => {
      tableHistorialProps.value.rows = qualifications_historial.value
      tableHistorialProps.value.pages = qualifications_historial_pages.value
    },
  )

  watch(tabActive, (tabName) => {
    tabActiveIdx.value = tabs.value.findIndex((tab) => tab.name === tabName)
  })

  return {
    tableHistorialProps,
    filteredTabs,
    tabActiveIdx,
    headerProps,
    tabActive,
    tabs,
    updatePage,
    updatePerPage,
    onClose,
    nextTab,
    backTab,
  }
}

export default useQualificationsMaintenanceView
