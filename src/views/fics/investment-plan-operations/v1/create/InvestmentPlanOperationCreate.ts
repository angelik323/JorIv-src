// Vue
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// Interfaces
import {
  IInvestmentPlanOperationCreatePayload,
  IInvestmentPlanOperationsBasicDataForm,
} from '@/interfaces/customs/fics/InvestmentPlanOperations'
import { ITabs } from '@/interfaces/global'

// Components
import ContributionOperationDetailForm from '@/components/Forms/Fics/InvestmentPlanOperations/OperationDetail/ContributionOperationDetailForm.vue'
import WithdrawalOperationDetailForm from '@/components/Forms/Fics/InvestmentPlanOperations/OperationDetail/WithdrawalOperationDetailForm.vue'
import BasicDataForm from '@/components/Forms/Fics/InvestmentPlanOperations/BasicData/BasicDataForm.vue'

// Composables
import { useUtils, useMainLoader, useGoToUrl } from '@/composables'

// Stores
import { useInvestmentPlanOperationStore } from '@/stores/fics/investment-plan-operations'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useInvestmentPlanOperationCreate = () => {
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _storePlanOperationWithDetails } =
    useInvestmentPlanOperationStore('v1')

  const operationType = ref<null | 'aporte' | 'retiro'>()

  const investmentPlanOperationDetailForm = ref<
    | InstanceType<typeof ContributionOperationDetailForm>
    | InstanceType<typeof WithdrawalOperationDetailForm>
    | null
  >()

  const investmentPlanOperationForm = ref<InstanceType<
    typeof BasicDataForm
  > | null>(null)

  const operationSubType =
    ref<IInvestmentPlanOperationsBasicDataForm['subtype']>()
  const fiduciaryInvestmentPlanId = ref<number | null>(null)
  const fundId = ref<number | null>(null)

  const headerProps = {
    title: 'Crear registro de operaciones para aportes/retiros',
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
        label: 'Crear operaciones monetarias',
        route: 'InvestmentPlanOperationCreate',
      },
    ],
  }

  const detailsTabLabel = computed(() => {
    const type = investmentPlanOperationForm.value?.getFormData()?.type
    const subtype = investmentPlanOperationForm.value?.getFormData()?.subtype

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
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const basicDataInformation =
    ref<IInvestmentPlanOperationsBasicDataForm | null>(null)

  const storeOperation = async () => {
    if (!(await investmentPlanOperationForm.value?.validateForm())) return

    const payload = investmentPlanOperationForm.value?.getFormData()

    if (!payload) return

    operationType.value = payload.type
    operationSubType.value = payload.subtype
    fiduciaryInvestmentPlanId.value = payload.fiduciary_investment_plan_id
    fundId.value = payload.collective_investment_fund_id

    tabActive.value = filteredTabs.value[1].name

    await _getResources(
      {
        fics: ['banks_collective_investment_funds'],
      },
      `filter[ficOperationChannel.fund_id]=${payload.collective_investment_fund_id}`
    )
    await _getResources(
      {
        fics: ['fic_bank_accounts_operations'],
      },
      `filter[fund_id]=${payload.collective_investment_fund_id}`
    )
  }

  const storeOperationDetail = async () => {
    if (!(await investmentPlanOperationDetailForm.value?.validateForm())) return

    const operationData = investmentPlanOperationForm.value?.getFormData()

    const operationDetailData =
      investmentPlanOperationDetailForm.value?.getFormData()

    if (!operationData || !operationDetailData || !operationData.type) return

    const payload: IInvestmentPlanOperationCreatePayload = {
      type: operationData.type,
      subtype: operationData.subtype,
      fiduciary_investment_plan_id:
        operationData.fiduciary_investment_plan_id as number,
      collective_investment_fund_id:
        operationData.collective_investment_fund_id as number,
      value: Number(operationData.value) as number,
      operation_office_id: operationData.operation_office_id as number,
      details: operationDetailData.map((detail) => {
        if (detail.type === 'aporte') {
          return {
            value: Number(detail.value) as number,
            treasury_collection_form_id: detail.collection_type_id as number,
            observation: detail.observations as string,
            treasury_collection_bank_id:
              detail.treasury_collection_bank_id as number,
            account_bank_id: detail.account_bank_id as number,
            fic_account_bank_id: detail.account_bank_id as number,
          }
        }

        if (
          detail.type === 'retiro' &&
          detail.means_of_payment_description === 'Traslado'
        ) {
          return {
            value: Number(detail.value) as number,
            treasury_collection_form_id: detail.means_of_payment_id as number,
            treasury_collection_bank_id:
              detail.treasury_collection_bank_id as number,

            fiduciary_investment_plan_id: detail.destination_plan_id as number,
            collective_investment_fund_id: detail.bank_or_fund_id as number,

            observation: detail.observations as string,
          }
        }

        if (
          detail.type === 'retiro' &&
          detail.means_of_payment_description === 'Transferencia'
        ) {
          return {
            value: Number(detail.value) as number,
            treasury_collection_form_id: detail.means_of_payment_id as number,
            treasury_collection_bank_id:
              detail.treasury_collection_bank_id as number,

            fic_account_bank_id: detail.fic_account_bank_id as number,
            account_bank_id: detail.fic_account_bank_id as number,

            observation: detail.observations as string,
          }
        }

        return {
          value: Number(detail.value ) as number,
          treasury_collection_form_id: detail.means_of_payment_id as number,
          treasury_collection_bank_id:
            detail.treasury_collection_bank_id as number,
          fic_account_bank_id: detail.fic_account_bank_id as number,
          account_bank_id: detail.fic_account_bank_id as number,
          observation: detail.observations as string,
        }
      }),
    }

    openMainLoader(true)
    const success = await _storePlanOperationWithDetails(payload)
    openMainLoader(false)

    if (success) goToURL('InvestmentPlanOperationList')
  }

  onMounted(async () => {
    openMainLoader(true)

    await _getResources({
      fics: ['fiduciary_investment_plans'],
    })

    await _getResources({
      fics: [
        'funds',
        'offices',
        'funts_to_investment_plans',
        'identification_types_for_plans',
        'account_types',
      ],
      treasury: ['typeReceive', 'means_of_payments'],
    })

    openMainLoader(false)
  })

  onBeforeUnmount(() =>
    _resetKeys({
      treasury: ['bank_account'],
      fics: [
        'offices',
        'account_types',
        'funts_to_investment_plans',
        'fiduciary_investment_plans',
        'identification_types_for_plans',
        'banks_collective_investment_funds',
        'fic_bank_accounts_operations',
      ],
    })
  )

  return {
    goToURL,
    tabActive,
    headerProps,
    filteredTabs,
    tabActiveIdx,
    operationType,
    storeOperation,
    operationSubType,
    storeOperationDetail,
    basicDataInformation,
    fiduciaryInvestmentPlanId,
    investmentPlanOperationForm,
    investmentPlanOperationDetailForm,
    fundId,
  }
}

export default useInvestmentPlanOperationCreate
