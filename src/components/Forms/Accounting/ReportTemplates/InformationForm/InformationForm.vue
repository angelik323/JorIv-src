<template>
  <q-form ref="informationFormRef" aria-label="Formulario de información">
    <section>
      <div class="row flex justify-between q-mb-lg">
        <div class="col">
          <p class="text-weight-bold text-h6 q-mb-none">
            {{ tableProperties.title }}
          </p>
          <p
            v-if="!isView && tabActive === 'signatures'"
            class="text-weight-medium text-grey-6"
          >
            Se permite registrar hasta 6 firmas*
          </p>
        </div>

        <Button
          v-if="!isView && tabActive === 'inventory'"
          no-caps
          unelevated
          label="Agregar"
          :left-icon="defaultIconsLucide.plusCircleOutline"
          color-icon="white"
          text-color="white"
          :outline="false"
          color="primary"
          @click="handleAddRow"
        />
      </div>

      <VCard
        v-if="tableProperties.rows.length === 0 && tabActive === 'inventory'"
      >
        <template #content-card>
          <div
            class="column justify-center items-center q-col-gutter-y-lg q-my-lg"
          >
            <img
              src="@/assets/images/icons/no_data_accounting.svg"
              alt="No hay datos para mostrar"
              width="180px"
            />
            <p
              id="lbl-no-data"
              class="text-weight-bold text-h5 text-center mb-1"
            >
              Actualmente no hay informes
            </p>
            <p
              class="text-weight-medium text-subtitle1 text-center q-pt-none"
              aria-labelledby="lbl-no-data"
            >
              Por favor, agregue uno para continuar con el proceso
            </p>
          </div>
        </template>
      </VCard>

      <div v-if="!isView && tabActive !== 'inventory'" class="q-mt-lg">
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
          @added="handleAddFiles"
          @rejected="handleRejectedFiles"
        />
      </div>

      <VCard v-if="isView || tableProperties.rows.length > 0">
        <template #content-card>
          <div class="q-pa-lg">
            <TableList
              hidePagination
              :loading="tableProperties.loading"
              :rows="tableProperties.rows"
              :columns="tableProperties.columns"
              :custom-columns="[
                'image_path',
                'app_name',
                'entity',
                'code',
                'position',
                'name',
                'code_report',
                'name_report',
                'is_active',
                'actions',
              ]"
            >
              <template #image_path="{ row }">
                <ImageLabel
                  :src="row.image_url"
                  :alt="row.image_name"
                  :label="row.image_name"
                />
              </template>

              <template #app_name="{ row }">
                <GenericInputComponent
                  v-if="!isView"
                  :default_value="row.app_name"
                  placeholder="Inserte"
                  type="text"
                  required
                  :class_name="'q-pb-none'"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'El nombre del aplicativo es requerido.'),
                    (val: string) => useRules().only_alphanumeric(val),
                    (val: string) => useRules().max_length(val, 60),
                  ]"
                  @update:modelValue="row.app_name = $event"
                />
                <p v-else class="text-grey-10 mb-0">
                  {{ row.app_name ?? '-' }}
                </p>
              </template>

              <template #entity="{ row }">
                <GenericInputComponent
                  v-if="!isView"
                  :default_value="row.entity"
                  placeholder="Inserte"
                  type="text"
                  required
                  :class_name="'q-pb-none'"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'El nombre del aplicativo es requerido.'),
                    (val: string) => useRules().only_alphanumeric(val),
                    (val: string) => useRules().max_length(val, 60),
                  ]"
                  @update:modelValue="row.entity = $event"
                />
                <p v-else class="text-grey-10 mb-0">
                  {{ row.entity ?? '-' }}
                </p>
              </template>

              <template #code="{ row }">
                <GenericInputComponent
                  v-if="!isView"
                  :default_value="row.code"
                  type="text"
                  disabled
                  :class_name="'q-pb-none'"
                />
                <p v-else class="text-grey-10 mb-0">
                  {{ row.code ?? '-' }}
                </p>
              </template>

              <template #position="{ row }">
                <GenericInputComponent
                  v-if="!isView"
                  :default_value="row.position"
                  placeholder="Inserte"
                  type="text"
                  required
                  disabled
                  :class_name="'q-pb-none'"
                  @update:modelValue="row.position = $event"
                />
                <p v-else class="text-grey-10 mb-0">
                  {{ row.position ?? '-' }}
                </p>
              </template>

              <template #name="{ row }">
                <GenericInputComponent
                  v-if="!isView"
                  :default_value="row.name"
                  placeholder="Inserte"
                  type="text"
                  required
                  disabled
                  :class_name="'q-pb-none'"
                  @update:modelValue="row.name = $event"
                />
                <p v-else class="text-grey-10 mb-0">
                  {{ row.name ?? '-' }}
                </p>
              </template>

              <template #code_report="{ row }">
                <GenericInputComponent
                  v-if="!isView"
                  :default_value="row.code_report"
                  type="text"
                  disabled
                  :class_name="'q-pb-none'"
                />
                <p v-else class="text-grey-10 mb-0">
                  {{ row.code_report ?? '-' }}
                </p>
              </template>

              <template #name_report="{ row }">
                <GenericInputComponent
                  v-if="!isView"
                  :default_value="row.name_report"
                  placeholder="Inserte"
                  type="text"
                  required
                  :class_name="'q-pb-none'"
                  @update:modelValue="row.name_report = $event"
                />
                <p v-else class="text-grey-10 mb-0">
                  {{ row.name_report ?? '-' }}
                </p>
              </template>

              <template #is_active="{ row }">
                <div class="flex justify-center">
                  <CustomToggle
                    v-if="!isView"
                    :value="isRowActive(row)"
                    :width="100"
                    :height="30"
                    checked-text="Activo"
                    unchecked-text="Inactivo"
                    readonly
                    @click="
                      props.action == 'create'
                        ? (row.is_active = !row.is_active)
                        : !isView && openAlertModal(row)
                    "
                  />
                  <ShowStatus
                    v-else
                    :type="isRowActive(row) ? 1 : 2"
                    :clickable="false"
                  />
                </div>
              </template>

              <template #actions="{ row }">
                <div class="flex justify-center">
                  <Button
                    v-if="row.image_url || props.tabActive === 'signatures'"
                    flat
                    :outline="false"
                    :left-icon="defaultIconsLucide.edit"
                    color-icon="#f45100"
                    :class-custom="'custom'"
                    tooltip="Editar"
                    @click="handleOptions('edit', row.id)"
                  />

                  <Button
                    flat
                    :outline="false"
                    :left-icon="defaultIconsLucide.trash"
                    color-icon="#f45100"
                    :class-custom="'custom'"
                    tooltip="Eliminar"
                    @click="handleOptions('delete', row.id)"
                  />
                </div>
              </template>
            </TableList>
          </div>
        </template>
      </VCard>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :title="alertModalConfig.description"
        @confirm="handleChangeStatus"
      />

      <AlertModalComponent
        ref="imageModalRef"
        styleModal="min-width: 470px"
        :showBtnConfirm="false"
        :showBtnCancel="false"
        :showImgDefault="false"
        :showCloseBtn="true"
      >
        <template #default-body>
          <div class="row q-mx-lg q-col-gutter-md">
            <div class="col-12">
              <ImageLabel
                v-if="!showUpload"
                imageSize="100%"
                :src="selectedRow?.image_url || ''"
                :alt="selectedRow?.image_path || ''"
              />

              <UploadFile
                v-else
                ref="attachDocumentRef"
                :title="uploadProps.title"
                :styles-customs="uploadProps.styleCustom"
                :multiple-files="uploadProps.multiple"
                :label-upload-btn="uploadProps.labelBtn"
                :bordered="uploadProps.bordered"
                :accept="uploadProps.accept"
                :class-name-title="uploadProps.classNameTitle"
                :show-preview="false"
                isModal
                color-icon="orange"
                @added="handleAddFiles"
                @rejected="handleRejectedFiles"
              />
            </div>

            <div class="col-12 text-center q-mt-md">
              <Button
                :outline="false"
                :left-icon="
                  showUpload
                    ? defaultIconsLucide.image
                    : defaultIconsLucide.autorenew
                "
                color-icon="white"
                :label="showUpload ? 'Ver imagen' : 'Actualizar imagen'"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="showUpload = !showUpload"
              />
            </div>
          </div>
        </template>
      </AlertModalComponent>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import ImageLabel from '@/components/common/ImageLabel/ImageLabel.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import { IReportTemplatesRequest } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import { useRules } from '@/composables'

import useInformationForm from './InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    tabActive: string
    data?: IReportTemplatesRequest
  }>(),
  {}
)

const {
  isView,
  logoRows,
  showUpload,
  isRowActive,
  uploadProps,
  selectedRow,
  handleAddRow,
  alertModalRef,
  imageModalRef,
  signatureRows,
  inventoryRows,
  handleOptions,
  openAlertModal,
  handleAddFiles,
  tableProperties,
  alertModalConfig,
  handleChangeStatus,
  defaultIconsLucide,
  informationFormRef,
  handleRejectedFiles,
  isCurrentTableComplete,
} = useInformationForm(props)

defineExpose({
  getDataTables: () => ({
    logo: logoRows.value,
    signatures: signatureRows.value,
    inventory: inventoryRows.value,
  }),
  isCurrentTableComplete,
})
</script>
