<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :subtitle="headerProps.subtitle"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'BusinessTrustCommissionsList' })"
    >
      <template #addAfter>
        <Button
          outline
          :label="'Descargar plantilla'"
          class-custom="custom"
          :styleContent="{
            'place-items': 'center',
            'border-radius': '20px',
            'height': '40px',
            'font-size': '14px',
            'padding': '0 20px',
          }"
          @click="downloadTemplateExcel()"
        />
      </template>

      <section class="mx-4 mb-4">
        <UploadFile
          v-if="!hasFileLoaded"
          ref="attachDocumentRef"
          :title="uploadProps.title"
          :styles-customs="uploadProps.styleCustom"
          :multiple-files="uploadProps.multiple"
          :label-upload-btn="uploadProps.labelBtn"
          :bordered="uploadProps.bordered"
          :accept="uploadProps.accept"
          color-icon="orange"
          @added="addedFiles"
          @removed="deleteFiles"
        />

        <div v-else>
          <TableList
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['actions', 'status', 'name']"
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

            <template #status="{ row }">
              <div
                class="q-pa-md row items-center"
                :class="row.status !== 'LOADING' ? 'justify-center' : ''"
              >
                <div class="q-mr-md">
                  <ShowStatus
                    :type="
                      row.status === 'LOADING'
                        ? 20
                        : row.status === 'SUCCESS'
                        ? 104
                        : 105
                    "
                  />
                </div>
                <q-linear-progress
                  v-if="row.status === 'LOADING'"
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
                v-if="row.status === 'ERROR'"
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
                v-if="row.status === 'LOADING' || row.status === 'ERROR'"
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

           <AlertModalComponent
            ref="alertModalRef"
            styleModal="min-width: 470px"
            :title="alertModalConfig.title"
            :description_message="alertModalConfig.description"
            :showBtnConfirm="alertModalConfig.showBtnConfirm"
            :showBtnCancel="alertModalConfig.showBtnCancel"
            :showCloseBtn="alertModalConfig.showCloseBtn"
            @confirm="handleDeleteFile"
          />

          <div class="row justify-end q-gutter-md mt-2">
            <Button
              :label="
                tableProps.rows.length && tableProps.rows[0].status === 'LOADING'
                ? 'Cancelar'
                : 'Cargar'
              "
              :size="'md'"
              :unelevated="true"
              :outline="false"
              :color="'orange'"
              :class="'text-capitalize btn-filter custom'"
              @click="onSubmit"
              :disabled="!statusImport && progressValue !== 1"
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
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// composables
import useFiduciaryBusinessCommissionsImport from '@/views/settlement-commissions/fiduciary-business-commissions/v2/import/FiduciaryBusinessCommissionsImport'

const {
  headerProps,
  uploadProps,
  attachDocumentRef,
  tableProps,
  progressValue,
  statusImport,
  onSubmit,
  addedFiles,
  downloadTemplateExcel,
  deleteFiles,
  downloadResponseExcel,
  defaultIconsLucide,
  hasFileLoaded,
  alertModalRef,
  alertModalConfig,
  handleDeleteFile,
} = useFiduciaryBusinessCommissionsImport()
</script>
