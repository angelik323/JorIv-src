/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICardStatus, StatusType, StatusMaps } from '@/interfaces/global'
import { computed } from 'vue'
import {
  DEFAULT_STATUS,
  DEFAULT_STATUS_MAP,
  FINANCIAL_OBLIGATIONS_STATUS_MAP,
  TRUST_BUSINESS_STATUS_MAP,
  PAYMENT_PLAN_STATUS_MAP,
  INVESTMENT_PORTFOLIO_STATUS_MAP,
  BALANCE_POINT_STATUS_MAP,
  PROJECT_STATUS_MAP,
  FICS_STATUS_MAP,
  DISPERSION_GROUP_LETTER_STATUS_MAP,
  BILLING_PORTFOLIO_STATUS_MAP,
  TREASURY_STATUS_MAP,
  ACCOUNTING_STATUS_MAP,
  FICS_CLOSING_COLLECTIVE_INVESTMENT_FUNDS_STATUS_MAP,
  ACCOUNTS_PAYABLE_MAP,
  SARLAFT_STATUS_MAP,
  FIXED_ASSETS_MAP,
  BUDGET_STATUS_MAP,
  FICS_BULK_UPLOAD_STATUS_MAP,
  ACCOUNTING_VOUCHERS_STATUS_MAP,
  DERIVATIVE_CONTRACTING_MAP,
  POLICIES_MAP,
  NOTIFICATIONS_STATUS,
} from '@/constants/show-status'

const useShowStatus = (props: any) => {
  const statusConfigs: StatusMaps = {
    default: {
      ...DEFAULT_STATUS_MAP,
    },
    financialObligations: { ...FINANCIAL_OBLIGATIONS_STATUS_MAP },
    trustBusiness: {
      ...TRUST_BUSINESS_STATUS_MAP,
      ...PAYMENT_PLAN_STATUS_MAP,
    },
    balancePoint: {
      ...BALANCE_POINT_STATUS_MAP,
    },
    project: {
      ...PROJECT_STATUS_MAP,
    },
    investmentPortfolio: {
      ...INVESTMENT_PORTFOLIO_STATUS_MAP,
    },
    fics: {
      ...FICS_STATUS_MAP,
    },
    ficsClosingFunds: {
      ...FICS_CLOSING_COLLECTIVE_INVESTMENT_FUNDS_STATUS_MAP,
    },
    dispersion_group_letter: {
      ...DISPERSION_GROUP_LETTER_STATUS_MAP,
    },
    billingPortfolio: {
      ...BILLING_PORTFOLIO_STATUS_MAP,
    },
    treasury: {
      ...TREASURY_STATUS_MAP,
    },
    accounting: {
      ...ACCOUNTING_STATUS_MAP,
    },
    accountingVouchers: {
      ...ACCOUNTING_VOUCHERS_STATUS_MAP,
    },
    normative: {
      ...DEFAULT_STATUS_MAP, // normative status map
    },
    accountsPayable: {
      ...ACCOUNTS_PAYABLE_MAP,
    },
    sarlaft: {
      ...SARLAFT_STATUS_MAP,
    },
    fixedAssets: { ...FIXED_ASSETS_MAP },
    budget: {
      ...BUDGET_STATUS_MAP,
    },
    ficsBulkUpload: {
      ...FICS_BULK_UPLOAD_STATUS_MAP,
    },
    derivativeContracting: {
      ...DERIVATIVE_CONTRACTING_MAP,
    },
    policies: {
      ...POLICIES_MAP,
    },
    notifications: {
      ...NOTIFICATIONS_STATUS,
    },
  }

  const getStatusMap = (
    statusType: StatusType = 'default'
  ): Record<number, ICardStatus> => {
    return statusConfigs[statusType] || statusConfigs.default
  }

  const getStatus = (
    type: number,
    statusType: StatusType = 'default'
  ): ICardStatus => {
    const statusMap = getStatusMap(statusType)
    return statusMap[type] || DEFAULT_STATUS
  }

  const currentStatus = computed(() => getStatus(props.type, props.statusType))

  const chipStyles = computed(() => ({
    background: currentStatus.value.bg,
    color: currentStatus.value.textColor,
    borderRadius: '50px',
    fontWeight: 500,
  }))

  return {
    currentStatus,
    chipStyles,
  }
}

export default useShowStatus
