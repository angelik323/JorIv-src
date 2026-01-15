export default [
  {
    path: '/negocios-fiduciarios/proyecto-inmobiliario',
    name: 'RealStateProjectList',
    component: () =>
      import(
        '@/views/trust-business/real-state-project/v1/list/RealStateProjectList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'RealStateProjectList',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/proyecto-inmobiliario/crear',
    name: 'RealStateProjectCreate',
    component: () =>
      import(
        '@/views/trust-business/real-state-project/v1/create/RealStateProjectCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'RealStateProjectList',
        action: 'create',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/proyecto-inmobiliario/editar/:id',
    name: 'RealStateProjectEdit',
    component: () =>
      import(
        '@/views/trust-business/real-state-project/v1/edit/RealStateProjectEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'RealStateProjectList',
        action: 'edit',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/proyecto-inmobiliario/ver/:id',
    name: 'RealStateProjectView',
    component: () =>
      import(
        '@/views/trust-business/real-state-project/v1/view/RealStateProjectView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'RealStateProjectList',
        action: 'show',
      },
    },
  },
]
