<template>
  <q-form
    role="form"
    ref="informationFormRef"
    aria-label="Formulario de datos básicos (venta renta fija moneda extranjera)"
  >
    <section aria-label="Cabecera">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.investment_portfolio_id"
            label="Código de portafolio"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.investment_portfolio"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'El código de portafolio es requerido'),
            ]"
            @update:model-value="formData.investment_portfolio_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :key="`portfolio_desc_${formData.portfolio_description}`"
            :default_value="formData.portfolio_description"
            label="Descripción portafolio"
            placeholder="-"
            type="text"
            disabled
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="formData.operation_date"
            label="Fecha de operación"
            :required="true"
            disabled
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            :rules="[dateFmt]"
            @update:model-value="formData.operation_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.operation_type_id"
            label="Código operación"
            placeholder="Seleccione"
            auto_complete
            :required="true"
            map_options
            :manual_option="selectOptions.operation_type"
            :rules="[req]"
            @update:model-value="formData.operation_type_id = Number($event)"
          />
        </div>

        <div class="col-12 col-md-3">
          <div class="text-grey-8 text-body2 text-weight-medium q-mb-sm">
            Tipo operación
          </div>
          <RadioYesNo
            v-model="formData.negotiation"
            :options="[
              { label: 'Spot', value: 'Operacion Spot' },
              { label: 'De contado', value: 'Operacion Contado' },
            ]"
          />
        </div>

        <div class="col-12 col-md-3" v-if="showDays">
          <GenericInputComponent
            :default_value="formData.number_days"
            label="Número de días"
            type="number"
            :required="showDays"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'El número de días es requerido'),
              (val: number) => useRules().max_value(val, 5),
              (val: number) => useRules().min_value(val, 1),
            ]"
            @update:model-value="formData.number_days = Number($event)"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.issuer_id"
            label="Emisor"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.issuer"
            :rules="[
              (val) => useRules().is_required(val, 'El emisor es requerido'),
            ]"
            @update:model-value="formData.issuer_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.issuer_description"
            label="Descripción emisor"
            placeholder="-"
            type="text"
            disabled
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.purchaser_id"
            label="Comprador"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.purchaser"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'El comprador es requerido'),
            ]"
            @update:model-value="formData.purchaser_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.purchaser_description"
            label="Descripción comprador"
            placeholder="-"
            type="text"
            disabled
          />
        </div>
      </div>
    </section>

    <q-separator class="q-my-lg" />

    <section aria-label="Títulos a vender">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :rows="tableProps.rows"
        :columns="tableProps.columns"
        :selection="tableProps.selection"
        :row-key="tableProps.rowKey"
        :custom-columns="['sale_value_currency_origin', 'tir_sale']"
        v-model:selected="selectedRows"
        :hide-pagination="true"
      >
        <template #sale_value_currency_origin="{ row }">
          <GenericInputComponent
            type="text"
            :default_value="row.sale_value_currency_origin"
            placeholder="ingrese valor"
            :rules="saleValueCurrencyOriginRules(row)"
            @update:model-value="onSaleValueCurrencyOriginInput($event, row)"
          />
        </template>

        <template #tir_sale="{ row }">
          <GenericInputComponent
            type="text"
            :default_value="row.tir_sale"
            placeholder="-"
            disabled
            :rules="irrSaleRules(row)"
            @update:model-value="onIrrSaleInput($event, row)"
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
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import useInformationForm from './InformationForm'
import { useRules } from '@/composables'

const {
  informationFormRef,
  formData,
  selectOptions,
  tableProps,
  selectedRows,
  showDays,
  validateForm,
  req,
  dateFmt,
  irrSaleRules,
  getValues,
  onIrrSaleInput,
  onSaleValueCurrencyOriginInput,
  saleValueCurrencyOriginRules,
  resetForm,
} = useInformationForm()

defineExpose({
  resetForm,
  getValues,
  validateForm,
})
</script>
