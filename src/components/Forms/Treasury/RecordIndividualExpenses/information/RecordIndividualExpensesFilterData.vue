<template>
  <q-form ref="formInformation" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <div class="col-xs-12 col-sm-12 col-md-12 mt-0">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Filtros
          </p>
        </div>
        <div class="row q-col-gutter-lg mt-0">
          <div class="col-xs-12 col-sm-12 col-md-6">
            <p class="text-weight-medium mb-0 text-grey-6">Oficina *</p>
            <GenericSelectorComponent
              :required="true"
              :disabled="is_creating"
              auto_complete
              :manual_option="offices_fics"
              :default_value="models.office_id"
              map_options
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              @update:model-value="selectOfficeName($event)"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p class="text-weight-medium mb-0 text-grey-6">
              Nombre de la oficina
            </p>
            <GenericInput
              :required="false"
              :disabled="true"
              placeholder="-"
              :default_value="models.name_office"
              @update:model-value="models.name_office = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p class="text-weight-medium mb-0 text-grey-6">Negocio *</p>
            <GenericSelectorComponent
              :required="true"
              auto_complete
              map_options
              :disabled="is_creating"
              :manual_option="business_trusts_egreso"
              :default_value="models.business_id"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              @update:model-value="selectBusinessName($event)"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p class="text-weight-medium mb-0 text-grey-6">
              Nombre del negocio
            </p>
            <GenericInput
              :required="false"
              :disabled="true"
              placeholder="-"
              :default_value="models.name_business"
              @update:model-value="models.name_business = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p class="text-weight-medium mb-0 text-grey-6">Movimiento *</p>
            <GenericSelectorComponent
              :required="true"
              :auto_complete="true"
              :disabled="is_creating"
              map_options
              :manual_option="treasury_movement_code_expense"
              :default_value="models.movement_id"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              @update:model-value="models.movement_id = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p class="text-weight-medium mb-0 text-grey-6">Fecha *</p>
            <GenericDateInputComponent
              :default_value="models.date"
              :option_calendar="isDateAllowed"
              :required="true"
              :disabled="is_creating"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              @update:modelValue="models.date = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p class="text-weight-medium mb-0 text-grey-6">Comprobante *</p>
            <GenericInput
              :required="true"
              placeholder="-"
              :disabled="true"
              :default_value="selectVoucher"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              @update:model-value="models.voucher = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p class="text-weight-medium mb-0 text-grey-6">Sub comprobante</p>
            <GenericInput
              :required="false"
              placeholder="-"
              :disabled="true"
              :default_value="selectSubVoucher"
              @update:model-value="models.sub_voucher = $event"
            />
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
//components
import useRecordIndividualExpensesBasicData from '@/components/Forms/Treasury/RecordIndividualExpenses/information/RecordIndividualExpensesFilterData'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
//composables
import { useRules } from '@/composables'

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
const props = withDefaults(
  defineProps<{
    data?: boolean
  }>(),
  {}
)
const {
  models,
  offices_fics,
  business_trusts_egreso,
  formInformation,
  selectVoucher,
  selectSubVoucher,
  treasury_movement_code_expense,
  is_creating,
  selectOfficeName,
  isDateAllowed,
  selectBusinessName,
} = useRecordIndividualExpensesBasicData(props)
</script>
