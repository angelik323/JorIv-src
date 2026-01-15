<template>
  <div class="q-pa-md">
    <div class="q-mb-xl">
      <h6 class="q-ma-none q-mb-md">Sección liquidación</h6>
      <TableList
        :loading="false"
        :columns="settlementColumns"
        :rows="settlementRows"
        :custom-columns="[
          'type',
          'fiscal_charge',
          'concept',
          'base',
          'percentage',
          'value',
          'new_settlement_value',
        ]"
        hide-pagination
        hide-bottom
      >
        <template #type="{ row }">
          <span>{{ row.type || '-' }}</span>
        </template>

        <template #fiscal_charge="{ row }">
          <span>{{ row.fiscal_charge || '-' }}</span>
        </template>

        <template #concept="{ row }">
          <span>{{ row.concept || '-' }}</span>
        </template>

        <template #base="{ row }">
          <span>{{
            formatCurrencyString(row.base, { showCurrencySymbol: false }) || '-'
          }}</span>
        </template>

        <template #percentage="{ row }">
          <span>{{
            formatCurrencyString(row.percentage, {
              showCurrencySymbol: false,
            }) || '-'
          }}</span>
        </template>

        <template #value="{ row }">
          <span>{{
            formatCurrencyString(row.value, { showCurrencySymbol: false }) ||
            '-'
          }}</span>
        </template>

        <template #new_settlement_value="{ row }">
          <span
            >{{
              formatCurrencyString(row.new_settlement_value, {
                showCurrencySymbol: false,
              }) || '-'
            }}
          </span>
        </template>
      </TableList>
    </div>

    <div class="row justify-end q-mt-md q-pa-md">
      <div class="text-weight-medium">
        Valor neto: ${{
          formatCurrencyString(netValue, { showCurrencySymbol: false }) ||
          '0,00'
        }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Components
import TableList from '@/components/table-list/TableList.vue'

// Logic
import { useLiquidationTab } from './LiquidationTab'

// Props
const props = defineProps<{
  settlementId: number
}>()

// Form logic
const { settlementRows, netValue, formatCurrencyString, settlementColumns } =
  useLiquidationTab(props.settlementId)
</script>
