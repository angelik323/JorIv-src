<template>
  <q-form ref="informationForm" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="models.unit"
            required
            :label="'Unidad'"
            :manual_option="[]"
            map_options
            auto_complete
            :rules="[
              (val:string) => useRules().is_required(val, 'La unidad es requerida'),
              (val:string) => useRules().max_length(val, 20),
            ]"
            @update:model-value="(val: string) => models.unit = val"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="models.portfolio_class"
            required
            :label="'Clase de cartera'"
            :manual_option="portfolio_class"
            map_options
            :rules="[
              (val) =>
                useRules().is_required(val, 'La clase de cartera es requerida'),
            ]"
            @update:model-value="(val) => (models.portfolio_class = val)"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="models.currency_id"
            required
            :label="'Moneda origen'"
            :manual_option="currency_foreign_portfolio"
            map_options
            auto_complete
            :rules="[
              (val) => useRules().is_required(val, 'La moneda es requerida'),
            ]"
            @update:model-value="(val) => (models.currency_id = val)"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="models.isin_id"
            required
            :label="'ISIN'"
            :manual_option="isin_codes_mnemonics_portfolio"
            map_options
            auto_complete
            :rules="[
              (val) => useRules().is_required(val, 'El ISIN es requerido'),
            ]"
            @update:model-value="(val) => (models.isin_id = val)"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="models.participation_number"
            required
            :label="'Número de participación'"
            :manual_option="[]"
            map_options
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'El número de participación es requerido'
                ),
              (val) => useRules().max_length(val, 20),
              (val) => useRules().min_value(val, 1),
            ]"
            type="number"
            @update:model-value="(val) => (models.participation_number = val)"
          />
        </div>
        <div class="col-12 col-md-4">
          <CurrencyInput
            v-model="models.unit_value_origin_currency"
            required
            :label="'Valor unidad moneda origen'"
            :manual_option="[]"
            map_options
            :hide-icon="true"
            :rules="[]"
            @update:model-value="(val: number) => (models.unit_value_origin_currency = val)"
          />
        </div>
        <div class="col-12 col-md-4 q-mt-md">
          <GenericInputComponent
            :default_value="models.constitution_value_origin_currency"
            required
            type="number"
            :label="'Valor constitución moneda origen'"
            :manual_option="[]"
            map_options
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'El valor de constitución es requerido'
                ),
              (val) => useRules().min_value(val, 1),
            ]"
            @update:model-value="(val: number) => models.constitution_value_origin_currency = (val)"
          />
        </div>
        <div class="col-12 col-md-4 q-mt-md">
          <GenericInputComponent
            :default_value="models.constitution_unit_number"
            required
            disabled
            :label="'Número unidad constitución'"
            :rules="[]"
            @update:model-value="(val: number) => models.constitution_unit_number = (val)"
          />
        </div>
        <div class="col-12 col-md-4 q-mt-md">
          <GenericSelectorComponent
            :default_value="models.paper_type_id"
            map_options
            :manual_option="paper_type_participation"
            required
            :label="'Tipo de papel'"
            :rules="[
              (val) =>
                useRules().is_required('El tipo de papel es requerido', val),
            ]"
            @update:model-value="(val: number) => models.paper_type_id = (val)"
          />
        </div>
      </div>
      <q-separator class="q-my-md" />
      <p><b>Datos de operación</b></p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="models.operation_type_id"
            required
            :label="'Código operación'"
            :manual_option="operation_type"
            map_options
            auto_complete
            placeholder="Seleccione"
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'El código de operación es requerido'
                ),
            ]"
            @update:model-value="(val) => (models.operation_type_id = val)"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="refDescriptionOperation"
            required
            disabled
            :label="'Descripción operación'"
            :manual_option="[]"
            map_options
            :rules="[]"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="models.number_of_cash_operation_days"
            required
            :label="'Número de días'"
            :manual_option="[]"
            map_options
            type="number"
            :rules="[
              (val: string) => useRules().is_required(val, 'El número de días es requerido'),
              (val: string) => useRules().min_length(val, 1),
              (val: string) => useRules().max_length(val, 5 ),
              (val: string) => {
              const days = parseInt(val);
              if (days < 1 || days > 5) return 'El número de días debe estar entre 1 y 5';
              return true;
              }
            ]"
            @update:model-value="(val: number) => models.number_of_cash_operation_days = (val)"
          />
        </div>
      </div>
      <q-separator class="q-my-md" />
      <div class="flex justify-end">
        <Button
          :outline="true"
          label="Atrás"
          size="md"
          unelevated
          class-custom="q-mx-md"
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="_setReferenceTabs({ valuePosition: 0 })"
        />
        <Button
          :outline="false"
          label="Continuar"
          size="md"
          unelevated
          :disabled="
            !models.constitution_unit_number ||
            !models.constitution_value_origin_currency ||
            !models.unit_value_origin_currency ||
            !models.participation_number ||
            !models.isin_id ||
            !models.currency_id ||
            !models.portfolio_class ||
            !models.unit ||
            !models.operation_type_id ||
            !models.number_of_cash_operation_days
          "
          @click="_setReferenceTabs({ valuePosition: 2 })"
          color="orange"
          class="text-capitalize btn-filter custom"
        />
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import { useRules } from '@/composables'
import { useInformationFormForeignData } from './informationFormForeignData'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

const {
  models,
  currency_foreign_portfolio,
  operation_type,
  isin_codes_mnemonics_portfolio,
  portfolio_class,
  paper_type_participation,
  refDescriptionOperation,
  _setReferenceTabs,
} = useInformationFormForeignData()
</script>
