<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :subtitle="headerProps.subtitle"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'EquivalentVaucherList' })"
    >
      <template #addAfter>
        <Button
          no-caps
          outline
          class-custom="custom"
          label="Descargar excel"
          color="orange"
          :styleContent="{
            'place-items': 'center',
            color: 'black',
          }"
          :text-color="'orange'"
          :left-img="imgButtonHeaderTable"
          @click="downloadTemplateExcel()"
        >
          <img
            class="image-excel"
            src="@/assets/images/excel.svg"
            alt="Excel Icon"
          />
          Descargar formato
        </Button>
      </template>

      <section class="mx-4 mb-4">
        <UploadFile
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

        <div>
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
                <div class="q-mr-md" v-if="row.status_id !== 20">
                  <ShowStatus :type="Number(row?.status_id)" />
                </div>

                <q-linear-progress
                  v-if="row.status_id === 20"
                  :value="progressValue"
                  color="primary_fiduciaria"
                  size="7px"
                  style="flex: 1; border-radius: 9999px; overflow: hidden"
                />
              </div>
            </template>

            <template #actions="{ row }">
              <Button
                v-if="row.actions?.includes('download')"
                :left-icon="defaultIconsLucide.download"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                :tooltip="'Descargar'"
                @click="exportFailures()"
              />

              <Button
                v-if="row.actions?.includes('delete')"
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

          <div class="row justify-end q-gutter-md">
            <Button
              v-if="statusImport && validatedVouchers.length > 0"
              :label="'Cargar'"
              :size="'md'"
              :unelevated="true"
              :outline="false"
              :color="'orange'"
              :class="'text-capitalize btn-filter custom'"
              :disabled="!statusImport && progressValue !== 1"
              @click="onSubmit"
            />

            <Button
              v-if="
                !statusImport &&
                (validatedVouchers.length > 0 || failures_list.length > 0)
              "
              :label="'Procesar parcialmente'"
              :size="'md'"
              :unelevated="true"
              :outline="false"
              :color="'orange'"
              :class="'text-capitalize btn-filter custom'"
              :disabled="!hasDownloadedFailures"
              :tooltip="
                !hasDownloadedFailures
                  ? 'Debe descargar el archivo de errores primero'
                  : 'Procesar parcialmente'
              "
              @click="openModalCreate"
            />
          </div>
        </div>
      </section>
    </ContentComponent>

    <AlertModalComponent
      ref="alertModalRef"
      :title="alertModalConfig.title"
      :description_message="alertModalConfig.description_message"
      :showBtnConfirm="true"
      :textBtnConfirm="'Aceptar'"
      :textBtnCancel="'Cancelar'"
      :showCloseBtn="true"
      :showImgDefault="true"
      @confirm="onSubmit"
    />
  </div>
</template>
<script setup lang="ts">
// components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'

// composables
import useEquivalentVaucherImport from './EquivalentVaucherImport'

// Utils
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  uploadProps,
  attachDocumentRef,
  tableProps,
  progressValue,
  statusImport,
  validatedVouchers,
  failures_list,
  alertModalConfig,
  alertModalRef,
  hasDownloadedFailures,
  onSubmit,
  addedFiles,
  rejectedFiles,
  openModalCreate,
  downloadTemplateExcel,
  deleteFiles,
  exportFailures,
} = useEquivalentVaucherImport()
</script>
