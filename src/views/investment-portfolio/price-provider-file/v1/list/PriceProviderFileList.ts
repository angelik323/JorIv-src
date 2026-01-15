// Vue
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import router from '@/router'

// Composables & Utils
import { formatParamsCustom, defaultIconsLucide } from '@/utils'
import { useMainLoader } from '@/composables'

// Interfaces
import {
  IFieldFilters,
  IPricesProviderFileItem,
  IPriceProviderFilePages,
  IPriceProviderFile,
} from '@/interfaces/customs'

// Stores
import { usePriceProviderFileStore } from '@/stores'

export const usePriceProviderFile = () => {
  const { _getPriceProviderFileList, _deletePriceProviderFile, _clearData } =
    usePriceProviderFileStore('v1')
  const { openMainLoader } = useMainLoader()
  const alertModalRef = ref()
  const filtersFormat = ref<Record<string, string | number>>({})

  let perPage = 20

  const {
    price_provider_file_list,
    price_provider_file,
    information_receipt_request_delete,
  } = storeToRefs(usePriceProviderFileStore('v1'))

  const headerProps = {
    title: 'Definición archivos de proveedor de precios',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      {
        label: 'Definición archivos de proveedor de precios',
        route: 'PriceProviderFile',
      },
    ],
  }

  const filters = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 q-py-md',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código o coincidencia',
    },
  ])

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IPricesProviderFileItem[]
    pages: IPriceProviderFilePages
  }>({
    title: 'Listado de archivos proveedor precio',
    loading: false,
    columns: [
      { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
      {
        name: 'document_third',
        label: 'ID proveedor precios',
        align: 'left',
        field: 'document_third',
        sortable: true,
      },
      {
        name: 'identification',
        label: 'ID archivo',
        align: 'left',
        field: 'identification',
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
    pages: price_provider_file.value,
  })

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const handleFilter = async ($filters: IPriceProviderFile) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    await _getPriceProviderFileList(filters)
    tableProps.value.loading = false
  }

  const alertModalConfig = ref<{
    title: string
    description: string
    id: number | null
    onConfirm?: () => void
  }>({
    title: 'Advertencia',
    description: '',
    id: null,
  })

  const deleteAttempted = ref(false)

  const openDeleteModal = async (id: number, message: string) => {
    deleteAttempted.value = false

    alertModalConfig.value = {
      title: 'Advertencia',
      description: message,
      id,
      onConfirm: deletePriceProviderFile,
    }

    await alertModalRef.value.openModal()
  }

  const deletePriceProviderFile = async () => {
    openMainLoader(true)

    if (!alertModalConfig.value.id) {
      openMainLoader(false)
      return
    }

    if (deleteAttempted.value) {
      await alertModalRef.value.closeModal()
      openMainLoader(false)
      return
    }

    const deleted = await _deletePriceProviderFile(alertModalConfig.value.id)

    if (deleted) {
      await alertModalRef.value.closeModal()
      router.push({ name: 'PriceProviderFile' })
    } else {
      alertModalConfig.value.description =
        information_receipt_request_delete.value[0]
      deleteAttempted.value = true
    }

    openMainLoader(false)
  }

  const handleOptions = async (option: string, id: number) => {
    switch (option) {
      case 'delete':
        const message =
          '¿Está seguro que desea eliminar el Archivo Proveedor de Precios?'
        await openDeleteModal(id, message)
        break
      default:
        break
    }
  }

  watch(
    () => price_provider_file_list.value,
    () => {
      tableProps.value.rows = price_provider_file_list.value
      tableProps.value.pages.currentPage = price_provider_file.value.currentPage
      tableProps.value.pages.lastPage = price_provider_file.value.lastPage
    },
    { deep: true }
  )

  return {
    headerProps,
    filters,
    tableProps,
    handleFilter,
    handleOptions,
    alertModalRef,
    deletePriceProviderFile,
    alertModalConfig,
    updatePage,
    updatePerPage,
    _clearData,
  }
}
