// Vue - Pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'
import {
  ITerritorialTaxesItem,
  ITerritorialTaxesFilters,
} from '@/interfaces/customs/accounts-payable/TerritorialTaxes'

// Composables
import {
  useGoToUrl,
  useUtils,
  useMainLoader,
  useRouteValidator,
} from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useTerritorialTaxesStoreV1 } from '@/stores/accounts-payable/territorial-taxes/territorial-taxes-v1'

const useTerritorialTaxesList = () => {
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { ica_activity_statuses, settlement_concept } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )
  const { third_parties, cities } = storeToRefs(
    useThirdPartyResourceStore('v1')
  )

  const ttStore = useTerritorialTaxesStoreV1()
  const { _getTerritorialTaxesList, _deleteTerritorialTax } = ttStore

  const headerProps = {
    title: 'Impuestos territoriales',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas Por Pagar', route: '' },
      { label: 'Impuestos Territoriales', route: 'TerritorialTaxesList' },
    ],
    actionLabel: 'Crear',
    actionIcon: defaultIconsLucide.PlusCircle,
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'city_id',
      label: 'Ciudad',
      type: 'q-select',
      autocomplete: true,
      value: null,
      class: 'col-3',
      options: cities,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'settlement_concept_id',
      label: 'Concepto de liquidación',
      type: 'q-select',
      autocomplete: true,
      value: null,
      class: 'col-3',
      options: settlement_concept,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'third_party_id',
      label: 'Beneficiario',
      type: 'q-select',
      autocomplete: true,
      value: null,
      class: 'col-3',
      options: third_parties,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      autocomplete: true,
      value: null,
      class: 'col-3',
      options: ica_activity_statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const showState = ref(false)
  const isTerritorialTaxesListEmpty = ref(true)
  const perPage = ref(20)
  const filtersFormat = ref<Record<string, string | number>>({})

  const tableProperties = ref<IBaseTableProps<ITerritorialTaxesItem>>({
    title: 'Listado de impuestos territoriales',
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
        name: 'settlement_concept_code',
        required: true,
        label: 'Concepto de liquidación',
        align: 'left',
        field: (row) => row.settlement_concept?.concept_code ?? '',
        sortable: true,
      },
      {
        name: 'settlement_concept_description',
        required: true,
        label: 'Descripción concepto de liquidación',
        align: 'left',
        field: (row) => row.settlement_concept?.description ?? '',
        sortable: true,
      },
      {
        name: 'city_code',
        required: true,
        label: 'Ciudad',
        align: 'left',
        field: (row) => row.city?.code ?? '',
        sortable: true,
      },
      {
        name: 'city_name',
        required: true,
        label: 'Descripción ciudad',
        align: 'left',
        field: (row) => row.city?.name ?? '',
        sortable: true,
      },
      {
        name: 'third_party_document',
        required: true,
        label: 'Beneficiario',
        align: 'left',
        field: (row) => row.third_party?.document ?? '',
        sortable: true,
      },

      {
        name: 'third_party_description',
        required: true,
        label: 'Descripción beneficiario',
        align: 'left',
        field: (row) =>
          row.third_party?.natural_person?.full_name ??
          row.third_party?.legal_person?.business_name ??
          '',
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
        field: 'id',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const alertModalRef = ref<{
    openModal: () => unknown
    closeModal: () => unknown
  } | null>(null)
  const alertModalConfig = ref({
    description: '¿Desea eliminar el impuesto territorial?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as number | null,
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.loading = true
    openMainLoader(true)

    const list: {
      data: ITerritorialTaxesItem[]
      pages: { currentPage: number; lastPage: number }
    } | null = await _getTerritorialTaxesList(filters)

    tableProperties.value.rows = list?.data ?? []
    tableProperties.value.pages = list?.pages ?? { currentPage: 1, lastPage: 1 }

    openMainLoader(false)
    tableProperties.value.loading = false
  }

  const handleFilter = async ($filters: ITerritorialTaxesFilters) => {
    filtersFormat.value = { ...$filters, rows: perPage.value, page: 1 }
    await listAction(filtersFormat.value)

    const hasResults = tableProperties.value.rows.length > 0
    showState.value = Boolean(filtersFormat.value)
    isTerritorialTaxesListEmpty.value = !hasResults
  }

  const handleClearFilters = async () => {
    tableProperties.value.rows = []
    isTerritorialTaxesListEmpty.value = true
    showState.value = false
  }

  const openAlertModal = (row: ITerritorialTaxesItem) => {
    alertModalConfig.value.id = row.id
    alertModalRef.value?.openModal()
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.id) return

    openMainLoader(true)
    await alertModalRef.value?.closeModal()

    const result = await _deleteTerritorialTax(alertModalConfig.value.id)

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

  const keys = {
    third_party: ['cities'],
    accounts_payable: ['ica_activity_statuses'],
  }
  const keysThirdParty = {
    third_party: ['third_parties'],
  }
  const keysSettlementConcept = {
    accounts_payable: ['settlement_concept'],
  }

  onMounted(async () => {
    await _getResources(keys)
    await _getResources(keysSettlementConcept, 'filter[class]=ITE')
    await _getResources(
      keysThirdParty,
      'include[]=legalPerson&include[]=naturalPerson&fields[third_parties]=id,document,validator_digit,status_id,third_party_type,document_type_id&fields[legal_people]=third_party_id,id,business_name&fields[natural_people]=third_party_id,id,name,middle_name,last_name,second_last_name'
    )
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    // header
    headerProps,
    defaultIconsLucide,
    goToURL,
    validateRouter,

    // filtros
    filterConfig,
    handleFilter,
    handleClearFilters,

    // tabla
    tableProperties,
    showState,
    isTerritorialTaxesListEmpty,
    updatePage,
    updatePerPage,

    // modal
    alertModalRef,
    alertModalConfig,
    openAlertModal,
    handleDelete,
  }
}

export default useTerritorialTaxesList
