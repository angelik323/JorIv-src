<template>
  <div class="q-px-lg">
    <q-form @submit.prevent="" ref="formElementRef">
      <!-- Section 1: Basic Data -->
      <section>
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-6">
            <GenericInputComponent
              v-if="['create', 'edit', 'view'].includes(formType)"
              required
              :default_value="formValues.code"
              label="Código"
              disabled
              placeholder="-"
              :rules="[
                (val) => useRules().is_required(val, 'El código es requerido'),
              ]"
              @update:model-value="formValues.code = $event"
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericInputComponent
              v-if="['create', 'edit', 'view'].includes(formType)"
              required
              :default_value="formValues.name_list"
              label="Nombre/ Razón social"
              placeholder="Inserte"
              :disabled="formType === 'view'"
              :rules="[
                (val) =>
                  useRules().is_required(
                    val,
                    'El nombre/razón social es requerido'
                  ),
                (val) => useRules().length_between(val, 3, 100),
                validateNameExist,
              ]"
              @update:model-value="formValues.name_list = $event"
            />
          </div>
        </div>
      </section>

      <!-- Section 2: File Upload -->
      <section v-if="showFileUpload" class="q-mt-sm">
        <div v-if="!filesSelected" class="q-mb-lg row justify-between">
          <span class="text-weight-bold">Importar archivo</span>
        </div>
        <div class="q-mt-xs">
          <UploadFile
            v-if="!filesSelected"
            stylesCustoms="width: 100%; height: 100%;"
            title="Cargar archivo"
            labelUploadBtn="Seleccione el archivo para subir"
            :bordered="false"
            accept=".xlsx, .xlsm"
            @added="onFileSelected"
          />
          <TableList
            v-if="filesSelected"
            :loading="fileTableProps.loading"
            :columns="fileTableProps.columns"
            :rows="fileTableProps.rows"
            hidePagination
            :rows-per-pagination-options="[0]"
            :custom-columns="['name', 'actions', 'state', 'totalRegisters']"
          >
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
            <template #actions v-if="showTableActions">
              <Button
                v-if="
                  fileStatus?.statusId === 104 || fileStatus?.statusId === 30
                "
                :left-icon="defaultIconsLucide.delete"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                tooltip="Eliminar"
                @click="onRemoveFile()"
              />
            </template>
            <template #state>
              <div class="row no-wrap items-center file-upload">
                <ShowStatus
                  v-if="fileStatus"
                  class="chip-status"
                  :type="Number(fileStatus.statusId)"
                  :status-type="'default'"
                />
                <q-linear-progress
                  v-if="fileStatus?.statusId === 20"
                  class="file-upload__progress q-ml-md"
                  size="10px"
                  color="primary_fiduciaria"
                  :value="fileStatus?.progress"
                />
              </div>
            </template>
          </TableList>
        </div>
      </section>

      <!-- Section 3: Third Party Table -->
      <section
        v-if="
          showThirdPartyTable &&
          thirdPartyTableProps.rows &&
          thirdPartyTableProps.rows.length > 0
        "
        class="q-mt-lg"
      >
        <div class="row justify-between items-center q-mb-md">
          <span class="text-weight-bold">Lista Cargada</span>
          <Button
            v-if="showThirdPartyActions"
            color="primary_fiduciaria"
            label="Agregar"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            colorIcon="white"
            classCustom="custom"
            :outline="false"
            @click="onAddManualEntry"
          />
        </div>
        <TableList
          :loading="thirdPartyTableProps.loading"
          :columns="thirdPartyTableProps.columns"
          :rows="thirdPartyTableProps.rows"
          :custom-columns="['actions']"
        >
          <template #actions="{ row }">
            <Button
              v-if="showThirdPartyActions"
              :left-icon="defaultIconsLucide.delete"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="onDeleteRow(row)"
            />
          </template>
        </TableList>
      </section>
    </q-form>
  </div>
</template>

<script setup lang="ts">
// components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import {
  IOwnListForm,
  IOwnListThirdPartyFile,
  IOwnListFileUploadStatus,
  IOwnListLoadedListItem,
} from '@/interfaces/customs/sarlaft/OwnList'

// composables
import { useRules } from '@/composables/useRules'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic
import { useBasicDataForm } from '@/components/Forms/Sarlaft/OwnList/Forms/v1/BasicDataForm/BasicDataForm'

const props = withDefaults(
  defineProps<{
    formType: ActionType
    data?: IOwnListForm | null
    showFileUpload?: boolean
    showThirdPartyTable?: boolean
    filesSelected?: IOwnListThirdPartyFile | null
    fileProcessingStatus?: IOwnListFileUploadStatus | null
    loadedThirdPartyData?: IOwnListLoadedListItem[]
    showTableActions?: boolean
    showThirdPartyActions?: boolean
  }>(),
  {
    showFileUpload: false,
    showThirdPartyTable: false,
    showTableActions: true,
    showThirdPartyActions: true,
    thirdPartyTableLoading: false,
  }
)

const emit = defineEmits<{
  fileAdded: [file: File]
  removeFile: []
  addManualEntry: []
  deleteRow: [row: IOwnListLoadedListItem]
}>()

const {
  formValues,
  formElementRef,
  isValid,
  fileTableProps,
  defaultIconsLucide,
  fileStatus,
  thirdPartyTableProps,
  onFileSelected,
  onRemoveFile,
  onAddManualEntry,
  onDeleteRow,
  validateNameExist,
} = useBasicDataForm(props, emit)

defineExpose({
  validateForm: async () => {
    return await formElementRef.value?.validate()
  },
  formValues,
  isValid,
})
</script>

<style src="./BasicDataForm.scss" lang="scss" scoped></style>
