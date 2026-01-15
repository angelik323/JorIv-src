<template>
  <q-form ref="areasResponsibilityBasicData" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4 text-black-90">
          <GenericSelectorComponent
            :manual_option="dataAreaStructures"
            map_options
            :label="'Estructura de área'"
            :default_value="models.structure_area_id"
            :disabled="props.action === 'edit'"
            auto_complete
            required
            :rules="[
                (val: string) => is_required(val, 'La estructura de área es requerida'),
              ]"
            @update:model-value="models.structure_area_id = $event"
          />
        </div>
        <div class="col-12 col-md-4 text-black-90">
          <GenericSelectorComponent
            :manual_option="dataCostCenterStructures"
            map_options
            :label="'Estructura de centro de costo'"
            :default_value="models.structure_cost_center_id"
            :disabled="props.action === 'edit'"
            auto_complete
            required
            :rules="[
                (val: string) => is_required(val, 'La estrucura de centro de costo es requerida'),
              ]"
            @update:model-value="selectStructureCostCenter($event)"
          />
        </div>
        <div class="col-12 col-md-4"></div>
        <div class="col-12 col-md-4 text-black-90">
          <GenericInputComponent
            :label="'Codigo'"
            :placeholder="'Inserte'"
            :disabled="props.action === 'edit'"
            required
            :rules="[
                (val: string) => 
                  !!val || 'El código es requerido',
                (val: string) => 
                  max_length(val, 60),
              ]"
            :default_value="models.code ?? ''"
            @update:model-value="models.code = $event"
          />
        </div>
        <div class="col-12 col-md-4 text-black-90">
          <GenericInputComponent
            :label="'Descripción'"
            :placeholder="'Inserte'"
            required
            :rules="[
                (val: string) => 
                  !!val || 'La descripción es requerida',
                (val: string) =>
                  max_length(val, 100),
              ]"
            :default_value="models.description"
            @update:model-value="models.description = $event.toUpperCase()"
          />
        </div>
        <div class="col-12 col-md-4 text-black-90">
          <GenericSelectorComponent
            label="Tipo"
            :default_value="models.type"
            :manual_option="areas_resposabilities_types"
            map_options
            auto_complete
            required
            :rules="[
                (val: string) => 
                  !!val || 'El tipo es requerido',
              ]"
            @update:model-value="models.type = $event"
          />
        </div>
        <div class="col-12 col-md-4 text-black-90">
          <GenericSelectorComponent
            label="Centro de costo"
            :default_value="models.cost_center_id"
            :manual_option="cost_center_active"
            map_options
            auto_complete
            required
            :rules="[
                (val: string) => 
                  !!val || 'El centro de costo es requerido',
              ]"
            @update:model-value="models.cost_center_id = $event"
          />
        </div>
        <div class="col-12 col-md-4 text-black-90">
          <GenericInputComponent
            disabled
            :label="'Descripción'"
            :placeholder="'-'"
            :default_value="selectedCostCenter?.name"
          />
        </div>
        <div class="col-12 col-md-4"></div>
        <div class="col-12 col-md-4 text-black-90">
          <GenericSelectorComponent
            label="Auxiliar"
            :default_value="models.auxiliary_id"
            :manual_option="third_parties"
            map_options
            auto_complete
            :required="false"
            :rules="[]"
            @update:model-value="selectAuxiliary($event)"
          />
        </div>
        <div class="col-12 col-md-4 text-black-90">
          <GenericInputComponent
            disabled
            :label="'Descripción'"
            :placeholder="'-'"
            :default_value="models.auxiliary_description"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data?: IAreasResponsibilityBasicDataResponse | null
    dataAreaStructures?: IResource[]
    dataCostCenterStructures?: IResource[]
  }>(),
  {}
)
const emit = defineEmits(['validate:form'])
// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import BasicDataAreasResponsibility from '@/components/Forms/Budget/AreasResponsibility/BasicDataAreasResponsibility/BasicDataAreasResponsibility'
// Interfaces
import { IResource, WriteActionType } from '@/interfaces/global'
import type { IAreasResponsibilityBasicDataResponse } from '@/interfaces/customs/budget/AreasResponsibility'

const {
  models,
  areasResponsibilityBasicData,
  areas_resposabilities_types,
  cost_center_active,
  third_parties,
  is_required,
  max_length,
  selectStructureCostCenter,
  selectedCostCenter,
  selectAuxiliary,
} = BasicDataAreasResponsibility(props)

defineExpose({
  validateForm: () => areasResponsibilityBasicData.value?.validate(),
})
</script>
