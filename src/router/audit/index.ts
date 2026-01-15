import auditOfFunctionalitiesRouter from '@/router/audit/audit-of-entry-of-functionalities'
import auditDatabaseLogs from '@/router/audit/database-logs'
import querySystemAccessAuditRouter from '@/router/audit/query-system-access-audit'

export default [
  ...auditOfFunctionalitiesRouter,
  ...auditDatabaseLogs,
  ...querySystemAccessAuditRouter,
]
