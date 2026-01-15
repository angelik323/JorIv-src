export default [
  {
    path: '/facturacion-cartera/recaudo-comision-fiduciaria',
    name: 'CollectionTrustCommissionList',
    component: () =>
      import(
        '@/views/billing-portfolio/trust-commission-collection/v1/list/TrustCommissionCollectionList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'CollectionTrustCommissionList',
      },
    },
  },
  {
    path: '/facturacion-cartera/recaudo-comision-fiduciaria/crear',
    name: 'CollectionTrustCommissionCreate',
    component: () =>
      import(
        '@/views/billing-portfolio/trust-commission-collection/v1/create/TrustCommissionCollectionCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'CollectionTrustCommissionList',
        action: 'create',
      },
    },
  },
]
