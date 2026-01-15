<template>
  <q-form ref="SettlementConceptFormRef" class="q-px-lg">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <GenericSelectorComponent
            label="Código concepto de liquidación"
            :default_value="models.settlement_concept_id"
            :manual_option="settlement_concept"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El concepto de liquidación es requerido')]"
            @update:model-value="changeSettlementConcept($event)"
          />
        </div>

        <div class="col-12">
          <GenericInputComponent
            label="Nombre concepto de liquidación"
            type="text"
            :default_value="models.settlement_concept_name"
            :required="false"
            :disabled="true"
          />
        </div>

        <div class="col-12">
          <div class="flex justify-between align-center">
            <p class="text-black-90 text-h7 mt-3">Concepto principal</p>
            <RadioYesNo
              v-model="models.is_main_concept"
              :isDisabled="false"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
            />
          </div>
        </div>
      </div>
    </section>

    <q-separator />
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// interfaces
import { ISettlementConceptsUpdate } from '@/interfaces/customs/accounts-payable/PaymentBlocks'

// logic view
import useSettlementConceptForm from '@/components/Forms/AccountsPayable/PaymentBlocks/SettlementConceptEdit/SettlementConceptForm'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    data?: ISettlementConceptsUpdate
  }>(),
  {}
)

const {
  SettlementConceptFormRef,
  models,

  // selects
  settlement_concept,

  // rules
  is_required,

  // methods
  changeSettlementConcept,
} = useSettlementConceptForm(props, emit)

defineExpose({
  validateForm: () => SettlementConceptFormRef.value?.validate(),
})
</script>
