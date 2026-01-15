import taxTypeRouter from '@/router/tax/taxes-type'
import jurisdictionRouter from '@/router/tax/jurisdictions'
import taxesAndWithholdingsRouter from '@/router/tax/taxes-and-withholdings'

export default [
  ...taxTypeRouter,
  ...jurisdictionRouter,
  ...taxesAndWithholdingsRouter,
]
