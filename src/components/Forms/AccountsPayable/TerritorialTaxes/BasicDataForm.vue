<template>
  <q-form ref="basicDataFormRef" class="q-pa-xl">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Concepto de liquidación"
            :default_value="models.settlement_concept_id"
            :manual_option="settlement_concepts"
            :map_options="true"
            :required="true"
            :rules="[(val: string) => is_required(val, 'El concepto de liquidación es requerido')]"
            :disabled="isEditMode"
            placeholder="Seleccione"
            @update:model-value="models.settlement_concept_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            label="Descripción concepto de liquidación"
            :default_value="models.liquidation_concept_description"
            disabled
            placeholder="-"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Ciudad"
            :default_value="models.city_id"
            :manual_option="cities"
            :map_options="true"
            :required="true"
            :rules="[(val: string) => is_required(val, 'La ciudad es requerida')]"
            placeholder="Seleccione"
            @update:model-value="models.city_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            label="Descripción ciudad"
            :default_value="models.city_description"
            disabled
            placeholder="-"
          />
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Beneficiario"
            :default_value="models.third_party_id"
            :manual_option="third_parties"
            :map_options="true"
            :required="true"
            :rules="[(val: string) => is_required(val, 'El beneficiario es requerido')]"
            placeholder="Seleccione"
            @update:model-value="models.third_party_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            label="Descripción beneficiario"
            :default_value="models.beneficiary_description"
            disabled
            placeholder="-"
          />
        </div>

        <div v-if="isEditMode" class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Estado"
            :default_value="models.status_id"
            :manual_option="ica_activity_statuses"
            :map_options="true"
            :required="true"
            :rules="[(val: string) => is_required(val, 'El estado es requerido')]"
            placeholder="Seleccione"
            @update:model-value="models.status_id = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Logic
import useBasicDataForm from '@/components/Forms/AccountsPayable/TerritorialTaxes/BasicDataForm'

// Interfaces de props
import { ITerritorialTaxesItem } from '@/interfaces/customs/accounts-payable/TerritorialTaxes'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    data?: ITerritorialTaxesItem | null
    action: ActionType
  }>(),
  { action: 'create' as ActionType }
)

const {
  basicDataFormRef,
  models,
  settlement_concepts,
  cities,
  third_parties,
  ica_activity_statuses,
  isEditMode,

  // rules
  is_required,
} = useBasicDataForm(props)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate?.(),
})
</script>