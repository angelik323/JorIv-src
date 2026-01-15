<template>
  <section class="q-mx-sm mb-2">
    <UploadFile
      v-if="models.document && models.document.file === null"
      ref="attachDocumentRef"
      :title="uploadProps.title"
      :styles-customs="uploadProps.styleCustom"
      :multiple-files="uploadProps.multiple"
      :label-upload-btn="uploadProps.labelBtn"
      :bordered="uploadProps.bordered"
      :accept="uploadProps.accept"
      color-icon="orange"
      @added="addedFiles"
      @rejected="rejectedFiles"
      @removed="deleteFiles"
    />

    <div v-else>
      <TableList
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['actions', 'status_id', 'name']"
        :hide-bottom="true"
      >
        <template #name="{ row }">
          <div class="q-pa-md row items-center justify-center">
            <img
              class="image-excel q-mr-sm"
              src="@/assets/images/excel.svg"
              alt="Excel Icon"
            />
            {{ row.name }}
          </div>
        </template>

        <template #status_id="{ row }">
          <div
            class="q-pa-md row items-center"
            :class="row.status_id !== 72 ? 'justify-center' : ''"
          >
            <div class="q-mr-md">
              <ShowStatus :type="Number(row?.status_id ?? 0)" />
            </div>
            <q-linear-progress
              v-if="row.status_id === 72"
              :value="progressValue"
              :color="'primary_fiduciaria'"
              size="7px"
              style="flex: 1; border-radius: 9999px; overflow: hidden"
            />
          </div>
        </template>

        <template #actions="{ row }">
          <Button
            v-if="row.status_id === 73"
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Eliminar'"
            @click="deleteFiles()"
          />
        </template>
      </TableList>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import { QForm } from 'quasar'
import useBankResponseUploadFileList from './BankResponseUploadFileList'

const emits = defineEmits<{
  (e: 'validate-upload-file'): void
}>()

const props = defineProps<{
  formRef?: QForm
}>()

const {
  defaultIconsLucide,
  uploadProps,
  attachDocumentRef,
  models,
  tableProps,
  progressValue,

  addedFiles,
  rejectedFiles,
  deleteFiles,
  updatedBankResponseUploadFileProcess,
} = useBankResponseUploadFileList(props, emits)

defineExpose({
  updatedBankResponseUploadFileProcess,
})
</script>
