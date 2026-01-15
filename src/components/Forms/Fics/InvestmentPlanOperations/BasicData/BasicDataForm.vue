<template>
  <div>
    <q-form ref="basicDataForm">
      <section>
        <div class="row justify-between items-center">
          <p class="mb-0">Operación</p>
          <RadioYesNo
            v-model="basicData.type"
            :options="investment_plan_operation_type_options"
          ></RadioYesNo>
        </div>
        <template v-if="basicData.type === 'aporte'">
          <q-separator spaced />
          <div class="row justify-between items-center">
            <p class="mb-0">Aportes</p>
            <RadioYesNo v-model="basicData.subtype" :options="subtypeOptions" />
          </div>
          <q-separator spaced />
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-end">
            <div class="col-12 col-md-3">
              <GenericDateInput
                placeholder="AAAA-MM-DD"
                label="Fecha de registro"
                :required="true"
                :default_value="useUtils().formatDate('', 'YYYY-MM-DD')"
                :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'La fecha de registro es requerida'
                    ),
                ]"
                disabled
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericInput
                label="Solicitud de operación"
                placeholder="-"
                required
                disabled
                :default_value="''"
                :rules="[]"
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericSelector
                label="Código fondo de inversión"
                :manual_option="funts_to_investment_plans"
                map_options
                required
                :default_value="''"
                auto_complete
                clearable
                :placeholder="'Seleccione'"
                :rules="[
                  (val: string) =>
                    useRules().is_required(val, 'El código es requerido'),
                ]"
                @update:modelValue="
                  basicData.collective_investment_fund_id = Number($event)
                "
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericInput
                label="Descripción fondo de inversión"
                placeholder="-"
                required
                disabled
                :default_value="selectedFund?.fund_name"
                :rules="[]"
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericDateInput
                placeholder="AAAA-MM-DD"
                label="Fecha de cierre"
                :required="true"
                :default_value="
                  selectedFund?.last_closing_date
                    ? useUtils().formatDate(
                        selectedFund.last_closing_date,
                        'YYYY-MM-DD'
                      )
                    : selectedFund?.created_at
                    ? useUtils().formatDate(
                        selectedFund.created_at,
                        'YYYY-MM-DD'
                      )
                    : null
                "
                :rules="[]"
                disabled
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericSelector
                label="Oficina"
                :manual_option="offices"
                map_options
                required
                :default_value="''"
                auto_complete
                clearable
                :placeholder="'Seleccione'"
                :rules="[
                  (val: string) =>
                    useRules().is_required(val, 'La oficina es requerida'),
                ]"
                @update:modelValue="
                  basicData.operation_office_id = Number($event)
                "
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericInput
                placeholder="-"
                label="Descripción oficina"
                required
                disabled
                :default_value="selectedOffice?.office_description"
                :rules="[]"
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericSelector
                label="Plan de inversión"
                :manual_option="fiduciary_investment_plans"
                map_options
                required
                :default_value="''"
                auto_complete
                clearable
                :placeholder="'Seleccione'"
                :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'El plan de inversión es requerido'
                    ),
                ]"
                @update:modelValue="selectInvestmentPlan($event)"
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericInput
                placeholder="-"
                label="Directo / negocio"
                required
                disabled
                :default_value="
                  selectedInvestmentPlan?.fip_parameters
                    ? selectedInvestmentPlan?.fip_parameters
                        .has_trust_management
                      ? 'Negocio'
                      : 'Directo'
                    : ''
                "
                :rules="[]"
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericInput
                placeholder="-"
                label="Código de negocio / fondo"
                required
                disabled
                :default_value="
                  selectedInvestmentPlan?.fip_parameters?.has_trust_management
                    ? businessTrust?.label
                    : selectedInvestmentPlan?.collective_investment_fund
                        ?.code_name
                "
                :rules="[]"
              />
            </div>
            <div class="col-12 col-md-3">
              <InputMoneyComponent
                :model-value="
                  selectedInvestmentPlan?.fip_parameters?.plan_balance ?? '0'
                "
                :max_integer_digits="80"
                :max_decimal_digits="2"
                placeholder="-"
                label="Saldo"
                required
                disabled
                :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'Saldo es requerido'
                    ),
                ]"
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericInput
                placeholder="-"
                label="Identificación titular"
                required
                disabled
                :default_value="thirdParty?.document"
                :rules="[]"
              />
            </div>
            <div class="col-md-4 col-12">
              <GenericInput
                placeholder="-"
                label="Nombre titular"
                required
                disabled
                :default_value="thirdParty?.name"
                :rules="[]"
              />
            </div>
            <div class="col-md-4 col-12">
              <InputMoneyComponent
                :model-value="String(basicData.value ?? '0')"
                @update:modelValue="
                  (val) =>
                    (basicData.value = val.rawValue
                      ? Number(val.rawValue)
                      : null)
                "
                :max_integer_digits="80"
                :max_decimal_digits="2"
                placeholder="Inserte"
                label="Valor de la operación"
                required
                :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'El valor de la operación es requerido'
                    ),
                  (val: string) =>
                    useRules().only_number_greater_than_zero_with_decimal(val),
                ]"
              />
            </div>
            <div class="col-md-4 col-12">
              <InputMoneyComponent
                :model-value="
                  String(operation_values.maximumInvestmentBalance ?? '0')
                "
                :max_integer_digits="80"
                :max_decimal_digits="2"
                placeholder="Inserte"
                label="Saldo máximo de inversión"
                required
                disabled
                :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'Saldo máximo de inversión es requerido'
                    ),
                ]"
              />
            </div>
          </div>
        </template>
        <template v-if="basicData.type === 'retiro'">
          <q-separator spaced />
          <div class="row justify-between items-center">
            <p class="mb-0">Retiros</p>
            <RadioYesNo v-model="basicData.subtype" :options="subtypeOptions" />
          </div>
          <q-separator spaced />
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-end">
            <div class="col-12 col-md-3">
              <GenericSelector
                label="Código fondo de inversión"
                :manual_option="funts_to_investment_plans"
                map_options
                required
                :default_value="''"
                auto_complete
                clearable
                :placeholder="'Seleccione'"
                :rules="[
                  (val: string) =>
                    useRules().is_required(val, 'El código es requerido'),
                ]"
                @update:modelValue="
                  basicData.collective_investment_fund_id = Number($event)
                "
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericInput
                label="Descripción fondo de inversión"
                placeholder="-"
                required
                disabled
                :default_value="selectedFund?.fund_name"
                :rules="[]"
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericDateInput
                placeholder="AAAA-MM-DD"
                label="Fecha de registro"
                :required="true"
                :default_value="useUtils().formatDate('', 'YYYY-MM-DD')"
                :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'La fecha de registro es requerida'
                    ),
                ]"
                disabled
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericDateInput
                placeholder="AAAA-MM-DD"
                label="Fecha de cierre"
                :required="true"
                :default_value="
                  selectedFund?.last_closing_date
                    ? useUtils().formatDate(
                        selectedFund.last_closing_date,
                        'YYYY-MM-DD'
                      )
                    : selectedFund?.created_at
                    ? useUtils().formatDate(
                        selectedFund.created_at,
                        'YYYY-MM-DD'
                      )
                    : null
                "
                :rules="[]"
                disabled
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericInput
                placeholder="-"
                label="Negocio"
                required
                disabled
                :default_value="businessTrust?.business_code"
                :rules="[]"
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericInput
                placeholder="-"
                label="Descripción negocio"
                required
                disabled
                :default_value="businessTrust?.name"
                :rules="[]"
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericSelector
                label="Oficina"
                :manual_option="offices"
                map_options
                required
                :default_value="''"
                auto_complete
                clearable
                :placeholder="'Seleccione'"
                :rules="[
                  (val: string) =>
                    useRules().is_required(val, 'La oficina es requerida'),
                ]"
                @update:modelValue="
                  basicData.operation_office_id = Number($event)
                "
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericInput
                placeholder="-"
                label="Descripción oficina"
                required
                disabled
                :default_value="selectedOffice?.office_description"
                :rules="[]"
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericSelector
                label="Plan de inversión"
                :manual_option="fiduciary_investment_plans"
                map_options
                required
                :default_value="''"
                auto_complete
                clearable
                :placeholder="'Seleccione'"
                :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'El plan de inversión es requerido'
                    ),
                ]"
                @update:modelValue="selectInvestmentPlan($event)"
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericInput
                placeholder="-"
                label="Directo / negocio"
                required
                disabled
                :default_value="''"
                :rules="[]"
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericInput
                placeholder="-"
                label="Código de negocio / fondo"
                required
                disabled
                :default_value="''"
                :rules="[]"
              />
            </div>
            <div class="col-12 col-md-3">
              <InputMoneyComponent
                :model-value="
                  String(
                    selectedInvestmentPlan?.fip_parameters?.plan_balance ?? '0'
                  )
                "
                :max_integer_digits="80"
                :max_decimal_digits="2"
                placeholder="-"
                label="Saldo"
                required
                disabled
                :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'Saldo es requerido'
                    ),
                ]"
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericInput
                placeholder="-"
                label="Identificación titular"
                required
                disabled
                :default_value="thirdParty?.document"
                :rules="[]"
              />
            </div>
            <div class="col-md-3 col-12">
              <GenericInput
                placeholder="-"
                label="Nombre titular"
                required
                disabled
                :default_value="thirdParty?.name"
                :rules="[]"
              />
            </div>
            <div class="col-md-3 col-12">
              <InputMoneyComponent
                :model-value="String(basicData.value ?? '0')"
                @update:modelValue="
                  (val) =>
                    (basicData.value = val.rawValue
                      ? Number(val.rawValue)
                      : null)
                "
                :max_integer_digits="80"
                :max_decimal_digits="2"
                placeholder="Inserte"
                label="Valor de la operación"
                required
                :disabled="basicData.subtype === 'cancelacion'"
                :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'El valor de la operación es requerido'
                    ),
                  (val: string) =>
                    useRules().only_number_greater_than_zero_with_decimal(val),
                ]"
              />
            </div>
            <div class="col-md-3 col-12">
              <InputMoneyComponent
                :model-value="
                  basicData.subtype === 'parcial'
                    ? String(
                        operation_values.available_value_without_taxes_withdrawal ||
                          '0'
                      )
                    : String(
                        operation_values.available_value_without_taxes_cancellation ||
                          '0'
                      )
                "
                :max_integer_digits="50"
                :max_decimal_digits="4"
                placeholder="0,00"
                label="Valor disponible sin impuestos"
                disabled
              />
            </div>
          </div>
        </template>
      </section>
    </q-form>
  </div>
</template>
<script setup lang="ts">
// Components
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

//Intefaces
import { IInvestmentPlanOperationsBasicDataForm } from '@/interfaces/customs/fics/InvestmentPlanOperations'

// Composables
import { useRules, useUtils } from '@/composables'

// Logic view
import useBasicDataForm from '@/components/Forms/Fics/InvestmentPlanOperations/BasicData/BasicDataForm'

const emits = defineEmits<{
  (e: 'updateModels', models: IInvestmentPlanOperationsBasicDataForm): void
}>()

const {
  offices,
  basicData,
  thirdParty,
  selectedFund,
  businessTrust,
  basicDataForm,
  selectedOffice,
  subtypeOptions,
  operation_values,
  selectedInvestmentPlan,
  funts_to_investment_plans,
  fiduciary_investment_plans,
  investment_plan_operation_type_options,

  // Methods
  getFormData,
  selectInvestmentPlan,
} = useBasicDataForm(emits)

defineExpose({
  validateForm: () => basicDataForm.value?.validate(),
  getFormData: () => getFormData(),
})
</script>
