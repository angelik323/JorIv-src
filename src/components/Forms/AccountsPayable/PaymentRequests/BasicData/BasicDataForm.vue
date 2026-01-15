<template>
  <q-form ref="basicDataFormRef" class="q-pa-md">
    <section class="q-col-gutter-sm">
      <div class="row">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Oficinas"
            :default_value="models.office_id"
            :manual_option="offices"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'La oficina es requerida')]"
            @update:model-value="models.office_id = $event"
          />
        </div>

        <div class="col-12 flex justify-between">
          <div class="col-auto self-center">
            <p class="q-my-none">Consulta de proceso*</p>
          </div>

          <div class="col-auto">
            <RadioYesNo
              v-model="models.process_source"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
              :options="process_source"
            />
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mb-3" />

    <section v-if="models.process_source == 'solicitud_pago'">
      <p class="text-h6">Pago a realizar</p>

      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-3">
          <GenericInputComponent
            label="Radicado"
            type="text"
            :default_value="models.radicated_code"
            :required="true"
            :disabled="false"
            placeholder="Inserte"
            :rules="[
              (val: string) => is_required(val, 'El código de radicado es requerido'),
              (val: string) => min_length(val, 1),
              (val: string) => max_length(val, 10),
              (val: string) => only_alphanumeric(val),
              ]"
            @update:model-value="models.radicated_code = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="models.reception_date"
            label="Fecha de recepción"
            placeholder="AAAA/MM/DD"
            mask="YYYY-MM-DD"
            required
            :rules="[
              (val: string) => is_required(val, 'La fecha de recepción es requerida'),
              (val: string) => valid_format_date(val, 'YYYY-MM-DD'),
              (val: string) => date_before_or_equal_to_the_current_date(val),
            ]"
            @update:model-value="models.reception_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            label="Prefijo"
            type="text"
            :default_value="models.prefix"
            :required="false"
            :disabled="false"
            placeholder="Inserte"
            :rules="[
              (val: string) => min_length(val, 0),
              (val: string) => max_length(val, 10),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.prefix = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Proveedor / Emisor"
            :default_value="models.supplier_id"
            :manual_option="third_parties"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El proveedir / emisor es requerido')]"
            @update:model-value="models.supplier_id = $event"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-3">
          <GenericInputComponent
            label="Factura número"
            type="number"
            :default_value="models.invoice_number"
            :required="true"
            :disabled="false"
            placeholder="Inserte"
            :rules="[
              (val: string) => is_required(val, 'El número de factura es requerido'),
              (val: string) => min_length(val, 1),
              (val: string) => max_length(val, 16),
              (val: string) => only_number(val),
              ]"
            @update:model-value="models.invoice_number = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="models.invoice_issue_date"
            label="Fecha de emision"
            placeholder="AAAA/MM/DD"
            mask="YYYY-MM-DD"
            required
            :rules="[
              (val: string) => is_required(val, 'La fecha de emision es requerida'),
              (val: string) => valid_format_date(val, 'YYYY-MM-DD'),
              (val: string) => date_before_or_equal_to_the_current_date(val),
            ]"
            @update:model-value="models.invoice_issue_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="models.invoice_due_date"
            label="Fecha de vencimiento"
            placeholder="AAAA/MM/DD"
            mask="YYYY-MM-DD"
            :disabled="false"
            :required="true"
            :rules="[
              (val: string) => is_required(val, 'La fecha de vencimiento es requerida'),
              (val: string) => valid_format_date(val, 'YYYY-MM-DD'),
              (val: string) => date_after_or_equal_to_specific_date(val, models.invoice_issue_date),
            ]"
            @update:model-value="models.invoice_due_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <InputMoneyComponent
            label="Valor total"
            :model-value="models.total_value"
            :required="true"
            :disabled="false"
            placeholder="0,00"
            :rules="[
                (val: string) => is_required(val, 'El valor total requerido'),
                (val: string) => only_number_with_max_integers_and_decimals_ignore_symbols(val, 15, 2),
              ]"
            @update:model-value="
              ({ rawValue }) => (models.total_value = rawValue ?? '')
            "
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-3">
          <InputMoneyComponent
            label="Valor IVA"
            :model-value="models.iva_value"
            :required="false"
            :disabled="false"
            placeholder="0,00"
            :rules="[
              (v: string) => only_number_with_max_integers_and_decimals_ignore_symbols(v, 15, 2),
            ]"
            @update:model-value="
              ({ rawValue }) => (models.iva_value = rawValue ?? '')
            "
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// interfaces
import { IPaymentRequestBasicDataForm } from '@/interfaces/customs/accounts-payable/PaymentRequests'
import { ActionType } from '@/interfaces/global'

// logic view
import useBasicDataForm from '@/components/Forms/AccountsPayable/PaymentRequests/BasicData/BasicDataForm'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IPaymentRequestBasicDataForm | null
  }>(),
  {}
)

const {
  basicDataFormRef,
  models,

  // selects
  offices,
  process_source,
  third_parties,

  // rules
  is_required,
  min_length,
  max_length,
  only_alphanumeric,
  only_number,
  valid_format_date,
  date_before_or_equal_to_the_current_date,
  date_after_or_equal_to_specific_date,
  only_number_with_max_integers_and_decimals_ignore_symbols,
} = useBasicDataForm(props, emit)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
