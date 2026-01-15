<template>
  <div>
    <q-form ref="annualPeriodClosingForm" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Estructura contable"
              :manual_option="structureSelect"
              map_options
              required
              :default_value="models.accounting_structure_id"
              auto_complete
              :clearable="false"
              :disabled="isEdit"
              @update:modelValue="models.accounting_structure_id = $event"
              :rules="[(v: string) => useRules().is_required(v, 'El campo estructura contable es requerido')]"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Desde negocio"
              :manual_option="consolidatorSelect"
              map_options
              required
              :default_value="models.from_business_trust_id"
              auto_complete
              :clearable="false"
              :disabled="isEdit"
              @update:modelValue="models.from_business_trust_id = $event"
              :rules="[(v: string) => useRules().is_required(v, 'El campo desde negocio es requerido')]"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Hasta negocio"
              :manual_option="consolidatorSelect"
              map_options
              required
              :default_value="models.to_business_trust_id"
              auto_complete
              :clearable="false"
              :disabled="isEdit"
              @update:modelValue="models.to_business_trust_id = $event"
              :rules="[(v: string) => useRules().is_required(v, 'El campo hasta negocio es requerido')]"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Desde cuenta"
              :manual_option="operativeByStructureSelect"
              map_options
              required
              :default_value="models.from_account_code"
              auto_complete
              :clearable="false"
              :disabled="isEdit"
              @update:modelValue="models.from_account_code = $event"
              :rules="[(v: string) => useRules().is_required(v, 'El campo desde cuenta es requerido')]"
            />
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Hasta cuenta"
              :manual_option="operativeByStructureSelect"
              map_options
              required
              :default_value="models.to_account_code"
              auto_complete
              :clearable="false"
              :disabled="isEdit"
              @update:modelValue="models.to_account_code = $event"
              :rules="[(v: string) => useRules().is_required(v, 'El campo hasta cuenta es requerido')]"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Desde tercero"
              :manual_option="thirdPartiesSelect"
              map_options
              required
              :default_value="models.from_third_party_id"
              auto_complete
              :clearable="false"
              :disabled="isEdit"
              @update:modelValue="models.from_third_party_id = $event"
              :rules="[(v: string) => useRules().is_required(v, 'El campo desde tercero es requerido')]"
            />
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Hasta tercero"
              :manual_option="thirdPartiesSelect"
              map_options
              required
              :default_value="models.to_third_party_id"
              auto_complete
              :clearable="false"
              :disabled="isEdit"
              @update:modelValue="models.to_third_party_id = $event"
              :rules="[(v: string) => useRules().is_required(v, 'El campo hasta tercero es requerido')]"
            />
          </div>
        </div>
      </section>
      <q-separator spaced />
    </q-form>
  </div>
</template>
<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import useAnnualPeriodClosingForm from './AnnualPeriodClosingForm'
import { IAccountStructureResponse } from '@/interfaces/customs'
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit'
    data?: IAccountStructureResponse
  }>(),
  {}
)

const emits = defineEmits(['update'])

defineExpose({
  validateForm: () => annualPeriodClosingForm.value?.validate(),
  getFormData: () => models.value,
})

const {
  models,
  isEdit,
  structureSelect,
  thirdPartiesSelect,
  consolidatorSelect,
  annualPeriodClosingForm,
  operativeByStructureSelect,
} = useAnnualPeriodClosingForm(props)
</script>
