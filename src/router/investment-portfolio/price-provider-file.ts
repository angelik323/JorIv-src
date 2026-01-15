export default [
  {
    path: '/portafolio-de-inversiones/archivo-proveedores-precios',
    name: 'PriceProviderFile',
    component: () =>
      import(
        '@/views/investment-portfolio/price-provider-file/v1/list/PriceProviderFileList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversiones/archivo-proveedores-precios/crear',
    name: 'PriceProviderFileCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/price-provider-file/v1/create/PriceProviderFileCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversiones/archivo-proveedores-precios/editar/:id',
    name: 'PriceProviderFileEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/price-provider-file/v1/edit/PriceProviderFileEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversiones/archivo-proveedores-precios/ver/:id',
    name: 'PriceProviderFileView',
    component: () =>
      import(
        '@/views/investment-portfolio/price-provider-file/v1/view/PriceProviderFileView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
