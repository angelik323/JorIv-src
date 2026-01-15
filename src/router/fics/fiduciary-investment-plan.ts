export default [
  {
    path: '/fics/planes-inversion-fiduciario',
    name: 'FiduciaryInvestmentPlanList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'FiduciaryInvestmentPlanList',
      },
    },
    component: () =>
      import(
        '@/views/fics/fiduciary-investment-plan/v1/list/FiduciaryInvestmentPlanList.vue'
      ),
  },
  {
    path: '/fics/planes-inversion-fiduciario/gestion-cuentas-bancarias/:id',
    name: 'AccountManagementList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'FiduciaryInvestmentPlanList',
      },
    },
    component: () =>
      import(
        '@/views/fics/fiduciary-investment-plan/v1/list/AccountManagementList.vue'
      ),
  },
  {
    path: '/fics/planes-inversion-fiduciario/crear',
    name: 'FiduciaryInvestmentPlanCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'FiduciaryInvestmentPlanList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/fics/fiduciary-investment-plan/v2/create/FiduciaryInvestmentPlanCreate.vue'
      ),
  },
  {
    path: '/fics/planes-inversion-fiduciario/gestion-cuentas-bancarias/crear/:id',
    name: 'AccountManagementCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'FiduciaryInvestmentPlanList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/fics/fiduciary-investment-plan/v1/create/AccountManagementCreate.vue'
      ),
  },
  {
    path: '/fics/planes-inversion-fiduciario/editar/:id',
    name: 'FiduciaryInvestmentPlanEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'FiduciaryInvestmentPlanList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/fics/fiduciary-investment-plan/v2/edit/FiduciaryInvestmentPlanEdit.vue'
      ),
  },
  {
    path: '/fics/planes-inversion-fiduciario/ver/:id',
    name: 'FiduciaryInvestmentPlanView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'FiduciaryInvestmentPlanList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/fics/fiduciary-investment-plan/v2/view/FiduciaryInvestmentPlanView.vue'
      ),
  },
  {
    path: '/fics/planes-inversion-fiduciario/ajuste-cuentas-bancarias/crear/:id',
    name: 'AccountAdjustmentCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'FiduciaryInvestmentPlanList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/fics/fiduciary-investment-plan/v1/create/AccountAdjustmentCreate.vue'
      ),
  },
  {
    path: '/fics/planes-inversion-fiduciario/consultar-saldos/ver/:id',
    name: 'CheckBalancesView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'FiduciaryInvestmentPlanList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/fics/fiduciary-investment-plan/v1/check-valances/CheckBalancesView.vue'
      ),
  },
  {
    path: '/fics/planes-inversion-fiduciario/saldos-con-control-de-aportes/ver/:id',
    name: 'CheckBalancesControlView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'FiduciaryInvestmentPlanList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/fics/fiduciary-investment-plan/v1/check-balances-control/CheckBalancesControlView.vue'
      ),
  },
  {
    path: '/fics/planes-inversion-fiduciario/reportes',
    name: 'FiduciaryInvestmentPlanReport',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'FiduciaryInvestmentPlanList',
        action: 'export',
      },
    },
    component: () =>
      import(
        '@/views/fics/fiduciary-investment-plan/v1/reports/FiduciaryInvestmentPlanReports.vue'
      ),
  },
  {
    path: '/fics/planes-inversion-fiduciario/movimientos-plan-de-inversion/ver/:id',
    name: 'CheckBalancesPlanList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'FiduciaryInvestmentPlanList',
      },
    },
    component: () =>
      import(
        '@/views/fics/fiduciary-investment-plan/v1/check-balances-plan/CheckBalancesPlanList.vue'
      ),
  },
  {
    path: '/fics/planes-inversion-fiduciario/consultar-unidades/ver/:id',
    name: 'ConsultUnitsView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'FiduciaryInvestmentPlanList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/fics/fiduciary-investment-plan/v1/consult-units/ConsultUnitsView.vue'
      ),
  },
]
