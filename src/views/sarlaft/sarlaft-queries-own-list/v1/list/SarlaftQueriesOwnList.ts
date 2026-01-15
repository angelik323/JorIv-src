// Vue
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'
import { ISarlaftQueriesOwnList } from '@/interfaces/customs/sarlaft/QueriesOwnList'

// Composables
import { useUtils } from '@/composables/useUtils'
import { useRules } from '@/composables/useRules'
import { useAlert } from '@/composables/useAlert'

// Stores
import { useSarlaftQueriesOwnListStore } from '@/stores/sarlaft/sarlaft-queries-own-list'
import { useSarlaftResourceStore } from '@/stores/resources-manager/sarlaft'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useMainLoader } from '@/composables'

const useSarlaftQueriesOwnList = () => {
  const { defaultIconsLucide, isDateUpToToday } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const { _getConsultOwnList, _getAllOwnList } =
    useSarlaftQueriesOwnListStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { list_type_identification } = storeToRefs(
    useSarlaftResourceStore('v1')
  )

  const filtersFormat = ref<
    Record<string, string | number | boolean | Array<string>>
  >({
    page: 1,
    rows: 20,
  })

  const isQueryOwnListEmpty = ref(true)
  const showState = ref(0)
  const isSearching = ref(false)

  const selectedLists = ref<Array<string> | null>(null)
  const identificationNumber = ref<string | null>(null)
  const thirdPartyName = ref<string | null>(null)

  const createdFromDate = ref<string>('')
  const createdToDate = ref<string>('')
  const headerProps = {
    title: 'Consultas listas propias',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Sarlaft',
      },
      {
        label: 'Consultas listas propias',
        route: 'SarlaftQueriesOwnList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'lists',
      label: 'Consultar por lista',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: [],
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      multiple: true,
      separate_values: true,
      autocomplete: true,
      custom_selection_label: 'name',
      display_value: 'id',
      onChange: (value: Array<string>) => {
        selectedLists.value = value && value.length > 0 ? value : null
      },
    },
    {
      name: 'type_identification',
      label: 'Tipo de identificación',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: list_type_identification,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione una opción',
      autocomplete: true,
    },
    {
      name: 'date_exact',
      label: 'Fecha de registro',
      type: 'q-date',
      value: '',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      option_calendar: ($event) => isDateUpToToday($event),
    },
    {
      name: 'date_from',
      label: 'Creación de registro desde',
      type: 'q-date',
      value: '',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      option_calendar: ($event) => isDateUpToToday($event),
      onChange: (value: string) => {
        createdFromDate.value = value
      },
      rules: [
        (val: string) => {
          if (createdToDate.value)
            return useRules().is_required(
              val,
              'La fecha inicial es obligatoria cuando se selecciona una fecha final'
            )
          return true
        },
        (val: string) => {
          if (!val || !createdToDate.value) return true
          return (
            val <= createdToDate.value ||
            `La fecha inicial no debe ser posterior a ${createdToDate.value}`
          )
        },
      ],
    },
    {
      name: 'date_to',
      label: 'Creación de registro hasta',
      type: 'q-date',
      value: '',
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      option_calendar: ($event) => isDateUpToToday($event),
      onChange: (value: string) => {
        createdToDate.value = value
      },
      rules: [
        (val: string) => {
          if (createdFromDate.value)
            return useRules().is_required(
              val,
              'La fecha final es obligatoria cuando se selecciona una fecha inicial'
            )
          return true
        },
        (val: string) => {
          if (!val || !createdFromDate.value) return true
          return useRules().date_after_or_equal_to_specific_date(
            val,
            createdFromDate.value
          )
        },
      ],
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      prepend_icon: defaultIconsLucide.magnify,
      placeholder: 'Buscar por número de identificación / nombre de tercero',
      onChange: (value: string) => {
        if (value && value.trim()) {
          const trimmedValue = value.trim()
          if (/^\d+$/.test(trimmedValue)) {
            identificationNumber.value = trimmedValue
            thirdPartyName.value = null
          } else {
            thirdPartyName.value = trimmedValue
            identificationNumber.value = null
          }
        } else {
          identificationNumber.value = null
          thirdPartyName.value = null
        }
      },
    },
  ])

  const tableProps = ref<IBaseTableProps<ISarlaftQueriesOwnList>>({
    title: '',
    loading: false,
    columns: [
      {
        name: 'id',
        align: 'center',
        label: '#',
        field: 'id',
      },
      {
        name: 'type_identification',
        align: 'left',
        label: 'Tipo de identificación',
        field: 'type_identification',
      },
      {
        name: 'identification_number',
        align: 'left',
        label: 'Número de identificación',
        field: 'identification_number',
      },
      {
        name: 'name',
        align: 'left',
        label: 'Nombre',
        field: 'name',
      },
      {
        name: 'list',
        align: 'left',
        label: 'Lista',
        field: 'list',
      },
      {
        name: 'registration date',
        align: 'left',
        label: 'Fecha',
        field: 'registration date',
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const isSearchButtonDisabled = computed(() => {
    const hasListSelected =
      selectedLists.value && selectedLists.value.length > 0

    const hasValidIdentification =
      identificationNumber.value &&
      /^\d+$/.test(identificationNumber.value) &&
      identificationNumber.value.trim().length >= 5

    const hasValidName =
      thirdPartyName.value &&
      /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/.test(thirdPartyName.value) &&
      thirdPartyName.value.trim().length >= 3

    return (
      !(hasListSelected || hasValidIdentification || hasValidName) ||
      isSearching.value
    )
  })

  const getConsultOwnList = async (params: object) => {
    isSearching.value = true
    openMainLoader(true)

    const response = await _getConsultOwnList(params)

    if (response) {
      tableProps.value.rows = response?.data ?? []
      tableProps.value.pages = response?.pages
    }

    isQueryOwnListEmpty.value = tableProps.value.rows?.length === 0
    showState.value = filtersFormat.value ? 1 : 0

    openMainLoader(false)
    isSearching.value = false
  }

  const handleFilter = async ($filtersValue: {
    'filter[lists]': Array<string>
    'filter[type_identification]': string
    'filter[date_exact]': string
    'filter[date_from]': string
    'filter[date_to]': string
    'filter[search]': string
  }) => {
    if (isSearchButtonDisabled.value) {
      showAlert(
        'Por favor, ingrese al menos un criterio de búsqueda para realizar la consulta.',
        'warning',
        undefined,
        3000
      )
      return
    }

    filtersFormat.value = {
      ...$filtersValue,
      paginate: true,
    }
    await getConsultOwnList(filtersFormat.value)
  }

  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
    isQueryOwnListEmpty.value = true
    showState.value = 0

    selectedLists.value = null
    identificationNumber.value = null
    thirdPartyName.value = null
  }

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page

    await getConsultOwnList(filtersFormat.value)
  }

  const handleUpdatePerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await getConsultOwnList(filtersFormat.value)
  }

  const getQueryByOwnList = async () => {
    await _getResources({ sarlaft: ['list_type_identification'] })

    const response = (await _getAllOwnList()) as {
      data: ISarlaftQueriesOwnList[]
      pages: { currentPage: number; lastPage: number }
    }
    const idx = filterConfig.value.findIndex((f) => f.name === 'lists')
    if (idx !== -1) {
      filterConfig.value[idx].options = response?.data ?? []
    }
  }

  onMounted(async () => await getQueryByOwnList())

  onBeforeUnmount(() => _resetKeys({ sarlaft: ['list_type_identification'] }))

  return {
    // config
    headerProps,
    filterConfig,
    tableProps,
    isQueryOwnListEmpty,
    showState,
    isSearchButtonDisabled,
    isSearching,

    handleFilter,
    handleClearFilters,
    handleUpdatePage,
    handleUpdatePerPage,
  }
}

export default useSarlaftQueriesOwnList
