export default [
  {
    path: '/contabilidad/reportes-contables',
    name: 'AccoutingReportList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccoutingReportList',
      },
    },
    component: () =>
      import(
        '@/views/accounting/accouting-report/v2/list/AccoutingReportList.vue'
      ),
  },
  {
    path: '/contabilidad/reportes-contables/ver/:id',
    name: 'AccoutingReportView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounting/accouting-report/view/AccoutingReportView.vue'
      ),
  },
  {
    path: '/contabilidad/reportes-contables/situacion-financiera/crear',
    name: 'FinancialStatementCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccoutingReportList',
        action: 'action_generate',
      },
    },
    component: () =>
      import(
        '@/views/accounting/accouting-report/reports/FinancialStatement/create/AccoutingReportCreate.vue'
      ),
  },
  {
    path: '/contabilidad/reportes-contables/situacion-financiera-comparativa/crear',
    name: 'ComparativeStatementCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccoutingReportList',
        action: 'action_generate',
      },
    },
    component: () =>
      import(
        '@/views/accounting/accouting-report/reports/ComparativeStatement/create/ComparativeStatementCreate.vue'
      ),
  },
  {
    path: '/contabilidad/reportes-contables/balance-general-prueba-otras-monedas/crear',
    name: 'BGPOtherCurrenciesCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccoutingReportList',
        action: 'action_generate',
      },
    },
    component: () =>
      import(
        '@/views/accounting/accouting-report/reports/BGPOtherCurrencies/create/BGPOtherCurrenciesCreate.vue'
      ),
  },
  {
    path: '/contabilidad/reportes-contables/balance-general-detallado/crear',
    name: 'DetailedBalanceSheetCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccoutingReportList',
        action: 'action_generate',
      },
    },
    component: () =>
      import(
        '@/views/accounting/accouting-report/v2/reports/DetailedBalanceSheet/create/DetailedBalanceSheetCreate.vue'
      ),
  },
  {
    path: '/contabilidad/reportes-contables/reporte-centro-costo/crear',
    name: 'CostCenterReportCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccoutingReportList',
        action: 'action_generate',
      },
    },
    component: () =>
      import(
        '@/views/accounting/accouting-report/reports/CostCenter/create/CostCenterCreate.vue'
      ),
  },
  {
    path: '/contabilidad/reportes-contables/balance-general-trimestral/crear',
    name: 'QuarterlyBalanceCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccoutingReportList',
        action: 'action_generate',
      },
    },
    component: () =>
      import(
        '@/views/accounting/accouting-report/reports/QuarterlyBalance/QuarterlyBalanceCreate.vue'
      ),
  },
  {
    path: '/contabilidad/reportes-contables/estado-cambios-patrimonio/crear',
    name: 'LegacyReportCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccoutingReportList',
        action: 'action_generate',
      },
    },
    component: () =>
      import(
        '@/views/accounting/accouting-report/reports/LegacyStatus/create/LegacyReportCreate.vue'
      ),
  },
  {
    path: '/contabilidad/reportes-contables/estado-resultados-generales/crear',
    name: 'GeneralReportCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccoutingReportList',
        action: 'action_generate',
      },
    },
    component: () =>
      import(
        '@/views/accounting/accouting-report/reports/GeneralResults/create/GeneralReportCreate.vue'
      ),
  },
  {
    path: '/contabilidad/reportes-contables/auxiliar-acumulado/crear',
    name: 'AccumulatedAuxiliaryCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccoutingReportList',
        action: 'action_generate',
      },
    },
    component: () =>
      import(
        '@/views/accounting/accouting-report/reports/AccumulatedAuxiliary/AccumulatedReportCreate.vue'
      ),
  },
  {
    path: '/contabilidad/reportes-contables/libro-diario/crear',
    name: 'DiaryBookCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccoutingReportList',
        action: 'action_generate',
      },
    },
    component: () =>
      import(
        '@/views/accounting/accouting-report/v2/reports/DiaryBook/create/DiaryBookCreate.vue'
      ),
  },
  {
    path: '/contabilidad/reportes-contables/libro-mayor-y-balances/crear',
    name: 'GeneralLedgerBalancesCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccoutingReportList',
        action: 'action_generate',
      },
    },
    component: () =>
      import(
        '@/views/accounting/accouting-report/v2/reports/GeneraLedgerBalances/create/GeneralLedgerBalancesCreate.vue'
      ),
  },
  {
    path: '/contabilidad/reportes-contables/balance-diario/crear',
    name: 'DailyBalanceCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounting/accouting-report/reports/DailyBalance/create/DailyBalanceCreate.vue'
      ),
  },
  {
    path: '/contabilidad/reportes-contables/balance-consolidado/crear',
    name: 'ConsolidatedBalanceCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounting/accouting-report/v2/reports/ConsolidatedBalance/create/ConsolidatedBalanceCreate.vue'
      ),
  },
]
