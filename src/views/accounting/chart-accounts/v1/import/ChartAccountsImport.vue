<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :subtitle="headerProps.subtitle"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'ChartAccountsCreate' })"
    >
      <template #addAfter>
        <q-btn
          no-caps
          outline
          unelevated
          size="100%"
          class="custom-button min-h__40"
          :color="'orange'"
          :disable="!structureId"
          :text-color="'orange'"
          @click="downloadTemplateExcel()"
        >
          <img
            class="image-excel"
            src="@/assets/images/excel.svg"
            alt="Excel Icon"
          />
          Descargar plantilla
        </q-btn>
      </template>

      <section class="mx-4 mb-4" v-if="structureId">
        <UploadFile
          v-if="models.documents.length === 0"
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
              <!-- Descargar -->
              <Button
                v-if="row.status_id === 30"
                :left-icon="defaultIconsLucide.download"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                :tooltip="'Descargar'"
                @click="downloadResponseExcel()"
              />

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
                @click="deleteFiles()"
              /> </template
          ></TableList>

          <div class="row justify-end q-gutter-md mt-2">
            <Button
              :label="'Cargar'"
              :size="'md'"
              :unelevated="true"
              :outline="false"
              :color="'orange'"
              :class="'text-capitalize btn-filter custom'"
              :disabled="!statusImport && progressValue !== 1"
              @click="onSubmit"
            />
          </div>
        </div>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'

// composables
import useChartAccountsImport from './ChartAccountsImport'

// Utils
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  uploadProps,
  attachDocumentRef,
  models,
  structureId,
  tableProps,
  progressValue,
  statusImport,
  onSubmit,
  addedFiles,
  rejectedFiles,
  downloadTemplateExcel,
  deleteFiles,
  downloadResponseExcel,
} = useChartAccountsImport()
</script>
