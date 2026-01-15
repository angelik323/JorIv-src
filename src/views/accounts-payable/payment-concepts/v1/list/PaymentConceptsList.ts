// Vue - Pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IPaymentConceptsItem } from '@/interfaces/customs/accounts-payable/PaymentConcepts'
import { IFieldFilters } from '@/interfaces/customs'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

// Stores
import { usePaymentConceptsStore } from '@/stores/accounts-payable/payment-concepts'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const usePaymentConceptsList = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const { payment_concepts_list, payment_concepts_pages } = storeToRefs(
    usePaymentConceptsStore('v1')
  )

  const { _getPaymentConceptsList, _deletePaymentConcepts, _clearData } =
    usePaymentConceptsStore('v1')

  const { account_structures_payment_concepts } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { payment_concept_codes, payment_concept_types } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide } = useUtils()

  const { is_required } = useRules()

  const showState = ref(false)
  const isPaymentConceptsListEmpty = ref(true)

  const alertModalRef = ref()

  const alertModalConfig = ref({
    description: '¿Desea eliminar el concepto de pago?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as number | null,
  })

  const headerProps = {
    title: 'Conceptos de pago',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Conceptos de pago',
        route: 'PaymentConceptsList',
      },
    ],
    btn: {
      icon: defaultIconsLucide.plusCircleOutline,
      label: 'Crear',
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'structure_id',
      label: 'Código de estructura*',
      type: 'q-select',
      value: null,
      class: 'col-4',
      options: account_structures_payment_concepts,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: (val: number) => onStructureIdChange(val),
      rules: [
        (val: string) =>
          is_required(val, 'El código de estructura es requerido'),
      ],
    },
    {
      name: 'structure_purpose',
      label: 'Finalidad*',
      type: 'q-input',
      value: '-',
      class: 'col-4',
      disable: true,
      clean_value: true,
      isForceValue: true,
    },
    {
      name: 'structure_structure',
      label: 'Estructura*',
      type: 'q-input',
      value: '-',
      class: 'col-4',
      disable: true,
      clean_value: true,
      isForceValue: true,
    },
    {
      name: 'concept_code',
      label: 'Código concepto de pago',
      type: 'q-select',
      value: '',
      class: 'col-4',
      options: payment_concept_codes,
      disable: false,
      autocomplete: true,
      clean_value: true,
      hide: true,
    },
    {
      name: 'concept_type',
      label: 'Tipo',
      type: 'q-select',
      value: '',
      class: 'col-4',
      options: payment_concept_types,
      disable: false,
      autocomplete: true,
      clean_value: true,
      hide: true,
    },
  ])

  const onStructureIdChange = async (val: number) => {
    filterConfig.value[1].value = '-'
    filterConfig.value[2].value = '-'
    if (val) {
      const selected_structure = account_structures_payment_concepts.value.find(
        (account_structure) => account_structure.id === val
      )
      if (selected_structure) {
        filterConfig.value[1].value = selected_structure.purpose
        filterConfig.value[2].value = selected_structure.structure
      }
      await _getResources(
        { accounts_payable: ['payment_concept_codes'] },
        `filter[structure_id]=${val}`
      )
      filterConfig.value[3].options.unshift({ label: 'Todos', value: '' })
    }
  }

  const tableProps = ref<IBaseTableProps<IPaymentConceptsItem>>({
    title: 'Listado de conceptos de pago',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        field: 'id',
        sortable: true,
      },
      {
        name: 'structure_code',
        required: false,
        label: 'Código estructura',
        align: 'left',
        field: 'structure_code',
        sortable: true,
      },
      {
        name: 'concept_code',
        required: false,
        label: 'Código de concepto de pago',
        align: 'left',
        field: 'concept_code',
        sortable: true,
      },
      {
        name: 'concept_name',
        required: false,
        label: 'Nombre concepto de pago',
        align: 'left',
        field: 'concept_name',
        sortable: true,
      },
      {
        name: 'concept_type',
        required: false,
        label: 'Tipo',
        align: 'left',
        field: (row: IPaymentConceptsItem) => `${row.concept_type.label}`,
        sortable: true,
      },
      {
        name: 'nature_type',
        required: false,
        label: 'Naturaleza',
        align: 'left',
        field: (row: IPaymentConceptsItem) => `${row.nature_type.label}`,
        sortable: true,
      },
      {
        name: 'activity_type',
        required: false,
        label: 'Tipo de actividad',
        align: 'left',
        field: (row: IPaymentConceptsItem) => `${row.activity_type.label}`,
        sortable: true,
      },
      {
        name: 'obligation_type',
        required: false,
        label: 'Tipo de obligación',
        align: 'left',
        field: (row: IPaymentConceptsItem) => `${row.obligation_type.label}`,
        sortable: true,
      },
      {
        name: 'pension_type',
        required: false,
        label: 'Tipo de pensión',
        align: 'left',
        field: (row: IPaymentConceptsItem) =>
          `${row.pension_type?.label ?? '-'}`,
        sortable: true,
      },
      {
        name: 'liquidates_taxes',
        required: false,
        label: '¿Liquida impuestos?',
        align: 'left',
        field: (row: IPaymentConceptsItem) =>
          `${row.liquidates_taxes ? 'Si' : 'No'}`,
        sortable: true,
      },
      {
        name: 'is_advance',
        required: false,
        label: '¿Es un anticipo?',
        align: 'left',
        field: (row: IPaymentConceptsItem) => `${row.is_advance ? 'Si' : 'No'}`,
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
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

  const handleShowFilters = (showMore: boolean) =>
    filterConfig.value.forEach((field) => {
      if (field.name === 'concept_code' || field.name === 'concept_type') {
        field.hide = !showMore
      }
    })

  const listAction = async (
    filters: Record<string, string | number | null>
  ) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getPaymentConceptsList(filters)
    tableProps.value.loading = false
  }

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const handleFilter = async ($filters: {
    'filter[structure_id]': number
    'filter[structure_purpose]'?: string
    'filter[structure_structure]'?: string
    'filter[concept_code]': number
    'filter[concept_type]': number
  }) => {
    delete $filters['filter[structure_purpose]']
    delete $filters['filter[structure_structure]']

    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    _clearData()

    await listAction(filtersFormat.value)

    showState.value = true
    isPaymentConceptsListEmpty.value = payment_concepts_list.value.length === 0
  }

  const handleClearFilters = async () => {
    _clearData()
    isPaymentConceptsListEmpty.value = true
    showState.value = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    listAction(filtersFormat.value)
  }

  const updateRowsPerPage = (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    listAction(filtersFormat.value)
  }

  const openAlertModal = (row: IPaymentConceptsItem) => {
    alertModalConfig.value.id = row.id ?? null
    alertModalRef.value?.openModal()
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.id) return
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (await _deletePaymentConcepts(alertModalConfig.value.id)) {
      await listAction(filtersFormat.value)
    }
    openMainLoader(false)
  }

  const keys = {
    accounting: ['account_structures'],
    accounts_payable: ['payment_concept_types'],
  }

  onMounted(async () => {
    await _getResources(
      keys,
      'filter[type]=Catálogo%20de%20conceptos%20pago&filter[status_id]=1'
    )
    filterConfig.value[3].options.unshift({ label: 'Todos', value: '' })
    filterConfig.value[4].options.unshift({ label: 'Todos', value: '' })
  })

  onBeforeUnmount(() => _resetKeys(keys))

  watch(
    () => payment_concepts_list.value,
    (val) => {
      tableProps.value.rows = val

      const { currentPage, lastPage } = payment_concepts_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    defaultIconsLucide,
    headerProps,
    filterConfig,
    tableProps,
    showState,
    isPaymentConceptsListEmpty,
    alertModalRef,
    alertModalConfig,
    handleFilter,
    handleClearFilters,
    handleShowFilters,
    openAlertModal,
    handleDelete,
    updatePage,
    updateRowsPerPage,
    goToURL,
    validateRouter,
  }
}

export default usePaymentConceptsList
