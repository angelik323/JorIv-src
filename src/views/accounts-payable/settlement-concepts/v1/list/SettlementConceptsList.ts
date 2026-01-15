// vue - pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'
import {
  ISettlementConceptsFilters,
  ISettlementConceptTableRow,
} from '@/interfaces/customs/accounts-payable/SettlementConcepts'

// composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useSettlementConceptsStore } from '@/stores/accounts-payable/settlement-concepts'

const useSettlementConceptsList = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { settlement_concept } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )
  const { account_structures } = storeToRefs(useAccountingResourceStore('v1'))

  const { _getSettlementConceptsList, _deleteSettlementConcept } =
    useSettlementConceptsStore('v1')

  const keysReset = ref({
    accounts_payable: ['settlement_concept'],
    accounting: ['account_structures'],
  })

  const filtersFormat = ref<Record<string, string | number>>({})
  const showState = ref(false)
  const isListEmpty = ref(true)
  const perPage = ref(20)
  const alertModalRef = ref()

  const headerProps = {
    title: 'Conceptos de liquidación',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      { label: 'Conceptos de liquidación', route: 'SettlementConceptsList' },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircleOutline,
    },
  }

  const onStructureIdChange = (val: number) => {
    filterConfig.value[1].value = ''

    if (val) {
      const selected_structure = account_structures.value.find(
        (account_structure) => {
          const structureId =
            typeof account_structure.id === 'string'
              ? parseInt(account_structure.id, 10)
              : account_structure.id
          return structureId === val
        }
      )

      if (selected_structure) {
        filterConfig.value[1].value = selected_structure.purpose ?? ''
      }
    }
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'structure_id',
      label: 'Estructura contable',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: account_structures,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      onChange: (val: number) => onStructureIdChange(val),
    },
    {
      name: 'structure_description',
      label: 'Descripción estructura contable',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-4',
      disable: true,
      placeholder: '',
      clean_value: true,
      isForceValue: true,
    },
    {
      name: 'settlement_concept',
      label: 'Concepto de liquidación',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: settlement_concept,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
  ])

  const tableProps = ref<IBaseTableProps<ISettlementConceptTableRow>>({
    title: 'Listado de conceptos de liquidación',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'structure',
        required: true,
        label: 'Estructura contable',
        align: 'left',
        field: (row) => row.structure_label ?? row.structure ?? '',
        sortable: true,
      },
      {
        name: 'concept',
        required: true,
        label: 'Concepto de liquidación',
        align: 'left',
        field: (row) => row.concept_label ?? row.concept ?? '',
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo',
        align: 'left',
        field: (row) => row.type_label ?? row.type,
        sortable: true,
      },
      {
        name: 'class',
        required: true,
        label: 'Clase',
        align: 'left',
        field: (row) => row.class_label ?? row.class,
        sortable: true,
      },
      {
        name: 'percentage',
        required: true,
        label: 'Porcentaje',
        align: 'left',
        field: (row) => row.percentage,
        sortable: true,
      },
      {
        name: 'liability_account',
        required: true,
        label: 'Cuenta contable pasivo',
        align: 'left',
        field: (row) =>
          row.liability_account_label ?? row.liability_account ?? '',
        sortable: true,
      },
      {
        name: 'fiscal_charge',
        required: true,
        label: 'Cargo fiscal',
        align: 'left',
        field: (row) => row.fiscal_charge_label ?? row.fiscal_charge ?? '',
        sortable: true,
      },
      {
        name: 'expense_account',
        required: true,
        label: 'Cuenta contable gasto',
        align: 'left',
        field: (row) => row.expense_account_label ?? row.expense_account ?? '',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'center',
        field: (row) => row.status,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'left',
        field: (row) => row.id,
        sortable: false,
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const alertModalConfig = ref({
    description: '¿Desea eliminar el concepto de liquidación?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.loading = true
    openMainLoader(true)

    const list = await _getSettlementConceptsList(filters)

    tableProps.value.rows = list?.data ?? []
    tableProps.value.pages = list?.pages ?? { currentPage: 1, lastPage: 1 }

    openMainLoader(false)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: ISettlementConceptsFilters) => {
    const backendFilters: Record<string, string | number> = {}

    if ($filters['filter[structure_id]']) {
      backendFilters['filter[structure_id]'] = $filters['filter[structure_id]']
    }

    if ($filters['filter[settlement_concept]']) {
      backendFilters['filter[id]'] = $filters['filter[settlement_concept]']
    }

    filtersFormat.value = { ...backendFilters, rows: perPage.value, page: 1 }
    await listAction(filtersFormat.value)

    const hasResults = tableProps.value.rows.length > 0
    showState.value = Boolean(Object.keys(backendFilters).length)
    isListEmpty.value = !hasResults
  }

  const handleClearFilters = async () => {
    tableProps.value.rows = []
    isListEmpty.value = true
    showState.value = false
  }

  const openDeleteModal = (id: number) => {
    alertModalConfig.value.id = id
    alertModalRef.value?.openModal()
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.id) return

    openMainLoader(true)
    await alertModalRef.value.closeModal()
    const result = await _deleteSettlementConcept(alertModalConfig.value.id)

    if (result) {
      await listAction(filtersFormat.value)
    }
    openMainLoader(false)
  }

  const updatePage = async (page: number) => {
    await listAction({ ...filtersFormat.value, rows: perPage.value, page })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    filtersFormat.value = { ...filtersFormat.value, rows: rowsPerPage, page: 1 }
    await listAction(filtersFormat.value)
  }

  onMounted(async () => {
    await _getResources({ accounts_payable: ['settlement_concept'] })
    await _getResources(
      { accounting: ['account_structures'] },
      'filter[status_id]=1&filter[type]=Catálogo de cuentas contables'
    )
  })

  onBeforeUnmount(() => _resetKeys(keysReset.value))

  return {
    headerProps,
    filterConfig,
    tableProps,
    alertModalConfig,

    isListEmpty,
    showState,
    alertModalRef,

    defaultIconsLucide,

    handleFilter,
    handleClearFilters,
    handleDelete,
    openDeleteModal,
    updatePage,
    updatePerPage,
    goToURL,
    validateRouter,
  }
}

export default useSettlementConceptsList