// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters, IGenericResource } from '@/interfaces/customs'
import { IGenerationCertificateGroupListItem } from '@/interfaces/customs/normative/GenerationCertificate'

// Composables - constants
import {
  useUtils,
  useRouteValidator,
  useGoToUrl,
  useMainLoader,
} from '@/composables'
import { person_types } from '@/constants/resources'

// Stores
import { useGenerationCertificateStore } from '@/stores/normative/generation-certificate'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'

export const useGenerationGMFCertificateList = () => {
  const { _getListActionGroup, _sendGroupCertificateEmail } =
    useGenerationCertificateStore('v1')

  const { headerPropsDefault } = storeToRefs(
    useGenerationCertificateStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))

  const { defaultIconsLucide, downloadFile } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()

  const headerProperties = {
    title: 'Generación certificados GMF',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,

      {
        label: 'Generación certificados GMF',
        route: 'GmfGroupList',
      },
    ],
    btn: headerPropsDefault.value.btn,
  }

  const alertModalRef = ref()

  const filterComponentRef = ref()

  const handleChangePersonType = (id: string | number) => {
    _resetKeys({ third_party: ['third_parties'] })

    filterComponentRef.value?.cleanFiltersByNames([
      'start_client',
      'end_client',
    ])

    if (id == null) return
    const label = person_types.find(
      (pt: IGenericResource) => pt.value === id
    )?.value

    let personFilter = ''
    if (label != 0) {
      personFilter = `filter[person_type]=${label}`
    } else {
      personFilter = ``
    }

    _getResources(
      {
        third_party: ['third_parties'],
      },
      `fields[third_parties]=id,document&filter[is_customer]=1&${personFilter}`
    )
  }

  const handleChangeValidity = (value: boolean[]) => {
    filterComponentRef.value?.cleanFiltersByNames([
      'validity',
      'start_period',
      'end_period',
    ])
    if (value[0]) {
      filterComponentRef.value?.enableFieldByName('validity', false)
      filterComponentRef.value?.enableFieldByName('start_period', true)
      filterComponentRef.value?.enableFieldByName('end_period', true)
    } else {
      filterComponentRef.value?.enableFieldByName('validity', true)
      filterComponentRef.value?.enableFieldByName('start_period', false)
      filterComponentRef.value?.enableFieldByName('end_period', false)
    }
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'person_type',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Tipo de persona',
      placeholder: 'Seleccione',
      value: null,
      options: person_types,
      clean_value: true,
      autocomplete: false,
      disable: false,
      onChange: handleChangePersonType,
    },
    {
      name: 'start_client',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Desde cliente',
      placeholder: 'Seleccione',
      value: null,
      options: third_parties,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'end_client',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Hasta cliente',
      placeholder: 'Seleccione',
      value: null,
      options: third_parties,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'has_validity',
      label: '',
      type: 'q-option-group',
      value: [],
      class: 'col-12 col-md-3 q-mt-md',
      options: [{ label: 'Vigencia', value: true }],
      clean_value: true,
      disable: false,
      radioType: 'checkbox',
      onChange: handleChangeValidity,
    },
    {
      name: 'validity',
      type: 'q-date',
      class: 'col-12 col-md-3',
      label: 'Año',
      value: null,
      mask: 'YYYY',
      placeholder: 'AAAA',
      clean_value: true,
      autocomplete: false,
      disable: true,
    },
    {
      name: 'start_period',
      type: 'q-date',
      class: 'col-12 col-md-3',
      label: 'Periodo desde',
      value: null,
      mask: 'YYYY-MM',
      placeholder: 'AAAA-MM',
      clean_value: true,
      autocomplete: false,
      disable: false,
    },
    {
      name: 'end_period',
      type: 'q-date',
      class: 'col-12 col-md-3',
      label: 'Periodo hasta',
      value: null,
      mask: 'YYYY-MM',
      placeholder: 'AAAA-MM',
      clean_value: true,
      autocomplete: false,
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
    IBaseTableProps<IGenerationCertificateGroupListItem>
  >({
    title: 'Listado masivo de certificados',
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
        name: 'progress',
        required: false,
        label: 'Porcentaje de avance',
        align: 'left',
        field: 'progress',
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
    pages: { currentPage: 1, lastPage: 1 },
  })

  const alertModalConfig = {
    title: '¿Desea enviar los certificados por correo?',
    description_message: '',
    id: null as number | null,
    textBtnConfirm: 'Si',
    textBtnCancel: 'No',
  }

  const listAction = async () => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true

    const updateFileters = {
      ...filtersFormat.value,
      'filter[certificate_type]': 1,
    }

    const response = (await _getListActionGroup(updateFileters)) as {
      list: IGenerationCertificateGroupListItem[]
      pages: { currentPage: number; lastPage: number }
    } | null
    if (response) {
      let index = 0
      const tableRows = response.list.map(
        (item: IGenerationCertificateGroupListItem) => {
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

  const handleFilterSearch = async ($filters: {
    'filter[start_client]': string
    'filter[end_client]': string
    'filter[validity]': string
    'filter[start_period]': string
    'filter[end_period]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    delete filtersFormat.value['filter[person_type]']
    delete filtersFormat.value['filter[has_validity]']

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

  const handleDownload = async (zip: string) => {
    await downloadFile(zip)
  }

  const handleSendEmail = async () => {
    if (!alertModalConfig.id) return
    await _sendGroupCertificateEmail(alertModalConfig.id)
    await alertModalRef.value?.closeModal()
    alertModalConfig.id = null
  }

  const openSendModal = (id: number) => {
    alertModalRef.value?.openModal()
    alertModalConfig.id = id
  }

  const keys = {
    normative: ['person_types'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
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
    handleSendEmail,
    openSendModal,
    handleDownload,
  }
}
