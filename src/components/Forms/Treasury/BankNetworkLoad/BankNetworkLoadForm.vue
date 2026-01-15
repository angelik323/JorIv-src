<template>
  <div>
    <q-form ref="bankNetworkLoadForm" class="q-pa-lg">
      <div class="form-section">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              :disabled="['view'].includes(action)"
              :default_value="models.type"
              :manual_option="banking_network_upload_request_types"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => useRules().is_required(val)]"
              @update:model-value="models.type = $event"
              label="Tipo de solicitud"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              :disabled="['view'].includes(action)"
              :default_value="models.office_id"
              :manual_option="offices"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[]"
              @update:model-value="models.office_id = $event"
              label="Oficina"
            />
          </div>
        </div>
        <br />

        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              :default_value="models.business_id"
              :manual_option="filteredBusiness"
              :auto_complete="true"
              :required="!!showBusinessFields"
              :map_options="true"
              :disabled="!showBusinessFields || ['view'].includes(action)"
              :rules="[]"
              @update:model-value="models.business_id = $event"
              label="Negocio"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericInput
              placeholder="-"
              :required="false"
              :default_value="models.business_name ?? ''"
              @update:modelValue="models.business_name = $event"
              label="Nombre negocio"
              disabled
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericDateInputComponent
              :disabled="true"
              label="Fecha de cierre tesorería"
              :default_value="models.closing_date"
              :required="false"
              :rules="
                models.closing_date
                  ? [
                      (val: string) =>
                        useRules().date_before_or_equal_to_the_current_date(
                          val
                        ),
                    ]
                  : []
              "
              @update:modelValue="models.closing_date = $event"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericDateInputComponent
              :disabled="['view'].includes(action)"
              label="Fecha de cargue"
              :default_value="models.upload_date"
              :required="false"
              :rules="[
                (val: string) =>
                  useRules().date_before_or_equal_to_the_current_date(val),
              ]"
              @update:modelValue="models.upload_date = $event"
              :navigation_max_year="new Date().getFullYear().toString()"
              :navigation_min_year="'1000/01'"
              :option_calendar="
                ($event) => useUtils().isDateAllowed($event, holidays)
              "
              :onNavigation="handlerHolidays"
            />
          </div>
        </div>
        <br />

        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              :disabled="
                (models.type !== 'Multicash' && !models.business_id) ||
                ['view'].includes(action)
              "
              :default_value="models.bank_id"
              :manual_option="banks"
              :auto_complete="true"
              :required="false"
              :map_options="true"
              :rules="[(val: string) => useRules().is_required(val)]"
              @update:model-value="models.bank_id = $event"
              label="Banco"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericInput
              placeholder="-"
              :required="false"
              :default_value="models.bank_name ?? ''"
              @update:modelValue="models.bank_name = $event"
              label="Nombre banco"
              disabled
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              :default_value="models.format_id"
              :manual_option="bank_structures"
              :auto_complete="true"
              :required="false"
              :map_options="true"
              :disabled="!models.bank_id || ['view'].includes(action)"
              :rules="[(val: string) => useRules().is_required(val)]"
              @update:model-value="models.format_id = $event"
              label="Formato"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericInput
              placeholder="-"
              :required="false"
              :default_value="models.format_name ?? ''"
              @update:modelValue="models.format_name = $event"
              label="Nombre formato"
              disabled
            />
          </div>
        </div>
        <br />

        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              :default_value="models.bank_account_id"
              :manual_option="bank_account"
              :auto_complete="true"
              :required="!!showBankAccountField"
              :map_options="true"
              :disabled="
                !showBankAccountField ||
                !models.bank_id ||
                ['view'].includes(action)
              "
              :rules="[(val: string) => useRules().is_required(val)]"
              @update:model-value="models.bank_account_id = $event"
              label="Cuenta bancaria"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericInput
              placeholder="-"
              :required="false"
              :default_value="models.bank_account_name ?? ''"
              @update:modelValue="models.bank_account_name = $event"
              label="Nombre cuenta banco"
              disabled
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              :default_value="models.treasury_movement_code_id"
              :manual_option="treasury_movement_codes"
              :auto_complete="true"
              :required="false"
              :map_options="true"
              :disabled="
                (!showBankAccountField && models.type !== 'Multicash') ||
                ['view'].includes(action)
              "
              :rules="[]"
              @update:model-value="models.treasury_movement_code_id = $event"
              label="Movimiento*"
            />
          </div>
        </div>
        <br />

        <section
          style="text-align: right !important"
          v-if="!['view'].includes(action)"
        >
          <Button
            label="Descargar plantilla"
            :size="'md'"
            :unelevated="true"
            :outline="true"
            :color="'orange'"
            :class="'text-capitalize btn-filter custom'"
            :style-text="'color:black;'"
            :disabled="!canDownloadTemplate"
            @click="downloadTemplate"
          />
        </section>

        <section v-if="!['view'].includes(action)" class="q-mt-lg">
          <UploadFile
            ref="attachDocumentRef"
            :title="uploadProps.title"
            :styles-customs="uploadProps.styleCustom"
            :multiple-files="uploadProps.multiple"
            :label-upload-btn="uploadProps.labelBtn"
            :bordered="uploadProps.bordered"
            :accept="uploadProps.accept"
            :showBorder="uploadProps.showBorder"
            :showNameFile="true"
            :showPreview="true"
            color-icon="orange"
            @added="addedFiles"
            @rejected="rejectedFiles"
            @removed="removeFile"
          />

          <div
            v-if="
              statusImport && currentFile && models.documentFiles.length > 0
            "
            :key="currentFile?.name || Date.now()"
            class="q-mt-md q-pa-md"
            style="
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              background-color: #f8f9fa;
            "
          >
            <div class="row items-center justify-between">
              <div class="col">
                <div class="text-weight-bold text-body2 q-mb-xs">
                  Archivo Cargado
                </div>
                <div class="text-body2 q-mb-xs">
                  <strong>Ruta:</strong> {{ getFilePath(currentFile) }}
                </div>
                <div
                  v-if="['create'].includes(action)"
                  class="text-body2 q-mb-xs"
                >
                  <strong>Tamaño:</strong>
                  {{ formatFileSize(currentFile.size) }}
                </div>
                <div v-if="['create'].includes(action)" class="text-body2">
                  <strong>Tipo:</strong>
                  {{ getFileExtension(currentFile.name) }}
                </div>
              </div>
            </div>
          </div>
        </section>
        <br />

        <section v-if="statusImport && fileTableProps.rows.length > 0">
          <TableList
            :loading="fileTableProps.loading"
            :columns="fileTableProps.columns"
            :rows="fileTableProps.rows"
            :pages="fileTableProps.pages"
            :custom-columns="['actions']"
          >
            <template #actions="{ row }">
              <Button
                :disabled="['view'].includes(action)"
                :left-icon="defaultIconsLucide.delete"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                tooltip="Eliminar"
                @click="removeFileFromTable(row.id)"
              />
            </template>
          </TableList>
        </section>
        <br />

        <section
          style="text-align: right !important"
          v-if="!['view'].includes(action)"
        >
          <Button
            :outline="false"
            class-custom="custom"
            label="Cargar"
            size="md"
            :disabled="!canSubmitForm"
            @click="onClickLoad"
            color="orange"
          />
        </section>

        <section v-if="statusImport" class="q-mt-xl q-pt-xl">
          <Statistics :stats="statsProps ?? []" />
        </section>

        <section v-if="statusImport" class="q-mt-xl">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6">Listado de cargue de red bancaria</div>

            <div class="row q-gutter-sm">
              <Button
                v-if="!['view'].includes(action)"
                label="Validar"
                :size="'md'"
                :unelevated="true"
                :outline="false"
                :disabled="isValidated"
                :class="'text-capitalize btn-filter custom'"
                @click="validate"
              />
              <Button
                v-if="!['view'].includes(action)"
                :disabled="!hasErrorRecords"
                label="Reporte errores"
                :size="'md'"
                :unelevated="true"
                :outline="true"
                :color="'negative'"
                :class="'text-capitalize btn-filter custom'"
                @click="generateErrorReport"
              />
            </div>
          </div>

          <TableList
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['status']"
          >
            <template #status="{ row }">
              <ShowStatus :type="row.status" status-type="treasury" />
            </template>
          </TableList>

          <section class="q-mt-lg" style="text-align: right !important">
            <Button
              v-if="['create', 'edit'].includes(action)"
              :outline="false"
              class-custom="custom"
              label="Procesar"
              size="md"
              :disabled="!canProcessNetwork"
              :loading="isProcessingNetwork"
              @click="onClickProcess"
            />
            <Button
              v-if="['view'].includes(action)"
              :outline="false"
              color="orange"
              class-custom="custom"
              label="Finalizar"
              size="md"
              @click="goToURL('BankNetworkLoadList')"
            />
          </section>
        </section>
      </div>
    </q-form>

    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 470px"
      :showImgDefault="false"
      :title="alertModalConfig.title"
      :description_message="alertModalConfig.description"
      @confirm="confirmProcessWithErrors"
    >
      <template #default-img>
        <q-img
          src="@/assets/images/icons/alert_popup.svg"
          max-width="80px"
          width="80px"
          fit="contain"
        />
      </template>
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import Statistics from '@/components/common/Statistics/Statistics.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Composables & Utils
import { useRules } from '@/composables'
import { defaultIconsLucide } from '@/utils'

// Interfaces
import { IBankNetworkLoadModel } from '@/interfaces/customs/treasury/BankNetworkLoad'
import { ActionType } from '@/interfaces/global'

// Logic
import useBankNetworkLoadForm from '@/components/Forms/Treasury/BankNetworkLoad/BankNetworkLoadForm'

const props = defineProps<{
  action: ActionType
  data?: IBankNetworkLoadModel
  readonly?: boolean
}>()

const {
  models,
  banks,
  offices,
  banking_network_upload_request_types,
  bank_account,
  filteredBusiness,
  bank_structures,
  showBusinessFields,
  showBankAccountField,
  addedFiles,
  rejectedFiles,
  uploadProps,
  attachDocumentRef,
  onClickLoad,
  tableProps,
  statusImport,
  canSubmitForm,
  canDownloadTemplate,
  downloadTemplate,
  removeFile,
  currentFile,
  formatFileSize,
  getFileExtension,
  getFilePath,
  fileTableProps,
  removeFileFromTable,
  hasErrorRecords,
  generateErrorReport,
  onClickProcess,
  canProcessNetwork,
  isProcessingNetwork,
  alertModalRef,
  alertModalConfig,
  confirmProcessWithErrors,
  validate,
  statsProps,
  goToURL,
  useUtils,
  holidays,
  handlerHolidays,
  treasury_movement_codes,
  isValidated,
} = useBankNetworkLoadForm(props)
</script>
