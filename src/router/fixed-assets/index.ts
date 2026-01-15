import configurationActiveNoveltyTypesListRouter from '@/router/fixed-assets/configuration-active-novelty-types'
import cashGeneratingUnit from '@/router/fixed-assets/cash-generating-unit'
import accountingConfigurationRouter from '@router/fixed-assets/accounting-configuration'
import visitRecords from '@router/fixed-assets/visit-records'
import calculationDeterioration from '@router/fixed-assets/calculation-deterioration'
import buyOrderFixedAssets from '@router/fixed-assets/buy-order-fixed-assets'
import buySaleFixedAssets from '@router/fixed-assets/buy-sale-fixed-assets'
import register from '@router/fixed-assets/register'
import locations from '@router/fixed-assets/locations'
import consolidation from '@router/fixed-assets/consolidation'
import registerAuthorizationChangesRouter from '@/router/fixed-assets/register-authorization-changes'

export default [
  ...configurationActiveNoveltyTypesListRouter,
  ...accountingConfigurationRouter,
  ...cashGeneratingUnit,
  ...visitRecords,
  ...calculationDeterioration,
  ...buyOrderFixedAssets,
  ...buySaleFixedAssets,
  ...register,
  ...locations,
  ...consolidation,
  ...registerAuthorizationChangesRouter,
]
