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
                        @click="deleteFiles()"
                      /> </template
                  ></TableList>

                  <div class="row justify-end q-gutter-md q-mt-md">
                    <Button
                      :label="'Validar archivo'"
                      :size="'md'"
                      :unelevated="true"
                      :outline="false"
                      :color="'orange'"
                      :class="'text-capitalize btn-filter custom'"
                      :disabled="progressValue !== 1"
                      @click="onSubmit"
                    />
                  </div>
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
                >
                </TableList>
                <div class="row justify-end q-gutter-md q-mt-md">
                  <Button
                    :label="'Procesar'"
                    :size="'md'"
                    :unelevated="true"
                    :outline="false"
                    :color="'orange'"
                    :class="'text-capitalize btn-filter custom'"
                    @click="onSubmitProcess"
                  />
                </div>
              </section>
              <section
                class="mx-4 q-my-lg"
                v-if="tableDataCreatedProps.rows.length > 0"
              >
                <TableList
                  :loading="tableDataCreatedProps.loading"
                  :columns="tableDataCreatedProps.Columns"
                  :rows="tableDataCreatedProps.rows"
                  :pages="tableDataCreatedProps.pages"
                  :hide-bottom="true"
                  :custom-columns="['actions']"
                >
                  <template #actions="{ row }">
                    <Button
                      :left-icon="defaultIconsLucide.eye"
                      :color="'orange'"
                      :class-custom="'custom'"
                      :outline="false"
                      :flat="true"
                      :tooltip="'Ver'"
                      @click="showVoucherView(row.id)"
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
                    @click="finalizarRegistro()"
                  />
                </div>
              </section>
            </div>
            <div v-else-if="tabActive === 'errors'">
              <section class="mx-4 mb-4">
                <div class="row q-col-gutter-lg mt-1">
                  <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                    <p class="text-weight-medium mb-0"><b>Estado</b></p>
                    <ShowStatus
                      :type="Number(tableProps.rows[0]?.status_id ?? 20)"
                      class="q-mt-sm"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                    <p class="text-weight-medium mb-0"><b>Archivo</b></p>
                    <p class="text-grey-8 mb-0 ellipsis">
                      {{ temp_data_import!.file_name }}
                    </p>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                    <p class="text-weight-medium mb-0">
                      <b>Fecha intento de carga</b>
                    </p>
                    <p class="text-grey-8 mb-0">
                      {{ temp_data_import!.uploaded_at }}
                    </p>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                    <p class="text-weight-medium mb-0">
                      <b>Registros con error</b>
                    </p>
                    <p class="text-grey-8 mb-0">
                      {{ temp_data_import!.failed_count }}
                    </p>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                    <p class="text-weight-medium mb-0">
                      <b>Total registros </b>
                    </p>
                    <p class="text-grey-8 mb-0">
                      {{ temp_data_import!.total_count }}
                    </p>
                  </div>
                </div>
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
                  :columns="tableValidateErrorsProps.Columns"
                  :rows="tableValidateErrorsProps.rows"
                  row-key="index"
                  :pages="tableValidateErrorsProps.pages"
                  :hide-bottom="true"
                  :rows-per-page-options="[0]"
                />
                <div class="row justify-end q-gutter-md q-mt-md">
                  <Button
                    :label="'Finalizar'"
                    :size="'md'"
                    :unelevated="true"
                    :outline="false"
                    :color="'orange'"
                    :class="'text-capitalize btn-filter custom'"
                    @click="tabActive = 'cargar'"
                  />
                </div>
              </section>
            </div>
          </template>
        </VCard>
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
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useUploadAccountingVouchersImport from './UploadAccountingVouchersImport'

// Utils
import { defaultIconsLucide } from '@/utils'
import imgButtonHeaderTable from '@/assets/images/excel.svg'

const {
  headerProps,
  uploadProps,
  attachDocumentRef,
  models,
  tableProps,
  tableValidateErrorsProps,
  tableValidateProcessProps,
  tableDataCreatedProps,
  progressValue,
  temp_data_import,
  tabActiveIdx,
  filteredTabs,
  tabActive,
  onSubmit,
  onSubmitProcess,
  finalizarRegistro,
  addedFiles,
  rejectedFiles,
  downloadTemplateExcel,
  downloadErrors,
  deleteFiles,
  showVoucherView,
  goToURL,
} = useUploadAccountingVouchersImport()
</script>
