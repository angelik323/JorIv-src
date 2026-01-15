export default [
  {
    path: '/fics/comision-fiduciaria',
    name: 'FiduciaryCommissionList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: { module: 'Fics', view: 'FiduciaryCommissionList' },
    },
    component: () =>
      import(
        '@/views/fics/fiduciary-commission/v1/list/FiduciaryCommissionList.vue'
      ),
  },
  {
    path: '/fics/comision-fiduciaria/crear',
    name: 'FiduciaryCommissionCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'FiduciaryCommissionList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/fics/fiduciary-commission/v1/create/FiduciaryCommissionCreate.vue'
      ),
  },
  {
    path: '/fics/comision-fiduciaria/editar/:id',
    name: 'FiduciaryCommissionEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'FiduciaryCommissionList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/fics/fiduciary-commission/v1/edit/FiduciaryCommissionEdit.vue'
      ),
  },
  {
    path: '/fics/comision-fiduciaria/ver/:id',
    name: 'FiduciaryCommissionView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'FiduciaryCommissionList',
        action: 'view',
      },
    },
    component: () =>
      import(
        '@/views/fics/fiduciary-commission/v1/view/FiduciaryCommissionView.vue'
      ),
  },
]
