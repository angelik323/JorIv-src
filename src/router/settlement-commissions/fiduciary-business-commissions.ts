export default [
  {
    path: '/liquidacion-de-comisiones/comisiones-de-negocios-fiduciarios',
    name: 'BusinessTrustCommissionsList',
    component: () =>
      import(
        '@/views/settlement-commissions/fiduciary-business-commissions/v2/list/FiduciaryBusinessCommissionsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'BusinessTrustCommissionsList',
        action: 'list',
      },
    },
  },
  {
    path: '/liquidacion-de-comisiones/comisiones-de-negocios-fiduciarios/crear',
    name: 'FiduciaryBusinessCommissionsCreate',
    component: () =>
      import(
        '@/views/settlement-commissions/fiduciary-business-commissions/v2/create/FiduciaryBusinessCommissionsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'BusinessTrustCommissionsList',
        action: 'create',
      },
    },
  },
  {
    path: '/liquidacion-de-comisiones/comisiones-de-negocios-fiduciarios/editar/:id',
    name: 'FiduciaryBusinessCommissionsEdit',
    component: () =>
      import(
        '@/views/settlement-commissions/fiduciary-business-commissions/v2/edit/FiduciaryBusinessCommissionsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'BusinessTrustCommissionsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/liquidacion-de-comisiones/comisiones-de-negocios-fiduciarios/ver/:id',
    name: 'FiduciaryBusinessCommissionsView',
    component: () =>
      import(
        '@/views/settlement-commissions/fiduciary-business-commissions/v2/view/FiduciaryBusinessCommissionsView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'BusinessTrustCommissionsList',
        action: 'show',
      },
    },
  },
]
