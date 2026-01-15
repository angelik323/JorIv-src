<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <p class="text-black-10 text-weight-bold text-h6">Datos principales</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <!-- Código de riesgo -->
        <div class="col-xs-12 col-sm-12 col-md-4" v-if="['edit'].includes(action)">
          <GenericInputComponent
            :default_value="models.code"
            label="Código de riesgo"
            placeholder="Inserte"
            :required="true"
            :disabled="['edit'].includes(action)"
            :rules="[(v: string) => useRules().is_required(v, 'El código es requerido')]"
            @update:model-value="models.code = $event"
          />
        </div>

        <!-- Nombre -->
        <div
          class="col-xs-12 col-sm-12"
          :class="{
            'col-md-6': action === 'create',
            'col-md-4': action === 'edit'
          }"
        >
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.name"
            label="Nombre del riesgo"
            placeholder="Inserte"
            :required="true"
            :rules="[(v: string) => useRules().is_required(v, 'El nombre es requerido')]"
            @update:model-value="models.name = $event"
          />
        </div>

        <!-- Naturaleza -->
        <div
          class="col-xs-12 col-sm-12"
          :class="{
            'col-md-6': action === 'create',
            'col-md-4': action === 'edit'
          }"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Naturaleza"
            :default_value="models.nature"
            :manual_option="riskNature"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :rules="[(v: string) => useRules().is_required(v, 'La naturaleza es requerida')]"
            @update:model-value="models.nature = $event"
          />
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <!-- % Mínimo -->
        <div
          class="col-xs-12 col-sm-12"
          :class="{
            'col-md-6': action === 'create',
            'col-md-4': action === 'edit'
          }"
        >
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="String(models.minimum_percentage ?? '')"
            label="% Mínimo"
            type="number"
            placeholder="0"
            :required="true"
            :rules="[
              (v: string) => useRules().is_required(v, 'El % mínimo es requerido'),
              (v: string) => !isNaN(Number(v)) || 'Ingrese un número',
              (v: string) => Number(v) >= 0 || 'Debe ser ≥ 0'
            ]"
            additional_characters="."
            @update:model-value="models.minimum_percentage = $event"
          />
        </div>

        <!-- % Máximo -->
        <div
          class="col-xs-12 col-sm-12"
          :class="{
            'col-md-6': action === 'create',
            'col-md-4': action === 'edit'
          }"
        >
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="String(models.maximum_percentage ?? '')"
            label="% Máximo"
            type="number"
            placeholder="0"
            :required="true"
            :rules="[
              (v: string) => useRules().is_required(v, 'El % máximo es requerido'),
              (v: string) => !isNaN(Number(v)) || 'Ingrese un número',
              (v: string) => Number(v) >= Number(models.minimum_percentage || 0) || 'Debe ser ≥ % Mínimo'
            ]"
            additional_characters="."
            @update:model-value="models.maximum_percentage = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Composables
import { useRules } from '@/composables'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IRiskDefinitionForm } from '@/interfaces/customs/derivative-contracting/RiskDefinition'
import { IGenericResource } from '@/interfaces/customs'

// Logic form
import useRiskDefinitionsInformationForm from '@/components/Forms/DerivativeContracting/RiskDefinition/InformationForm'

const emit = defineEmits<{
  (e: 'update:basic-data-form', value: IRiskDefinitionForm | null): void
}>()

const props = withDefaults(
  defineProps<{
    action: ActionType
    basicDataForm?: IRiskDefinitionForm | null
    riskNature?: IGenericResource[]
  }>(),
  {}
)

const {
  models,
  formElementRef,
  riskNature,
} = useRiskDefinitionsInformationForm(props, emit)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
