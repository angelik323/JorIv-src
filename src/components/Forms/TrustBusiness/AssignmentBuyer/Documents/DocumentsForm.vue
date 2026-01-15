<template>
  <div class="mx-3 mt-2 mb-3">
    <div class="q-mb-lg">
      <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
        Soporte documental
      </p>
    </div>
    <UploadFile
      v-if="!['view', 'authorize'].includes(props.action)"
      ref="attachDocumentRef"
      :title="uploadProps.title"
      :styles-customs="uploadProps.styleCustom"
      :multiple-files="false"
      :label-upload-btn="uploadProps.labelBtn"
      :bordered="uploadProps.bordered"
      :accept="uploadProps.accept"
      :show-preview="false"
      color-icon="orange"
      @added="addedFiles"
      @rejected="rejectedFiles"
      @removed="deleteFiles"
    />

    <TableList
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :pages="tableProps.pages"
      :custom-columns="['actions', 'status_id', 'name', 'created_at']"
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

      <template #created_at="{ row }">
        <div class="q-pa-md row items-center justify-center">
          {{ row.created_at ? formatDate(row.created_at, 'YYYY-MM-DD') : '-' }}
        </div>
      </template>

      <template #status_id="{ row }">
        <div class="q-pa-md row items-center justify-center">
          <ShowStatus :type="Number(row?.status_id ?? 20)" />
        </div>
      </template>

      <template #actions="{ row }">
        <!-- Eliminar archivo -->
        <Button
          v-if="['create', 'edit'].includes(props.action)"
          :left-icon="defaultIconsLucide.trash"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Eliminar'"
          @click="openDeleteModal(row)"
        />

        <!-- Descargar archivo -->
        <Button
          :left-icon="defaultIconsLucide.download"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Descargar'"
          @click="downloadFileS3(row)"
        />
      </template>
    </TableList>

    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 480px"
      title="¿Desea eliminar el documento?"
      :show-img-default="false"
      @confirm="confirmDeleteFile"
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
</template>

<script setup lang="ts">
// components
import Button from '@/components/common/Button/Button.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// logic
import useDocumentForm from './DocumentsForm'

// interfaces
import { IResponseDocuments } from '@/interfaces/customs'

// utils
import { defaultIconsLucide } from '@/utils'
import { ActionType } from '@/interfaces/global'
import { useUtils } from '@/composables'

const { formatDate } = useUtils()

const props = withDefaults(
  defineProps<{
    action: ActionType | 'authorize'
    data?: IResponseDocuments[] | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  uploadProps,
  attachDocumentRef,
  tableProps,
  alertModalRef,

  addedFiles,
  rejectedFiles,
  deleteFiles,
  openDeleteModal,
  confirmDeleteFile,
  downloadFileS3,
} = useDocumentForm(props)

defineExpose({
  validateForm: () => tableProps.value.rows.length,
})
</script>
