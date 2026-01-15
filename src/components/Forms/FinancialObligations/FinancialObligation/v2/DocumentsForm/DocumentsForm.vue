<template>
  <section>
    <div class="q-mb-lg mt-2">
      <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
        Documentos soporte
      </p>
    </div>

    <div class="q-mb-lg" v-if="!isView">
      <UploadFile
        :key="uploaderKey"
        ref="attachDocumentRef"
        :title="uploadProps.title"
        :styles-customs="uploadProps.styleCustom"
        :multiple-files="uploadProps.multiple"
        :label-upload-btn="uploadProps.labelBtn"
        :bordered="uploadProps.bordered"
        :accept="uploadProps.accept"
        :showPreview="false"
        color-icon="orange"
        @added="addedFiles"
        @rejected="rejectedFiles"
        @removed="removeFile"
      />
    </div>

    <TableList
      v-if="models.documents.length > 0"
      :rows="models.documents"
      :columns="columns"
      row-key="id"
      :loading="false"
      :custom-columns="['upload_status', 'actions']"
      :hide-bottom="true"
      :rows-per-page-options="[10, 20, 50]"
    >
      <template #upload_status="{ row }">
        <ShowStatusV2
          v-if="row.upload_status !== 'loading'"
          :type="getUploadStatusId(row.upload_status)"
          status-type="default"
        />
        <div v-else class="row items-center justify-center q-gutter-xs">
          <q-spinner-dots color="primary" size="20px" />
          <span class="text-primary">Cargando</span>
        </div>
      </template>

      <template #actions="{ row }">
        <div class="row q-gutter-sm justify-center">
          <Button
            v-if="row.is_saved"
            :left-icon="defaultIconsLucide.download"
            color="orange"
            class-custom="custom"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Descargar"
            @click="downloadDocument(row)"
          />
          <Button
            v-if="!isView && !row.is_saved"
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            class-custom="custom"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="openDeleteModal(row)"
          />
        </div>
      </template>
    </TableList>

    <div
      v-if="isView && models.documents.length === 0"
      class="full-width row flex-center text-grey q-pa-lg"
    >
      <span>No hay documentos cargados</span>
    </div>

    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 480px"
      :title="alertModalConfig.description"
      @confirm="deleteDocument()"
    />
  </section>
</template>

<script setup lang="ts">
// components
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ShowStatusV2 from '@/components/showStatus/v2/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import { IFinancialObligationDocument } from '@/interfaces/customs/financial-obligations/v2/FinancialObligation'

// logic
import useDocumentsForm from '@/components/Forms/FinancialObligations/FinancialObligation/v2/DocumentsForm/DocumentsForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IFinancialObligationDocument[] | null
  }>(),
  {}
)

const emits =
  defineEmits<
    (e: 'update:models', value: IFinancialObligationDocument[]) => void
  >()

const {
  models,
  isView,
  columns,
  alertModalConfig,
  uploadProps,
  uploaderKey,
  defaultIconsLucide,
  alertModalRef,

  addedFiles,
  rejectedFiles,
  removeFile,
  openDeleteModal,
  deleteDocument,
  downloadDocument,
  getUploadStatusId,
} = useDocumentsForm(props, emits)

defineExpose({
  validateForm: async () => {
    // Los documentos no son obligatorios en la creación
    return true
  },
})
</script>
