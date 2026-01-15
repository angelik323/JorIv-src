<template>
  <q-form ref="instructionsFormRef" class="q-pa-md">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 flex justify-between">
          <div class="col-auto self-center">
            <p class="q-my-none">Tipo de pago*</p>
          </div>

          <div class="col-auto">
            <RadioYesNo
              v-model="models.payment_type"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
              :options="payment_type"
              :is-disabled="['view'].includes(action)"
            />
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mb-3" />

    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 flex justify-between">
          <div class="col-auto self-center">
            <p class="q-my-none">Fuente de pago*</p>
          </div>

          <div class="col-auto">
            <RadioYesNo
              v-model="models.payment_source"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
              :options="payment_source"
              :is-disabled="['view'].includes(action)"
              @update:model-value="changePaymentSource"
            />
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mb-3" />

    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Forma de pago"
            :default_value="models.payment_method_id"
            :manual_option="payments_with_code"
            :auto_complete="true"
            :required="true"
            :disabled="['view'].includes(action)"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'La forma de pago es requerida')]"
            @update:model-value="models.payment_method_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Fondo / Banco"
            :default_value="models.fund_or_bank_id"
            :manual_option="
              models.payment_source == 'cuenta_bancaria'
                ? banks
                : models.payment_source == 'plan_de_inversion'
                ? info_collective_investment_funds
                : []
            "
            :auto_complete="true"
            :required="true"
            :disabled="['view'].includes(action)"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El fondo o banco es requerido')]"
            @update:model-value="changeFundOrBank($event)"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Plan / Cuenta bancarias"
            :default_value="models.plan_or_account_id"
            :manual_option="
              models.payment_source == 'cuenta_bancaria'
                ? bank_accounts_with_name
                : models.payment_source == 'plan_de_inversion'
                ? fiduciary_investment_plans_treasury
                : []
            "
            :auto_complete="true"
            :required="true"
            :disabled="['view'].includes(action)"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El plan o cuenta bancaria es requerido')]"
            @update:model-value="models.plan_or_account_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="models.instruction_date"
            label="Fecha"
            placeholder="AAAA-MM-DD"
            mask="YYYY-MM-DD"
            :required="true"
            :disabled="['view'].includes(action)"
            :rules="[
              (val: string) => is_required(val, 'La fecha de instrucción es requerida'),
              (val: string) => valid_format_date(val, 'YYYY-MM-DD'),
              (val: string) => date_before_or_equal_to_the_current_date(val),
              (val: string) => only_business_day(val, 'CO'),
            ]"
            @update:model-value="models.instruction_date = $event"
          />
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <InputMoneyComponent
            label="Valor base"
            :model-value="String(models.base_value ?? '')"
            :required="true"
            :disabled="true"
            placeholder="0,00"
            :rules="[]"
            @update:model-value="
              ({ rawValue }) => (models.base_value = rawValue ?? '')
            "
          />
        </div>

        <div class="col-12 col-md-3">
          <InputMoneyComponent
            label="Descuento tributario"
            :model-value="String(models.tax_discount ?? '')"
            :required="true"
            :disabled="true"
            placeholder="0,00"
            :rules="[]"
            @update:model-value="
              ({ rawValue }) => (models.tax_discount = rawValue ?? '')
            "
          />
        </div>

        <div class="col-12 col-md-3">
          <InputMoneyComponent
            label="Neto calculado"
            :model-value="String(models.net_value ?? '')"
            :required="true"
            :disabled="true"
            placeholder="0,00"
            :rules="[]"
            @update:model-value="
              ({ rawValue }) => (models.net_value = rawValue ?? '')
            "
          />
        </div>
      </div>
    </section>

    <q-separator class="mb-3" />

    <section>
      <div class="flex justify-between">
        <p class="text-h6">Instrucciones de pago</p>

        <div>
          <Button
            v-if="!['view'].includes(action)"
            label="Agregar"
            unelevated
            color-icon="white"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            :outline="false"
            @click="addInstruction"
          />
        </div>
      </div>

      <VCard class="full-width">
        <template #content-card>
          <div class="q-pa-md">
            <TableList
              ref="tableRef"
              :loading="tableProps.loading"
              :columns="tableProps.columns"
              :rows="tableProps.rows"
              :pages="tableProps.pages"
              :custom-columns="[
                'instruction_number',
                'payment_method_id',
                'beneficiary_id',
                'beneficiary_name',
                'beneficiary_bank_account_id',
                'pay_value',
                'actions',
              ]"
              :hide-pagination="true"
            >
              <template #instruction_number="{ row }">
                <GenericInputComponent
                  type="text"
                  :default_value="row.instruction_number"
                  :required="true"
                  :disabled="true"
                  placeholder="-"
                  :rules="[]"
                  @update:model-value="models.net_value = $event"
                />
              </template>

              <template #payment_method_id="{ row }">
                <GenericSelectorComponent
                  :default_value="row.payment_method_id"
                  :manual_option="payments_with_code"
                  :auto_complete="true"
                  :required="true"
                  :disabled="['view'].includes(action)"
                  :map_options="true"
                  :rules="[(val: string) => is_required(val, 'La forma de pago es requerida')]"
                  @update:model-value="row.payment_method_id = $event"
                />
              </template>

              <template #beneficiary_id="{ row }">
                <GenericSelectorComponent
                  :default_value="row.beneficiary_id"
                  :manual_option="third_parties_beneficiary"
                  :auto_complete="true"
                  :required="true"
                  :disabled="['view'].includes(action)"
                  :map_options="true"
                  :rules="[(val: string) => is_required(val, 'El beneficiario es requerido')]"
                  @update:model-value="changeBeneficiary(row, $event)"
                />
              </template>

              <template #beneficiary_name="{ row }">
                <GenericInputComponent
                  type="text"
                  :default_value="row.beneficiary_name"
                  :required="true"
                  :disabled="true"
                  placeholder="-"
                  :rules="[]"
                  @update:model-value="row.beneficiary_name = $event"
                />
              </template>

              <template #beneficiary_bank_account_id="{ row }">
                <GenericSelectorComponent
                  :default_value="row.beneficiary_bank_account_id"
                  :manual_option="row.account_selector"
                  :auto_complete="true"
                  :required="true"
                  :disabled="['view'].includes(action)"
                  :map_options="true"
                  :rules="[(val: string) => is_required(val, 'La cuenta bancaria es requerida')]"
                  @update:model-value="row.beneficiary_bank_account_id = $event"
                />
              </template>

              <template #pay_value="{ row }">
                <div style="min-width: 15em">
                  <InputMoneyComponent
                    :model-value="row.pay_value"
                    :required="true"
                    :disabled="['view'].includes(action)"
                    placeholder="0,00"
                    :rules="[
                      (val: string) => is_required(val, 'El valor a girar es requerido'),
                      (val: string) => only_number_with_max_integers_and_decimals_ignore_symbols(val, 15, 2),
                    ]"
                    @update:model-value="
                      ({ rawValue }) => (row.pay_value = rawValue ?? '')
                    "
                  />
                </div>
              </template>

              <template #actions="{ row }">
                <Button
                  :outline="false"
                  :left-icon="defaultIconsLucide.trash"
                  color="orange"
                  :flat="true"
                  :class-custom="'custom'"
                  tooltip="Eliminar"
                  @click="removeInstruction(row.id)"
                />
              </template>
            </TableList>
          </div>
        </template>
      </VCard>
    </section>

    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <GenericInputComponent
            label="Observación"
            type="textarea"
            :default_value="models.observation"
            :required="true"
            :disabled="['view'].includes(action)"
            placeholder="Inserte"
            :rules="[
              (val: string) => is_required(val, 'La observación es requeria'),
              (val: string) => min_length(val, 1),
              (val: string) => max_length(val, 150),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.observation = $event"
          />
        </div>
      </div>
    </section>

    <q-separator v-if="authorized_payment" class="mb-3" />

    <section v-if="authorized_payment">
      <p class="text-h6">Autorizado de pago</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Tipo de documento"
            :default_value="models.authorized_doc_type_id"
            :manual_option="document_types"
            :auto_complete="true"
            :required="true"
            :disabled="['view'].includes(action)"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El tipo de documento es requerido')]"
            @update:model-value="models.authorized_doc_type_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Número de documento"
            type="text"
            :default_value="models.authorized_doc_number"
            :required="true"
            :disabled="['view'].includes(action)"
            placeholder="Inserte"
            :rules="[
              (val: string) => is_required(val, 'El número de documento es requerido'),
              (val: string) => min_length(val, 1),
              (val: string) => max_length(val, 30),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.authorized_doc_number = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Nombre completo"
            type="text"
            :default_value="models.authorized_full_name"
            :required="true"
            :disabled="['view'].includes(action)"
            placeholder="Inserte"
            :rules="[
              (val: string) => is_required(val, 'El nombre completo es requerido'),
              (val: string) => min_length(val, 1),
              (val: string) => max_length(val, 30),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.authorized_full_name = $event"
          />
        </div>
      </div>
    </section>

    <q-separator />
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// interfaces
import { IPaymentInstructionsForm } from '@/interfaces/customs/accounts-payable/PaymentInstructions'
import { ActionType } from '@/interfaces/global'

// logic view
import useInstructionsForm from '@/components/Forms/AccountsPayable/PaymentInstructions/BasicData/BasicDataForm'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IPaymentInstructionsForm | null
  }>(),
  {}
)

const {
  instructionsFormRef,
  models,
  tableProps,
  authorized_payment,

  // selects
  payment_type,
  payment_source,
  payments_with_code,
  banks,
  info_collective_investment_funds,
  bank_accounts_with_name,
  fiduciary_investment_plans_treasury,
  third_parties_beneficiary,
  document_types,

  // methods
  changeFundOrBank,
  changePaymentSource,
  addInstruction,
  removeInstruction,
  changeBeneficiary,

  // utils
  defaultIconsLucide,

  // rules
  is_required,
  only_number_with_max_integers_and_decimals_ignore_symbols,
  valid_format_date,
  date_before_or_equal_to_the_current_date,
  only_business_day,
  min_length,
  max_length,
  only_alphanumeric,
} = useInstructionsForm(props, emit)

defineExpose({
  validateForm: () => instructionsFormRef.value?.validate(),
})
</script>
