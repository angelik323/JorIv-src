// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'
import { IGenerationCertificateDetailListItem } from '@/interfaces/customs/normative/GenerationCertificate'

// Composables - constants
import {
  useUtils,
  useRouteValidator,
  useGoToUrl,
  useMainLoader,
} from '@/composables'

// Stores
import { useGenerationCertificateStore } from '@/stores/normative/generation-certificate'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useGenerationGMFCertificateList = () => {
  const {
    _getListActionDetail,
    _setUrl,
    _setRouterList,
    _sendDetailCertificateEmail,
  } = useGenerationCertificateStore('v1')
  const { headerPropsDefault } = useGenerationCertificateStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))

  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  const router = useRouter()

  const id = Number(router.currentRoute.value.params.id)

  const alertModalRef = ref()

  const headerProperties = {
    title: 'Generación certificados GMF',
    breadcrumbs: [
      ...headerPropsDefault.breadcrumbs,

      {
        label: 'Generación certificado GMF',
        route: 'GenerationGmfCertificateList',
      },
    ],
  }

  const filterComponentRef = ref()

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'client',
      type: 'q-select',
      class: 'col-12',
      label: 'Cliente',
      placeholder: 'Seleccione',
      value: null,
      options: third_parties,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
  ])

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const tableProperties = ref<
    IBaseTableProps<IGenerationCertificateDetailListItem>
  >({
    title: 'Listado de generación de certificados GMF',
    loading: false,
    wrapCells: true,
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
        name: 'person_type',
        required: false,
        label: 'Tipo de persona',
        align: 'left',
        field: 'person_type',
        sortable: true,
      },
      {
        name: 'client',
        required: false,
        label: 'Cliente',
        align: 'left',
        field: 'client',
        sortable: true,
      },
      {
        name: 'period',
        required: false,
        label: 'Periodo',
        align: 'left',
        field: 'period',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'left',
        field: 'id',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const alertModalConfig = {
    title: '¿Desea enviar el certificado?',
    description_message: '',
    id: null as number | null,
    textBtnConfirm: 'Si',
    textBtnCancel: 'No',
  }

  const listAction = async () => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    const updateFilters = {
      ...filtersFormat.value,
      'filter[group]': id,
    }
    const response = (await _getListActionDetail(updateFilters)) as {
      list: IGenerationCertificateDetailListItem[]
      pages: { currentPage: number; lastPage: number }
    } | null
    if (response) {
      let index = 0
      const tableRows = response.list.map(
        (item: IGenerationCertificateDetailListItem) => {
          index += 1
          return {
            ...item,
            index,
          }
        }
      )
      tableProperties.value.rows = tableRows

      const { currentPage, lastPage } = response.pages
      tableProperties.value.pages = {
        currentPage,
        lastPage,
      }
    }
    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }

  const handleFilterSearch = async ($filters: { 'filter[client]': string }) => {
    const start_client = $filters['filter[client]']
    const end_client = $filters['filter[client]']
    filtersFormat.value = {
      ...filtersFormat.value,
      'filter[start_client]': start_client,
      'filter[end_client]': end_client,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction()
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction()
  }

  const updateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction()
  }

  const goToView = (row: IGenerationCertificateDetailListItem) => {
    goToURL('GenerationCertificateView', row.id)
    _setRouterList('GmfGroupList')
    _setUrl(row.url)
  }

  const handleSendEmail = async () => {
    if (!alertModalConfig.id) return
    await _sendDetailCertificateEmail(alertModalConfig.id)
    await alertModalRef.value?.closeModal()
    alertModalConfig.id = null
  }

  const openSendModal = (id: number) => {
    alertModalRef.value?.openModal()
    alertModalConfig.id = id
  }

  const keys = {
    third_party: ['third_parties'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await listAction()
    await _getResources(keys, `fields[third_parties]=id,document`)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    defaultIconsLucide,
    headerProperties,
    tableProperties,
    filterComponentRef,
    filterConfig,

    alertModalRef,
    alertModalConfig,
    validateRouter,
    goToURL,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
    goToView,
    handleSendEmail,
    openSendModal,
  }
}
