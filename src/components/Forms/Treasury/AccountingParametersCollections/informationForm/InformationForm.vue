<template>
  <q-form ref="formElementRef" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericInput
            label="Codigo de bloque"
            :default_value="infoModels.code"
            disabled
            :rules="[]"
            @update:model-value="infoModels.code = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInput
            label="Nombre de bloque"
            :default_value="infoModels.description"
            disabled
            :rules="[]"
            @update:model-value="infoModels.description = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInput
            label="Estructura recaudo"
            :default_value="infoModels.collection_structure_name"
            disabled
            :rules="[]"
            @update:model-value="infoModels.collection_structure_name = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInput
            label="Estructura contable"
            :default_value="infoModels.accounting_structure_name"
            disabled
            :rules="[]"
            @update:model-value="infoModels.accounting_structure_name = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInput
            label="Estructura de centro de costo"
            :default_value="infoModels.cost_center_structure_name"
            disabled
            :rules="[]"
            @update:model-value="infoModels.cost_center_structure_name = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInput
            label="Estructura presupuesto"
            :default_value="infoModels.budget_structure_name"
            disabled
            :rules="[]"
            @update:model-value="infoModels.budget_structure_name = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInput
            label="Estructura flujo de caja"
            :default_value="infoModels.cash_flow_structure_name"
            disabled
            :rules="[]"
            @update:model-value="infoModels.cash_flow_structure_name = $event"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
          <p class="text-black-90 text-weight-bold text-h6">
            Datos parametros
          </p>
        </div>

        <div class="col-12">
          <GenericSelectorComponent
            label="Código de recaudo"
            :default_value="models.collection_concept_id"
            :manual_option="selectOptions.collection_concepts_codes"
            map_options
            auto_complete
            required
            :disabled="props.action == 'edit'"
            :rules="[(val: string) => is_required(val,  'El código de recaudo es requerido')]"
            @update:modelValue="models.collection_concept_id = $event"
          />
        </div>

        <div class="col-12">
          <GenericInput
            label="Nombre de reacudo"
            :default_value="models.description"
            required
            :disabled="props.action == 'edit'"
            :rules="[
              (val: string) => is_required(val, 'El nombre de recuado es requerido'),
            ]"
            @update:model-value="models.description = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Cuenta contable partida"
            :default_value="models.account_chart_id"
            :manual_option="selectOptions.accounting_account_contrapart"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val,  'Cuenta contable partida requerido')]"
            @update:modelValue="models.account_chart_id = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Centro de costo"
            :default_value="models.cost_center_id"
            :manual_option="selectOptions.operational_cost_centers"
            map_options
            auto_complete
            :required="infoModels.cost_center_structure_name !== ''"
            :disabled="infoModels.cost_center_structure_name == ''"
            :rules="infoModels.cost_center_structure_name !== '' ? [(val: string) => is_required(val,  'Centro de costo es requerido')] : []"
            @update:modelValue="models.cost_center_id = $event"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
          <p class="text-black-90 text-weight-bold text-h6">
            Datos de terceros
          </p>
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Tipo de tercero"
            :default_value="models.third_party_type"
            :manual_option="selectOptions.third_party_types"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val,  'El tipo de tercero es requerido')]"
            @update:modelValue="models.third_party_type = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Tercero"
            :default_value="models.third_party_id"
            :manual_option="selectOptions.third_parties"
            map_options
            auto_complete
            :required="models.third_party_type === 'Específico'"
            :disabled="models.third_party_type !== 'Específico'"
            :rules="[(val: string) => is_required(val,  'El tipo de tercero es requerido')]"
            @update:modelValue="models.third_party_id = $event"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
          <p class="text-black-90 text-weight-bold text-h6">
            Datos presupuestales
          </p>
        </div>

        <div class="col-12">
          <RadioYesNo
            hasTitle
            title="Distribucion % negocio"
            v-model="models.distributes_business_percentage"
            class="q-mt-none"
            :isRadioButton="true"
            :hasSubtitle="false"
            :required="true"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Rubro presupuestal"
            :default_value="models.budget_item_id"
            :manual_option="selectOptions.budget_item_codes_payment_block"
            map_options
            auto_complete
            :required="infoModels.budget_structure_name !== ''"
            :disabled="infoModels.budget_structure_name == ''"
            :rules="[]"
            @update:modelValue="models.budget_item_id = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Area"
            :default_value="models.budget_area_id"
            :manual_option="selectOptions.areas_resposabilities_codes"
            map_options
            auto_complete
            :required="infoModels.budget_structure_name !== ''"
            :disabled="infoModels.budget_structure_name == ''"
            :rules="[]"
            @update:modelValue="models.budget_area_id = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Recurso"
            :default_value="models.budget_resource_id"
            :manual_option="selectOptions.budget_resource_codes"
            map_options
            auto_complete
            :required="infoModels.budget_structure_name !== ''"
            :disabled="infoModels.budget_structure_name == ''"
            :rules="[]"
            @update:modelValue="models.budget_resource_id = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Documento presupuestal"
            :default_value="models.budget_document_type_id"
            :manual_option="selectOptions.budget_document_types"
            map_options
            auto_complete
            :required="infoModels.budget_structure_name !== ''"
            :disabled="infoModels.budget_structure_name == ''"
            :rules="[]"
            @update:modelValue="models.budget_document_type_id = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Codigo de movimiento"
            :default_value="models.budget_movement_code_id"
            :manual_option="selectOptions.code_movements"
            map_options
            auto_complete
            :required="infoModels.budget_structure_name !== ''"
            :disabled="infoModels.budget_structure_name == ''"
            :rules="[]"
            @update:modelValue="models.budget_movement_code_id = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Flujo caja"
            :default_value="models.cash_flow_structure_id"
            :manual_option="selectOptions.cash_flow_structures"
            map_options
            auto_complete
            :required="infoModels.budget_structure_name !== ''"
            :disabled="infoModels.cash_flow_structure_name == ''"
            :rules="infoModels.budget_structure_name !== '' ? [(val: string) => is_required(val,  'El flujo de caja es requerido')] : []"
            @update:modelValue="models.cash_flow_structure_id = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import { IAccountingParametersCollectionsForm } from '@/interfaces/customs/treasury/AccountingParametersCollection'
import { ICollectionAccountingBlocksForm } from '@/interfaces/customs/treasury/CollectionAccountingBlocks'

// Logic
import useInformationForm from './InformationForm'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data: IAccountingParametersCollectionsForm | null
    dataBlock: ICollectionAccountingBlocksForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IAccountingParametersCollectionsForm | null): void
  (e: 'update:dataBlock', value: ICollectionAccountingBlocksForm | null): void
}>()

const { formElementRef, models, infoModels, selectOptions, is_required } =
  useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
