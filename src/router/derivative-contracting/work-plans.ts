export default [
  {
    path: '/contratacion-derivada/planes-de-obra',
    name: 'WorkPlansList',
    component: () =>
      import(
        '@/views/derivative-contracting/work-plans/v1/list/WorkPlansList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'WorkPlansList',
        action: 'list',
      },
    },
  },
  {
    path: '/contratacion-derivada/planes-de-obra/crear',
    name: 'WorkPlansCreate',
    component: () =>
      import(
        '@/views/derivative-contracting/work-plans/v1/create/WorkPlansCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'WorkPlansList',
        action: 'create',
      },
    },
  },
  {
    path: '/contratacion-derivada/planes-de-obra/editar/:id',
    name: 'WorkPlansEdit',
    component: () =>
      import(
        '@/views/derivative-contracting/work-plans/v1/edit/WorkPlansEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'WorkPlansList',
        action: 'edit',
      },
    },
  },
]
