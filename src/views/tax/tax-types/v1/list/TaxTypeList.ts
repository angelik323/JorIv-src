import { ref } from 'vue'

// Composables
import { useUtils, useGoToUrl, useMainLoader } from '@/composables'

// Interfaces
import { IFieldFilters, ITableProps } from '@/interfaces/customs'
import { ITaxTypeTaxList } from '@/interfaces/customs/tax/TaxType'

// Stores
import { useTaxesTypeStore } from '@/stores/tax/taxes-type'

// Constants
import { default_statuses_boolean } from '@/constants/resources'

const useTaxTypeList = () => {
  const { goToURL } = useGoToUrl()

  const title: string = 'Tipos de impuestos'
  const breadcrumbs = [
    { label: 'Inicio', route: 'HomeView' },
    { label: 'Tributario', route: '' },
    { label: 'Tipos de impuestos', route: 'TaxTypeList' },
  ]
  const filtersConfig = ref<IFieldFilters[]>([
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      class: 'col-12 col-md-6',
      options: default_statuses_boolean,
      value: null,
      autocomplete: true,
      disable: false,
      clean_value: false,
    },
    {
      name: 'name',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      prepend_icon: useUtils().defaultIconsLucide.magnify,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder:
        'Buscar por nombre del impuesto, signo, alcance o coincidencia',
    },
  ])

  const tableProps = ref<ITableProps<ITaxTypeTaxList>>({
    loading: false,
    title: 'Listado de tipos de impuestos',
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
        label: 'Nombre del impuesto',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'sign',
        required: true,
        label: 'Signo',
        align: 'left',
        field: 'sign',
        sortable: true,
      },
      {
        name: 'scope',
        required: true,
        label: 'Alcance',
        align: 'left',
        field: 'scope',
        sortable: true,
      },
      {
        name: 'usage',
        required: true,
        label: 'Uso',
        align: 'left',
        field: 'usage',
        sortable: true,
      },
      {
        name: 'observations',
        required: true,
        label: 'Observaciones',
        align: 'left',
        field: 'observations',
        sortable: true,
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
    customColumns: ['actions', 'sign', 'scope', 'usage', 'status'],
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

  const openAlertModal = async (action: string, row: ITaxTypeTaxList) => {
    alertModalProps.value.id = row.id
    alertModalProps.value.type = action

    const actions: Record<string, () => string> = {
      delete: () => setAlertModalDescriptionDelete(row.name),
      status: () => setAlertModalDescriptionChangeStatus(row),
    }

    alertModalProps.value.description = actions[action]()
    await alertModalRef.value.openModal()
  }

  const closeAlertModal = async () => {
    await alertModalRef.value.closeModal()
  }

  const setAlertModalDescriptionDelete = (tax_type: string) => {
    return `¿Está seguro que desea eliminar el tipo de impuesto ${tax_type} ?`
  }

  const setAlertModalDescriptionChangeStatus = (row: ITaxTypeTaxList) => {
    return `¿Está seguro que desea ${
      !row.is_active ? 'activar' : 'inactivar'
    } el tipo de impuesto  ${row.name} ?`
  }

  const handlerAlertModal = async () => {
    const dispatch: Record<string, () => Promise<boolean>> = {
      delete: () =>
        useTaxesTypeStore('v1')._deleteTaxType(
          alertModalProps.value.id as number
        ),
      status: () =>
        useTaxesTypeStore('v1')._changeStatusTaxType(
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

  const handlerFilter = (
    filters: Record<string, string | number | boolean>
  ) => {
    filtersFormat.value = {
      ...filters,
    }

    const queryString = useUtils().formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '?' + queryString : '')
  }

  const listAction = async (params: string) => {
    tableProps.value.loading = true
    const response = await useTaxesTypeStore('v1')._getTaxesTypes(params)
    tableProps.value.rows = response?.data ?? []
    tableProps.value.pages = response?.pages

    setTimeout(() => {
      tableProps.value.loading = false
    }, 1000)
  }

  const updatePage = async (page: number, rows: number = 20) => {
    const queryString = useUtils().formatParamsCustom({
      ...filtersFormat.value,
      page,
      rows,
    })
    await listAction(queryString ? '?' + queryString : '')
  }

  const handlerClear = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
    tableProps.value.pages = { currentPage: 1, lastPage: 1 }
  }

  return {
    title,
    breadcrumbs,
    defaultIconsLucide: useUtils().defaultIconsLucide,
    filtersConfig,
    tableProps,
    alertModalProps,
    alertModalRef,
    goToURL,
    handlerFilter,
    openAlertModal,
    closeAlertModal,
    handlerAlertModal,
    updatePage,
    handlerClear,
  }
}

export default useTaxTypeList
