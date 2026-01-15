// Example of how to structure budget-related routes
import budgetItemsRouter from '@/router/budget/budget-items'
import budgetCancellationBalancesRouter from '@/router/budget/cancellation-balances'
import operationLogsRouter from '@/router/budget/operation-logs'
import movementCodesRouter from '@/router/budget/movement-codes'
import closureValidationsRouter from '@/router/budget/closure-validations'
import closureVigencyRouter from '@/router/budget/closure-vigency'
import budgetComparisonRouter from '@/router/budget/budget-comparison'
import budgetLevelsRouter from '@/router/budget/budget-levels'
import budgetTransferParameterRouter from '@/router/budget/budget-transfer-parameters'
import budgetDocumentTypesRouter from '@/router/budget/budget-document-types'
import budgetTransferRouter from '@/router/budget/budget-transfer'
import budgetAreasResponsibilityRouter from '@/router/budget/areas-responsibility'
import operationAuthorizationsRouter from '@/router/budget/operation-authorizations'
import budgetDocumentCancellationRouter from '@/router/budget/budget-document-cancellation'
import budgetAccountingHomologationParametersRouter from '@/router/budget/budget-accounting-homologation-parameters'
import budgetAvailabilityCertificateRouter from '@/router/budget/budget-availability-certificate'
import budgetRegistrationCertificateRouter from '@/router/budget/budget-registration-certificate'
import budgetTransfersQueryRouter from '@/router/budget/budget-transfer-query'
import budgetBalanceQueryRouter from '@/router/budget/budget-balance-query'
import resourceBudgetRouter from '@/router/budget/budget-resources'
import budgetAccountingHomologationRouter from '@/router/budget/budget-accounting-homologation'
import budgetDocumentsRouter from '@/router/budget/budget-documents'
import budgetClosureRouter from '@/router/budget/budget-closure'

export default [
  ...closureVigencyRouter,
  ...budgetItemsRouter,
  ...budgetCancellationBalancesRouter,
  ...operationLogsRouter,
  ...movementCodesRouter,
  ...budgetLevelsRouter,
  ...closureValidationsRouter,
  ...budgetComparisonRouter,
  ...budgetTransferParameterRouter,
  ...budgetDocumentTypesRouter,
  ...budgetTransferRouter,
  ...budgetAreasResponsibilityRouter,
  ...operationAuthorizationsRouter,
  ...budgetDocumentCancellationRouter,
  ...budgetAccountingHomologationParametersRouter,
  ...budgetAvailabilityCertificateRouter,
  ...budgetAccountingHomologationRouter,
  ...budgetRegistrationCertificateRouter,
  ...budgetTransfersQueryRouter,
  ...budgetBalanceQueryRouter,
  ...resourceBudgetRouter,
  ...budgetDocumentsRouter,
  ...budgetClosureRouter,
]
