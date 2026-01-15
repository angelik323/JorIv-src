<template>
  <q-form ref="formRef" class="q-pa-lg">
    <section class="row q-col-gutter-x-md q-col-gutter-y-md">
      <div class="col-12 col-md-6">
        <GenericInputComponent
          v-if="props.action !== 'create'"
          label="Tipo de documento"
          placeholder="-"
          :default_value="models.document_type ?? '-'"
          disabled
        />
        <GenericSelectorComponent
          v-else
          required
          auto_complete
          clearable
          :disabled="isDisabled"
          map_options
          label="Tipo de documento"
          :manual_option="budget_document_transfer_type"
          placeholder="Inserte"
          :rules="[
            (val) =>
              useRules().is_required(val, 'El tipo de documento es requerido'),
          ]"
          :default_value="models.budget_document_type_id"
          @update:modelValue="models.budget_document_type_id = $event"
        />
      </div>
      <div v-if="isDisabled" class="col-12 col-md-6">
        <GenericInputComponent
          label="Código"
          placeholder="-"
          :default_value="models.code ?? '-'"
          disabled
        />
      </div>
      <div v-else class="col-12 col-md-6"></div>
      <div class="col-12 col-md-6">
        <GenericSelectorComponent
          required
          auto_complete
          clearable
          :disabled="props.action === 'view'"
          map_options
          label="Desde negocio fuente"
          :manual_option="business_transfer_trusts_selector"
          placeholder="Inserte"
          :rules="[
            (val) =>
              useRules().is_required(val, 'El negocio fuente es requerido'),
          ]"
          :default_value="models.from_business_source_id"
          @update:modelValue="models.from_business_source_id = $event"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericInputComponent
          label="Descripción negocio"
          placeholder="-"
          :default_value="
            getLabel(
              models?.from_business_source_id,
              business_transfer_trusts_selector,
              'value',
              'description'
            )
          "
          disabled
        />
      </div>
      <!-- Hasta negocio fuente -->
      <div class="col-12 col-md-6">
        <GenericSelectorComponent
          required
          auto_complete
          clearable
          :disabled="props.action === 'view'"
          map_options
          label="Hasta negocio fuente"
          :manual_option="business_transfer_trusts_selector"
          placeholder="Inserte"
          :rules="[
            (val) =>
              useRules().is_required(val, 'El negocio fuente es requerido'),
          ]"
          :default_value="models.to_business_source_id"
          @update:modelValue="models.to_business_source_id = $event"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericInputComponent
          label="Descripción negocio"
          placeholder="-"
          :default_value="
            getLabel(
              models?.to_business_source_id,
              business_transfer_trusts_selector,
              'value',
              'description'
            )
          "
          disabled
        />
      </div>
      <!-- Desde negocio destino -->
      <div class="col-12 col-md-6">
        <GenericSelectorComponent
          required
          auto_complete
          clearable
          :disabled="props.action === 'view'"
          map_options
          label="Desde negocio destino"
          :manual_option="business_transfer_trusts_selector"
          placeholder="Inserte"
          :rules="[
            (val) =>
              useRules().is_required(val, 'El negocio destino es requerido'),
          ]"
          :default_value="models.from_business_target_id"
          @update:modelValue="models.from_business_target_id = $event"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericInputComponent
          label="Descripción negocio"
          placeholder="-"
          :default_value="
            getLabel(
              models?.from_business_target_id,
              business_transfer_trusts_selector,
              'value',
              'description'
            )
          "
          disabled
        />
      </div>
      <!-- Hasta negocio destino -->
      <div class="col-12 col-md-6">
        <GenericSelectorComponent
          required
          auto_complete
          clearable
          :disabled="props.action === 'view'"
          map_options
          label="Hasta negocio destino"
          :manual_option="business_transfer_trusts_selector"
          placeholder="Inserte"
          :rules="[
            (val) =>
              useRules().is_required(val, 'El negocio destino es requerido'),
          ]"
          :default_value="models.to_business_target_id"
          @update:modelValue="models.to_business_target_id = $event"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericInputComponent
          label="Descripción negocio"
          placeholder="-"
          :default_value="
            getLabel(
              models?.to_business_target_id,
              business_transfer_trusts_selector,
              'value',
              'description'
            )
          "
          disabled
        />
      </div>
      <!-- one_to_one -->
      <RadioYesNo
        class="q-pl-sm"
        v-model="models.one_to_one"
        :isRadioButton="false"
        :isDisabled="props.action === 'view'"
        label="1a1"
      />
    </section>
  </q-form>
</template>
<script setup lang="ts">
//Core
import { watch } from 'vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
//Interfaces
import type { IBudgetTransferBusinessCreate } from '@/interfaces/customs/budget/BudgetTransferParameter'
import type { ActionType } from '@/interfaces/global/Action'
//Logic view
import useTransferBusinessesForm from '@/components/Forms/Budget/BudgetTransferParameters/TransferBusinesses/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IBudgetTransferBusinessCreate
  }>(),
  {}
)

const {
  formRef,
  models,
  isDisabled,
  budget_document_transfer_type,
  business_transfer_trusts_selector,
  useRules,
  getLabel,
} = useTransferBusinessesForm({ action: props.action, data: props.data })

const emit = defineEmits<{
  documentType: [id: number | string | null]
}>()

watch(
  () => models.value.budget_document_type_id,
  (newVal) => emit('documentType', newVal),
  { immediate: true }
)

defineExpose({
  validateForm: () => formRef.value?.validate(),
  getFormData: () => models.value,
})
</script>
