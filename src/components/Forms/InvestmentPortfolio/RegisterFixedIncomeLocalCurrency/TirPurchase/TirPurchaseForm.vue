<template>
  <section aria-label="Sección de TIR compra">
    <TableList
      :title="tableProps.title"
      :loading="tableProps.loading"
      :rows="tableProps.rows"
      :columns="tableProps.columns"
      :pages="tableProps.pages"
      :custom-columns="['index', 'date', 'interest', 'capital']"
    >
      <template #index="{ row }">{{ row.__index }}</template>
      <template #date="{ row }">{{ row.date }}</template>
      <template #interest="{ row }">{{
        utils.getFormatNumber(row.interest)
      }}</template>
      <template #capital="{ row }">{{
        utils.getFormatNumber(row.capital)
      }}</template>
    </TableList>

    <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
      <div class="col-12 col-md-4">
        <GenericInputComponent
          :default_value="displayTir"
          label="Tir Compra"
          placeholder="-"
          type="text"
          disabled
        />
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import TableList from '@/components/table-list/TableList.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import useTirPurchase from './TirPurchaseForm'
import { useUtils } from '@/composables'

const utils = useUtils()
const {
  tableProps,
  displayTir,
  setFlows,
  setTirPurchase,
  resetForm,
  loadFromService,
  validateForm,
} = useTirPurchase()

defineExpose({
  resetForm,
  getValues: () => ({
    flows: tableProps.value.rows,
    tir_purchase: displayTir.value ?? undefined,
  }),
  setFlows,
  setTirPurchase,
  loadFromService,
  validateForm,
})
</script>
