// Vue - Vue Router - Pinia
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { IToggleAuthorizationInvestmentPlanOperationPayload } from '@/interfaces/customs/fics/InvestmentPlanOperationCompliance'
import {
  InvestmentPlanOperationSubtype,
  InvestmentPlanOperationTtype,
} from '@/interfaces/customs/fics/InvestmentPlanOperations'
import { ITabs } from '@/interfaces/global'

// Composables
import { useUtils, useMainLoader, useGoToUrl } from '@/composables'

// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Stores
import { useInvestmentPlanOperationComplianceStore } from '@/stores/fics/investment-plan-operation-compliance'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useCompliance = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const {
    _setSelectedFund,
    _toggleAuthorization,
    _toggleApproveCancellation,
    _getInvesmentPlanOperation,
    _getInvesmentPlanOperationDetail,
  } = useInvestmentPlanOperationComplianceStore('v1')

  const {
    selected_fund,
    selected_fund_withdrawal,
    investment_plan_operation_response,
    investment_plan_operation_details_response,
  } = storeToRefs(useInvestmentPlanOperationComplianceStore('v1'))

  const investmentPlanOperationDetailForm = ref()
  const investmentPlanOperationForm = ref()

  const investmentPlanOperationId = +route.params.id

  const headerProps = {
    title: 'Cumplimiento de operaciones para aportes/retiros',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Registro de operaciones para Aportes/Retiros',
        route: 'InvestmentPlanOperationList',
      },
      {
        label: 'Cumplimiento de operaciones para aportes/retiros',
      },
    ],
  }

  const detailsTabLabel = computed(() => {
    const formData = investment_plan_operation_response.value

    const type = formData?.type
    const subtype = formData?.subtype

    if (subtype === 'cancelacion') {
      return 'Detalle operación de cancelación'
    }

    if (type && subtype) {
      return `Detalle operación de ${type} - ${subtype}`
    }

    return 'Detalle de operación'
  })

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'details',
      get label() {
        return detailsTabLabel.value
      },
      icon: defaultIconsLucide.sliders,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const exitOperationComplianceDetailModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const authOperationComplianceDetailModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const rejectOperationComplianceDetailModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )
  const operationType = ref<null | 'aporte' | 'retiro' | 'cancelacion'>()
  const operationSubType = ref<null | 'cancelacion'>()

  const authorizationButtonsDisabled = computed(() => {
    return (
      (operationType.value === 'aporte' &&
        (selected_fund.value === null || !selected_fund.value.id)) ||
      (operationType.value !== 'aporte' &&
        (selected_fund_withdrawal.value === null ||
          !selected_fund_withdrawal.value.id))
    )
  })

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  onMounted(async () => {
    openMainLoader(true)
    await _getResources({
      treasury: ['banks'],
    })

    if (investmentPlanOperationId) {
      await _getInvesmentPlanOperation(investmentPlanOperationId)

      operationType.value =
        (investment_plan_operation_response.value
          .type as InvestmentPlanOperationTtype) ?? 'aporte'

      operationSubType.value = investment_plan_operation_response.value
        ?.subtype as InvestmentPlanOperationSubtype
      _getInvesmentPlanOperationDetail(investmentPlanOperationId)
    }

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _setSelectedFund(null)

    _resetKeys({
      treasury: ['banks'],
    })
  })

  const createToggleAuthorizationPayload = (state_id: number) => {
    if (!operationType.value) return

    return <IToggleAuthorizationInvestmentPlanOperationPayload>{
      state_id: state_id,
      operation_type: operationType.value,
    }
  }

  const toggleAuthorizationInvestmenPlanOperation = async (
    state_id: number
  ) => {
    openMainLoader(true)
    const payload = createToggleAuthorizationPayload(state_id)
    if (
      payload &&
      investment_plan_operation_response.value &&
      investment_plan_operation_response.value.id
    ) {
      let success = false

      if (operationSubType.value === 'cancelacion') {
        success = await _toggleApproveCancellation({
          operation_investment_plan_id: String(
            investment_plan_operation_response.value.id
          ),
        })
      } else {
        success = await _toggleAuthorization(
          {
            ...payload,
            fund_id: investment_plan_operation_response.value.fund_id ?? null,
          },
          investment_plan_operation_response.value.id
        )
      }

      if (success)
        goToURL('InvestmentPlanOperationList', undefined, { reload: true })
    }
    openMainLoader(false)
  }

  const nextTab = () => {
    tabActive.value = filteredTabs.value[1].name
  }

  const handleOpenAuthOperationComplianceDetailModal = async () => {
    await authOperationComplianceDetailModalRef.value?.openModal()
  }

  const handleConfirmAuthOperationComplianceDetailModal = async () => {
    if (!authOperationComplianceDetailModalRef.value) return
    await toggleAuthorizationInvestmenPlanOperation(69)
    authOperationComplianceDetailModalRef.value.closeModal()
  }

  const handleOpenRejectOperationComplianceDetailModal = async () => {
    await rejectOperationComplianceDetailModalRef.value?.openModal()
  }

  const handleConfirmRejectOperationComplianceDetailModal = async () => {
    if (!rejectOperationComplianceDetailModalRef.value) return
    await toggleAuthorizationInvestmenPlanOperation(10)
    rejectOperationComplianceDetailModalRef.value.closeModal()
  }

  const handleOpenExitOperationComplianceDetailModal = async () => {
    await exitOperationComplianceDetailModalRef.value?.openModal()
  }

  const handleConfirmExitOperationComplianceDetailModal = async () => {
    if (!exitOperationComplianceDetailModalRef.value) return
    goToURL('InvestmentPlanOperationList', undefined, { reload: true })
    exitOperationComplianceDetailModalRef.value.closeModal()
  }

  return {
    nextTab,
    tabActive,
    headerProps,
    filteredTabs,
    tabActiveIdx,
    operationType,
    investmentPlanOperationForm,
    authorizationButtonsDisabled,
    investmentPlanOperationDetailForm,
    investment_plan_operation_response,
    exitOperationComplianceDetailModalRef,
    authOperationComplianceDetailModalRef,
    rejectOperationComplianceDetailModalRef,
    investment_plan_operation_details_response,
    handleOpenExitOperationComplianceDetailModal,
    handleOpenAuthOperationComplianceDetailModal,
    handleOpenRejectOperationComplianceDetailModal,
    handleConfirmExitOperationComplianceDetailModal,
    handleConfirmAuthOperationComplianceDetailModal,
    handleConfirmRejectOperationComplianceDetailModal,
  }
}

export default useCompliance
