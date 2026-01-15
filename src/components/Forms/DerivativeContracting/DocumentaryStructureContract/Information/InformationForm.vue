<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <p class="text-black-10 text-weight-bold text-h6">Datos principales</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo documento contractual"
            :default_value="models.type_id"
            :manual_option="contract_type_id_name"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :disabled="['edit'].includes(action)"
            :rules="[(val: string) => useRules().is_required(val, 'El tipo de documento contractual es requerido')]"
            @update:modelValue="models.type_id = $event"
          />
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <RadioYesNo
            v-model="models.handle_stamp_duty"
            label="¿Maneja impuesto de timbre?"
            :isRadioButton="false"
            :hasTitle="false"
            :hasSubtitle="false"
            :isDisabled="['view'].includes(action)"
            @update:model-value="handleStampDuty($event)"
          />
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div
          v-if="models.handle_stamp_duty"
          class="col-xs-12 col-sm-12 col-md-6"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Unidad de base gravable"
            :default_value="models.taxable_base_unit"
            :manual_option="contract_document_structure_taxable_base_unit"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'La unidad de base gravable es requerida')]"
            @update:modelValue="models.taxable_base_unit = $event"
          />
        </div>

        <div
          v-if="models.handle_stamp_duty"
          class="col-xs-12 col-sm-12 col-md-6"
        >
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            label="Base gravable"
            :hide-icon="true"
            v-model="models.tax_base"
            :currency="'COP'"
            placeholder="-"
            :required="true"
            :rules="[
              (v: string) => useRules().is_required(v, 'La base gravable es requerida'),
              (v: string) => useRules().max_length(v, 15),
            ]"
            @update:model-value="models.tax_base = $event"
          />
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <RadioYesNo
            v-model="models.requires_publication"
            label="¿Requiere publicación?"
            :isRadioButton="false"
            :hasTitle="false"
            :hasSubtitle="false"
            :isDisabled="['view'].includes(action)"
            @update:model-value="handleRequiresPublication($event)"
          />
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div
          v-if="models.requires_publication"
          class="col-xs-12 col-sm-12 col-md-6"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Unidad monto mínimo"
            :default_value="models.minimum_amount_unit"
            :manual_option="contract_document_structure_taxable_base_unit"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'La unidad monto mínimo es requerida')]"
            @update:modelValue="models.minimum_amount_unit = $event"
          />
        </div>

        <div
          v-if="models.requires_publication"
          class="col-xs-12 col-sm-12 col-md-6"
        >
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            label="Monto mínimo"
            :hide-icon="true"
            v-model="models.minimum_amount"
            :currency="'COP'"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El monto mínimo es requerido')]"
            @update:model-value="models.minimum_amount = $event"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6">
          <RadioYesNo
            v-model="models.policy_management"
            label="¿Maneja pólizas?"
            :isRadioButton="false"
            :hasTitle="false"
            :hasSubtitle="false"
            :isDisabled="['view'].includes(action)"
            @update:model-value="models.policy_management = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Composables
import { useRules } from '@/composables'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IDocumentaryStructureContractForm } from '@/interfaces/customs/derivative-contracting/DocumentaryStructureContract'

//Logic form
import useInformationForm from '@/components/Forms/DerivativeContracting/DocumentaryStructureContract/Information/InformationForm'

const emit = defineEmits<{
  (
    e: 'update:basic-data-form',
    value: IDocumentaryStructureContractForm | null
  ): void
  (e: 'update:type-id-changed', value: number | null): void
}>()

const props = withDefaults(
  defineProps<{
    action: ActionType
    basicDataForm?: IDocumentaryStructureContractForm | null
  }>(),
  {}
)

const {
  models,
  formElementRef,
  contract_type_id_name,
  contract_document_structure_taxable_base_unit,

  handleStampDuty,
  handleRequiresPublication,
} = useInformationForm(props, emit)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
