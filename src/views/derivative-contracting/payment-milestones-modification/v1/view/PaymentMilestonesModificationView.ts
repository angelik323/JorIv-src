import { ref, onBeforeMount, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Composables
import { useUtils, useGoToUrl, useMainLoader, useAlert } from '@/composables'

// Stores
import { usePaymentMilestonesModificationStore } from '@/stores/derivative-contracting/payment-milestones-modification'

// Interfaces
import { IBaseTableProps, ITabs } from '@/interfaces/global'
import {
  IPaymentMilestoneForm,
  IMilestoneDetail,
  IPaymentMilestonesModificationResponseData,
} from '@/interfaces/customs/derivative-contracting/PaymentMilestonesModification'

const usePaymentMilestonesModificationView = () => {
  const route = useRoute()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide, formatCurrencyString } = useUtils()
  const { openMainLoader } = useMainLoader()

  const { payment_milestones_modification_view } = storeToRefs(
    usePaymentMilestonesModificationStore('v1')
  )
  const { _getPaymentMilestonesModificationView, _clearData } =
    usePaymentMilestonesModificationStore('v1')

  // Capture parameters from route
  const contractId = route.params.contract_id
  const aditionId = route.params.adition_id
  const milestoneNumber = route.params.milestone_number

  // Data for the information form
  const data_information_form = ref<IPaymentMilestoneForm | null>(null)

  const headerProps = {
    title: 'Ver modificación hitos de pago',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada' },
      {
        label: 'Modificación hitos de pago',
        route: 'paymentMilestonesModificationList',
      },
      {
        label: 'Ver',
        route: 'PaymentMilestonesModificationView',
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
        field: (row) => row.foreign_amount,
        format: (val) => formatCurrencyString(val) || '0',
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
        field: (row) => (row.applies_budget ? 'Sí' : 'No'),
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

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
      C_stage: data.contract?.status?.name ?? '',
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

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await _getPaymentMilestonesModificationView(
      Number(contractId),
      Number(aditionId),
      {}
    )
    openMainLoader(false)
  })

  watch(
    () => payment_milestones_modification_view.value,
    (val) => {
      if (val) {
        setFullInformationForm(val)
        if (val.contract?.milestones) {
          tableProps.value.rows = val.contract.milestones.map((m, index) => ({
            ...m,
            contract_id: index + 1,
            local_amount: String(m.local_amount),
            foreign_amount: Number(m.foreign_amount),
          }))
        }
      }
    },
    { deep: true, immediate: true }
  )

  const totalProgramacion = computed(() => {
    const milestones =
      payment_milestones_modification_view.value?.contract?.milestones || []

    if (milestones.length > 0) {
      const foreign = milestones.reduce(
        (acc, curr) => acc + Number(curr.foreign_amount || 0),
        0
      )
      const cop = milestones.reduce(
        (acc, curr) => acc + Number(curr.local_amount || 0),
        0
      )
      return {
        foreign_amount: foreign,
        cop_amount: cop,
      }
    }

    if (payment_milestones_modification_view.value?.totales) {
      return {
        foreign_amount:
          payment_milestones_modification_view.value.totales
            .total_programacion_extranjero,
        cop_amount:
          payment_milestones_modification_view.value.totales
            .total_programacion_cop,
      }
    }
    return {
      foreign_amount: 0,
      cop_amount: 0,
    }
  })

  // Modals logic
  const alertModalPaymentOrderRef = ref()
  const paymentOrderListRef = ref()
  const contractSubscriptionDate = computed(
    () => data_information_form.value?.C_subscription_date || ''
  )
  const isLocalCurrency = computed(
    () => data_information_form.value?.currency === 'COP'
  )
  const contractValue = computed(() => {
    return Number(
      payment_milestones_modification_view.value?.contract?.contract_value || 0
    )
  })
  const foreignValue = computed(() => {
    return Number(
      payment_milestones_modification_view.value?.contract?.amount || 0
    )
  })
  const trm = computed(() => {
    return 0
  })
  const currentTotalLocal = computed(() => totalProgramacion.value.cop_amount)
  const currentTotalForeign = computed(
    () => totalProgramacion.value.foreign_amount
  )
  const nextMilestoneNumber = computed(
    () => data_information_form.value?.milestone || '001'
  )

  const openPaymentOrderModal = () => {
    alertModalPaymentOrderRef.value.openModal()
    if (paymentOrderListRef.value) {
      paymentOrderListRef.value.resetForm()
    }
  }

  const closeModal = () => {
    alertModalPaymentOrderRef.value?.closeModal()
  }

  const handleAddMilestone = () => {
    useAlert().showAlert('Esta vista es de solo lectura.', 'info')
    closeModal()
  }

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

  return {
    headerProps,
    data_information_form,
    tableProps,
    goToURL,
    totalProgramacion,
    defaultIconsLucide,
    formatCurrencyString,

    // Tabs
    tabs,
    tabActive,
    tabActiveIdx,

    // Modal related
    alertModalPaymentOrderRef,
    paymentOrderListRef,
    openPaymentOrderModal,
    closeModal,
    contractSubscriptionDate,
    isLocalCurrency,
    contractValue,
    foreignValue,
    trm,
    currentTotalLocal,
    currentTotalForeign,
    nextMilestoneNumber,
    handleAddMilestone,
    contractId,
  }
}

export default usePaymentMilestonesModificationView
