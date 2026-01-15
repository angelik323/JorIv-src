// Vue
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IFirstAuthorizationBasicData,
  IPaymentDetail,
  IPaymentInstruction,
  ILiquidation,
} from '@/interfaces/customs/accounts-payable/FirstAuthorizationTaxSettlement'

// Composables
import { useGoToUrl, useUtils, useMainLoader } from '@/composables'

// Stores
import { useFirstAuthorizationTaxSettlementStore } from '@/stores/accounts-payable/first-authorization-tax-settlement'

const useFirstAuthorizationTaxSettlementView = () => {
  const route = useRoute()
  const recordId = +route.params.id
  const { defaultIconsLucide, formatCurrency } = useUtils()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const { _getFirstAuthorizationTaxSettlementShow } =
    useFirstAuthorizationTaxSettlementStore('v1')

  const basicDataFormRef = ref()
  const basicData = ref<IFirstAuthorizationBasicData | null>(null)
  const paymentDetails = ref<IPaymentDetail[]>([])
  const paymentInstructions = ref<IPaymentInstruction[]>([])
  const paymentLiquidations = ref<ILiquidation[]>([])

  const headerProps = {
    title: 'Ver autorización 1 - Liquidación tributaria',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas Por Pagar', route: '' },
      {
        label:
          'Autorización 1 - Liquidación tributaria - Generación ORPA - pagos',
        route: 'FirstAuthorizationTaxSettlementList',
      },
      { label: 'Ver', route: 'FirstAuthorizationTaxSettlementView' },
      { label: `${recordId}`, route: '' },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const handleFinish = () => {
    goToURL('FirstAuthorizationTaxSettlementList')
  }

  const loadData = async () => {
    openMainLoader(true)

    const response = await _getFirstAuthorizationTaxSettlementShow(recordId)

    if (response.data) {
      const data = response.data
      const instructions = (data.instructions as Array<Record<string, unknown>>) || []

      const paymentRequestId = data.payment_request_id as number
      const operationOfficeId = (data.office as Record<string, unknown>)?.id as number
      let businessTrustId: number | null = null
      let businessTrust: Record<string, unknown> | null = null

      if (data.business_trust && typeof data.business_trust === 'object') {
        businessTrust = data.business_trust as Record<string, unknown>
        businessTrustId = businessTrust.id as number
      } else if (instructions.length > 0) {
        const firstInstruction = instructions[0]
        const plan = firstInstruction.fiduciary_investment_plan as (Record<string, unknown> | null)
        if (plan) {
          businessTrust = plan.business_trust as (Record<string, unknown> | null)
          if (businessTrust) {
            businessTrustId = businessTrust.id as number
          }
        }
      }

      const requestNumber = (data.request_number as string) || null
      const businessCode = (businessTrust?.business_code as string) || null
      const businessName = (businessTrust?.name as string) || null

      // Leer filtros de localStorage
      const savedFilters = localStorage.getItem('firstAuthTaxSettlementFilters')
      const filters = savedFilters ? JSON.parse(savedFilters) : {}

      const authorizer = (data.authorizer as Record<string, unknown>) || null
      const amountFrom = authorizer && authorizer.amount_from ? formatCurrency(authorizer.amount_from as string) : null
      const amountTo = authorizer && authorizer.amount_to ? formatCurrency(authorizer.amount_to as string) : null

      basicData.value = {
        office_code: (data.office as Record<string, unknown>)?.office_code as string | null,
        office_description: (data.office as Record<string, unknown>)?.office_description as string | null,
        from_business: filters.fromBusiness || businessCode,
        from_business_name: filters.fromBusinessName || businessName,
        to_business: filters.toBusiness || businessCode,
        to_business_name: filters.toBusinessName || businessName,
        from_request: filters.fromRequest || requestNumber,
        to_request: filters.toRequest || requestNumber,
        amount_from: amountFrom,
        amount_to: amountTo,
        request_status: typeof data.request_status === 'string' ? data.request_status : ((data.request_status as Record<string, unknown>)?.name as string | null),
        request_status_id: typeof data.request_status === 'object' ? ((data.request_status as Record<string, unknown>)?.id as number | null) : null,
        authorization_status: typeof data.authorization_status === 'string' ? data.authorization_status : ((data.authorization_status as Record<string, unknown>)?.name as string | null),
        authorization_status_id: typeof data.authorization_status === 'object' ? ((data.authorization_status as Record<string, unknown>)?.id as number | null) : null,
        payment_request_id: paymentRequestId,
        operation_office_id: operationOfficeId,
        business_trust_id: businessTrustId,
      }

      if (instructions.length > 0) {
        const mainBusinessTrust = data.business_trust as (Record<string, unknown> | null)
        const issuer = data.issuer as (Record<string, unknown> | null)
        const issuerDocument = issuer ? (issuer.document as string) : ''

        paymentDetails.value = instructions.map((instruction) => ({
          id: instruction.id as number,
          business: mainBusinessTrust ? `${mainBusinessTrust.business_code ?? ''} - ${mainBusinessTrust.name ?? ''}` : '',
          instruction_date: instruction.instruction_date as string,
          reception_date: data.reception_date as string,
          payment_request_number: (data.request_number as string) || '',
          upload_number: '',
          asset_number: (data.asset_numbers as string) || '',
          internal_consecutive: (data.internal_consecutive as string) || '',
          client_consecutive: (data.client_consecutive as string) || '',
          supplier_issuer: issuerDocument,
          has_payment_instruction: instruction.payment_instruction === 'S',
          origin: 'Individual',
          payment_type: instruction.payment_type as string,
          base_value: instruction.base_value as string,
          discount_value: instruction.discount_value as string,
          net_value: instruction.net_value as string,
        }))
      }

      if (instructions.length > 0) {
        paymentInstructions.value = instructions.map((instruction) => {
          const details = (instruction.details as Array<Record<string, unknown>>)?.[0] || {}
          const paymentResource = instruction.payment_resource as string
          const isBank = paymentResource === 'cuenta_bancaria'

          const fund = isBank ? null : (instruction.fund as (Record<string, unknown> | null))
          const plan = isBank ? null : (instruction.fiduciary_investment_plan as (Record<string, unknown> | null))
          const bank = instruction.bank as (Record<string, unknown> | null)
          const bankAccount = instruction.bank_account as (Record<string, unknown> | null)

          const paymentMethod = details.payment_method as (Record<string, unknown> | null)
          const paymentForm = paymentMethod ? (paymentMethod.type_mean_of_payments as string) : ''

          const requestStatus = instruction.request_status as (Record<string, unknown> | null)
          const instructionStatus = requestStatus ? (requestStatus.name as string) : ''
          const instructionStatusId = requestStatus ? (requestStatus.id as number) : 1

          return {
            id: instruction.id as number,
            instruction_number: details.instruction_number as number,
            payment_form: paymentForm,
            resource_source: paymentResource,
            fund: fund ? `${fund.fund_code ?? ''} - ${fund.fund_name ?? ''}` : null,
            investment_plan: plan ? `${plan.code ?? ''}` : null,
            bank: bank ? (bank.description as string) : null,
            bank_account: bankAccount ? `${bankAccount.account_number ?? ''} - ${bankAccount.account_name ?? ''}` : null,
            net_value: instruction.net_value as string,
            instruction_status: instructionStatus,
            instruction_status_id: instructionStatusId,
          }
        })
      }

      const liquidations = (data.tax_liquidation as Array<Record<string, unknown>>) || []

      if (liquidations.length > 0) {
        paymentLiquidations.value = liquidations.map((liquidation) => ({
          id: liquidation.id as number,
          type: liquidation.type as string,
          tax_copy: liquidation.fiscal_charge as string,
          concept: liquidation.settlement_concept as string,
          base: liquidation.base as string,
          percentage: liquidation.percentage as string,
          value: liquidation.value as string,
        }))
      }
    }

    openMainLoader(false)
  }

  onMounted(async () => {
    await loadData()
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    basicData,
    paymentDetails,
    paymentInstructions,
    paymentLiquidations,
    handleFinish,
    handleReload: loadData,
  }
}

export default useFirstAuthorizationTaxSettlementView