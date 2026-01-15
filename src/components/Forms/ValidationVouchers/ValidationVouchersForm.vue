<template>
  <div>
    <q-form ref="validationVouchersForm" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-4">
            <GenericDateInputComponent
              label="Periodo"
              ref="periodRef"
              :required="true"
              :mask="'YYYY-MM'"
              :placeholder="'AAAA-MM'"
              :default_value="models.period_date ?? ''"
              :rules="[(v: string) => useRules().is_required(v, 'El campo periodo es requerido')]"
              :disabled="isEdit"
              @update:model-value="models.period_date = $event"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Estructura contable"
              :manual_option="account_structures_active"
              :map_options="true"
              :required="true"
              :default_value="models.structure.code"
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit"
              @update:modelValue="selectStructure($event)"
              :rules="[(v: string) => useRules().is_required(v, 'El campo estructura contable es requerido')]"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericInput
              label="Nombre de la estructura"
              ref="purposeRef"
              :required="true"
              placeholder="-"
              :default_value="selectedStructure?.purpose ?? ''"
              :rules="[(v: string) => useRules().is_required(v, 'El nombre de la estrctura es requerido')]"
              disabled
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Desde negocio"
              :manual_option="
                business_trusts_with_description_by_account_structure
              "
              :map_options="true"
              :required="true"
              :default_value="models.from_business_trust_id?.business_code"
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit"
              @update:modelValue="selectFromBusiness($event)"
              :rules="[(v: string) => useRules().is_required(v, 'El campo desde negocio es requerido')]"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericInput
              label="Nombre del negocio"
              ref="purposeRef"
              :required="true"
              placeholder="-"
              :default_value="selectedFromBusiness?.business_description ?? ''"
              :rules="[(v: string) => useRules().is_required(v, 'El nombre de la estrctura es requerido')]"
              disabled
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Hasta negocio"
              :manual_option="
                business_trusts_with_description_by_account_structure
              "
              :map_options="true"
              :required="true"
              :default_value="models.to_business_trust_id?.business_code"
              auto_complete
              :clearable="false"
              :disabled="isEdit"
              @update:modelValue="selectToBusiness($event)"
              :rules="[(v: string) => useRules().is_required(v, 'El campo hasta negocio es requerido')]"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericInput
              label="Nombre del negocio"
              ref="purposeRef"
              :required="true"
              placeholder="-"
              :default_value="selectedToBusiness?.business_description ?? ''"
              :rules="[(v: string) => useRules().is_required(v, 'El nombre de la estrctura es requerido')]"
              disabled
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
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import { useRules } from '@/composables'
import { IAccountStructureResponse } from '@/interfaces/customs'
import useValidationVouchersForm from './ValidationVouchersForm'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit'
    data?: IAccountStructureResponse
  }>(),
  {}
)

const emits = defineEmits(['update'])

defineExpose({
  validateForm: () => validationVouchersForm.value?.validate(),
  getFormData: () => models.value,
})

const {
  selectFromBusiness,
  selectToBusiness,
  selectStructure,
  selectedFromBusiness,
  selectedStructure,
  selectedToBusiness,
  account_structures_active,
  business_trusts_with_description_by_account_structure,
  models,
  validationVouchersForm,
  isEdit,
} = useValidationVouchersForm(props)
</script>
