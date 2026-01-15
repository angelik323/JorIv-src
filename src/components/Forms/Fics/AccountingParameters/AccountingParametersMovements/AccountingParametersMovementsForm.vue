<template>
  <q-form ref="accountingParametersMovementsFormElementRef" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            label="Código de movimiento"
            :disabled="action === 'edit'"
            :default_value="models?.movement_code_id"
            :manual_option="movements"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
                (v: string) => useRules().is_required(v, 'El campo Código de movimiento es requerido'),
              ]"
            @update:model-value="models.movement_code_id = $event"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            label="Tipo fondo"
            :default_value="models?.fund_type_id"
            :manual_option="fund_types"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
                (v: string) => useRules().is_required(v, 'El campo Tipo fondo es requerido'),
              ]"
            @update:model-value="models.fund_type_id = $event"
          />
        </div>
      </div>

      <q-separator class="q-mt-md q-mb-lg" />

      <p class="text-black-10 text-weight-bold text-h6">Partida</p>

      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            label="Naturaleza de la partida"
            :default_value="models?.departure_nature"
            :manual_option="deferred_impairment_natures"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
                  (v: string) =>
                  useRules().is_required(v, 'El campo Naturaleza de la partida es requerido'),
                  (v: string) => useRules().validate_natures_opposite(v, models.counterpart_nature, 'Naturaleza de la partida', 'Naturaleza contrapartida'),
              ]"
            @update:model-value="models.departure_nature = $event"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            label="Cuenta contable partida"
            :default_value="models?.departure_account_chart_id"
            :manual_option="accounting_chart_operative_by_structure"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo Cuenta contable partida es requerido'),
              ]"
            @update:model-value="handleDepartureAccountChartChange($event)"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            label="Centro de costo"
            :disabled="disabledDepartureCostCenter"
            :default_value="models?.departure_cost_center_id"
            :manual_option="cost_center_codes_by_structure"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="!disabledDepartureCostCenter"
            :rules="disabledDepartureCostCenter ? [] : [
                (v: string) =>
                  useRules().is_required(v, 'El campo Centro de costo es requerido'),
              ]"
            @update:model-value="models.departure_cost_center_id = $event"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            label="Auxiliar"
            :default_value="models?.departure_auxiliar_id"
            :manual_option="auxiliar_accounting_parameter"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo Auxiliar es requerido'),
              ]"
            @update:model-value="handleAuxiliaryChange($event)"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            label="Específico"
            :disabled="disabledSpecificThirdParty"
            :default_value="models?.departure_third_party_id"
            :manual_option="third_parties"
            map_options
            :required="!disabledSpecificThirdParty"
            :rules="!disabledSpecificThirdParty ? [
              (v: string) => useRules().is_required(v, 'El campo Específico es requerido')
            ] : []"
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            @update:model-value="models.departure_third_party_id = $event"
          />
        </div>
      </div>

      <q-separator class="q-mt-md q-mb-lg" />

      <p class="text-black-10 text-weight-bold text-h6">Contrapartida</p>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            label="Tipo contrapartida"
            :default_value="models?.counterpart_type"
            :manual_option="accounting_parameter_counter_part_types"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo Tipo Contrapartida es requerido'),
              ]"
            @update:model-value="handleCounterpartTypeChange($event)"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            label="Naturaleza contrapartida"
            :disabled="models.counterpart_type !== 'Contabilidad'"
            :default_value="models?.counterpart_nature"
            :manual_option="deferred_impairment_natures"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="models.counterpart_type === 'Contabilidad'"
            :rules="models.counterpart_type === 'Contabilidad' ? [
              (v: string) => useRules().is_required(v, 'El campo Naturaleza Contrapartida es requerido'),
              (v: string) => useRules().validate_natures_opposite(v, models.departure_nature, 'Naturaleza contrapartida', 'Naturaleza de la partida')
            ] : []"
            @update:model-value="models.counterpart_nature = $event"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            label="Cuenta contable contrapartida"
            :disabled="models.counterpart_type !== 'Contabilidad'"
            :default_value="models?.counterpart_account_chart_id"
            :manual_option="accounting_chart_operative_by_structure"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="models.counterpart_type === 'Contabilidad'"
            :rules="models.counterpart_type === 'Contabilidad' ? [
              (v: string) => useRules().is_required(v, 'El campo Cuenta contable contrapartida es requerido')
            ] : []"
            @update:model-value="handleCounterpartAccountChartChange($event)"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            label="Centro de costo"
            :disabled="
              models.counterpart_type !== 'Contabilidad' ||
              disabledCounterpartCostCenter
            "
            :default_value="models?.counterpart_cost_center_id"
            :manual_option="cost_center_codes_by_structure"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="!disabledCounterpartCostCenter"
            :rules="disabledCounterpartCostCenter ? [] : [
                (v: string) =>
                  useRules().is_required(v, 'El campo Centro de costo es requerido'),
              ]"
            @update:model-value="models.counterpart_cost_center_id = $event"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            label="Auxiliar contrapartida"
            :disabled="models.counterpart_type !== 'Contabilidad'"
            :default_value="models?.counterpart_auxiliar_id"
            :manual_option="auxiliar_accounting_parameter"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="models.counterpart_type === 'Contabilidad'"
            :rules="models.counterpart_type === 'Contabilidad' ? [
              (v: string) => useRules().is_required(v, 'El campo Auxiliar contrapartida es requerido')
            ] : []"
            @update:model-value="handleCounterpartAuxiliaryChange($event)"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            label="Específico contrapartida"
            :disabled="
              models.counterpart_type !== 'Contabilidad' ||
              disabledSpecificCounterparty
            "
            :default_value="models?.counterpart_third_party_id"
            :manual_option="third_parties"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="models.counterpart_type === 'Contabilidad'"
            :rules="models.counterpart_type === 'Contabilidad' ? [
              (v: string) => useRules().is_required(v, 'El campo Especifico contrapartida es requerido')
            ] : []"
            @update:model-value="models.counterpart_third_party_id = $event"
          />
        </div>
      </div>

      <q-separator class="q-mt-md q-mb-lg" />

      <p class="text-black-10 text-weight-bold text-h6">Comprobantes</p>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            label="Comprobante"
            :default_value="models?.receipt_type_id"
            :manual_option="receipt_types"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo Comprobante es requerido'),
              ]"
            @update:model-value="handleReceiptTypeChange($event)"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            label="Subcomprobante"
            :default_value="models?.sub_receipt_type_id"
            :manual_option="sub_receipt_types ?? []"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo Subcomprobante es requerido'),
              ]"
            @update:model-value="models.sub_receipt_type_id = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Interfaces
import { IAccountingParametersMovementsView } from '@/interfaces/customs/fics/AccountingParametersMovements'
import { ExtendedActionTypeCopy } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

// Logic view
import useAccountingParametersMovementsForm from '@/components/Forms/Fics/AccountingParameters/AccountingParametersMovements/AccountingParametersMovementsForm'

const props = withDefaults(
  defineProps<{
    action: ExtendedActionTypeCopy
    data?: IAccountingParametersMovementsView | null
  }>(),
  {}
)

const {
  models,
  accountingParametersMovementsFormElementRef,
  movements,
  auxiliar_accounting_parameter,
  fund_types,
  deferred_impairment_natures,
  cost_center_codes_by_structure,
  third_parties,
  accounting_parameter_counter_part_types,
  receipt_types,
  sub_receipt_types,
  accounting_chart_operative_by_structure,
  disabledDepartureCostCenter,
  disabledCounterpartCostCenter,
  disabledSpecificThirdParty,
  disabledSpecificCounterparty,
  handleDepartureAccountChartChange,
  handleCounterpartAccountChartChange,
  handleAuxiliaryChange,
  handleCounterpartTypeChange,
  handleCounterpartAuxiliaryChange,
  handleReceiptTypeChange,
} = useAccountingParametersMovementsForm(props)

defineExpose({
  validateForm: () =>
    accountingParametersMovementsFormElementRef.value?.validate(),
})
</script>
