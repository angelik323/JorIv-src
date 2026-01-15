export default [
  {
    path: '/activos-fijos/calculo-deterioro',
    name: 'CalculationDeteriorationList',
    meta: {
      requiresAuth: false,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'CalculationDeteriorationList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/fixed-assets/calculation-deterioration/v1/list/CalculationDeteriorationList.vue'
      ),
  },
  {
    path: '/activos-fijos/calculo-deterioro/crear',
    name: 'CalculationDeteriorationCreate',
    meta: {
      requiresAuth: false,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'CalculationDeteriorationList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/fixed-assets/calculation-deterioration/v1/create/CalculationDeteriorationCreate.vue'
      ),
  },
  {
    path: '/activos-fijos/calculo-deterioro/ver/:id',
    name: 'CalculationDeteriorationView',
    meta: {
      requiresAuth: false,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'CalculationDeteriorationList',
        action: 'view',
      },
    },
    component: () =>
      import(
        '@/views/fixed-assets/calculation-deterioration/v1/read/CalculationDeteriorationView.vue'
      ),
  },
]
