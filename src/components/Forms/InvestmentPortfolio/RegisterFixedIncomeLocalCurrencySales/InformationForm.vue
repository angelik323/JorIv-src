<template>
  <q-form ref="informationFormRef" aria-label="Formulario de datos básicos">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.investment_portfolio_id"
            label="Código de portafolio"
            auto_complete
            map_options
            :manual_option="selectOptions.investment_portfolio"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El código de portafolio es requerido')
            ]"
            @update:model-value="formData.investment_portfolio_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :key="formData.investment_portfolio_id ?? ''"
            :default_value="formData.portfolio_description"
            label="Descripción de portafolio"
            placeholder="-"
            type="text"
            disabled
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="formData.operation_date"
            label="Fecha de operación"
            placeholder="AAAA/MM/DD"
            mask="YYYY-MM-DD"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de operación es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            @update:model-value="formData.operation_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.operation_type_id"
            label="Código de operación"
            auto_complete
            map_options
            :manual_option="selectOptions.operation_type"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El código de operación es requerido'),
            ]"
            @update:model-value="formData.operation_type_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.issuer_id"
            label="Emisor"
            auto_complete
            map_options
            :manual_option="selectOptions.issuer"
            required
            :rules="[
              (val) => useRules().is_required(val, 'El emisor es requerido'),
            ]"
            @update:model-value="formData.issuer_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.issuer_description"
            label="Descripción de emisor"
            placeholder="-"
            type="text"
            disabled
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.purchaser_id"
            label="Comprador"
            auto_complete
            map_options
            :manual_option="selectOptions.purchaser"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El comprador es requerido'),
            ]"
            @update:model-value="formData.purchaser_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.purchaser_description"
            label="Descripción de comprador"
            placeholder="-"
            type="text"
            disabled
          />
        </div>
      </div>

      <q-separator class="q-my-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black text-weight-bold text-h6 q-mb-none">
          Títulos a vender
        </p>
      </div>

      <TableList
        ref="tableListRef"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :custom-columns="['sale_value', 'compensation_system', 'tir_sale']"
        :selection="tableProps.selection"
        v-model:selected="selectedRows"
        :row-key="tableProps.rowKey"
        :hide-header="!tableProps.rows.length"
        hide-pagination
      >
        <template #sale_value="{ row }">
          <GenericInputComponent
            type="text"
            :default_value="row.sale_value"
            placeholder="ingrese valor"
            :rules="saleValueRules(row)"
            @update:model-value="onSaleValueInput($event, row)"
          />
          <!--
          Probar con currency 
          <CurrencyInput
            v-model="row.sale_value"
            model-value="row.sale_value"
            currency="COP"
            hideIcon
            required
            :rules="saleValueRules(row)"
          /> -->
        </template>

        <template #compensation_system="{ row }">
          <GenericSelectorComponent
            :default_value="row.compensation_system"
            map_options
            :manual_option="selectOptions.compensation_system"
            required
            :rules="compensationSystemRules(row)"
            @update:model-value="onCompensationSystemInput($event, row)"
          />
        </template>

        <template #tir_sale="{ row }">
          <GenericInputComponent
            type="text"
            :default_value="row.tir_sale"
            placeholder="ingrese TIR"
            :rules="saleValueRules(row)"
            disabled
            @update:model-value="onTirSaleInput($event, row)"
          />
        </template>
      </TableList>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import { useRules } from '@/composables'
import useRegisterFixedIncomeLocalCurrencySaleForm from './InformationForm'

const {
  formData,
  selectOptions,
  informationFormRef,
  tableProps,
  selectedRows,
  compensationSystemRules,
  onCompensationSystemInput,
  onTirSaleInput,
  resetForm,
  saleValueRules,
  onSaleValueInput,
  getValues,
} = useRegisterFixedIncomeLocalCurrencySaleForm()

defineExpose({
  resetForm,
  getValues,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
