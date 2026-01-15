<template>
  <q-form class="q-pa-lg">
    <UploadFile
      :disabled="isReadonly"
      :styles-customs="'width: 100%;'"
      :bordered="false"
      :multiple="false"
      accept=".pdf,.jpg,.jpeg,.png,.docx"
      @added="addFiles"
    />

    <TableList
      :title="documentsTable.title"
      :rows="documentsTable.rows"
      :columns="documentsTable.columns"
      :loading="documentsTable.loading"
      :pages="documentsTable.pages"
      :custom-columns="['actions']"
      @update-page="updatePage"
      @update-rows-per-page="updateRowsPerPage"
    >
      <template #actions="{ row }">
        <Button
          v-if="!isReadonly"
          flat
          color="orange"
          :outline="false"
          colorIcon="#f45100"
          class-custom="custom"
          tooltip="Ver"
          :left-icon="defaultIconsLucide.eye"
          @click="viewDocument(row.file)"
        />

        <Button
          v-if="!isReadonly"
          flat
          :outline="false"
          color="orange"
          colorIcon="#f45100"
          class-custom="custom"
          tooltip="Eliminar"
          :left-icon="defaultIconsLucide.trash"
          @click="removeDocument(row.id)"
        />
      </template>
    </TableList>
  </q-form>
</template>

<script setup lang="ts">
// Components
import useFixedAssetsNoveltyDocumentsForm from '@/components/Forms/FixedAssets/RegisterAuthhorizationsChanges/UploadForm/UploadForm'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Interfaces
import { IFixedAssetNoveltyDocument } from '@/interfaces/customs/fixed-assets/v1/Register-Authorization-Changes'

const props = defineProps<{
  noveltyStatus: 'REGISTERED' | 'AUTHORIZED' | 'CANCELED'
  documents?: IFixedAssetNoveltyDocument[]
}>()

const {
  documentsTable,
  isReadonly,
  hasDocuments,
  defaultIconsLucide,
  addFiles,
  removeDocument,
  viewDocument,
  updatePage,
  updateRowsPerPage,
  getDocumentsPayload,
} = useFixedAssetsNoveltyDocumentsForm(props)

defineExpose({
  hasDocuments,
  getDocumentsPayload,
})
</script>
