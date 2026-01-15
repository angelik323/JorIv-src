import AnnualPaymentsAmountsRouter from '@/router/accounts-payable/annual-payment-amounts'
import FiscalChargeManagementRouter from '@/router/accounts-payable/fiscal-charge-management'
import CancellationRejectionReasonsRouter from '@/router/accounts-payable/cancellation-rejection-reasons'
import TerritorialTaxesRouter from '@/router/accounts-payable/territorial-taxes'
import MovementManagementRouter from '@/router/accounts-payable/movement-management'
import PaymentConceptsRouter from '@/router/accounts-payable/payment-concepts'
import PaymentBlocksRouter from '@/router/accounts-payable/payment-blocks'
import TypesOfDocumentsRouter from '@/router/accounts-payable/types-of-documents'
import BudgetSourceDestinationsRouter from '@/router/accounts-payable/budget-source-destinations'
import SettlementFormulasRouter from '@/router/accounts-payable/settlement-formulas'
import SettlementConceptsRouter from '@/router/accounts-payable/settlement-concepts'
import SupportDocumentNumberingRouter from '@/router/accounts-payable/support-document-numbering'
import AccountsPayableClosingRouter from '@/router/accounts-payable/accounts-payable-closing'
import PaymentRequestsRouter from '@/router/accounts-payable/payment-requests'
import IcaActivitiesRouter from '@/router/accounts-payable/ica-activities'
import PaymentAuthorizersRouter from '@/router/accounts-payable/payment-authorizers'
import TaxMatrixRouter from '@/router/accounts-payable/tax-matrix'
import AccountsPayableNotificationsRouter from '@/router/accounts-payable/accounts-payable-notifications'
import FirstAuthorizationTaxSettlementRouter from '@/router/accounts-payable/first-authorization-tax-settlement'
import PaymentInstructionsRouter from '@/router/accounts-payable/payment-instructions'
import SecondAuthorizationRouter from '@/router/accounts-payable/second-authorization'
import PaymentStatusRouter from '@/router/accounts-payable/payment-status'
import TaxSettlementRouter from '@/router/accounts-payable/tax-settlement'
import CausationWithoutPaymentInstructionsRouter from '@/router/accounts-payable/causation-without-payment-instructions'
import OrpaFulfillmentCancelationNonTreasuryRouter from '@/router/accounts-payable/orpa-fulfillment-cancelation-non-treasury'

export default [
  ...AnnualPaymentsAmountsRouter,
  ...FiscalChargeManagementRouter,
  ...CancellationRejectionReasonsRouter,
  ...TerritorialTaxesRouter,
  ...MovementManagementRouter,
  ...PaymentConceptsRouter,
  ...PaymentBlocksRouter,
  ...TypesOfDocumentsRouter,
  ...BudgetSourceDestinationsRouter,
  ...SettlementFormulasRouter,
  ...SettlementConceptsRouter,
  ...SupportDocumentNumberingRouter,
  ...AccountsPayableClosingRouter,
  ...PaymentRequestsRouter,
  ...IcaActivitiesRouter,
  ...PaymentAuthorizersRouter,
  ...TaxMatrixRouter,
  ...AccountsPayableNotificationsRouter,
  ...FirstAuthorizationTaxSettlementRouter,
  ...PaymentInstructionsRouter,
  ...SecondAuthorizationRouter,
  ...PaymentStatusRouter,
  ...TaxSettlementRouter,
  ...CausationWithoutPaymentInstructionsRouter,
  ...OrpaFulfillmentCancelationNonTreasuryRouter,
]
