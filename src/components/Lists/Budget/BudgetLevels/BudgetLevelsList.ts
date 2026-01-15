//Core
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
//Composables
import {
  useGoToUrl,
  useMainLoader,
  useUtils,
  useRouteValidator,
} from '@/composables'
//Interfaces
import { IBudgetLevelsList } from '@/interfaces/customs/budget/BudgetLevels'
import { IFieldFilters } from '@/interfaces/customs/Filters'
//Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useBudgetLevels } from '@/stores/budget/budget-levels'
import { useBudgetMovements } from '@/stores/budget/budget-movements'

const useBusinessLineList = () => {
  const { openMainLoader } = useMainLoader()
  const { styleColumn, formatParamsCustom, defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  const {
    _getBudgetLevelsList,
    _cleanData,
    _deleteAction,
    _downloadBudgetLevelsReceipt,
  } = useBudgetLevels('v1')
  const { budget_level_list, budget_level_pages, budget_level } = storeToRefs(
    useBudgetLevels('v1')
  )
  const { _setSelectedBudgetLevel, _setSelectedBudgetLevelItem } =
    useBudgetMovements('v1')

  const { budget_classes, budget_levels } = storeToRefs(
    useBudgetResourceStore('v1')
  )

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'level',
      label: 'Nivel',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      options: budget_levels,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'class',
      label: 'Clase',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      options: budget_classes,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[level]': string
    'filter[class]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getBudgetLevelsList(filters)
    tableProps.value.loading = false
  }

  const selectLevel = async (row: IBudgetLevelsList) => {
    selectedLevel.value = row
    _setSelectedBudgetLevel(row.id)
    _setSelectedBudgetLevelItem(row)
  }

  let perPage = 20

  const clearFilters = () => {
    _cleanData()
    _setSelectedBudgetLevel(null)
  }

  const selectedLevel = ref<IBudgetLevelsList | null>(null)

  const deleteRowTable = async (id: number) => {
    if (await _deleteAction(id)) {
      clearFilters()
    }
  }

  const alertModalRef = ref<{
    openModal: () => Promise<void>
    closeModal: () => Promise<void>
  } | null>(null)

  const deleteRow = ref<number | null>(null)

  const openModalDelete = async (id: number) => {
    if (alertModalRef.value) {
      deleteRow.value = id
      await alertModalRef.value.openModal()
    }
  }

  const handleDeleteRow = async () => {
    if (deleteRow.value !== null) {
      await alertModalRef.value?.closeModal()
      await deleteRowTable(deleteRow.value)
      deleteRow.value = null
    }
  }

  const downloadBudgetLevel = async () => {
    openMainLoader(true)
    const values = Object.fromEntries(
      Object.entries({
        'filter[level]': filtersFormat.value['filter[level]'],
        'filter[class]': filtersFormat.value['filter[class]'],
      }).filter(([_, value]) => value !== null)
    )
    const queryString = formatParamsCustom(values)
    await _downloadBudgetLevelsReceipt(queryString)
    openMainLoader(false)
  }

  const tableProps = ref({
    title: 'Listado de niveles presupuestales',
    no_data_title: 'Realice una búsqueda para ver los datos',
    no_data_subtitle: 'Aquí visualizará los resultados de su búsqueda',
    loading: false,
    columns: [
      {
        name: 'check',
        required: true,
        label: '',
        align: 'left',
        field: 'check',
      },
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: (row: IBudgetLevelsList) => row.id,
        sortable: true,
      },
      {
        name: 'level',
        required: true,
        label: 'Nivel',
        align: 'left',
        field: (row: IBudgetLevelsList) => row.level,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: (row: IBudgetLevelsList) => row.description,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'status',
        required: true,
        label: 'Clases',
        align: 'left',
        field: (row: IBudgetLevelsList) => row.class,
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
    rows: [] as IBudgetLevelsList[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
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

  const handleEdit = (row: IBudgetLevelsList) => {
    budget_level.value = row
    goToURL('BudgetLevelsEdit', row.id)
  }

  onMounted(async () => {
    _cleanData()
    tableProps.value.rows = budget_level_list.value
  })

  watch(
    () => budget_level_list.value,
    () => {
      tableProps.value.rows = budget_level_list.value
      tableProps.value.pages = budget_level_pages.value
    }
  )

  return {
    tableProps,
    filterConfig,
    selectedLevel,
    alertModalRef,
    defaultIconsLucide,
    handleFilter,
    updatePage,
    updatePerPage,
    selectLevel,
    deleteRowTable,
    clearFilters,
    openModalDelete,
    handleDeleteRow,
    downloadBudgetLevel,
    handleEdit,
    validateRouter,
  }
}

export default useBusinessLineList
