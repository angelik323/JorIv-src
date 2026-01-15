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
              option_label="label"
              option_value="value"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'El título es requerido')]"
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
              :manual_option="business_trusts_basic"
              :map_options="true"
              required
              option_label="label"
              display_value="value"
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
              option_label="label"
              option_value="value"
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'La estructura es requerida')]"
              :default_value="models.account_structure_id"
              @update:model-value="models.account_structure_id = $event"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericDateInput
              label="Desde periodo"
              ref="periodRef"
              placeholder="-"
              required
              mask="YYYY-MM"
              :default_value="models.from_period"
              @update:model-value="(val) => (models.from_period = val)"
              :rules="[(val: string) => useRules().is_required(val, 'El periodo es requerido')]"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericDateInput
              label="Hasta periodo"
              ref="periodRef"
              placeholder="-"
              required
              mask="YYYY-MM"
              :default_value="models.to_period"
              @update:model-value="(val) => (models.to_period = val)"
              :rules="[(val: string) => useRules().is_required(val, 'El periodo es requerido')]"
            />
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Desde comprobante"
              :manual_option="business_trust_receipt_types"
              :map_options="true"
              required
              option_label="name"
              display_value="code"
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'El comprobante es requerida')]"
              :default_value="models.from_receipt_types_id"
              @update:model-value="onChangeFromReceipt"
            />
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Hasta comprobante"
              :manual_option="business_trust_receipt_types"
              :map_options="true"
              required
              option_label="name"
              display_value="code"
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'El comprobante es requerida')]"
              :default_value="models.to_receipt_types_id"
              @update:model-value="onChangeToReceipt"
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
import useDiaryBookForm from './DiaryBookForm'
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
  business_trusts_basic,
  template,
  fullName,
  business_trust_receipt_types,
  structure_by_business,
  onChangeFromReceipt,
  onChangeToReceipt,
} = useDiaryBookForm(props, emits)
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
