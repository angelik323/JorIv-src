<template>
  <div>
    <q-form ref="openingReportForm" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-4">
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
          <div class="col-12 col-md-4">
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
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Negocio"
              :manual_option="business_trusts_with_description"
              :map_options="true"
              required
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'El negocio es requerido')]"
              :default_value="models.business_trust_id"
              @update:model-value="models.business_trust_id = $event"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Estructura contable"
              :manual_option="structure_by_business"
              :map_options="true"
              required
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'La estructura es requerida')]"
              :default_value="models.accounting_structure_id"
              @update:model-value="models.accounting_structure_id = $event"
            />
          </div>
          <div class="col-12 col-md-4">
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
          <div class="col-12 col-md-4">
            <GenericDateInput
              v-model="models.date_to"
              label="Saldos a"
              ref="periodRef"
              placeholder="-"
              required
              mask="YYYY-MM-DD"
              default_value=""
              :rules="[(val: string) => useRules().is_required(val, 'El periodo es requerido')]"
            />
          </div>
          <div class="col-12 col-md-4">
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

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Desde cuenta"
              :manual_option="accounting_chart_operative_by_structure"
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

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Hasta cuenta"
              :manual_option="accounting_chart_operative_by_structure"
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

      <div class="col-12 q-mt-md">
        <div class="row items-center">
          <div class="col-12 col-md-10">
            <label class="text-subtitle2 text-bold">Muestra auxiliares</label>
          </div>
          <div class="col-12 col-md-2 flex justify-end items-center">
            <q-option-group
              v-model="showAuxiliaries"
              :options="types_reports"
              type="radio"
              color="orange"
              inline
              left-label
            />
          </div>
        </div>
      </div>

      <q-separator class="q-mb-md" />

      <template v-if="showAuxiliaries === 1">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              label="Desde auxiliar"
              :manual_option="third_parties_by_account_range"
              :map_options="true"
              :required="showAuxiliaries === 1"
              option_label="label"
              display_value="document"
              :auto_complete="true"
              :clearable="false"
              :default_value="models.from_third_party"
              @update:model-value="models.from_third_party = $event"
              :rules="
                showAuxiliaries === 1
                  ? [
                      (val) =>
                        useRules().is_required(
                          val,
                          'Desde auxiliar es requerido'
                        ),
                    ]
                  : []
              "
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              label="Hasta auxiliar"
              :manual_option="third_parties_by_account_range"
              :map_options="true"
              :required="showAuxiliaries === 1"
              option_label="label"
              display_value="document"
              :auto_complete="true"
              :clearable="false"
              :default_value="models.to_third_party"
              @update:model-value="models.to_third_party = $event"
              :rules="
                showAuxiliaries === 1
                  ? [
                      (val) =>
                        useRules().is_required(
                          val,
                          'Hasta auxiliar es requerido'
                        ),
                    ]
                  : []
              "
            />
          </div>
        </div>
      </template>

      <div class="col-12 q-mt-md">
        <div class="row items-center">
          <div class="col-12 col-md-10">
            <label class="text-subtitle2 text-bold"
              >Muestra centro de costos</label
            >
          </div>
          <div class="col-12 col-md-2 flex justify-end items-center">
            <q-option-group
              v-model="showCostCenters"
              :options="types_reports"
              type="radio"
              color="orange"
              inline
              left-label
            />
          </div>
        </div>
      </div>

      <q-separator class="q-mb-md" />

      <template v-if="showCostCenters === 1">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              label="Desde centro de costos"
              :manual_option="cost_centers_by_account_range"
              :map_options="true"
              :required="showCostCenters === 1"
              option_label="label"
              display_value="code"
              :auto_complete="true"
              :clearable="false"
              :default_value="models.from_cost_center"
              @update:model-value="models.from_cost_center = $event"
              :rules="
                showCostCenters === 1
                  ? [
                      (val) =>
                        useRules().is_required(
                          val,
                          'Desde centro de costos es requerido'
                        ),
                    ]
                  : []
              "
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              label="Hasta centro de costos"
              :manual_option="cost_centers_by_account_range"
              :map_options="true"
              :required="showCostCenters === 1"
              option_label="label"
              display_value="code"
              :auto_complete="true"
              :clearable="false"
              :default_value="models.to_cost_center"
              @update:model-value="models.to_cost_center = $event"
              :rules="
                showCostCenters === 1
                  ? [
                      (val) =>
                        useRules().is_required(
                          val,
                          'Hasta centro de costos es requerido'
                        ),
                    ]
                  : []
              "
            />
          </div>
        </div>
      </template>

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
import useDailyBalanceForm from './DailyBalanceForm'
import type { IOpeningRecordModel } from '@/interfaces/customs'
import { useRules } from '@/composables'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import { ActionType } from '@/interfaces/global'
import { types_reports } from '@/constants/resources'
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
  accounting_chart_operative_by_structure,
  structure_levels_report,
  showAuxiliaries,
  showCostCenters,
  third_parties_by_account_range,
  cost_centers_by_account_range,
} = useDailyBalanceForm(props, emits)
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
