import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'
import { formatParamsCustom, defaultIcons, defaultIconsLucide } from '@/utils'
import { useMainLoader } from '@/composables'

import {
  useResourceStore,
  useBankBranchesStore,
  useBankContactsStore,
} from '@/stores'
import { IFieldFilters, IBankBranchesList } from '@/interfaces/customs'

const useBankBranchesList = () => {
  const route = useRoute()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const bankingEntitieId = +route.params.id

  const { _getBankBranchesByEntitiesList, _deleteBankBranches } =
    useBankBranchesStore('v1')
  const { _getBankContactsList, _emptyBankContactsList } =
    useBankContactsStore('v1')
  const { status } = storeToRefs(useResourceStore('v1'))
  const { bank_branches_list, bank_branches_pages } = storeToRefs(
    useBankBranchesStore('v1')
  )
  const { cities } = storeToRefs(useResourceStore('v1'))
  let perPage = 20

  const headerProps = {
    breadcrumbs: [
      {
        label: '',
        route: '',
      },
    ],
  }
  const styleColumn = (width: number = 200) => ({
    'white-space': 'pre-wrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-wrap': 'break-word',
  })

  const tableProps = ref({
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
        name: 'code',
        required: false,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre sucursal',
        align: 'left',
        field: 'name',
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'city',
        required: true,
        label: 'Ciudad',
        align: 'left',
        field: (row) => row?.city?.name ?? '',
        sortable: true,
      },
      {
        name: 'address',
        required: true,
        label: 'Dirección',
        align: 'left',
        field: 'address',
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
    ] as QTable['columns'],
    rows: [] as IBankBranchesList[],
    pages: bank_branches_pages,
    rowsPerPage: perPage,
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      value: status.value[0].value,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: [...status.value],
      disable: false,
      prepend_icon: defaultIcons.magnify,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'city',
      label: 'Ciudad',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: [...cities.value],
      disable: false,
      prepend_icon: defaultIcons.magnify,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por nombre o código',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const alertModalRef = ref()

  const searchTriggered = ref(false)

  const filtersFlag = ref('')

  const cleanRows = ref(false)

  const handleFilter = ($filters: {
    'filter[status]': string
    'filter[city]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = { ...$filters }
    let queryString = formatParamsCustom(filtersFormat.value)

    queryString = queryString ? `&${queryString}` : ''

    searchTriggered.value = true
    filtersFlag.value = queryString

    listAction(queryString)
  }

  const listAction = async (filterString: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []

    await _getBankBranchesByEntitiesList(filterString, bankingEntitieId)
    await _getBankContactsList(filterString, bankingEntitieId)
    tableProps.value.loading = false
  }

  const handleClear = () => {
    tableProps.value.rows = []
    _emptyBankContactsList()
  }

  const handleOptions = async (option: string, id: number) => {
    switch (option) {
      case 'edit':
        router.push({ name: 'BankBranchesEdit', params: { id } })
        break
      case 'delete':
        if (id) {
          alertModalConfig.value.id = id
          await alertModalRef.value.openModal()
        }
        break
      default:
        break
    }
  }

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar la sucursal bancaria?',
    id: null as number | null,
  })

  const deleteBankingEntitie = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return
    await _deleteBankBranches(alertModalConfig.value.id)
    await listAction()
    openMainLoader(false)
  }

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

  watch(
    () => bank_branches_list.value,
    () => {
      tableProps.value.rows = bank_branches_list.value
    }
  )

  watch(
    () => bank_branches_pages.value,
    () => {
      tableProps.value.pages = bank_branches_pages.value
    }
  )
  return {
    tableProps,
    headerProps,
    alertModalRef,
    alertModalConfig,
    searchTriggered,
    filtersFlag,
    cleanRows,
    filterConfig,
    deleteBankingEntitie,
    handleFilter,
    handleClear,
    handleOptions,
    updatePage,
    updatePerPage,
  }
}

export default useBankBranchesList
