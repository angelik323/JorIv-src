<template>
  <div class="q-pa-lg">
    <div class="q-mb-lg">
      <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
        Cargar documentos
      </p>
    </div>

    <UploadFile
      v-if="!['view', 'authorize'].includes(props.action)"
      ref="attachDocumentRef"
      :title="uploadProps.title"
      :styles-customs="uploadProps.styleCustom"
      :multiple-files="true"
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
      :custom-columns="['actions', 'status_id', 'name']"
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
          @click="deleteFileManual(row)"
        />
        <!-- Descargar archivo -->

        <Button
          v-if="!['create', 'edit'].includes(props.action)"
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
  </div>

  <!-- Sección: Comprobante contable asociado -->
  <div class="q-pa-md rounded-borders">
    <p class="font-size-1 text-weight-bold q-mb-md">Comprobante contable</p>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <div class="row q-mb-sm">
          <label class="text-weight-bold col-6">Número de comprobante</label>
          <span class="text-weight-medium col-6 text-right">{{
            voucher.voucher_id || 'Sin datos'
          }}</span>
        </div>
        <div class="row q-mb-sm">
          <label class="text-weight-bold col-6"
            >Fecha de registro contable</label
          >
          <span class="text-weight-medium col-6 text-right">{{
            voucher.voucher?.registration_date || 'Sin datos'
          }}</span>
        </div>
        <div class="row q-mb-sm">
          <label class="text-weight-bold col-6">Estado del comprobante</label>
          <span class="text-weight-medium col-6 text-right text-positive">{{
            voucher.voucher?.status?.status || 'Sin datos'
          }}</span>
        </div>
      </div>
    </div>

    <div class="row justify-end q-mt-md">
      <Button
        label="Ver Comprobante"
        size="md"
        unelevated
        :outline="false"
        color="orange"
        class="text-capitalize btn-filter custom"
        @click="handleViewComprobante(voucher.voucher_id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// components
import Button from '@/components/common/Button/Button.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'

// logic
import useDocumentForm from '@/components/Forms/FixedAssets/Consolidation/DocumentsForm/DocumentsForm'

// interfaces
import { ActionType } from '@/interfaces/global'
import { IConsolidationDocumentsForm } from '@/interfaces/customs/fixed-assets/v1/Consolidation'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IConsolidationDocumentsForm[] | null
  }>(),
  {}
)

const {
  uploadProps,
  tableProps,
  voucher,
  defaultIconsLucide,
  handleViewComprobante,
  validateForm,
  addedFiles,
  rejectedFiles,
  deleteFiles,
  deleteFileManual,
  downloadFileS3,
} = useDocumentForm(props)

// Exponer al padre
defineExpose({
  validateForm,
})
</script>
