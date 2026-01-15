<template>
  <section v-if="!isLoading">
    <Banks :data="models.bank_accounts" :action="action" />

    <Expenses :data="models.business_trust_general_orders" :action="action" />
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    data?: ITrustBusinessFinanceForm | null
    action: ActionType
  }>(),
  {}
)

// components
import Banks from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/FinanceForm/Banks/Banks.vue'
import Expenses from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/FinanceForm/Expenses/Expenses.vue'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { ITrustBusinessFinanceForm } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// logic-view
import useFinanceForm from './FinanceForm'

const { models, isLoading } = useFinanceForm(props)

defineExpose({
  validateForm: () => true,
})
</script>
