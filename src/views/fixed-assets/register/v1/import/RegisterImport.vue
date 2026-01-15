<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsImport.title"
      :breadcrumbs="headerPropsImport.breadcrumbs"
      show-back-btn
      @on-back="goToList"
    >
      <template #addAfter>
        <Button
          v-if="showDownloadTemplateBtn"
          no-caps
          outline
          :class-custom="headerPropsImport.btn.class"
          :label="headerPropsImport.btn.label"
          color="orange"
          :styleContent="{
            'place-items': 'center',
            color: 'black',
          }"
          :text-color="headerPropsImport.btn.color"
          :left-img="headerPropsImport.btn.icon"
          @click="handleDownloadTemplate"
        />
      </template>

      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
      />

      <VCard>
        <template #content-card>
          <div class="q-pa-lg">
            <!-- Tab: Datos básicos (Cargue de archivo) -->
            <section v-show="isInformationTab">
              <UploadFile
                v-if="files.length === 0"
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
                @added="handleAddFile"
              />

              <TableList
                v-else
                :title="tableProps.title"
                :loading="tableProps.loading || validatingFiles"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :pages="tableProps.pages"
                :custom-columns="['status', 'actions']"
                :hide-pagination="true"
              >
                <template #status="{ row }">
                  <ShowStatus
                    statusType="fixedAssets"
                    :type="Number(row.status_id) ?? 68"
                  />
                </template>

                <template #actions="{ row }">
                  <Button
                    v-if="row.status_id === 66 && row.size > 0"
                    :left-icon="defaultIconsLucide.download"
                    tooltip="Reporte errores"
                    color="orange"
                    :outline="false"
                    flat
                    :class-custom="'custom'"
                    @click="handleDownloadErrors"
                  />

                  <Button
                    v-if="row.status_id === 66 && hasDownloadedErrors"
                    :left-icon="defaultIconsLucide.refreshCw"
                    tooltip="Actualizar"
                    color="orange"
                    :disabled="validatingFiles"
                    :outline="false"
                    flat
                    :class-custom="'custom'"
                    @click="triggerFileInput"
                  />

                  <input
                    id="file-input-update"
                    type="file"
                    accept=".xlsx"
                    style="display: none"
                    @change="handleUpdateFile"
                  />

                  <Button
                    :left-icon="defaultIconsLucide.trash"
                    tooltip="Eliminar"
                    color="orange"
                    :outline="false"
                    flat
                    :class-custom="'custom'"
                    @click="openAlertModal('eliminar_archivo')"
                  />
                </template>
              </TableList>
            </section>

            <!-- Tab: Documentos -->
            <section v-show="isDocumentsTab">
              <TableList
                :title="tablePreviewProps.title"
                :loading="tablePreviewProps.loading"
                :columns="tablePreviewProps.columns as any"
                :rows="tablePreviewProps.rows"
                :pages="tablePreviewProps.pages"
                :custom-columns="['documents']"
                :hide-pagination="true"
              >
                <template #documents="{ row, index }">
                  <Button
                    :left-icon="defaultIconsLucide.file"
                    color="orange"
                    class-custom="custom"
                    colorIcon="#f45100"
                    flat
                    :outline="false"
                    :tooltip="
                      row.document_ids && row.document_ids.length > 0
                        ? `${row.document_ids.length} documento(s) cargado(s)`
                        : 'Cargar documentos'
                    "
                    @click="openDocumentsModal(row, index)"
                  />
                </template>
              </TableList>
            </section>

            <!-- Botones de navegación -->
            <div class="row justify-end q-gutter-md q-mt-lg">
              <!-- Botón Cancelar -->
              <Button
                v-if="isInformationTab && files.length > 0"
                color="orange"
                label="Cancelar"
                class-custom="custom"
                no-caps
                outline
                :styleContent="{
                  'place-items': 'center',
                  color: 'black',
                }"
                @click="handleClearFile"
              />

              <!-- Botón Atrás -->
              <Button
                v-if="isDocumentsTab"
                label="Atrás"
                size="md"
                unelevated
                outline
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="backTab"
              />

              <!-- Botón Continuar -->
              <Button
                v-if="isInformationTab && files.length > 0"
                label="Continuar"
                :right-icon="defaultIconsLucide.next"
                color-icon="#fff"
                :disabled="validatingFiles"
                size="md"
                unelevated
                :outline="false"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="handleConfirm"
              />

              <!-- Botón Crear -->
              <Button
                v-if="isDocumentsTab"
                label="Crear"
                size="md"
                unelevated
                :outline="false"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="handleCreate"
              />
            </div>
          </div>
        </template>
      </VCard>
    </ContentComponent>

    <!-- Modal de confirmación para eliminar archivo -->
    <AlertModalComponent
      ref="deleteModalRef"
      :title="alertModalConfig.title"
      :description_message="alertModalConfig.description"
      @confirm="handleDeleteFile"
    />

    <!-- Modal de confirmación para cargo parcial / errores -->
    <AlertModalComponent
      ref="confirmModalRef"
      :title="alertModalConfig.title"
      :description_message="alertModalConfig.description"
      @confirm="handleConfirmModal"
    />

    <!-- Modal de documentos por fila -->
    <ModalComponent
      v-model:open-dialog="showDocumentsModal"
      title="Documentos"
      :persistent="true"
      min-width="800px"
    >
      <template #content-modal>
        <DocumentsForm
          v-if="currentRowForDocuments"
          ref="documentsFormRef"
          action="create"
          :initial-documents="initialDocumentsForModal"
          @update:models="setDocumentsFormData"
        />

        <div class="row justify-end q-gutter-sm full-width q-mt-md">
          <div class="col-auto">
            <Button
              label="Cancelar"
              color="grey-7"
              unelevated
              :outline="true"
              class="text-capitalize"
              @click="handleCancelDocuments"
            />
          </div>
          <div class="col-auto">
            <Button
              label="Guardar"
              color="positive"
              unelevated
              :outline="false"
              class="text-capitalize"
              @click="handleSaveDocuments"
            />
          </div>
        </div>
      </template>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import ModalComponent from '@/components/common/Modal/ModalComponent.vue'
import DocumentsForm from '@/components/Forms/FixedAssets/Register/DocumentsForm/DocumentsForm.vue'

// logic view
import useRegisterImport from '@/views/fixed-assets/register/v1/import/RegisterImport'

const {
  // Header & Tabs
  headerPropsImport,
  tabs,
  tabActive,
  tabActiveIdx,
  isInformationTab,
  isDocumentsTab,

  // Icons
  defaultIconsLucide,

  // Estado de archivos
  files,
  validatingFiles,
  hasDownloadedErrors,
  showDownloadTemplateBtn,

  // Tables
  tableProps,
  tablePreviewProps,
  uploadProps,

  // Modals
  deleteModalRef,
  confirmModalRef,
  alertModalConfig,
  showDocumentsModal,
  documentsFormRef,
  currentRowForDocuments,

  // Documents
  setDocumentsFormData,
  initialDocumentsForModal,

  // Métodos
  handleDownloadTemplate,
  handleAddFile,
  handleDownloadErrors,
  handleUpdateFile,
  triggerFileInput,
  handleClearFile,
  handleDeleteFile,
  handleConfirm,
  handleCreate,
  backTab,
  openAlertModal,
  handleConfirmModal,
  openDocumentsModal,
  handleSaveDocuments,
  handleCancelDocuments,
  goToList,
} = useRegisterImport()
</script>
