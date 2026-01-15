<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('UploadAccountingVouchersList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <VCard>
          <template #content-card>
            <div v-if="tabActive === 'cargar'">
              <div class="flex justify-between q-px-xl items-center">
                <h6>Carga de archivo plano</h6>
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
                  Descargar plantilla
                </Button>
              </div>
              <section class="mx-4 mb-4">
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
                    :custom-columns="['status_id', 'name', 'actions']"
                    :hide-bottom="true"
                    :hide-pagination="true"
                    :rows-per-page-options="[0]"
                    row-key="id"
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
                          style="
                            flex: 1;
                            border-radius: 9999px;
                            overflow: hidden;
                          "
                        />
                      </div>
                    </template>
                     <template #actions>
                    <Button
                      :left-icon="defaultIconsLucide.trash"
                      color="orange"
                      :class-custom="'custom'"
                      :outline="false"
                      :flat="true"
                      colorIcon="#f45100"
                      :tooltip="'Eliminar'"
                      @click="cancelUpload"
                    />
                  </template>
                  </TableList>
                </div>
              </section>
            </div>

            <div v-else-if="tabActive === 'validar'">
              <section class="mx-4 q-my-lg">
                <TableList
                  :title="tableValidateProcessProps.title"
                  :loading="tableValidateProcessProps.loading"
                  :columns="tableValidateProcessProps.columns"
                  :rows="tableValidateProcessProps.rows"
                  :pages="tableValidateProcessProps.pages"
                  :hide-bottom="true"
                  :custom-columns="['file_name', 'status', 'actions']"
                >
                  <template #file_name="{ row }">
                    <div class="q-pa-md row items-center justify-center">
                      <img
                        class="image-excel q-mr-sm"
                        src="@/assets/images/excel.svg"
                        alt="Excel Icon"
                      />
                      {{ row.file_name }}
                    </div>
                  </template>

                  <template #status>
                    <ShowStatus :type="85" :statusType="'accounting'" />
                  </template>

                  <template #actions>
                    <Button
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

                <div class="row justify-end q-gutter-md q-mt-md">
                  <Button
                    v-if="isValidatedReadyToProcess"
                    label="Procesar"
                    :size="'md'"
                    :unelevated="true"
                    :outline="false"
                    :color="'orange'"
                    :class="'text-capitalize btn-filter custom'"
                    @click="onSubmitProcess('full')"
                  />
                </div>
              </section>
              <section
                class="mx-4 q-my-lg"
                v-if="tableDataCreatedProps.rows.length > 0"
              >
                <TableList
                  :loading="tableDataCreatedProps.loading"
                  :columns="tableDataCreatedProps.columns"
                  :rows="tableDataCreatedProps.rows"
                  :pages="tableDataCreatedProps.pages"
                  :hide-bottom="true"
                  :custom-columns="['actions']"
                >
                  <template #actions>
                    <!-- Eliminar archivo -->
                    <Button
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
                <div class="row justify-end q-gutter-md q-mt-md">
                  <Button
                    :label="'Finalizar'"
                    :size="'md'"
                    :unelevated="true"
                    :outline="false"
                    :color="'orange'"
                    :class="'text-capitalize btn-filter custom'"
                    @click="goToURL('UploadAccountingVouchersList')"
                  />
                </div>
              </section>
            </div>
            <div v-else-if="tabActive === 'errors'">
              <section class="mx-4 mb-4">
                <TableList
                  :loading="tableProps.loading"
                  :columns="tableProps.columns"
                  :rows="tableProps.rows"
                  :pages="tableProps.pages"
                  :custom-columns="['actions', 'status_id', 'name']"
                  :hide-bottom="true"
                  row-key="id"
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
                        <ShowStatus
                          :type="Number(row?.status_id ?? 20)"
                          statusType="accounting"
                        />
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

                  <template #actions>
                    <Button
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

                <q-separator class="q-my-md" />

                <div class="flex justify-between q-px-xl items-center">
                  <h6><b>Listado de errores</b></h6>
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
                    @click="downloadErrors"
                  >
                    <img
                      class="image-excel"
                      src="@/assets/images/excel.svg"
                      alt="Excel Icon"
                    />
                    Descargar plantilla
                  </Button>
                </div>

                <TableList
                  :loading="tableValidateErrorsProps.loading"
                  :columns="tableValidateErrorsProps.columns"
                  :rows="tableValidateErrorsProps.rows"
                  row-key="index"
                  :pages="tableValidateErrorsProps.pages"
                  @update-page="updateErrorsPage"
                  @update-rows-per-page="updateErrorsRowsPerPage"
                />

                <div class="row justify-end q-gutter-md q-mt-md">
                  <Button
                    v-if="canProcessPartially"
                    :label="'Procesar'"
                    :size="'md'"
                    :unelevated="true"
                    :outline="true"
                    :color="'orange'"
                    :class="'text-capitalize btn-filter custom'"
                    @click="openPartialProcessModal"
                  />
                  <Button
                    :label="'Finalizar'"
                    :size="'md'"
                    :unelevated="true"
                    :outline="false"
                    :color="'orange'"
                    :class="'text-capitalize btn-filter custom'"
                    @click="goToURL('UploadAccountingVouchersList')"
                  />
                </div>
              </section>
            </div>
          </template>
        </VCard>
        <AlertModalComponent
          ref="alertPartialRef"
          styleModal="min-width: 480px"
          title="El archivo presentó errores"
          @confirm="handleConfirmPartialProcess"
        >
          <template #default-body>
            <div class="text-center q-mt-md">¿Desea proceder parcialmente?</div>
          </template>
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import useUploadAccountingVouchersImport from '@/views/accounting/upload-accounting-vouchers/v2/import/UploadAccountingVouchersImport'

// Utils
import imgButtonHeaderTable from '@/assets/images/excel.svg'

const {
  headerProps,
  uploadProps,
  models,
  tableProps,
  tableValidateErrorsProps,
  tableValidateProcessProps,
  tableDataCreatedProps,
  progressValue,
  tabActiveIdx,
  filteredTabs,
  tabActive,
  onSubmitProcess,
  addedFiles,
  rejectedFiles,
  downloadTemplateExcel,
  downloadErrors,
  deleteFiles,
  cancelUpload,
  goToURL,
  defaultIconsLucide,
  canProcessPartially,
  updateErrorsPage,
  updateErrorsRowsPerPage,
  isValidatedReadyToProcess,
} = useUploadAccountingVouchersImport()
const alertPartialRef = ref<{
  openModal: () => void
  closeModal: () => void
} | null>(null)

const openPartialProcessModal = () => {
  alertPartialRef.value?.openModal()
}

const handleConfirmPartialProcess = () => {
  onSubmitProcess('partial')
  alertPartialRef.value?.closeModal()
}
</script>
