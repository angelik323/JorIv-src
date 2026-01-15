<template>
  <div>
    <q-form ref="structureTypeForm" class="q-pa-lg">
      <div class="form-section">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-6">
            <GenericInput
              ref="codeRef"
              label="Código*"
              :required="true"
              :disabled="action !== 'create'"
              :default_value="models.code"
              :rules="codeRules"
              @update:model-value="handleCodeInput"
              placeholder="Inserte"
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericInput
              ref="nameRef"
              label="Nombre*"
              :required="true"
              :disabled="isView"
              :default_value="models.name"
              :rules="nameRules"
              @update:model-value="models.name = $event"
              placeholder="Inserte"
            />
          </div>
        </div>
      </div>
      <q-separator spaced />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import { ActionType } from '@/interfaces/global'
import useStructureTypeForm from './StructureTypeForm'
import { IStructureTypeModel } from '@/interfaces/customs'

const props = defineProps<{
  action: ActionType
  data?: IStructureTypeModel
}>()

defineExpose({
  validate: () => structureTypeForm.value?.validate?.(),
  getFormData: () => models.value,
})

const {
  structureTypeForm,
  models,
  isView,
  codeRules,
  nameRules,
  handleCodeInput,
} = useStructureTypeForm(props)
</script>
