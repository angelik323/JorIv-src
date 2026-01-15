<template>
  <div class="row q-col-gutter-md">
    <div
      v-for="(field, index) in expenseFields"
      :key="index"
      class="col-12 col-md-6"
    >
      <p class="text-bold text-black-90 mb-0">{{ field.label }}</p>
      <p class="text-grey-90">{{ field.value ?? 'Sin información' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import useExpenseAuthorizationDetails from './ExpenseAuthorizationDetails'

import { IAuthorizationTreasuryDetail } from '@/interfaces/customs/treasury/AuthorizationTreasury'

const props = defineProps<{
  response: IAuthorizationTreasuryDetail
}>()

const { expenseFields } = useExpenseAuthorizationDetails(props)
</script>
