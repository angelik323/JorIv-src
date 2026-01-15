export default [
  {
    path: '/negocios-fiduciarios/plan-de-pagos',
    name: 'PaymentPlanList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'PaymentPlanList',
      },
    },
    component: () =>
      import('@/views/trust-business/payment-plan/v1/list/PaymentPlanList.vue'),
  },
  {
    path: '/negocios-fiduciarios/plan-de-pagos/crear',
    name: 'PaymentPlanCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'PaymentPlanList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/trust-business/payment-plan/v1/create/PaymentPlanCreate.vue'
      ),
  },
  {
    path: '/negocios-fiduciarios/plan-de-pagos/editar/:id',
    name: 'PaymentPlanEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'PaymentPlanList',
        action: 'edit',
      },
    },
    component: () =>
      import('@/views/trust-business/payment-plan/v1/edit/PaymentPlanEdit.vue'),
  },
  {
    path: '/negocios-fiduciarios/plan-de-pagos/ver/:id',
    name: 'PaymentPlanView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'PaymentPlanList',
        action: 'show',
      },
    },
    component: () =>
      import('@/views/trust-business/payment-plan/v1/view/PaymentPlanView.vue'),
  },
]
