export default [
  {
    path: '/tesoreria/metodos-pago-tesoreria',
    name: 'PaymentMethodsList',
    component: () =>
      import('@/views/treasury/payment-methods/v1/list/PaymentMethodsList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'PaymentMethodsList',
      },
    },
  },
  {
    path: '/tesoreria/metodos-pago-tesoreria/crear',
    name: 'PaymentMethodsCreate',
    component: () =>
      import(
        '@/views/treasury/payment-methods/v1/create/PaymentMethodsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'PaymentMethodsList',
        action: 'create',
      },
    },
  },
  {
    path: '/tesoreria/metodos-pago-tesoreria/editar/:id',
    name: 'PaymentMethodsEdit',
    component: () =>
      import('@/views/treasury/payment-methods/v1/edit/PaymentMethodsEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'PaymentMethodsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/tesoreria/metodos-pago-tesoreria/ver/:id',
    name: 'PaymentMethodsDetail',
    component: () =>
      import(
        '@/views/treasury/payment-methods/v1/view/PaymentMethodsDetail.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'PaymentMethodsList',
        action: 'show',
      },
    },
  },
]
