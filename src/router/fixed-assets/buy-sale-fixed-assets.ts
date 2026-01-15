export default [

  {
    path: '/activos-fijos/compra-venta-activos-fijos-bienes',
    name: 'BuySaleFixedAssetsList',
    component: () =>
      import('@/views/fixed-assets/buy-sale-fixed-assets/v1/list/BuySaleFixedAssetsList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'BuySaleFixedAssetsList'
      }
    }
  },

  {
    path: '/activos-fijos/compra-venta-activos-fijos-bienes/compra/crear',
    name: 'BuyFixedAssetsCreate',
    component: () =>
      import('@/views/fixed-assets/buy-sale-fixed-assets/v1/buy/create/BuyFixedAssetsCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'BuySaleFixedAssetsList',
        action: 'create'
      }
    }
  },
  {
    path: '/activos-fijos/compra-venta-activos-fijos-bienes/compra/importar',
    name: 'BuyFixedAssetsImport',
    component: () =>
      import('@/views/fixed-assets/buy-sale-fixed-assets/v1/buy/import/BuyFixedAssetsImport.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'BuySaleFixedAssetsList',
        action: 'create'
      }
    }
  },
  {
    path: '/activos-fijos/compra-venta-activos-fijos-bienes/compra/editar/:id',
    name: 'BuyFixedAssetsEdit',
    component: () =>
      import('@/views/fixed-assets/buy-sale-fixed-assets/v1/buy/edit/BuyFixedAssetsEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'BuySaleFixedAssetsList',
        action: 'edit'
      }
    }
  },
  {
    path: '/activos-fijos/compra-venta-activos-fijos-bienes/compra/ver/:id',
    name: 'BuyFixedAssetsRead',
    component: () =>
      import('@/views/fixed-assets/buy-sale-fixed-assets/v1/buy/read/BuyFixedAssetsRead.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'BuySaleFixedAssetsList',
        action: 'show'
      }
    }
  },

  {
    path: '/activos-fijos/compra-venta-activos-fijos-bienes/venta/crear',
    name: 'SaleFixedAssetsCreate',
    component: () =>
      import('@/views/fixed-assets/buy-sale-fixed-assets/v1/sale/create/SaleFixedAssetsCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'BuySaleFixedAssetsList',
        action: 'create'
      }
    }
  },
  {
    path: '/activos-fijos/compra-venta-activos-fijos-bienes/venta/editar/:id',
    name: 'SaleFixedAssetsEdit',
    component: () =>
      import('@/views/fixed-assets/buy-sale-fixed-assets/v1/sale/edit/SaleFixedAssetsEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'BuySaleFixedAssetsList',
        action: 'edit'
      }
    }
  },
  {
    path: '/activos-fijos/compra-venta-activos-fijos-bienes/venta/ver/:id',
    name: 'SaleFixedAssetsRead',
    component: () =>
      import('@/views/fixed-assets/buy-sale-fixed-assets/v1/sale/read/SaleFixedAssetsRead.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'BuySaleFixedAssetsList',
        action: 'show'
      }
    }
  }
]
