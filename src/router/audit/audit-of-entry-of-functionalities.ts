export default [
  {
    path: '/auditoria/auditoria-ingreso-a-funcionalidades',
    name: 'AuditEntryOfFunctionalitiesList',
    component: () =>
      import(
        '@/views/audit/audit-entry-of-functionalities/v1/list/AuditEntryOfFunctionalitiesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Audit',
        view: 'AuditEntryOfFunctionalitiesList',
        action: 'list',
      },
    },
  },
  {
    path: '/auditoria/auditoria-ingreso-a-funcionalidades/configurar',
    name: 'AuditEntryOfFunctionalitiesEdit',
    component: () =>
      import(
        '@/views/audit/audit-entry-of-functionalities/v1/configure/AuditEntryOfFunctionalitiesEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Audit',
        view: 'AuditEntryOfFunctionalitiesList',
        action: 'action_configure',
      },
    },
  },
]
