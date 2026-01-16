<template>
  <q-form ref="mainInformationFormRef" class="q-pa-md">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Tipo de documento"
            :default_value="models.document_type_id"
            :manual_option="document_type_code_name_with_id"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El tipo de documento es requerido')]"
            @update:model-value="changeDocumentType($event)"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Negocio"
            :default_value="models.business_id"
            :manual_option="business_trusts"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El negocio es requerido')]"
            @update:model-value="changeBusiness($event)"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Estructura de pago"
            type="text"
            :default_value="models.payment_structure_label"
            :required="true"
            :disabled="true"
            placeholder="-"
          />
        </div>
      </div>
    </section>

    <q-separator class="mb-2" />

    <section>
      <p class="text-h6">Datos principales</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div
          v-if="props.validate.hasInternalConsecutive"
          class="col-12 col-md-3"
        >
          <GenericInputComponent
            label="Consecutivo interno"
            type="text"
            :default_value="models.internal_code"
            :required="true"
            :disabled="false"
            placeholder="Inserte"
            :rules="[
              (val: string) => is_required(val, 'El consecutivo interno es requerido'),
              (val: string) => min_length(val, 1),
              (val: string) => max_length(val, 20),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.internal_code = $event"
          />
        </div>

        <div v-if="props.validate.hasClientConsecutive" class="col-12 col-md-3">
          <GenericInputComponent
            label="Consecutivo cliente"
            type="text"
            :default_value="models.client_code"
            :required="true"
            :disabled="false"
            placeholder="Inserte"
            :rules="[
              (val: string) => is_required(val, 'El consecutivo cliente es requerido'),
              (val: string) => min_length(val, 1),
              (val: string) => max_length(val, 20),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.client_code = $event"
          />
        </div>

        <div v-if="props.validate.hasOrder" class="col-12 col-md-3">
          <GenericInputComponent
            label="Orden de pedido"
            type="text"
            :default_value="models.order_number"
            :required="true"
            :disabled="false"
            placeholder="Inserte"
            :rules="[
              (val: string) => is_required(val, 'La orden de pedido es requerida'),
              (val: string) => min_length(val, 1),
              (val: string) => max_length(val, 20),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.order_number = $event"
          />
        </div>

        <div v-if="props.validate.hasOtherReferences" class="col-12 col-md-3">
          <GenericInputComponent
            label="Otra referencia"
            type="text"
            :default_value="models.other_reference"
            :required="true"
            :disabled="false"
            placeholder="Inserte"
            :rules="[
              (val: string) => is_required(val, 'La otra referencia es requeria'),
              (val: string) => min_length(val, 1),
              (val: string) => max_length(val, 60),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.other_reference = $event"
          />
        </div>

        <div v-if="props.validate.hasLegalizationDate" class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="models.legalization_date"
            label="Fecha legalización"
            placeholder="AAAA/MM/DD"
            mask="YYYY-MM-DD"
            required
            :rules="[
              (val: string) => is_required(val, 'La fecha de emision es requerida'),
              (val: string) => valid_format_date(val, 'YYYY-MM-DD'),
              (val: string) => date_before_or_equal_to_the_current_date(val),
              (val: string) => only_business_day(val, 'CO'),
            ]"
            @update:model-value="models.legalization_date = $event"
          />
        </div>

        <div v-if="props.validate.hasExpirationDate" class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="models.due_date"
            label="Fecha de vencimiento"
            placeholder="AAAA/MM/DD"
            mask="YYYY-MM-DD"
            required
            :rules="[
              (val: string) => is_required(val, 'La fecha de emision es requerida'),
              (val: string) => valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            @update:model-value="models.due_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Código de movimiento"
            :default_value="models.movement_code_id"
            :manual_option="filteredMovementManagement"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El código de movimiento es requerido')]"
            @update:model-value="changeMovementCode($event)"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="models.movement_date"
            label="Fecha de movimiento"
            placeholder="AAAA/MM/DD"
            mask="YYYY-MM-DD"
            required
            :rules="[
              (val: string) => is_required(val, 'La fecha de emision es requerida'),
              (val: string) => valid_format_date(val, 'YYYY-MM-DD'),
              (val: string) => date_before_or_equal_to_the_current_date(val),
              (val: string) => only_business_day(val, 'CO'),
            ]"
            @update:model-value="changeMovementDate($event)"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Ciudad"
            :default_value="models.city_id"
            :manual_option="cities"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) =>  is_required(val, 'La ciudad es requerida')]"
            @update:model-value="models.city_id = $event"
          />
        </div>

        <div class="col-12 col-md-3" v-if="hasContractExecution">
          <GenericSelectorComponent
            label="Documento contractual"
            :default_value="models.contract_id"
            :manual_option="basic_info_contract"
            :auto_complete="true"
            :required="hasContractExecution"
            :map_options="true"
            :rules="[(val: string) => hasContractExecution ? is_required(val, 'El documento contractual es requerido') : true]"
            @update:model-value="changeContract($event)"
          />
        </div>

        <div class="col-12 col-md-3" v-if="hasContractExecution">
          <GenericSelectorComponent
            label="Hito"
            :default_value="models.milestone_id"
            :manual_option="contract_payment_milestones"
            :auto_complete="true"
            :required="hasContractExecution"
            :map_options="true"
            :rules="[(val: string) => hasContractExecution ? is_required(val, 'El hito es requerido') : true]"
            @update:model-value="models.milestone_id = $event"
          />
        </div>

        <div class="col-12 col-md-3" v-if="hasContractExecution">
          <GenericDateInputComponent
            label="Vigencia"
            :default_value="String(models.validity_year ?? '')"
            auto_complete
            placeholder="YYYY"
            mask="YYYY"
            :required="hasContractExecution"
            :rules="[(val: string) => hasContractExecution ? is_required(val, 'La vigencia es requerida') : true]"
            @update:model-value="(val) => (models.validity_year = val)"
          />
        </div>
      </div>
    </section>

    <q-separator class="mb-2" />

    <section v-if="has_budget">
      <p class="text-h6">Presupuesto</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Documento presupuestal"
            :default_value="models.budget_document_type_id"
            :manual_option="budget_document_transfer_type"
            :auto_complete="true"
            :required="has_budget"
            :map_options="true"
            :rules="[(val: string) => has_budget ? is_required(val, 'El documento presupuestal es requerido'): true]"
            @update:model-value="models.budget_document_type_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Número de documento"
            :default_value="models.budget_document_number_id"
            :manual_option="budget_document_number"
            :auto_complete="true"
            :required="has_budget"
            :map_options="true"
            :rules="[(val: string) => has_budget ? is_required(val, 'El número de documento es requerido'): true]"
            @update:model-value="models.budget_document_number_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            label="Vigencia"
            :default_value="String(models.budget_validity_year ?? '')"
            auto_complete
            placeholder="YYYY"
            mask="YYYY"
            :required="has_budget"
            :rules="[(val: string) => has_budget ? is_required(val, 'La vigencia es requerida') : true]"
            @update:model-value="(val) => (models.budget_validity_year = val)"
          />
        </div>
      </div>
    </section>

    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <GenericInputComponent
            label="Observación"
            type="textarea"
            :default_value="models.observation"
            :required="true"
            :disabled="false"
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

    <q-separator />
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

// interfaces
import {
  IPaymentRequestMainInformationForm,
  IPaymentRequestValidate,
} from '@/interfaces/customs/accounts-payable/PaymentRequests'
import { ActionType } from '@/interfaces/global'

// logic view
import useMainInformationForm from '@/components/Forms/AccountsPayable/PaymentRequests/MainInformation/MainInformationForm'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IPaymentRequestMainInformationForm | null
    validate: IPaymentRequestValidate
  }>(),
  {}
)

const {
  mainInformationFormRef,
  models,
  hasContractExecution,
  has_budget,

  // selects
  document_type_code_name_with_id,
  business_trusts,
  filteredMovementManagement,
  basic_info_contract,
  contract_payment_milestones,
  budget_document_number,
  budget_document_transfer_type,
  cities,

  // methods
  changeBusiness,
  changeContract,
  changeMovementDate,
  changeMovementCode,
  changeDocumentType,

  // rules
  is_required,
  min_length,
  max_length,
  only_alphanumeric,
  valid_format_date,
  date_before_or_equal_to_the_current_date,
  only_business_day,
} = useMainInformationForm(props, emit)

defineExpose({
  validateForm: () => mainInformationFormRef.value?.validate(),
})
</script>
