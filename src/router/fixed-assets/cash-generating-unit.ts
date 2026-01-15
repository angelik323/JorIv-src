export default [
  {
    path: '/activos-fijos/unidad-generadora-efectivo',
    name: 'CashGeneratingUnitList',
    meta: {
      requiresAuth: false,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'CashGeneratingUnitList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/fixed-assets/cash_generating_unit/list/CashGeneratingUnitList.vue'
      ),
  },
  {
    path: '/activos-fijos/unidad-generadora-efectivo/crear',
    name: 'CashGeneratingUnitCreate',
    meta: {
      requiresAuth: false,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'CashGeneratingUnitList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/fixed-assets/cash_generating_unit/create/CashGeneratingUnitCreate.vue'
      ),
  },
  {
    path: '/activos-fijos/unidad-generadora-efectivo/editar/:id',
    name: 'CashGeneratingUnitEdit',
    meta: {
      requiresAuth: false,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'CashGeneratingUnitList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/fixed-assets/cash_generating_unit/edit/CashGeneratingUnitEdit.vue'
      ),
  },
]
