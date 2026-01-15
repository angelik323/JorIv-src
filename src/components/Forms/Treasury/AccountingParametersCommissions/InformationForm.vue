<template>
  <q-form ref="formElementRef" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <p class="text-black-90 text-weight-bold text-h6">Partida contable</p>
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Cuenta contable"
            :default_value="models.account_chart_id"
            :manual_option="selectOptions.accounting_account_contrapart"
            map_options
            auto_complete
            :required="true"
            :rules="[(val:string) => is_required(val, 'La cuenta contable es requerida')]"
            @update:modelValue="models.account_chart_id = $event"
          />
        </div>

        <div class="col-12">
          <GenericSelectorComponent
            label="Centro de costos"
            :default_value="models.cost_center_id"
            :manual_option="selectOptions.operational_cost_centers"
            map_options
            auto_complete
            :required="true"
            :disabled="selectOptions.operational_cost_centers.length === 0"
            :rules="[(val:string) => is_required(val, 'El centro de costos es requerido')]"
            @update:modelValue="models.cost_center_id = $event"
          />
        </div>

        <div class="col-12 col-md-6 q-pb-md">
          <GenericSelectorComponent
            label="Tipo auxiliar"
            :default_value="models.aux_type"
            :manual_option="selectOptions.aux_type"
            map_options
            auto_complete
            :required="false"
            :rules="[]"
            @update:modelValue="models.aux_type = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Tercero"
            :default_value="models.third_party_id"
            :manual_option="selectOptions.third_parties"
            map_options
            auto_complete
            :required="false"
            :disabled="models.aux_type !== 'Tercero especifico'"
            :rules="[]"
            @update:modelValue="models.third_party_id = $event"
          />
        </div>

        <div class="col-12 col-md-6 q-pb-md">
          <GenericSelectorComponent
            label="Flujo caja"
            :default_value="models.cash_flow_structure_id"
            :manual_option="selectOptions.cash_flow_structures"
            map_options
            auto_complete
            :required="true"
            :disabled="selectOptions.cash_flow_structures.length === 0"
            :rules="[(val:string) => is_required(val, 'El flujo de caja es requerido')]"
            @update:modelValue="models.cash_flow_structure_id = $event"
          />
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <q-separator class="q-my-lg" />
          <p class="text-black-90 text-weight-bold text-h6">
            Contrapartida contable
          </p>
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Cuenta contable"
            :default_value="models.contra_account_chart_id"
            :manual_option="selectOptions.accounting_account_contrapart"
            map_options
            auto_complete
            :required="true"
            :rules="[(val:string) => is_required(val, 'La cuenta contable es requerida')]"
            @update:modelValue="models.contra_account_chart_id = $event"
          />
        </div>

        <div class="col-12">
          <GenericSelectorComponent
            label="Centro de costos"
            :default_value="models.contra_cost_center_id"
            :manual_option="selectOptions.operational_cost_centers"
            map_options
            auto_complete
            :required="true"
            :disabled="selectOptions.operational_cost_centers.length === 0"
            :rules="[(val:string) => is_required(val, 'El centro de costos es requerido')]"
            @update:modelValue="models.contra_cost_center_id = $event"
          />
        </div>

        <div class="col-12 col-md-6 q-pb-md">
          <GenericSelectorComponent
            label="Tipo auxiliar"
            :default_value="models.contra_aux_type"
            :manual_option="selectOptions.aux_type"
            map_options
            auto_complete
            :required="false"
            :rules="[]"
            @update:modelValue="models.contra_aux_type = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Tercero"
            :default_value="models.contra_third_party_id"
            :manual_option="selectOptions.third_parties"
            map_options
            auto_complete
            :required="false"
            :disabled="models.contra_aux_type !== 'Tercero especifico'"
            :rules="[]"
            @update:modelValue="models.contra_third_party_id = $event"
          />
        </div>

        <div class="col-12 col-md-6 q-pb-md">
          <GenericSelectorComponent
            label="Flujo caja"
            :default_value="models.contra_cash_flow_structure_id"
            :manual_option="selectOptions.cash_flow_structures"
            map_options
            auto_complete
            :required="true"
            :disabled="selectOptions.cash_flow_structures.length === 0"
            :rules="[(val:string) => is_required(val, 'El flujo de caja es requerido')]"
            @update:modelValue="models.contra_cash_flow_structure_id = $event"
          />
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <q-separator class="q-my-lg" />
          <p class="text-black-90 text-weight-bold text-h6">
            Presupuesto asociado
          </p>
        </div>

        <div class="col-12 col-md-6 q-pb-md">
          <GenericSelectorComponent
            label="Rubro"
            :default_value="models.budget_item_id"
            :manual_option="selectOptions.budget_item_codes_payment_block"
            map_options
            auto_complete
            :required="false"
            :disabled="dataBlock?.budget_structure == null"
            :rules="[]"
            @update:modelValue="models.budget_item_id = $event"
          />
        </div>

        <div class="col-6"></div>

        <div class="col-12 col-md-6 q-pb-md">
          <GenericSelectorComponent
            label="Área"
            :default_value="models.budget_area_id"
            :manual_option="selectOptions.areas_resposabilities_codes"
            map_options
            auto_complete
            :required="false"
            :disabled="dataBlock?.budget_structure == null"
            :rules="[]"
            @update:modelValue="models.budget_area_id = $event"
          />
        </div>

        <div class="col-12 col-md-6 q-pb-md">
          <GenericSelectorComponent
            label="Recurso"
            :default_value="models.budget_resource_id"
            :manual_option="selectOptions.budget_resource_codes"
            map_options
            auto_complete
            :required="false"
            :disabled="dataBlock?.budget_structure == null"
            :rules="[]"
            @update:modelValue="models.budget_resource_id = $event"
          />
        </div>

        <div class="col-12 col-md-6 q-pb-md">
          <GenericSelectorComponent
            label="Documento presupuestal"
            :default_value="models.budget_document_type_id"
            :manual_option="selectOptions.budget_document_types"
            map_options
            auto_complete
            :required="false"
            :disabled="dataBlock?.budget_structure == null"
            :rules="[]"
            @update:modelValue="models.budget_document_type_id = $event"
          />
        </div>

        <div class="col-12 col-md-6 q-pb-md">
          <GenericSelectorComponent
            label="Movimiento presupuestal"
            :default_value="models.budget_movement_code_id"
            :manual_option="selectOptions.code_movements"
            map_options
            auto_complete
            :required="false"
            :disabled="dataBlock?.budget_structure == null"
            :rules="[]"
            @update:modelValue="models.budget_movement_code_id = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import { ICommissionParametersForm } from '@/interfaces/customs/treasury/CommissionParameters'
import { ICollectionAccountingBlocksResponse } from '@/interfaces/customs/treasury/CollectionAccountingBlocks'

// Logic
import useInformationForm from './InformationForm'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data: ICommissionParametersForm | null
    dataBlock: ICollectionAccountingBlocksResponse | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: ICommissionParametersForm | null): void
}>()

const {
  formElementRef,
  models,
  selectOptions,

  is_required,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
