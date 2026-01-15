export default [
  {
    path: '/contratacion-derivada/registro-de-adiciones',
    name: 'RegisterAdditionsList',
    component: () =>
      import(
        '@/views/derivative-contracting/register-additions/v1/list/RegisterAdditionsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'RegisterAdditionsList',
        action: 'list',
      },
    },
  },

  {
    path: '/contratacion-derivada/registro-de-adiciones/crear/:id',
    name: 'RegisterAdditionsCreate',
    component: () =>
      import(
        '@/views/derivative-contracting/register-additions/v1/create/RegisterAdditionsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'RegisterAdditionsList',
        action: 'create',
      },
    },
  },

  {
    path: '/contratacion-derivada/registro-de-adiciones/editar/:id/:contract_id',
    name: 'RegisterAdditionsEdit',
    component: () =>
      import(
        '@/views/derivative-contracting/register-additions/v1/edit/RegisterAdditionsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'RegisterAdditionsList',
        action: 'edit',
      },
    },
  },

  {
    path: '/contratacion-derivada/registro-de-adiciones/ver/:id/:contract_id',
    name: 'RegisterAdditionsRead',
    component: () =>
      import(
        '@/views/derivative-contracting/register-additions/v1/read/RegisterAdditionsRead.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'RegisterAdditionsList',
        action: 'show',
      },
    },
  },
]
