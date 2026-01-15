export default [
  {
    path: '/embargos',
    name: 'SeizuresList',
    component: () =>
      import('@/views/seizures/seizures/v1/list/SeizuresList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Seizure',
        view: 'SeizuresList',
        action: 'list',
      },
    },
  },
  {
    path: '/embargos/crear',
    name: 'SeizuresCreate',
    component: () =>
      import('@/views/seizures/seizures/v1/create/SeizuresCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Seizure',
        view: 'SeizuresList',
        action: 'create',
      },
    },
  },
  {
    path: '/embargos/crear/masivo',
    name: 'SeizuresCreateMassive',
    component: () =>
      import(
        '@/views/seizures/seizures/v1/createMassive/SeizuresCreateMassive.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Seizure',
        view: 'SeizuresList',
        action: 'create',
      },
    },
  },
  {
    path: '/embargos/editar/:id',
    name: 'SeizuresEdit',
    component: () =>
      import('@/views/seizures/seizures/v1/edit/SeizuresEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Seizure',
        view: 'SeizuresList',
        action: 'edit',
      },
    },
  },
  {
    path: '/embargos/ver/:id',
    name: 'SeizuresView',
    component: () =>
      import('@/views/seizures/seizures/v1/view/SeizuresView.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Seizure',
        view: 'SeizuresList',
        action: 'show',
      },
    },
  },
  {
    path: '/embargos/parametros',
    name: 'SeizuresParametersList',
    component: () =>
      import('@/views/seizures/parameters/v1/list/ParametersList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Seizure',
        view: 'SeizuresList',
        action: 'export',
      },
    },
  },
  {
    path: '/embargos/gestionar/:id',
    name: 'SeizuresCreateManage',
    component: () =>
      import(
        '@/views/seizures/seizures/v1/createManage/SeizuresCreateManage.vue'
      ),

    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Seizure',
        view: 'SeizuresList',
        action: 'create',
      },
    },
  },
  {
    path: '/seizures/:id/management',
    name: 'SeizuresViewManage',
    component: () =>
      import('@/views/seizures/seizures/v1/viewManage/SeizuresViewManage.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Seizure',
        view: 'SeizuresList',
        action: 'show',
      },
    },
  },
]
