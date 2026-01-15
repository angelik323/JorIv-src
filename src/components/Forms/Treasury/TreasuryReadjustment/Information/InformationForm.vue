<template>
  <q-form ref="informationFormRef">
    <section class="q-mt-md">
      <div class="row items-end q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.from_business_id"
            label="Desde negocio"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.from_business_id"
            :rules="[
              (val: string) =>
                is_required(val, 'El desde negocio es requerido'),
            ]"
            @update:model-value="models.from_business_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Nombre negocio"
            :default_value="modelsLabel.from_business"
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.to_business_id"
            label="Hasta negocio"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.to_business_id"
            :rules="[
              (val: string) =>
                is_required(val, 'El hasta negocio es requerido'),
            ]"
            @update:model-value="models.to_business_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Nombre negocio"
            :default_value="modelsLabel.to_business"
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.from_bank_id"
            label="Desde banco"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.from_bank_id"
            :rules="[
              (val: string) => is_required(val, 'El desde banco es requerido'),
            ]"
            @update:model-value="models.from_bank_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Nombre banco"
            :default_value="modelsLabel.from_bank"
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.to_bank_id"
            label="Hasta banco"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.to_bank_id"
            :rules="[
              (val: string) => is_required(val, 'El hasta banco es requerido'),
            ]"
            @update:model-value="models.to_bank_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Nombre banco"
            :default_value="modelsLabel.to_bank"
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.from_account_id"
            label="Desde cuenta"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.from_account_id"
            :rules="[
              (val: string) => is_required(val, 'El desde cuenta es requerido'),
            ]"
            @update:model-value="models.from_account_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Nombre cuenta"
            :default_value="modelsLabel.from_account"
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.to_account_id"
            label="Hasta cuenta"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.to_account_id"
            :rules="[
              (val: string) => is_required(val, 'El hasta cuenta es requerido'),
            ]"
            @update:model-value="models.to_account_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Nombre cuenta"
            :default_value="modelsLabel.to_account"
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="models.start_date"
            label="Fecha inicial"
            mask="YYYY-MM-DD"
            placeholder="AAAA-MM-DD"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'La fecha inicial es requerida'),
              (val: string) => valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            @update:model-value="models.start_date = $event"
            :navigation_max_year="new Date().getFullYear().toString()"
            :navigation_min_year="'1000/01'"
            :option_calendar="
              ($event) => useUtils().isDateAllowed($event, holidays)
            "
            :onNavigation="handlerHolidays"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="models.end_date"
            label="Fecha final"
            mask="YYYY-MM-DD"
            placeholder="AAAA-MM-DD"
            required
            :rules="[
              (val: string) => is_required(val, 'La fecha final es requerida'),
              (val: string) => valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            @update:model-value="models.end_date = $event"
            :navigation_max_year="new Date().getFullYear().toString()"
            :navigation_min_year="'1000/01'"
            :option_calendar="
              ($event) => useUtils().isDateAllowed($event, holidays)
            "
            :onNavigation="handlerHolidays"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

import { ITreasureReadjustmentForm } from '@/interfaces/customs'
import useInformationForm from '@/components/Forms/Treasury/TreasuryReadjustment/Information/InformationForm'

const props = withDefaults(
  defineProps<{
    data: ITreasureReadjustmentForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
}>()

const {
  informationFormRef,
  models,
  selectOptions,
  modelsLabel,
  holidays,
  is_required,
  valid_format_date,
  useUtils,
  handlerHolidays,
  resetForm,
} = useInformationForm(props, emits)

defineExpose({
  resetForm,
  getValues: () => models.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
