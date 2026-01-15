<template>
  <q-form ref="formElementRef" @submit.prevent="">
    <div class="row q-mx-xl">
      <div class="col-12">
        <GenericSelectorComponent
          label="Tipo de identificación"
          :auto_complete="false"
          :manual_option="identificationTypes"
          :default_value="formValues.identificationType"
          :required="true"
          :rules="[
            (v) =>
              useRules().is_required(
                v,
                'El tipo de identificación es requerido'
              ),
          ]"
          @update:model-value="formValues.identificationType = $event"
        />
      </div>
      <div class="col-12">
        <GenericInputComponent
          label="Número de identificación"
          :default_value="formValues.identificationNumber"
          :required="true"
          :rules="[
            (v) =>
              useRules().is_required(
                v,
                'El número de identificación es requerido'
              ),
          ]"
          @update:model-value="formValues.identificationNumber = $event"
        />
      </div>
      <div class="col-12">
        <GenericInputComponent
          label="Nombre"
          :default_value="formValues.name"
          :required="true"
          :rules="[(v) => useRules().is_required(v, 'El nombre es requerido')]"
          @update:model-value="formValues.name = $event"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Composables
import { useAddThirdForm } from '@/components/Forms/Sarlaft/OwnList/Forms/v1/AddThirdForm/AddThirdForm'
import { useRules } from '@/composables/useRules'

const {
  formValues,
  identificationTypes,
  formElementRef,
  isValid,
  resetForm,
  validateForm,
} = useAddThirdForm()

defineExpose({
  formValues,
  isValid,
  resetForm,
  validateForm,
})
</script>
