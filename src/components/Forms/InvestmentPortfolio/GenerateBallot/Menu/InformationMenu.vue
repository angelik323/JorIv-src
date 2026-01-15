<template>
  <q-form ref="formInformation" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div :class="['col-12', 'col-md-4']">
          <GenericSelectorComponent
            :default_value="models.investment_portfolio_id"
            :placeholder="'Ingrese código'"
            :label="'Código portafolio'"
            map_options
            :manual_option="investment_portfolio"
            required
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'El código es requerido'),
              (val: string) => useRules().min_length(val, 1),
              (val: string) => useRules().max_length(val, 10),
              (val: string) => useRules().no_consecutive_spaces(val),
            ]"
            @update:modelValue="(val) => (models.investment_portfolio_id = val)"
          />
        </div>
        <div :class="['col-12', 'col-md-4']">
          <GenericInputComponent
            :default_value="refInvestmentDescription"
            :placeholder="'Descripción'"
            :label="'Descripción'"
            required
            disabled
            :rules="[]"
          />
        </div>
        <div :class="['col-12', 'col-md-4']">
          <GenericDateInputComponent
            :default_value="models.operation_date"
            :placeholder="'AAAA/MM/DD'"
            :label="'Fecha de operación'"
            required
            :rules="[]"
            :option_calendar="
              useCalendarRules().only_until(moment().format('YYYY-MM-DD'))
            "
            @update:modelValue="(val) => (models.operation_date = val)"
          />
        </div>
      </div>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div :class="['col-12', 'col-md-6']">
          <GenericSelectorComponent
            :default_value="models.operation_type_id"
            :placeholder="'Seleccione'"
            :label="'Tipo de operación'"
            required
            :manual_option="investment_portfolio_operation_types"
            map_options
            :rules="[]"
            @update:modelValue="(val) => (models.operation_type_id = val)"
          />
        </div>
        <div :class="['col-12', 'col-md-6']">
          <GenericInputComponent
            :default_value="operationDescription"
            :placeholder="'-'"
            disabled
            :label="'Descripción operación'"
            required
            :rules="[]"
          />
        </div>
      </div>
      <q-separator class="q-mt-sm q-mb-xl" color="grey-4" />
      <q-separator class="q-mt-sm" color="grey-4" />
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <h6 class="col-12"><b>¿Qué tipo de papeleta desea crear?</b></h6>
        <div :class="'col-12 col-md-6'">
          <GenericSelectorComponent
            :default_value="models.instruction_slip_type_id"
            :placeholder="'-'"
            :label="'Tipo de papeleta'"
            required
            :manual_option="filteredInstructionSlipTypes"
            map_options
            :rules="[]"
            @update:modelValue="
              (val) => (models.instruction_slip_type_id = val)
            "
          />
        </div>
      </div>
      <q-separator class="q-mt-xl q-mb-lg" color="grey-4" />
    </section>
  </q-form>
  <section class="mx-4 mb-4">
    <div class="row justify-end q-gutter-md">
      <Button
        :outline="false"
        label="Continuar"
        size="md"
        unelevated
        color="orange"
        class="text-capitalize btn-filter custom"
        :disabled="
          !models.investment_portfolio_id ||
          !models.operation_type_id ||
          !models.operation_date ||
          !models.instruction_slip_type_id
        "
        @click="handleContinue"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useRules, useCalendarRules } from '@/composables'
import { useInformationMenu } from './InformationMenu'
import Button from '@/components/common/Button/Button.vue'
import moment from 'moment'
const {
  models,
  investment_portfolio,
  investment_portfolio_operation_types,
  refInvestmentDescription,
  operationDescription,
  filteredInstructionSlipTypes,
  handleContinue,
} = useInformationMenu()
</script>
