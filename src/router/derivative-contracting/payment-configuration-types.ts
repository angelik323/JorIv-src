export default [
  {
    path: '/contratacion-derivada/tipos-de-configuracion-de-pagos',
    name: 'TypesConfigurationPaymentList',
    component: () =>
      import(
        '@/views/derivative-contracting/type-payments-configuration/v1/list/TypesConfigurationPaymentList.vue'
    ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'TypesConfigurationPaymentList',
        action: 'list'
      },
    },
  },
  {
    path: '/contratacion-derivada/tipos-de-configuracion-de-pagos/crear',
    name: 'TypesConfigurationPaymentCreate',
    component: () =>
      import(
        '@/views/derivative-contracting/type-payments-configuration/v1/create/TypesConfigurationPaymentCreate.vue'
    ),
   meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'TypesConfigurationPaymentList',
        action: 'create'
      },
    },
  },
  {
    path: '/contratacion-derivada/tipos-de-configuracion-de-pagos/editar/:id',
    name: 'TypesConfigurationPaymentEdit',
    component: () =>
      import(
        '@/views/derivative-contracting/type-payments-configuration/v1/edit/TypesConfigurationPaymentEdit.vue'
    ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'TypesConfigurationPaymentList',
        action: 'edit'
      },
    },
  },
]
  