<template>
  <div class="q-mx-xl">
    <div class="row justify-end">
      <Button
        outline
        class-custom="custom"
        label="Descargar formato"
        color="orange"
        :styleContent="{
          'place-items': 'center',
          color: 'black',
        }"
        :left-img="imgButtonHeaderTable"
        @click="downloadTemplateExcel"
      />
    </div>

    <UploadFile
      v-if="
        models.documents.length === 0 &&
        !['view', 'authorize'].includes(props.action)
      "
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
          <!-- Eliminar archivo -->
          <Button
            v-if="row.status_id === 30 || row.status_id === 29"
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Eliminar'"
            @click="confirmDelete"
          /> </template
      ></TableList>
    </div>
  </div>

  <AlertModalComponent
    ref="alertModalRef"
    title="¿Desea eliminar el documento?"
    :show-btn-cancel="true"
    :show-close-btn="true"
    :show-img-default="false"
    :show-btn-confirm="true"
    :textBtnConfirm="'Eliminar'"
    :textBtnCancel="'Cancelar'"
    @confirm="handleDeleteConfirm"
  ></AlertModalComponent>

  <div class="q-mt-lg">
    <section class="q-px-md q-mb-md">
      <div class="row justify-center">
        <div class="row q-gutter-sm mr-2">
          <Button
            label="Cancelar"
            :size="'md'"
            :unelevated="true"
            :outline="true"
            :color="'orange'"
            :class="'text-capitalize btn-filter custom'"
            @click="emit('close')"
            :style-text="'color:black;'"
          />

          <Button
            label="Cargar"
            :size="'md'"
            :unelevated="true"
            :outline="false"
            :color="'orange'"
            :class="'text-capitalize btn-filter custom'"
            @click="emit('save')"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import { useDataUpload } from './UploadData'
import imgButtonHeaderTable from '@/assets/images/excel.svg'

// Utils
import { defaultIconsLucide } from '@/utils'
import { ref } from 'vue'
import { useAlert } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view' | 'authorize'
  }>(),
  {}
)

const emit = defineEmits<{
  (e: 'save'): void
  (e: 'close'): void
}>()

const { showAlert } = useAlert()

const {
  uploadProps,
  attachDocumentRef,
  models,
  tableProps,
  progressValue,

  addedFiles,
  rejectedFiles,
  deleteFiles,
  downloadTemplateExcel,
} = useDataUpload()

const alertModalRef = ref()

const confirmDelete = () => {
  alertModalRef.value?.openModal()
}

const handleDeleteConfirm = () => {
  deleteFiles()
  alertModalRef.value?.closeModal()
  showAlert('Registro eliminado exitosamente', 'success', undefined, 5000)
}
</script>
