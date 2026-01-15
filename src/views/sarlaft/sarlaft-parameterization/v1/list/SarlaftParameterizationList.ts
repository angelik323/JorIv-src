// Vue
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces - constants
import { ISarlaftParameterizationList } from '@/interfaces/customs/sarlaft/SarlaftParameterization'
import { IBaseTableProps } from '@/interfaces/global/Table'
import { IResource } from '@/interfaces/global/Resource'
import { SARLAFT_PARAMETERIZATION_OPTIONS } from '@/constants/resources/sarlaft'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useRouteValidator } from '@/composables/useRoutesValidator'
import { useUtils } from '@/composables/useUtils'
import { useRules } from '@/composables/useRules'

// Stores
import { useSarlaftParameterizationStore } from '@/stores/sarlaft/sarlaft-parameterization'
import { useAssetResourceStore } from '@stores/resources-manager/assets'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useSarlaftResourceStore } from '@/stores/resources-manager/sarlaft'

const useSarlaftParameterizationList = () => {
  const {
    only_number_with_max_integers_and_decimals,
    is_required,
    min_value,
    max_value,
  } = useRules()
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _listAction, _updateAction } = useSarlaftParameterizationStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { list_parameterized_cities } = storeToRefs(
    useSarlaftResourceStore('v1')
  )
  const { countries } = storeToRefs(useAssetResourceStore('v1'))

  const editModalRef = ref()
  const sarlftKeys = { sarlaft: ['list_parameterized_cities'] }
  const assetsKeys = { assets: ['countries'] }

  const selectedRow = ref<ISarlaftParameterizationList>({
    id: 0,
    value: '',
    description: '',
    countries: [],
  })

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const headerProps = {
    title: 'Parametrización sarlaft',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Sarlaft',
      },
      {
        label: 'Parametrización sarlaft',
        route: 'SarlaftParameterizationList',
      },
    ],
  }

  const tableProps = ref<IBaseTableProps<ISarlaftParameterizationList>>({
    title: 'Listado de parámetros',
    loading: false,
    columns: [
      {
        name: 'id',
        align: 'center',
        label: '#',
        field: 'id',
      },
      {
        name: 'description',
        align: 'left',
        label: 'Descripción',
        field: 'description',
        sortable: true,
      },
      {
        name: 'value',
        align: 'left',
        label: 'Valor de validación',
        field: 'value',
        sortable: true,
        format: (val: string, row: ISarlaftParameterizationList) =>
          formatParameterValue(val, row.description),
      },
      {
        name: 'actions',
        align: 'left',
        label: 'Acciones',
        field: 'id',
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    await _getResources(sarlftKeys)
    tableProps.value.rows = []

    const response = await _listAction(filters)

    if (response) {
      tableProps.value.rows = response.list
      tableProps.value.pages = response.pages
    }

    setTimeout(() => openMainLoader(false), 1000)
  }

  const openModal = (id: number) => {
    const row = tableProps.value.rows.find((r) => r.id === id)

    selectedRow.value = row
      ? { ...row, countries: list_parameterized_cities.value || [] }
      : { id: 0, value: '', description: '', countries: [] }

    editModalRef.value.openModal(id)
  }

  const onSubmit = async () => {
    if (!selectedRow.value) return

    openMainLoader(true)

    const payload = {
      id: selectedRow.value.id,
      value: selectedRow.value.value,
      countries:
        selectedRow.value?.description.toLocaleLowerCase() === 'paises gafi'
          ? selectedRow.value?.countries
          : [],
    }

    const response = await _updateAction(payload)

    openMainLoader(false)

    if (response) {
      await loadData(filtersFormat.value)
      closeModal()
    }
  }

  const closeModal = () => editModalRef.value.closeModal()

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page

    await loadData(filtersFormat.value)
  }

  const handleUpdatePerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await loadData(filtersFormat.value)
  }

  const handleSelectUpdate = (value: string | number | (string | number)[]) => {
    if (!selectedRow.value) return

    const descriptionLower = selectedRow.value.description.toLowerCase()

    if (descriptionLower === 'paises gafi') {
      const selectedIds = Array.isArray(value) ? value : [value]
      selectedRow.value.countries = countries.value
        .filter((country: IResource) => selectedIds.includes(country.value))
        .map((country: IResource) => ({
          name: country.label,
          code: Number(country.code) || 0,
          selectable_id: country.value as number,
        }))
    } else {
      selectedRow.value.value = String(value)
    }
  }

  const inputConfig = computed(() => {
    if (!selectedRow.value) return {}

    const name = selectedRow.value.description.toLowerCase()

    switch (name) {
      case '% mínimo de registro de socios':
        return {
          component: 'input',
          prefix: '%',
          rules: [
            (val: string) => is_required(val),
            (val: string) =>
              only_number_with_max_integers_and_decimals(val, 2, 2),
          ],
        }

      case 'meses para actualización de datos':
        return {
          component: 'input',
          rules: [
            (val: string) => is_required(val),
            (val: string) => min_value(val, 1),
            (val: string) => max_value(val, 36),
          ],
        }

      case 'valor máximo transacciones individuales':
      case 'valor transacciones múltiples en efectivo':
        return {
          component: 'currency',
          rules: [(val: string) => is_required(val)],
        }

      case 'periodicidad reportes de operaciones acumuladas':
        return {
          value: selectedRow.value.value,
          component: 'select',
          manual_option: SARLAFT_PARAMETERIZATION_OPTIONS,
          rules: [(val: string) => is_required(val)],
        }

      case 'paises gafi':
        return {
          value: selectedRow.value.countries?.map((c) => c.selectable_id) || [],
          component: 'select',
          manual_option: countries.value ?? [],
          multiple: true,
          display_value: 'value',
          show_as_checkbox: true,
          rules: [(val: string) => is_required(val)],
        }

      default:
        return {
          component: 'input',
          rules: [(val: string) => is_required(val)],
        }
    }
  })

  const formatParameterValue = (value: string, description: string): string => {
    const descriptionLower = description.toLowerCase()

    const formatters: Record<string, (val: string) => string> = {
      '% mínimo de registro de socios': (val) => `${val}%`,
      'valor máximo transacciones individuales': (val) =>
        useUtils().formatCurrency(val),
      'valor transacciones múltiples en efectivo': (val) =>
        useUtils().formatCurrency(val),
    }

    const formatter = formatters[descriptionLower]

    return formatter ? formatter(value) : value
  }

  onMounted(async () => {
    await _getResources(assetsKeys)
    await loadData(filtersFormat.value)
  })
  onBeforeUnmount(() => {
    _resetKeys(sarlftKeys)
    _resetKeys(assetsKeys)
  })

  return {
    onSubmit,
    openModal,
    closeModal,
    tableProps,
    headerProps,
    selectedRow,
    inputConfig,
    editModalRef,
    validateRouter,
    handleUpdatePage,
    defaultIconsLucide,
    handleUpdatePerPage,
    handleSelectUpdate,
  }
}

export default useSarlaftParameterizationList
