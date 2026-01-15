<template>
  <div>
    <q-form ref="openingReportForm" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              v-model="models.report_template_id"
              label="Título de reporte"
              :manual_option="template"
              :map_options="true"
              required
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'El título del reporte es requerido')]"
              :default_value="''"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericInputComponent
              v-model="fullName"
              label="Usuario"
              :map_options="true"
              required
              disabled
              :auto_complete="true"
              :clearable="false"
              :default_value="fullName"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Negocio"
              :manual_option="business_trust"
              :map_options="true"
              required
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'El negocio es requerido')]"
              :default_value="models.business_id"
              @update:model-value="models.business_id = $event"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Estructura contable"
              :manual_option="structure_by_business"
              :map_options="true"
              required
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'La estructura es requerida')]"
              :default_value="models.account_structure_id || ''"
              @update:model-value="models.account_structure_id = $event"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Nivel de cuentas"
              :manual_option="structure_levels_report"
              :map_options="true"
              required
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'El nivel es requerido')]"
              :default_value="models.level || ''"
              @update:model-value="models.level = $event"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericDateInput
              label="Período actual"
              ref="periodRef"
              placeholder="-"
              required
              mask="YYYY-MM"
              :default_value="models.period"
              @update:modelValue="models.period = $event"
              :rules="[(val: string) => useRules().is_required(val, 'El periodo es requerido')]"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericDateInput
              label="Comparable"
              ref="periodRef"
              placeholder="-"
              required
              mask="YYYY-MM"
              :default_value="models.last_period"
              @update:modelValue="models.last_period = $event"
              :rules="[(val: string) => useRules().is_required(val, 'El comparable es requerido')]"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              v-model="models.amount_type"
              label="Cifras expresadas en"
              :manual_option="amount_types"
              :map_options="true"
              required
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'La cifra es requerida')]"
              :default_value="''"
            />
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Desde cuenta"
              :manual_option="accounts_by_structure"
              :map_options="true"
              required
              option_label="label"
              display_value="code"
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'La cuenta es requerida')]"
              :default_value="models.from_account"
              @update:model-value="models.from_account = $event"
            />
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Hasta cuenta"
              :manual_option="accounts_by_structure"
              :map_options="true"
              required
              option_label="label"
              display_value="code"
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'La cuenta es requerida')]"
              :default_value="models.to_account"
              @update:model-value="models.to_account = $event"
            />
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Desde centro de costos"
              :manual_option="cost_center"
              :map_options="true"
              required
              option_label="label"
              display_value="code"
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'El centro de costos es requerido')]"
              :default_value="models.from_cost_center_id"
              @update:model-value="models.from_cost_center_id = $event"
            />
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Hasta centro de costos"
              :manual_option="cost_center"
              :map_options="true"
              required
              option_label="label"
              display_value="code"
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'El centro de costos es requerido')]"
              :default_value="models.to_cost_center_id"
              @update:model-value="models.to_cost_center_id = $event"
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
import useCostCenterForm from './CostCenterForm'
import type { IOpeningRecordModel } from '@/interfaces/customs'
import { useRules } from '@/composables'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import { ActionType } from '@/interfaces/global'
const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IOpeningRecordModel
    readonly?: boolean
  }>(),
  {
    readonly: false,
  }
)

const emits = defineEmits<{
  (event: 'update'): void
  (event: 'enable-preview-tab'): void
}>()

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
  business_trust,
  template,
  structure_by_business,
  amount_types,
  fullName,
  accounts_by_structure,
  cost_center,
  structure_levels_report,
} = useCostCenterForm(props, emits)
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
