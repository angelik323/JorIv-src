<template>
  <section>
    <UploadFile
      v-if="action !== 'view'"
      ref="attachDocumentRef"
      color-icon="orange"
      :title="uploadProps.title"
      :styles-customs="uploadProps.styleCustom"
      :multiple-files="uploadProps.multiple"
      :label-upload-btn="uploadProps.labelBtn"
      :accept="uploadProps.accept"
      :show-preview="false"
      @added="addedFiles"
      @rejected="rejectedFiles"
      @removed="deleteFiles"
    />
    <TableList
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :pages="tableProps.pages"
      :custom-columns="['actions']"
      :hide-bottom="true"
    >
      <template #actions="{ row }">
        <Button
          v-if="action !== 'view'"
          :left-icon="defaultIconsLucide.trash"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Eliminar'"
          @click="deleteFileManual(row)"
        />
      </template>
    </TableList>
  </section>
</template>

<script setup lang="ts">
// interface
import { ActionType } from '@/interfaces/global'
import type {
  IBuySaleTransactionDocument,
  IDocumentsBuySale
} from '@/interfaces/customs/fixed-assets/BuySaleFixedAssets'

// components
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// logic
import useDocumentsForm from '@/components/Forms/FixedAssets/BuySaleFixedAssets/DocumentsForm/DocumentsForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IBuySaleTransactionDocument[] | null
    initialDocuments?: IDocumentsBuySale[] | null
  }>(),
  {}
)

const emit = defineEmits<{
  'update:models': [data: IDocumentsBuySale[]]
}>()

const {
  defaultIconsLucide,

  attachDocumentRef,
  tableProps,
  uploadProps,

  addedFiles,
  rejectedFiles,
  deleteFiles,
  deleteFileManual,
  validateForm
} = useDocumentsForm(props, emit)

defineExpose({
  validateForm
})
</script>
