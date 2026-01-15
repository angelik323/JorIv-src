<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información de estructura
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código de estructura documental"
            :manual_option="account_chart_structure_code_accounting"
            :map_options="true"
            :required="true"
            :default_value="models?.structure_id"
            :auto_complete="true"
            :clearable="true"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="models.structure_id = $event"
            :disabled="['edit'].includes(action)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Código de estructura documental
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.structure_id ?? '---' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Estructura"
            :default_value="models.structure"
            :required="false"
            :rules="[]"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estructura</p>
            <p class="text-weight-medium no-margin">
              {{ models.structure ?? '---' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Finalidad"
            :default_value="models.purpose"
            :required="false"
            :rules="[]"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Finalidad</p>
            <p class="text-weight-medium no-margin">
              {{ models.purpose ?? '---' }}
            </p>
          </div>
        </div>
      </div>

      <q-separator class="q-my-lg" />

      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información del código
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Código documental"
            :default_value="models.document_code"
            required
            :rules="[
              (val: string) => useRules().is_required(val),
              (val:string) => useRules().only_number_greater_than_zero(val),
            ]"
            @update:model-value="models.document_code = $event"
            :disabled="['edit'].includes(action)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código documental</p>
            <p class="text-weight-medium no-margin">
              {{ models.document_code ?? '---' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Nombre"
            :default_value="models.name"
            required
            :rules="[
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().only_alphanumeric(val),
              (val: string) => useRules().max_length(val, 60),
            ]"
            @update:model-value="models.name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre</p>
            <p class="text-weight-medium no-margin">
              {{ models.name ?? '---' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo"
            :manual_option="definition_documentation_type"
            :map_options="false"
            :required="true"
            :default_value="models?.type"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="models.type = $event"
            :disabled="['edit'].includes(action)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo</p>
            <p class="text-weight-medium no-margin">
              {{ models.type ?? '---' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Módulo"
            :manual_option="definition_documentation_module"
            :map_options="false"
            :required="true"
            :default_value="models?.module"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="models.module = $event"
            :disabled="isSerieType"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Módulo</p>
            <p class="text-weight-medium no-margin">
              {{ models.module ?? '---' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Proceso"
            :manual_option="definition_documentation_process"
            :map_options="false"
            :required="true"
            :default_value="models?.process"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="models.process = $event"
            :disabled="isSerieType"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Proceso</p>
            <p class="text-weight-medium no-margin">
              {{ models.process ?? '---' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Soporte"
            :manual_option="definition_documentation_support"
            :map_options="false"
            :required="true"
            :default_value="models?.support"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="models.support = $event"
            :disabled="isSerieType"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Soporte</p>
            <p class="text-weight-medium no-margin">
              {{ models.support ?? '---' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Obligatoriedad"
            :manual_option="definition_documentation_mandatory"
            :map_options="false"
            :required="true"
            :default_value="models?.mandatory"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="models.mandatory = $event"
            :disabled="isSerieType"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Obligatoriedad</p>
            <p class="text-weight-medium no-margin">
              {{ models.mandatory ?? '---' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Retención archivo general"
            :manual_option="definition_documentation_file_retention"
            :map_options="false"
            :required="true"
            :default_value="models?.general_file_retention"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="models.general_file_retention = $event"
            :disabled="isSerieType"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Retención archivo general</p>
            <p class="text-weight-medium no-margin">
              {{ models.general_file_retention ?? '---' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Disposición final"
            :manual_option="definition_documentation_final_provision"
            :map_options="false"
            :required="true"
            :default_value="models?.final_provision"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="models.final_provision = $event"
            :disabled="isSerieType"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Disposición final</p>
            <p class="text-weight-medium no-margin">
              {{ models.final_provision ?? '---' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { IDefinitionSupportingDocumentsForm } from '@/interfaces/customs'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import useBasicDataForm from '@/components/Forms/DerivativeContracting/DefinitionSupportingDocuments/BasicData'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { ActionType } from '@/interfaces/global'
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IDefinitionSupportingDocumentsForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IDefinitionSupportingDocumentsForm | null): void
}>()

const {
  formElementRef,
  models,
  isSerieType,
  account_chart_structure_code_accounting,
  definition_documentation_type,
  definition_documentation_module,
  definition_documentation_process,
  definition_documentation_support,
  definition_documentation_mandatory,
  definition_documentation_file_retention,
  definition_documentation_final_provision,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
