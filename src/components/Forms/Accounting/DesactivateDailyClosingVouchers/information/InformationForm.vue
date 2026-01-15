<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-0 mb-3">
        <div class="row q-col-gutter-lg mt-1">
          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              label="Estructura contable"
              :manual_option="account_structures_active_revert_vouchers"
              :map_options="true"
              :required="true"
              :default_value="models.structure"
              :auto_complete="true"
              @update:modelValue="models.structure = $event"
              :rules="[
                (v: string) =>
                  useRules().is_required(
                    v,
                    'La estructura contable es requerida'
                  ),
              ]"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              label="Desde negocio"
              :manual_option="daily_closing_business_by_account_structure"
              :map_options="true"
              :required="true"
              :default_value="models.from_business_trust_id"
              :auto_complete="true"
              :disabled="!models.structure"
              @update:modelValue="models.from_business_trust_id = $event"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El negocio es requerido'),
              ]"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              label="Hasta negocio"
              :manual_option="daily_closing_business_by_account_structure"
              :map_options="true"
              :required="true"
              :default_value="models.to_business_trust_id"
              :auto_complete="true"
              :disabled="!models.structure"
              @update:modelValue="models.to_business_trust_id = $event"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El negocio es requerido'),
              ]"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericDateInputComponent
              label="Último cierre diario"
              :default_value="models.last_closing_day"
              :rules="[
                (v: string) =>
                  useRules().is_required(
                    v,
                    'El último cierre diario es requerido'
                  ),
              ]"
              :required="true"
              :disabled="true"
              @update:model-value="models.last_closing_day = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericDateInputComponent
              label="Desactualiza saldos a"
              :default_value="models.revert_balances_date"
              :option_calendar="
                useCalendarRules().only_until(models.last_closing_day)
              "
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'La fecha es requerida'),
              ]"
              :required="true"
              @update:model-value="models.revert_balances_date = $event"
            />
          </div>
        </div>
        <q-separator />
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
const emits = defineEmits(['validate:form'])
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import useInformationForm from './InformationForm'
import { useCalendarRules } from '@/composables'

import { useRules } from '@/composables'

const {
  models,
  formInformation,
  account_structures_active_revert_vouchers,
  daily_closing_business_by_account_structure,
} = useInformationForm()

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
