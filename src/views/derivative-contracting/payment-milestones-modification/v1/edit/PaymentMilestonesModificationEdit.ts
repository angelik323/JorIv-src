// Vue - Pinia - Router - Quasar
import { ref, onUnmounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

//Composables
import { useUtils, useGoToUrl, useMainLoader, useAlert, useAlertModal } from '@/composables'

//Stores
import { usePaymentMilestonesModificationStore } from '@/stores/derivative-contracting/payment-milestones-modification'

//Interfaces
import { ITabs, IBaseTableProps } from '@/interfaces/global'

import {
  IPaymentMilestoneForm,
  IMilestoneDetail,
  INewMilestoneFormState,
  IPaymentMilestonesModificationResponseData,
  IDistributedMilestoneRequest,
  IDistributedMilestoneItem,
} from '@/interfaces/customs/derivative-contracting/PaymentMilestonesModification'

const usePaymentMilestonesModificationEdit = () => {
  const route = useRoute()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide, formatCurrencyString } = useUtils()
  const { showAlert } = useAlert()
  const { showAlertInformation } = useAlertModal()

  const {
    //payment_milestones_modification_new_distribution,
    general_contract_information,
    
  } = storeToRefs(usePaymentMilestonesModificationStore('v1'))

  // Capturar el ID del documento desde los parámetros de la ruta
  const contractId = route.params.contract_id
  const milestoneNumber = route.params.milestone_number
  const cNumber = String(route.params.c_number)

  //data de formularios
  const data_information_form = ref<IPaymentMilestoneForm | null>(null)
  const originalRows = ref<IMilestoneDetail[]>([])

  const {
    _setDataInformationForm,
    _updatePaymentMilestonesModificationDistributed,
    _changeStatus,
  } = usePaymentMilestonesModificationStore('v1')

  // const informationFormRef = ref()

  const { openMainLoader } = useMainLoader()

  const headerProps = {
    title: 'Editar modificación hitos de pago',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada' },
      {
        label: 'Modificación hitos de pago',
        route: 'PaymentMilestonesModificationList',
      },
      {
        label: 'Editar',
        route: 'PaymentMilestonesModificationEdit',
      },
      { label: `${milestoneNumber}` },
    ],
  }

  const tableProps = ref<IBaseTableProps<IMilestoneDetail>>({
    title: 'Nueva distribución de hito de pago',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'contract_id',
        required: true,
        label: '#',
        align: 'left',
        field: 'contract_id',
        sortable: true,
      },
      {
        name: 'milestone_number',
        required: true,
        label: 'Hito',
        align: 'left',
        field: (row) => row.milestone_number,
        sortable: true,
      },
      {
        name: 'payment_type_id',
        required: true,
        label: 'Tipo de pago',
        align: 'left',
        field: (row) => row.payment_type_id,
        sortable: true,
      },
      {
        name: 'scheduled_date',
        required: true,
        label: 'Nueva fecha',
        align: 'left',
        field: (row) => row.scheduled_date,
        sortable: true,
      },
      {
        name: 'foreign_amount',
        required: true,
        label: 'Nuevo monto extranjero',
        align: 'right',
        field: (row) => (row.foreign_amount),
        sortable: true,
      },
      {
        name: 'local_amount',
        required: true,
        label: 'Nuevo monto COP',
        align: 'right',
        field: (row) => row.local_amount,
        format: (val) => formatCurrencyString(val) || '0',
        sortable: true,
      },
      {
        name: 'applies_budget',
        required: true,
        label: 'Aplica presupuesto',
        align: 'center',
        field: 'applies_budget',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
        sortable: false,
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const tabs: ITabs[] = [
    {
      label: 'Información del contrato',
      name: 'information',
      icon: '',
      outlined: false,
      disable: false,
      show: true,
      required: false,
    },
  ]

  const tabActive = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === tabActive.value)
  )

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



  // const validateForms = async () => {
  //   return true
  // }

  const onSubmit = async () => {
    const validation = validateMilestones()
    if (!validation.valid) {
      showAlert(validation.message || '', 'error')
      return
    }

    openMainLoader(true)
    const milestoneId =
      general_contract_information.value?.milestone_selected?.id

    if (!milestoneId) {
      openMainLoader(false)
      return
    }

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

    openMainLoader(false)
  }

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  const rowsPerPage = ref(10)

  const updatePage = (page: number) => {
    tableProps.value.pages.currentPage = page
    // fetchData()
  }

  const updatePerPage = (rows: number) => {
    rowsPerPage.value = rows
    tableProps.value.pages.currentPage = 1
    // fetchData()
  }

  //lo comento porque segun la HU debe estar vacia la tabla
  //payment_milestones_modification_new_distribution
  // watch(
  //   () => payment_milestones_modification_new_distribution.value,
  //   () => {
  //     tableProps.value.rows =
  //       payment_milestones_modification_new_distribution.value
  //   },
  //   { deep: true }
  // )

  watch(
    () => general_contract_information.value,
    (val) => {
      if (val) {
        setFullInformationForm(val)
        if (val.contract?.milestones && tableProps.value.rows.length === 0) {
          const mapped = val.contract.milestones.map((m, index) => ({
            ...m,
            contract_id: index + 1,
            local_amount: String(m.local_amount),
            foreign_amount: Number(m.foreign_amount),
          }))
          tableProps.value.rows = [...mapped]
          originalRows.value = [...mapped]
        }
      }
    },
    { deep: true, immediate: true }
  )

  const alertModalStatusRef = ref()
  const alertModalConfig = ref({
    title: 'Confirmación',
  })

  // --- Payment Order & Budget Document Modals ---
  const alertModalPaymentOrderRef = ref()
  const paymentOrderListRef = ref()

  const alertModalBudgetDocumentRef = ref()
  const budgetDocumentListRef = ref()

  // --- New Milestone Modal Logic ---
  const alertModalNewMilestoneRef = ref()
  const milestoneFormRef = ref()

  // --- Future Terms Modal Logic ---
  const alertModalFutureTermsRef = ref()
  const futureTermsFormRef = ref()

  // --- Allocated Budget Modal Logic ---
  const alertModalAllocatedBudgetRef = ref()
  const allocatedBudgetFormRef = ref()

  const contractSubscriptionDate = computed(
    () => data_information_form.value?.C_subscription_date || ''
  )
  const isLocalCurrency = computed(
    () => data_information_form.value?.currency === 'COP'
  )
  const contractValue = computed(() => 1000000000) // Mocked: Should come from contract details
  const foreignValue = computed(() => 5000) // Mocked: Should come from contract details
  const trm = computed(() => 4000) // Mocked: Should come from contract details

  const currentTotalLocal = computed(() => {
    return tableProps.value.rows.reduce(
      (acc, row) => acc + Number(row.local_amount || 0),
      0
    )
  })

  const currentTotalForeign = computed(() => {
    return tableProps.value.rows.reduce(
      (acc, row) => acc + Number(row.foreign_amount || 0),
      0
    )
  })

  const totalProgramacion = computed(() => {
    const scheduledForeign = currentTotalForeign.value
    const scheduledLocal = currentTotalLocal.value

    return {
      foreign_amount: scheduledForeign,
      cop_amount: scheduledLocal,
      pending_foreign: foreignValue.value - scheduledForeign,
      pending_local: contractValue.value - scheduledLocal,
    }
  })

  const nextMilestoneNumber = computed(() => {
    if (tableProps.value.rows.length === 0) return '001'

    const max = tableProps.value.rows.reduce((max, row) => {
      const num = parseInt(row.milestone_number, 10)
      return isNaN(num) ? max : Math.max(max, num)
    }, 0)

    return String(max + 1).padStart(3, '0')
  })

  const changeStatusAction = async () => {
    await _changeStatus(selectedMilestoneId.value, '1')
    // await fetchData()
    alertModalStatusRef.value.closeModal()
  }

  const openNewMilestoneModal = () => {
    alertModalNewMilestoneRef.value.openModal()
    if (milestoneFormRef.value) {
      milestoneFormRef.value.resetForm()
    }
  }

  const selectedMilestoneId = ref(0)

  const openAllocatedBudgetModal = (id: number | string) => {
    selectedMilestoneId.value = Number(id)
    alertModalAllocatedBudgetRef.value.openModal()
  }

  const openFutureTermsModal = (id: number | string) => {
    selectedMilestoneId.value = Number(id)
    alertModalFutureTermsRef.value.openModal()
  }

  const deleteMilestone = (id: number) => {
    const index = tableProps.value.rows.findIndex((row) => row.id === id)
    if (index !== -1) {
      tableProps.value.rows.splice(index, 1)
    }

    if (tableProps.value.rows.length === 0) {
      showAlert('Debe asociar al menos 1 hito de pago', 'error')
    }
  }

  const validateMilestones = () => {
    if (tableProps.value.rows.length === 0) {
      return { valid: false, message: 'Debe asociar al menos 1 hito de pago' }
    }

    const currentOriginalIds = tableProps.value.rows
      .filter((r) => r.id !== 0)
      .map((r) => r.id)
    const originalIds = originalRows.value.map((r) => r.id)

    const hasDeletedOriginal = originalIds.some(
      (id) => !currentOriginalIds.includes(id)
    )
    const hasNewHitos = tableProps.value.rows.some((r) => r.id === 0)

    if (hasDeletedOriginal && !hasNewHitos) {
      return {
        valid: false,
        message:
          'Ha borrado hitos originales, debe agregar al menos 1 nuevo hito',
      }
    }

    return { valid: true }
  }

  const handleBack = async () => {
    const validation = validateMilestones()
    if (!validation.valid) {
      const confirmed = await showAlertInformation({
        title: 'Confirmación',
        description: `${validation.message}. ¿Desea salir de todos modos? Se reestablecerán los cambios.`,
        icon: 'warning',
        show_cancel_button: true,
      })

      if (confirmed) {
        tableProps.value.rows = [...originalRows.value]
        goToURL('PaymentMilestonesModificationList')
      }
    } else {
      goToURL('PaymentMilestonesModificationList')
    }
  }

  const openPaymentOrderModal = () => {
    alertModalPaymentOrderRef.value.openModal()
    if (paymentOrderListRef.value) {
      paymentOrderListRef.value.resetForm()
    }
  }

  const openBudgetDocumentModal = () => {
    if (alertModalBudgetDocumentRef.value) {
      alertModalBudgetDocumentRef.value.openModal()
    }
    if (budgetDocumentListRef.value) {
      budgetDocumentListRef.value.resetForm()
    }
  }

  const closeModal = () => {
    alertModalNewMilestoneRef.value?.closeModal()
    alertModalPaymentOrderRef.value?.closeModal()
    alertModalBudgetDocumentRef.value?.closeModal()
    alertModalFutureTermsRef.value?.closeModal()
    alertModalAllocatedBudgetRef.value?.closeModal()
  }

  const handleAddMilestone = (formData: INewMilestoneFormState) => {
    const newRow: IMilestoneDetail = {
      id: 0, // Temporary ID for new rows
      contract_id: Number(contractId),
      milestone_number: formData.milestone_number,
      payment_type_id: Number(formData.payment_type_id),
      scheduled_date: formData.date,
      foreign_amount: Number(formData.foreign_amount || 0),
      local_amount: String(formData.local_amount || 0),
      applies_budget: formData.apply_budget,
    }

    tableProps.value.rows.push(newRow)
    closeModal()
  }

  return {
    data_information_form,
    headerProps,
    defaultIconsLucide,
    tabActive,
    tabActiveIdx,
    tabs,
    tableProps,
    updatePage,
    updatePerPage,
    alertModalStatusRef,
    alertModalConfig,
    deleteMilestone,
    handleBack,
    changeStatusAction,

    onSubmit,
    goToURL,
    totalProgramacion,
    cNumber,
    openNewMilestoneModal,
    openFutureTermsModal,
    openAllocatedBudgetModal,
    closeModal,
    alertModalNewMilestoneRef,
    handleAddMilestone,
    contractSubscriptionDate,
    isLocalCurrency,
    contractValue,
    foreignValue,
    trm,
    currentTotalLocal,
    currentTotalForeign,
    nextMilestoneNumber,
    formatCurrencyString,
    milestoneFormRef,
    alertModalPaymentOrderRef,
    paymentOrderListRef,
    alertModalBudgetDocumentRef,
    budgetDocumentListRef,
    openPaymentOrderModal,
    openBudgetDocumentModal,
    alertModalFutureTermsRef,
    alertModalAllocatedBudgetRef,
    futureTermsFormRef,
    allocatedBudgetFormRef,
    validateRouter: () => true,
    selectedMilestoneId,
    contractId,
  }
}

export default usePaymentMilestonesModificationEdit
