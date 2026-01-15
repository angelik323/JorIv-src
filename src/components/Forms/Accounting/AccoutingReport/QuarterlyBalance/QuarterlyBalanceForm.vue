<template>
  <div>
    <q-form ref="openingReportForm" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <!-- Título de reporte -->
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Título de reporte"
              :manual_option="template"
              :map_options="true"
              :auto_complete="true"
              :required="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[
                (val) =>
                  useRules().is_required(
                    val,
                    'El título del reporte es requerido'
                  ),
              ]"
              :default_value="models.report_template_id ?? ''"
              @update:model-value="models.report_template_id = $event"
            />
          </div>

          <!-- Usuario -->
          <div class="col-12 col-md-3">
            <GenericInputComponent
              label="Usuario"
              :required="true"
              :disabled="true"
              :default_value="fullName ?? ''"
              @update:model-value=""
            />
          </div>

          <!-- Negocio -->
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Negocio"
              :manual_option="business_trusts_with_description"
              :map_options="true"
              :required="true"
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[
                (val) => useRules().is_required(val, 'El negocio es requerido'),
              ]"
              :default_value="models.business_id ?? ''"
              @update:model-value="models.business_id = $event"
            />
          </div>

          <!-- Estructura contable -->
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Estructura contable"
              :manual_option="structure_by_business"
              :map_options="true"
              :required="true"
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[
                (val) =>
                  useRules().is_required(val, 'La estructura es requerida'),
              ]"
              :default_value="models.account_structure_id ?? ''"
              @update:model-value="models.account_structure_id = $event"
            />
          </div>

          <!-- Nivel de cuentas -->
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Nivel de cuentas"
              :manual_option="structure_levels_report"
              :map_options="true"
              :required="true"
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[
                (val) => useRules().is_required(val, 'El nivel es requerido'),
              ]"
              :default_value="models.level ?? ''"
              @update:model-value="models.level = $event"
            />
          </div>

          <!-- Período actual -->
          <div class="col-12 col-md-3">
            <GenericDateInput
              label="Período consultado"
              ref="periodRef"
              placeholder="-"
              :required="true"
              mask="YYYY-MM"
              :rules="[
                (val) => useRules().is_required(val, 'El periodo es requerido'),
                (val) => useRules().valid_format_date(val, 'YYYY-MM'),
                (val) => validateQuarterlyMonth(val),
              ]"
              :default_value="models.period || ''"
              @update:model-value="handleDateSelection"
            />
          </div>

          <!-- Comparable -->
          <div class="col-12 col-md-3">
            <GenericDateInput
              label="Comparable"
              ref="lastPeriodRef"
              placeholder="-"
              :required="true"
              mask="YYYY-MM"
              :rules="[
                (val) =>
                  useRules().is_required(val, 'El comparable es requerido'),
              ]"
              disabled
              :default_value="models.last_period ?? ''"
              @update:model-value="models.last_period = $event"
            />
          </div>

          <!-- Cifras expresadas en -->
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Cifras expresadas en"
              :manual_option="amount_types"
              :map_options="true"
              :required="true"
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[
                (val) => useRules().is_required(val, 'La cifra es requerida'),
              ]"
              :default_value="models.amount_type ?? ''"
              @update:model-value="models.amount_type = $event"
            />
          </div>

          <!-- Desde cuenta -->
          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              label="Desde cuenta"
              :manual_option="accounts_by_structure"
              :map_options="true"
              :required="true"
              option_label="label"
              display_value="code"
              :auto_complete="true"
              :disabled="isEdit || readonly"
              :rules="[
                (val) => useRules().is_required(val, 'La cuenta es requerida'),
              ]"
              :default_value="models.from_account ?? ''"
              @update:model-value="models.from_account = $event"
            />
          </div>

          <!-- Hasta cuenta -->
          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              label="Hasta cuenta"
              :manual_option="accounts_by_structure"
              :map_options="true"
              :required="true"
              option_label="label"
              display_value="code"
              :auto_complete="true"
              :disabled="isEdit || readonly"
              :rules="[
                (val) => useRules().is_required(val, 'La cuenta es requerida'),
              ]"
              :default_value="models.to_account ?? ''"
              @update:model-value="models.to_account = $event"
            />
          </div>
        </div>
      </section>

      <div class="row justify-end q-mt-md">
        <Button
          :outline="false"
          label="Generar"
          size="md"
          unelevated
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="handleContinue"
          :disabled="!isFormValid"
          :styleContent="{
            'place-items': 'center',
            'border-radius': '20px',
            'font-size': '13px',
          }"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

import useQuarterlyBalanceForm from './QuarterlyBalanceForm'
import type { IOpeningRecordModel } from '@/interfaces/customs'
import { useRules } from '@/composables'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IOpeningRecordModel
    readonly?: boolean
  }>(),
  { readonly: false }
)

const emits = defineEmits(['update', 'enable-preview-tab'])

defineExpose({
  getFormData: () => models.value,
  validate: async () => {
    const result = await openingReportForm.value?.validate?.()
    return result
  },
})

const {
  openingReportForm,
  models,
  isEdit,
  isFormValid,
  handleContinue,
  business_trusts_with_description,
  template,
  structure_by_business,
  amount_types,
  fullName,
  accounts_by_structure,
  structure_levels_report,
  handleDateSelection,
  validateQuarterlyMonth,
} = useQuarterlyBalanceForm(props, emits)
</script>

<style lang="scss" scoped>
:deep(.catalog-limit-table) {
  .q-field {
    padding-bottom: 0 !important;
  }
  .q-select .q-field__native {
    min-height: unset;
  }
}
</style>
