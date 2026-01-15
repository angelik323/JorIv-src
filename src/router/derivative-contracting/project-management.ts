export default [
  {
    path: '/contratacion-derivada/administracion-proyectos',
    name: 'ProjectManagementList',
    component: () =>
      import(
        '@/views/derivative-contracting/project-management/v1/list/ProjectManagementList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'ProjectManagementList',
        action: 'list',
      },
    },
  },
  {
    path: '/contratacion-derivada/administracion-proyectos/crear',
    name: 'ProjectManagementCreate',
    component: () =>
      import(
        '@/views/derivative-contracting/project-management/v1/create/ProjectManagementCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'ProjectManagementList',
        action: 'create',
      },
    },
  },
  {
    path: '/contratacion-derivada/administracion-proyectos/editar/:id',
    name: 'ProjectManagementEdit',
    component: () =>
      import(
        '@/views/derivative-contracting/project-management/v1/edit/ProjectManagementEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'ProjectManagementList',
        action: 'edit',
      },
    },
  },
  {
    path: '/contratacion-derivada/administracion-proyectos/ver/:id',
    name: 'ProjectManagementView',
    component: () =>
      import(
        '@/views/derivative-contracting/project-management/v1/view/ProjectManagementView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'ProjectManagementList',
        action: 'show',
      },
    },
  },
]
