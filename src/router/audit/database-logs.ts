export default [
  {
    path: '/auditoria/log-base-de-datos',
    name: 'AuditDatabaseLogsList',
    component: () =>
      import('@/views/audit/database-logs/v1/list/AuditDatabaseLogsList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Audit',
        view: 'AuditDatabaseLogsList',
        action: 'list',
      },
    },
  },
  {
    path: '/auditoria/log-base-de-datos/configurar',
    name: 'AuditDatabaseLogsEdit',
    component: () =>
      import('@/views/audit/database-logs/v1/configure/AuditDatabaseLogsEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Audit',
        view: 'AuditDatabaseLogsList',
        action: 'edit',
      },
    },
  },
]
