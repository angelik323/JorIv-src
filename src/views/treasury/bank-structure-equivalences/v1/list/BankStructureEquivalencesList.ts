import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  useRouteValidator,
  useMainLoader,
  useAlert,
  useRules,
  useUtils,
} from '@/composables'
import { data_type } from '@/constants/resources'
import { IResource } from '@/interfaces/global'
import { formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

import {
  ISelectorResources,
  IBankStructureEquivalence,
} from '@/interfaces/customs'

import {
  useResourceManagerStore,
  useTreasuryResourceStore,
  useBankStructureEquivalencesStore,
} from '@/stores'

const useBankStructureEquivalencesList = () => {
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const equivalenceStore = useBankStructureEquivalencesStore('v1')
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { capitalize } = useUtils()
  const { showAlert } = useAlert()

  const {
    banks,
    cities,
    type_receive,
    document_type,
    payments: means_payments,
    reasons_bank_return: reasons,
    account_types_equivalences: account_types,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const { equivalence_list, equivalence_pages } = storeToRefs(equivalenceStore)

  const { _getList, _getById, _createAction, _updateAction, _deleteAction } =
    equivalenceStore

  const selectorOptions = ref<ISelectorResources[] | IResource[]>([])
  const filtersFormat = ref<Record<string, string | number>>({})
  const currentAction = ref<'create' | 'edit'>('create')
  const currentItemId = ref<number | null>(null)
  const selectorTypeableRef = ref()
  const selectorDataTypeRef = ref()
  const createEditModalRef = ref()
  const currentLabel = ref('')
  const deleteModalRef = ref()

  const customColumns = ['actions']

  const keys = [
    'banks',
    'account_types',
    'cities',
    'document_type',
    'payments',
    'reasonsForBankReturn',
    'typeReceive',
  ]

  const formData = ref<IBankStructureEquivalence>({
    bank_id: 0,
    typeable_type: '',
    typeable_id: 0,
    data_type: '',
    equivalence_1: '',
    equivalence_2: '',
    equivalence_3: '',
  })

  const deleteModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar la equivalencia?',
    id: null as number | null,
  })

  const headerProperties = {
    title: 'Equivalencias estructuras bancos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería' },
      {
        label: 'Equivalencias estructuras bancos',
        route: 'BankStructureEquivalencesList',
      },
    ],
  }

  const filterConfig = ref([
    {
      name: 'bank',
      label: 'Banco',
      type: 'q-select',
      value: null,
      class: 'col-12',
      options: banks,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const tableProperties = ref({
    loading: false,
    columns: [],
    rows: [] as IBankStructureEquivalence[],
    pages: equivalence_pages,
  })

  const getColumns = (labelKey: string) => {
    return [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'typeable_name',
        required: true,
        label: capitalize(labelKey),
        align: 'center',
        field: 'typeable_name',
        sortable: true,
      },
      {
        name: 'data_type',
        required: true,
        label: 'Tipo de dato',
        align: 'center',
        field: 'data_type',
        sortable: true,
      },
      {
        name: 'equivalence_1',
        required: true,
        label: 'Equivalencia 1',
        align: 'center',
        field: 'equivalence_1',
        sortable: true,
      },
      {
        name: 'equivalence_2',
        label: 'Equivalencia 2',
        align: 'center',
        field: 'equivalence_2',
        sortable: true,
      },
      {
        name: 'equivalence_3',
        label: 'Equivalencia 3',
        align: 'center',
        field: 'equivalence_3',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns']
  }

  const keyConfig = computed(() => ({
    bank_account: {
      label: 'tipos de cuenta',
      filter: 'account_types',
      field: 'BankAccount',
      selector: account_types.value,
    },
    bank: {
      label: 'bancos',
      filter: 'banks',
      field: 'Bank',
      selector: banks.value,
    },
    city: {
      label: 'ciudades',
      filter: 'cities',
      field: 'City',
      selector: cities.value,
    },
    document_type: {
      label: 'tipos de identificación',
      filter: 'document_type',
      field: 'DocumentType',
      selector: document_type.value,
    },
    means_payments: {
      label: 'formas de pago',
      filter: 'payments',
      field: 'MeansOfPayment',
      selector: means_payments.value,
    },
    reasons: {
      label: 'causales de devolución',
      filter: 'reasonsForBankReturn',
      field: 'ReasonsForBankReturn',
      selector: reasons.value,
    },
    type_receive: {
      label: 'tipo de recaudo',
      filter: 'typeReceive',
      field: 'TypeReceive',
      selector: type_receive.value,
    },
  }))

  const loadSelectorOptions = async (key: keyof typeof keyConfig.value) => {
    const filter = keyConfig.value[key].filter
    await _getResources({ treasury: [filter] })
    selectorOptions.value = keyConfig.value[key].selector
  }

  const loadBankStructureEquivalences = async (
    filters = '',
    showAlert = true
  ) => {
    openMainLoader(true)

    await _getList(filters, showAlert)

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleFilter = async (
    $filters: { 'filter[bank]': string },
    showAlert = true
  ) => {
    filtersFormat.value = {
      ...$filters,
      paginate: tableProperties.value.pages.currentPage,
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    await loadBankStructureEquivalences(queryString, showAlert)
  }

  const handleClearFilters = () => {
    filtersFormat.value = {}
    tableProperties.value.rows = []
  }

  const handleOptions = async (
    action: 'edit' | 'delete',
    id: number,
    value?: string,
    label?: string
  ) => {
    if (action === 'edit') {
      const response = await _getById(id)
      if (response) {
        formData.value = response
        handleCreateEditModal('edit', id, value, label)
      }
    } else {
      deleteModalConfig.value.id = id
      deleteModalRef.value.openModal()
    }
  }

  const handleCreateEditModal = (
    action: 'create' | 'edit',
    id: number | null = null,
    value = '',
    label = ''
  ) => {
    if (action === 'create') {
      formData.value = {
        bank_id: 0,
        typeable_type: '',
        typeable_id: 0,
        data_type: '',
        equivalence_1: '',
        equivalence_2: '',
        equivalence_3: '',
      }
    }

    currentAction.value = action
    currentLabel.value = label
    currentItemId.value = id

    loadSelectorOptions(value as keyof typeof keyConfig.value)

    createEditModalRef.value.openModal()
  }

  const handleCloseModal = () => {
    createEditModalRef.value.closeModal()
  }

  const handleSubmitForm = async (type: string) => {
    const response = validateAtLeastOneEquivalence()
    if (response !== true) {
      showAlert(response, 'error', undefined, 3000)
      return
    }

    const action = currentAction.value

    formData.value = {
      ...formData.value,
      bank_id: Number(filtersFormat.value['filter[bank]']),
      typeable_type: getKeyFromLabel(type) || '',
    }

    const success =
      action === 'create'
        ? _createAction(formData.value)
        : _updateAction(formData.value)

    if (await success) {
      handleCloseModal()
      updatePage(1, false)
    }
  }

  const handleDeleteItem = async () => {
    if (deleteModalConfig.value.id != null) {
      await _deleteAction(deleteModalConfig.value.id)
      await deleteModalRef.value.closeModal()
      await updatePage(1, false)
      deleteModalConfig.value.id = null
    }
  }

  const updatePage = (page: number, showAlert: boolean = true) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    loadBankStructureEquivalences(queryString, showAlert)
  }

  const getKeyFromLabel = (label: string): string | undefined => {
    return (
      Object.keys(keyConfig.value) as Array<keyof typeof keyConfig.value>
    ).find((key) => keyConfig.value[key].label === label)
  }

  const validateAtLeastOneEquivalence = () => {
    return useRules().is_required_equivalence({
      equivalence_1: formData.value.equivalence_1,
      equivalence_2: formData.value.equivalence_2,
      equivalence_3: formData.value.equivalence_3,
    })
  }

  const isEquivalenceListEmpty = computed(() => {
    const selectedBank = filtersFormat.value['filter[bank]']
    return !selectedBank
  })

  const groupedEquivalences = computed(() => {
    const groups: Record<string, IBankStructureEquivalence[]> = {}

    equivalence_list.value.forEach((item) => {
      const key = item.typeable_type || 'unknown'
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    })

    return groups
  })

  watch(
    () => equivalence_list.value,
    () => {
      tableProperties.value.rows = equivalence_list.value
      tableProperties.value.pages = equivalence_pages.value
    }
  )

  onMounted(async () => _getResources({ treasury: keys }))

  onBeforeUnmount(() => _resetKeys({ treasury: keys }))

  return {
    formData,
    keyConfig,
    data_type,
    updatePage,
    capitalize,
    getColumns,
    currentLabel,
    handleFilter,
    filterConfig,
    customColumns,
    handleOptions,
    currentAction,
    deleteModalRef,
    validateRouter,
    tableProperties,
    selectorOptions,
    handleCloseModal,
    handleSubmitForm,
    headerProperties,
    handleDeleteItem,
    deleteModalConfig,
    handleClearFilters,
    createEditModalRef,
    groupedEquivalences,
    selectorTypeableRef,
    selectorDataTypeRef,
    handleCreateEditModal,
    isEquivalenceListEmpty,
  }
}

export default useBankStructureEquivalencesList
