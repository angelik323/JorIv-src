<template>
  <q-form ref="informationFormRef">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="formData.filter.business_trust_id"
            label="Negocio"
            placeholder="Seleccione"
            :manual_option="businessTrusts"
            auto_complete
            map_options
            required
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'El negocio es requerido'),
            ]"
            @update:model-value="formData.filter.business_trust_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.filter.validity"
            label="Vigencia"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'La vigencia es requerida'),
              (val: string) =>
                useRules().min_value(
                  val,
                  2000,
                  'La vigencia no puede ser menor al año 2000'
                ),
              (val: string) => useRules().max_length(val, 4),
              (val: string) => useRules().only_number(val),
            ]"
            @update:model-value="formData.filter.validity = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="formData.filter.budget_level_id"
            label="Nivel"
            placeholder="Seleccione"
            :manual_option="budgetLevels"
            auto_complete
            map_options
            required
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'El nivel es requerido'),
            ]"
            @update:model-value="formData.filter.budget_level_id = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            :default_value="formData.filter.document_from"
            label="Número de documento desde"
            placeholder="Seleccione"
            :manual_option="budgetDocumentNumber"
            auto_complete
            map_options
            required
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'El número de documento desde es requerido'
                ),
            ]"
            @update:model-value="formData.filter.document_from = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            :default_value="formData.filter.document_to"
            label="Número de documento hasta"
            placeholder="Seleccione"
            :manual_option="budgetDocumentNumber"
            auto_complete
            map_options
            required
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'El número de documento hasta es requerido'
                ),
              (val: string) =>
                useRules().min_value(val, formData.filter.document_from),
            ]"
            @update:model-value="formData.filter.document_to = $event"
          />
        </div>

        <div class="col-12">
          <GenericInputComponent
            :default_value="formData.description_society"
            label="Descripción de sociedad"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'La descripción de sociedad es requerida'
                ),
              (val: string) => useRules().no_special_characters_extended(val),
              (val: string) => useRules().max_length(val, 100),
            ]"
            @update:model-value="
              formData.description_society = $event.toUpperCase()
            "
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

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IBudgetAvailabilityCertificateForm } from '@/interfaces/customs/budget/BudgetAvailabilityCertificate'

// Composables
import { useRules } from '@/composables/useRules'

// Logic view
import useInformationForm from '@/components/Forms/Budget/BudgetAvailabilityCertificate/InformationForm/InformationForm'

// Props

const props = defineProps<{
  action: ActionType
  data?: Partial<IBudgetAvailabilityCertificateForm>
}>()

const {
  formData,
  budgetLevels,
  businessTrusts,
  informationFormRef,
  budgetDocumentNumber,
} = useInformationForm(props)

defineExpose({
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
