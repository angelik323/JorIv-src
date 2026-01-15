import fiduciaryCommissionRouter from '@/router/fics/fiduciary-commission'
import businessLineRouter from '@/router/fics/business-line'
import operationRejectionReasonsRouter from '@/router/fics/operation-rejection-reasons'
import collectiveInvestmentFundsRouter from '@/router/fics/collective-investment-fund'
import accountingParametersRouter from '@/router/fics/accounting-parameters'
import accountingParametersMovementsRouter from '@/router/fics/accounting-parameters-movements'
import processCodesRouter from '@/router/fics/process-codes'
import collectiveInvestmentFundRouter from '@/router/fics/collective-investment-funds'
import groundsBlockingInvestmentPlanRouter from '@/router/fics/grounds-blocking-investment-plan'
import systemOperationChannelsRouter from '@/router/fics/system-operation-channels'
import consolidatedInvestmentRouter from '@/router/fics/consolidated-investment'
import participationTypeRegistrationRouter from '@/router/fics/participation-type-registration'
import genericInvestmentPlansRouter from '@/router/fics/generic-investment-plans'
import operatingOfficesRouter from '@/router/fics/operating-offices'
import fiduciaryInvestmentPlanRouter from '@/router/fics/fiduciary-investment-plan'
import movementCodesRouter from '@/router/fics/movement-codes'
import settingMovementClassesRouter from '@/router/fics/setting-movement-classes'
import withdrawalContributionLimitsRouter from '@/router/fics/withdrawal-contribution-limits'
import bulkUploadRouter from '@/router/fics/bulk-upload'
import investmentPlanOperationsRouter from '@/router/fics/investment-plan-operations'
import bulkUploadTemplatesRouter from '@/router/fics/bulk-upload-templates'
import investmentPlanParticipationModificationRouter from '@/router/fics/investment-plan-participation-modification'
import configurePermissionsForFicsRouter from '@/router/fics/configure-permissions-for-fics'
import indexingIpcRouter from '@/router/fics/indexing-ipc'
import fundsThatParticipateInOtherInvestmentFundsRouter from '@/router/fics/funds-that-participate-in-other-investment-funds'
import investmentPlanOperationComplianceRouter from '@/router/fics/investment-plan-operation-compliance'
import freezeResourcesRouter from '@/router/fics/freeze-resources'
import generateExtractsRouter from '@/router/fics/generate-extracts'
import closingCollectiveInvestmentFundsRouter from '@/router/fics/closing-collective-investment-funds'
import validationFicsClosingRouter from '@/router/fics/validation-fics-closing'
import consultClosingProcessInvestmentFundsRouter from '@/router/fics/consult-closing-process-investment-funds'

export default [
  ...settingMovementClassesRouter,
  ...fiduciaryCommissionRouter,
  ...businessLineRouter,
  ...operationRejectionReasonsRouter,
  ...movementCodesRouter,
  ...withdrawalContributionLimitsRouter,
  ...accountingParametersRouter,
  ...collectiveInvestmentFundsRouter,
  ...collectiveInvestmentFundRouter,
  ...accountingParametersMovementsRouter,
  ...processCodesRouter,
  ...groundsBlockingInvestmentPlanRouter,
  ...systemOperationChannelsRouter,
  ...consolidatedInvestmentRouter,
  ...participationTypeRegistrationRouter,
  ...genericInvestmentPlansRouter,
  ...operatingOfficesRouter,
  ...investmentPlanOperationsRouter,
  ...bulkUploadTemplatesRouter,
  ...investmentPlanParticipationModificationRouter,
  ...configurePermissionsForFicsRouter,
  ...fiduciaryInvestmentPlanRouter,
  ...bulkUploadRouter,
  ...indexingIpcRouter,
  ...fundsThatParticipateInOtherInvestmentFundsRouter,
  ...investmentPlanOperationComplianceRouter,
  ...freezeResourcesRouter,
  ...generateExtractsRouter,
  ...closingCollectiveInvestmentFundsRouter,
  ...validationFicsClosingRouter,
  ...consultClosingProcessInvestmentFundsRouter,
]
