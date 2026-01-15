<template>
  <div>
    <q-form ref="formRef" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-sm">
          <div class="col-12 col-md-3">
            <GenericDateInput
              label="Periodo actual"
              :default_value="formModel.period"
              :required="true"
              placeholder="AAAA-MM"
              mask="YYYY-MM"
              :rules="[fromBusinessRule]"
              @update:model-value="onChangeExecutionPeriod"
            />
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Estructura contable"
              :manual_option="account_structures_accounting_accounts"
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
              :default_value="formModel.from_business_trust"
              :auto_complete="true"
              :clearable="true"
              placeholder="Seleccione"
              :rules="[toBusinessRule]"
              @update:model-value="onChangeFromBusiness"
            />
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Hasta negocio"
              :manual_option="filteredBusinesses"
              :map_options="true"
              :required="true"
              :default_value="formModel.to_business_trust"
              :auto_complete="true"
              :clearable="true"
              placeholder="Seleccione"
              :rules="[toBusinessRule]"
              @update:model-value="onChangeToBusiness"
            />
          </div>
        </div>
      </section>

      <q-separator spaced />

      <div class="row mb-3">
        <section class="q-mt-md col-12 col-md-3">
          <div class="estado-wrapper">
            <div v-if="closureStatus === 'Procesos pendientes'">
              <span class="label text-grey-6">Estado</span>

              <div class="estado-chip bg-grey-2 text-grey-9">
                <div class="box">Con novedades</div>
              </div>
            </div>
            <div v-else-if="closureStatus === 'Proceso exitoso'">
              <span class="label">Estado</span>
              <div class="estado-chip bg-grey-2 text-grey-9">
                <div class="box text-positive text-weight-medium">
                  Proceso exitoso
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <q-separator spaced v-if="closureStatus" />

      <div class="row justify-end q-mt-md">
        <Button
          v-if="closureStatus !== 'Procesos pendientes'"
          label="Cerrar período"
          :outline="false"
          :class-custom="'custom'"
          color="orange"
          @click="onSubmit"
          :disable="isProcessing"
          :loading="isProcessing"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Composables
import usePeriodClosureForm from '@/components/Forms/Accounting/PeriodClosure/Information/v2/PeriodClosureForm'

const {
  formModel,
  formRef,
  account_structures_accounting_accounts,
  filteredBusinesses,
  closureStatus,
  pendingProcesses,
  isProcessing,
  closureData,
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

defineExpose({
  get closureStatus() {
    return closureStatus.value
  },
  get pendingProcesses() {
    return pendingProcesses.value
  },
  get closureData() {
    return closureData.value
  },

  validateForm,
  handleSubmit,
})
</script>
<style lang="scss">
@import './PeriodClosureForm.scss';
</style>
