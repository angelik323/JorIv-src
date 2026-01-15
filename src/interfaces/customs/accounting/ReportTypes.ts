import { useAccumulatedAuxiliaryV1 } from '@/stores/accounting/accounting-report/accumulated-auxiliary/accumulated-report-v1'
import { useComparativeReportV1 } from '@/stores/accounting/accounting-report/comparative-statement/comparative-report-v1'
import { useCostCenterReportV1 } from '@/stores/accounting/accounting-report/cost-center/cost-center-report-v1'
import { usePeriodReportV1 } from '@/stores/accounting/accounting-report/financial-period/period-report-v1'
import { useDiaryBookReportV1 } from '@/stores/accounting/accounting-report/diary-book/diary-report-v1'
import { useFinancialStatementV1 } from '@/stores/accounting/accounting-report/financial-statement/accouting-report-v1'
import { useAccountingReportListReceiptsReportV1 } from '@/stores/accounting/accounting-report/list-receipts/accounting-report-list-receipts-v1'
import { useGeneralLedgerV1 } from '@/stores/accounting/accounting-report/general-ledger/ledger-report-v1'
import { useGeneralResultsV1 } from '@/stores/accounting/accounting-report/general-result/general-report-v1'
import { useLegacyStatusV1 } from '@/stores/accounting/accounting-report/legacy-status/legacy-report-v1'
import { useOtherCurrenciesReportV1 } from '@/stores/accounting/accounting-report/other-ocurrencies/BSOtherOcurrencies-report-v1'
import { useQuarterlyReportV1 } from '@/stores/accounting/accounting-report/quarterly-balance/quarterly-report-v1'
import { useDailyBalanceV1 } from '@/stores/accounting/accounting-report/daily-balance/dialy-balance-v1'
import { useBalanceReportV1 } from '@/stores/accounting/accounting-report/consolidated-balance/consolidated-balance-v1'

// V2
import { useGeneralLedgerStoreV2 } from '@/stores/accounting/accounting-report/general-ledger/ledger-report-v2'

export type ReportTypes = {
  comparative: ReturnType<typeof useComparativeReportV1>
  financial: ReturnType<typeof useFinancialStatementV1>
  costCenter: ReturnType<typeof useCostCenterReportV1>
  otherOcurrencies: ReturnType<typeof useOtherCurrenciesReportV1>
  listReceipts: ReturnType<typeof useAccountingReportListReceiptsReportV1>
  quarterlyBalance: ReturnType<typeof useQuarterlyReportV1>
  legacyStatus: ReturnType<typeof useLegacyStatusV1>
  generalResults: ReturnType<typeof useGeneralResultsV1>
  accumulatedAuxiliary: ReturnType<typeof useAccumulatedAuxiliaryV1>
  period: ReturnType<typeof usePeriodReportV1>
  diaryBook: ReturnType<typeof useDiaryBookReportV1>
  generalLedger: ReturnType<typeof useGeneralLedgerV1>
  dailyBalance: ReturnType<typeof useDailyBalanceV1>
  consolidatedBalance: ReturnType<typeof useBalanceReportV1>

  // V2
  generalLedgerV2: ReturnType<typeof useGeneralLedgerStoreV2>
}
