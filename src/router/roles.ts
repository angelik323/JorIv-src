export default [
  {
    path: '/roles',
    name: 'ListRoles',
    component: () => import('@/views/roles/list/ListRoles.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Users',
        view: 'ListRoles',
      },
    },
  },
  {
    path: '/roles/crear-roles',
    name: 'CreateRoles',
    component: () => import('@/views/roles/create/CreateRoles.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Users',
        view: 'ListRoles',
        action: 'create',
      },
    },
  },
  {
    path: '/roles/editar-roles/:id',
    name: 'EditRoles',
    component: () => import('@/views/roles/edit/EditRoles.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Users',
        view: 'ListRoles',
        action: 'edit',
      },
    },
  },
  {
    path: '/roles/ver-roles/:id',
    name: 'ViewRoles',
    component: () => import('@/views/roles/view/ViewRoles.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Users',
        view: 'ListRoles',
        action: 'show',
      },
    },
  },
]
