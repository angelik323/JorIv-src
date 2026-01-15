import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useUtils, useGoToUrl, useMainLoader } from '@/composables'

// Interfaces
import { IFieldFilters, ITableProps } from '@/interfaces/customs'
import { ITaxesAndWithholdingsList } from '@/interfaces/customs/tax/TaxesAndWithholdings'

// Stores
import { useTaxesAndWithholdingsStore } from '@/stores/tax/taxes-and-withholdings'
import { useTaxResourceStore } from '@/stores/resources-manager/tax'
import { useResourceManagerStore } from '@/stores'

// Constants
import { default_statuses_boolean } from '@/constants/resources'

const useTaxesAndWithholdingsList = () => {
  const { dian_tax_types } = storeToRefs(useTaxResourceStore('v1'))
  const { goToURL } = useGoToUrl()

  const keys = {
    tax: ['dian_tax_types'],
  }

  const title: string = 'Impuestos y retenciones'
  const breadcrumbs = [
    { label: 'Inicio', route: 'HomeView' },
    { label: 'Tributario', route: '' },
    { label: 'Impuestos y retenciones', route: 'TaxesAndWithholdingsList' },
  ]
  const filtersConfig = computed<IFieldFilters[]>(() => [
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      class: 'col-12 col-md-4',
      options: default_statuses_boolean,
      value: null,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'status',
      label: 'Tipo impuesto DIAN',
      type: 'q-select',
      class: 'col-12 col-md-4',
      options: dian_tax_types,
      value: null,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'name',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      prepend_icon: useUtils().defaultIconsLucide.magnify,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por nombre',
    },
  ])

  const tableProps = ref<ITableProps<ITaxesAndWithholdingsList>>({
    loading: false,
    title: 'Listado de impuestos y retenciones',
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'dian_type',
        required: true,
        label: 'Tipo de impuesto DIAN',
        align: 'left',
        field: (row) => row.dian_type?.name,
        sortable: true,
      },
      {
        name: 'tax_type',
        required: true,
        label: 'Tipo de impuesto',
        align: 'left',
        field: (row) => row.tax_type?.code,
        sortable: true,
      },
      {
        name: 'usage',
        required: true,
        label: 'Uso',
        align: 'left',
        field: (row) => row.tax_type?.usage,
        sortable: true,
      },
      {
        name: 'ambit',
        required: true,
        label: 'Ámbito',
        align: 'left',
        field: 'ambit',
        sortable: true,
      },
      {
        name: 'manage_periods',
        required: true,
        label: 'Maneja vigencia',
        align: 'left',
        field: 'manage_periods',
        sortable: true,
        format: (val) => (val ? 'Si' : 'No'),
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ],
    rows: [],
    customColumns: ['actions', 'status'],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const filtersFormat = ref<Record<string, string | number | boolean>>({})

  const alertModalProps = ref({
    title: 'Advertencia',
    description: '',
    id: null as number | null,
    type: '',
  })

  const alertModalRef = ref()

  const openAlertModal = async (
    action: string,
    row: ITaxesAndWithholdingsList
  ) => {
    alertModalProps.value.id = row.id
    alertModalProps.value.type = action

    const actions: Record<string, () => string> = {
      delete: () => setAlertModalDescriptionDelete(row.name),
    }

    alertModalProps.value.description = actions[action]()
    await alertModalRef.value.openModal()
  }

  const closeAlertModal = async () => {
    await alertModalRef.value.closeModal()
  }

  const setAlertModalDescriptionDelete = (tax_number: string) => {
    return `¿Desea eliminar el registro de impuestos y retenciones número ${tax_number}?`
  }

  const handleAlertModal = async () => {
    const dispatch: Record<string, () => Promise<boolean>> = {
      delete: () =>
        useTaxesAndWithholdingsStore('v1')._deleteTaxAndWithholding(
          alertModalProps.value.id as number
        ),
    }

    useMainLoader().openMainLoader(true)
    const success = await dispatch[alertModalProps.value.type]()
    useMainLoader().openMainLoader(false)
    if (success) {
      closeAlertModal()
      listAction('')
    }
  }

  const handleFilter = (filters: Record<string, string | number | boolean>) => {
    filtersFormat.value = {
      ...filters,
    }

    const queryString = useUtils().formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '?' + queryString : '')
  }

  const listAction = async (params: string) => {
    tableProps.value.loading = true
    const response = await useTaxesAndWithholdingsStore(
      'v1'
    )._getTaxesAndWithholdings(params)
    tableProps.value.rows = response?.data ?? []
    tableProps.value.pages = response?.pages

    tableProps.value.loading = false
  }

  const updatePerPage = async (rowsPerPage: number) => {
    const queryString = useUtils().formatParamsCustom({
      ...filtersFormat.value,
      page: 1,
      rows: rowsPerPage,
    })

    await listAction(queryString ? '?' + queryString : '')
  }

  const updatePage = async (page: number, rows: number = 20) => {
    const queryString = useUtils().formatParamsCustom({
      ...filtersFormat.value,
      page,
      rows,
    })
    await listAction(queryString ? '?' + queryString : '')
  }

  const handleClear = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
    tableProps.value.pages = { currentPage: 1, lastPage: 1 }
  }

  onMounted(() => {
    useResourceManagerStore('v1')._getResources(keys)
  })

  return {
    title,
    breadcrumbs,
    defaultIconsLucide: useUtils().defaultIconsLucide,
    filtersConfig,
    tableProps,
    alertModalProps,
    alertModalRef,
    goToURL,
    handleFilter,
    openAlertModal,
    closeAlertModal,
    handleAlertModal,
    updatePage,
    handleClear,
    updatePerPage,
  }
}

export default useTaxesAndWithholdingsList
