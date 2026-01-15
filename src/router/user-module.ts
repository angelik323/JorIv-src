export default [
  {
    path: '/usuarios',
    name: 'ListUserView',
    component: () => import('@/views/user-manager/v2/list/UserList.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Users',
        view: 'ListUserView',
      },
    },
  },
  {
    path: '/usuarios/editar-usuario/:id',
    name: 'EditUserView',
    component: () => import('@/views/user-manager/v2/edit/UserEdit.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Users',
        view: 'ListUserView',
        action: 'edit',
      },
    },
  },
  {
    path: '/usuarios/ver-usuario/:id',
    name: 'ReadUserView',
    component: () => import('@/views/user-manager/v2/read/UserRead.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Users',
        view: 'ListUserView',
        action: 'show',
      },
    },
  },
]
