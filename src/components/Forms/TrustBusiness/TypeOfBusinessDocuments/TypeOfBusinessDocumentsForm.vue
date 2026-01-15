<template>
  <q-form ref="formTypeOfBusinessDocuments" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <p
            class="mb-0"
            :class="{
              'text-weight-medium text-grey-6': ['create', 'edit'].includes(
                action
              ),
              'text-weight-bold': ['view'].includes(action),
            }"
          >
            Nombre de negocio{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="data_business_trust_on_create?.name ?? ''"
            type="text"
            placeholder="Nombre del negocio"
            :rules="[(val: string) => useRules().is_required(val, 'El nombre del negocio es requerido')]"
            readonly
          />
          <p v-else class="mb-4">
            {{ data_business_trust_on_create?.name ?? '' }}
          </p>
        </div>
        <div class="col-12 col-md-4">
          <p
            class="mb-0"
            :class="{
              'text-weight-medium text-grey-6': ['create', 'edit'].includes(
                action
              ),
              'text-weight-bold': ['view'].includes(action),
            }"
          >
            Código del documento{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="models.document_code"
            type="text"
            :debounce="500"
            :rules="[
              (val: string) => useRules().is_required(val, 'El campo código del documento es requerido'),
              (val: string) => useRules().max_length(val, 10),
              (val: string) => useRules().custom_rule(validateDocumentCode, 'El código ya se encuentra asociado a otro registro')(val)
            ]"
            :disabled="['edit'].includes(action)"
            @update:modelValue="models.document_code = $event"
          />
          <p v-else class="mb-4">{{ models.document_code }}</p>
        </div>
        <div class="col-12 col-md-4">
          <p
            class="mb-0"
            :class="{
              'text-weight-medium text-grey-6': ['create', 'edit'].includes(
                action
              ),
              'text-weight-bold': ['view'].includes(action),
            }"
          >
            Descripción del documento{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="models.document_description"
            type="text"
            :rules="[
              (val: string) => useRules().is_required(val, 'El campo descripción del documento es requerido'), 
              (val: string) => useRules().max_length(val, 50)
            ]"
            @update:model-value="models.document_description = $event"
          />
          <p v-else class="mb-4">{{ models.document_description }}</p>
        </div>
        <div class="col-12 col-md-4">
          <p
            class="mb-0"
            :class="{
              'text-weight-medium text-grey-6': ['create', 'edit'].includes(
                action
              ),
              'text-weight-bold': ['view'].includes(action),
            }"
          >
            Aplica para{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            required
            :manual_option="business_trust_register_types"
            :map_options="true"
            :default_value="models.apply_for"
            :clearable="false"
            :auto_complete="true"
            :rules="[(val: string) => useRules().is_required(val, 'El campo aplica para es requerido')]"
            @update:modelValue="models.apply_for = $event"
          />
          <p v-else class="mb-4">{{ models.apply_for }}</p>
        </div>
        <div class="col-12 col-md-4">
          <p
            class="mb-0"
            :class="{
              'text-weight-medium text-grey-6': ['create', 'edit'].includes(
                action
              ),
              'text-weight-bold': ['view'].includes(action),
            }"
          >
            Requisito para negocio vigente{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            required
            :manual_option="options_boolean_value"
            :map_options="true"
            :default_value="models.current_business_requirements"
            :clearable="false"
            :auto_complete="true"
            :rules="[(val: boolean) => useRules().is_required_boolean(val, 'El campo aplica para es requerido')]"
            @update:modelValue="models.current_business_requirements = $event"
          />
          <p v-else class="mb-4">
            {{ models.current_business_requirements ? 'Sí' : 'No' }}
          </p>
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
import useTypeOfBusinessDocumentsForm from './TypeOfBusinessDocumentsForm'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import { useRules } from '@/composables'
import { ActionType } from '@/interfaces/global'
import { options_boolean_value } from '@/constants/resources'

const emits = defineEmits(['validate:form'])
const {
  models,
  business_trust_register_types,
  data_business_trust_on_create,
  formTypeOfBusinessDocuments,
  validateDocumentCode,
} = useTypeOfBusinessDocumentsForm()

defineExpose({
  validateForm: () => formTypeOfBusinessDocuments.value?.validate(),
})
</script>
