<template>
  <q-form ref="basicDataFormRef" class="q-pa-xl">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div
          class="col-12"
          :class="action === 'edit' ? 'col-md-4' : 'col-md-3'"
          v-if="action === 'edit'"
        >
          <GenericInputComponent
            label="Código"
            :default_value="models.code"
            disabled
          />
        </div>
        <div
          class="col-12"
          :class="action === 'edit' ? 'col-md-4' : 'col-md-3'"
        >
          <GenericInputComponent
            label="Nombre del cargo fiscal"
            :default_value="models.name"
            required
            @update:model-value="models.name = $event"
            :rules="[
                (val: string) => useRules().is_required(val, 'El nombre del cargo fiscal es obligatorio'),
                (val: string) => useRules().only_alphanumeric(val),
                (val: string) => useRules().max_length(val, 60),
              ]"
          />
        </div>
        <div
          class="col-12"
          :class="action === 'edit' ? 'col-md-4' : 'col-md-3'"
        >
          <GenericSelectorComponent
            label="Tipo de Tributo"
            :default_value="models.tax_type_id"
            :manual_option="tax_types"
            :map_options="true"
            required
            :disabled="action === 'edit'"
            @update:model-value="models.tax_type_id = $event"
            :rules="[
                (val: string) => useRules().is_required(val, 'El tipo de tributo es obligatorio'),

              ]"
          />
        </div>
        <div
          class="col-12"
          :class="action === 'edit' ? 'col-md-4' : 'col-md-3'"
        >
          <GenericSelectorComponent
            label="Naturaleza del tributo"
            :default_value="models.tax_nature_id"
            :manual_option="tax_natures"
            :map_options="true"
            required
            @update:model-value="models.tax_nature_id = $event"
            :rules="[
                (val: string) => useRules().is_required(val, 'La naturaleza del tributo es obligatoria'),

              ]"
          />
        </div>
        <div
          class="col-12"
          :class="action === 'edit' ? 'col-md-4' : 'col-md-3'"
        >
          <GenericSelectorComponent
            label="Entidad beneficiaria del recaudo"
            :default_value="models.revenue_beneficiary_entity_id"
            :manual_option="revenue_beneficiary_entities"
            :map_options="true"
            required
            @update:model-value="models.revenue_beneficiary_entity_id = $event"
            :rules="[
                (val: string) => useRules().is_required(val, 'La entidad beneficiaria del recaudo obligatoria'),

              ]"
          />
        </div>
        <div
          class="col-12"
          :class="action === 'edit' ? 'col-md-4' : 'col-md-3'"
          v-if="action === 'edit'"
        >
          <GenericSelectorComponent
            label="Estado"
            :default_value="models.status_id ?? 1"
            :manual_option="default_statuses"
            :map_options="true"
            disabled
            :required="false"
            :rules="[]"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
//Componets
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

//Interfaces
import { IFiscalChargeManagementForm } from '@/interfaces/customs/accounts-payable/FiscalChargeManagement'
import { ActionType } from '@/interfaces/global/Action'

//Composables
import { useRules } from '@/composables'

//Logic
import useBasicDataForm from '@/components/Forms/AccountsPayable/FiscalChargeManagement/BasicDataForm'

const props = withDefaults(
  defineProps<{
    data?: IFiscalChargeManagementForm | null
    action: ActionType
  }>(),
  {}
)

const emits =
  defineEmits<
    (e: 'update:data', value: IFiscalChargeManagementForm | null) => void
  >()

const {
  basicDataFormRef,
  models,
  tax_types,
  tax_natures,
  revenue_beneficiary_entities,
  default_statuses,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
