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
          <section v-if="!showValidatedRowsPreview" class="q-pa-md">
            <section>
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
                :loading="tableProps.loading"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :pages="tableProps.pages"
                :custom-columns="['status', 'actions']"
                :hide-bottom="true"
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
                    tooltip="Reporte errores"
                    color="orange"
                    :outline="false"
                    :left-icon="defaultIconsLucide.download"
                    :flat="true"
                    :class-custom="'custom'"
                    @click="handleDownloadErrors"
                  />

                  <Button
                    v-if="hasDownloadedErrors && row.status_id === 66"
                    tooltip="Actualizar"
                    color="orange"
                    :disabled="validatingFiles"
                    :outline="false"
                    :left-icon="defaultIconsLucide.upload"
                    :flat="true"
                    :class-custom="'custom'"
                    @click="triggerFileInput"
                  />
                  <input
                    ref="updateFileInputRef"
                    type="file"
                    accept=".xlsx"
                    style="display: none"
                    @change="handleUpdateFile"
                  />

                  <Button
                    tooltip="Eliminar"
                    color="orange"
                    :outline="false"
                    :left-icon="defaultIconsLucide.trash"
                    :flat="true"
                    :class-custom="'custom'"
                    @click="openAlertModal('eliminar_archivo')"
                  />
                </template>
              </TableList>
            </section>
            <section v-if="files.length != 0" class="mx-2 mb-2">
              <div class="q-mt-lg flex q-gutter-x-md justify-end">
                <Button
                  color="orange"
                  label="Cancelar"
                  class-custom="custom"
                  no-caps
                  outline
                  :styleContent="{
                    'place-items': 'center',
                    color: 'black',
                  }"
                  :text-color="headerPropsImport.btn.color"
                  @click="handleClearFile"
                />
                <Button
                  label="Cargar"
                  :disabled="validatingFiles"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleConfirm"
                />
              </div>
            </section>
          </section>
          <section v-else class="q-pa-md">
            <TableList
              :title="tablePreviewProps.title"
              :loading="tablePreviewProps.loading"
              :columns="tablePreviewProps.columns"
              :rows="visiblePreviewRows"
              :pages="tablePreviewProps.pages"
              :custom-columns="['id']"
              @update-page="updatePreviewPage"
              @update-rows-per-page="updatePreviewRowsPerPage"
            >
              <template #id="{ index }">
                <span>{{ index + 1 }}</span>
              </template>
            </TableList>
            <div class="q-mt-lg flex q-gutter-x-md justify-end">
              <Button
                class="text-capitalize btn-filter custom"
                color="orange"
                label="Crear"
                size="md"
                unelevated
                :disabled="validatingFiles"
                :outline="false"
                @click="handleConfirm"
              />
            </div>
          </section>
        </template>
      </VCard>
    </ContentComponent>
    <AlertModalComponent
      ref="alertModalRef"
      :title="alertModalConfig.title"
      :description_message="alertModalConfig.description"
      :showBtnConfirm="true"
      :textBtnConfirm="'Aceptar'"
      :textBtnCancel="'Cancelar'"
      :showCloseBtn="true"
      :showImgDefault="false"
      @confirm="handleConfirmModal"
    >
      <template #default-img>
        <q-img
          v-if="alertModalConfig.type === 'eliminar_archivo'"
          src="@/assets/images/icons/alert_popup_delete.svg"
          max-width="80px"
          width="80px"
          fit="contain"
          alt="Imagen de alerta"
        />
        <q-img
          v-else
          src="@/assets/images/icons/alert_popup.svg"
          max-width="80px"
          width="80px"
          fit="contain"
          alt="Imagen de alerta"
        />
      </template>
    </AlertModalComponent>
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

// logic view
import useAccountingConfigurationImport from '@/views/fixed-assets/accounting-configuration/v1/import/AccountingConfigurationImport'
const {
  defaultIconsLucide,
  headerPropsImport,
  showDownloadTemplateBtn,
  alertModalRef,
  alertModalConfig,
  uploadProps,
  showValidatedRowsPreview,

  files,
  validatingFiles,
  hasDownloadedErrors,

  tableProps,
  tablePreviewProps,

  tabs,
  tabActive,
  tabActiveIdx,

  visiblePreviewRows,
  updatePreviewPage,
  updatePreviewRowsPerPage,

  goToList,

  handleDownloadTemplate,
  handleAddFile,
  handleDownloadErrors,
  handleUpdateFile,
  handleClearFile,
  triggerFileInput,
  handleConfirm,

  handleConfirmModal,
  openAlertModal,
} = useAccountingConfigurationImport()
</script>
