<template>
  <section>
    <TableList
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :pages="tableProps.pages"
      :custom-columns="[
        'iva',
        'rete_iva',
        'rete_ica',
        'rete_fuente',
        'municipal_taxes',
        'is_main',
      ]"
      :canDisableSelection="true"
      :disableSelection="action === ActionTypeEnum.VIEW"
      :hide-pagination="true"
      selection="multiple"
      row-key="id"
      v-model:selected="selectedDataList"
      @update:selected="onUpdateSelectedDataList"
    >
      <template #iva="{ row }">
        <RadioYesNo
          :model-value="
            row.taxes.find((tax: ISettlementFormulaTax) => tax.tax_type === 'IVA')?.is_applicable ??
            false
          "
          :isRadioButton="false"
          :hasTitle="false"
          :hasSubtitle="false"
          :disabled="true"
          :customClass="'row justify-center items-center'"
        />
      </template>
      <template #rete_iva="{ row }">
        <RadioYesNo
          :model-value="
            row.taxes.find((tax: ISettlementFormulaTax) => tax.tax_type === 'RIV')?.is_applicable ??
            false
          "
          :isRadioButton="false"
          :hasTitle="false"
          :hasSubtitle="false"
          :disabled="true"
          :customClass="'row justify-center items-center'"
        />
      </template>
      <template #rete_ica="{ row }">
        <RadioYesNo
          :model-value="
            row.taxes.find((tax: ISettlementFormulaTax) => tax.tax_type === 'RIC')?.is_applicable ??
            false
          "
          :isRadioButton="false"
          :hasTitle="false"
          :hasSubtitle="false"
          :disabled="true"
          :customClass="'row justify-center items-center'"
        />
      </template>
      <template #rete_fuente="{ row }">
        <RadioYesNo
          :model-value="
            row.taxes.find((tax: ISettlementFormulaTax) => tax.tax_type === 'RFT')?.is_applicable ??
            false
          "
          :isRadioButton="false"
          :hasTitle="false"
          :hasSubtitle="false"
          :disabled="true"
          :customClass="'row justify-center items-center'"
        />
      </template>
      <template #municipal_taxes="{ row }">
        <RadioYesNo
          :model-value="
            row.taxes.find((tax: ISettlementFormulaTax) => tax.tax_type === 'RTE')?.is_applicable ??
            false
          "
          :isRadioButton="false"
          :hasTitle="false"
          :hasSubtitle="false"
          :disabled="true"
          :customClass="'row justify-center items-center'"
        />
      </template>
      <template #is_main="{ row }">
        <RadioYesNo
          v-model="selectedRow"
          :options="[{ label: '', value: row.id }]"
          @update:model-value="onUpdateSelectionRow(row)"
          :customClass="'row justify-center items-center'"
          :isDisabled="
            action === ActionTypeEnum.VIEW ||
            !selectedDataList.some((item) => item.id === row.id)
          "
        />
      </template>
    </TableList>
  </section>
</template>

<script setup lang="ts">
// Components
import TableList from '@/components/table-list/TableList.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Interfaces
import { ActionType, ActionTypeEnum } from '@/interfaces/global'
import {
  ISettlementFormulaTax,
  ISettlementFormula,
  ISettlementFormulaItem,
} from '@/interfaces/customs/clients/Clients'

// Logic view
import useTributaryList from '@/components/Lists/Clients/LegalPerson/Tributary/TributaryList'

const props = withDefaults(
  defineProps<{
    action: ActionType
    selectedSettlementFormulasList: ISettlementFormula[] | null
  }>(),
  {}
)

const emit = defineEmits<{
  (
    e: 'update:selected-settlement-formulas-list',
    value: ISettlementFormula[]
  ): void
  (e: 'update:selected-row', value: ISettlementFormulaItem): void
}>()

const {
  tableProps,
  selectedRow,
  selectedDataList,

  onUpdateSelectedDataList,
  onUpdateSelectionRow,
} = useTributaryList(props, emit)
</script>
