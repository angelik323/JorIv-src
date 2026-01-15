export default [
  {
    path: '/contabilidad/limites-de-reporte-cambios-en-el-patrimonio',
    name: 'ReportingLimitsChangesEquityList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ReportingLimitsChangesEquityList',
      },
    },
    component: () =>
      import(
        '@/views/accounting/reporting-limits-for-changes-in-equity/list/ReportingLimitsChangesEquityList.vue'
      ),
  },
  {
    path: '/contabilidad/limites-de-reporte-cambios-en-el-patrimonio/crear',
    name: 'ReportingLimitsChangesEquityCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ReportingLimitsChangesEquityList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounting/reporting-limits-for-changes-in-equity/create/ReportingLimitsChangesEquityCreate.vue'
      ),
  },
  {
    path: '/contabilidad/limites-de-reporte-cambios-en-el-patrimonio/editar',
    name: 'ReportingLimitsChangesEquityEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ReportingLimitsChangesEquityList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounting/reporting-limits-for-changes-in-equity/edit/ReportingLimitsChangesEquityEdit.vue'
      ),
  },
  {
    path: '/contabilidad/limites-de-reporte-cambios-en-el-patrimonio/eliminar',
    name: 'ReportingLimitsChangesEquityDelete',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ReportingLimitsChangesEquityList',
        action: 'delete',
      },
    },
    component: () =>
      import(
        '@/views/accounting/reporting-limits-for-changes-in-equity/delete/ReportingLimitsChangesEquityDelete.vue'
      ),
  },
]
