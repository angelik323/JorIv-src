import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { useRouter } from 'vue-router'
import { useTypesCollectionStore, useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'

//Interfaces
import { IFieldFilters, ITypesCollectionList } from '@interfaces/customs'

import { useMainLoader, useRouteValidator } from '@/composables'

const useTypesCollectionList = () => {
  const router = useRouter()
  const { _getTypeCollection, _deleteTypeCollection } =
    useTypesCollectionStore('v1')

  const { types_collection_list, types_collection_pages } = storeToRefs(
    useTypesCollectionStore('v1')
  )

  const { treasury_type_receive, status } = storeToRefs(useResourceStore('v1'))

  const { _getResourcesTreasuries } = useResourceStore('v1')
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const keys = ['treasury_type_receive']

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el tipo de recaudo?',
    id: null as number | null,
  })
  let perPage = 20

  const headerProps = {
    title: 'Tipos de recaudo',
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
        label: 'Tipos de recaudo',
        route: 'TypesCollectionList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'type_receive',
      label: 'Tipo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: treasury_type_receive,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      multiple: true,
      autocomplete: true,
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: status,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'code',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código del registro',
    },
  ])

  const tableProps = ref({
    title: 'Listado tipos de recaudo',
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
        label: 'Descripcíon',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'type_receive',
        required: true,
        label: 'Tipo',
        align: 'left',
        field: 'type_receive',
        sortable: true,
      },
      {
        name: 'redemption_days',
        required: true,
        label: 'Días de canje',
        align: 'left',
        field: 'redemption_days',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row: ITypesCollectionList) => row.status_id,
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
    rows: [] as ITypesCollectionList[],
    pages: types_collection_pages,
    rowsPerPage: perPage,
  })

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
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

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[code]': number
    'filter[type_receive]': string
    'filter[status.status]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }

    const filtersParse = {
      ...filtersFormat.value,
      ...(filtersFormat.value['filter[type_receive]']
        ? {
            'filter[type_receive]': filtersFormat.value['filter[type_receive]']
              ?.toString()
              .replace(/[\[\]]/g, ''),
          }
        : null),
    }

    const queryString = formatParamsCustom(filtersParse)

    listAction(queryString ? '&' + queryString : '')
  }

  const handleClear = () => {
    tableProps.value.rows = []
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getTypeCollection(filters)
    tableProps.value.loading = false
  }

  const handleOptions = async (option: string, id: number) => {
    switch (option) {
      case 'edit':
        router.push({ name: 'TypesCollectionEdit', params: { id } })
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

  const changeStatus = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return
    await _deleteTypeCollection(alertModalConfig.value.id)
    await listAction()
    openMainLoader(false)
  }

  onMounted(async () => {
    await _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)
  })

  watch(
    () => types_collection_list.value,
    () => {
      tableProps.value.rows = types_collection_list.value
    }
  )

  watch(
    () => types_collection_pages.value,
    () => {
      tableProps.value.pages = types_collection_pages.value
    }
  )

  return {
    headerProps,
    tableProps,
    alertModalConfig,
    alertModalRef,
    defaultIconsLucide,
    filterConfig,
    //
    handleFilter,
    handlerGoTo,
    handleClear,
    _getTypeCollection,
    updatePage,
    updatePerPage,
    handleOptions,
    changeStatus,
    validateRouter,
  }
}

export default useTypesCollectionList
