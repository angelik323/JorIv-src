<template>
  <div class="q-mx-xl">
    <ContentComponent
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      indentation
      content-indentation
    >
      <!-- File Upload Section -->
      <div>
        <div class="q-mb-lg row justify-between items-center">
          <span class="text-weight-bold">Importar archivos</span>
          <Button
            no-caps
            outline
            class-custom="custom"
            label="Descargar plantilla"
            color="orange"
            :styleContent="{
              'place-items': 'center',
              color: 'black',
            }"
            :text-color="'orange'"
            :left-img="excelIcon"
            @click="onDownloadTemplate"
          />
        </div>
        <div class="q-mt-xs">
          <UploadFile
            :key="resetUploadKey"
            stylesCustoms="width: 100%; height: 100%;"
            title="Cargar archivo"
            labelUploadBtn="Seleccione el archivo para subir"
            :bordered="false"
            :showPreview="false"
            :disabled="disableUploadFile"
            accept=".xlsx, .xlsm"
            @added="onFileAdded"
          />
          <TableList
            v-if="uploadedFiles.length > 0"
            class="q-mt-md"
            :loading="fileTableProps.loading"
            :columns="fileTableProps.columns"
            :rows="fileTableProps.rows"
            hidePagination
            :rows-per-pagination-options="[0]"
            :custom-columns="[
              'index',
              'name',
              'actions',
              'state',
              'totalRegisters',
            ]"
          >
            <template #index="props">
              <span>{{ props.index + 1 }}</span>
            </template>
            <template #name="props">
              <div class="row">
                <img
                  class="image__excel-btn q-mr-sm"
                  :src="excelIcon"
                  alt="Icono decorativo"
                  role="presentation"
                />
                <span>{{ props.row.name }}</span>
              </div>
            </template>
            <template #totalRegisters="props">
              <span>{{
                props.row.totalRegisters ? props.row.totalRegisters : '-'
              }}</span>
            </template>
            <template #actions="props">
              <Button
                v-if="
                  props.row.statusId === FileShowStatusId.SUCCESS ||
                  props.row.statusId === FileShowStatusId.ERROR
                "
                :left-icon="defaultIconsLucide.download"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                :tooltip="
                  props.row.statusId === FileShowStatusId.ERROR
                    ? 'Descargar reporte de errores'
                    : 'Descargar coincidencias'
                "
                @click="onDownloadFile(props.row.id, props.row.statusId)"
              />
            </template>
            <template #state="props">
              <div class="row items-center justify-center q-gutter-x-sm">
                <ShowStatus
                  class="chip-status"
                  :type="Number(props.row.statusId)"
                  :status-type="'default'"
                />
                <q-linear-progress
                  v-if="props.row.statusId === 20"
                  class="file-upload__progress"
                  size="10px"
                  color="primary_fiduciaria"
                  :value="props.row.progress"
                  style="width: 120px"
                />
              </div>
            </template>
          </TableList>
        </div>
      </div>
      <div class="my-2" v-if="showSearchButton">
        <div class="row justify-end q-gutter-md">
          <Button
            size="md"
            :outline="false"
            color="orange"
            class-custom="text-capitalize btn-filter custom"
            label="Buscar"
            @click="onSearch"
          />
        </div>
      </div>
      <div v-if="showResults">
        <div class="q-my-xl row justify-between items-center">
          <h6>Listado de la consulta masiva en listas cautelares</h6>
          <div>
            <Button
              outline
              color="orange"
              :left-img="excelIcon"
              classCustom="custom"
              :disabled="totalMatches === 0"
              :styleContent="{
                'place-items': 'center',
                color: 'black',
              }"
              label="Descargar coincidencias"
              @click="onDownloadMatchesFromResults"
            />
          </div>
        </div>
        <div class="my-2">
          <Card class="q-pa-md">
            <template #content-card>
              <div class="row q-col-gutter-md">
                <div class="col-md-4 col-xs-12">
                  <span
                    ><b>Número de autorización:</b>
                    {{ currentAuthorizationNumber }}</span
                  >
                </div>
                <div class="col-md-4 col-xs-12">
                  <span><b>Cantidad de registros:</b> {{ totalRecords }}</span>
                </div>
                <div class="col-md-4 col-xs-12">
                  <span><b>Total de coincidencias:</b> {{ totalMatches }}</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="my-2">
          <TableList
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['level_match_id']"
          >
            <template #level_match_id="{ row }">
              <ShowStatus
                :type="Number(row.level_match_id) ?? 4"
                status-type="sarlaft"
              />
            </template>
          </TableList>
        </div>
      </div>
    </ContentComponent>
  </div>
</template>
<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import Button from '@/components/common/Button/Button.vue'
import Card from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic
import useCautelarListsMassQueryView from '@/views/sarlaft/mass-consultation-precautionary-lists/v1/cautelar-lists-mass-query-view/CautelarListsMassQueryView'

const {
  // conf
  headerProps,
  tableProps,
  fileTableProps,
  uploadedFiles,
  defaultIconsLucide,
  showSearchButton,
  disableUploadFile,
  showResults,
  currentAuthorizationNumber,
  totalRecords,
  totalMatches,
  resetUploadKey,
  FileShowStatusId,
  // functions
  onSearch,
  onFileAdded,
  onDownloadFile,
  onDownloadTemplate,
  onDownloadMatchesFromResults,
} = useCautelarListsMassQueryView()
</script>

<style src="./CautelarListsMassQueryView.scss" scoped lang="scss"></style>
