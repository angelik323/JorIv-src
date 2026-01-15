import portfolioClassificationRouter from '@/router/settlement-commissions/portfolio-classification'
import fiduciaryBusinessCommissionsRouter from '@/router/settlement-commissions/fiduciary-business-commissions'
import billingTrustRouter from '@/router/settlement-commissions/billing-trusts'
import typeCommissionRouter from '@/router/settlement-commissions/types-commission'
import fiduciaryCommissionRouter from '@/router/settlement-commissions/fiduciary-commission'
import thirdPartyBillingRouter from '@/router/settlement-commissions/third-party-billing'
import billingPeriodRouter from '@/router/settlement-commissions/billing-period'
import accountingSettingsRouter from '@/router/settlement-commissions/accounting-settings'
import commissionCalculationRouter from '@/router/settlement-commissions/commission-calculation'

export default [
  ...fiduciaryBusinessCommissionsRouter,
  ...portfolioClassificationRouter,
  ...billingTrustRouter,
  ...typeCommissionRouter,
  ...fiduciaryCommissionRouter,
  ...thirdPartyBillingRouter,
  ...billingPeriodRouter,
  ...accountingSettingsRouter,
  ...commissionCalculationRouter,
]
