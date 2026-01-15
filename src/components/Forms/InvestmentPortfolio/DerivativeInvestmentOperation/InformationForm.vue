<template>
  <q-form ref="formElementRef" v-if="props.action === 'create'">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-end">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Usuario"
            :default_value="models.created_by"
            disabled
            required
            :manual_option="
              loggedUser
                ? [
                    {
                      value: loggedUser.user.id,
                      label:
                        `${loggedUser.user.name} ${loggedUser.user.last_name} `.trim(),
                    },
                  ]
                : []
            "
            :rules="[
              (val: string) => is_required(val, 'El usuario es requerido'),
                (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.created_by = $event"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            label="Fecha de operación"
            type="date"
            :default_value="models.operation_date"
            required
            :rules="[
              (val: string) => is_required(val, 'La fecha de operación es requerida'),
            ]"
            @update:model-value="models.operation_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Código de portafolio"
            :default_value="models.investment_portfolio_id"
            :manual_option="investment_portfolio"
            map_options
            :placeholder="'Seleccione'"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El código de portafolio es requerido'), ]"
            @update:model-value="(val: number) => { if (models) models.investment_portfolio_id = Number(val) }"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            label="Descripción portafolio"
            type="text"
            :default_value="models.investment_portfolio_description"
            disabled
            required
            :rules="[
              (val: string) => is_required(val, 'La descripción del portafolio es requerida'),
                (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="
              models.investment_portfolio_description = $event
            "
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Tipo de operación"
            :default_value="models.operation_type_id"
            :manual_option="operation_type"
            map_options
            :placeholder="'Seleccione'"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El tipo de operación es requerido'), ]"
            @update:model-value="(val: String) => { if (models) models.operation_type_id = String(val) }"
          />
        </div>
        <div class="col-12 col-md-3">
          <RadioYesNo
            class="q-pt-md q-pl-sm q-pb-xs"
            hasTitle
            title="Tipo de cumplimiento*"
            :hasSubtitle="false"
            :options="DELIVERY_NON_DELIVERY_OPTIONS"
            v-model="models.compliance_type"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Contraparte"
            :default_value="models.issuers_counterparty_id"
            :manual_option="emitter"
            map_options
            :placeholder="'Seleccione'"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'La contraparte es requerida'), ]"
            @update:model-value="(val: string) => { if (models) models.issuers_counterparty_id = (val) }"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Clase derivado"
            :default_value="models.derivative_class_id"
            :manual_option="derivative_class"
            map_options
            :placeholder="'Seleccione'"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'La clase derivado es requerida'), ]"
            @update:model-value="(val: number) => { if (models) models.derivative_class_id = Number(val) }"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Tipo de papel"
            :default_value="models.paper_type_id"
            :manual_option="paper_type"
            map_options
            :placeholder="'Seleccione'"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El tipo de papel es requerido'), ]"
            @update:model-value="(val: number) => { if (models) models.paper_type_id = Number(val) }"
          />
        </div>
        <div class="col-12 col-md-3">
          <RadioYesNo
            class="q-pt-md q-pl-sm q-pb-xs"
            hasTitle
            title="Objetivo derivado*"
            :hasSubtitle="false"
            :options="DERIVATIVE_OBJECTIVE_OPTIONS"
            v-model="models.derivative_objective"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Tipo de cobertura"
            :default_value="models.coverage_type_id"
            :manual_option="derivative_coverage"
            map_options
            :placeholder="'Seleccione'"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El tipo de cobertura es requerido'), ]"
            @update:model-value="(val: number) => { if (models) models.coverage_type_id = Number(val) }"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Divisa X"
            :default_value="models.badge_x_id"
            :manual_option="coins"
            map_options
            disabled
            :placeholder="'Seleccione'"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'Divisa X es requerida'), ]"
            @update:model-value="(val: number) => { if (models) models.badge_x_id = Number(val) }"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Divisa Y"
            :default_value="models.badge_y_id"
            :manual_option="coins"
            map_options
            disabled
            :placeholder="'Seleccione'"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'Divisa Y es requerida'), ]"
            @update:model-value="(val: number) => { if (models) models.badge_y_id = Number(val) }"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Moneda de pago"
            :default_value="models.currency_id"
            :manual_option="coins"
            map_options
            disabled
            :placeholder="'Seleccione'"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'Moneda de pago es requerida'), ]"
            @update:model-value="(val: number) => { if (models) models.currency_id = Number(val) }"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            :default_value="models.value_currency"
            @update:modelValue="models.value_currency = $event"
            label="Valor constitución moneda objetivo"
            placeholder="Inserte"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El valor constitución moneda objetivo es requerido'),
                (val: number) => no_leading_zeros(val),
                (val: string) => only_number_with_decimals(val),
                (val: string) => only_number_with_max_integers_and_decimals(val, 15, 2),
            ]"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Base dias"
            :default_value="models.base_days"
            :manual_option="days_base_options"
            map_options
            :placeholder="'Seleccione'"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'Base dias es requerida'), ]"
            @update:model-value="(val: string) => { if (models) models.base_days = Number(val) }"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            label="Fecha de constitución"
            type="date"
            :default_value="models.constitution_date"
            disabled
            required
            :rules="[
              (val: string) => is_required(val, 'La fecha de constitución es requerida'),
                (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.constitution_date = $event"
          />
        </div>
        <div class="col-12 col-md-2">
          <GenericInput
            label="Número días vencimiento"
            type="number"
            :default_value="models.days"
            placeholder="Inserte"
            required
            :rules="[
                    (val: string) => is_required(val, 'El número de días de vencimiento es requerido'),
                    (val: number) => no_leading_zeros(val),
                    (val: string) => max_length(val, 3),
                ]"
            @update:model-value="models.days = $event"
          />
        </div>
        <div class="col-12 col-md-2">
          <GenericInput
            label="Fecha de vencimiento"
            type="date"
            :default_value="models.expiration_date"
            disabled
            required
            :rules="[
              (val: string) => is_required(val, 'La fecha de vencimiento es requerida'),
                (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.expiration_date = $event"
          />
        </div>
        <div class="col-12 col-md-2">
          <GenericInput
            label="Fecha de cumplimiento"
            type="date"
            :default_value="models.compliance_date"
            disabled
            required
            :rules="[
              (val: string) => is_required(val, 'La fecha de cumplimiento es requerida'),
                (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.compliance_date = $event"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            :default_value="models.rate_spot_badge_y"
            @update:modelValue="models.rate_spot_badge_y = $event"
            label="Tasa spot divisa Y"
            placeholder="Inserte"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El valor tasa spot divisa Y es requerido'),
                (val: number) => no_leading_zeros(val),
                (val: string) => only_number_with_decimals(val),
                (val: string) => only_number_with_max_integers_and_decimals(val, 5, 2),
            ]"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            :default_value="models.strike_badge_y"
            @update:modelValue="models.strike_badge_y = $event"
            label="Strike divisa Y"
            placeholder="Inserte"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El valor strike divisa Y es requerido'),
                (val: number) => no_leading_zeros(val),
                (val: string) => only_number_with_decimals(val),
                (val: string) => only_number_with_max_integers_and_decimals(val, 5, 2),
            ]"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            :default_value="models.forward_badge_y"
            @update:modelValue="models.forward_badge_y = $event"
            label="% Forward divisa Y"
            placeholder="Inserte"
            disabled
            required
            :rules="[
                    (val: string) =>
                        is_required(val, 'El valor % forward divisa Y es requerido'),
                    (val: string) => only_number_with_decimals(val),
                    (val: string) => only_number_with_max_integers_and_decimals(val, 3, 2),
                ]"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            :default_value="models.fixed_agreed_rate"
            @update:modelValue="models.fixed_agreed_rate = $event"
            label="Tasa fija pactada"
            placeholder="Inserte"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El valor tasa fija pactada es requerido'),
                (val: number) => no_leading_zeros(val),
                (val: string) => only_number_with_decimals(val),
                (val: string) => only_number_with_max_integers_and_decimals(val, 3, 2),
            ]"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            :default_value="models.agreed_value_badge_y"
            @update:modelValue="models.agreed_value_badge_y = $event"
            label="Valor pactado divisa Y"
            placeholder="Inserte"
            required
            disabled
            :rules="[
              (val: string) =>
                is_required(val, 'El valor pactado divisa Y es requerido'),
                (val: number) => no_leading_zeros(val),
                (val: string) => only_number_with_decimals(val),
                (val: string) => only_number_with_max_integers_and_decimals(val, 3, 2),
            ]"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

import { useInformationForm } from '@/components/Forms/InvestmentPortfolio/DerivativeInvestmentOperation/InformationForm'
import { WriteActionType } from '@/interfaces/global'
import { IDerivativeInvestmentOperationToCreate } from '@/interfaces/customs'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data: IDerivativeInvestmentOperationToCreate | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IDerivativeInvestmentOperationToCreate | null): void
}>()

const {
  formElementRef,
  models,
  investment_portfolio,
  operation_type,
  paper_type,
  derivative_class,
  derivative_coverage,
  coins,
  days_base_options,
  emitter,
  loggedUser,
  DELIVERY_NON_DELIVERY_OPTIONS,
  DERIVATIVE_OBJECTIVE_OPTIONS,
  is_required,
  max_length,
  only_number_with_decimals,
  only_number_with_max_integers_and_decimals,
  no_leading_zeros,
  only_alphanumeric,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
