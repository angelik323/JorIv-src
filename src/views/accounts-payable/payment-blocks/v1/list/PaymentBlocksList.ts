// core
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

// interfaces
import { ITabs } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IGenericResource } from '@/interfaces/customs/resources/Common'
import {
  IBusinessesPaymentBlock,
  IPaymentBlockFilters,
  IPaymentBlockItem,
  IPaymentConceptFilters,
  IPaymentConceptItem,
  IPaymentConceptUpdate,
  ISettlementConcepts,
  ISettlementConceptsUpdate,
} from '@/interfaces/customs/accounts-payable/PaymentBlocks'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { usePaymentBlocksStore } from '@/stores/accounts-payable/payment-blocks'

const usePaymentBlocksList = () => {
  // composables
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { is_required } = useRules()

  // stores
  const accountingStore = useAccountingResourceStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    payment_concept_codes_payment_block,
    settlement_concept,
    payment_block_code_name,
  } = storeToRefs(useAccountsPayableResourceStore('v1'))
  const { budget_item_codes_payment_block, budget_resource_codes } =
    storeToRefs(useBudgetResourceStore('v1'))
  const {
    account_structures_accounting_concepts,
    account_structures_payment_concepts,
    budget_structures,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const {
    _getPaymentBlockList,
    _deletePaymentBlock,
    _getPaymentConceptsById,
    _createPaymentConcept,
    _deleteConcept,
    _createSettlementConcept,
    _deleteSettlement,
    _updatePaymentConcept,
    _updateSettlementConcept,
    _getBusinessesById,
  } = usePaymentBlocksStore('v1')

  // refs
  const keys = ref({
    accounts_payable: ['payment_block_code_name'],
  })
  const keysV2 = ref({
    accounting: ['budget_structures_generate'],
  })
  const keysParams = ref({
    accounting: ['account_structures'],
  })
  const filtersFormat = ref<Record<string, string | number>>({})
  const alertModalRef = ref()
  const perPage = ref(20)
  const perPageConcepts = ref(20)
  const currentPageSettlement = ref(1)
  const perPageSettlement = ref(20)
  const currentPageBusinesses = ref(1)
  const perPageBusinesses = ref(20)
  const selectedPaymentBlockIds = ref(0)
  const selectedPaymentConceptIds = ref(0)
  const selectedSettlementConceptIds = ref(0)
  const tableRef = ref()
  const tableConceptRef = ref()
  const tableSettlementConceptsRef = ref()
  const alertConceptModalRef = ref()
  const alertSettlementModalRef = ref()
  const paymentConceptFormRef = ref()
  const settlementConceptFormRef = ref()
  const originalRowsConcepts = ref()
  const alertBusinessesModalRef = ref()
  const originalRowsBusinesses = ref()

  // configs
  const headerProps = {
    title: 'Bloques de pago',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Cuentas por pagar',
        route: '',
      },
      {
        label: 'Bloques de pago',
        route: 'PaymentBlocksList',
      },
    ],
    btn: {
      label: validateRouter('AccountsPayable', 'PaymentBlocksList', 'create')
        ? 'Crear'
        : undefined,
      icon: defaultIconsLucide.plusCircleOutline,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'id',
      label: 'Código y nombre del bloque',
      type: 'q-select',
      value: '',
      class: 'col-3',
      options: [{ label: 'Todos', value: '' }],
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'accounting_structure_id',
      label: 'Estructura contable*',
      type: 'q-select',
      value: null,
      class: 'col-3',
      options: account_structures_accounting_concepts,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'payment_structure_id',
      label: 'Estructura de pago*',
      type: 'q-select',
      value: null,
      class: 'col-3',
      options: account_structures_payment_concepts,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'budget_requirement_id',
      label: 'Requerimiento presupuestal*',
      type: 'q-select',
      value: null,
      class: 'col-3',
      options: budget_structures,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    customColumns: string[]
    rows: IPaymentBlockItem[]
    pages: {
      currentPage: number
      lastPage: number
    }
  }>({
    title: 'Listado de bloques de pago',
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
        name: 'block_code',
        required: false,
        label: 'Código bloque',
        align: 'left',
        field: 'block_code',
        sortable: true,
      },
      {
        name: 'block_name',
        required: false,
        label: 'Nombre del bloque',
        align: 'left',
        field: 'block_name',
        sortable: true,
      },
      {
        name: 'accounting_structure_description',
        required: false,
        label: 'Estructura contable',
        align: 'left',
        field: 'accounting_structure_description',
        sortable: true,
      },
      {
        name: 'payment_structure_description',
        required: false,
        label: 'Estructura de pago',
        align: 'left',
        field: 'payment_structure_description',
        sortable: true,
      },
      {
        name: 'budget_requirement_code',
        required: false,
        label: 'Requerimiento presupuestal',
        align: 'left',
        field: 'budget_requirement_code',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'left',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    customColumns: ['actions'],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const alertModalConfig = ref({
    description: '',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
    option: '',
  })

  const filterConceptConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscar',
      type: 'q-input',
      value: null,
      class: 'col-12',
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Buscar por código o nombre',
    },
  ])

  const filterBusinessesConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscar',
      type: 'q-input',
      value: null,
      class: 'col-12',
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Buscar por código o nombre',
    },
  ])

  const tableConceptsProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    customColumns: string[]
    rows: IPaymentConceptItem[]
    filterRows: IPaymentConceptItem[]
    pages: {
      currentPage: number
      lastPage: number
    }
  }>({
    title: '',
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
        name: 'payment_concept_code',
        required: false,
        label: 'Código concepto de pago',
        align: 'left',
        field: 'payment_concept_code',
        sortable: true,
      },
      {
        name: 'payment_concept_name',
        required: false,
        label: 'Nombre del concepto de pago',
        align: 'left',
        field: 'payment_concept_name',
        sortable: true,
      },
      {
        name: 'obligation_type_label',
        required: false,
        label: 'Tipo de obligación',
        align: 'left',
        field: 'obligation_type_label',
        sortable: true,
      },
      {
        name: 'from_budget_item_code',
        required: false,
        label: 'Desde rubro',
        align: 'left',
        field: 'from_budget_item_code',
        sortable: true,
      },
      {
        name: 'to_budget_item_code',
        required: false,
        label: 'Hasta rubro',
        align: 'left',
        field: 'to_budget_item_code',
        sortable: true,
      },
      {
        name: 'from_budget_resource_code',
        required: false,
        label: 'Desde recurso',
        align: 'left',
        field: 'from_budget_resource_code',
        sortable: true,
      },
      {
        name: 'to_budget_resource_code',
        required: false,
        label: 'Hasta recurso',
        align: 'left',
        field: 'to_budget_resource_code',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'left',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    customColumns: ['actions'],
    rows: [],
    filterRows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const tableSettlementConceptsProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    customColumns: string[]
    rows: ISettlementConcepts[]
    hidePagination: boolean
    pages: {
      currentPage: number
      lastPage: number
    }
  }>({
    title: 'Listado de conceptos de liquidación',
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
        name: 'settlement_concept_code',
        required: false,
        label: 'Código de concepto de liquidacion',
        align: 'left',
        field: 'settlement_concept_code',
        sortable: true,
      },
      {
        name: 'settlement_concept_name',
        required: false,
        label: 'Nombre de concepto de liquidacion',
        align: 'left',
        field: 'settlement_concept_name',
        sortable: true,
      },
      {
        name: 'is_main_concept',
        required: false,
        label: 'Concepto principal',
        align: 'left',
        field: 'is_main_concept',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'left',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    customColumns: ['is_main_concept', 'actions'],
    rows: [],
    hidePagination: false,
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const tableBusinessesProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    customColumns: string[]
    rows: IBusinessesPaymentBlock[]
    pages: {
      currentPage: number
      lastPage: number
    }
  }>({
    title: '',
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
        name: 'business_code',
        required: false,
        label: 'Negocio',
        align: 'left',
        field: 'business_code',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre del negocio',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado del negocio',
        align: 'left',
        field: 'status_id',
        sortable: true,
      },
    ] as QTable['columns'],
    customColumns: ['status_id'],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const tableAddConceptsProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    customColumns: string[]
    rows: IPaymentConceptItem[]
    hideBottom: boolean
    hidePagination: boolean
  }>({
    title: 'Listado de conceptos de pago',
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
        name: 'payment_concept_id',
        required: false,
        label: 'Código concepto de pago',
        align: 'left',
        field: 'payment_concept_id',
        sortable: true,
      },
      {
        name: 'payment_concept_name',
        required: false,
        label: 'Nombre del concepto de pago',
        align: 'left',
        field: 'payment_concept_name',
        sortable: true,
      },
      {
        name: 'obligation_type',
        required: false,
        label: 'Tipo de obligación',
        align: 'left',
        field: 'obligation_type',
        sortable: true,
      },
      {
        name: 'from_budget_item_id',
        required: false,
        label: 'Desde rubro',
        align: 'left',
        field: 'from_budget_item_id',
        sortable: true,
      },
      {
        name: 'to_budget_item_id',
        required: false,
        label: 'Hasta rubro',
        align: 'left',
        field: 'to_budget_item_id',
        sortable: true,
      },
      {
        name: 'from_budget_resource_id',
        required: false,
        label: 'Desde recurso',
        align: 'left',
        field: 'from_budget_resource_id',
        sortable: true,
      },
      {
        name: 'to_budget_resource_id',
        required: false,
        label: 'Hasta recurso',
        align: 'left',
        field: 'to_budget_resource_id',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'left',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    customColumns: [
      'payment_concept_id',
      'payment_concept_name',
      'obligation_type',
      'from_budget_item_id',
      'to_budget_item_id',
      'from_budget_resource_id',
      'to_budget_resource_id',
      'actions',
    ],
    rows: [],
    hideBottom: true,
    hidePagination: true,
  })

  const tableAddSettlementConceptsProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    customColumns: string[]
    rows: ISettlementConcepts[]
    hideBottom: boolean
    hidePagination: boolean
  }>({
    title: 'Listado de conceptos de liquidación',
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
        name: 'settlement_concept_id',
        required: false,
        label: 'Código de concepto de liquidacion',
        align: 'left',
        field: 'settlement_concept_id',
        sortable: true,
      },
      {
        name: 'settlement_concept_name',
        required: false,
        label: 'Nombre de concepto de liquidacion',
        align: 'left',
        field: 'settlement_concept_name',
        sortable: true,
      },
      {
        name: 'is_main_concept',
        required: false,
        label: 'Concepto principal',
        align: 'center',
        field: 'is_main_concept',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'left',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    customColumns: [
      'settlement_concept_id',
      'settlement_concept_name',
      'is_main_concept',
      'actions',
    ],
    rows: [],
    hideBottom: true,
    hidePagination: true,
  })

  const alertConceptModalConfig = ref({
    titleHeader: 'Asignar conceptos de pago',
    textBtnConfirm: 'Asignar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
    mode: 'create',
    data: {} as IPaymentConceptUpdate,
  })

  const alertSettlementModalConfig = ref({
    titleHeader: 'Asignar conceptos de liquidación',
    textBtnConfirm: 'Asignar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
    mode: 'create',
    data: {} as ISettlementConceptsUpdate,
  })

  const alertBusinessesModalConfig = ref({
    titleHeader: 'Listado de negocios',
    id: null as null | number,
  })

  const tabs: ITabs[] = [
    {
      name: 'conceptos',
      label: 'Conceptos de pago y liquidación',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  // actions
  const listAction = async (filters: typeof filtersFormat.value) => {
    tableConceptsProps.value.rows = []
    tableSettlementConceptsProps.value.rows = []
    selectedPaymentBlockIds.value = 0
    selectedPaymentConceptIds.value = 0

    tableRef.value.clearSelection()
    tableConceptRef.value.clearSelection()

    tableProps.value.loading = true
    const list = await _getPaymentBlockList(filters)

    tableProps.value.rows = list?.data ?? []
    tableProps.value.pages = list?.pages ?? { currentPage: 1, lastPage: 1 }

    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: IPaymentBlockFilters) => {
    filtersFormat.value = { ...$filters }

    await listAction(filtersFormat.value)
  }

  const handleClearFilters = async () => {
    tableProps.value.rows = []
  }

  const openDeleteModal = (id: number, option: string) => {
    if (option == 'block') {
      alertModalConfig.value.description =
        '¿Desea eliminar el bloque de cuentas por pagar?'
    }

    if (option == 'concept') {
      alertModalConfig.value.description =
        '¿Desea eliminar el concepto de pago?'
    }

    if (option == 'settlement') {
      alertModalConfig.value.description =
        '¿Desea eliminar el concepto de liquidación?'
    }

    alertModalConfig.value.id = id
    alertModalConfig.value.option = option
    alertModalRef.value?.openModal()
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.id) return

    openMainLoader(true)
    let result = false

    if (alertModalConfig.value.option == 'block') {
      result = await _deletePaymentBlock(alertModalConfig.value.id)
    }

    if (alertModalConfig.value.option == 'concept') {
      result = await _deleteConcept(
        selectedPaymentBlockIds.value,
        alertModalConfig.value.id
      )
    }

    if (alertModalConfig.value.option == 'settlement') {
      result = await _deleteSettlement(alertModalConfig.value.id)
    }

    if (result) {
      await alertModalRef.value.closeModal()
      await listAction(filtersFormat.value)
    }
    openMainLoader(false)
  }

  const updatePage = async (page: number) => {
    await listAction({
      ...filtersFormat.value,
      rows: perPage.value,
      page,
    })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
      page: 1,
    }
    await listAction(filtersFormat.value)
  }

  const listActionConcepts = async (id: number, page: number) => {
    tableConceptRef.value.clearSelection()

    tableConceptsProps.value.loading = true
    const concepts = await _getPaymentConceptsById(
      { rows: perPageConcepts.value, page },
      id
    )

    tableConceptsProps.value.rows = concepts?.data ?? []
    tableConceptsProps.value.pages = concepts?.pages ?? {
      currentPage: 1,
      lastPage: 1,
    }

    tableConceptsProps.value.loading = false
    originalRowsConcepts.value = tableConceptsProps.value.rows
  }

  const handleSelectPaymentBlock = async (selected: IPaymentBlockItem[]) => {
    tableConceptsProps.value.rows = []
    tableSettlementConceptsProps.value.rows = []
    selectedPaymentBlockIds.value = 0
    selectedPaymentConceptIds.value = 0
    if (selected.length === 0) return

    if (selected[0].budget_requirement_id) {
      _getResources(
        { accounting: ['budget_structures_generate'] },
        `filter[id]=${selected[0].budget_requirement_id}`,
        'v2'
      )

      if (budget_structures.value.length > 0) {
        const rpp_id = budget_structures.value[0].rpp_id
        const rcs_id = budget_structures.value[0].rcs_id

        _getResources(
          { budget: ['budget_item_codes'] },
          `filter[type]=Operativo&filter[budget_structure_id]=${rpp_id}`
        )
        _getResources(
          { budget: ['budget_resource_codes'] },
          `filter[type]=Operativo&filter[budget_structure_id]=${rcs_id}`
        )
      }
    }

    selectedPaymentBlockIds.value = selected[0].id
    _getResources(
      { accounts_payable: ['payment_concept_codes'] },
      `filter[structure_id]=${selected[0].payment_structure_id}`
    )
    _getResources(
      { accounts_payable: ['settlement_concept'] },
      `filter[structure_id]=${selected[0].accounting_structure_id}`
    )
    await listActionConcepts(selectedPaymentBlockIds.value, 1)
  }

  const updatePageConcepts = async (page: number) => {
    await listActionConcepts(selectedPaymentBlockIds.value, page)
  }

  const updatePerPageConcepts = async (rowsPerPage: number) => {
    perPageConcepts.value = rowsPerPage
    await listActionConcepts(selectedPaymentBlockIds.value, 1)
  }

  const paginatedRowsSettlement = computed(() => {
    // como es data local se pagina de esta manera
    const start = (currentPageSettlement.value - 1) * perPageSettlement.value
    const end = start + perPageSettlement.value

    const totalRows = tableSettlementConceptsProps.value.rows.length
    const perPage = perPageSettlement.value
    tableSettlementConceptsProps.value.pages.lastPage = Math.max(
      1,
      Math.ceil(totalRows / perPage)
    )

    return tableSettlementConceptsProps.value.rows.slice(start, end)
  })

  const updatePageSettlement = async (page: number) => {
    currentPageSettlement.value = page
  }

  const updatePerPageSettlement = async (rowsPerPage: number) => {
    perPageSettlement.value = rowsPerPage
    currentPageSettlement.value = 1
    tableSettlementConceptsProps.value.pages.lastPage = Math.ceil(
      tableSettlementConceptsProps.value.rows.length / rowsPerPage
    )
  }

  const handleSelectPaymentConcept = async (
    selected: IPaymentConceptItem[]
  ) => {
    tableSettlementConceptsProps.value.rows = []
    selectedPaymentConceptIds.value = 0

    if (selected.length === 0) return

    selectedPaymentConceptIds.value = selected[0].payment_concept_id ?? 0

    if (selected[0].settlement_concepts.length === 0) return

    tableSettlementConceptsProps.value.loading = true
    tableSettlementConceptsProps.value.rows = selected[0].settlement_concepts
    tableSettlementConceptsProps.value.pages = {
      currentPage: 1,
      lastPage: 1,
    }
    tableSettlementConceptsProps.value.loading = false

    updatePerPageSettlement(perPageSettlement.value)
  }

  const openConceptModal = (data: IPaymentConceptItem, mode: string) => {
    selectedPaymentConceptIds.value = Number(data.payment_concept_id)

    alertConceptModalConfig.value.data = {
      block_code: data.payment_concept_code,
      block_name: data.payment_concept_name,
      obligation_type: data.obligation_type,
      from_budget_item_id: data.from_budget_item_id,
      to_budget_resource_id: data.to_budget_resource_id,
      from_budget_resource_id: data.from_budget_resource_id,
      to_budget_item_id: data.to_budget_item_id,
      from_budget_item_code: data.from_budget_item_code,
      to_budget_item_code: data.to_budget_item_code,
      from_budget_resource_code: data.from_budget_resource_code,
      to_budget_resource_code: data.to_budget_resource_code,
    }
    alertConceptModalConfig.value.titleHeader =
      mode == 'create' ? 'Asignar conceptos de pago' : 'Editar concepto de pago'
    alertConceptModalConfig.value.mode = mode
    tableAddConceptsProps.value.rows = []
    alertConceptModalRef.value?.openModal()
  }

  const makePayloadConcept = () => {
    if (alertConceptModalConfig.value.mode == 'create')
      return {
        concepts: tableAddConceptsProps.value.rows.map((item) => ({
          ...item,
          payment_concept_id: Number(item.payment_concept_id),
          from_budget_item_id: Number(item.from_budget_item_id),
          to_budget_item_id: Number(item.to_budget_item_id),
          from_budget_resource_id: Number(item.from_budget_resource_id),
          to_budget_resource_id: Number(item.to_budget_resource_id),
          from_budget_item_code: item.from_budget_item_code,
          to_budget_item_code: item.to_budget_item_code,
          from_budget_resource_code: item.from_budget_resource_code,
          to_budget_resource_code: item.to_budget_resource_code,
        })),
      }

    const data = alertConceptModalConfig.value.data

    return {
      block_code: data.block_code,
      block_name: data.block_name,
      obligation_type: data.obligation_type,
      from_budget_item_id: data.from_budget_item_id,
      to_budget_item_id: data.to_budget_item_id,
      from_budget_resource_id: data.from_budget_resource_id,
      to_budget_resource_id: data.to_budget_resource_id,
      from_budget_item_code: data.from_budget_item_code,
      to_budget_item_code: data.to_budget_item_code,
      from_budget_resource_code: data.from_budget_resource_code,
      to_budget_resource_code: data.to_budget_resource_code,
    }
  }

  const handleConceptConfirm = async () => {
    if (alertConceptModalConfig.value.mode == 'create') {
      const payload = makePayloadConcept() as {
        concepts: IPaymentConceptItem[]
      }
      if (await _createPaymentConcept(payload, selectedPaymentBlockIds.value)) {
        alertConceptModalRef.value?.closeModal()
        await listActionConcepts(selectedPaymentBlockIds.value, 1)
        tableConceptRef.value.clearSelection()
        tableSettlementConceptsProps.value.rows = []
      }
    } else {
      const payload = makePayloadConcept() as IPaymentConceptUpdate
      if (
        await _updatePaymentConcept(
          payload,
          selectedPaymentBlockIds.value,
          selectedPaymentConceptIds.value
        )
      ) {
        alertConceptModalRef.value?.closeModal()
        await listActionConcepts(selectedPaymentBlockIds.value, 1)
        tableConceptRef.value.clearSelection()
        tableSettlementConceptsProps.value.rows = []
      }
    }
  }

  const handleAddConcept = () => {
    const rows = tableAddConceptsProps.value.rows

    const newId =
      rows.length > 0 ? Math.max(...rows.map((r) => r.id || 0)) + 1 : 1

    tableAddConceptsProps.value.rows.push({
      id: newId,
      payment_block_id: null,
      payment_concept_id: null,
      payment_concept_code: '',
      payment_concept_name: '',
      obligation_type: '',
      obligation_type_label: '',
      nature_type: '',
      nature_type_label: '',
      activity_type: '',
      activity_type_label: '',
      from_budget_item_id: null,
      from_budget_item_code: '',
      to_budget_item_id: null,
      to_budget_item_code: '',
      from_budget_resource_id: null,
      from_budget_resource_code: '',
      to_budget_resource_id: null,
      to_budget_resource_code: '',
      created_at: '',
      updated_at: '',
      settlement_concepts: [],
    })
  }

  const handleRemoveConcept = (index: number) => {
    const rows = tableAddConceptsProps.value.rows
    if (index >= 0 && index < rows.length) {
      rows.splice(index, 1)
    }
  }

  const handleRemoveSettlement = (index: number) => {
    const rows = tableAddSettlementConceptsProps.value.rows
    if (index >= 0 && index < rows.length) {
      rows.splice(index, 1)
    }
  }

  const changePaymenConcept = (val: number, row: IPaymentConceptItem) => {
    row.payment_concept_id = null
    row.payment_concept_name = ''
    row.obligation_type = ''

    if (!val) return

    row.payment_concept_id = val
    const payment = payment_concept_codes_payment_block.value.filter(
      (item) => item.value == val
    )

    if (payment.length > 0) {
      row.payment_concept_name = payment[0].concept_name ?? ''
      row.obligation_type = payment[0].obligation_type_label ?? ''
    }
  }

  const handleAddSettlement = () => {
    const rows = tableAddSettlementConceptsProps.value.rows

    const newId =
      rows.length > 0 ? Math.max(...rows.map((r) => r.id || 0)) + 1 : 1

    tableAddSettlementConceptsProps.value.rows.push({
      id: newId,
      payment_block_payment_concept_id: null,
      settlement_concept_id: null,
      settlement_concept_code: '',
      settlement_concept_name: '',
      is_main_concept: false,
      created_at: '',
      updated_at: '',
    })
  }

  const openSettlementModal = (data: ISettlementConcepts, mode: string) => {
    selectedSettlementConceptIds.value = Number(data.id)

    alertSettlementModalConfig.value.data = {
      settlement_concept_id: data.settlement_concept_id,
      settlement_concept_code: data.settlement_concept_code,
      settlement_concept_name: data.settlement_concept_name,
      is_main_concept: data.is_main_concept,
    }
    alertSettlementModalConfig.value.titleHeader =
      mode == 'create'
        ? 'Asignar conceptos de liquidación'
        : 'Editar conceptos de liquidación'
    alertSettlementModalConfig.value.mode = mode
    tableAddSettlementConceptsProps.value.rows = []
    alertSettlementModalRef.value?.openModal()
  }

  const changeSettlementConcept = (val: number, row: ISettlementConcepts) => {
    row.settlement_concept_id = null
    row.settlement_concept_name = ''

    if (!val) return

    row.settlement_concept_id = val
    const settlement = settlement_concept.value.filter(
      (item) => item.value == val
    )

    if (settlement.length > 0) {
      row.settlement_concept_name = settlement[0].description ?? ''
    }
  }

  const makePayloadSettlement = () => {
    if (alertSettlementModalConfig.value.mode == 'create')
      return {
        concepts: tableAddSettlementConceptsProps.value.rows.map((item) => ({
          ...item,
          settlement_concept_id: Number(item.settlement_concept_id),
          is_main_concept: item.is_main_concept,
        })),
      }

    const data = alertSettlementModalConfig.value.data

    return {
      settlement_concept_id: data.settlement_concept_id,
      settlement_concept_code: data.settlement_concept_code,
      settlement_concept_name: data.settlement_concept_name,
      is_main_concept: data.is_main_concept,
    }
  }

  const handleSettlementConfirm = async () => {
    if (alertSettlementModalConfig.value.mode == 'create') {
      const payload = makePayloadSettlement() as {
        concepts: ISettlementConcepts[]
      }

      if (
        await _createSettlementConcept(
          payload,
          selectedPaymentBlockIds.value,
          selectedPaymentConceptIds.value
        )
      ) {
        alertSettlementModalRef.value?.closeModal()
        await listActionConcepts(selectedPaymentBlockIds.value, 1)
        tableConceptRef.value.clearSelection()
        tableSettlementConceptsProps.value.rows = []
        tableAddSettlementConceptsProps.value.rows = []
      }
    } else {
      const payload = makePayloadSettlement() as ISettlementConceptsUpdate

      if (
        await _updateSettlementConcept(
          payload,
          selectedSettlementConceptIds.value
        )
      ) {
        alertSettlementModalRef.value?.closeModal()
        await listActionConcepts(selectedPaymentBlockIds.value, 1)
        tableConceptRef.value.clearSelection()
        tableSettlementConceptsProps.value.rows = []
      }
    }
  }

  const getCodeByValue = (list: IGenericResource[], val: number): string => {
    const found = list.find((item) => item.value === val)
    return found?.code ?? ''
  }

  const changeFromBudgetItem = (val: number, row: IPaymentConceptItem) => {
    row.from_budget_item_id = val
    row.from_budget_item_code = getCodeByValue(
      budget_item_codes_payment_block.value,
      val
    )
  }

  const changeToBudgetItem = (val: number, row: IPaymentConceptItem) => {
    row.to_budget_item_id = val
    row.to_budget_item_code = getCodeByValue(
      budget_item_codes_payment_block.value,
      val
    )
  }

  const changeFromBudgetResource = (val: number, row: IPaymentConceptItem) => {
    row.from_budget_resource_id = val
    row.from_budget_resource_code = getCodeByValue(
      budget_resource_codes.value,
      val
    )
  }

  const changeToBudgetResource = (val: number, row: IPaymentConceptItem) => {
    row.to_budget_resource_id = val
    row.to_budget_resource_code = getCodeByValue(
      budget_resource_codes.value,
      val
    )
  }

  const handleFilterConcept = ($filters: IPaymentConceptFilters) => {
    tableConceptRef.value.clearSelection()

    const search = $filters['filter[search]']?.toLowerCase().trim() ?? ''

    if (!search) {
      tableConceptsProps.value.rows = [...originalRowsConcepts.value]
      return
    }

    tableConceptsProps.value.rows = originalRowsConcepts.value.filter(
      (row: IPaymentConceptItem) =>
        [row.payment_concept_code, row.payment_concept_name].some((field) =>
          field.toLowerCase().includes(search)
        )
    )
  }

  const handleClearFiltersConcept = () => {
    tableConceptsProps.value.rows = [...originalRowsConcepts.value]
  }

  const openBusinessesModal = async (item: IPaymentBlockItem) => {
    tableBusinessesProps.value.rows = []
    alertBusinessesModalRef.value.openModal()

    tableBusinessesProps.value.loading = true
    tableBusinessesProps.value.rows = (await _getBusinessesById(item.id)) ?? []
    originalRowsBusinesses.value = [...tableBusinessesProps.value.rows]
    tableBusinessesProps.value.pages = {
      currentPage: 1,
      lastPage: 1,
    }
    tableBusinessesProps.value.loading = false

    updatePerPageBusinesses(perPageBusinesses.value)
  }

  const handleFilterBusinesses = ($filters: IPaymentConceptFilters) => {
    const search = $filters['filter[search]']?.toLowerCase().trim() ?? ''

    if (!search) {
      tableBusinessesProps.value.rows = [...originalRowsBusinesses.value]
      updatePerPageBusinesses(perPageBusinesses.value)
      return
    }

    tableBusinessesProps.value.rows = originalRowsBusinesses.value.filter(
      (row: IBusinessesPaymentBlock) =>
        [row.business_code, row.name].some((field) =>
          field.toLowerCase().includes(search)
        )
    )

    updatePerPageBusinesses(perPageBusinesses.value)
  }

  const handleClearFiltersBusinesses = () => {
    tableBusinessesProps.value.rows = [...originalRowsBusinesses.value]
    updatePerPageBusinesses(perPageBusinesses.value)
  }

  const updatePageBusinesses = async (page: number) => {
    currentPageBusinesses.value = page
    updateVisibleBusinessesRows()
  }

  const updatePerPageBusinesses = async (rowsPerPage: number) => {
    perPageBusinesses.value = rowsPerPage
    currentPageBusinesses.value = 1
    tableBusinessesProps.value.pages.lastPage = Math.ceil(
      tableBusinessesProps.value.rows.length / rowsPerPage
    )
    updateVisibleBusinessesRows()
  }

  const updateVisibleBusinessesRows = () => {
    const start = (currentPageBusinesses.value - 1) * perPageBusinesses.value
    const end = start + perPageBusinesses.value

    tableBusinessesProps.value.rows = originalRowsBusinesses.value.slice(
      start,
      end
    )
  }

  // lifecycle hooks
  onMounted(async () => {
    await _getResources(keys.value)
    await _getResources(keysV2.value, '', 'v2')
    await _getResources(
      keysParams.value,
      'filter[type]=Catálogo de cuentas contables&filter[status_id]=1'
    )
    accountingStore.account_structures_accounting_concepts = [
      ...accountingStore.account_structures_payment_concepts,
    ]
    await _getResources(
      keysParams.value,
      'filter[type]=Catálogo de conceptos pago&filter[status_id]=1'
    )
    filterConfig.value[0].options = [
      { label: 'Todos', value: '' },
      ...payment_block_code_name.value,
    ]
  })

  onBeforeUnmount(() => _resetKeys(keys.value))

  return {
    // configs
    headerProps,
    filterConfig,
    tableProps,
    alertModalConfig,
    tableConceptsProps,
    tableSettlementConceptsProps,
    alertConceptModalConfig,
    tableAddConceptsProps,
    alertSettlementModalConfig,
    tableAddSettlementConceptsProps,
    tabs,
    tabActive,
    tabActiveIdx,
    filterConceptConfig,
    alertBusinessesModalConfig,
    tableBusinessesProps,
    filterBusinessesConfig,

    // selects
    payment_concept_codes_payment_block,
    budget_item_codes_payment_block,
    budget_resource_codes,
    settlement_concept,

    // refs
    paymentConceptFormRef,
    settlementConceptFormRef,
    alertModalRef,
    tableRef,
    tableConceptRef,
    tableSettlementConceptsRef,
    alertConceptModalRef,
    selectedPaymentBlockIds,
    alertSettlementModalRef,
    selectedPaymentConceptIds,
    paginatedRowsSettlement,
    alertBusinessesModalRef,

    // utils
    defaultIconsLucide,

    // rules
    is_required,

    // methods
    handleRemoveSettlement,
    handleFilter,
    handleClearFilters,
    openDeleteModal,
    updatePage,
    updatePerPage,
    goToURL,
    validateRouter,
    handleDelete,
    handleSelectPaymentBlock,
    updatePageConcepts,
    updatePerPageConcepts,
    handleSelectPaymentConcept,
    openConceptModal,
    handleConceptConfirm,
    handleAddConcept,
    handleRemoveConcept,
    changePaymenConcept,
    openSettlementModal,
    handleAddSettlement,
    changeSettlementConcept,
    handleSettlementConfirm,
    changeFromBudgetItem,
    changeToBudgetItem,
    changeFromBudgetResource,
    changeToBudgetResource,
    updatePageSettlement,
    updatePerPageSettlement,
    handleFilterConcept,
    handleClearFiltersConcept,
    openBusinessesModal,
    handleFilterBusinesses,
    handleClearFiltersBusinesses,
    updatePageBusinesses,
    updatePerPageBusinesses,
  }
}

export default usePaymentBlocksList
