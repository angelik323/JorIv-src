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
              required
              auto_complete
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
              disabled
              :auto_complete="false"
              :clearable="false"
              :default_value="fullName"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              v-model="models.business_trust_id"
              label="Negocio"
              :manual_option="business_trust"
              :map_options="true"
              required
              :auto_complete="true"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'El negocio es requerido')]"
              :default_value="''"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Estructura contable"
              :manual_option="structure_by_business"
              :map_options="true"
              required
              :auto_complete="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'La estructura es requerida')]"
              :default_value="models.account_structure_id"
              @update:model-value="models.account_structure_id = $event"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Nivel de cuentas"
              :manual_option="structure_levels_report"
              :map_options="true"
              required
              :auto_complete="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'El nivel es requerido')]"
              :default_value="models.level"
              @update:model-value="models.level = $event"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericDateInput
              label="Desde periodo"
              ref="periodRef"
              placeholder="AAAA-MM"
              required
              mask="YYYY-MM"
              :default_value="models.from_period"
              @update:model-value="models.from_period = $event"
              :rules="[(val: string) => useRules().is_required(val, 'El periodo es requerido')]"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericDateInput
              label="Hasta periodo"
              ref="periodRef"
              placeholder="AAAA-MM"
              required
              mask="YYYY-MM"
              :default_value="models.to_period"
              @update:model-value="models.to_period = $event"
              :rules="[(val: string) => useRules().is_required(val, 'El periodo es requerido')]"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Desde cuenta"
              :manual_option="accounts_by_structure"
              :map_options="true"
              required
              option_label="label"
              display_value="value"
              auto_complete
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'La cuenta es requerida')]"
              :default_value="models.from_account_id"
              @update:model-value="models.from_account_id = $event"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Hasta cuenta"
              :manual_option="accounts_by_structure"
              :map_options="true"
              required
              option_label="label"
              display_value="value"
              auto_complete
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'La cuenta es requerida')]"
              :default_value="models.to_account_id"
              @update:model-value="models.to_account_id = $event"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Desde auxiliar"
              :manual_option="third_parties"
              :map_options="true"
              required
              :auto_complete="false"
              :disabled="!models.show_auxiliaries"
              :rules="models.show_auxiliaries ? [(val: string) => useRules().is_required(val, 'Auxiliar es requerido')] : []"
              :default_value="models.from_auxiliaries_id"
              @update:model-value="models.from_auxiliaries_id = $event"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Hasta auxiliar"
              :manual_option="third_parties"
              :map_options="true"
              required
              :auto_complete="false"
              :disabled="!models.show_auxiliaries"
              :rules="models.show_auxiliaries ? [(val: string) => useRules().is_required(val, 'Auxiliar es requerido')] : []"
              :default_value="models.to_auxiliaries_id"
              @update:model-value="models.to_auxiliaries_id = $event"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Denominar moneda"
              :manual_option="coins"
              :map_options="false"
              required
              option_label="code"
              option_value="code"
              :auto_complete="false"
              :disabled="isEdit || readonly"
              :rules="[(val: string) => useRules().is_required(val, 'La moneda es requerida')]"
              :default_value="models.rate_code"
              @update:model-value="models.rate_code = $event"
            />
          </div>

          <div class="col-12 col-md-4">
            <RadioYesNo
              v-model="models.show_auxiliaries"
              title="Muestra auxiliares"
              :has-title="true"
              :is-radio-button="true"
              title-radio-true="Sí"
              title-radio-false="No"
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
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useRules } from '@/composables'
import type { IGBTOtherCurrenciesModel } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import useGBTOtherOcurrenciesForm from './GBTOtherCurrenciesForm'
const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IGBTOtherCurrenciesModel
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
  handleContinue,
  business_trust,
  // accountStructureOptions,
  // accountStructureOptionsTemporally,
  template,
  coins,
  fullName,
  accounts_by_structure,
  structure_levels_report,
  third_parties,
  structure_by_business,
} = useGBTOtherOcurrenciesForm(props, emits)
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
