export default [
  {
    path: '/tributario/impuestos-y-retenciones',
    name: 'TaxesAndWithholdingsList',
    component: () =>
      import(
        '@/views/tax/taxes-and-withholdings/v1/list/TaxesAndWithholdingsList.vue'
      ),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Tax',
        view: 'TaxesAndWithholdingsList',
      },
    },
  },
  {
    path: '/tributario/impuestos-y-retenciones/crear',
    name: 'TaxesAndWithholdingsCreate',
    component: () =>
      import(
        '@/views/tax/taxes-and-withholdings/v1/create/TaxesAndWithholdingsCreate.vue'
      ),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Tax',
        view: 'TaxesAndWithholdingsList',
        action: 'create',
      },
    },
  },
  {
    path: '/tributario/impuestos-y-retenciones/editar/:id',
    name: 'TaxesAndWithholdingsEdit',
    component: () =>
      import(
        '@/views/tax/taxes-and-withholdings/v1/edit/TaxesAndWithholdingsEdit.vue'
      ),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Tax',
        view: 'TaxesAndWithholdingsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/tributario/impuestos-y-retenciones/editar/vigencias/:id',
    name: 'TaxesAndWithholdingsValidities',
    component: () =>
      import(
        '@/views/tax/taxes-and-withholdings/v1/edit/TaxesAndWithholdingsValidities.vue'
      ),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Tax',
        view: 'TaxesAndWithholdingsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/tributario/impuestos-y-retenciones/ver/:id',
    name: 'TaxesAndWithholdingsRead',
    component: () =>
      import(
        '@/views/tax/taxes-and-withholdings/v1/read/TaxesAndWithholdingsRead.vue'
      ),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Tax',
        view: 'TaxesAndWithholdingsList',
        action: 'show',
      },
    },
  },
]
