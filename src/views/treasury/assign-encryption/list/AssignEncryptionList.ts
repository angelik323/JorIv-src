import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { IFieldFilters, IAssignEncryptDocument } from '@/interfaces/customs'
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import {
  useAssignEncryptStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'

const useAssignEncryptionList = () => {
  const { banks } = storeToRefs(useTreasuryResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { fetchAssignEncryptDocuments } = useAssignEncryptStore('v1')

  const { documents_list, documents_pages } = storeToRefs(
    useAssignEncryptStore('v1')
  )
  const router = useRouter()
  const selectedRowIdChannels = ref<number | null>()

  const keysBanks = { treasury: ['banks'] }

  const tableProps = ref({
    title: 'Listado cifrado',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'left',
        field: (row) => row.id,
        sortable: true,
      },
      {
        name: 'bank',
        label: 'Banco',
        align: 'left',
        field: 'bank',
        sortable: true,
      },
      {
        name: 'description',
        label: 'Descripción banco',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'type_format_id',
        label: 'Formato',
        align: 'left',
        field: 'type_format_id',
        sortable: true,
      },
      {
        name: 'type_format',
        label: 'Descripción formato',
        align: 'left',
        field: 'type_format',
        sortable: true,
      },
      {
        name: 'checkbox',
        required: true,
        label: 'Aplica cifrado',
        align: 'center',
        field: 'apply_encrypt',
      },
      {
        name: 'type_encrypt',
        label: 'Tipo de cifrado',
        align: 'left',
        field: 'type_encrypt',
        sortable: true,
      },
      {
        name: 'path_key',
        label: 'Ruta del archivo',
        align: 'left',
        field: 'path_key',
        sortable: false,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: (row) => row,
      },
    ] as QTable['columns'],
    rows: [] as IAssignEncryptDocument[],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const headerProps = {
    title: 'Asignar cifrado',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      { label: 'Asignar cifrado', route: 'AssignEncryptionList' },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'bank_id',
      label: 'Banco y descripción',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-6',
      disable: false,
      options: banks,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código o nombre de formato',
      prepend_icon: defaultIconsLucide.magnify,
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
  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await fetchAssignEncryptDocuments(filters)
    tableProps.value.loading = false
  }

  const handleFilter = ($filters: { 'filter[search]': number }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    listAction()
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value.per_page = rowsPerPage
    listAction()
  }

  const handleClear = () => {
    tableProps.value.rows = []
  }
  const handleOptions = (option: string, row: IAssignEncryptDocument) => {
    if (option === 'edit') {
      router.push({
        name: 'AssignEncryptionEdit',
        params: { id: row.id },
        query: {
          assign_encrypt_id: row.assign_encrypt_id,
        },
      })
    }
  }

  onMounted(() => {
    _getResources(keysBanks)
  })

  onBeforeMount(async () => {
    await _resetKeys(keysBanks)
  })

  watch(
    () => documents_list.value,
    () => {
      tableProps.value.rows = documents_list.value
    },
    {
      deep: true,
    }
  )

  watch(
    () => documents_pages.value,
    () => {
      tableProps.value.pages = documents_pages.value
    },
    {
      deep: true,
    }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    selectedRowIdChannels,
    handleClear,
    handleFilter,
    updatePage,
    updatePerPage,
    handleOptions,
  }
}

export default useAssignEncryptionList
