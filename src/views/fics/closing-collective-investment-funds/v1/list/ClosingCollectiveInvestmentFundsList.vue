<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filtersRef"
          :fields="filterConfig"
          @filter="handlerFilter"
          @clear-filters="_cleanData"
          @update:values="handlerFieldChange"
        />
      </section>

      <section class="q-mt-md">
        <h6 class="text-weight-bold">Fondos con tipo de participación</h6>

        <FiltersComponentV2
          ref="filtersRefParticipation"
          :fields="filterConfigParticipation"
          @filter="handlerFilterParticipation"
          @clear-filters="handlerCleanDataFiltersParticipationType"
          @update:values="handlerFieldChangeParticipationTypes"
        />
      </section>
      <NoDataState v-if="selectedRows.length === 0" type="empty" />

      <VCard v-else>
        <template #content-card>
          <div class="q-pa-md">
            <TableList
              hidePagination
              :loading="tablePropsTypeofParticipation.loading"
              :rows="tablePropsTypeofParticipation.rows"
              :columns="tablePropsTypeofParticipation.columns"
              :custom-columns="['select']"
              :rowsPerPageOptions="[0]"
            >
              <template #select="{ row }">
                <div class="px-1 flex justify-center">
                  <q-radio
                    dense
                    size="sm"
                    v-model="selectedParticipationId"
                    :val="row.id"
                    color="orange"
                    @click="selectedRadioFund = row"
                  />
                </div>
              </template>
            </TableList>
          </div>
        </template>
      </VCard>

      <VCard>
        <template #content-card>
          <q-form ref="formAddMovementsTable">
            <div class="q-pa-md">
              <TableList
                v-if="movementsImportBach.length > 0"
                hidePagination
                class="editable-table"
                :title="tablePropsMovementsBach.title"
                :loading="tablePropsMovementsBach.loading"
                :rows="tablePropsMovementsBach.rows"
                :columns="tablePropsMovementsBach.columns"
                :custom-columns="['actions']"
                :rowsPerPageOptions="[0]"
              >
                <template #custom-header-action>
                  <div class="q-px-xs">
                    <Button
                      v-if="
                        validateRouter(
                          'Fics',
                          'ClosingCollectiveInvestmentFundsList',
                          'process'
                        )
                      "
                      :outline="true"
                      label="Sincronizar"
                      :left-icon="defaultIconsLucide.cached"
                      @click="onSynchronize"
                    />
                  </div>

                  <div class="q-px-xs">
                    <Button
                      v-if="
                        validateRouter(
                          'Fics',
                          'ClosingCollectiveInvestmentFundsList',
                          'action_import'
                        )
                      "
                      :outline="false"
                      label="Importar"
                      :left-icon="defaultIconsLucide.cloudUpload"
                      color="orange"
                      :class-custom="'custom'"
                      :disabled="!!selectedFundlId"
                      @click="actionTableHeaderButton('import')"
                    />
                  </div>
                </template>

                <template #actions="{ row }">
                  <!-- Ver -->
                  <Button
                    v-if="
                      validateRouter(
                        'Fics',
                        'ClosingCollectiveInvestmentFundsList',
                        'undo'
                      )
                    "
                    :left-icon="defaultIconsLucide.delete"
                    color="orange"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    tooltip="eliminar"
                    @click="actionsOptions('delete', row)"
                  />
                </template>
              </TableList>
              <TableList
                v-else
                hidePagination
                class="editable-table"
                :title="tablePropsMovements.title"
                :loading="tablePropsMovements.loading"
                :rows="tablePropsMovements.rows"
                :columns="tablePropsMovements.columns"
                :custom-columns="['movement_id', 'movement_value', 'actions']"
                :rowsPerPageOptions="[0]"
              >
                <template #custom-header-action>
                  <div class="q-px-xs">
                    <Button
                      :outline="true"
                      label="Sincronizar"
                      :left-icon="defaultIconsLucide.cached"
                      @click="onSynchronize"
                      :disabled="disablebBtnRegistro"
                    />
                  </div>

                  <div class="q-px-xs">
                    <Button
                      :outline="false"
                      label="Importar"
                      :left-icon="defaultIconsLucide.cloudUpload"
                      color="orange"
                      :class-custom="'custom'"
                      :disabled="
                        !!selectedFundlId ||
                        tablePropsMovements.rows.length > 0 ||
                        statusAllPending
                      "
                      @click="actionTableHeaderButton('import')"
                    />
                  </div>

                  <div class="q-px-xs">
                    <Button
                      :outline="false"
                      label="Agregar"
                      :left-icon="defaultIconsLucide.plusCircle"
                      :disabled="!selectedParticipationId || statusAllPending"
                      @click="actionTableHeaderButton('add')"
                    />
                  </div>
                </template>
                <template #movement_id="{ row }">
                  <GenericSelectorComponent
                    return_object
                    :manual_option="movement_codes_close_list"
                    :map_options="true"
                    :required="true"
                    :default_value="row.movement_id"
                    auto_complete
                    :clearable="true"
                    :disabled="disablebBtnRegistro"
                    display_value="value"
                    display_label="value_label"
                    first_filter_option="value_label"
                    second_filter_option="code"
                    @update:modelValue="
                      ($event) => {
                        if ($event) {
                          if (validateDuplicateIds(row, $event)) return
                          row.id = $event.value
                          row.movement_id = $event.value
                          row.movement_description = $event.label
                          row.income_expense =
                            $event.movement_nature_description
                        } else {
                          row.id = undefined
                          row.movement_id = undefined
                          row.movement_description = undefined
                          row.income_expense = undefined
                        }
                      }
                    "
                    :rules="[
                      (v: string) =>
                        useRules().is_required(v, 'El campo es requerido'),
                    ]"
                  />
                </template>

                <template #movement_value="{ row }">
                  <CurrencyInput
                    v-model="row.movement_value"
                    :currency="'COP'"
                    :placeholder="''"
                    currencyLabel=""
                    @update:modelValue="row.movement_value = $event"
                    :rules="[
                      (val: string) => useRules().is_required(val, ''),
                      (val: string) => useRules().max_length(val, 17),
                      (val: string) => useRules().min_length(val, 1),
                    ]"
                    :disabled="disablebBtnRegistro"
                  />
                </template>

                <template #actions="{ row }">
                  <!-- Ver -->
                  <Button
                    :left-icon="defaultIconsLucide.delete"
                    color="orange"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    tooltip="eliminar"
                    @click="actionsOptions('delete', row)"
                  />
                </template>
              </TableList>
            </div>

            <section class="mx-2 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="true"
                  :class-custom="'custom'"
                  label="Deshacer cierre"
                  size="md"
                  color="orange"
                  @click="onUndoClosure"
                  :disabled="buttonsDisabled.undoClosure || disablebBtnRegistro"
                />
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Procesar cierre"
                  size="md"
                  color="orange"
                  @click="onConfirmProcessClosure"
                  :disabled="
                    buttonsDisabled.processClosure || disablebBtnRegistro
                  "
                />
              </div>
            </section>
          </q-form>
        </template>
      </VCard>
    </ContentComponent>
  </div>

  <AlertModalComponent
    ref="alertModalRef"
    styleModal="max-width: 1200px; width: 100%;"
    :showImgDefault="false"
    :showCloseBtn="true"
    :disableConfirm="flagStatusFunds"
    @confirm="confirmModalCollectiveFunds()"
  >
    <template #default-body>
      <section class="q-mx-xl">
        <h6 class="no-margin text-weight-bold">Fondos de inversión</h6>
        <TableList
          hidePagination
          :loading="tablePropsModal.loading"
          :rows="tablePropsModal.rows"
          :columns="tablePropsModal.columns"
          :custom-columns="['last_closing_date', 'status']"
          selection="multiple"
          @update:selected="onUpdateSelected"
          :row-key="'fund_code'"
          :rowsPerPageOptions="[0]"
          :class="{ 'hide-select-all': statusMixed }"
        >
          <template #last_closing_date="{ row }">
            <span v-if="row.last_closing_date != 'Sin datos'">
              {{ useUtils().formatDate(row.last_closing_date, 'YYYY-MM-DD') }}
            </span>
            <span v-else>{{ row.last_closing_date }}</span>
          </template>

          <template #status="{ row }">
            <ShowStatus
              :type="row.status.id"
              status-type="ficsClosingFunds"
              class-custom="q-px-sm q-py-xs"
            />
          </template>
        </TableList>
      </section>
    </template>
  </AlertModalComponent>

  <AlertModalComponent
    ref="alertModalImportRef"
    styleModal="max-width: 1200px; width: 100%;"
    :showImgDefault="false"
    :showBtnCancel="!flagStatusProgress"
    :text-btn-confirm="flagStatusProgress ? 'Validar Cargue' : 'Cargar'"
    @confirm="
      flagStatusProgress
        ? handlerImportBachMovementsValidation()
        : openAlertModalConfirmValidateProcessImport()
    "
    @close="handleCancelImportBachMovements()"
  >
    <template #default-body>
      <section class="q-mx-xl">
        <div class="row">
          <h6 class="titleModal text-weight-bold col-auto no-margin">
            Importar
          </h6>
          <div class="col"></div>
          <Button
            class="col-auto"
            :outline="true"
            label="Descargar excel"
            @click="downloadTemplate"
            :leftImg="excelIcon"
            tooltip="Descargar excel"
          />
        </div>
        <div class="col-12 q-py-lg q-pa-sm">
          <UploadFile
            ref="attachFilesRef"
            labelUploadBtn="Seleccione los archivos para subir"
            classNameTitle="text-weight-medium text-grey-6 mb-0 text-center"
            accept=".csv, .xlsx"
            :title="null"
            :showNameFile="false"
            :showBorder="false"
            :stylesCustoms="styleCustomAttachFile"
            @added="addedFiles"
            @rejected="rejectedFiles"
            @removed="removeFile"
          />
        </div>

        <div>
          <TableList
            v-if="tablePropertiesUploadFiles.rows.length > 0"
            hidePagination
            :loading="tablePropertiesUploadFiles.loading"
            :rows="tablePropertiesUploadFiles.rows"
            :columns="tablePropertiesUploadFiles.columns"
            :custom-columns="['last_closing_date', 'status']"
            :row-key="'fund_code'"
            :rowsPerPageOptions="[0]"
          >
            <template #status="{ row }">
              <ShowStatus
                :type="row.status"
                status-type="ficsClosingFunds"
                class-custom="q-px-sm q-py-xs"
              />
            </template>
          </TableList>
        </div>
      </section>
    </template>
  </AlertModalComponent>

  <!-- Modal Confirm -->
  <AlertModalComponent
    ref="alertModalConfirmRef"
    styleModal="min-width: 470px"
    :showImgDefault="false"
    :title="alertModalConfirmConfig.description"
    :description_message="''"
    @confirm="
      movementsImportBach.length == 0
        ? actionsOptions('deleteConfirm')
        : actionsOptions('deleteConfirmBach')
    "
  >
    <template #default-img>
      <q-img
        src="@/assets/images/icons/alert_popup_delete.svg"
        max-width="80px"
        width="80px"
        fit="contain"
      />
    </template>
  </AlertModalComponent>
  <!-- Modal Confirm -->

  <!-- Modal Confirm process-->
  <AlertModalComponent
    ref="alertModalConfirmProcessRef"
    styleModal="min-width: 470px"
    :showImgDefault="false"
    :title="'¿Está seguro que desea continuar con el proceso de cierre?'"
    :description_message="''"
    text-btn-confirm="Continuar cierre"
    text-btn-cancel="Cancelar cierre"
    @confirm="onProcessClosure()"
  >
    <template #default-img>
      <q-img
        src="@/assets/images/icons/alert_popup_delete.svg"
        max-width="80px"
        width="80px"
        fit="contain"
      />
    </template>
  </AlertModalComponent>
  <!-- Modal Confirm -->

  <!-- Modal Confirm process import-->
  <AlertModalComponent
    ref="alertModalConfirmProcessImportRef"
    styleModal="min-width: 470px"
    :showImgDefault="false"
    :title="alertModalConfirmConfigProcessImport.title"
    :description_message="alertModalConfirmConfigProcessImport.description"
    text-btn-confirm="Aceptar"
    text-btn-cancel="Cancelar"
    :showBtnCancel="
      flagStatusProgressError ? flagStatusProgressError : !flagStatusProgress
    "
    @confirm="saveImportBachMovements()"
  >
    <template #default-img>
      <q-img
        src="@/assets/images/icons/alert_popup_delete.svg"
        max-width="80px"
        width="80px"
        fit="contain"
      />
    </template>
  </AlertModalComponent>
  <!-- Modal Confirm -->

  <!-- Modal Confirm process import-->
  <AlertModalComponent
    ref="alertModalConfirmValidateProcessImportRef"
    styleModal="min-width: 470px"
    :showImgDefault="false"
    :title="'¿Estás seguro de realizar el cargue?'"
    :description_message="''"
    text-btn-confirm="Aceptar"
    text-btn-cancel="Cancelar"
    :showCloseBtn="!flagStatusProgress"
    @confirm="handlerImportBachMovements()"
  >
    <template #default-img>
      <q-img
        src="@/assets/images/icons/alert_popup_delete.svg"
        max-width="80px"
        width="80px"
        fit="contain"
      />
    </template>
  </AlertModalComponent>
  <!-- Modal Confirm -->

  <!-- Modal Confirm Undo Closure -->
  <AlertModalComponent
    ref="alertModalUndoClosureRef"
    styleModal="min-width: 470px"
    :showImgDefault="false"
    :title="undoClosureFundsText"
    :description_message="''"
    text-btn-confirm="Aceptar"
    text-btn-cancel="Cancelar"
    @confirm="onConfirmUndoClosure()"
  >
    <template #default-img>
      <q-img
        src="@/assets/images/icons/alert_popup_delete.svg"
        max-width="80px"
        width="80px"
        fit="contain"
      />
    </template>
  </AlertModalComponent>
  <!-- Modal Confirm -->

  <!-- Modal Confirm Undo Closure Monetary -->
  <AlertModalComponent
    ref="alertModalUndoClosureMonetaryRef"
    styleModal="min-width: 470px"
    :showImgDefault="false"
    :title="'Hay operaciones monetarias realizadas después del cierre, ¿Desea continuar?'"
    :description_message="''"
    text-btn-confirm="Aceptar"
    text-btn-cancel="Cancelar"
    @confirm="onConfirmUndoClosureMonetary()"
  >
    <template #default-img>
      <q-img
        src="@/assets/images/icons/alert_popup_delete.svg"
        max-width="80px"
        width="80px"
        fit="contain"
      />
    </template>
  </AlertModalComponent>
  <!-- Modal Confirm -->
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic view
import useClosingCollectiveInvestmentFundsList from '@/views/fics/closing-collective-investment-funds/v1/list/ClosingCollectiveInvestmentFundsList'

const {
  headerProps,
  filterConfig,
  filterConfigParticipation,
  disablebBtnRegistro,
  filtersRef,
  filtersRefParticipation,
  alertModalRef,
  alertModalImportRef,
  alertModalConfirmRef,
  alertModalConfirmProcessRef,
  alertModalConfirmProcessImportRef,
  alertModalConfirmValidateProcessImportRef,
  alertModalUndoClosureRef,
  alertModalUndoClosureMonetaryRef,
  attachFilesRef,
  alertModalConfirmConfig,
  alertModalConfirmConfigProcessImport,
  undoClosureFundsText,
  movement_codes_close_list,
  movementsImportBach,
  buttonsDisabled,
  //Tables
  tablePropsModal,
  tablePropertiesUploadFiles,
  tablePropsTypeofParticipation,
  tablePropsMovements,
  tablePropsMovementsBach,
  selectedFundlId,
  selectedParticipationId,
  styleCustomAttachFile,
  defaultIconsLucide,
  formAddMovementsTable,
  selectedRows,
  selectedRadioFund,
  statusMixed,
  flagStatusFunds,
  statusAllPending,

  //Methods
  useRules,
  validateDuplicateIds,
  handlerFilter,
  handlerFilterParticipation,
  handlerFieldChange,
  handlerFieldChangeParticipationTypes,
  handlerCleanDataFiltersParticipationType,
  _cleanData,
  actionsOptions,
  actionTableHeaderButton,
  addedFiles,
  removeFile,
  rejectedFiles,
  onUpdateSelected,
  confirmModalCollectiveFunds,
  downloadTemplate,
  handlerImportBachMovements,
  handlerImportBachMovementsValidation,
  handleCancelImportBachMovements,
  openAlertModalConfirmValidateProcessImport,
  saveImportBachMovements,
  onSynchronize,
  onConfirmProcessClosure,
  onProcessClosure,
  onUndoClosure,
  onConfirmUndoClosure,
  onConfirmUndoClosureMonetary,
  validateRouter,
  useUtils,
  flagStatusProgress,
  flagStatusProgressError,
} = useClosingCollectiveInvestmentFundsList()
</script>

<style lang="scss" src="./ClosingCollectiveInvestmentFundsList.scss" scoped />
