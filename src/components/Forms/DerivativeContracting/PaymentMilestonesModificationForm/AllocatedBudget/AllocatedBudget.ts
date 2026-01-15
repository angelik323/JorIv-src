// Vue - Pinia - Router - Quasar
import { ref, onUnmounted, onBeforeMount, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

//Composables
import { useUtils, useGoToUrl, useMainLoader } from '@/composables'

//Stores
import { usePaymentMilestonesModificationStore } from '@/stores/derivative-contracting/payment-milestones-modification'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'

//Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IGenericResource } from '@/interfaces/customs/resources/Common'

import {
  IPaymentMilestoneForm,
  IPaymentMilestonesModificationResponseData,
  INewBudgetDistributionItem,
  IAllocatedBudgetProps,
} from '@/interfaces/customs/derivative-contracting/PaymentMilestonesModification'

const useAllocatedBudget = (
  props: IAllocatedBudgetProps,
  emits: (event: 'submit' | 'cancel') => void
) => {
  const route = useRoute()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide, formatCurrencyString } = useUtils()

  const { _getResources } = useResourceManagerStore('v1')


  const budgetDocumentOptionsSelector = ref<IGenericResource[]>([])

  const {
    //payment_milestones_modification_new_distribution,
    general_contract_information,
    
  } = storeToRefs(usePaymentMilestonesModificationStore('v1'))

  // Capturar el ID del documento desde los parámetros de la ruta
  const contractId = route.params.contract_id
  const aditionId = route.params.adition_id
  const milestoneNumber = route.params.milestone_number
  const cNumber = String(route.params.c_number)

  //data de formularios
  const data_information_form = ref<IPaymentMilestoneForm | null>(null)

  const {
    _setDataInformationForm,
    _getContractBudgetDocument,
    _clearData,
    _deletePaymentMilestonesModification,
    _changeStatus,
    _getGeneralContractInformation,
  } = usePaymentMilestonesModificationStore('v1')

  const { openMainLoader } = useMainLoader()

  const tableProps = ref<IBaseTableProps<INewBudgetDistributionItem>>({
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'fiscal_year',
        required: true,
        label: 'Vigencia',
        align: 'left',
        field: (row) => row.futureValidity?.fiscal_year,
        sortable: true,
      },
      {
        name: 'budget_doc_type',
        required: true,
        label: 'Tipo documento presupuestal',
        align: 'left',
        field: (row) => row.budget_document_type,
        sortable: true,
      },
      {
        name: 'budget_doc_number',
        required: true,
        label: 'Número documento',
        align: 'left',
        field: (row) => row.budget_document_number,
        sortable: true,
      },
      {
        name: 'budget_resource',
        required: true,
        label: 'Recurso',
        align: 'left',
        field: (row) =>
          row.futureValidity?.budget_resource
            ? `${row.futureValidity.budget_resource.code} - ${row.futureValidity.budget_resource.description}`
            : '',
        sortable: true,
      },
      {
        name: 'budget_area',
        required: true,
        label: 'Área',
        align: 'left',
        field: (row) => row.futureValidity?.budget_area?.label,
        sortable: true,
      },
      {
        name: 'budget_item',
        required: true,
        label: 'Rubro',
        align: 'left',
        field: (row) => row.futureValidity?.budget_item?.label,
        sortable: true,
      },
      {
        name: 'budget_value',
        required: true,
        label: 'Valor presupuesto',
        align: 'right',
        field: (row) => row.futureValidity?.projected_value,
        format: (val) => formatCurrencyString(val) || '0',
        sortable: true,
      },
      {
        name: 'assigned_amount',
        required: true,
        label: 'Nuevo monto distribución',
        align: 'right',
        field: 'assigned_amount',
        format: (val) => formatCurrencyString(val) || '0',
        sortable: false,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: (row) => row,
        sortable: false,
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  // Used in v-if
  const tabActive = ref('information')

  const setFullInformationForm = (
    data: IPaymentMilestonesModificationResponseData
  ) => {
    const contractorString = (() => {
      if (Array.isArray(data.contractor)) {
        const firstContractor = data.contractor[0]
        if (!firstContractor) return ''
        return `${firstContractor.document ?? ''} - ${
          firstContractor.natural_person?.full_name ?? ''
        }`
      }
      return data.contractor || ''
    })()

    data_information_form.value = {
      C_number: data.contract?.contract_number ?? '',
      BT_name: data.business_trust[0]?.name ?? '',
      DT_contract_type:
        data.contract?.contract_document?.document_type?.document_name ?? '',
      C_stage: data.contract?.status?.label ?? '',
      C_subscription_date: data.contract?.subscription_date ?? '',
      contractor: contractorString,
      currency: data.contract?.currency_id ?? '',
      DT_Modality:
        data.contract?.contract_document?.document_type?.modality_name ?? '',
      milestone:
        data.milestone_selected?.milestone_number ?? milestoneNumber ?? '',
      payment_type: data.milestone_selected?.payment_type?.name
        ? String(data.milestone_selected?.payment_type?.name)
        : '',
      date: data.milestone_selected?.scheduled_date ?? '',
      foreign_amount: data.milestone_selected?.foreign_amount ?? '',
      cop_value: data.milestone_selected?.local_amount ?? '',
    }
  }

  const onSubmit = async () => {
    openMainLoader(true)
    const milestoneId =
      general_contract_information.value?.milestone_selected?.id

    if (!milestoneId) {
      openMainLoader(false)
      return
    }

    // TODO: Fix payload mapping for new table structure
    /*
    const milestones: IDistributedMilestoneItem[] = tableProps.value.rows.map(
      (row) => ({
        payment_type_id: Number(row.payment_type_id),
        scheduled_date: row.scheduled_date,
        foreign_amount: Number(row.foreign_amount || 0),
        local_amount: Number(row.local_amount),
        applies_budget: row.applies_budget,
      })
    )

    const payload: IDistributedMilestoneRequest = {
      id: milestoneId,
      milestones: milestones,
    }

    const success = await _updatePaymentMilestonesModificationDistributed(
      milestoneId,
      payload
    )

    if (success) {
      goToURL('PaymentMilestonesModificationList')
    }
    */

    openMainLoader(false)
  }

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)

    await _getGeneralContractInformation(Number(contractId), Number(aditionId), {})
    openMainLoader(false)
  })

  // const rowsPerPage = ref(10)

  const updatePage = (page: number) => {
    tableProps.value.pages.currentPage = page
  }

  const updatePerPage = (_rows: number) => {
    tableProps.value.pages.currentPage = 1
  }

  watch(
    () => general_contract_information.value,
    async (val) => {
      if (val) {
        setFullInformationForm(val)
        // Table population logic depends on new structure
        
        const milestoneId = val.milestone_selected?.id
        if (milestoneId) {
          await _getContractBudgetDocument(milestoneId, {})
        }
      }
    },
    { deep: true, immediate: true }
  )

  const { budget_records } = storeToRefs(usePaymentMilestonesModificationStore('v1'))

  const selectedBudgetDocument = ref(null)

  const budgetDocumentOptions = computed(() => {
    return budget_records.value.map((record) => ({
      label: record.contract_budget_document?.budget_document_number || '-',
      value: record.id,
    }))
  })

  onMounted(async () => {
    openMainLoader(true)
  
    const derivativeContractingStore = useDerivativeContractingResourceStore('v1')

    await _getResources(
      { derivative_contracting: ['payment_type_label'] },
      '',
      'v1'
    )
    budgetDocumentOptionsSelector.value = [...derivativeContractingStore.payment_type_label]

    setTimeout(() => openMainLoader(false), 1000)
  })

  const alertModalDeleteRef = ref()
  const alertModalStatusRef = ref()
  const alertModalConfig = ref({
    title: 'Confirmación',
  })

  // --- New Milestone Modal Logic ---
  const alertModalNewMilestoneRef = ref()
  const milestoneFormRef = ref()

  // --- Future Terms Modal Logic ---
  const alertModalFutureTermsRef = ref()
  const futureTermsFormRef = ref()

  // --- Allocated Budget Modal Logic ---
  const allocatedBudgetFormRef = ref()

  // Computed properties required for modals
  const contractSubscriptionDate = computed(
    () => props.contractSubscriptionDate
  )
  const isLocalCurrency = computed(
    () => props.isLocalCurrency
  )
  const contractValue = computed(() => props.contractValue)
  const foreignValue = computed(() => props.foreignValue)
  const trm = computed(() => props.trm)

  const currentTotalLocal = computed(() => props.currentTotalLocal)

  const currentTotalForeign = computed(() => props.currentTotalForeign)

  const nextMilestoneNumber = computed(() => props.milestoneNumber)

  const totalProgramacion = computed(
    () => general_contract_information.value?.totales.total_programacion_cop || 0
  )

  const deleteAction = async () => {
    if (selectedMilestoneId.value === 0) {
      tableProps.value.rows = tableProps.value.rows.filter((_) => {
        return true
      })
      closeModal()
    } else {
      await _deletePaymentMilestonesModification(selectedMilestoneId.value)
      // await fetchData()
      alertModalDeleteRef.value.closeModal()
    }
  }

  const changeStatusAction = async () => {
    await _changeStatus(selectedMilestoneId.value, '1')
    alertModalStatusRef.value.closeModal()
  }

  const openNewMilestoneModal = () => {
    alertModalNewMilestoneRef.value.openModal()
    if (milestoneFormRef.value) {
      milestoneFormRef.value.resetForm()
    }
  }

  const selectedMilestoneId = ref(props.milestones_id)

  const openFutureTermsModal = (id: number) => {
    selectedMilestoneId.value = id
    alertModalFutureTermsRef.value.openModal()
  }

  const openAlertModalDeleteMilestone = (id: number) => {
    selectedMilestoneId.value = id
    alertModalDeleteRef.value.openModal()
  }

  const closeModal = () => {
    alertModalNewMilestoneRef.value?.closeModal()
    alertModalFutureTermsRef.value?.closeModal()
    emits('cancel')
  }



  return {
    data_information_form,
    defaultIconsLucide,
    tabActive,
    onSubmit,
    goToURL,
    tableProps,
    updatePage,
    updatePerPage,
    
    // Modals
    alertModalDeleteRef,
    alertModalStatusRef,
    alertModalConfig,
    alertModalNewMilestoneRef,
    milestoneFormRef,
    alertModalFutureTermsRef,
    futureTermsFormRef,
    allocatedBudgetFormRef,

    // Modals and Actions
    openAlertModalDeleteMilestone,
    deleteAction,
    changeStatusAction,
    openNewMilestoneModal,
    openFutureTermsModal,
    closeModal,

    // Computed
    cNumber,
    contractSubscriptionDate,
    isLocalCurrency,
    contractValue,
    foreignValue,
    trm,
    currentTotalLocal,
    currentTotalForeign,
    nextMilestoneNumber,
    totalProgramacion,
    
    // Utils
    formatCurrencyString,

    // Selector
    selectedBudgetDocument,
    budgetDocumentOptions,

    // State
    selectedMilestoneId,
    contractId,
    aditionId,
  }
}

export default useAllocatedBudget
