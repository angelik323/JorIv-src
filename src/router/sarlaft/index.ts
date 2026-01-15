import sarlaftParameterizationRouter from '@router/sarlaft/sarlaft-parameterization'
import individualRemoteAuthorizationManagementRouter from '@router/sarlaft/individual-remote-authorization-management'
import sarlaftOwnListRouter from '@router/sarlaft/own-list'
import sarlaftMassConsultationPrecautionaryListsRouter from '@router/sarlaft/mass-consultation-precautionary-lists'
import sarlaftRemoteMassAuthorizationRouter from '@router/sarlaft/remote-mass-authorization'
import sarlaftQueriesOwnListRouter from '@router/sarlaft/sarlaft-queries-own-list'
import consultIndividualListPreventionRouter from '@/router/sarlaft/consult-individual-list-prevention'

export default [
  ...sarlaftParameterizationRouter,
  ...individualRemoteAuthorizationManagementRouter,
  ...sarlaftOwnListRouter,
  ...sarlaftMassConsultationPrecautionaryListsRouter,
  ...sarlaftQueriesOwnListRouter,
  ...consultIndividualListPreventionRouter,
  ...sarlaftRemoteMassAuthorizationRouter,
]
