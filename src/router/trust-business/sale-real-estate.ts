export default [
  {
    path: '/negocios-fiduciarios/venta-inmuebles',
    name: 'SaleRealEstateList',
    component: () =>
      import(
        '@/views/trust-business/sale-real-estate/v1/list/SaleRealEstateList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'SaleRealEstateList',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/venta-inmuebles/crear',
    name: 'SaleRealEstateCreate',
    component: () =>
      import(
        '@/views/trust-business/sale-real-estate/v1/create/SaleRealEstateCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'SaleRealEstateList',
        action: 'create',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/venta-inmuebles/editar/:id',
    name: 'SaleRealEstateEdit',
    component: () =>
      import(
        '@/views/trust-business/sale-real-estate/v1/edit/SaleRealEstateEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'SaleRealEstateList',
        action: 'edit',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/venta-inmuebles/ver/:id',
    name: 'SaleRealEstateView',
    component: () =>
      import(
        '@/views/trust-business/sale-real-estate/v1/view/SaleRealEstateView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'SaleRealEstateList',
        action: 'show',
      },
    },
  },
]
