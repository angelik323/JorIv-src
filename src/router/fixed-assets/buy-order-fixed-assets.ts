export default [
  {
    path: '/activos-fijos/orden-compra-activos-fijos-bienes',
    name: 'BuyOrderFixedAssetsList',
    component: () =>
      import('@/views/fixed-assets/buy-order-fixed-assets/v1/list/BuyOrderFixedAssetsList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'BuyOrderFixedAssetsList'
      }
    }
  },
  {
    path: '/activos-fijos/orden-compra-activos-fijos-bienes/crear',
    name: 'BuyOrderFixedAssetsCreate',
    component: () =>
      import('@/views/fixed-assets/buy-order-fixed-assets/v1/create/BuyOrderFixedAssetsCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'BuyOrderFixedAssetsList',
        action: 'create'
      }
    }
  },
  {
    path: '/activos-fijos/orden-compra-activos-fijos-bienes/editar/:id',
    name: 'BuyOrderFixedAssetsEdit',
    component: () =>
      import('@/views/fixed-assets/buy-order-fixed-assets/v1/edit/BuyOrderFixedAssetsEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'BuyOrderFixedAssetsList',
        action: 'edit'
      }
    }
  },
  {
    path: '/activos-fijos/orden-compra-activos-fijos-bienes/ver/:id',
    name: 'BuyOrderFixedAssetsRead',
    component: () =>
      import('@/views/fixed-assets/buy-order-fixed-assets/v1/read/BuyOrderFixedAssetsRead.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'BuyOrderFixedAssetsList',
        action: 'show'
      }
    }
  }
]
