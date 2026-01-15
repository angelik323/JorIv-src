import checkbooksRouter from '@router/treasury/checkbooks'
import movementCodesRouter from '@router/treasury/movement-codes'
import accountingBlocksRouter from '@router/treasury/accounting-blocks'
import bankAccountBalancesRouter from '@router/treasury/bank-account-balances'
import accountingParametersCollectionsRouter from '@router/treasury/accounting-parameters-collections'
import collectionAccountingBlocksRouter from '@router/treasury/collection-accounting-blocks'
import bankStructuresRouter from '@router/treasury/bank-structures'
import bankingEntitesRouter from '@router/treasury/banking-entities'
import bankingEntitesParametersRouter from '@router/treasury/banking-entities-parameters'
import recordIndividualExpensesRouter from '@router/treasury/record-individual-expenses'
import recordIndividualIncomeRouter from '@router/treasury/record-individual-income'
import bankingAccountsRouter from '@router/treasury/banking-accounts'
import accountingParametersRouter from '@/router/treasury/accounting-parameters'
import consecutiveVouchersRouter from '@router/treasury/consecutive-vouchers'
import bankStructureEquivalencesRouter from '@router/treasury/bank-structure-equivalences'
import queryMovementsAccountsRouter from '@/router/treasury/query-movement-accounts'
import bankTransferRouter from '@/router/treasury/bank-transfer'
import bulkUploadRouter from '@router/treasury/bulk-upload'
import dispersionGroup from '@/router/treasury/dispersion-group'
import checkBankTransfersRouter from '@router/treasury/check-bank-transfers'
import cancelLoadBanksRouter from '@router/treasury/cancel-load-banks'
import authorizationTreasuryRouter from '@/router/treasury/authorization-treasury'
import balancesOnlineRouter from '@router/treasury/balances-online'
import detailDispersionGroupRouter from '@router/treasury/detail-dispersion-group'
import checkBankAccountMovementRouter from '@router/treasury/check-bank-account-movement'
import collectionsConceptsRouter from '@router/treasury/collections-concepts'
import generateDispersionGroupLetterRouter from './generate-dispersion-group-letter'
import generateScatterGroupFileRouter from '@router/treasury/generate-scatter-group-file'
import treasuryRecordsConsultationRouter from '@router/treasury/treasury-records-consultation'
import remoteAuthorizationRouter from '@router/treasury/remote-authorization'
import ListLetterFormatListRouter from '@/router/treasury/list-letter-format'
import authorizationAssignmentBankAccountsRouter from '@router/treasury/authorization-assignment-bank-accounts'
import assignmentBankAccountsRouter from '@router/treasury/assignment-bank-accounts'
import bankResponseRouter from '@router/treasury/bank-response'
import treasuryMovementsCancelledRouter from '@router/treasury/treasury-movements-cancelled'
import bankNetworkLoadRouter from '@router/treasury/bank-network-load'
import checkTreasuryReceiptRouter from '@router/treasury/check-treasury-receipt'
import expenseChecksRouter from '@/router/treasury/expense-checks'
import treasuryClosingRouter from '@/router/treasury/treasury-closing'
import assingEcryptionRouter from '@/router/treasury/assing-ecryption'
import treasuryCancellationsRouter from '@/router/treasury/treasury-cancellations'
import bookCheckRouter from '@/router/treasury/check-book-consultation'
import checkDeliveryRouter from '@/router/treasury/check-delivery'
import uncheckDeliveryChecksRouter from '@/router/treasury/uncheck-delivery-checks'
import expenseReceiptRouter from '@router/treasury/expense-receipt'
import treasuryReadjustmenRouter from '@router/treasury/treasury-readjustemnt'
import accountingParametersCommissionsRouter from '@router/treasury/accounting-parameters-commissions'
import collectionReferenceRouter from '@router/treasury/collection-reference'
import collectionMethodRouter from '@router/treasury/collection-methods'

export default [
  ...checkbooksRouter,
  ...movementCodesRouter,
  ...accountingBlocksRouter,
  ...bankAccountBalancesRouter,
  ...accountingParametersCollectionsRouter,
  ...bankStructuresRouter,
  ...bankingEntitesRouter,
  ...bankingEntitesParametersRouter,
  ...recordIndividualExpensesRouter,
  ...recordIndividualIncomeRouter,
  ...bankingAccountsRouter,
  ...accountingParametersRouter,
  ...consecutiveVouchersRouter,
  ...bankStructureEquivalencesRouter,
  ...collectionAccountingBlocksRouter,
  ...queryMovementsAccountsRouter,
  ...bankTransferRouter,
  ...bulkUploadRouter,
  ...dispersionGroup,
  ...checkBankTransfersRouter,
  ...cancelLoadBanksRouter,
  ...authorizationTreasuryRouter,
  ...balancesOnlineRouter,
  ...detailDispersionGroupRouter,
  ...checkBankAccountMovementRouter,
  ...collectionsConceptsRouter,
  ...generateDispersionGroupLetterRouter,
  ...generateScatterGroupFileRouter,
  ...treasuryRecordsConsultationRouter,
  ...remoteAuthorizationRouter,
  ...ListLetterFormatListRouter,
  ...authorizationAssignmentBankAccountsRouter,
  ...assignmentBankAccountsRouter,
  ...bankResponseRouter,
  ...treasuryMovementsCancelledRouter,
  ...bankNetworkLoadRouter,
  ...expenseChecksRouter,
  ...checkTreasuryReceiptRouter,
  ...treasuryClosingRouter,
  ...assingEcryptionRouter,
  ...treasuryCancellationsRouter,
  ...bookCheckRouter,
  ...checkDeliveryRouter,
  ...uncheckDeliveryChecksRouter,
  ...expenseReceiptRouter,
  ...treasuryReadjustmenRouter,
  ...accountingParametersCommissionsRouter,
  ...collectionReferenceRouter,
  ...collectionMethodRouter,
]
