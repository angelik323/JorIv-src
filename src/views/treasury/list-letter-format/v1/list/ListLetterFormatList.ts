import { ref, onMounted, watch, onBeforeMount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { formatParamsCustom } from '@/utils'
import {
  useLetterFormatStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
import {
  IFieldFilters,
  ILetterFormat,
  ILetterFormatFilters,
} from '@/interfaces/customs'

const useLetterFormatList = () => {
  const router = useRouter()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    treasury: ['banks'],
  }

  const keysV2 = {
    treasury: ['letter_format_codes', 'letter_format_statuses'],
  }

  const { banks, letter_format_codes, letter_format_statuses } = storeToRefs(
    useTreasuryResourceStore('v1')
  )

  const {
    _getListAction,
    _deleteLetterFormat,
    _cleanLetterFormatData,
    _toggleLetterFormatStatus,
    _selectLetterFormat,
    _exportLetterFormat,
  } = useLetterFormatStore('v1')
  const { letter_format_list, letter_format_pages } = storeToRefs(
    useLetterFormatStore('v1')
  )

  const headerProps = {
    title: 'Formato de cartas',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería' },
      { label: 'Formato de cartas', route: 'LetterFormatList' },
    ],
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: ILetterFormat[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: 'Listado de formatos de carta',
    loading: false,
    columns: [
      { name: 'id', label: '#', align: 'left', field: 'id', sortable: true },
      {
        name: 'format_code',
        label: 'Código formato',
        align: 'left',
        field: (row) => row.code,
        sortable: true,
      },
      {
        name: 'bank',
        label: 'Banco',
        align: 'left',
        field: (row) => row.bank?.description ?? '',
        sortable: true,
      },
      {
        name: 'format_name',
        label: 'Nombre formato',
        align: 'left',
        field: (row) => row.name,
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        align: 'left',
        field: (row) => row.status?.status ?? '',
        sortable: true,
      },

      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const filters = ref<IFieldFilters[]>([
    {
      name: 'code',
      label: 'Código',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 q-py-md',
      options: letter_format_codes,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'bank_id',
      label: 'Banco',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 q-py-md',
      options: banks,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 q-py-md',
      options: letter_format_statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 q-py-md',
      prepend_icon: 'mdi-magnify',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código o nombre',
    },
  ])

  const modelFilters = ref<ILetterFormatFilters>({
    code: null,
    bank: null,
    status: null,
    search: null,
    page: 1,
    rows: 10,
  })

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: '',
    description_message: '',
    id: null as number | null,
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    onConfirm: (() => {
      void 0
    }) as () => void,
  })

  const { selected_letter_format } = storeToRefs(useLetterFormatStore('v1'))

  const letterFormatStatus = computed(() =>
    selected_letter_format.value?.status?.id === 1 ? 'inactivar' : 'activar'
  )

  const selectLetterFormat = (row: ILetterFormat) => {
    _selectLetterFormat(row)

    alertModalConfig.value = {
      ...alertModalConfig.value,
      title: `¿Desea ${
        row.status?.id === 1 ? 'inactivar' : 'activar'
      } el formato de carta seleccionado?`,
      description_message: '',
      id: row.id ?? null,
      textBtnConfirm: row.status?.id === 1 ? 'Inactivar' : 'Activar',
      textBtnCancel: 'Cancelar',
      onConfirm: async () => {
        await toggleLetterFormatStatus()
      },
    }

    alertModalRef.value?.openModal()
  }

  const toggleLetterFormatStatus = async () => {
    alertModalRef.value?.closeModal()
    await _toggleLetterFormatStatus()
    updatePage(tableProps.value.pages.currentPage)
  }

  const listAction = async (params = '') => {
    tableProps.value.loading = true
    await _getListAction(params)
    tableProps.value.loading = false
  }

  const handleClear = async () => {
    filters.value.forEach((f) => {
      f.value = null
    })

    modelFilters.value = {
      code: null,
      bank: null,
      status: null,
      search: null,
      page: 1,
      rows: 10,
    }

    _cleanLetterFormatData()

    tableProps.value.rows = []
    tableProps.value.pages = { currentPage: 1, lastPage: 1 }
  }

  const handleUpdateFilters = (data: ILetterFormatFilters) => {
    modelFilters.value = {
      ...data,
      page: 1,
      rows: modelFilters.value.rows,
    }
    const q = formatParamsCustom(modelFilters.value)
    listAction(q ? '&' + q : '')
  }

  const updatePage = (page: number) => {
    modelFilters.value.page = page
    const q = formatParamsCustom(modelFilters.value)
    listAction(q ? '&' + q : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    modelFilters.value = {
      ...modelFilters.value,
      page: 1,
      rows: rowsPerPage,
    }
    const q = formatParamsCustom(modelFilters.value)
    listAction(q ? '&' + q : '')
  }

  const handleOptions = async (option: string, id: number) => {
    if (option === 'edit') {
      router.push({ name: 'ListLetterFormatEdit', params: { id } })
    }

    if (option === 'delete') {
      alertModalConfig.value = {
        ...alertModalConfig.value,
        title: '¿Desea eliminar el formato de carta seleccionado?',
        description_message: '',
        id,
        textBtnConfirm: 'Eliminar',
        textBtnCancel: 'Cerrar',
        onConfirm: async () => {
          const success = await _deleteLetterFormat(id)
          if (success) await listAction()
          await alertModalRef.value?.closeModal()
          alertModalConfig.value.id = null
        },
      }

      alertModalRef.value?.openModal()
    }

    if (option === 'download') {
      const file = await _exportLetterFormat(id)
      if (file) {
        const url = window.URL.createObjectURL(file)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `formato_carta_${id}.pdf`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    }
  }

  const deleteItem = async () => {
    if (alertModalConfig.value.id != null) {
      const success = await _deleteLetterFormat(alertModalConfig.value.id)
      if (success) await listAction()
      await alertModalRef.value.closeModal()
      alertModalConfig.value.id = null
    }
  }

  onMounted(async () => {
    _cleanLetterFormatData()
    await _getResources(keys)
    await _getResources(keysV2, '', 'v2')
  })

  onBeforeMount(async () => {
    await _resetKeys({
      treasury: [...keys.treasury, ...keysV2.treasury],
    })
  })

  watch(letter_format_list, () => {
    tableProps.value.rows = letter_format_list.value
  })

  watch(letter_format_pages, () => {
    tableProps.value.pages = {
      currentPage: letter_format_pages.value.currentPage,
      lastPage: letter_format_pages.value.lastPage,
    }
  })

  return {
    headerProps,
    tableProps,
    filters,
    modelFilters,
    alertModalRef,
    alertModalConfig,
    letterFormatStatus,
    selectLetterFormat,
    toggleLetterFormatStatus,
    handleClear,
    deleteItem,
    handleUpdateFilters,
    handleOptions,
    updatePage,
    updatePerPage,
  }
}

export default useLetterFormatList
