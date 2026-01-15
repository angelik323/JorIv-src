import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { formatParamsCustom } from '@/utils'
import {
  IFieldFilters,
  IEquivalentVaucherList,
  FilterFields,
} from '@/interfaces/customs'
import {
  useAccountingResourceStore,
  useEquivalentVaucherStore,
  useFiltersStore,
  useResourceManagerStore,
} from '@/stores'
import { useRouteValidator } from '@/composables'

const useEquivalentVaucherList = () => {
  const { validateRouter } = useRouteValidator()
  const { setFiltersState } = useFiltersStore()
  const { sub_receipt_types_voucher } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getListEquivalentVaucher, _deleteEquivalentVaucher } =
    useEquivalentVaucherStore('v1')
  const { equivalent_vaucher_list, equivalent_vaucher_pages } = storeToRefs(
    useEquivalentVaucherStore('v1')
  )

  const keysSubReceiptTypes = { accounting: ['sub_receipt_types'] }

  const router = useRouter()
  let perPage = 20

  const tableProps = ref({
    title: 'Listado de subtipo comprobantes equivalentes',
    loading: false,
    columns: [
      {
        name: 'index',
        label: '#',
        align: 'left',
        field: (row) => row.rowIndex,
        sortable: true,
      },
      {
        name: 'subtype_receipt_origin',
        label: 'Subtipo comprobante origen',
        align: 'left',
        field: (row) =>
          row.source_voucher_sub_type
            ? `${row.source_voucher_sub_type.code} - ${row.source_voucher_sub_type.name}`
            : 'N/A',
        sortable: true,
      },
      {
        name: 'equivalent_voucher_subtype',
        label: 'Subtipo comprobante equivalente',
        align: 'left',
        field: (row) =>
          row.equivalent_voucher_sub_type
            ? `${row.equivalent_voucher_sub_type.code} - ${row.equivalent_voucher_sub_type.name}`
            : 'N/A',
        sortable: true,
      },
      {
        name: 'tax_receipt_subtype',
        label: 'Subtipo comprobante fiscal',
        align: 'left',
        field: (row) =>
          row.fiscal_voucher_sub_type
            ? `${row.fiscal_voucher_sub_type.code} - ${row.fiscal_voucher_sub_type.name}`
            : 'N/A',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: (row) => row,
      },
    ] as QTable['columns'],
    rows: [] as IEquivalentVaucherList[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const headerProps = {
    title: 'Comprobantes equivalentes',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      { label: 'Comprobantes equivalentes', route: '' },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'source_voucher_sub_type',
      label: 'Subtipo comprobante origen',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-4',
      disable: false,
      options: sub_receipt_types_voucher,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'equivalent_voucher_sub_type',
      label: 'Subtipo comprobante equivalente',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-4',
      disable: false,
      options: sub_receipt_types_voucher,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'fiscal_voucher_sub_type',
      label: 'Subtipo comprobante fiscal',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-4',
      options: sub_receipt_types_voucher,
      disable: false,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
  ])

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: '¿Desea eliminar el comprobante equivalente seleccionado?',
    description_message: '',
    id: null as number | null,
  })

  const filtersFormat = ref<FilterFields>({})

  const handleFilter = ($filters: FilterFields) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: perPage,
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    filtersFormat.value.rows = perPage
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value.rows = perPage
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getListEquivalentVaucher(filters)
    tableProps.value.loading = false
  }

  const handleGoTo = () => {
    router.push({ name: 'EquivalentVaucherCreate' })
  }

  const handleClear = () => {
    filtersFormat.value = { page: 1, rows: perPage }
    tableProps.value.rows = []
  }

  const handleDeleteItem = async (id: number) => {
    alertModalConfig.value.id = id
    await alertModalRef.value.openModal()
  }

  const deleteEquivalentVaucher = async () => {
    if (alertModalConfig.value.id != null) {
      const success = await _deleteEquivalentVaucher(alertModalConfig.value.id)
      if (success) {
        await listAction()
      }
      await alertModalRef.value.closeModal()
      alertModalConfig.value.id = null
    }
  }

  const showImportButton = computed(() => tableProps.value.rows.length > 0)

  onMounted(async () => {
    _getResources(keysSubReceiptTypes)
    setFiltersState(filterConfig.value)
  })

  watch(equivalent_vaucher_list, () => {
    tableProps.value.rows = equivalent_vaucher_list.value
  })

  watch(equivalent_vaucher_list, () => {
    const currentPage = equivalent_vaucher_pages.value.currentPage || 1
    const rowsPerPage = filtersFormat.value.rows || 20
    const totalItems = equivalent_vaucher_pages.value.total || 0
    const startIndex = (currentPage - 1) * rowsPerPage

    tableProps.value.rows = equivalent_vaucher_list.value.map((row, i) => ({
      ...row,
      rowIndex: totalItems - startIndex - i,
    }))
  })

  watch(equivalent_vaucher_pages, () => {
    tableProps.value.pages = equivalent_vaucher_pages.value
  })

  onBeforeMount(async () => {
    await _resetKeys(keysSubReceiptTypes)
  })

  return {
    headerProps,
    tableProps,
    filterConfig,
    alertModalRef,
    alertModalConfig,
    handleClear,
    handleFilter,
    handleGoTo,
    updatePage,
    showImportButton,
    updatePerPage,
    deleteEquivalentVaucher,
    handleDeleteItem,
    validateRouter,
  }
}

export default useEquivalentVaucherList
