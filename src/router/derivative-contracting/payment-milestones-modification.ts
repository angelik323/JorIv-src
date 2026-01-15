export default [
  {
    path: '/contratacion-derivada/modificacion-hitos-de-pago',
    name: 'PaymentMilestonesModificationList',
    component: () =>
      import(
        '@/views/derivative-contracting/payment-milestones-modification/v1/list/PaymentMilestonesModificationList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'PaymentMilestonesModificationList',
        action: 'list',
      },
    },
  },
  {
    path: '/contratacion-derivada/modificacion-hitos-de-pago/editar/:contract_id/:adition_id/:milestone_number',
    name: 'PaymentMilestonesModificationEdit',
    component: () =>
      import(
        '@/views/derivative-contracting/payment-milestones-modification/v1/edit/PaymentMilestonesModificationEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'PaymentMilestonesModificationList',
        action: 'edit',
      },
    },
  },
  {
    path: '/contratacion-derivada/modificacion-hitos-de-pago/ver/:contract_id/:adition_id/:milestone_number',
    name: 'PaymentMilestonesModificationView',
    component: () =>
      import(
        '@/views/derivative-contracting/payment-milestones-modification/v1/view/PaymentMilestonesModificationView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'PaymentMilestonesModificationList',
        action: 'show',
      },
    },
  },
]
