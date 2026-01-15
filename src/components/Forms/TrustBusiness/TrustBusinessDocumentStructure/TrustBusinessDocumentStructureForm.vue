<template>
  <q-form ref="formTrustBusinessDocumentStructure" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Nombre de negocio"
            required
            :default_value="data_business_trust_on_create?.name ?? ''"
            type="text"
            placeholder="Nombre del negocio"
            :rules="[(val: string) => useRules().is_required(val, 'El nombre del negocio es requerido')]"
            readonly
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Nombre de negocio</p>
            <p class="text-weight-medium">
              {{ data_business_trust_on_create?.name ?? '' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código de característica"
            required
            :default_value="models.characteristic_code"
            type="text"
            :debounce="500"
            :rules="[
              (val: string) => useRules().is_required(val, 'El campo código de característica es requerido'), 
              (val: string) => useRules().max_length(val, 10),
              (val: string) => useRules().custom_rule(validateCharacteristicCode, 'El código ya se encuentra asociado a otro registro')(val)
            ]"
            :disabled="['edit'].includes(action)"
            @update:model-value="models.characteristic_code = $event"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Código de característica</p>
            <p class="text-weight-medium">
              {{ models.characteristic_code }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Descripción de característica"
            required
            :default_value="models.description"
            type="text"
            :rules="[
              (val: string) => useRules().is_required(val, 'El campo descripción de característica es requerido'),
              (val: string) => useRules().max_length(val, 100)
            ]"
            @update:modelValue="models.description = $event"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Descripción de característica</p>
            <p class="text-weight-medium">
              {{ models.description }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo dato"
            required
            :manual_option="document_structure_type"
            :map_options="true"
            :default_value="models.type"
            :clearable="false"
            :auto_complete="true"
            :rules="[(val: string) => useRules().is_required(val, 'El campo tipo dato es requerido')]"
            @update:modelValue="models.type = $event"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Tipo dato</p>
            <p class="text-weight-medium">
              {{ models.type }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Obligatoriedad"
            required
            :manual_option="options_boolean_value"
            :map_options="true"
            :default_value="models.is_obligatory"
            :clearable="false"
            :auto_complete="true"
            :rules="[(val: boolean) => useRules().is_required_boolean(val, 'El campo obligatoriedad es requerido')]"
            @update:modelValue="models.is_obligatory = $event"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Obligatoriedad</p>
            <p class="text-weight-medium">
              {{ models.is_obligatory ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Alerta"
            required
            :manual_option="options_boolean_value"
            :map_options="true"
            :default_value="models.alert"
            :clearable="false"
            :auto_complete="true"
            :rules="[(val: boolean) => useRules().is_required_boolean(val, 'El campo alerta es requerido')]"
            @update:modelValue="models.alert = $event"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Alerta</p>
            <p class="text-weight-medium">
              {{ models.alert ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    action: ActionType
  }>(),
  {}
)
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import useTrustBusinessDocumentStructureForm from './TrustBusinessDocumentStructureForm'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import { useRules } from '@/composables'
import { ActionType } from '@/interfaces/global'
import { options_boolean_value } from '@/constants/resources'

const emits = defineEmits(['validate:form'])
const {
  models,
  document_structure_type,
  data_business_trust_on_create,
  formTrustBusinessDocumentStructure,
  validateCharacteristicCode,
  resetForm,
} = useTrustBusinessDocumentStructureForm()

defineExpose({
  validateForm: () => formTrustBusinessDocumentStructure.value?.validate(),
  resetForm,
})
</script>
