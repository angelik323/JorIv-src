<template>
  <q-form ref="formInformation">
    <section class="mb-4 q-mt-md" :class="'q-pt-lg amounts-table'">
      <div class="row q-col-gutter-lg">
        <div class="col-xs-12">
          <TableList
            :loading="tableProperties.loading"
            :columns="tableProperties.columns"
            :rows="tableProperties.rows"
            :pages="tableProperties.pages"
            :title="tableProperties.title"
            :custom-columns="['base_amount']"
            :hideHeader="false"
            :rows-per-page-options="[0]"
            hide-pagination
          >
            <template #base_amount="{ row }">
              <InputMoneyComponent
                v-if="action !== 'view'"
                :model-value="row.base_amount"
                placeholder="-"
                hide_bottom_space
                hide_symbol
                @update:model-value="
                  ({ rawValue }) => updateBaseValue(row.id, rawValue)
                "
              />
              <span v-else>{{ formatCurrencyString(row.base_value) }}</span>
            </template>
          </TableList>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// components
import TableList from '@/components/table-list/TableList.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import { ICommissionCalculationFormV2 } from '@/interfaces/customs/settlement-commissions/CommissionCalculationV2'

// logic
import useListCommissionForm from '@/components/Forms/SettlementCommissions/CommissionCalculation/v2/ListCommissions/ListCommission'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: ICommissionCalculationFormV2 | null
    commissions: ICommissionCalculationFormV2['commissions']
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (
    e: 'update:commissions',
    value: ICommissionCalculationFormV2['commissions']
  ): void
}>()

const {
  formInformation,
  tableProperties,
  formatCurrencyString,
  updateBaseValue,
} = useListCommissionForm(props, emits)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
  tableProperties,
})
</script>
