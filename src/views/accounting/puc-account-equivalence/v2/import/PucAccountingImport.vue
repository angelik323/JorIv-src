<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'PucAccountEquivalenceList' })"
    >
      <div class="flex justify-end">
        <Button
          :outline="true"
          :class="'mx-1'"
          label="Descargar plantilla"
          :leftImg="excelIcon"
          tooltip="Descargar excel"
          @click="donwloadExcel()"
        />
      </div>

      <VCard class="q-mt-md q-pa-xl">
        <template #content-card>
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
            <div class="col-12 col-md-6">
              <GenericSelectorComponent
                label="Código de estructura"
                :default_value="modelPuc.source_structure_id"
                :manual_option="source_account_structures"
                auto_complete
                required
                map_options
                :rules="[]"
                @update:model-value="
                  (val) => (modelPuc.source_structure_id = val)
                "
              />
            </div>
            <div class="col-12 col-md-6">
              <GenericInputComponent
                label="Estructura"
                required
                :default_value="modelPuc.source_name"
                :rules="[]"
                placeholder=""
                disabled
              />
            </div>
          </div>

          <UploadFile
            v-if="!isUploading"
            ref="attachDocumentRef"
            :title="uploadProps.title"
            :styles-customs="uploadProps.styleCustom"
            :multiple-files="uploadProps.multiple"
            :label-upload-btn="uploadProps.labelBtn"
            :bordered="uploadProps.bordered"
            :accept="uploadProps.accept"
            color-icon="orange"
            @added="validateImportFile"
            @rejected="rejectedFiles"
            @removed="deleteFiles"
          />

          <TableList
            v-if="isUploading"
            :loading="tableValidate.loading"
            :columns="tableValidate.columns"
            :rows="tableValidate.rows"
            :custom-columns="['actions', 'status_id', 'name']"
          >
            <template #name="{ row }">
              <div class="q-pa-md row items-start justify-start">
                <img
                  class="image-excel q-mr-md"
                  src="@/assets/images/excel.svg"
                  alt="Excel Icon"
                />
                {{ row.name }}
              </div>
            </template>

            <template #status_id="{ row }">
              <div
                class="q-pa-md row items-center"
                :class="row.status_id !== 20 ? 'justify-center' : ''"
              >
                <div class="q-mr-md">
                  <ShowStatus :type="Number(row?.status_id ?? 20)" />
                </div>
                <q-linear-progress
                  v-if="row.status_id === 20"
                  :value="progressValue"
                  :color="'primary_fiduciaria'"
                  size="7px"
                  style="flex: 1; border-radius: 9999px; overflow: hidden"
                />
              </div>
            </template>
            <template #actions="{ row }">
              <Button
                :right-icon="
                  dinamicButton
                    ? defaultIconsLucide.download
                    : defaultIconsLucide.delete
                "
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                :tooltip="dinamicButton ? 'Descargar errores' : 'Eliminar'"
                @click="
                  () => {
                    if (dinamicButton) {
                      downloadFailures()
                    } else {
                      deleteFile(row.id)
                    }
                  }
                "
              />
            </template>
          </TableList>

          <div class="flex justify-end">
            <Button
              :outline="false"
              :label="dinamicButton ? 'Procesar' : 'Cargar'"
              size="md"
              unelevated
              color="orange"
              class="text-capitalize btn-filter custom"
              :disabled="total_count === 0"
              @click="optionsButtonValidate()"
            />
          </div>
        </template>
      </VCard>
      <AlertModalComponent
        ref="alertModalRef"
        :open-dialog="modalRef"
        :title="alertModalConfig.title"
        :description_message="alertModalConfig.description"
        v-model="modalRef"
        style-modal="min-width: 400px; flex-direction: row;"
        :showImgDefault="false"
        @close="modalRef = false"
        @confirm="onSubmitModal()"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup.svg"
            max-width="80px"
            width="80px"
            fit="contain"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'
import excelIcon from '@/assets/images/excel.svg'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import { defaultIconsLucide } from '@/utils'
import { usePucAccountingImport } from './PucAccountingImport'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

const {
  validateImportFile,
  rejectedFiles,
  deleteFiles,
  deleteFile,
  donwloadExcel,
  downloadFailures,
  optionsButtonValidate,
  onSubmitModal,
  tableValidate,
  uploadProps,
  isUploading,
  progressValue,
  headerProps,
  source_account_structures,
  modelPuc,
  total_count,
  dinamicButton,
  alertModalConfig,
  modalRef,
  alertModalRef,
} = usePucAccountingImport()
</script>
