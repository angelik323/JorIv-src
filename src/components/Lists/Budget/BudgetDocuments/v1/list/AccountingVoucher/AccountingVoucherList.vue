<template>
  <TableList
    :title="tableProps.title"
    :loading="tableProps.loading"
    :columns="tableProps.columns"
    :rows="tableProps.rows"
    :pages="tableProps.pages"
    :custom-columns="tableCustomCols"
    @update-page="handleUpdatePage"
    @update-rows-per-page="handleUpdateRowsPerPage"
  >
    <template
      #actions="{ row }: { row: IBudgetDocumentsAccountingVoucherListItem }"
    >
      <Button
        class-custom="custom"
        color="orange"
        colorIcon="#f45100"
        flat
        tooltip="Ver"
        :left-icon="defaultIconsLucide.eye"
        :outline="false"
        @click="handleGoToAccountingView(row)"
      />
    </template>
  </TableList>
</template>

<script setup lang="ts">
// Components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Interfaces
import { IBudgetDocumentsAccountingVoucherListItem } from '@/interfaces/customs/budget/BudgetDocuments'

// Logic
import useAccountingVoucherList from '@/components/Lists/Budget/BudgetDocuments/v1/list/AccountingVoucher/AccountingVoucherList'

const props = withDefaults(
  defineProps<{
    documentId?: number
  }>(),
  {}
)

const {
  // composable refs and variables
  defaultIconsLucide,

  // Refs and computed props
  tableProps,
  tableCustomCols,

  // Functions/Methods
  handleUpdatePage,
  handleUpdateRowsPerPage,
  handleGoToAccountingView,
} = useAccountingVoucherList(props)
</script>
