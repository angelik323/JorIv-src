import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

import { IMonetaryOperation } from '@/interfaces/customs/fics/InvestmentPlanOperations'
import { ITabs } from '@/interfaces/global'

import { useInvestmentPlanOperationStore } from '@/stores/fics/investment-plan-operations'
import { storeToRefs } from 'pinia'

const useInvestmentPlanOperationView = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _showAction, _showDetailsAction } =
    useInvestmentPlanOperationStore('v1')
  const { operation_number } = storeToRefs(
    useInvestmentPlanOperationStore('v1')
  )

  const viewOperationFormRef = ref()

  const investmentPlanOperationId = +route.params.id

  const initialData = ref<IMonetaryOperation>({
    id: 0,
    operation_number: 0,
    operation_request: 0,
    operation_value: 0,
    type: '',
    request_date: '',
    compliance_date: '',
    closing_date: null,
    investment_plan: '',
    plan_balance: '',
    maximum_value: 0,
    business_trust_code: '',
    business_trust_name: '',
    plan_business_trust_code: '',
    fund_code: '',
    fund_name: '',
    office: '',
    office_code: '',
    holder_identification: '',
    holder_name: '',
  })

  const headerProps = {
    title: 'Consulta de operación monetaria',
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
        label: 'Consulta de operación monetaria',
        route: 'InvestmentPlanOperationView',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const loadData = async () => {
    openMainLoader(true)

    const success = await _showAction(investmentPlanOperationId)

    await _showDetailsAction(investmentPlanOperationId)

    if (success) initialData.value = success

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleGoTo = (route?: string) => {
    switch (route) {
      case 'con':
        goToURL('AccountingReceiptView', investmentPlanOperationId)
        break
      case 'mov':
        if (viewOperationFormRef.value.formData.investment_plan_id)
          operation_number.value =
            viewOperationFormRef.value.formData.operation_number ?? null
        goToURL(
          'CheckBalancesPlanList',
          viewOperationFormRef.value.formData.investment_plan_id
        )
        break
      case 'tes':
        goToURL('CheckBankAccountMovementList')
        break
      default:
        goToURL('InvestmentPlanOperationList')
        break
    }
  }

  onMounted(() => loadData())

  return {
    tabs,
    tabActive,
    handleGoTo,
    headerProps,
    initialData,
    tabActiveIdx,
    defaultIconsLucide,
    viewOperationFormRef,
  }
}

export default useInvestmentPlanOperationView
