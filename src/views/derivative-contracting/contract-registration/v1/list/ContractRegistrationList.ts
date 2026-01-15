// Vue - Pinia - Router - Quasar
import { ref, onBeforeUnmount, watch, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useRouteValidator, useUtils, useGoToUrl } from '@/composables'

// Interfaces
import { StatusID, IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'
import { IContractRegistrationItem } from '@/interfaces/customs/derivative-contracting/ContractRegistration'

// Constantes
import { CONTRACT_REGISTRATION } from '@/constants/resources/derivative-contracting'

// Stores
import { useContractRegistrationStore } from '@/stores/derivative-contracting/contract-registration'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

const useContractRegistrationList = () => {
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))

  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const {
    contract_document_structure,
    substatuses_contract_type_status_statuses_substatuses,
  } = storeToRefs(useDerivativeContractingResourceStore('v1'))

  const { validateRouter } = useRouteValidator()
  const { defaultIconsLucide, formatParamsCustom, formatCurrencyString } =
    useUtils()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const store = useContractRegistrationStore('v1')
  const { _getListAction, _clearData } = store

  const { contract_registration_list, contract_registration_pages } =
    storeToRefs(store)

  const headerProps = {
    title: 'Registro de contratos',
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
        label: 'Registro de contratos',
        route: 'ContractRegistrationList',
      },
    ],
    btnLabel: 'Crear',
    btnIcon: defaultIconsLucide.plusCircleOutline,
    btnColor: 'primary',
    btnTextColor: 'white',
    indentation: true,
    contentIndentation: true,
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: CONTRACT_REGISTRATION.FILTER.BUSINESS_ID,
      label: 'Negocio',
      type: 'q-select',
      value: null,
      options: business_trusts,
      class: 'col-xs-12 col-sm-12 col-md-12 col-lg-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: CONTRACT_REGISTRATION.FILTER.CONTRACT_DOCUMENT_TYPE_ID,
      label: 'Tipo de documento contractual',
      type: 'q-select',
      value: null,
      options: contract_document_structure,
      class: 'col-xs-12 col-sm-12 col-md-12 col-lg-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: CONTRACT_REGISTRATION.FILTER.CONTRACTOR_ID,
      label: 'Contratista',
      type: 'q-select',
      value: null,
      options: third_parties,
      class: 'col-xs-12 col-sm-12 col-md-12 col-lg-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: CONTRACT_REGISTRATION.FILTER.STATUS,
      label: 'Estado',
      type: 'q-select',
      value: null,
      options: substatuses_contract_type_status_statuses_substatuses,
      class: 'col-xs-12 col-sm-12 col-md-12 col-lg-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const tableProps = ref<IBaseTableProps<IContractRegistrationItem>>({
    title: 'Listado de contratos registrados',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business',
        required: true,
        label: 'Código de negocio',
        align: 'left',
        field: (row) => row.business?.business_code,
        sortable: true,
        format: (val: string) => val ?? '-',
      },
      {
        name: 'business',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row) => row.business?.name,
        sortable: true,
        format: (val: string) => val ?? '-',
      },
      {
        name: 'type_contractual_document',
        required: true,
        label: 'Tipo de documento contractual',
        align: 'left',
        field: 'type_contractual_document',
        sortable: true,
        format: (val: string) => val ?? '-',
      },
      {
        name: 'contract_number',
        required: true,
        label: 'Número de contrato',
        align: 'left',
        field: 'contract_number',
        sortable: true,
        format: (val: string) => val ?? '-',
      },
      {
        name: 'contractor',
        required: true,
        label: 'Número de identificación contratista',
        align: 'left',
        field: (row) => row.contractor?.data?.document,
        sortable: true,
        format: (val: string) => val ?? '-',
      },
      {
        name: 'contractor',
        required: true,
        label: 'Nombre del contratista',
        align: 'left',
        field: (row) => row.contractor?.data?.full_name,
        sortable: true,
        format: (val: string) => val ?? '-',
      },
      {
        name: 'subscription_date',
        required: true,
        label: 'Fecha de suscripción',
        align: 'left',
        field: 'subscription_date',
        sortable: true,
      },
      {
        name: 'contract_value',
        required: true,
        label: 'Valor del contrato',
        align: 'right',
        field: (row) => formatCurrencyString(row.contract_value),
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'status',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'id',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    [CONTRACT_REGISTRATION.FILTER.BUSINESS_ID]: string
    [CONTRACT_REGISTRATION.FILTER.CONTRACT_DOCUMENT_TYPE_ID]: string
    [CONTRACT_REGISTRATION.FILTER.CONTRACTOR_ID]: string
    [CONTRACT_REGISTRATION.FILTER.STATUS]: string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const handleFilterClear = () => {
    filtersFormat.value = {}
    listAction()
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  watch(
    () => contract_registration_list.value,
    () => {
      tableProps.value.rows = contract_registration_list.value
      tableProps.value.pages = {
        ...tableProps.value.pages,
        ...contract_registration_pages.value,
      }
    }
  )

  const keysToClear = {
    derivative_contracting: [
      'contract_document_structure',
      'substatuses_contract_type_status_statuses_substatuses',
    ],
    trust_business: ['business_trusts'],
    third_party: ['third_parties'],
  }

  onBeforeUnmount(() => {
    _resetKeys(keysToClear)
  })

  onBeforeMount(async () => {
    _clearData()
    await _getResources({
      derivative_contracting: [
        'contract_document_structure',
        'contract_type_status_statuses_substatuses',
      ],
    })

    await _getResources({ trust_business: ['business_trusts'] })

    await _getResources(
      { third_party: ['third_parties'] },
      'include=status,addresses,legalPerson,naturalPerson&filter[is_customer]=1&fields[]=id,document,third_party_category,commercial_registration'
    )
  })

  return {
    defaultIconsLucide,
    headerProps,
    tableProps,
    filterConfig,
    StatusID,

    handleFilter,
    handleFilterClear,
    updatePage,
    updatePerPage,
    validateRouter,
    goToURL,
  }
}

export default useContractRegistrationList
