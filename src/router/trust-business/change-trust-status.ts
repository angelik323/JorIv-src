export default [
  {
    path: '/negocios-fiduciarios/cambio-estado-fideicomisos',
    name: 'ChangeTrustStatusList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'ChangeTrustStatusList',
      },
    },
    component: () =>
      import(
        '@/views/trust-business/change-trust-status/v1/list/ChangeTrustStatusList.vue'
      ),
  },
  {
    path: '/negocios-fiduciarios/cambio-estado-fideicomisos/editar/:id',
    name: 'ChangeTrustStatusEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'ChangeTrustStatusList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/trust-business/change-trust-status/v1/edit/ChangeTrustStatusEdit.vue'
      ),
  },
]
