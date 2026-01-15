// Vue
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'
import { IIndividualRemoteAuthorizationManagementList } from '@/interfaces/customs/sarlaft/IndividualRemoteAuthorizationManagement'

// Composables
import { useUtils } from '@/composables/useUtils'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useRules } from '@/composables/useRules'

// Stores
import { useIndividualRemoteAuthorizationManagementStore } from '@/stores/sarlaft/individual-remote-authorization-management'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useSarlaftResourceStore } from '@/stores/resources-manager/sarlaft'

const useIndividualRemoteAuthorizationManagement = () => {
  const { openMainLoader } = useMainLoader()

  const { _getFindingList, _updateFindingList } =
    useIndividualRemoteAuthorizationManagementStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { finding_list_origin_modules } = storeToRefs(
    useSarlaftResourceStore('v1')
  )
  const filtersFormat = ref<Record<string, string | number | boolean>>({
    page: 1,
    rows: 20,
  })

  const isQueryOwnListEmpty = ref(true)
  const showState = ref(0)
  const selectedRows = ref<IIndividualRemoteAuthorizationManagementList[]>([])
  const formMode = ref<'authorize' | 'reject'>('authorize')
  const formContent = ref({ justification: '' })
  const alertModalRef = ref()
  const purposeRef = ref()

  const createdFromDate = ref<string>('')
  const createdToDate = ref<string>('')

  const headerProps = {
    title: 'Gestión autorización remota individual',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Sarlaft',
      },
      {
        label: 'Gestión autorización remota individual',
        route: 'IndividualRemoteAuthorizationManagement',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'id',
      label: 'Número de autorización',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      max_values: 10,
      rules: [
        (val: string) => !val || useRules().only_number(val),
        (val) => useRules().max_length(val, 10),
      ],
    },
    {
      name: 'name',
      label: 'Nombre',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      max_values: 100,
      rules: [(val) => useRules().max_length(val, 100)],
    },
    {
      name: 'request_date',
      label: 'Fecha de solicitud',
      type: 'q-date',
      value: '',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      option_calendar: ($event) => useUtils().isDateUpToToday($event),
    },
    {
      name: 'origin_module',
      label: 'Módulo de origen',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: finding_list_origin_modules,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'created_from',
      label: 'Creación de registro desde',
      type: 'q-date',
      value: '',
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      option_calendar: ($event: string) => useUtils().isDateUpToToday($event),
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
      name: 'created_to',
      label: 'Creación de registro hasta',
      type: 'q-date',
      value: '',
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      option_calendar: ($event: string) => useUtils().isDateUpToToday($event),
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
  ])
  const tableRequestRef = ref()
  const tableProps = ref<
    IBaseTableProps<IIndividualRemoteAuthorizationManagementList>
  >({
    title: 'Listado de solicitudes',
    loading: false,
    columns: [
      {
        name: 'id',
        align: 'center',
        label: '#',
        field: 'id',
      },
      {
        name: 'id',
        align: 'center',
        label: 'No. Autorización',
        field: 'id',
      },
      {
        name: 'identification_number',
        align: 'center',
        label: 'Número de identificación',
        field: 'identification_number',
      },
      {
        name: 'name',
        align: 'center',
        label: 'Nombre',
        field: 'name',
      },
      {
        name: 'match_level_id',
        align: 'center',
        label: 'Nivel de coincidencia',
        field: 'match_level_id',
      },
      {
        name: 'watchlist',
        align: 'center',
        label: 'Sistema de coincidencia',
        field: 'watchlist',
      },
      {
        name: 'own_list',
        align: 'center',
        label: 'Listas propias',
        field: 'own_list',
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const getFindingList = async (
    params: Record<string, string | number | boolean>
  ) => {
    openMainLoader(true)

    const response = await _getFindingList(params)

    if (response) {
      tableProps.value.rows = response?.list ?? []
      tableProps.value.pages = response?.pages
    }

    isQueryOwnListEmpty.value = tableProps.value.rows?.length === 0
    showState.value = filtersFormat.value ? 1 : 0

    openMainLoader(false)
  }

  const handleFilter = async ($filtersValue: {
    'filter[identification_number]': string
    'filter[name]': string
    'filter[request_date]': string
    'filter[origin_module]': string
    'filter[created_from]': string
    'filter[created_to]': string
  }) => {
    filtersFormat.value = {
      ...$filtersValue,
      paginate: true,
    }
    await getFindingList(filtersFormat.value)
  }
  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
    isQueryOwnListEmpty.value = true
    showState.value = 0
  }

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page

    await getFindingList(filtersFormat.value)
  }
  const handleUpdatePerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await getFindingList(filtersFormat.value)
  }

  const updateSelected = (
    value: IIndividualRemoteAuthorizationManagementList[]
  ) => {
    selectedRows.value = value
  }
  const openRejectForm = () => {
    if (!selectedRows.value.length) return
    formMode.value = 'reject'
    alertModalRef.value.openModal()
  }
  const openAuthorizeForm = () => {
    if (!selectedRows.value.length) return

    formMode.value = 'authorize'
    alertModalRef.value.openModal()
  }

  const updateAction = async () => {
    const payload = {
      justification: formContent.value.justification,
      action: formMode.value === 'authorize',
    }

    const failedIds: number[] = []
    for (const item of selectedRows.value) {
      const result = await _updateFindingList(item.id, payload)

      if (!result.success) {
        failedIds.push(item.id)
      }
    }

    await getFindingList(filtersFormat.value)

    selectedRows.value = tableProps.value.rows.filter((row) =>
      failedIds.includes(row.id)
    )

    if (selectedRows.value.length === 0) {
      formContent.value.justification = ''
      alertModalRef.value.closeModal()
      tableRequestRef.value.clearSelection()
    }
  }

  const handleSubmit = async () => {
    if (!selectedRows.value.length) return

    const isValid = await purposeRef.value?.validate()
    if (!isValid) return

    openMainLoader(true)
    await updateAction()
    openMainLoader(false)
  }

  onMounted(async () => {
    await _getResources({ sarlaft: ['finding_list_origin_modules'] })
  })
  onBeforeUnmount(() =>
    _resetKeys({ sarlaft: ['finding_list_origin_modules'] })
  )

  return {
    // config
    headerProps,
    filterConfig,
    tableRequestRef,
    tableProps,
    isQueryOwnListEmpty,
    showState,
    selectedRows,
    formMode,
    formContent,
    alertModalRef,
    purposeRef,
    handleFilter,
    handleClearFilters,
    handleUpdatePage,
    handleUpdatePerPage,
    updateSelected,
    openRejectForm,
    openAuthorizeForm,
    handleSubmit,
  }
}
export default useIndividualRemoteAuthorizationManagement
