// Vue - Quasar
import { QTable } from 'quasar'
import { ref, computed } from 'vue'

// Interfaces
import { IConsultIndividualListPreventionList } from '@/interfaces/customs/sarlaft/ConsultIndividualListPrevention'
import { IFieldFilters } from '@/interfaces/customs/Filters'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useRules } from '@/composables/useRules'

// Stores
import { useConsultIndividualListPreventionListStore } from '@/stores/sarlaft/consult-individual-list-prevention'

const useConsultIndividualListPreventionList = () => {
  const { only_alphanumeric, only_letters } = useRules()
  const { openMainLoader } = useMainLoader()

  const { _listAction } = useConsultIndividualListPreventionListStore('v1')

  const filtersFormat = ref<Record<string, string | number>>({})
  const isTableEmpty = ref(true)
  const showState = ref(0)

  const disableOption = computed(() => {
    return (
      !filtersFormat.value.identification_number && !filtersFormat.value.name
    )
  })

  const headerProps = {
    title: 'Consulta individual en listas cautelares',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Sarlaft',
      },
      {
        label: 'Consulta individual en listas cautelares',
        route: 'ConsultIndividualListPreventionList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'identification_number',
      label: 'Número de identificación',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      rules: [(val: string) => only_alphanumeric(val)],
    },
    {
      name: 'name',
      label: 'Nombre del tercero/cliente',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      rules: [(val: string) => only_letters(val)],
    },
  ])

  const tableProps = ref({
    title: 'Listado de la consulta individual en listas cautelares',
    loading: false,
    columns: [
      {
        name: 'id',
        align: 'center',
        label: '#',
        field: 'id',
      },
      {
        name: 'authorization_number',
        align: 'left',
        label: 'No. Autorización',
        field: (row) => row.authorization_number ?? '—',
        sortable: true,
      },
      {
        name: 'identification_number',
        align: 'left',
        label: 'Número de identificación',
        field: (row) => row.identification_number ?? '—',
        sortable: true,
      },
      {
        name: 'name',
        align: 'left',
        label: 'Nombre',
        field: (row) => row.name ?? '—',
        sortable: true,
      },
      {
        name: 'level_match_id',
        align: 'center',
        label: 'Nivel de coincidencia',
        field: (row) => Number(row.level_match_id ?? 1),
      },
      {
        name: 'matching_system',
        align: 'left',
        label: 'Sistema de coincidencia',
        field: (row) => row.matching_system ?? '—',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IConsultIndividualListPreventionList[],
  })

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)

    const response = await _listAction(filters)

    if (response) {
      tableProps.value.rows = response.map((item, index) => ({
        ...item,
        id: index + 1,
      }))
    }

    isTableEmpty.value = !tableProps.value.rows.length
    showState.value = filters ? 1 : 0

    openMainLoader(false)
  }

  const handleFilter = async () => {
    await loadData(filtersFormat.value)
  }

  const handleClearFilters = async () => {
    showState.value = 0
    isTableEmpty.value = true
    tableProps.value.rows = []
  }

  const handleUpdateValues = (values: {
    'filter[identification_number]': string
    'filter[name]': string
  }) => {
    const identification_number = values['filter[identification_number]']
    const name = values['filter[name]']

    filtersFormat.value = {
      identification_number,
      name,
    }
  }

  return {
    showState,
    tableProps,
    headerProps,
    filterConfig,
    disableOption,
    handleFilter,
    isTableEmpty,
    handleClearFilters,
    handleUpdateValues,
  }
}
export default useConsultIndividualListPreventionList
