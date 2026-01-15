import typesContractingDocumentsListRouter from '@/router/derivative-contracting/types-contracting-documents'
import definitionSupportingDocumentsRouter from '@/router/derivative-contracting/definition-supporting-documents'
import contractClausesRouter from '@/router/derivative-contracting/contract-clauses'
import attachedDocumentsListRoute from '@/router/derivative-contracting/attached-documents'
import paymentConfigurationTypesRouter from '@/router/derivative-contracting/payment-configuration-types'
import paymentMilestonesModificationRouter from '@/router/derivative-contracting/payment-milestones-modification'
import registerAdditionsRouter from '@/router/derivative-contracting/register-additions'
import workPlansRouter from '@/router/derivative-contracting/work-plans'
import riskDefinitionRouter from '@/router/derivative-contracting/risk-definition'
import typesOfPolicyRouter from '@/router/derivative-contracting/types-of-policy'
import documentaryStructureContractRouter from '@/router/derivative-contracting/documentary-structure-contract'
import generalContractInquiryRouter from '@/router/derivative-contracting/general-contract-inquiry'
import projectManagementRouter from '@/router/derivative-contracting/project-management'
import contractRegistrationRouter from '@/router/derivative-contracting/contract-registration'
import businessCreation from '@/router/derivative-contracting/business-creation'

export default [
  ...typesContractingDocumentsListRouter,
  ...definitionSupportingDocumentsRouter,
  ...contractClausesRouter,
  ...attachedDocumentsListRoute,
  ...paymentConfigurationTypesRouter,
  ...paymentMilestonesModificationRouter,
  ...registerAdditionsRouter,
  ...workPlansRouter,
  ...projectManagementRouter,
  ...riskDefinitionRouter,
  ...typesOfPolicyRouter,
  ...documentaryStructureContractRouter,
  ...generalContractInquiryRouter,
  ...typesOfPolicyRouter,
  ...contractRegistrationRouter,
  ...businessCreation,
]
