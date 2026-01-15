import {
  ICollectionConceptsResponse,
  IFieldFilters,
} from '@/interfaces/customs'
import {
  useCollectionsConceptsStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMainLoader, useRouteValidator } from '@/composables'

const useCollectionsConceptsList = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const { _getCollectionConceptsList, _deleteCollectionConcepts } =
    useCollectionsConceptsStore('v1')
  const { collections_concepts_pages, collections_concepts_list } = storeToRefs(
    useCollectionsConceptsStore('v1')
  )
  const { account_structures_collection } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const { _getResources } = useResourceManagerStore('v1')

  const keys = {
    treasury: ['account_structures_collection'],
  }

  const headerProps = {
    title: 'Conceptos de recaudo',
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
        label: 'Conceptos de recaudo',
        route: '',
      },
    ],
  }
  const filtersFormat = ref<Record<string, string | number>>({})
  const filtersRef = ref()

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'structure_id',
      label: 'Estructura',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: account_structures_collection,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'structure_name',
      label: 'Nombre estructura',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'structure_use',
      label: 'Uso',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
  ])

  const tableProps = ref({
    title: 'Listado conceptos de recaudos',
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
        name: 'structure_code',
        required: false,
        label: 'Código',
        align: 'left',
        field: 'structure_code',
        sortable: true,
      },
      {
        name: 'type',
        required: false,
        label: 'Tipo',
        align: 'left',
        field: 'type',
        sortable: true,
      },
      {
        name: 'description',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row) => row.status.id,
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
    rows: [] as ICollectionConceptsResponse[],
    pages: collections_concepts_pages,
  })

  const handleFilter = ($filters: {
    'filter[structure_id]': string
    'filter[structure_name]': string
    'filter[structure_use]': string
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

    await _getCollectionConceptsList(filters)
    tableProps.value.loading = false
  }

  const handleClear = () => {
    tableProps.value.rows = []
    filterConfig.value[0].value = null
    filterConfig.value[1].value = null
    filterConfig.value[2].value = null
  }

  const onFilterChange = (filters: Record<string, string | number | null>) => {
    const structureId = filters['filter[structure_id]']
    if (structureId) {
      const selectedStructure = account_structures_collection.value.find(
        (item) => item.value === structureId
      )
      if (selectedStructure && filtersRef.value) {
        filtersRef.value.setFieldValueByName(
          'structure_name',
          selectedStructure.structure
        )
        filtersRef.value.setFieldValueByName(
          'structure_use',
          selectedStructure.purpose
        )
      }
    } else {
      filtersRef.value.setFieldValueByName('structure_name', null)
      filtersRef.value.setFieldValueByName('structure_use', null)
    }
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el concepto de recaudo?',
    id: null as number | null,
  })

  const handleOptions = async (option: string, id: number) => {
    switch (option) {
      case 'edit':
        router.push({ name: 'CollectionsConceptsEdit', params: { id } })
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

  const deleteCollectionConcepts = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return

    const deleted = await _deleteCollectionConcepts(alertModalConfig.value.id)
    if (deleted) {
      const queryString = formatParamsCustom(filtersFormat.value)

      await listAction(queryString ? '&' + queryString : '')
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 500)
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  watch(
    () => collections_concepts_list.value,
    () => {
      tableProps.value.rows = collections_concepts_list.value
    }
  )

  watch(
    () => collections_concepts_pages.value,
    () => {
      tableProps.value.pages = collections_concepts_pages.value
    }
  )

  return {
    headerProps,
    alertModalRef,
    alertModalConfig,
    filterConfig,
    tableProps,
    filtersRef,

    deleteCollectionConcepts,
    handleFilter,
    handleClear,
    onFilterChange,
    updatePerPage,
    updatePage,
    handleOptions,
    validateRouter,
  }
}

export default useCollectionsConceptsList
