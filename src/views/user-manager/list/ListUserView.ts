// Vue & utils:
import { createAndDownloadBlobByArrayBuffer, defaultIcons } from '@/utils'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
// Components & Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useAlert, useAlertModal } from '@/composables'
// Interfaces
import { IShowAlertInformation } from '@/interfaces/global'
// Stores
import { useFiltersStore, useResourcesStore, useUserStore } from '@/stores'
// Assets
import imageUrl from '@/assets/images/alert/confirmation-image.svg'

export const useListUserView = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const { showAlertInformation } = useAlertModal()
  const { status } = storeToRefs(useResourcesStore())
  const { setFiltersState } = useFiltersStore()
  const { getUsersList, getUserById, getXlsxFile, changeUserStatus } =
    useUserStore()
  const { userList, userCount, pages, urlExportXlsx } = storeToRefs(
    useUserStore()
  )

  const statsProps = ref()
  const openModal = ref<boolean>(false)
  const userId = ref<number>(0)

  const headerProps = {
    title: 'Usuarios',
    breadcrumbs: [
      {
        label: 'Usuarios',
      },
      {
        label: 'Usuarios',
        route: 'ListUserView',
      },
    ],
  }

  const disableXlsxBtn = computed(() => userList.value?.length === 0)

  const filterConfig = ref([
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: 0,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6 q-py-md',
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
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6 q-py-md',
      disable: false,
      prepend_icon: defaultIcons.magnify,
      clean_value: true,
      placeholder: 'Buscar por nombre o documento',
    },
  ])

  const tableProperties = ref({
    title: 'Listado de usuarios',
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
        name: 'name',
        required: false,
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
        style: {
          'max-width': '200px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'last_name',
        required: false,
        label: 'Apellido',
        align: 'left',
        field: 'last_name',
        sortable: true,
        style: {
          'max-width': '200px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'document',
        required: false,
        label: 'Documento',
        align: 'left',
        field: 'document',
        sortable: true,
        style: {
          'max-width': '140px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'phone',
        required: false,
        label: 'Teléfono',
        align: 'left',
        field: 'phone',
        sortable: true,
        style: {
          'max-width': '140px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'email',
        required: false,
        label: 'Correo electrónico',
        align: 'left',
        field: 'email',
        sortable: true,
        style: {
          'max-width': '250px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: (row) => `${row.status.id}`,
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
    rows: userList,
    pages: pages,
  })

  const filterList = ref<{
    'filter[status_id]': number | string | null
    'filter[search]': string | null
    page?: number
  }>({
    'filter[status_id]': null,
    'filter[search]': null,
    page: 1,
  })

  const updatePage = async (page: number, noAlert?: boolean) => {
    await handleSearch(filterList.value, page, noAlert)
  }

  const handleSearch = async (
    filters: {
      'filter[status_id]': number | string | null
      'filter[search]': string | null
    },
    page: number = 1,
    noAlert?: boolean
  ) => {
    tableProperties.value.loading = true

    if (filters['filter[status_id]'] === 0) filters['filter[status_id]'] = null

    filterList.value = { ...filters }
    filterList.value.page = page

    const response = await getUsersList({ ...filters, page })
    if (response?.success === true && !noAlert) {
      showAlert(response.message, 'success')
    }
    statsProps.value = []
    setStatsProps()
    tableProperties.value.loading = false
  }

  const setStatsProps = () => {
    statsProps.value = [
      {
        count: userCount.value?.total ?? 0,
        image: defaultIcons.accountMultiple,
        label: 'Total',
      },
      {
        count: userCount.value?.active ?? 0,
        image: defaultIcons.accountCheck,
        label: 'Activos',
      },
      {
        count: userCount.value?.inactive ?? 0,
        image: defaultIcons.accountOff,
        label: 'Inactivos',
      },
    ]
  }

  const goToView = (route: string, id?: number) => {
    router.push({ name: route, params: { id } })
  }

  const edit = async (id: number) => {
    goToView('EditUserView', id)
  }

  const read = async (id: number) => {
    openMainLoader(true)
    await getUserById(id)
    goToView('ReadUserView', id)
    openMainLoader(false)
  }

  const changeStatus = async (id: number, status_id: number) => {
    const statusValue = computed(() => {
      if (status_id === 1) return 'inactivar'
      else if (status_id === 2) return 'activar'
    })
    const alertParams: IShowAlertInformation = {
      image_url: imageUrl,
      params_html: `<p style="font-size: 25px; font-weight: 600;" class="text-primary">Confirmación</p>¿Desea ${statusValue.value} el usuario?`,
      confirm_button_text: 'Aceptar',
      cancel_button_text: 'Cancelar',
    }
    const accept = await showAlertInformation(alertParams)
    if (accept) {
      tableProperties.value.loading = true
      const response = await changeUserStatus(id)
      showAlert(response.message, response.success ? 'success' : 'error')
      await updatePage(Number(filterList.value.page), true)
    }
  }

  const changePassword = async (id: number) => {
    userId.value = id
    openModal.value = true
  }

  const handleClear = async () => {
    userList.value = []
    filterConfig.value[0].value = 0
    userCount.value = null
    setStatsProps()
  }

  const exportXlsx = async () => {
    const url = JSON.parse(JSON.stringify(urlExportXlsx.value))
    const queryString = url.split('?')[1]
    openMainLoader(true)
    const stream = await getXlsxFile(queryString)
    if (stream) {
      createAndDownloadBlobByArrayBuffer(stream, 'Listado_de_usuarios')
    }
    openMainLoader(false)
  }

  const setDeafultValuesToStore = () => {
    userList.value = []
    userCount.value = null
  }

  onMounted(() => {
    openMainLoader(true)
    setDeafultValuesToStore()
    setStatsProps()
    setFiltersState(filterConfig.value)
    openMainLoader(false)
  })

  return {
    headerProps,
    statsProps,
    tableProperties,
    disableXlsxBtn,
    openModal,
    goToView,
    updatePage,
    handleClear,
    handleSearch,
    exportXlsx,
    changeStatus,
    changePassword,
    userId,
    edit,
    read,
  }
}
