<template>
  <q-form ref="formInformation" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-end">
        <div class="col-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Nombre del negocio"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="business_trusts"
            :map_options="true"
            :required="true"
            :readonly="['edit', 'view'].includes(action)"
            :default_value="models.business_id"
            @update:modelValue="models.business_id = $event"
            :rules="[(v) => useRules().is_required(v)]"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Código y descripción del documento"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="document_types"
            :map_options="true"
            :required="true"
            :readonly="!models.business_id || ['edit'].includes(action)"
            :default_value="models.document_type_id"
            @update:modelValue="models.document_type_id = $event"
            :rules="[(v) => useRules().is_required(v)]"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Código y descripción del documento
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.document_type_trust ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de creación"
            :default_value="models.date"
            :required="false"
            :disabled="true"
            :rules="[(v) => useRules().valid_format_date(v, 'YYYY-MM-DD')]"
            @update:modelValue="models.date = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de creación</p>
            <p class="text-weight-medium no-margin">
              {{ models.date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de carga / actualización"
            :default_value="models.upload_date"
            :required="false"
            :disabled="true"
            :rules="[(v) => useRules().valid_format_date(v, 'YYYY-MM-DD')]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Fecha de carga / actualización
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.upload_date ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <div v-if="models.business_id && models.document_type_id">
      <div class="mx-3 mt-0 mb-3">
        <TableList
          :title="tableProps.rows.length > 0 ? tableProps.title : ''"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :hideHeader="tableProps.rows.length === 0"
          :custom-columns="['value']"
          @update-page="updatePage"
        >
          <template #value="{ row }">
            <template
              v-if="row.business_trust_document_structure?.type === 'Texto'"
            >
              <GenericInput
                v-if="['create', 'edit'].includes(action)"
                :required="row.business_trust_document_structure.is_obligatory"
                :default_value="row.value"
                @update:modelValue="row.value = $event"
                :rules="
                  row.business_trust_document_structure.is_obligatory
                    ? [
                        (v: string) => useRules().is_required(v),
                        (v: string) => useRules().max_length(v, 2000),
                      ]
                    : [(v: string) => useRules().max_length(v, 2000)]
                "
              />
              <p v-else class="mb-0">{{ row.value ?? 'No registrado' }}</p>
            </template>

            <template
              v-else-if="
                row.business_trust_document_structure?.type === 'Fecha'
              "
            >
              <GenericDateInputComponent
                v-if="['create', 'edit'].includes(action)"
                :required="row.business_trust_document_structure.is_obligatory"
                :default_value="row.value"
                @update:modelValue="row.value = $event"
                :rules="
                  row.business_trust_document_structure.is_obligatory
                    ? [
                        (v: string) => useRules().is_required(v),
                        (v: string) =>
                          useRules().valid_format_date(v, 'YYYY-MM-DD'),
                      ]
                    : [
                        (v: string) =>
                          useRules().valid_format_date(v, 'YYYY-MM-DD'),
                      ]
                "
              />
              <p v-else class="mb-0">{{ row.value ?? 'No registrado' }}</p>
            </template>

            <template
              v-else-if="
                row.business_trust_document_structure?.type === 'Numérico'
              "
            >
              <GenericInput
                v-if="['create', 'edit'].includes(action)"
                type="text"
                :required="row.business_trust_document_structure.is_obligatory"
                :default_value="row.value"
                @update:modelValue="row.value = $event"
                :rules="
                  row.business_trust_document_structure.is_obligatory
                    ? [
                        (v: string) => useRules().is_required(v),
                        (v: string) => useRules().only_number_with_special_chars(v),
                      ]
                    : [(v: string) => useRules().only_number_with_special_chars(v)]
                "
              />
              <p v-else class="mb-0">{{ row.value ?? 'No registrado' }}</p>
            </template>

            <template
              v-else-if="
                row.business_trust_document_structure?.type === 'Alfanumérico'
              "
            >
              <GenericInput
                v-if="['create', 'edit'].includes(action)"
                :required="row.business_trust_document_structure.is_obligatory"
                :default_value="row.value"
                @update:modelValue="row.value = $event"
                :rules="
                  row.business_trust_document_structure.is_obligatory
                    ? [
                        (v: string) => useRules().is_required(v),
                        (v: string) => useRules().only_alphanumeric(v),
                      ]
                    : [(v: string) => useRules().max_length(v, 2000)]
                "
              />
              <p v-else class="mb-0">{{ row.value ?? 'No registrado' }}</p>
            </template>

            <p v-else class="mb-0">{{ row.value ?? 'No registrado' }}</p>
          </template>
        </TableList>
      </div>

      <div
        class="mx-3 mt-1 mb-3"
        v-if="
          !models.file &&
          !['view'].includes(action) &&
          tablePropsUpload.rows.length <= 0
        "
      >
        <template v-if="['create', 'edit'].includes(action)">
          <div class="q-mb-lg">
            <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
              Documentos
            </p>
          </div>

          <UploadFile
            v-if="tablePropsUpload.rows.length === 0"
            ref="attachDocumentRef"
            :title="uploadProps.title"
            :styles-customs="uploadProps.styleCustom"
            :multiple-files="uploadProps.multiple"
            :label-upload-btn="uploadProps.labelBtn"
            :bordered="uploadProps.bordered"
            :accept="uploadProps.accept"
            :class-name-title="uploadProps.classNameTitle"
            :show-preview="false"
            color-icon="orange"
            @added="addedFiles"
            @rejected="rejectedFiles"
          />
        </template>
      </div>

      <div class="mx-3 mt-0 mb-3" v-else>
        <TableList
          :loading="tablePropsUpload.loading"
          :columns="tablePropsUpload.columns"
          :rows="tablePropsUpload.rows"
          :pages="tablePropsUpload.pages"
          :custom-columns="['actions', 'status_id', 'name']"
          :hide-bottom="true"
        >
          <template #name="{ row }">
            <div class="q-pa-md row items-center justify-center">
              <img
                class="image-excel q-mr-sm"
                src="@/assets/images/pdf.svg"
                alt="Pdf Icon"
              />
              {{ row.name }}
            </div>
          </template>

          <template #status_id="{ row }">
            <div class="q-pa-md row items-center justify-center">
              <ShowStatus :type="Number(row?.status_id ?? 20)" />
            </div>
          </template>

          <template #actions="{ row }">
            <Button
              v-if="['edit', 'view'].includes(action)"
              :left-icon="defaultIconsLucide.download"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Descargar"
              @click="handleOptions('download', row)"
            />

            <Button
              v-if="['create', 'edit'].includes(action)"
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="handleOptions('delete', row)"
            />
          </template>
        </TableList>
      </div>
      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :description_message="''"
        @confirm="deleteDocumentSupport()"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
          />
        </template>
      </AlertModalComponent>
    </div>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// logic
import useInformationForm from './InformationForm'

// interfaces
import { IDocumentAssignmentResponse } from '@/interfaces/customs'

// composables
import { useRules } from '@/composables'

import { defaultIconsLucide } from '@/utils'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IDocumentAssignmentResponse | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  models,
  formInformation,
  business_trusts,
  document_types,
  tableProps,
  attachDocumentRef,
  uploadProps,
  tablePropsUpload,
  alertModalConfig,
  alertModalRef,
  hasChanges,
  addedFiles,
  rejectedFiles,
  deleteDocumentSupport,
  updatePage,
  handleOptions,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
  hasChanges: () => hasChanges.value,
})
</script>
