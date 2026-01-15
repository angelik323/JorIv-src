<template>
  <q-form ref="basicDataFormRef" class="q-pa-lg">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div
          class="col-12"
          :class="action === 'edit' ? 'col-md-3' : 'col-md-4'"
        >
          <GenericSelectorComponent
            label="Tipo de persona"
            :manual_option="settlement_formula_person_types"
            :map_options="true"
            :default_value="models.person_type"
            required
            @update:model-value="models.person_type = $event"
            :disabled="action === 'edit'"
            :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de persona es requerido'),
            ]"
          />
        </div>
        <div
          class="col-12"
          :class="action === 'edit' ? 'col-md-3' : 'col-md-4'"
        >
          <GenericSelectorComponent
            label="Responsabilidad fiscal"
            :manual_option="fiscal_responsability"
            :map_options="true"
            :default_value="models.fiscal_responsibility"
            required
            @update:model-value="models.fiscal_responsibility = $event"
            :disabled="action === 'edit'"
            :rules="[
              (val: string) => useRules().is_required(val, 'La responsabilidad fiscal es requerida'),
            ]"
          />
        </div>
        <div v-if="action === 'edit'" class="col-12 col-md-3">
          <GenericInputComponent
            label="Codigo de fórmula"
            disabled
            :default_value="models.code"
            required
          />
        </div>
        <div
          class="col-12"
          :class="action === 'edit' ? 'col-md-3' : 'col-md-4'"
        >
          <GenericInputComponent
            label="Nombre de fórmula"
            :default_value="models.name"
            required
            @update:model-value="models.name = $event"
            :rules="[
              (val: string) => useRules().is_required(val, 'El nombre de fórmula es requerido'),
              (val: string) => useRules().max_length(val,100),
              (val: string) => useRules().min_length(val,12),
            ]"
          />
        </div>
      </div>
      <q-separator class="q-my-md" />
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4 q-mt-sm">
          <RadioYesNo
            :is-radio-button="false"
            v-model="models.applies_withholding_tax"
            label="¿Aplica retención en la fuente?"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Concepto de liquidación retención en la fuente"
            :manual_option="withholding_tax_liquidation_concepts"
            :map_options="true"
            :auto_complete="true"
            :default_value="models.withholding_tax_liquidation_concept"
            required
            :disabled="!models.applies_withholding_tax"
            @update:model-value="
              models.withholding_tax_liquidation_concept = $event
            "
            :rules="[
              (val: string) => useRules().is_required(val),
            ]"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Descripción concepto de liquidación retención en la fuente"
            disabled
            :default_value="
              models.withholding_tax_liquidation_concept_description
            "
            required
          />
        </div>
        <div class="col-12 col-md-4 q-mt-sm">
          <RadioYesNo
            :is-radio-button="false"
            v-model="models.applies_vat"
            label="¿Aplica IVA?"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Concepto de liquidación IVA"
            :manual_option="vat_liquidation_concepts"
            :map_options="true"
            :auto_complete="true"
            :default_value="models.vat_liquidation_concept"
            required
            :disabled="!models.applies_vat"
            @update:model-value="models.vat_liquidation_concept = $event"
            :rules="[
              (val: string) => useRules().is_required(val),
            ]"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Descripción concepto de liquidación IVA"
            disabled
            :default_value="models.vat_liquidation_concept_description"
            required
          />
        </div>
        <div class="col-12 col-md-4 q-mt-sm">
          <RadioYesNo
            :is-radio-button="false"
            v-model="models.applies_vat_withholding"
            label="¿Aplica retención de IVA?"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Concepto de liquidación retención de IVA"
            :manual_option="vat_withholding_liquidation_concepts"
            :map_options="true"
            :auto_complete="true"
            :default_value="models.vat_withholding_liquidation_concept"
            required
            :disabled="!models.applies_vat_withholding"
            @update:model-value="
              models.vat_withholding_liquidation_concept = $event
            "
            :rules="[
              (val: string) => useRules().is_required(val),
            ]"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Descripción concepto de liquidación retención de IVA"
            disabled
            :default_value="
              models.vat_withholding_liquidation_concept_description
            "
            required
          />
        </div>
        <div class="col-12 col-md-4 q-mt-sm">
          <RadioYesNo
            :is-radio-button="false"
            v-model="models.applies_ica_withholding"
            label="¿Aplica retención de ICA?"
          />
        </div>
        <div class="col-12 col-md-4 q-mt-sm">
          <RadioYesNo
            :is-radio-button="false"
            v-model="models.applies_territorial_taxes"
            label="¿Aplica impuestos territoriales?"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Concepto de liquidación de impuestos territoriales"
            :manual_option="territorial_taxes_liquidation_concepts"
            :map_options="true"
            :auto_complete="true"
            :default_value="models.territorial_taxes_liquidation_concept"
            required
            :disabled="!models.applies_territorial_taxes"
            @update:model-value="
              models.territorial_taxes_liquidation_concept = $event
            "
            :rules="[
              (val: string) => useRules().is_required(val),
            ]"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Descripción concepto liquidación impuestos territoriales"
            disabled
            :default_value="
              models.territorial_taxes_liquidation_concept_description
            "
            required
          />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
//Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

//Interfaces
import { ISettlementFormulasForm } from '@/interfaces/customs/accounts-payable/SettlementFormulas'
import { ActionType } from '@/interfaces/global/Action'

//Composables
import { useRules } from '@/composables'

//Logic
import useBasicDataForm from '@/components/Forms/AccountsPayable/SettlementFormulas/BasicDataForm'

const props = withDefaults(
  defineProps<{
    data?: ISettlementFormulasForm | null
    action: ActionType
  }>(),
  {}
)

const emits =
  defineEmits<
    (e: 'update:data', value: ISettlementFormulasForm | null) => void
  >()

const {
  basicDataFormRef,
  models,
  settlement_formula_person_types,
  fiscal_responsability,
  withholding_tax_liquidation_concepts,
  vat_liquidation_concepts,
  vat_withholding_liquidation_concepts,
  territorial_taxes_liquidation_concepts,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
