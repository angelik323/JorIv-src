export default [
  {
    path: '/contratacion-derivada/clases-de-polizas-y-tipos-de-riesgos',
    name: 'TypesOfPolicyList',
    component: () =>
      import(
        '@/views/derivative-contracting/types-of-policy/v1/list/TypesOfPolicyList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'TypesOfPolicyList',
        action: 'list',
      },
    },
  },
  {
    path: '/contratacion-derivada/clases-de-polizas-y-tipos-de-riesgos/crear',
    name: 'TypesOfPolicyCreate',
    component: () =>
      import(
        '@/views/derivative-contracting/types-of-policy/v1/create/TypesOfPolicyCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'TypesOfPolicyList',
        action: 'create',
      },
    },
  },
  {
    path: '/contratacion-derivada/clases-de-polizas-y-tipos-de-riesgos/editar/:id',
    name: 'TypesOfPolicyEdit',
    component: () =>
      import(
        '@/views/derivative-contracting/types-of-policy/v1/edit/TypesOfPolicyEdit.vue'
      ),
     meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'TypesOfPolicyList',
        action: 'edit',
      },
    },
  },
]
