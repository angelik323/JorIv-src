// Vue - pinia - moment
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { QTable } from 'quasar'
import { IFieldFilters } from '@/interfaces/customs'
import {
  IRegisterContractsList,
  IAdditionalContract,
} from '@/interfaces/customs/derivative-contracting/RegisterAdditions'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useUtils,
  useRouteValidator,
} from '@/composables'

// Stores
import {
  useDerivativeContractingResourceStore,
  useResourceManagerStore,
} from '@/stores/resources-manager'
import { useRegisterAdditionsStore } from '@/stores/derivative-contracting'

const useRegisterAdditionsList = () => {
  const { _getRegisterContractsList, _deleteRegisterAdditions, _clearData } =
    useRegisterAdditionsStore('v1')
  const {
    register_contracts_list,
    register_contracts_pages,
    register_additions_pages,
  } = storeToRefs(useRegisterAdditionsStore('v1'))
  const {
    contract_addition_business_trust,
    contract_type_id_name,
    contract_addition_contractors,
    contract_addition_numbers,
  } = storeToRefs(useDerivativeContractingResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide, formatCurrencyString, formatDate } = useUtils()
  const { validateRouter } = useRouteValidator()

  const deleteModalRef = ref()
  const rowToDelete = ref<IAdditionalContract | null>(null)
  const selectedRow = ref<number | null>(null)

  const keys = {
    derivative_contracting: [
      'contract_addition_business_trust',
      'contract_type_id_name',
      'contract_addition_contractors',
      'contract_addition_numbers',
    ],
  }

  const filterConfig = computed<IFieldFilters[]>(() => [
    {
      name: 'business_trusts_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      options: contract_addition_business_trust,
    },
    {
      name: 'document_type_id',
      label: 'Tipo de documento contractual',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      options: contract_type_id_name,
    },
    {
      name: 'contractor_id',
      label: 'Contratista',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      options: contract_addition_contractors,
    },
    {
      name: 'contract_number',
      label: 'Número de contrato',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      options: contract_addition_numbers,
    },
  ])

  const headerProps = {
    title: 'Registro de adiciones',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contratación derivada',
        route: '',
      },
      {
        label: 'Registro de adiciones',
        route: 'RegisterAdditionsList',
      },
    ],
  }

  const tablePropsContracts = ref({
    title: 'Listado de contratos registrados',
    loading: false,
    columns: [
      {
        name: 'select',
        field: 'select',
        required: false,
        label: '',
        align: 'center',
        sortable: true,
      },
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'center',
        sortable: true,
      },
      {
        name: 'business_id',
        field: (row) => `${row.business.code} - ${row.business.name}`,
        required: true,
        label: 'Negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'document_type',
        field: (row) =>
          row.document_type?.code
            ? `${row.document_type.code} - ${row.document_type.name}`
            : 'Sin información',
        required: true,
        label: 'Tipo documento contractual',
        align: 'left',
        sortable: true,
      },
      {
        name: 'contract_number',
        field: 'contract_number',
        required: true,
        label: 'Número contrato',
        align: 'left',
        sortable: true,
      },
      {
        name: 'contractor',
        field: (row) => {
          const contractor = row.contractor
          const natural_person = contractor?.natural_person
          if (contractor)
            return `${contractor?.document} - ${
              natural_person ? natural_person?.full_name : 'Sin definir'
            }`
          return 'Sin información'
        },
        required: true,
        label: 'Contratista',
        align: 'left',
        sortable: true,
      },
      {
        name: 'subscription_date',
        field: 'subscription_date',
        required: true,
        label: 'Fecha suscripción',
        align: 'left',
        sortable: true,
      },
      {
        name: 'contract_value',
        field: 'contract_value',
        required: true,
        label: 'Valor contrato',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrencyString(val),
      },
      {
        name: 'status_id',
        field: 'status_id',
        required: true,
        label: 'Estado',
        align: 'center',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IRegisterContractsList[],
    pages: register_contracts_pages.value,
  })

  const tablePropsAdditions = ref({
    title: 'Listado de adiciones o modificaciones contractuales',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'center',
        sortable: true,
      },
      {
        name: 'document_type',
        field: (row) =>
          `${row.document_type?.code} - ${row.document_type?.name}`,
        required: true,
        label: 'Tipo documento contractual',
        align: 'left',
        sortable: true,
      },
      {
        name: 'number',
        field: () =>
          register_contracts_list.value.find((e) => e.id === selectedRow.value)
            ?.contract_number ?? '',
        required: true,
        label: 'Número contrato',
        align: 'left',
        sortable: true,
      },
      {
        name: 'name',
        field: (row) => row.modification_type?.name,
        required: true,
        label: 'Tipo de modificación',
        align: 'left',
        sortable: true,
      },
      {
        name: 'subscription_date',
        field: 'subscription_date',
        required: true,
        label: 'Fecha de suscripción',
        align: 'left',
        sortable: true,
        format: (val) => formatDate(val, 'YYYY-MM-DD'),
      },
      {
        name: 'additional_value',
        field: 'additional_value',
        required: true,
        label: 'Valor adición',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrencyString(val),
      },
      {
        name: 'status_id',
        field: 'status_id',
        required: true,
        label: 'Estado',
        align: 'center',
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
    rows: [] as IAdditionalContract[],
    pages: register_additions_pages.value,
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: Record<string, string | number>) => {
    selectedRow.value = null
    tablePropsContracts.value.rows = []
    tablePropsContracts.value.loading = true
    await _getRegisterContractsList(filters)
    tablePropsContracts.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const handleFilter = async ($filters: {
    'filter[structure_id]': string
    'filter[document_code]': string
    'filter[type]': string
    'filter[module]': string
    'filter[status_id]': string | number
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)
  }

  const updatePerPage = async (rowsPerPage: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rowsPerPage

    await listAction(filtersFormat.value)
  }

  const handleClear = async () => {
    tablePropsContracts.value.rows = []
  }

  const openDeleteModal = (row: IAdditionalContract) => {
    rowToDelete.value = row
    deleteModalRef.value.openModal()
  }

  const confirmDeleteAction = async () => {
    if (!rowToDelete.value) return

    openMainLoader(true)
    const success = await _deleteRegisterAdditions(rowToDelete.value.id)

    if (success) {
      await listAction(filtersFormat.value)
    }

    openMainLoader(false)
    deleteModalRef.value.closeModal()
    rowToDelete.value = null
  }

  onMounted(async () => {
    _clearData()

    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => selectedRow.value,
    (val) => {
      if (val) {
        const data = tablePropsContracts.value.rows.find((e) => e.id === val)

        if (data) {
          tablePropsAdditions.value.rows = data.contract_additions
        }
      } else {
        tablePropsAdditions.value.rows = []
      }
    }
  )

  watch(
    register_contracts_list,
    () => {
      tablePropsContracts.value.rows = register_contracts_list.value
      const { currentPage, lastPage } = register_contracts_pages.value
      tablePropsContracts.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    headerProps,
    tablePropsContracts,
    filterConfig,
    deleteModalRef,
    defaultIconsLucide,
    selectedRow,
    tablePropsAdditions,
    goToURL,
    confirmDeleteAction,
    openDeleteModal,
    handleClear,
    updatePerPage,
    handleFilter,
    updatePage,
    validateRouter,
  }
}

export default useRegisterAdditionsList
