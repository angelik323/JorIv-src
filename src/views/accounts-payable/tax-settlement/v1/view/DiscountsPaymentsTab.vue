<template>
  <div class="q-pa-md">
    <div class="q-mb-xl">
      <h6 class="q-ma-none q-mb-md">Sección descuentos/pagos</h6>
      <TableList
        :loading="false"
        :columns="discountPaymentColumns"
        :rows="discountPaymentRows"
        :custom-columns="[
          'radio',
          'type',
          'fiscal_charge',
          'concept',
          'base',
          'percentage',
          'value',
        ]"
        hide-pagination
        hide-bottom
      >
        <template #radio="{ row }">
          <div class="flex justify-center">
            <q-radio
              :val="row.id"
              :model-value="row.selected ? row.id : null"
              @update:model-value="handleSelectDiscountPayment(row.id)"
              dense
              size="sm"
              color="orange"
            />
          </div>
        </template>

        <template #type="{ row }">
          <span>{{ row.type }}</span>
        </template>

        <template #fiscal_charge="{ row }">
          <span>{{ row.fiscal_charge }}</span>
        </template>

        <template #concept="{ row }">
          <span>{{ row.concept }}</span>
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
      </TableList>

      <div class="row justify-end q-mt-md q-pa-md">
        <div class="text-weight-medium">
          Valor neto: ${{
            formatCurrencyString(netValue, { showCurrencySymbol: false }) ||
            '0,00'
          }}
        </div>
      </div>
    </div>

    <div class="q-mt-xl">
      <h6 class="q-ma-none q-mb-md">Descuentos</h6>
      <TableList
        :loading="false"
        :columns="discountColumns"
        :rows="discountRows"
        :custom-columns="[
          'type',
          'concept',
          'fiscal_charge',
          'base',
          'percentage',
          'value',
        ]"
        hide-pagination
        hide-bottom
      >
        <template #type="{ row }">
          <span>{{ row.type }}</span>
        </template>

        <template #concept="{ row }">
          <span>{{ row.concept }}</span>
        </template>

        <template #fiscal_charge="{ row }">
          <span>{{ row.fiscal_charge }}</span>
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
      </TableList>
    </div>
  </div>
</template>

<script setup lang="ts">
// Components
import TableList from '@/components/table-list/TableList.vue'

// Logic
import { useDiscountsPaymentsTab } from './DiscountsPaymentsTab'

// Props
const props = defineProps<{
  settlementId: number
}>()

// Form logic
const {
  discountPaymentRows,
  discountRows,
  netValue,
  formatCurrencyString,
  handleSelectDiscountPayment,
  discountPaymentColumns,
  discountColumns,
} = useDiscountsPaymentsTab(props.settlementId)
</script>
