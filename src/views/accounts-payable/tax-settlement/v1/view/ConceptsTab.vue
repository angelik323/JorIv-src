<template>
  <div class="q-pa-md">
    <div class="q-mb-xl">
      <h6 class="q-ma-none q-mb-md">Sección conceptos de pago</h6>
      <TableList
        :loading="false"
        :columns="paymentConceptsColumns"
        :rows="paymentConcepts"
        :custom-columns="['radio', 'value', 'reteica']"
        hide-pagination
        hide-bottom
      >
        <template #radio="{ row }">
          <div class="flex justify-center">
            <q-radio
              :val="row.id"
              :model-value="row.selected ? row.id : null"
              @update:model-value="handleSelectPaymentConcept(row.id)"
              dense
              size="sm"
              color="orange"
            />
          </div>
        </template>

        <template #value="{ row }">
          ${{
            formatCurrencyString(row.value, { showCurrencySymbol: false }) ||
            '0,00'
          }}
        </template>

        <template #reteica="{ row }">
          ${{
            formatCurrencyString(row.reteica, { showCurrencySymbol: false }) ||
            '0,00'
          }}
        </template>
      </TableList>
    </div>

    <div class="q-mt-xl">
      <h6 class="q-ma-none q-mb-md">Liquidación reteica</h6>
      <TableList
        :loading="false"
        :columns="retentionColumns"
        :rows="retentionRows"
        :custom-columns="[
          'city',
          'base',
          'concept_reteica',
          'percentage_reteica',
          'retention_value',
        ]"
        hide-pagination
        hide-bottom
      >
        <template #city="{ row }">
          <span>{{ row.city_name || '-' }}</span>
        </template>

        <template #base="{ row }">
          <span>{{
            formatCurrencyString(row.base, { showCurrencySymbol: false }) || '-'
          }}</span>
        </template>

        <template #concept_reteica="{ row }">
          <span>{{ row.concept_reteica_name || '-' }}</span>
        </template>

        <template #percentage_reteica="{ row }">
          <span>{{
            formatCurrencyString(row.percentage_reteica, {
              showCurrencySymbol: false,
            }) || '-'
          }}</span>
        </template>

        <template #retention_value="{ row }">
          <span>{{
            formatCurrencyString(row.retention_value, {
              showCurrencySymbol: false,
            }) || '-'
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
import { useConceptsTab } from './ConceptsTab'

// Props
const props = defineProps<{
  settlementId: number
}>()

// Form logic
const {
  paymentConcepts,
  retentionRows,
  formatCurrencyString,
  handleSelectPaymentConcept,
  paymentConceptsColumns,
  retentionColumns,
} = useConceptsTab(props.settlementId)
</script>
