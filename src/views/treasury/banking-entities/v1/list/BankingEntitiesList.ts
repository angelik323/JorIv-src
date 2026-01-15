import { useRouter } from 'vue-router'
import { ref, watch, onBeforeMount } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'
import { formatParamsCustom, defaultIcons, defaultIconsLucide } from '@/utils'
import { useMainLoader, useRouteValidator } from '@/composables'

import { useBankingEntitiesStore, useResourceStore } from '@/stores'
import { IFieldFilters, IBankingEntitiesList } from '@/interfaces/customs'

const useBankingEntitiesList = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const { _getBankingEntitiesList, _deleteBankingEntities } =
    useBankingEntitiesStore('v1')
  const { status } = storeToRefs(useResourceStore('v1'))
  const { banking_entities_list, banking_entities_pages } = storeToRefs(
    useBankingEntitiesStore('v1')
  )
  const { validateRouter } = useRouteValidator()
  const { getResources, _getResourcesTreasuries } = useResourceStore('v1')
  let perPage = 20

  const keys = ['cities']
  const keysBankContacts = ['bank_branches', 'days', 'channel', 'available']
  const headerProps = {
    title: 'Entidades bancarias',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Entidades bancarias',
        route: 'BankingEntitiesList',
      },
    ],
  }
  const tableProps = ref({
    title: 'Listado de entidades bancarias',
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
        name: 'description',
        required: true,
        label: 'Nombre',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'nit',
        required: true,
        label: 'NIT',
        align: 'left',
        field: (row: IBankingEntitiesList) => row.nit.nit,
        sortable: true,
      },
      {
        name: 'bank_code',
        required: true,
        label: 'Código bancario',
        align: 'left',
        field: 'bank_code',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row: IBankingEntitiesList) => row.status.name,
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
    rows: [] as IBankingEntitiesList[],
    pages: banking_entities_pages,
    rowsPerPage: perPage,
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      value: status.value[0].value,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      options: [
        ...status.value,
        ...[
          { value: 55, label: 'Por autorizar' },
          { value: 10, label: 'Rechazado' },
        ],
      ],
      disable: false,
      prepend_icon: defaultIcons.magnify,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código del registro',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const alertModalRef = ref()

  const handleFilter = ($filters: {
    'filter[status]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getBankingEntitiesList(filters)
    tableProps.value.loading = false
  }

  const handleClear = () => {
    tableProps.value.rows = []
  }

  const handleOptions = async (option: string, id: number) => {
    switch (option) {
      case 'view':
        router.push({ name: 'BankingEntitiesView', params: { id } })
        break
      case 'edit':
        router.push({ name: 'BankingEntitiesEdit', params: { id } })
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
    description: '¿Desea eliminar la entidad bancaria?',
    id: null as number | null,
  })

  const deleteBankingEntitie = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return
    await _deleteBankingEntities(alertModalConfig.value.id)
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

  onBeforeMount(async () => {
    openMainLoader(true)
    await getResources(`keys[]=${keys.join('&keys[]=')}`)
    await _getResourcesTreasuries(`keys[]=${keysBankContacts.join('&keys[]=')}`)

    openMainLoader(false)
  })

  watch(
    () => banking_entities_list.value,
    () => {
      tableProps.value.rows = banking_entities_list.value
    }
  )

  watch(
    () => banking_entities_pages.value,
    () => {
      tableProps.value.pages = banking_entities_pages.value
    }
  )
  return {
    tableProps,
    headerProps,
    alertModalRef,
    alertModalConfig,
    filterConfig,

    deleteBankingEntitie,

    handleFilter,
    handleClear,
    handleOptions,
    updatePage,
    updatePerPage,
    validateRouter,
  }
}

export default useBankingEntitiesList
