<template>
  <div class="q-mx-xl">
    <q-form ref="formRef" class="q-mt-lg">
      <div class="row q-col-gutter-lg">
        <div v-if="fieldFlags.showPaymentOrder" class="col-12">
          <GenericSelectorComponent
            label="Numero de orden de pago"
            :options="orpa_authorizations"
            :default_value="formData.payment_order_id"
            :required="true"
            :disabled="isViewMode"
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'El número de orden de pago es requerido'
                ),
            ]"
            @update:model-value="formData.payment_order_id = $event"
          />
        </div>

        <div v-if="fieldFlags.showPaymentOrder" class="col-12 col-md-4">
          <GenericInputComponent
            label="Fecha de pago"
            :default_value="formData.payment_date"
            :disabled="isViewMode"
            :readonly="true"
          />
        </div>

        <div v-if="fieldFlags.showPaymentOrder" class="col-12 col-md-4">
          <GenericInputComponent
            label="Valor del pago"
            :default_value="formData.payment_value"
            :disabled="isViewMode"
            :readonly="true"
          />
        </div>

        <div v-if="fieldFlags.showPaymentOrder" class="col-12 col-md-4">
          <GenericInputComponent
            label="Beneficiario"
            :default_value="formData.payment_beneficiary"
            :disabled="isViewMode"
            :readonly="true"
          />
        </div>

        <div v-if="fieldFlags.showPaymentOrder" class="col-12">
          <GenericInputComponent
            label="Estado"
            :default_value="formData.payment_status"
            :disabled="isViewMode"
            :readonly="true"
          />
        </div>

        <div v-if="fieldFlags.showLift" class="col-6 col-md-6">
          Tipo de levantamiento*
          <RadioYesNo
            label="Tipo de levantamiento"
            :options="liftTypeOptions"
            :required="true"
            :rules="[
            (val: number) =>
              useRules().is_required(
                String(val),
                'El tipo de levantamiento es requerido'
              ),
          ]"
            :model-value="formData.seizure_release_type_id"
            @update:modelValue="formData.seizure_release_type_id = $event"
          />
        </div>

        <div v-if="fieldFlags.showLift" class="col-6 col-md-6">
          <GenericDateInput
            label="Fecha de expiración"
            :default_value="formData.expiration_date"
            :required="!isReleasePermanent"
            :disabled="isViewMode || isReleasePermanent"
            :option_calendar="($event) => !useUtils().isDateUpToToday($event)"
            :rules="[
              (val: string) => {
                if (!isReleasePermanent) {
                  return useRules().is_required(
                    val,
                    'La fecha de expiración es requerida'
                  )
                }
                return true
              }
            ]"
            @update:modelValue="formData.expiration_date = $event"
          />
        </div>

        <div v-if="fieldFlags.showObservation" class="col-6 col-md-12">
          <GenericInputComponent
            label="Observación"
            type="textarea"
            :default_value="formData.observation"
            :required="true"
            :disabled="isViewMode"
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'La observación es requerida'
                ),
            ]"
            @update:model-value="formData.observation = $event"
          />
        </div>

        <div v-if="fieldFlags.showOfficial" class="col-12 col-md-6">
          <GenericInputComponent
            label="Número de oficio"
            :default_value="formData.official_number"
            :disabled="isViewMode"
            @update:model-value="formData.official_number = $event"
          />
        </div>

        <div v-if="fieldFlags.showFile" class="col-12">
          <div v-if="fieldFlags.showFile && !isViewMode" class="col-12">
            <UploadFile
              title="Documento soporte"
              accept=".pdf,.doc,.docx,.jpg,.png"
              :multiple="false"
              :required="fieldFlags.fileRequired"
              :styles-customs="'width: 100%;'"
              :bordered="false"
              @file-selected="onFileSelected"
            />
          </div>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
// Components
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import useSeizuresFormManage from '@/components/Forms/Seizures/SeizuresFormManage/SeizuresFormManage'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Composables
import { useRules } from '@/composables'
import { useUtils } from '@/composables/useUtils'

// Interfaces / Constants
import {
  liftTypeOptions,
  SeizureManagementTypes,
} from '@/constants/resources/seizures'
import { ActionType } from '@/interfaces/global'
import { ISeizureProcedure } from '@/interfaces/customs/seizures/Seizures'

const props = defineProps<{
  managementType: SeizureManagementTypes
  action: ActionType
  data?: ISeizureProcedure
}>()

const {
  formRef,
  formData,
  fieldFlags,
  orpa_authorizations,
  isViewMode,
  isReleasePermanent,
  onFileSelected,
  getPayload,
  resetForm,
} = useSeizuresFormManage(props)

defineExpose({
  getPayload,
  resetForm,
})
</script>
