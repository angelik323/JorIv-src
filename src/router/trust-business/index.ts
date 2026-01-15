import trustBusinessesRouter from '@/router/trust-business/trust-businesses'
import changeTrustStatus from '@/router/trust-business/change-trust-status'
import trustBusinessMovementCodes from './trust-business-movement-codes'
import extendTrust from './extend-trust'
import typeOfBusinessDocumentsRouter from './type-of-business-documents'
import trustBusinessDocumentStructureRouter from './trust-business-document-structure'
import permissionsRouter from '@/router/trust-business/permissions'
import accountingParametersMovementCodes from './accounting-parameters-movement-codes'
import documentCharacteristicsRouter from './document-characteristics'
import documentAssignmentRouter from './document-assignment'
import recordTransfersRouter from './record-transfers'
import guaranteesRouter from './guarantees'
import policyRouter from './policy'
import realStateProjectRouter from './real-state-project'
import paymentPlanRouter from '@/router/trust-business/payment-plan'
import saleRealEstateRouter from '@/router/trust-business/sale-real-estate'
import discountinuancesRouter from '@/router/trust-business/discountinuances'
import fiduciaryTrustRouter from '@/router/trust-business/fiduciary-trust'
import generalRequestsRouter from '@/router/trust-business/general-requests'
import assignmentBuyerRouter from '@/router/trust-business/assignment-buyer'
import balancePointRouter from '@/router/trust-business/balance-point'

export default [
  ...trustBusinessesRouter,
  ...changeTrustStatus,
  ...trustBusinessMovementCodes,
  ...extendTrust,
  ...typeOfBusinessDocumentsRouter,
  ...trustBusinessDocumentStructureRouter,
  ...permissionsRouter,
  ...accountingParametersMovementCodes,
  ...documentCharacteristicsRouter,
  ...documentAssignmentRouter,
  ...recordTransfersRouter,
  ...guaranteesRouter,
  ...policyRouter,
  ...realStateProjectRouter,
  ...paymentPlanRouter,
  ...saleRealEstateRouter,
  ...discountinuancesRouter,
  ...fiduciaryTrustRouter,
  ...generalRequestsRouter,
  ...assignmentBuyerRouter,
  ...balancePointRouter,
  ...assignmentBuyerRouter,
]
