<template>
  <q-form
    role="form"
    ref="basicDataFormRef"
    aria-label="Formulario de datos básicos"
  >
    <section aria-label="Sección de formulario de datos básicos">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información general
        </p>
      </div>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.business_trust_id"
            label="Nombre del negocio"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="equilibrium_points_business_trust"
            :rules="[
              (val: string) => useRules().is_required(val, 'El nombre del negocio es requerido'),
            ]"
            @update:model-value="handleUpdateBusinessTrust"
            v-if="['create'].includes(action)"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Nombre del negocio</p>
            <p class="text-weight-medium">
              {{ balance_point_response?.business_trust.name }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="models.business_status"
            label="Estado del negocio"
            placeholder="-"
            type="text"
            disabled
            required
            v-if="['create'].includes(action)"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Estado del negocio</p>
            <p class="text-weight-medium">
              {{ balance_point_response?.business_trust.status }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.project_id"
            label="Proyecto inmobiliario"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="equilibrium_points_real_estate_project"
            :rules="[
              (val: string) => useRules().is_required(val, 'El nombre del proyecto es requerido'),
            ]"
            @update:model-value="handleUpdateProject"
            v-if="['create'].includes(action)"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Proyecto inmobiliario</p>
            <p class="text-weight-medium">
              {{ balance_point_response?.project.name }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="models.project_status"
            label="Estado del proyecto"
            placeholder="-"
            type="text"
            disabled
            required
            v-if="['create'].includes(action)"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Estado del proyecto</p>
            <p class="text-weight-medium">
              {{ balance_point_response?.project.status }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="models.registration_date"
            label="Fecha de registro"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de registro es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            disabled
            v-if="['create'].includes(action)"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Fecha de registro</p>
            <p class="text-weight-medium">
              {{ balance_point_response?.registration_date }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="models.break_even_status"
            label="Estado punto de equilibrio"
            placeholder="-"
            type="text"
            disabled
            required
            v-if="['create'].includes(action)"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Estado punto de equilibrio</p>
            <p class="text-weight-medium">
              {{ balance_point_response?.status }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            :default_value="models.document_code_id"
            label="Código y descripción del documento"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="characteristic_document"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código y descripción del documento es requerido'),
            ]"
            @update:model-value="handleChangeCharacteristicDocument"
            v-if="['create', 'edit'].includes(action)"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">
              Código y descripción del documento
            </p>
            <p class="text-weight-medium">
              {{
                `${balance_point_response?.document?.document_code} - ${balance_point_response?.document?.document_description}`
              }}
            </p>
          </div>
        </div>
        <div class="col-12">
          <q-separator />
        </div>
      </div>
      <div class="q-my-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Listado de características de documento
        </p>
      </div>
      <VCard>
        <template #content-card>
          <div class="q-mx-md">
            <TableList
              :loading="tableDocumentCharacteristicsProperties.loading"
              :rows="tableDocumentCharacteristicsProperties.rows"
              :columns="tableDocumentCharacteristicsProperties.columns"
              :custom-columns="[
                ['create', 'edit'].includes(action) ? 'detail_information' : '',
              ]"
              dense
              hide-pagination
            >
              <template #detail_information="{ row, index }">
                <GenericInputComponent
                  :default_value="row.detail_information"
                  class_name="mt-5"
                  placeholder="Inserte"
                  type="text"
                  v-if="getTypeDataCharacteristics(index) === 'Texto'"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'La información detallada es requerida'),
                    (val: string) => useRules().only_letters(val),
                  ]"
                  @update:model-value="
                    changeInputCharacteristicDescription(row.id, $event, index)
                  "
                />
                <GenericInputComponent
                  :default_value="row.detail_information"
                  class_name="mt-5"
                  placeholder="Inserte"
                  type="number"
                  v-if="getTypeDataCharacteristics(index) === 'Numérico'"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'La información detallada es requerida'),
                    (val: string) => useRules().only_number(val),
                  ]"
                  @update:model-value="
                    changeInputCharacteristicDescription(row.id, $event, index)
                  "
                />
                <GenericInputComponent
                  :default_value="row.detail_information"
                  class_name="mt-5"
                  placeholder="Inserte"
                  type="textarea"
                  v-if="getTypeDataCharacteristics(index) === 'Lista'"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'La información detallada es requerida'),
                  ]"
                  @update:model-value="
                    changeInputCharacteristicDescription(row.id, $event, index)
                  "
                />
                <GenericInputComponent
                  :default_value="row.detail_information"
                  class_name="mt-5"
                  placeholder="Inserte"
                  type="text"
                  v-if="getTypeDataCharacteristics(index) === 'Alfanumérico'"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'La información detallada es requerida'),
                    (val: string) => useRules().only_alphanumeric(val),
                  ]"
                  @update:model-value="
                    changeInputCharacteristicDescription(row.id, $event, index)
                  "
                />
                <GenericDateInputComponent
                  :default_value="row.detail_information"
                  class_name="mt-5"
                  placeholder="Inserte"
                  v-if="getTypeDataCharacteristics(index) === 'Fecha'"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'La información detallada es requerida'),
                  ]"
                  @update:model-value="
                    changeInputCharacteristicDescription(row.id, $event, index)
                  "
                />
              </template>
            </TableList>
          </div>
        </template>
      </VCard>
      <div class="q-mt-lg q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Documentos
        </p>
        <UploadFile
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
          v-if="['create', 'edit'].includes(action)"
        />
      </div>
      <VCard>
        <template #content-card>
          <div class="q-mx-md">
            <TableList
              :loading="tableDocumentsProperties.loading"
              :rows="tableDocumentsProperties.rows"
              :columns="tableDocumentsProperties.columns"
              :custom-columns="['actions']"
              hide-pagination
              dense
            >
              <template #actions="{ row }">
                <Button
                  v-if="['edit', 'view'].includes(action) && !row.isNew"
                  :left-icon="defaultIconsLucide.download"
                  color="orange"
                  class-custom="custom"
                  :outline="false"
                  flat
                  colorIcon="#f45100"
                  tooltip="Descargar"
                  @click="viewFile(row)"
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
                  @click="removeFile(row)"
                />
              </template>
              <template #custom-no-data>
                <div
                  class="column justify-center items-center q-col-gutter-y-lg q-mt-sm"
                >
                  <img
                    src="@/assets/images/icons/no_data_2.svg"
                    alt="No hay datos para mostrar"
                    width="180px"
                  />
                  <p class="text-weight-bold text-h5 text-center">
                    No hay datos para mostrar
                  </p>
                </div>
              </template>
            </TableList>
          </div>
        </template>
      </VCard>
    </section>
  </q-form>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    action: ActionType
  }>(),
  {}
)

import Button from '@/components/common/Button/Button.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import useBasicDataBalancePointForm from '@/components/Forms/TrustBusiness/BalancePoint/BasicDataBalancePoint/BasicDataBalancePoint'
import TableList from '@/components/table-list/TableList.vue'
import { useRules } from '@/composables'
import { ActionType } from '@/interfaces/global'

const {
  models,
  basicDataFormRef,
  tableDocumentCharacteristicsProperties,
  tableDocumentsProperties,
  uploadProps,
  defaultIconsLucide,
  equilibrium_points_business_trust,
  equilibrium_points_real_estate_project,
  characteristic_document,
  balance_point_response,
  attachDocumentRef,
  addedFiles,
  rejectedFiles,
  removeFile,
  viewFile,
  handleUpdateBusinessTrust,
  handleUpdateProject,
  handleChangeCharacteristicDocument,
  getTypeDataCharacteristics,
  changeInputCharacteristicDescription,
} = useBasicDataBalancePointForm(props)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
