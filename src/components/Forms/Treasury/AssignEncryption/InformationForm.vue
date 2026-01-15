<template>
  <div>
    <q-form ref="assignEncryptionForm" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-6">
            <GenericInput
              label="Banco"
              :default_value="models.bank ?? ''"
              :disabled="true"
            />
          </div>
          <div class="col-12 col-md-6">
            <GenericInput
              label="Descripción banco"
              :default_value="models.description ?? ''"
              :disabled="true"
            />
          </div>
          <div class="col-12 col-md-6">
            <GenericInput
              label="Formato"
              :default_value="models.type_format_id ?? ''"
              :disabled="true"
            />
          </div>
          <div class="col-12 col-md-6">
            <GenericInput
              label="Descripción formato"
              :default_value="models.type_format ?? ''"
              :disabled="true"
            />
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col-12">
            <q-checkbox
              v-model="models.apply_encrypt"
              dense
              color="orange"
              label="¿Aplica cifrado?"
            />
          </div>
        </div>

        <div
          v-if="models.apply_encrypt"
          class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-sm"
        >
          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              label="Tipo cifrado"
              v-model="models.type_encrypt"
              :manual_option="typesEncryptOptions"
              :map_options="true"
              :required="true"
              :auto_complete="true"
              :rules="[(val: string) => !!val || 'El tipo es requerido']"
              :default_value="models.type_encrypt"
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericFileInputComponent
              v-model="models.file"
              label="Ruta de la llave"
              required
              :default_value="models.file ?? null"
              @update:model-value="onFileSelected"
            >
              <template #after>
                <Icon name="CloudUpload" :size="24" class="opacity-70" />
              </template>
            </GenericFileInputComponent>
            <div class="file-name">
              <span>
                {{
                  props.data?.path_key && props.data.path_key !== 'N/A'
                    ? props.data.path_key.split('/').pop()
                    : 'N/A'
                }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericFileInputComponent from '@/components/common/GenericFileInputComponent/GenericFileInputComponent.vue'
import Icon from '@/components/common/Icon/Icon.vue'
import { ActionType } from '@/interfaces/global'
import useAssignEncryptionForm from '../AssignEncryption/InformationForm'
import { IAssignEncryptDocument } from '@/interfaces/customs'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IAssignEncryptDocument | null
  }>(),
  {}
)

const emits = defineEmits(['update'])
const {
  models,
  typesEncryptOptions,
  getFormDataForUpdate,
  onFileSelected,
  hasChanges,
} = useAssignEncryptionForm(props)

defineExpose({
  getFormDataForUpdate,
  hasChanges,
})
</script>
<style scoped>
.file-name {
  margin-top: 2px;
  font-size: 0.75rem;
  color: #757575;
}
</style>
