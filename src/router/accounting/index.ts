import consolidationTreeRouter from '@/router/accounting/consolidation-tree'
import accountingReceiptRouter from '@/router/accounting/accounting-receipt'
import accountingClosingParameterRouter from '@/router/accounting/period-closure-parameter'
import costCenter from '@router/accounting/cost-center'
import ValidationVouchers from '@router/accounting/validation-vouchers'
import accountingRestatementRouter from '@router/accounting/accounting-restatement'
import periodClosureRouter from '@/router/accounting/period-closure'
import annualPeriodClosing from '@router/accounting/annual-period-closing'
import accountBalancesAndThirdPartiesRouter from '@/router/accounting/account-balances-and-third-parties'
import accountStructureRouter from '@/router/accounting/account-structure'
import openingRecordRouter from '@/router/accounting/opening-record'
import pucAccountEquivalenceRouter from '@/router/accounting/puc-account-equivalence'
import desactivateDailyClosingVouchers from '@/router/accounting/desactivate-daily-closing-vouchers'
import chartAccountsRouter from '@/router/accounting/chart-accounts'
import checkingBalancesTransactionsByAccountRouter from './checking-balances-transactions-by-account'
import costCenterBalanceQueryRouter from '@/router/accounting/costCenterBalanceQuery'
import consecutiveQueriesOfReceiptsRouter from '@/router/accounting/consecutive-queries-of-receipts'
import accountingReportRouter from '@/router/accounting/accounting-report'
import scheduleDeferralRouter from '@/router/accounting/schedule-deferral'
import rangesForDeferredRouter from '@/router/accounting/ranges-for-deferred'
import structuresTypesRouter from '@/router/accounting/structures-types'
import balanceInquiryByBusinessRouter from '@/router/accounting/balance-inquiry-by-business'
import reportTemplatesRouter from '@/router/accounting/report-templates'
import uploadAccountingVouchersRouter from '@/router/accounting/upload-accounting-vouchers'
import consolidatedBalanceInquiryRouter from '@/router/accounting/consolidated-balance-inquiry'
import accountingReportListReceiptsRouter from '@/router/accounting/accounting-report-list-receipts'
import equivalentVaucherRouter from '@/router/accounting/equivalent-vaucher'
import reportingLimitsForChangesInEquityRouter from '@/router/accounting/reporting-limits-for-changes-in-equity'
import checkBalanceCostCenterRouter from '@/router/accounting/check-balance-cost-center'
import homologationProcessRouter from '@/router/accounting/homologation-process'
import voucherAuthorizationRouter from '@/router/accounting/voucher-authorization'
import typeAccountingReceipt from '@/router/accounting/type-accounting-receipt'
import voucherManagementRouter from '@/router/accounting/voucher-management'
import accountingConsolidationRouter from '@/router/accounting/accounting-consolidation'

export default [
  ...costCenter,
  ...accountingReceiptRouter,
  ...consolidationTreeRouter,
  ...ValidationVouchers,
  ...accountingRestatementRouter,
  ...periodClosureRouter,
  ...annualPeriodClosing,
  ...accountingClosingParameterRouter,
  ...accountBalancesAndThirdPartiesRouter,
  ...accountStructureRouter,
  ...openingRecordRouter,
  ...pucAccountEquivalenceRouter,
  ...desactivateDailyClosingVouchers,
  ...chartAccountsRouter,
  ...checkingBalancesTransactionsByAccountRouter,
  ...costCenterBalanceQueryRouter,
  ...consecutiveQueriesOfReceiptsRouter,
  ...accountingReportRouter,
  ...scheduleDeferralRouter,
  ...rangesForDeferredRouter,
  ...structuresTypesRouter,
  ...balanceInquiryByBusinessRouter,
  ...reportTemplatesRouter,
  ...uploadAccountingVouchersRouter,
  ...consolidatedBalanceInquiryRouter,
  ...accountingReportListReceiptsRouter,
  ...equivalentVaucherRouter,
  ...reportingLimitsForChangesInEquityRouter,
  ...checkBalanceCostCenterRouter,
  ...homologationProcessRouter,
  ...voucherAuthorizationRouter,
  ...typeAccountingReceipt,
  ...accountingConsolidationRouter,
  ...voucherManagementRouter,
  ...accountingConsolidationRouter,
]
