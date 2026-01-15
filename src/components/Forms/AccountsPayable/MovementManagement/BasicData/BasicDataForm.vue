<template>
  <q-form ref="basicDataFormRef" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div v-if="action == 'edit'" class="col-12 col-md-4">
          <GenericInputComponent
            label="Código de movimiento"
            type="text"
            :default_value="models.code"
            :required="true"
            :disabled="true"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Nombre"
            type="text"
            :default_value="models.name"
            :required="true"
            :disabled="false"
            :rules="[
              (val: string) => is_required(val, 'El nombre es requerido'),
              (val: string) => max_length(val, 80),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.name = $event"
          />
        </div>

        <div v-if="action == 'edit'" class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Tipo de desembolso"
            :default_value="models.disbursement_type"
            :manual_option="disbursementType"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :disabled="true"
            :rules="[]"
            @update:model-value="models.disbursement_type = $event"
          />
        </div>
      </div>

      <div v-if="action == 'create'" class="row mt-1">
        <div class="col-12 flex justify-between">
          <div class="col-auto self-center">
            <p class="q-my-none">Tipo de desembolso</p>
          </div>

          <div class="col-auto">
            <RadioYesNo
              v-model="models.disbursement_type"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
              :options="disbursementType"
              :rules="[(val: string) => is_required(val, 'El tipo de desembolso es requerido')]"
            />
          </div>
        </div>
      </div>

      <q-separator v-if="action == 'create'" class="my-1" />

      <div class="row mt-1">
        <div class="col-12 flex justify-between">
          <div class="col-auto self-center">
            <p class="q-my-none">¿Maneja presupuesto?</p>
          </div>

          <div class="col-auto">
            <RadioYesNo
              v-model="models.has_handle_budget"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
              @update:model-value="setValueBudget($event)"
            />
          </div>
        </div>
      </div>

      <q-separator class="my-1" />

      <div
        v-if="models.has_handle_budget"
        class="row q-col-gutter-x-lg q-col-gutter-y-sm"
      >
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Documento presupuestal a referenciar"
            :default_value="models.budget_reference_document_type_id"
            :manual_option="budget_document_transfer_type"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El documento presupuestal a referenciar es requerido')]"
            @update:model-value="
              models.budget_reference_document_type_id = $event
            "
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Documento presupuestal a generar"
            :default_value="models.budget_generate_document_type_id"
            :manual_option="budget_document_transfer_type"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El documento presupuestal a generar es requerido')]"
            @update:model-value="
              models.budget_generate_document_type_id = $event
            "
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Movimiento presupuestal a generar"
            :default_value="models.budget_generate_movement_id"
            :manual_option="code_movements_types_contracting"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El movimiento presupuestal a generar es requerido')]"
            @update:model-value="models.budget_generate_movement_id = $event"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 flex justify-between">
          <div class="col-auto self-center">
            <p class="q-my-none">¿Solicita factura?</p>
          </div>

          <div class="col-auto">
            <RadioYesNo
              v-model="models.has_requests_invoice"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
            />
          </div>
        </div>
      </div>

      <q-separator class="my-1" />

      <div class="row">
        <div class="col-12 flex justify-between">
          <div class="col-auto self-center">
            <p class="q-my-none">¿Ejecución de contratos?</p>
          </div>

          <div class="col-auto">
            <RadioYesNo
              v-model="models.has_contract_execution"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
            />
          </div>
        </div>
      </div>

      <q-separator class="my-1" />

      <div class="row">
        <div class="col-12 flex justify-between">
          <div class="col-auto self-center">
            <p class="q-my-none">¿Válida acta final?</p>
          </div>

          <div class="col-auto">
            <RadioYesNo
              v-model="models.has_validates_final_act"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
            />
          </div>
        </div>
      </div>

      <q-separator class="my-1" />

      <div class="row">
        <div class="col-12 flex justify-between">
          <div class="col-auto self-center">
            <p class="q-my-none">¿Genera causación?</p>
          </div>

          <div class="col-auto">
            <RadioYesNo
              v-model="models.has_generates_accrual"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
            />
          </div>
        </div>
      </div>

      <q-separator class="my-1" />

      <div
        v-if="models.has_generates_accrual"
        class="row q-col-gutter-x-lg q-col-gutter-y-sm"
      >
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Subtipo de comprobante contable causación"
            :default_value="models.accounting_accrual_subtype_id"
            :manual_option="sub_receipt_types_voucher"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El subtipo de comprobante contable causación es requerido')]"
            @update:model-value="models.accounting_accrual_subtype_id = $event"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 flex justify-between">
          <div class="col-auto self-center">
            <p class="q-my-none">¿Cumplimiento sin tesorería?</p>
          </div>

          <div class="col-auto">
            <RadioYesNo
              v-model="models.has_generates_treasury"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
              @update:model-value="setValueTreasury($event)"
            />
          </div>
        </div>
      </div>

      <q-separator class="my-1" />

      <div
        v-if="models.has_generates_treasury"
        class="row q-col-gutter-x-lg q-col-gutter-y-sm"
      >
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Movimiento de tesorería pagos fondos"
            :default_value="models.treasury_funds_payment_movement_id"
            :manual_option="treasury_movement_codes"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El movimiento de tesorería pagos fondo es requerido')]"
            @update:model-value="
              models.treasury_funds_payment_movement_id = $event
            "
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Movimiento de tesorería pagos cuentas bancarias"
            :default_value="models.treasury_bank_payment_movement_id"
            :manual_option="treasury_movement_codes"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El movimiento de tesorería pagos cuentas bancarias es requerido')]"
            @update:model-value="
              models.treasury_bank_payment_movement_id = $event
            "
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 flex justify-between">
          <div class="col-auto self-center">
            <p class="q-my-none">¿Amortiza fondo?</p>
          </div>

          <div class="col-auto">
            <RadioYesNo
              v-model="models.has_amortizes_fund"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
              @update:model-value="setValueAmortization($event)"
            />
          </div>
        </div>
      </div>

      <q-separator class="my-1" />

      <div
        v-if="models.has_amortizes_fund"
        class="row q-col-gutter-x-lg q-col-gutter-y-sm"
      >
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Código de movimiento de fondo"
            :default_value="models.fund_movement_code_id"
            :manual_option="movements_codes_nfi"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El código de movimiento de fondo es requerido')]"
            @update:model-value="models.fund_movement_code_id = $event"
          />
        </div>
      </div>

      <q-separator v-if="models.has_amortizes_fund" class="my-1" />

      <div v-if="action == 'edit'" class="col-12 col-md-3">
        <ShowStatus :type="Number(models?.status?.id ?? 0)" />
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// interfaces
import { IMovementManagementForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

// logic view
import useBasicDataForm from '@/components/Forms/AccountsPayable/MovementManagement/BasicData/BasicDataForm'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IMovementManagementForm | null
  }>(),
  {}
)

const {
  basicDataFormRef,
  models,

  // selects
  disbursementType,
  code_movements_types_contracting,
  sub_receipt_types_voucher,
  budget_document_transfer_type,
  treasury_movement_codes,
  movements_codes_nfi,

  // rules
  is_required,
  max_length,
  only_alphanumeric,

  setValueBudget,
  setValueTreasury,
  setValueAmortization,
} = useBasicDataForm(props, emit)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
