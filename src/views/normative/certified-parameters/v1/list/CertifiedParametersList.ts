// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { ICertifiedParametersListItem } from '@/interfaces/customs/normative/CertifiedParameters'

// Composables - constants
import { useUtils } from '@/composables/useUtils'
import { useRouteValidator } from '@/composables/useRoutesValidator'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useRules } from '@/composables/useRules'

// Stores
import { useCertifiedParametersStore } from '@/stores/normative/certified-parameters'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useNormativeResourceStore } from '@/stores/resources-manager/normative'

const useCertifiedParametersList = () => {
  const { _getListAction, _deleteCertifiedParameters } =
    useCertifiedParametersStore('v1')
  const { headerPropsDefault } = useCertifiedParametersStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { certificates, certificate_types, person_types } = storeToRefs(
    useNormativeResourceStore('v1')
  )

  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()

  const alertModalRef = ref()

  const filterComponentRef = ref()
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'certificate_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Certificados',
      placeholder: 'Seleccione',
      value: null,
      options: certificates,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'certificate_type_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Tipos de certificado',
      placeholder: 'Seleccione',
      value: null,
      options: certificate_types,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'search',
      type: 'q-input',
      class: 'col-12 col-md-4',
      label: 'Buscador',
      placeholder: 'Buscar por código',
      prepend_icon: defaultIconsLucide.magnify,
      value: null,
      clean_value: true,
      disable: false,
      rules: [(val: string) => useRules().max_length(val, 50)],
    },
    {
      name: 'person_type_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Tipos de persona',
      placeholder: 'Seleccione',
      value: null,
      options: person_types,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'initial_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'final_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
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

  const tableProperties = ref<IBaseTableProps<ICertifiedParametersListItem>>({
    title: 'Listado de parámetros certificados',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: (row) => `${row.index ?? ''}`,
        sortable: true,
      },
      {
        name: 'code',
        required: false,
        label: 'Código de certificado',
        align: 'left',
        field: (row) => `${row.code ?? ''}`,
        sortable: true,
      },
      {
        name: 'certificate_type',
        required: false,
        label: 'Tipo de certificado',
        align: 'left',
        field: (row) => `${row.certificate_type ?? ''}`,
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre formato',
        align: 'left',
        field: (row) => `${row.name ?? ''}`,
        sortable: true,
      },
      {
        name: 'person_type',
        required: false,
        label: 'Tipo de persona',
        align: 'left',
        field: (row) => `${row.person_type ?? ''}`,
        sortable: true,
      },
      {
        name: 'generate_date',
        required: false,
        label: 'Fecha de generación',
        align: 'left',
        field: (row) => `${row.generation_date ?? ''}`,
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const alertModalConfig = {
    title: '¿Desea eliminar el parámetro de certificado?',
    description_message: '',
    id: null as number | null,
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cerrar',
  }

  const listAction = async () => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    const response = await _getListAction(filtersFormat.value)
    if (response) {
      let index = 0
      const tableRows = response.list.map((item) => {
        index += 1
        return {
          ...item,
          index,
        }
      })
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
    'filter[certificate_id]': string
    'filter[certificate_type_id]': string
    'filter[search]': string
    'filter[person_type_id]': string
    'filter[initial_date]': string
    'filter[final_date]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
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

  const handleDelete = async () => {
    if (!alertModalConfig.id) return
    const success = await _deleteCertifiedParameters(alertModalConfig.id)
    if (success) await listAction()
    await alertModalRef.value?.closeModal()
    alertModalConfig.id = null
  }

  const openDeleteModal = (id: number) => {
    alertModalRef.value?.openModal()
    alertModalConfig.id = id
  }

  const keys = {
    normative: ['certificates', 'certificate_types', 'person_types'],
  }

  onMounted(async () => {
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    defaultIconsLucide,
    headerPropsDefault,
    tableProperties,
    filterComponentRef,
    filterConfig,
    validateRouter,
    goToURL,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
    alertModalRef,
    alertModalConfig,
    handleDelete,
    openDeleteModal,
  }
}

export default useCertifiedParametersList
