<template>
  <div class="q-pa-md">
    <TableList
      :loading="tableProps.loading"
      :title="tableProps.title"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :pages="tableProps.pages"
      :show-filter="false"
      :show-top-right-buttons="false"
      @update-page="updatePage"
    />

    <div class="row justify-end q-mt-lg">
      <Button
        label="Finalizar"
        size="md"
        unelevated
        :outline="false"
        color="orange"
        class="text-capitalize btn-filter custom"
        @click="$emit('cancel')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

// Components
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'

// Logic
import useBudgetDocumentList from '@/components/Lists/DerivativeContracting/PaymentMilestonesModification/BudgetDocument/BudgetDocumentList'

const props = defineProps<{
  contractSubscriptionDate: string
  isLocalCurrency: boolean
  contractValue: number
  foreignValue: number
  trm: number
  currentTotalLocal: number
  currentTotalForeign: number
  milestoneNumber: string
  milestone_id?: number
}>()

const emits = defineEmits(['submit', 'cancel'])

const {
  tableProps,
  resetForm,
  updatePage,
} = useBudgetDocumentList(props)

defineExpose({
  resetForm
})
</script>
