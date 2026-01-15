import invoiceGenerationOtherItemsRouter from '@/router/billing-portfolio/invoice-generation-other-items'
import authorizationFiduciaryCommissions from '@/router/billing-portfolio/authorization-fiduciary-commissions'
import automaticDebitSettingsRouter from '@/router/billing-portfolio/automatic-debit-settings'
import invoiceGenerationRouter from '@/router/billing-portfolio/invoice-generation'
import amortizationAdvanceCommissionRouter from '@/router/billing-portfolio/amortization-advance-commission'
import adjustmentNoteRecordRoute from '@/router/billing-portfolio/adjustment-note-record'
import trustCommissionCollectionRouter from '@/router/billing-portfolio/trust-commission-collection'
import billingAndPortfolioClosureRouter from '@/router/billing-portfolio/billing-and-portfolio-closure'
import supportingDocumentsRouter from '@/router/billing-portfolio/supporting-documents'

export default [
  ...authorizationFiduciaryCommissions,
  ...adjustmentNoteRecordRoute,
  ...automaticDebitSettingsRouter,
  ...invoiceGenerationRouter,
  ...amortizationAdvanceCommissionRouter,
  ...trustCommissionCollectionRouter,
  ...invoiceGenerationOtherItemsRouter,
  ...billingAndPortfolioClosureRouter,
  ...supportingDocumentsRouter,
  ...automaticDebitSettingsRouter,
]
