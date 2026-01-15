import { defineStore } from 'pinia'
import { useComparativeReportV1 } from './comparative-statement/comparative-report-v1'
import { useFinancialStatementV1 } from './financial-statement/accouting-report-v1'
import { usePeriodReportV1 } from './financial-period/period-report-v1'
import { useCostCenterReportV1 } from './cost-center/cost-center-report-v1'
import { useOtherCurrenciesReportV1 } from './other-ocurrencies/BSOtherOcurrencies-report-v1'
import { useAccountingReportListReceiptsReportV1 } from './list-receipts/accounting-report-list-receipts-v1'
import { useQuarterlyReportV1 } from './quarterly-balance/quarterly-report-v1'
import { useLegacyStatusV1 } from './legacy-status/legacy-report-v1'
import { useGeneralResultsV1 } from './general-result/general-report-v1'
import { useAccumulatedAuxiliaryV1 } from './accumulated-auxiliary/accumulated-report-v1'
import { useDiaryBookReportV1 } from './diary-book/diary-report-v1'
import { useGeneralLedgerV1 } from './general-ledger/ledger-report-v1'
import { useDailyBalanceV1 } from './daily-balance/dialy-balance-v1'
import { useBalanceReportV1 } from './consolidated-balance/consolidated-balance-v1'

// V2
import { useGeneralLedgerStoreV2 } from './general-ledger/ledger-report-v2'

export const useAccoutingReportV1 = defineStore('accouting-report-v1', () => {
  return {
    comparative: useComparativeReportV1(),
    financial: useFinancialStatementV1(),
    period: usePeriodReportV1(),
    costCenter: useCostCenterReportV1(),
    otherOcurrencies: useOtherCurrenciesReportV1(),
    listReceipts: useAccountingReportListReceiptsReportV1(),
    quarterlyBalance: useQuarterlyReportV1(),
    legacyStatus: useLegacyStatusV1(),
    generalResults: useGeneralResultsV1(),
    accumulatedAuxiliary: useAccumulatedAuxiliaryV1(),
    diaryBook: useDiaryBookReportV1(),
    generalLedger: useGeneralLedgerV1(),
    dailyBalance: useDailyBalanceV1(),
    consolidatedBalance: useBalanceReportV1(),

    // V2
    generalLedgerV2: useGeneralLedgerStoreV2(),
  }
})
