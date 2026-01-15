<template>
  <div>
    <q-form ref="formRef" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-6">
            <GenericDateInput
              label="Periodo de ejecución"
              :default_value="formModel.execution_period"
              :required="true"
              placeholder="AAAA/MM/DD"
              :rules="[fromBusinessRule]"
              @update:model-value="onChangeExecutionPeriod"
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              label="Código de estructura"
              :manual_option="account_structures_with_purpose"
              :map_options="true"
              :required="true"
              :default_value="formModel.accounting_structure_id"
              :auto_complete="true"
              :clearable="true"
              placeholder="Seleccione"
              :rules="[accountingStructureRule]"
              @update:model-value="onChangeStructure"
            />
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Desde negocio"
              :manual_option="filteredBusinesses"
              :map_options="true"
              :required="true"
              :default_value="formModel.from_business_id"
              :auto_complete="true"
              :clearable="true"
              placeholder="Seleccione"
              :rules="[fromBusinessRule]"
              @update:model-value="onChangeFromBusiness"
            />
          </div>

          <div class="col-12 col-md-3">
            <GenericInput
              label="Periodo actual"
              :default_value="formModel.current_period_from"
              placeholder="-"
              disabled
            />
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Hasta negocio"
              :manual_option="filteredBusinesses"
              :map_options="true"
              :required="true"
              :default_value="formModel.to_business_id"
              :auto_complete="true"
              :clearable="true"
              placeholder="Seleccione"
              :rules="[toBusinessRule]"
              @update:model-value="onChangeToBusiness"
            />
          </div>

          <div class="col-12 col-md-3">
            <GenericInput
              label="Periodo actual"
              :default_value="formModel.current_period_to"
              placeholder="-"
              disabled
            />
          </div>
        </div>
      </section>

      <q-separator spaced />

      <div class="row justify-end q-mt-md">
        <Button
          label="Cerrar período"
          :outline="false"
          :class-custom="'custom'"
          color="orange"
          @click="onSubmit"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import usePeriodClosureForm from './PeriodClosureForm'

defineExpose({
  getResult: () => closureStatus,
  validateForm: () => validateForm(),
  handleSubmit: () => handleSubmit(),
})

const {
  formModel,
  formRef,
  account_structures_with_purpose,
  filteredBusinesses,
  closureStatus,
  accountingStructureRule,
  toBusinessRule,
  fromBusinessRule,
  onChangeExecutionPeriod,
  onSubmit,
  onChangeStructure,
  onChangeFromBusiness,
  onChangeToBusiness,
  handleSubmit,
  validateForm,
} = usePeriodClosureForm()
</script>
