<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="goToURL('MovementManagementList')"
    >
      <template #addAfter>
        <Button
          v-if="!validatingForm"
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
          :left-img="headerProps.btn.icon"
          @click="handleDownloadTemplate"
        >
          Descargar formato
        </Button>
      </template>

      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
      />

      <VCard>
        <template #content-card>
          <section v-if="!validatingForm" class="q-pa-md">
            <UploadFile
              v-if="tableProps.rows.length === 0"
              ref="attachDocumentRef"
              :title="uploadProps.title"
              :styles-customs="uploadProps.styleCustom"
              :multiple-files="uploadProps.multiple"
              :label-upload-btn="uploadProps.labelBtn"
              :bordered="uploadProps.bordered"
              :accept="uploadProps.accept"
              :class-name-title="uploadProps.classNameTitle"
              :show-preview="false"
              color-icon="orange"
              @added="handleAddFile"
            />

            <section v-else>
              <TableList
                :title="tableProps.title"
                :loading="tableProps.loading"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :pages="tableProps.pages"
                :custom-columns="tableProps.customColumns"
                :hide-bottom="tableProps.hiddeBottom"
              >
                <template #status="{ row }">
                  <ShowStatus
                    statusType="investmentPortfolio"
                    :type="Number(row.status_id)"
                  />
                </template>

                <template #actions="{ row, index }">
                  <!-- Descargar errores -->
                  <Button
                    v-if="row.status_id === 66"
                    :outline="false"
                    :left-icon="defaultIconsLucide.download"
                    color="orange"
                    :flat="true"
                    :class-custom="'custom'"
                    tooltip="Reporte errores"
                    @click="handleDownloadErrors(index)"
                  />

                  <!-- Eliminar -->
                  <Button
                    :outline="false"
                    :left-icon="defaultIconsLucide.trash"
                    color="orange"
                    :flat="true"
                    :class-custom="'custom'"
                    tooltip="Eliminar"
                    @click="openAlertModal('eliminar_archivo', index)"
                  />
                </template>
              </TableList>

              <div class="flex justify-end mt-1">
                <Button
                  :outline="true"
                  label="Cancelar"
                  :color="disableLoad() ? 'grey' : 'orange'"
                  class-custom="custom mr-1"
                  tooltip="Cancelar"
                  :styleContent="{ color: 'black' }"
                  @click="handleCancel"
                />

                <Button
                  :outline="false"
                  label="Cargar"
                  :color="disableLoad() ? 'grey' : 'orange'"
                  class-custom="custom"
                  tooltip="Cargar"
                  :disabled="disableLoad()"
                  @click="openAlertModal('cargo_parcial')"
                />
              </div>
            </section>
          </section>

          <section v-else class="q-pa-md">
            <q-form ref="formBulk">
              <TableList
                :title="tableValidatingProps.title"
                :loading="tableValidatingProps.loading"
                :columns="tableValidatingProps.columns"
                :rows="paginatedRows"
                :pages="tableValidatingProps.pages"
                :custom-columns="tableValidatingProps.customColumns"
                :hide-bottom="tableValidatingProps.hiddeBottom"
                @update-page="updatePage"
                @update-rows-per-page="updatePerPage"
              >
                <template #custom-header-action>
                  <Button
                    :outline="false"
                    label="Agregar"
                    tooltip="Agregar"
                    :left-icon="defaultIconsLucide.plusCircleOutline"
                    color-icon="white"
                    @click="handleAdd"
                  />
                </template>

                <template #name="{ row }">
                  <GenericInputComponent
                    type="text"
                    :default_value="row.name"
                    :required="true"
                    :disabled="false"
                    :rules="[(val: string) => is_required(val, 'El nombre es requerido')]"
                    @update:model-value="row.name = $event"
                  />
                </template>

                <template #disbursement_type="{ row }">
                  <GenericSelectorComponent
                    :default_value="row.disbursement_type"
                    :manual_option="disbursementType"
                    :auto_complete="true"
                    :required="true"
                    :map_options="true"
                    :rules="[(val: string) => is_required(val, 'El tipo de desembolso es requerido')]"
                    @update:model-value="row.disbursement_type = $event"
                  />
                </template>

                <template #has_handle_budget="{ row }">
                  <div class="q-pa-sm flex items-center justify-center">
                    <SwitchComponent
                      :model-value="Boolean(row.has_handle_budget)"
                      :disable="false"
                      color="orange"
                      @update:model-value="handleBudgetChange($event, row)"
                    />
                  </div>
                </template>

                <template #budget_reference_document_type_id="{ row }">
                  <GenericSelectorComponent
                    ref="selectorBudgetReference"
                    :default_value="row.budget_reference_document_type_id"
                    :manual_option="budget_document_transfer_type"
                    :auto_complete="true"
                    :required="!!row.has_handle_budget"
                    :disabled="!row.has_handle_budget"
                    :map_options="true"
                    :rules="[(val: string) => is_required(val, 'El documento presupuestal a referenciar es requerido')]"
                    @update:model-value="
                      row.budget_reference_document_type_id = $event
                    "
                  />
                </template>

                <template #budget_generate_document_type_id="{ row }">
                  <GenericSelectorComponent
                    ref="selectorBudgetGenerateDocument"
                    :default_value="row.budget_generate_document_type_id"
                    :manual_option="budget_document_transfer_type"
                    :auto_complete="true"
                    :required="!!row.has_handle_budget"
                    :disabled="!row.has_handle_budget"
                    :map_options="true"
                    :rules="[(val: string) => is_required(val, 'El documento presupuestal a generar es requerido')]"
                    @update:model-value="
                      row.budget_generate_document_type_id = $event
                    "
                  />
                </template>

                <template #budget_generate_movement_id="{ row }">
                  <GenericSelectorComponent
                    ref="selectorBudgetGenerateMovement"
                    :default_value="row.budget_generate_movement_id"
                    :manual_option="code_movements_types_contracting"
                    :auto_complete="true"
                    :required="!!row.has_handle_budget"
                    :disabled="!row.has_handle_budget"
                    :map_options="true"
                    :rules="[(val: string) => is_required(val, 'El movimiento presupuestal a generar es requerido')]"
                    @update:model-value="
                      row.budget_generate_movement_id = $event
                    "
                  />
                </template>

                <template #has_requests_invoice="{ row }">
                  <div class="q-pa-sm flex items-center justify-center">
                    <SwitchComponent
                      :model-value="Boolean(row.has_requests_invoice)"
                      :disable="false"
                      color="orange"
                      @update:model-value=""
                    />
                  </div>
                </template>

                <template #has_contract_execution="{ row }">
                  <div class="q-pa-sm flex items-center justify-center">
                    <SwitchComponent
                      :model-value="Boolean(row.has_contract_execution)"
                      :disable="false"
                      color="orange"
                      @update:model-value=""
                    />
                  </div>
                </template>

                <template #has_validates_final_act="{ row }">
                  <div class="q-pa-sm flex items-center justify-center">
                    <SwitchComponent
                      :model-value="Boolean(row.has_validates_final_act)"
                      :disable="false"
                      color="orange"
                      @update:model-value=""
                    />
                  </div>
                </template>

                <template #has_generates_accrual="{ row }">
                  <div class="q-pa-sm flex items-center justify-center">
                    <SwitchComponent
                      :model-value="Boolean(row.has_generates_accrual)"
                      :disable="false"
                      color="orange"
                      @update:model-value="handleAccrualChange($event, row)"
                    />
                  </div>
                </template>

                <template #has_generates_treasury="{ row }">
                  <div class="q-pa-sm flex items-center justify-center">
                    <SwitchComponent
                      :model-value="Boolean(row.has_generates_treasury)"
                      :disable="false"
                      color="orange"
                      @update:model-value="handleTreasuryChange($event, row)"
                    />
                  </div>
                </template>

                <template #has_amortizes_fund="{ row }">
                  <div class="q-pa-sm flex items-center justify-center">
                    <SwitchComponent
                      :model-value="Boolean(row.has_amortizes_fund)"
                      :disable="false"
                      color="orange"
                      @update:model-value="handleAmortizeChange($event, row)"
                    />
                  </div>
                </template>

                <template #fund_movement_code_id="{ row }">
                  <GenericSelectorComponent
                    ref="selectorFundMovement"
                    :default_value="row.fund_movement_code_id"
                    :manual_option="movements_codes_nfi"
                    :auto_complete="true"
                    :required="!!row.has_amortizes_fund"
                    :disabled="!row.has_amortizes_fund"
                    :map_options="true"
                    :rules="[(val: string) => is_required(val, 'El código de movimiento de fondo es requerido')]"
                    @update:model-value="row.fund_movement_code_id = $event"
                  />
                </template>

                <template #accounting_accrual_subtype_id="{ row }">
                  <GenericSelectorComponent
                    ref="selectorSubtype"
                    :default_value="row.accounting_accrual_subtype_id"
                    :manual_option="sub_receipt_types_voucher"
                    :auto_complete="true"
                    :required="!!row.has_generates_accrual"
                    :disabled="!row.has_generates_accrual"
                    :map_options="true"
                    :rules="[(val: string) => is_required(val, 'El subtipo de comprobante contable causación es requerido')]"
                    @update:model-value="
                      row.accounting_accrual_subtype_id = $event
                    "
                  />
                </template>

                <template #treasury_funds_payment_movement_id="{ row }">
                  <GenericSelectorComponent
                    ref="selectorTreasuryFunds"
                    :default_value="row.treasury_funds_payment_movement_id"
                    :manual_option="treasury_movement_codes"
                    :auto_complete="true"
                    :required="!!row.has_generates_treasury"
                    :disabled="!row.has_generates_treasury"
                    :map_options="true"
                    :rules="[(val: string) => is_required(val, 'El movimiento de tesorería pagos fondo es requerido')]"
                    @update:model-value="
                      row.treasury_funds_payment_movement_id = $event
                    "
                  />
                </template>

                <template #treasury_bank_payment_movement_id="{ row }">
                  <GenericSelectorComponent
                    ref="selectorTreasuryBank"
                    :default_value="row.treasury_bank_payment_movement_id"
                    :manual_option="treasury_movement_codes"
                    :auto_complete="true"
                    :required="!!row.has_generates_treasury"
                    :disabled="!row.has_generates_treasury"
                    :map_options="true"
                    :rules="[(val: string) => is_required(val, 'El movimiento de tesorería pagos cuentas bancarias es requerido')]"
                    @update:model-value="
                      row.treasury_bank_payment_movement_id = $event
                    "
                  />
                </template>

                <template #status>
                  <CustomToggle
                    :value="true"
                    :width="100"
                    :height="30"
                    checked-text="Activo"
                    unchecked-text="Inactivo"
                    readonly
                  />
                </template>

                <template #actions="{ index }">
                  <Button
                    :outline="false"
                    :left-icon="defaultIconsLucide.trash"
                    color="orange"
                    :flat="true"
                    :class-custom="'custom'"
                    tooltip="Eliminar"
                    @click="handleDelete(index)"
                  />
                </template>
              </TableList>
            </q-form>

            <div class="flex justify-end mt-1">
              <Button
                :outline="false"
                label="Crear"
                color="orange"
                class-custom="custom"
                tooltip="Crear"
                @click="handleCreate"
              />
            </div>
          </section>
        </template>
      </VCard>

      <AlertModalComponent
        ref="alertModalRef"
        :title="alertModalConfig.title"
        :description_message="alertModalConfig.description"
        :showBtnConfirm="true"
        :textBtnConfirm="'Aceptar'"
        :textBtnCancel="'Cancelar'"
        :showCloseBtn="true"
        :showImgDefault="false"
        @confirm="handleConfirm"
      >
        <template #default-img>
          <q-img
            v-if="alertModalConfig.type === 'eliminar_archivo'"
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
            alt="Imagen de alerta"
          />
          <q-img
            v-else
            src="@/assets/images/icons/alert_popup.svg"
            max-width="80px"
            width="80px"
            fit="contain"
            alt="Imagen de alerta"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import SwitchComponent from '@/components/common/Switch/SwitchComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// logic view
import useMovementManagementImport from './MovementManagementImport'

const {
  // configs
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  uploadProps,
  tableProps,
  alertModalRef,
  alertModalConfig,
  tableValidatingProps,
  paginatedRows,

  // refs
  validatingForm,
  selectorBudgetReference,
  selectorBudgetGenerateDocument,
  selectorBudgetGenerateMovement,
  selectorFundMovement,
  selectorSubtype,
  selectorTreasuryFunds,
  selectorTreasuryBank,
  formBulk,

  // selects
  disbursementType,
  budget_document_transfer_type,
  code_movements_types_contracting,
  sub_receipt_types_voucher,
  treasury_movement_codes,
  movements_codes_nfi,

  // utils
  defaultIconsLucide,
  is_required,

  // methods
  handleDownloadTemplate,
  handleDownloadErrors,
  handleAddFile,
  openAlertModal,
  handleConfirm,
  disableLoad,
  handleCancel,
  handleCreate,
  handleDelete,
  handleAdd,
  handleBudgetChange,
  handleAccrualChange,
  handleTreasuryChange,
  handleAmortizeChange,
  updatePage,
  updatePerPage,
  goToURL,
} = useMovementManagementImport()
</script>
