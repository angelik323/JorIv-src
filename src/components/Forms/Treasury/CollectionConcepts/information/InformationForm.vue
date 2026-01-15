<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-lg mt-1">
          <div class="col-xs-12 col-sm-12 col-md-4">
            <p class="text-weight-medium mb-0 text-grey-6">Estructura*</p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.structure_id"
              :manual_option="account_structures_collection"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :disabled="['edit'].includes(action)"
              :rules="[(val: string) => useRules().is_required(val)]"
              @update:model-value="models.structure_id = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <p class="text-weight-medium mb-0 text-grey-6">
              Nombre estructura*
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="false"
              :default_value="models.structure_name"
              placeholder="-"
              :disabled="true"
              @update:model-value="models.structure_name = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <p class="text-weight-medium mb-0 text-grey-6">Uso*</p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="false"
              :default_value="models.structure_use"
              :placeholder="'-'"
              :disabled="true"
              @update:model-value="models.structure_use = $event"
            />
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="{
              'col-md-4': ['edit'].includes(action),
              'col-md-6': ['create'].includes(action),
            }"
          >
            <p class="text-weight-medium mb-0 text-grey-6">Código*</p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="true"
              :default_value="models.structure_code"
              :placeholder="'Ingrese codigo'"
              :disabled="['edit'].includes(action)"
              :rules="[
                (val: string) => useRules().is_required(val),
                (val: string) => useRules().only_number(val),
                (val: string) => useRules().max_length(val, 16),
              ]"
              @update:model-value="models.structure_code = $event"
            />
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="{
              'col-md-4': ['edit'].includes(action),
              'col-md-6': ['create'].includes(action),
            }"
          >
            <p class="text-weight-medium mb-0 text-grey-6">Tipo*</p>
            <GenericSelectorComponent
              :default_value="models.type"
              :manual_option="collection_concept_type"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => useRules().is_required(val)]"
              :disabled="['edit'].includes(action)"
              @update:model-value="models.type = $event"
            />
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="{
              'col-md-4': ['edit'].includes(action),
              'col-md-6': ['create'].includes(action),
            }"
            v-if="['edit'].includes(action)"
          >
            <p class="text-weight-medium mb-0 text-grey-6">Estado*</p>
            <GenericSelectorComponent
              :default_value="models.status"
              :manual_option="collection_concept_status"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => useRules().is_required(val)]"
              @update:model-value="models.status = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-12">
            <p class="text-weight-medium mb-0 text-grey-6">Descripcíon*</p>
            <GenericInput
              :required="true"
              :default_value="models.description"
              :placeholder="'Ingrese descripcíon'"
              :disabled="false"
              :rules="[
                (val: string) => useRules().is_required(val),
                (val: string) => useRules().max_length(val, 80),
                (val: string) => useRules().no_consecutive_spaces(val),
              ]"
              @update:model-value="models.description = $event"
            />
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import useInformationForm from '@/components/Forms/Treasury/CollectionConcepts/information/InformationForm'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useRules } from '@/composables'
import { ICollectionConceptsResponse } from '@/interfaces/customs'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit'
    data?: ICollectionConceptsResponse
  }>(),
  {}
)

const {
  models,
  formInformation,
  account_structures_collection,
  collection_concept_type,
  collection_concept_status,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
