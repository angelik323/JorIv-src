<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleGoTo('AccountManagementList')"
    >
      <TabsComponent
        :tabs="tabs"
        :tab-active="tabActive"
        :tab-active-idx="tabActiveIdx"
      />

      <section v-if="tabActive === 'information'" :key="formKey">
        <VCard>
          <template #content-card>
            <q-form ref="formAccount">
              <section class="q-mt-md">
                <div class="row q-col-gutter-md ml-1 mr-2">
                  <div class="col-12 flex justify-between">
                    <div class="col-auto self-center">
                      <p class="q-my-none">Forma de pago</p>
                    </div>

                    <div class="col-auto">
                      <RadioYesNo
                        v-model="radioPaymentMethod"
                        titleRadioTrue="Banco"
                        titleRadioFalse="Fondo de inversión"
                        :isRadioButton="true"
                        :hasTitle="false"
                        :hasSubtitle="false"
                        @update:model-value="changeRadio"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <q-separator class="mx-2 my-1" />

              <section class="q-mt-md">
                <div class="row q-col-gutter-md ml-1 mr-2">
                  <div class="col-12 col-md-3">
                    <GenericSelectorComponent
                      label="Forma de pago"
                      :default_value="null"
                      :manual_option="filteredMeansOfPayments"
                      :auto_complete="true"
                      :required="true"
                      :map_options="true"
                      :rules="[(v) => is_required(v)]"
                      @update:model-value="models.payment_method_id = $event"
                    />
                  </div>

                  <div class="col-12 col-md-3">
                    <GenericSelectorComponent
                      v-if="radioPaymentMethod"
                      label="Destino (Banco/Fondo)"
                      :default_value="null"
                      :manual_option="banks"
                      :auto_complete="true"
                      :required="true"
                      :map_options="true"
                      :rules="[(v) => is_required(v)]"
                      @update:model-value="models.destination_bank_id = $event"
                    />
                    <GenericSelectorComponent
                      v-else
                      label="Destino (Banco/Fondo)"
                      :default_value="null"
                      :manual_option="funts_to_investment_plans"
                      :auto_complete="true"
                      :required="true"
                      :map_options="true"
                      :rules="[(v) => is_required(v)]"
                      @update:model-value="models.destination_fund_id = $event"
                    />
                  </div>

                  <div class="col-12 col-md-3">
                    <GenericInput
                      v-if="radioPaymentMethod"
                      label="Número de cuenta/número de plan"
                      placeholder="Insertar"
                      type="number"
                      :required="true"
                      :default_value="null"
                      :rules="[(v) => is_required(v), (v) => only_number(v)]"
                      @update:modelValue="models.account_number = $event"
                    />
                    <GenericSelectorComponent
                      v-else
                      :key="planSelectorKey"
                      label="Número de cuenta/número de plan"
                      :default_value="null"
                      :manual_option="planOptions"
                      :auto_complete="true"
                      :required="radioPaymentMethod"
                      :map_options="true"
                      :rules="[(v) => is_required(v)]"
                      @update:modelValue="models.destination_plan = $event"
                    />
                  </div>

                  <div class="col-12 col-md-3">
                    <GenericSelectorComponent
                      label="Tipo de cuenta"
                      :default_value="null"
                      :manual_option="account_types"
                      :auto_complete="true"
                      :required="radioPaymentMethod"
                      :map_options="true"
                      :rules="[(v) => is_required(v)]"
                      @update:model-value="models.account_type = $event ?? ''"
                      :disabled="!radioPaymentMethod"
                    />
                  </div>

                  <div class="col-12 col-md-4">
                    <GenericSelectorComponent
                      label="Tipo de identificación"
                      :default_value="null"
                      :manual_option="identification_types_for_plans"
                      :auto_complete="true"
                      :required="true"
                      :map_options="true"
                      :rules="[]"
                      @update:model-value="models.identification_type = $event"
                    />
                  </div>

                  <div class="col-12 col-md-4">
                    <GenericInput
                      label="Número de identificación"
                      placeholder="Inserte"
                      type="number"
                      :required="true"
                      :default_value="models.identification_number"
                      :rules="[
                        (v) => only_number(v),
                        (v) => min_length(v, 3),
                        (v) => max_length(v, 15),
                      ]"
                      @update:modelValue="models.identification_number = $event"
                      @update:blur="searchThirdParties"
                    />
                  </div>

                  <div class="col-12 col-md-4">
                    <GenericInput
                      label="Nombre"
                      placeholder="Inserte"
                      type="text"
                      :required="true"
                      :default_value="models.people_name"
                      :rules="[(v) => is_required(v)]"
                      @update:modelValue="models.people_name = $event"
                      :disabled="models.identification_id != null"
                    />
                  </div>

                  <div class="col-12 col-md-3">
                    <GenericInput
                      label="Cantidad de operaciones por día"
                      placeholder="Inserte"
                      type="number"
                      :required="true"
                      :default_value="null"
                      :rules="[(v) => is_required(v), (v) => only_number(v)]"
                      @update:modelValue="
                        models.operation_count_per_day = $event
                      "
                    />
                  </div>

                  <div class="col-12 col-md-3">
                    <GenericInput
                      label="Valor por operación máximo"
                      placeholder="Inserte"
                      type="text"
                      :required="true"
                      :default_value="null"
                      :rules="[
                        (v) => is_required(v),
                        (v) => max_integer_decimal(v, 15, 2),
                      ]"
                      @update:modelValue="
                        models.maximum_value_per_operation = $event
                      "
                    />
                  </div>

                  <div class="col-12 col-md-3">
                    <CurrencyInput
                      v-model="models.total_amount_per_day"
                      label="Monto total al día"
                      :required="true"
                      :currency="'COP'"
                      placeholder="Inserte"
                      currencyLabel=""
                      :rules="[(v) => is_required(v)]"
                      disabled
                    />
                  </div>

                  <div class="col-12 col-md-3">
                    <GenericSelectorComponent
                      label="Estado de inscripción"
                      :default_value="null"
                      :manual_option="status_fip_account_management"
                      :auto_complete="true"
                      :required="true"
                      :map_options="true"
                      :rules="[(v) => is_required(v)]"
                      @update:model-value="
                        models.inscription_status_id = $event
                      "
                    />
                  </div>
                </div>
              </section>

              <q-separator class="mx-2 my-1" />

              <section class="q-mt-md">
                <div class="row q-col-gutter-md flex justify-end mx-2 mb-2">
                  <div class="col-auto">
                    <Button
                      :outline="true"
                      label="Cancelar"
                      class="mr-3"
                      class-custom="custom"
                      color="orange"
                      color-icon="white"
                      :styleContent="{
                        'place-items': 'center',
                        'white-space': 'nowrap',
                      }"
                      @click="handleGoTo('AccountManagementList')"
                    />
                  </div>

                  <div class="col-auto">
                    <Button
                      :outline="false"
                      label="Agregar"
                      class="mr-3"
                      class-custom="custom"
                      color="orange"
                      color-icon="white"
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
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useAccountManagementCreate from '@/views/fics/fiduciary-investment-plan/v2/create/AccountManagementCreate'

const {
  tabs,
  banks,
  models,
  formKey,
  onSubmit,
  tabActive,
  min_length,
  max_length,
  handleGoTo,
  formAccount,
  is_required,
  planOptions,
  only_number,
  headerProps,
  changeRadio,
  tabActiveIdx,
  account_types,
  planSelectorKey,
  searchThirdParties,
  radioPaymentMethod,
  max_integer_decimal,
  filteredMeansOfPayments,
  funts_to_investment_plans,
  status_fip_account_management,
  identification_types_for_plans,
} = useAccountManagementCreate()
</script>
