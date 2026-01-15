export * from '@/interfaces/customs/resources/Treasury'
export * from '@/interfaces/customs/resources/InvestmentPortfolio'
export * from '@/interfaces/customs/resources/Common'
export * from '@/interfaces/customs/resources/Schedule'
export * from '@/interfaces/customs/resources/Accounting'
export * from '@/interfaces/customs/resources/TrustBusiness'
export * from '@/interfaces/customs/resources/BusinessTrust'
export * from '@/interfaces/customs/resources/Fics'
export * from '@/interfaces/customs/resources/Settlement-commissions'
export * from '@/interfaces/customs/resources/FinancialObligations'
export * from '@/interfaces/customs/resources/BillingCollect'
export * from '@/interfaces/customs/resources/Budget'
export * from '@/interfaces/customs/resources/DerivativeContracting'
export * from '@/interfaces/customs/resources/AccountsPayable'
export * from '@/interfaces/customs/resources/FixedAssets'
export * from '@/interfaces/customs/resources/Audit'
export * from '@/interfaces/customs/resources/Tax'

export interface ResourceTypes {
  accounting?: string[]
  assets?: string[]
  investment_portfolio?: string[]
  fics?: string[]
  finantial_obligations?: string[]
  schedule?: string[]
  treasury?: string[]
  trust_business?: string[]
  user?: string[]
  settlement_commissions?: string[]
  derivative_contracting?: string[]
  budget?: string[]
  accounts_payable?: string[]
  billing_collect?: string[]
  third_party?: string[]
  normative?: string[]
  clients?: string[]
  fixed_assets?: string[]
  tax?: string[]
  seizures?: string[]
  sarlaft?: string[]
}

export type HandlerFn = (value: unknown, key: string | undefined) => void
