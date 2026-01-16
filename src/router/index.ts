import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAlert } from '@/composables/useAlert'
import { useRouteValidator } from '@/composables/useRoutesValidator'
import { IRoleValidationMeta } from '@/interfaces/global'

import { useLogin } from '@/stores'
import { storeToRefs } from 'pinia'

// Routes
import userModuleRouter from '@/router/user-module'
import rolesModuleRouter from '@/router/roles'
import notFoundRouter from '@/router/not-found'
import authRouter from '@/router/auth'
import homeRouter from '@/router/home'
import thirdPartiesRouter from '@/router/third-parties'
import profileRouter from '@/router/profile'
import clientsRouter from '@/router/clients'
import cancellationCodesTreasury from '@/router/cancellation-codes-treasury'
import userParameter from '@/router/user-parameter'
import securityRouter from '@/router/security'
import bankReversalCauses from '@/router/grounds-bank-refund'
import typesCollectionRouter from '@/router/types-collection'
import paymentMethodsTreasury from './payment-methods-treasury'
import bankingEntitiesRouter from '@/router/banking-entities'
import cashFlowStructuresRouter from '@/router/cash-flow-structures'
import bankBranchesRouter from '@/router/bank-branches'
import bankAccountBalancesRouter from '@/router/treasury/bank-account-balances'
import bankContactsRouter from './bank-contacts'
import configurationTypesSubtypesRouter from '@/router/fixed-assets/configuration-types-subtypes'
import pocRouter from '@/router/poc'
// Modules
import accountingRouter from '@/router/accounting'
import treasuryRouter from '@/router/treasury'
import agendaRouter from '@/router/agenda'
import trustBusinessRouter from '@/router/trust-business'
import ficsRouter from '@/router/fics'
import investmentPortfolioRouter from '@/router/investment-portfolio'
import settlementCommissionsRouter from '@/router/settlement-commissions'
import billingPortfolio from '@/router/billing-portfolio'
import budgetRouter from '@/router/budget'
import derivativeContractingRouter from '@/router/derivative-contracting'
import fixedAssetsRouter from '@/router/fixed-assets'
import accountsPayableRouter from '@/router/accounts-payable'
import normativeRouter from '@/router/normative'
import taxRouter from '@/router/tax'
import auditRouter from '@/router/audit'
import sarlaft from '@/router/sarlaft'
import seizures from '@/router/seizures'
import financialObligationsRouter from '@/router/financial-obligations'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    children: [...authRouter],
    component: () => import('@/layouts/Auth/AuthLayout.vue'),
  },
  {
    path: '/chatbot',
    name: 'Chatbot',
    component: () => import('@/views/chat/Chatbot.vue'),
    meta: { requiresAuth: false, title: 'Chat - Asistente Virtual' },
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/home',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () => import('@/layouts/SideBarMenu/SideBarMenu.vue'),
    children: [
      ...homeRouter,
      ...profileRouter,
      ...userModuleRouter,
      ...rolesModuleRouter,
      ...notFoundRouter,
      ...thirdPartiesRouter,
      ...clientsRouter,
      ...userParameter,
      ...securityRouter,
      ...bankReversalCauses,
      ...cancellationCodesTreasury,
      ...typesCollectionRouter,
      ...paymentMethodsTreasury,
      ...bankingEntitiesRouter,
      ...bankAccountBalancesRouter,
      ...bankBranchesRouter,
      ...cashFlowStructuresRouter,
      ...bankAccountBalancesRouter,
      ...bankContactsRouter,
      ...configurationTypesSubtypesRouter,
      ...pocRouter,
      // Modules
      ...accountingRouter,
      ...treasuryRouter,
      ...agendaRouter,
      ...trustBusinessRouter,
      ...investmentPortfolioRouter,
      ...ficsRouter,
      ...settlementCommissionsRouter,
      ...billingPortfolio,
      ...budgetRouter,
      ...fixedAssetsRouter,
      ...derivativeContractingRouter,
      ...accountsPayableRouter,
      ...normativeRouter,
      ...taxRouter,
      ...fixedAssetsRouter,
      ...auditRouter,
      ...sarlaft,
      ...seizures,
      ...financialObligationsRouter,
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const { token, /* firstLogin, */ isAdmin } = storeToRefs(useLogin())
  const { validateRouter } = useRouteValidator()
  const { showAlert } = useAlert()

  // if (to.meta.requiresFirstPasswordChanged && firstLogin.value && token.value) {
  //   showAlert(
  //     '¡Por su seguridad, debe cambiar la contraseña para acceder a los modulos!',
  //     'info'
  //   )
  //   return { name: 'ChangePassword' }
  // }

  if (
    token.value &&
    ['LoginView', 'SMSVerify', 'OTPVerify'].includes(to.name as string)
  ) {
    showAlert(
      '¡Tienes una sesión iniciada, cierra tu sesión primero!',
      'warning'
    )
    return { name: 'HomeView' }
  }

  if (!to.meta.requiresAuth) return

  if (!token.value && to.name !== 'LoginView') {
    localStorage.clear()
    showAlert('¡Debes iniciar sesión para acceder a los modulos!', 'warning')
    return { name: 'LoginView' }
  }

  if (to.meta.requiredValidRole) {
    if (!Array.isArray(to.meta.requiredValidRole)) {
      const { module, view, action } = to.meta
        .requiredValidRole as IRoleValidationMeta

      const isAllowed = validateRouter(module, view, action)

      if (!isAllowed) {
        showAlert(
          '¡No cuenta con los permisos necesarios para acceder a este módulo!',
          'error'
        )
        return { name: 'HomeView' }
      }
    }

    if (Array.isArray(to.meta.requiredValidRole)) {
      const isAllowed = to.meta.requiredValidRole.map(
        (roleMeta: IRoleValidationMeta) => {
          return validateRouter(roleMeta.module, roleMeta.view, roleMeta.action)
        }
      )

      if (isAllowed.some((allowed) => allowed)) {
        return
      } else {
        showAlert(
          '¡No cuenta con los permisos necesarios para acceder a este módulo!',
          'error'
        )
        return { name: 'HomeView' }
      }
    }
  }

  if (to.meta.requiresAdmin === true && !token.value) {
    showAlert('¡No tienes permisos para acceder a este módulo!', 'warning')
    return { name: 'HomeView' }
  } else if (to.meta.requiresAdmin === true && isAdmin) {
    return
  }
})

export default router
