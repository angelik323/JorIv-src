<template>
  <q-form ref="informationForm" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="models.unit_value"
            required
            :label="'Unidad'"
            :manual_option="[]"
            map_options
            auto_complete
            :rules="[
              (val) => useRules().is_required(val, 'La unidad es requerida'),
              (val) => useRules().max_length(val, 20),
            ]"
            @update:model-value="(val: string) => (models.unit_value = val)"
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
            @update:model-value="(val:string) => (models.portfolio_class = val)"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="models.currency_id"
            required
            :label="'Moneda'"
            :manual_option="currency_local"
            map_options
            auto_complete
            :rules="[
              (val) => useRules().is_required(val, 'La moneda es requerida'),
            ]"
            @update:model-value="(val) => (models.currency_id = val)"
          />
        </div>

        <div class="col-12 col-md-4 q-mt-md">
          <CurrencyInput
            v-model="models.value_currency"
            required
            disabled
            :label="'Valor moneda'"
            placeholder="Inserte"
            :rules="[
              (val) =>
                useRules().is_required(val, 'El valor moneda es requerido'),
            ]"
            @update:model-value="(val: number) => (models.value_currency = val)"
          />
        </div>
        <div class="col-12 col-md-4 q-mt-md">
          <GenericSelectorComponent
            :default_value="models.operation_type_id"
            required
            :label="'Código operación'"
            :manual_option="operation_type"
            auto_complete
            map_options
            :rules="[
              (val) =>
                useRules().is_required(val, 'El código operación es requerido'),
            ]"
            @update:model-value="(val: number) => (models.operation_type_id = val)"
          />
        </div>
        <div class="col-12 col-md-4 q-mt-md">
          <GenericInputComponent
            :default_value="valueReferenceDescription"
            required
            disabled
            :label="'Descripción operación'"
            :manual_option="[]"
            map_options
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'La descripción operación es requerida'
                ),
            ]"
          />
        </div>
        <div class="col-12 col-md-4 q-mt-md">
          <GenericSelectorComponent
            :default_value="models.paper_type_id"
            required
            :label="'Tipo de papel'"
            :manual_option="paper_type_participation"
            auto_complete
            map_options
            :rules="[
              (val) =>
                useRules().is_required(val, 'El tipo de papel es requerido'),
            ]"
            @update:model-value="(val: number) => (models.paper_type_id = val)"
          />
        </div>
        <div class="col-12 col-md-4 q-mt-md">
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
        <div class="col-12 col-md-4 q-mt-md">
          <GenericInputComponent
            :default_value="models.participation_number"
            required
            :type="'number'"
            :label="'Número de participación'"
            :manual_option="[]"
            map_options
            max_length="11"
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'El número de participación es requerido'
                ),
              (val) => useRules().max_length(val, 20),
            ]"
            @update:model-value="(val: number) => (models.participation_number = Number(val))"
          />
        </div>
      </div>
      <q-separator class="q-my-md" />
      <p><b>Valor</b></p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <CurrencyInput
            v-model="models.constitution_value"
            :default_value="models.constitution_value"
            required
            :label="'Valor constitución participación'"
            :manual_option="[]"
            map_options
            placeholder="Inserte"
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'El valor constitución participación es requerido'
                ),
              (val) => useRules().only_number_greater_than_zero(val),
            ]"
            @update:model-value="(val: number) => models.constitution_value = Number(val)"
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
          label="Crear"
          size="md"
          unelevated
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="onSubmit()"
        />
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import { useInformationFormLocalMoney } from './InformationFormLocalMoney'
import { useRules } from '@/composables'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

const {
  onSubmit,
  models,
  currency_local,
  isin_codes_mnemonics_portfolio,
  operation_type,
  paper_type_participation,
  portfolio_class,
  valueReferenceDescription,
  _setReferenceTabs,
} = useInformationFormLocalMoney()
</script>
