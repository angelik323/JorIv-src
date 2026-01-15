<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleGoTo('FiduciaryInvestmentPlanList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <q-form ref="formBalanceAdjustment">
              <section class="q-mt-md">
                <div class="row q-col-gutter-md ml-1 mr-2">
                  <div class="col-12">
                    <h6 class="text-weight-bold my-1">
                      Detalle del plan de inversión
                    </h6>
                  </div>

                  <div class="col-xs-12 col-sm-4 col-md-3">
                    <GenericDateInputComponent
                      label="Fecha de registro"
                      :disabled="true"
                      :default_value="models.registration_date"
                      :rules="[]"
                      @update:modelValue="models.registration_date = $event"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-4 col-md-3">
                    <GenericInputComponent
                      label="Código fondo de inversión"
                      :disabled="true"
                      :default_value="models.fund_code"
                      @update:modelValue="models.fund_code = $event"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-4 col-md-3">
                    <GenericInputComponent
                      label="Nombre del fondo"
                      :disabled="true"
                      :default_value="models.fund_description"
                      @update:modelValue="models.fund_description = $event"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-4 col-md-3">
                    <GenericInputComponent
                      label="Negocio"
                      :disabled="true"
                      :default_value="models.fund_business_id"
                      @update:modelValue="models.fund_business_id = $event"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-4 col-md-3">
                    <GenericDateInputComponent
                      label="Fecha de operación"
                      :disabled="true"
                      :default_value="models.operation_date"
                      :rules="[]"
                      @update:modelValue="models.operation_date = $event"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-4 col-md-3">
                    <GenericInputComponent
                      label="Código plan de inversión"
                      :disabled="true"
                      :default_value="models.plan_code"
                      @update:modelValue="models.plan_code = $event"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-4 col-md-3">
                    <GenericInputComponent
                      label="Nombre del titular del plan"
                      :disabled="true"
                      :default_value="models.plan_description"
                      @update:modelValue="models.plan_description = $event"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-4 col-md-3">
                    <GenericInputComponent
                      label="Negocio plan de inversión"
                      :disabled="true"
                      :default_value="models.plan_business_id"
                      @update:modelValue="models.plan_business_id = $event"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-4 col-md-3">
                    <GenericInputComponent
                      label="Estado plan de inversión"
                      :disabled="true"
                      :default_value="models.investment_plan_status"
                      @update:modelValue="
                        models.investment_plan_status = $event
                      "
                    />
                  </div>

                  <div class="col-xs-12 col-sm-4 col-md-3">
                    <GenericInputComponent
                      label="Saldo plan de inversión"
                      :disabled="true"
                      :default_value="models.plan_balance"
                      @update:modelValue="models.plan_balance = $event"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-4 col-md-3">
                    <GenericInputComponent
                      label="Saldo capital"
                      :disabled="true"
                      :default_value="models.capital_balance"
                      @update:modelValue="models.capital_balance = $event"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-4 col-md-3">
                    <GenericInputComponent
                      label="Saldo rendimiento"
                      :disabled="true"
                      :default_value="models.performance_balance"
                      @update:modelValue="models.performance_balance = $event"
                    />
                  </div>
                </div>
              </section>

              <q-separator class="mx-2 my-1" />

              <section class="q-mt-md">
                <div class="row q-col-gutter-md ml-1 mr-2">
                  <div class="col-12">
                    <h6 class="text-weight-bold my-1">Detalle de ajuste</h6>
                  </div>

                  <div class="col-12">
                    <div class="row items-center justify-between q-mt-md">
                      <div class="col-auto">
                        <div class="text-body2">Ajustar *</div>
                      </div>
                      <div class="col-auto">
                        <RadioYesNo
                          v-model="models.adjustment"
                          titleRadioTrue="Capital"
                          titleRadioFalse="Rendimiento"
                          :isRadioButton="true"
                          :hasTitle="false"
                          :hasSubtitle="false"
                          @update:model-value="models.adjustment = $event"
                          :options="adjustment_balance_types"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <GenericInputComponent
                      label="Observación del ajuste"
                      :required="true"
                      :default_value="models.adjustment_observation"
                      @update:modelValue="
                        models.adjustment_observation = $event
                      "
                      :rules="[(val: string) => is_required(val) || 'Campo requerido']"
                      placeholder="Inserte"
                      type="textarea"
                    />
                  </div>

                  <div class="col-12" v-if="models.adjustment">
                    <div class="row items-center justify-between q-mt-md">
                      <div class="col-auto">
                        <div class="text-body2">Tipo de ajuste *</div>
                      </div>
                      <div class="col-auto">
                        <RadioYesNo
                          v-model="models.adjustment_type"
                          titleRadioTrue="Manual"
                          titleRadioFalse="Automático"
                          :isRadioButton="true"
                          :hasTitle="false"
                          :hasSubtitle="false"
                          :isDisabled="isCapitalAdjustment"
                          @update:model-value="models.adjustment_type = $event"
                          :options="adjustment_types"
                        />
                      </div>
                    </div>
                  </div>

                  <template
                    v-if="
                      isCapitalAdjustment ||
                      (isPerformanceAdjustment && isManualAdjustment)
                    "
                  >
                    <div class="col-12">
                      <div class="row items-center justify-between q-mt-md">
                        <div class="col-auto">
                          <div class="text-body2">Ajuste en *</div>
                        </div>
                        <div class="col-auto">
                          <RadioYesNo
                            v-model="models.adjustment_in"
                            titleRadioTrue="Egresos"
                            titleRadioFalse="Ingresos"
                            :isRadioButton="true"
                            :hasTitle="false"
                            :hasSubtitle="false"
                            @update:model-value="models.adjustment_in = $event"
                            :options="movement_nature_movement_codes"
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      class="col-xs-12 col-sm-4 col-md-4"
                      v-if="isCapitalAdjustment"
                    >
                      <GenericSelectorComponent
                        label="Clase de ajuste"
                        auto_complete
                        first_filter_option="label"
                        second_filter_option="value"
                        :manual_option="adjustment_class_movements_list"
                        :map_options="true"
                        :required="true"
                        :default_value="models.adjustment_class"
                        @update:modelValue="models.adjustment_class = $event"
                        :rules="[(val: string) => is_required(val, 'Clase de ajuste es requerida')]"
                        placeholder="Seleccione"
                      />
                    </div>

                    <div class="col-xs-12 col-sm-4 col-md-4">
                      <InputMoneyComponent
                        :model-value="models.adjustment_value"
                        label="Valor del ajuste"
                        :max_integer_digits="15"
                        :max_decimal_digits="2"
                        required
                        :rules="[
                          (v) =>
                            is_required(v, 'Valor del ajuste es requerido'),
                          (v) => only_number_greater_than_zero_with_decimal(v),
                        ]"
                        @update:model-value="
                          ({ rawValue }) => (models.adjustment_value = rawValue)
                        "
                      />
                    </div>

                    <div class="col-xs-12 col-sm-4 col-md-4">
                      <GenericSelectorComponent
                        label="Código movimiento"
                        auto_complete
                        first_filter_option="label"
                        second_filter_option="value"
                        :manual_option="adjustment_movement_codes_list"
                        :map_options="true"
                        :required="true"
                        :default_value="models.movement_code"
                        @update:modelValue="models.movement_code = $event"
                        :rules="[(val: string) => is_required(val, 'Código movimiento es requerido')]"
                        placeholder="Seleccione"
                      />
                    </div>
                  </template>

                  <template
                    v-if="isPerformanceAdjustment && isAutomaticAdjustment"
                  >
                    <div class="col-xs-12 col-sm-6 col-md-6">
                      <GenericDateInputComponent
                        label="Fecha inicial"
                        :default_value="models.initial_date"
                        :required="true"
                        :rules="[(val: string) => is_required(val, 'Fecha inicial es requerida')]"
                        @update:modelValue="models.initial_date = $event"
                      />
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6">
                      <GenericDateInputComponent
                        label="Fecha final"
                        :default_value="models.final_date"
                        :required="true"
                        :rules="[(val: string) => is_required(val, 'Fecha final es requerida')]"
                        @update:modelValue="models.final_date = $event"
                      />
                    </div>

                    <div class="col-xs-12 col-sm-4 col-md-4">
                      <InputMoneyComponent
                        :model-value="models.calculation_balance"
                        label="Saldo del cálculo"
                        :max_integer_digits="15"
                        :max_decimal_digits="2"
                        :rules="[
                          (v) =>
                            is_required(v, 'Saldo del cálculo es requerido'),
                          (v) => only_number_greater_than_zero_with_decimal(v),
                        ]"
                        @update:model-value="
                          ({ rawValue }) =>
                            (models.calculation_balance = rawValue)
                        "
                      />
                    </div>

                    <div class="col-xs-12 col-sm-4 col-md-4">
                      <InputMoneyComponent
                        :model-value="models.adjustment_value"
                        label="Valor del ajuste"
                        :max_integer_digits="15"
                        :max_decimal_digits="2"
                        required
                        :disabled="true"
                        :rules="[
                          (v) =>
                            is_required(v, 'Valor del ajuste es requerido'),
                          (v) => only_number_greater_than_zero_with_decimal(v),
                        ]"
                        @update:model-value="
                          ({ rawValue }) => (models.adjustment_value = rawValue)
                        "
                      />
                    </div>

                    <div class="col-12">
                      <div class="row items-center justify-between q-mt-md">
                        <div class="col-auto">
                          <div class="text-body2">Ajuste en *</div>
                        </div>
                        <div class="col-auto">
                          <RadioYesNo
                            v-model="models.automatic_adjustment_in"
                            titleRadioTrue="Egresos"
                            titleRadioFalse="Ingresos"
                            :isRadioButton="true"
                            :hasTitle="false"
                            :hasSubtitle="false"
                            :isDisabled="true"
                            :options="movement_nature_movement_codes"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="col-xs-12 col-sm-4 col-md-4">
                      <GenericSelectorComponent
                        label="Código movimiento"
                        first_filter_option="label"
                        second_filter_option="value"
                        :manual_option="adjustment_movement_codes_list"
                        :map_options="true"
                        :required="true"
                        :default_value="models.movement_code"
                        @update:modelValue="models.movement_code = $event"
                        :rules="[(val: string) => is_required(val, 'Código movimiento es requerido')]"
                        placeholder="Seleccione"
                      />
                    </div>
                  </template>
                </div>
              </section>

              <section class="q-mt-md">
                <div class="row q-col-gutter-md flex justify-end mx-2 mb-2">
                  <div class="col-auto">
                    <Button
                      :outline="false"
                      label="Crear"
                      class="mr-3"
                      class-custom="custom"
                      :color="isFormValid ? 'orange' : 'grey'"
                      color-icon="white"
                      :disabled="!isFormValid"
                      :styleContent="{
                        'place-items': 'center',
                        'white-space': 'nowrap',
                      }"
                      @click="onSubmit"
                    />
                  </div>
                </div>
              </section>
            </q-form>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useAccountAdjustmentCreate from '@/views/fics/fiduciary-investment-plan/v1/create/AccountAdjustmentCreate'

const {
  tabs,
  models,
  onSubmit,
  tabActive,
  handleGoTo,
  headerProps,
  isFormValid,
  is_required,
  tabActiveIdx,
  adjustment_types,
  isManualAdjustment,
  isCapitalAdjustment,
  formBalanceAdjustment,
  isAutomaticAdjustment,
  isPerformanceAdjustment,
  adjustment_balance_types,
  movement_nature_movement_codes,
  adjustment_movement_codes_list,
  adjustment_class_movements_list,
  only_number_greater_than_zero_with_decimal,
} = useAccountAdjustmentCreate()
</script>
