// Vue - pinia
import { ref, watch, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { QTable } from 'quasar'
import { IFieldFilters } from '@/interfaces/customs'
import {
  IMovementCodesBasicDataForm,
  IMovementCodesBasicDataResponse,
  IMovementCodesDestinationResponse,
} from '@/interfaces/customs/budget/MovementCodes'

import { WriteActionType } from '@/interfaces/global'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useBudgetMovementCodesStore } from '@/stores/budget/movement-codes'

export const useBudgetMovementCodesList = () => {
  const {
    _getListAction,
    _getListActionDestination,
    _cleanMovementCodesData,
    _cleanDestinationData,
    _createDestination,
    _updateDestination,
    _deleteMovementCodes,
    _downloadMovementCodes,
    _downloadDestination,
    _setDataDestinationForm,
  } = useBudgetMovementCodesStore('v1')
  const {
    headerPropsDefault,
    data_movement_codes_list,
    data_movement_codes_pages,
    data_movement_codes_destination_list,
    data_movement_codes_destination_pages,
    data_destination_form,
  } = storeToRefs(useBudgetMovementCodesStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()

  const { code_movements, code_movements_source_destination_modules } =
    storeToRefs(useBudgetResourceStore('v1'))

  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide, formatParamsCustom } = useUtils()

  const keys = {
    budget: ['code_movements', 'code_movements_source_destination_modules'],
  }

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
    cancelText: 'Cancelar',
    confirmText: 'Eliminar',
  })

  const headerProperties = headerPropsDefault.value
  const openFormModal = ref(false)
  const formAction = ref<WriteActionType>('create')
  const managerMovementCodeModal = ref()
  const formData = ref<IMovementCodesDestinationResponse>({
    module: '',
    source_id: null,
    movement_source_code: '',
    movement_source_description: '',
    destination_id: null,
    movement_destination_code: '',
    movement_destination_description: '',
  })
  const formRef = ref()

  let perPage = 20

  const filterFields = ref<IFieldFilters[]>([
    {
      name: 'movement_code',
      label: 'Código',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: code_movements,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      prepend_icon: useUtils().defaultIconsLucide.magnify,
      disable: false,
      autocomplete: false,
      clean_value: true,
      placeholder: 'Buscar por código o descripción',
    },
  ])

  const filterConfigDestination = ref<IFieldFilters[]>([
    {
      name: 'module',
      label: 'Módulo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: code_movements_source_destination_modules,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      prepend_icon: useUtils().defaultIconsLucide.magnify,
      disable: false,
      autocomplete: false,
      clean_value: true,
      placeholder: 'Buscar por código o descripción',
    },
  ])

  const tableProperties = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IMovementCodesBasicDataResponse[]
    pages: {
      currentPage: number
      lastPage: number
    }
  }>({
    title: 'Listado de códigos de movimiento',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'movement_code',
        required: true,
        label: 'Código',
        align: 'left',
        field: (row: IMovementCodesBasicDataForm) =>
          `${row.movement_code ?? ''}`,
        sortable: true,
      },
      {
        name: 'movement_description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: (row: IMovementCodesBasicDataForm) =>
          `${row.movement_description ?? ''}`,
        sortable: true,
      },
      {
        name: 'validity',
        required: true,
        label: 'Vigencia',
        align: 'left',
        field: (row: IMovementCodesBasicDataForm) => `${row.validity ?? ''}`,
        sortable: true,
      },
      {
        name: 'is_derived_contract',
        required: true,
        label: '¿Contratación derivada?',
        align: 'left',
        field: (row: IMovementCodesBasicDataForm) =>
          `${row.is_derived_contract ? 'Si' : 'No'}`,
        sortable: true,
      },
      {
        name: 'cancellation_code',
        required: true,
        label: 'Código de anulación',
        align: 'left',
        field: (row: IMovementCodesBasicDataForm) =>
          `${row.cancellation_code ?? ''}`,
        sortable: true,
      },
      {
        name: 'cancellation_code_description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: (row: IMovementCodesBasicDataForm) =>
          `${row.cancellation_code_description ?? ''}`,
        sortable: true,
      },
      {
        name: 'balance_cancellation_code',
        required: true,
        label: 'Código cancelación de saldos',
        align: 'left',
        field: (row: IMovementCodesBasicDataForm) =>
          `${row.balance_cancellation_code ?? ''}`,
        sortable: true,
      },
      {
        name: 'balance_cancellation_code_description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: (row: IMovementCodesBasicDataForm) =>
          `${row.balance_cancellation_code_description ?? ''}`,
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
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const tablePropertiesDestination = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IMovementCodesDestinationResponse[]
    pages: {
      currentPage: number
      lastPage: number
    }
  }>({
    title: 'Listado de movimiento fuente - destino',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'module',
        required: true,
        label: 'Módulo',
        align: 'left',
        field: (row: IMovementCodesDestinationResponse) =>
          `${row.module ?? ''}`,
        sortable: true,
      },
      {
        name: 'movement_source_code',
        required: true,
        label: 'Código fuente',
        align: 'left',
        field: (row: IMovementCodesDestinationResponse) =>
          `${row.movement_source_code ?? ''}`,
        sortable: true,
      },
      {
        name: 'movement_source_description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: (row: IMovementCodesDestinationResponse) =>
          `${row.movement_source_description ?? ''}`,
        sortable: true,
      },
      {
        name: 'movement_destination_code',
        required: true,
        label: 'Código destino',
        align: 'left',
        field: (row: IMovementCodesDestinationResponse) =>
          `${row.movement_destination_code ?? ''}`,
        sortable: true,
      },
      {
        name: 'movement_destination_description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: (row: IMovementCodesDestinationResponse) =>
          `${row.movement_destination_description ?? ''}`,
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
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const destinationFiltersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: string = '') => {
    tableProperties.value.loading = true
    tableProperties.value.rows = []
    await _getListAction(filters)
    tableProperties.value.loading = false
  }

  const listActionDestination = async (filters: string = '') => {
    tablePropertiesDestination.value.loading = true
    tablePropertiesDestination.value.rows = []
    await _getListActionDestination(filters)
    tablePropertiesDestination.value.loading = false
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

  const updatePageDestination = (page: number) => {
    destinationFiltersFormat.value = {
      ...destinationFiltersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(destinationFiltersFormat.value)

    listActionDestination(queryString ? '&' + queryString : '')
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

  const updatePerPageDestination = (rowsPerPage: number) => {
    perPage = rowsPerPage
    destinationFiltersFormat.value = {
      ...destinationFiltersFormat.value,
      rows: perPage,
      page: 1,
    }
    const queryString = formatParamsCustom(destinationFiltersFormat.value)

    listActionDestination(queryString ? '&' + queryString : '')
  }

  const downloadAction = async () => {
    const { page, rows, ...downloadFilter } = filtersFormat.value
    const queryString = formatParamsCustom(downloadFilter)
    _downloadMovementCodes(queryString ? '?' + queryString : '')
  }

  const downloadActionDestination = async () => {
    const { page, rows, ...downloadFilter } = destinationFiltersFormat.value
    const queryString = formatParamsCustom(downloadFilter)
    _downloadDestination(queryString ? '?' + queryString : '')
  }

  const openAlertModal = async (status: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Desea ${status} el código de movimiento?`
  }

  const changeStatusAction = async () => {
    alertModalRef.value.closeModal()
    openMainLoader(true)
    await _deleteMovementCodes(alertModalConfig.value.entityId as number)

    filtersFormat.value = {
      ...filtersFormat.value,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
    openMainLoader(false)
  }

  const handleClear = () => {
    tableProperties.value.rows = []
    tablePropertiesDestination.value.rows = []
  }

  const handleClearDestination = () => {
    tablePropertiesDestination.value.rows = []
  }

  const handleFilterSearch = async ($filters: {
    'filter[movement_code]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const handleDestinationFilterSearch = async ($filters: {
    'filter[module]': string
    'filter[search_module]': string
  }) => {
    destinationFiltersFormat.value = {
      ...$filters,
      page: 1,
    }
    const queryString = formatParamsCustom(destinationFiltersFormat.value)
    await listActionDestination(queryString ? '&' + queryString : '')
  }

  const handleCancel = () => {
    openFormModal.value = false
  }

  onMounted(async () => {
    data_destination_form.value = null
    await _getResources(keys)
  })

  onUnmounted(async () => {
    _setDataDestinationForm(null)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  const handleDestionationEdit = async (id?: number) => {
    const item = data_movement_codes_destination_list.value.find(
      (item) => item.id === id
    )
    if (!item) return

    formData.value = {
      id: item.id,
      module: item.module,
      source_id: item.source_id ?? null,
      movement_source_code: item.movement_source_code,
      movement_source_description: item.movement_source_description,
      destination_id: item.destination_id ?? null,
      movement_destination_code: item.movement_destination_code,
      movement_destination_description: item.movement_destination_description,
    }

    formAction.value = 'edit'
    managerMovementCodeModal.value.openModal()
  }

  const handleDestionationCreate = async () => {
    formAction.value = 'create'
    formData.value = {
      module: '',
      source_id: null,
      movement_source_code: '',
      movement_source_description: '',
      destination_id: null,
      movement_destination_code: '',
      movement_destination_description: '',
    }
    managerMovementCodeModal.value.openModal()
  }

  const handleOptions = (option: string, id?: number) => {
    switch (option) {
      case 'edit':
        handleDestionationEdit(id)
        break
      case 'create':
        handleDestionationCreate()
        break
    }
  }

  const handleSubmit = async () => {
    const isValid = await formRef.value?.validateForm()
    if (!isValid) return

    const dataSourceDestination = formRef.value.getFormData()

    const payload = dataSourceDestination.map(
      (movement: IMovementCodesDestinationResponse) => ({
        module: movement.module ?? formData.value.module,
        source_id: movement.source_id ?? formData.value.source_id,
        destination_id:
          movement.destination_id ?? formData.value.destination_id,
      })
    )

    let success = false

    if (formAction.value === 'create') {
      success = await _createDestination(payload)
    } else if (formAction.value === 'edit' && formData.value?.id) {
      success = await _updateDestination(formData.value.id, payload[0])
    }

    if (success) {
      const q = formatParamsCustom(destinationFiltersFormat.value)
      if (tablePropertiesDestination.value.rows.length) {
        await listActionDestination(q ? '&' + q : '')
      }
      managerMovementCodeModal.value.closeModal()
    }
  }

  watch(
    () => data_movement_codes_list.value,
    () => {
      tableProperties.value.rows = data_movement_codes_list.value
    }
  )

  watch(
    () => data_movement_codes_pages.value,
    () => {
      tableProperties.value.pages = data_movement_codes_pages.value
    }
  )

  watch(
    () => data_movement_codes_destination_list.value,
    () => {
      tablePropertiesDestination.value.rows =
        data_movement_codes_destination_list.value
    }
  )

  watch(
    () => data_movement_codes_destination_pages.value,
    () => {
      tablePropertiesDestination.value.pages =
        data_movement_codes_destination_pages.value
    }
  )

  return {
    filterFields,
    filterConfigDestination,
    headerProperties,
    openFormModal,
    formAction,
    formRef,
    formData,
    tableProperties,
    tablePropertiesDestination,
    alertModalRef,
    defaultIconsLucide,
    managerMovementCodeModal,
    handleFilterSearch,
    handleDestinationFilterSearch,
    updatePage,
    updatePageDestination,
    updatePerPage,
    updatePerPageDestination,
    handleOptions,
    handleSubmit,
    handleClear,
    handleClearDestination,
    handleCancel,
    changeStatusAction,
    downloadAction,
    downloadActionDestination,
    openAlertModal,
    _cleanMovementCodesData,
    _cleanDestinationData,
    goToURL,
  }
}

export default useBudgetMovementCodesList
