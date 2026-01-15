export interface ICardStatus {
  icon: string
  bg: string | number
  color: string
  iconColor: string
  title: string
  textColor: string
}

export type StatusType =
  | 'default'
  | 'financialObligations'
  | 'trustBusiness'
  | 'investmentPortfolio'
  | 'balancePoint'
  | 'project'
  | 'fics'
  | 'dispersion_group_letter'
  | 'billingPortfolio'
  | 'treasury'
  | 'accounting'
  | 'ficsClosingFunds'
  | 'normative'
  | 'accountsPayable'
  | 'fixedAssets'
  | 'budget'
  | 'ficsBulkUpload'
  | 'derivativeContracting'
  | 'sarlaft'
  | 'accountingVouchers'
  | 'policies'
  | 'notifications'

export type StatusMaps = { [key in StatusType]: Record<number, ICardStatus> }
