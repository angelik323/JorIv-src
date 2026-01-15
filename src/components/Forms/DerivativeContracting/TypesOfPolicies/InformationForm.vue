<template>
  <div class="q-pa-md">
    <q-form ref="formElementRef">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <!-- Nombre -->
        <div class="col-12 col-md-6">
          <GenericInputComponent
            ref="nameRef"
            :default_value="form.name"
            label="Nombre tipo póliza"
            placeholder="Inserte"
            required
            :rules="[(v: string) => useRules().is_required(v, 'El nombre es requerido')]"
            @update:model-value="form.name = $event"
          />
        </div>

        <!-- Etapa -->
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            ref="stageRef"
            :default_value="form.stage"
            label="Etapa"
            :manual_option="policyStage"
            auto_complete
            map_options
            required
            :rules="[(v: string) => useRules().is_required(v, 'La etapa es requerida')]"
            @update:model-value="form.stage = $event"
          />
        </div>

        <!-- Estado -->
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="action === 'edit'"
            ref="statusRef"
            :default_value="Number(form.status_id)"
            label="Estado"
            :manual_option="default_statuses"
            auto_complete
            map_options
            required
            :rules="[(v: string) => useRules().is_required(v, 'El estado es requerido')]"
            @update:model-value="form.status_id = $event"
          />
        </div>
      </div>

      <!-- Tabla de riesgos -->
      <section class="q-mt-lg">
        <div class="flex justify-between items-start">
          <p class="text-weight-bold text-h6 no-margin">
            {{ tablePropertiesList.title }}
          </p>

          <Button
            unelevated
            label="Agregar"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            color-icon="white"
            text-color="white"
            :outline="false"
            color="primary"
            @click="handleAddRow"
          />
        </div>

        <TableList
          :loading="tablePropertiesList.loading"
          :columns="tablePropertiesList.columns"
          :visible-columns="visibleColumns"
          :rows="tablePropertiesList.rows"
          :pages="tablePropertiesList.pages"
          :custom-columns="customColumns"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
        
          <!-- Risk -->
          <template #risk="{ row }">
            <div class="cell">
              <GenericSelectorComponent
                :default_value="Number(row.risk_id)" 
                placeholder="Seleccione riesgo"
                auto_complete
                map_options
                :disabled="action === 'edit' && !row.isNew"
                required
                :rules="[(v: string) => useRules().is_required(v, 'El riesgo es requerido')]"
                :manual_option="riskList"  
                @update:model-value="(val) => onRiskChange(row, val)"
                class_name="control-42"
              />
            </div>
          </template>

          <!-- Min -->
          <template #min="{ row }">
            <div class="cell">
              <GenericInputComponent
                :default_value="row.min"
                placeholder="Inserte"
                required
                :rules="[(v: string) => useRules().is_required(v, 'El % mínimo es requerido')]"
                @update:model-value="row.min = $event"
                class_name="control-42"
                disabled
              />
            </div>
          </template>

          <!-- Max -->
          <template #max="{ row }">
            <div class="cell">
              <GenericInputComponent
                :default_value="row.max"
                placeholder="Inserte"
                required
                :rules="[(v: string) => useRules().is_required(v, 'El % máximo es requerido')]"
                @update:model-value="row.max = $event"
                class_name="control-42"
                disabled
              />
            </div>
          </template>

          <!-- Status -->
          <template #status="{ row }">
            <ShowStatus
              :type="row.status?.id ?? 1"
              class-custom="q-px-sm q-py-xs"
            />
          </template>

          <!-- Actions -->
          <template #actions="{ row }">
            <Button
              v-if="!['view'].includes(action)"
              flat
              :outline="false"
              :left-icon="defaultIconsLucide.trash"
              color-icon="#f45100"
              :class-custom="'custom'"
              tooltip="Eliminar"
              @click="handleDeleteRow(row.id)"
            />
          </template>
        </TableList>
      </section>
    </q-form>
  </div>
</template>

<script setup lang="ts">
// Composable
import useTypeOfPolicyInformationForm from './InformationForm'

// Constantes
import { default_statuses } from '@/constants'

// Componentes comunes
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Tipados de props/emit
import type { ActionType } from '@/interfaces/global/Action'
import type { ITypeOfPolicyForm } from '@/interfaces/customs/derivative-contracting/TypesOfPolicy'

// Composables
import { useRules } from '@/composables'
import { IGenericResource, IRiskDefinitionResponse } from '@/interfaces/customs'


const emit = defineEmits<{
  (e: 'update:basic-data-form', value: ITypeOfPolicyForm | null): void
}>()

const props = withDefaults(
  defineProps<{
    action: ActionType
    basicDataForm?: ITypeOfPolicyForm | null
    risks?: IRiskDefinitionResponse[]
    policyStage?: IGenericResource[]
    riskList?: IGenericResource[]
  }>(),
  {}
)

const {
  formElementRef,
  nameRef,
  stageRef,
  statusRef,
  form,
  policyStage,
  riskList,
  tablePropertiesList,
  visibleColumns,
  customColumns,
  handleAddRow,
  handleDeleteRow,
  updatePage,
  updatePerPage,
  onRiskChange,
  defaultIconsLucide,
} = useTypeOfPolicyInformationForm(props, emit)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>

<style scoped>
.cell {
  width: 240px;
  flex: 0 0 240px;
  margin-top: 18px;
}

:deep(.cell .q-field) {
  width: 100%;
  box-sizing: border-box;
}
</style>
