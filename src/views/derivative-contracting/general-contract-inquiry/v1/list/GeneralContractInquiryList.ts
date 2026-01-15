import { onMounted, ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

//Interfaces
import { IFieldFilters, ISelectorResources, IGenericResource } from '@/interfaces/customs'
import { IBaseTableProps, IResource } from '@/interfaces/global'
import { IGeneralContractInquiryListItem } from '@/interfaces/customs/derivative-contracting/GeneralContractInquiry'

//Composables
import {
  useUtils,
  useRules,
  useRouteValidator,
  useMainLoader,
  useGoToUrl,
} from '@/composables'

//Stores
import { useResourceManagerStore, useTreasuryResourceStore } from '@/stores/resources-manager'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { useGeneralContractInquiryStore } from '@/stores/derivative-contracting/general-contract-inquiry'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'


const useGeneralContractInquiryList = () => {
  const { defaultIconsLucide } = useUtils()

  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { min_length, max_length } = useRules()

  const { _getResources } = useResourceManagerStore('v1')
  const { getResources: _getThirdPartyResources } = useThirdPartyResourceStore('v1')

  const businessTrustsConsolidator = ref<ISelectorResources[]>([])
  const businessTrustsFrom = ref<ISelectorResources[]>([])
  const businessTrustsTo = ref<ISelectorResources[]>([])
  const documentTypes = ref<IGenericResource[]>([])
  const categoryTypes = ref<IGenericResource[]>([])
  const modalityTypes = ref<IGenericResource[]>([])
  const contractStageList = ref<IGenericResource[]>([])
  const contractStatusGrouped = ref<IResource[]>([])
  const filtersRef = ref()
  const isCleaningFilters = ref(false)
  const contractsAddendaSelected = ref<number | null>(null)
  const selectedContractId = ref<number | null>(null)
  const selectedAdditionId = ref<number | null>(null)


  const {
    _getGeneralContractInquiryList,
    _changeStatus,
    _downloadGeneralContractInquiry,
  } = useGeneralContractInquiryStore('v1')

  const { general_contract_inquiry_list, general_contract_inquiry_pages } = storeToRefs(
    useGeneralContractInquiryStore('v1')
  )
  const { third_parties } = storeToRefs(useTreasuryResourceStore('v1'))

  let perPage = 20

  const handleStageChange = async (stageId: number | null) => {

    if (isCleaningFilters.value) return

    const derivativeContractingStore = useDerivativeContractingResourceStore('v1')
    isCleaningFilters.value = true
    filtersRef.value?.cleanFiltersByNames?.(['status_id'])
    await nextTick()
    isCleaningFilters.value = false

    if (stageId) {
      const filters = `filter[parent_status]=${stageId}`
      await _getResources(
        { derivative_contracting: ['contract_status_grouped'] },
        filters,
        'v1'
      )
      contractStageList.value = [...derivativeContractingStore.contract_status_grouped]
    } else {
      await _getResources(
        { derivative_contracting: ['contract_stages'] },
        '',
        'v1'
      )
      contractStageList.value = [...derivativeContractingStore.contract_stages]
    }
  }

  const headerProps = {
    title: 'Consulta general de contratos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada' },
      {
        label: 'Consulta general de contratos',
        route: 'GeneralContractInquiryList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_trusts_id',
      label: 'Negocio consolidador',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-3',
      options: businessTrustsConsolidator,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'from_business_id ',
      label: 'Desde negocio',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-3',
      options: businessTrustsFrom,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'to_business_id',
      label: 'Hasta negocio',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-3',
      options: businessTrustsTo,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'stage_id',
      label: 'Etapa',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-3',
      options: contractStatusGrouped,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: handleStageChange,
    },
    {
      name: 'document_type_id',
      label: 'Tipo de documento',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-3',
      options: documentTypes,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'category',
      label: 'Categoría',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-3',
      options: categoryTypes,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'modality',
      label: 'Modalidad',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-3',
      options: modalityTypes,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-3',
      options: contractStageList,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'contractor_id',
      label: 'Contratistas',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-3',
      options: third_parties.value,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione contratistas',
      rules: [
        (val: string) => max_length(val, 200),
        (val: string) => min_length(val, 3),
      ],
    },
    {
      name: 'main_contract_number',
      label: 'Número de contrato principal',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Ingrese número de contrato',
    },
    {
      name: 'addition_contract_number',
      label: 'Número de contrato adicional',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Ingrese número de contrato adicional',
      rules: [(val: string) => max_length(val, 50)],
    },
    {
      name: 'subscription_date_from',
      label: 'Fecha de suscripción desde',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Desde',
    },
    {
      name: 'subscription_date_to',
      label: 'Fecha de suscripción hasta',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Hasta',
    },
    {
      name: 'project_id',
      label: 'Proyecto',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione proyecto',
    },
    {
      name: 'work_plan_code',
      label: 'Código plan de obras',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Ingrese código',
      rules: [(val: string) => max_length(val, 50)],
    },
  ])

  const tableProps = ref<IBaseTableProps<IGeneralContractInquiryListItem>>({
    title: 'Listado de contratos y adiciones',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'select',
        label: '',
        field: (row) => row.id,
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row) => row.business?.name || 'N/A',
        sortable: true,
      },
      {
        name: 'fiscal_year',
        required: true,
        label: 'Vigencia',
        align: 'left',
        field: (row) => row.fiscal_year,
        sortable: true,
      },
      {
        name: 'contract_type',
        required: true,
        label: 'Tipo de contrato',
        align: 'left',
        field: (row) => row.contract_type?.name || 'N/A',
        sortable: true,
      },
      {
        name: 'addition_contract_number',
        required: false,
        label: 'Número de contrato adición',
        align: 'center',
        field: 'addition_contract_number',
        sortable: true,
      },
      {
        name: 'subscription_date',
        required: false,
        label: 'Fecha de suscripción',
        align: 'center',
        field: 'subscription_date',
        sortable: false,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'center',
        field: 'status',
        sortable: false,
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
    pages: general_contract_inquiry_pages.value
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const alertModalDeleteRef = ref()
  const alertModalStatusRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    entityId: null as number | null,
    action: '',
  })


  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getGeneralContractInquiryList(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[state]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      rows: perPage,
    }
    await listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) => {
    await listAction({ ...filtersFormat.value, page })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
      page: 1,
    }

    await listAction(filtersFormat.value)
  }

  const handleClear = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }


  onMounted(async () => {
    openMainLoader(true)

    const trustBusinessStore = useTrustBusinessResourceStore('v1')
    const derivativeContractingStore = useDerivativeContractingResourceStore('v1')


    await _getResources(
      { trust_business: ['business_trusts'] },
      'filter[account_consolidator]=true',
      'v1'
    )

    businessTrustsConsolidator.value = [...trustBusinessStore.business_trusts]
    const consolidatorFilter = filterConfig.value.find(
      (f) => f.name === 'business_trusts_id'
    )
    if (consolidatorFilter)
      consolidatorFilter.options = businessTrustsConsolidator.value


    await _getResources(
      { trust_business: ['business_trusts'] },
      'filter[status_id]=57',
      'v1'
    )

    businessTrustsFrom.value = [...trustBusinessStore.business_trusts]
    businessTrustsTo.value = [...trustBusinessStore.business_trusts]

    const fromFilter = filterConfig.value.find(
      (f) => f.name === 'from_business_id '
    )
    if (fromFilter) fromFilter.options = businessTrustsFrom.value

    const toFilter = filterConfig.value.find((f) => f.name === 'to_business_id')
    if (toFilter) toFilter.options = businessTrustsTo.value

    await _getResources(
      { derivative_contracting: ['contract_status_grouped'] },
      '',
      'v1'
    )
    contractStatusGrouped.value = [...derivativeContractingStore.contract_status_grouped]

    await _getResources(
      { derivative_contracting: ['contract_type'] },
      '',
      'v1'
    )
    documentTypes.value = [...derivativeContractingStore.contract_type]

    await _getResources(
      { derivative_contracting: ['contract_type_category'] },
      '',
      'v1'
    )
    categoryTypes.value = [...derivativeContractingStore.contract_type_category]

    await _getResources(
      { derivative_contracting: ['contract_type_modality'] },
      '',
      'v1'
    )
    modalityTypes.value = [...derivativeContractingStore.contract_type_modality]


    await _getResources(
      { derivative_contracting: ['contract_stages'] },
      '',
      'v1'
    )
    contractStageList.value = [...derivativeContractingStore.contract_stages]


    await _getResources({ treasury: ['third_parties'] })


    setTimeout(() => openMainLoader(false), 1000)
  })


  const openAlertModal = async (action: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.title = `¿Desea ${action} el documento anexo?`
    alertModalConfig.value.action =
      action === 'activar' ? 'activate' : 'inactivate'

    action === 'eliminar'
      ? await alertModalDeleteRef.value.openModal()
      : await alertModalStatusRef.value.openModal()
  }

  const changeStatusAction = async () => {
    if (!alertModalConfig.value.entityId) return

    openMainLoader(true)
    await _changeStatus(
      alertModalConfig.value.entityId,
      alertModalConfig.value.action
    )

    await listAction(filtersFormat.value)

    openMainLoader(false)
    await alertModalStatusRef.value.closeModal()
  }

  const deleteAction = async () => {
    if (!alertModalConfig.value.entityId) return

    openMainLoader(true)


    await listAction(filtersFormat.value)

    openMainLoader(false)
    await alertModalDeleteRef.value.closeModal()
  }


  const downloadFile = async () => {
    const params = {
      ...(selectedContractId.value && { contract_id: selectedContractId.value }),
      ...(selectedAdditionId.value && { addition_id: selectedAdditionId.value }),
    }

    if (!selectedContractId.value) return

    openMainLoader(true)
    await _downloadGeneralContractInquiry(
      params
    )
    openMainLoader(false)
  }


  watch(
    () => general_contract_inquiry_list.value,
    () => {
      tableProps.value.rows = general_contract_inquiry_list.value

      const { currentPage, lastPage } = general_contract_inquiry_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )


  watch(contractsAddendaSelected, async () => {
    if (contractsAddendaSelected.value) {
      const selectedRow = tableProps.value.rows.find(
        (row) => row.id === contractsAddendaSelected.value
      )
      if (selectedRow) {
        selectedContractId.value = selectedRow.id ?? null
        selectedAdditionId.value = selectedRow.addition_id ?? null
      }
    } else {
      selectedContractId.value = null
      selectedAdditionId.value = null
    }
  })



  return {
    alertModalDeleteRef,
    alertModalStatusRef,
    alertModalConfig,

    validateRouter,
    handleFilter,
    handleClear,
    filtersRef,
    headerProps,
    defaultIconsLucide,
    filterConfig,
    goToURL,

    tableProps,
    updatePage,
    updatePerPage,
    downloadFile,
    openAlertModal,
    changeStatusAction,
    deleteAction,

    contractsAddendaSelected,
    selectedContractId,
    selectedAdditionId,
  }
}

export default useGeneralContractInquiryList