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
              :auto_complete="true"
              required
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
              :manual_option="bussines_parent"
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
              :default_value="models.account_structure_id"
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
              :default_value="models.level"
              @update:model-value="models.level = $event"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericDateInput
              label="Desde período"
              ref="periodRef"
              placeholder="-"
              required
              mask="YYYY-MM"
              :default_value="models.period"
              @update:model-value="models.period = $event"
              :rules="[(val: string) => useRules().is_required(val, 'El período es requerido')]"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericDateInput
              label="Hasta período"
              ref="periodRef"
              placeholder="-"
              required
              mask="YYYY-MM"
              :default_value="models.last_period"
              @update:model-value="models.last_period = $event"
              :rules="[(val: string) => useRules().is_required(val, 'El período es requerido')]"
            />
          </div>

          <div class="col-12 col-md-6">
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

          <div class="col-12 col-md-6">
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
import useConsolidatedBalanceStatementForm from './ConsolidatedBalanceForm'
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

const emits = defineEmits(['enable-preview-tab', 'update'])
defineExpose({
  getFormData: () => models.value,
  validate: async () => {
    const result = await openingReportForm.value?.validate?.()
    return result
  },
})

const {
  structure_levels_report,
  openingReportForm,
  models,
  isEdit,
  isFormValid,
  handleContinue,
  bussines_parent,
  template,
  structure_by_business,
  fullName,
  accounts_by_structure,
} = useConsolidatedBalanceStatementForm(props, emits)
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
