// Vue - Pinia - Router - Quasar
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

//Composables
import { useMainLoader, useGoToUrl, useRouteValidator, useUtils } from '@/composables'

//Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import {
  IPaymentMilestonesModificationList,
  IPaymentMilestonesModificationList2,
} from '@/interfaces/customs/derivative-contracting/PaymentMilestonesModification'

// stores
import { usePaymentMilestonesModificationStore } from '@/stores/derivative-contracting/payment-milestones-modification'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useResourceManagerStore } from '@/stores/resources-manager'

//Constants
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

const usePaymentMilestonesModificationList = () => {
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()

  const {
    payment_milestones_modification_list,
    payment_contract_modification_milestones,
    payment_milestones_modification_pages,
  } = storeToRefs(usePaymentMilestonesModificationStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { contract_type_id_name, contract_stages } = storeToRefs(
    useDerivativeContractingResourceStore('v1')
  )
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))

  const keys = {
    derivative_contracting: ['contract_type_id_name', 'contract_stages'],
    trust_business: ['business_trusts'],
  }

  const thirdPartiesKeys = {
    third_party: ['third_parties'],
  }

  const contractsAddendaSelected = ref<IPaymentMilestonesModificationList | null>(null)

  const {
    _getPaymentMilestonesModification,
    _getPaymentMilestonesModificationById,
  } = usePaymentMilestonesModificationStore('v1')

  let perPage = 20

  const localAmountTotal = ref<number>(0)
  const foreignAmountTotal = ref<number>(0)

  const { openMainLoader } = useMainLoader()

  const isTableEmpty = ref(true)
  const showState = ref(0)

  const { _clearData, _changeStatus, _deletePaymentMilestonesModification } =
    usePaymentMilestonesModificationStore('v1')

  const headerProps = {
    title: 'Modificación hitos de pago',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada' },
      {
        label: 'Modificación hitos de pago',
        route: 'PaymentMilestonesModificationList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_trusts_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-3',
      options: business_trusts,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'document_type',
      label: 'Tipo de contrato',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-3',
      options: contract_type_id_name,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'contractor_id',
      label: 'Contratista',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-3',
      options: third_parties,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'stage_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-3',
      options: contract_stages,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const alertModalDeleteRef = ref()
  const alertModalStatusRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    entityId: null as number | null,
    action: '',
  })

  const registeredContractsAddendaTable = ref<
    IBaseTableProps<IPaymentMilestonesModificationList>
  >({
    title: 'Listado de contratos y adiciones registrados',
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
        name: 'BT_business_code',
        required: true,
        label: 'Negocio',
        field: (row) => row.business_trust.business_code,
        align: 'left',
        sortable: true,
      },
      {
        name: 'DT_category',
        required: true,
        label: 'Categoría',
        align: 'left',
        field: (row) => row.document_type?.category,
        sortable: true,
      },
      {
        name: 'DT_contract_type',
        required: true,
        label: 'Tipo de contrato',
        align: 'left',
        field: (row) => row.document_type?.contract_type,
        sortable: true,
      },
      {
        name: 'modification_type',
        required: false,
        label: 'Tipo de modificación',
        align: 'center',
        field: (row) => row.modification_type || '-',
        sortable: true,
      },
      {
        name: 'DT_Modality',
        required: false,
        label: 'Modalidad',
        align: 'center',
        field: (row) => row.document_type?.modality,
        sortable: false,
      },
      {
        name: 'C_number',
        required: false,
        label: 'Número de contrato',
        align: 'center',
        field: (row) => row.contract.number,
        sortable: false,
      },
      {
        name: 'C_status_id',
        required: false,
        label: 'Estado',
        align: 'center',
        field: (row) => row.contract.stage.name,
        sortable: false,
      },
      {
        name: 'C_stage',
        required: false,
        label: 'Etapa',
        align: 'center',
        field: (row) => row.contract.stage.name,
        sortable: false,
      },
      {
        name: 'contractor',
        required: false,
        label: 'Contratista',
        align: 'center',
        field: (row) =>
          row.contractor?.business_name ||
          row.contractor?.name ||
          row.contractor?.document ||
          '-',
        sortable: false,
      },
      {
        name: 'frame_specific_contract',
        required: false,
        label: 'Contrato marco específico',
        align: 'center',
        field: () => '-',
        sortable: false,
      },
      {
        name: 'C_subscription_date',
        required: false,
        label: 'Fecha de suscripción',
        align: 'center',
        field: (row) => row.contract.subscription_date,
        sortable: false,
      },
    ],
    rows: [],
    pages: payment_milestones_modification_pages.value,
  })

  const paymentMilestonesTable = ref<
    IBaseTableProps<IPaymentMilestonesModificationList2>
  >({
    title: 'Listado de hitos de pago',
    loading: true,
    columns: [
      {
        name: 'milestone_number',
        required: true,
        label: 'Hito de pago',
        field: (row) => row.milestone_number,
        align: 'left',
        sortable: true,
      },
      {
        name: 'payment_type_id',
        required: true,
        label: 'Tipo de pago',
        field: (row) => row.payment_type_id,
        align: 'left',
        sortable: true,
      },
      {
        name: 'date',
        required: false,
        label: 'Fecha',
        align: 'center',
        field: 'date',
        sortable: false,
      },
      {
        name: 'foreign_amount',
        required: true,
        label: 'Monto extranjero',
        field: (row) => row.foreign_amount,
        align: 'left',
        sortable: true,
      },
      {
        name: 'local_amount',
        required: true,
        label: 'Valor hito local',
        field: (row) => useUtils().formatCurrencyString(row.local_amount),
        align: 'left',
        sortable: true,
      },
      {
        name: 'orden_pago_asociada',
        required: true,
        label: 'Orden de pago asociada',
        field: (row) => row.orden_pago_asociada,
        align: 'left',
        sortable: true,
      },
      {
        name: 'estado_orden_pago',
        required: true,
        label: 'Estado orden de pago',
        field: (row) => row.estado_orden_pago,
        align: 'left',
        sortable: true,
      },
      {
        name: 'applies_budget',
        required: true,
        label: 'Aplica presupuesto',
        field: (row) => row.applies_budget,
        align: 'left',
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
    pages: payment_milestones_modification_pages.value,
  })

  const handleFilter = async ($filters: {
    'filter[business_trusts_id]': string
    'filter[document_type]': string
    'filter[contractor_id]': string
    'filter[stage_id]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      rows: perPage,
    }
    await listAction(filtersFormat.value)
  }

  const listActionCollectionForm = async (params: string = '') => {
    paymentMilestonesTable.value.rows = []
    paymentMilestonesTable.value.loading = true
    await _getPaymentMilestonesModificationById(
      contractsAddendaSelected.value?.contract.id!,
      params
    )
    paymentMilestonesTable.value.loading = false
  }

  const listAction = async (filters: Record<string, string | number>) => {
    registeredContractsAddendaTable.value.rows = []
    registeredContractsAddendaTable.value.loading = true
    await _getPaymentMilestonesModification(filters)
    registeredContractsAddendaTable.value.loading = false

    const hasResults = payment_milestones_modification_list.value.length > 0

    isTableEmpty.value = !hasResults
    showState.value = filters ? 1 : 0

    paymentMilestonesTable.value.rows = []
    paymentMilestonesTable.value.loading = false
  }

  /*
  const listActionDetail = async (btBusinessCode: string) => {
    openMainLoader(true)
    registeredContractsAddendaTable.rows = []
    await _getPaymentMilestonesModificationByBTBusinessCode(btBusinessCode)

    const hasResults = fiduciary_investment_plan_list.value.length > 0

    isTableEmpty.value = !hasResults
    showState.value = filters ? 1 : 0

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }*/

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

  const updatePage2 = async (page: number) => {
    await listAction({ ...filtersFormat.value, page })
  }

  const updatePerPage2 = async (rowsPerPage: number) => {
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
    registeredContractsAddendaTable.value.rows = []
  }

  onMounted(async () => {
    _clearData()

    openMainLoader(true)
    await _getResources(
      thirdPartiesKeys,
      'include=legalPerson,financialInfo,naturalPerson,estate,documentType,contacts,addresses,status&filter[is_customer]=1&keys[]=third_parties&filter[third_party_category]=indirecto&fields[]=id,document,is_customer,third_party_category,document_type_id,status_id'
    ),
      await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  const clearFilters = () => {
    showState.value = 0
    isTableEmpty.value = true
    registeredContractsAddendaTable.value.rows = []
  }

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

    // Recargar la lista después de cambiar el estado para reflejar los cambios visuales
    await listAction(filtersFormat.value)

    openMainLoader(false)
    await alertModalStatusRef.value.closeModal()
  }

  const deleteAction = async () => {
    if (!alertModalConfig.value.entityId) return

    openMainLoader(true)
    await _deletePaymentMilestonesModification(alertModalConfig.value.entityId)
    openMainLoader(false)
    await alertModalDeleteRef.value.closeModal()
  }

  const handleEdit = (row: IPaymentMilestonesModificationList2) => {
    goToURL('PaymentMilestonesModificationEdit', {
      contract_id: String(row.contract_id),
      adition_id: String(row.id),
      milestone_number: row.milestone_number,
    })
  }

  const handleView = (row: IPaymentMilestonesModificationList2) => {
    goToURL('PaymentMilestonesModificationView', {
      contract_id: String(row.contract_id),
      adition_id: String(row.id),
      milestone_number: row.milestone_number,
    })
  }

  watch(
    () => payment_milestones_modification_list.value,
    () => {
      registeredContractsAddendaTable.value.rows =
        payment_milestones_modification_list.value

      const { currentPage, lastPage } =
        payment_milestones_modification_pages.value
      registeredContractsAddendaTable.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  watch(
    () => payment_contract_modification_milestones.value,
    () => {
      paymentMilestonesTable.value.rows =
        payment_contract_modification_milestones.value.milestones
      localAmountTotal.value =
        payment_contract_modification_milestones.value.local_amount_total
      foreignAmountTotal.value = 0
      //payment_contract_modification_milestones.value.foreign_amount_total
    },
    { deep: true }
  )

  const handleContractAddendaSelected = (
    contract: IPaymentMilestonesModificationList
  ) => {
    contractsAddendaSelected.value = contract
    const filterContractsAddenda = formatParamsCustom({
      contract_addenda_id: contract.addition_id ?? contract.contract.id,
    })
    listActionCollectionForm(
      filterContractsAddenda ? `&${filterContractsAddenda}` : ''
    )
    
  } 


  return {
    localAmountTotal,
    foreignAmountTotal,
    headerProps,
    defaultIconsLucide,
    goToURL,
    filterConfig,
    registeredContractsAddendaTable,
    paymentMilestonesTable,
    contractsAddendaSelected,
    handleContractAddendaSelected,

    handleFilter,
    handleClear,
    handleEdit,
    handleView,
    clearFilters,
    showState,
    isTableEmpty,

    updatePage,
    updatePerPage,
    updatePage2,
    updatePerPage2,

    openAlertModal,
    changeStatusAction,
    deleteAction,
    alertModalDeleteRef,
    alertModalStatusRef,
    alertModalConfig,
    validateRouter,
  }
}

export default usePaymentMilestonesModificationList
