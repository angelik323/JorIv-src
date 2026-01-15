export default [
  {
    path: '/contratacion-derivada/clases-de-polizas-y-tipos-de-riesgos/riesgos',
    name: 'RiskDefinitionList',
    component: () =>
      import(
        '@/views/derivative-contracting/risk-definition/v1/list/RiskDefinitionList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'RiskDefinitionList',
        action: 'list',
      },
    },
  },
  {
    path: '/contratacion-derivada/clases-de-polizas-y-tipos-de-riesgos/riesgos/crear',
    name: 'RiskDefinitionCreate',
    component: () =>
      import(
        '@/views/derivative-contracting/risk-definition/v1/create/RiskDefinitionCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'RiskDefinitionList',
        action: 'create',
      },
    },
  },
  {
    path: '/contratacion-derivada/clases-de-polizas-y-tipos-de-riesgos/riesgos/editar/:id',
    name: 'RiskDefinitionEdit',
    component: () =>
      import(
        '@/views/derivative-contracting/risk-definition/v1/edit/RiskDefinitionEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'RiskDefinitionList',
        action: 'edit',
      },
    },
  },
]
