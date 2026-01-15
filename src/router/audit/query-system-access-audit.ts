export default [
  {
    path: '/auditoria/consultar-auditoria-ingreso-sistema',
    name: 'QuerySystemAccessAuditList',
    component: () =>
      import(
        '@/views/audit/query-system-access-audit/v1/list/QuerySystemAccessAuditList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      // requiredValidRole: {
      //   module: 'Audit',
      //   view: 'QuerySystemAccessAuditList',
      //   action: 'list',
      // },
    },
  },
]
