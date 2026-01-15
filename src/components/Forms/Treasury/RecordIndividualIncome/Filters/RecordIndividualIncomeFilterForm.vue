<template>
  <q-form ref="filterFormElementRef" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <div class="col-xs-12 col-sm-12 col-md-12">
          <p class="text-black-10 text-weight-bold text-h6">Filtros</p>
        </div>
        <div class="row q-col-gutter-lg">
          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericSelectorComponent
              label="Oficina"
              :default_value="models.office_id"
              :manual_option="offices"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :disabled="createdListData"
              :required="true"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo Oficina es requerido'),
              ]"
              @update:model-value="selectOfficeName($event)"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericInput
              label="Nombre de la oficina"
              :default_value="models.name_office"
              placeholder="-"
              disabled
              :required="false"
              @update:model-value="models.name_office = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericSelectorComponent
              label="Negocio"
              :default_value="models.business_trust_id"
              :manual_option="business_trusts_egreso"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :disabled="createdListData"
              :required="true"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo Negocio es requerido'),
              ]"
              @update:model-value="selectBusinessName($event)"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericInput
              label="Nombre del negocio"
              :default_value="models.name_business"
              :required="false"
              disabled
              placeholder="-"
              @update:model-value="models.name_business = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericSelectorComponent
              label="Movimiento"
              :default_value="models.movement_id"
              :manual_option="movement_egreso"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :disabled="createdListData"
              :required="true"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo Movimiento es requerido'),
              ]"
              @update:model-value="selectVouchers($event)"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericDateInputComponent
              label="Fecha"
              :default_value="models.date"
              :option_calendar="isDateBeforeTodayAndNotWeekend"
              :required="true"
              :mask="'YYYY-MM-DD'"
              :placeholder="'YYYY-MM-DD'"
              :disabled="createdListData"
              :rules="[
                (v: string) => useRules().is_required(v, 'El campo Fecha es requerido'),
                (v: string) => useRules().date_before_or_equal_to_the_current_date(v),
                (v: string) => useRules().date_is_not_weekend(v)
              ]"
              @update:modelValue="models.date = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericInput
              label="Comprobante"
              :default_value="models.voucher"
              placeholder="-"
              disabled
              :required="true"
              @update:model-value="models.voucher = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericInput
              label="Sub comprobante"
              :default_value="models.sub_voucher"
              :required="false"
              placeholder="-"
              disabled
              @update:model-value="models.sub_voucher = $event"
            />
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import { useRules } from '@/composables'
import useRecordIndividualIncomeFilterForm from '@/components/Forms/Treasury/RecordIndividualIncome/Filters/RecordIndividualIncomeFilterForm'

const props = defineProps<{
  createdListData?: boolean
}>()

defineExpose({
  validateForm: () => filterFormElementRef.value?.validate(),
  clearForm: () => resetForm(),
})

const {
  models,
  filterFormElementRef,
  offices,
  selectOfficeName,
  business_trusts_egreso,
  movement_egreso,
  selectBusinessName,
  selectVouchers,
  isDateBeforeTodayAndNotWeekend,
  resetForm,
} = useRecordIndividualIncomeFilterForm(props)
</script>
