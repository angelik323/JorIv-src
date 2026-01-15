<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('PaymentConceptsList')"
    >
      <template #addAfter>
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
          :left-img="imgButtonHeaderTable"
          @click="handleDownloadTemplate"
        >
          Descargar formato
        </Button>
      </template>

      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <section class="q-pa-md">
              <section v-if="tablePropsValidatedRows.rows.length === 0">
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

                <TableList
                  v-else
                  :title="tableProps.title"
                  :loading="tableProps.loading"
                  :columns="tableProps.columns"
                  :rows="tableProps.rows"
                  :pages="tableProps.pages"
                  :custom-columns="['status', 'actions']"
                  :hide-bottom="tableProps.hiddeBottom"
                >
                  <template #status="{ row }">
                    <ShowStatus
                      statusType="investmentPortfolio"
                      :type="Number(row.status_id)"
                    />
                  </template>
                  <template #actions="{ row }">
                    <!-- Descargar errores -->
                    <Button
                      v-if="row.status_id === 66"
                      :outline="false"
                      :left-icon="defaultIconsLucide.download"
                      color="orange"
                      :flat="true"
                      :class-custom="'custom'"
                      tooltip="Reporte errores"
                      @click="handleDownloadErrors"
                    />
                    <!-- Eliminar -->
                    <Button
                      :outline="false"
                      :left-icon="defaultIconsLucide.trash"
                      :disabled="validatingFiles"
                      color="orange"
                      :flat="true"
                      :class-custom="'custom'"
                      tooltip="Eliminar"
                      @click="openAlertModal('eliminar_archivo')"
                    />
                  </template>
                </TableList>

                <section class="mx-2 mb-2">
                  <div class="q-mt-lg flex q-gutter-x-md justify-end">
                    <Button
                      v-if="validatingFiles"
                      label="Cancelar"
                      size="md"
                      unelevated
                      :outline="true"
                      color="orange"
                      :style-text="{ color: '#333', fontWeight: 'bold' }"
                      class="text-capitalize btn-filter custom mt-2"
                      @click="handleCancelImport()"
                    />
                    <Button
                      label="Cargar"
                      :disabled="isUploadButtonDisabled"
                      size="md"
                      unelevated
                      :outline="false"
                      color="orange"
                      class="text-capitalize btn-filter custom mt-2"
                      @click="handleLoad"
                    />
                  </div>
                </section>
              </section>
              <section class="detail-table" v-else>
                <q-form ref="basicDataFormRef">
                  <TableList
                    :title="tablePropsValidatedRows.title"
                    :loading="tablePropsValidatedRows.loading"
                    :columns="tablePropsValidatedRows.columns"
                    :rows="tablePropsValidatedRows.rows"
                    :hide-pagination="true"
                    :rows-per-page-options="[0]"
                    :custom-columns="[
                      'structure_code',
                      'structure_purpose',
                      'structure_structure',
                      'concept_code',
                      'concept_name',
                      'concept_type',
                      'nature_type',
                      'activity_type',
                      'obligation_type',
                      'pension_type',
                      'liquidates_taxes',
                      'is_advance',
                      'actions',
                    ]"
                  >
                    <template #custom-header-action>
                      <Button
                        label="Agregar"
                        :icon="defaultIconsLucide.plusCircleOutline"
                        color-icon="white"
                        size="md"
                        :outline="false"
                        @click="handleAddValidatedRow"
                      />
                    </template>
                    <template #structure_code="{ row }">
                      <GenericSelectorComponent
                        :manual_option="account_structures_payment_concepts"
                        :map_options="true"
                        :default_value="row.structure_id"
                        required
                        @update:model-value="
                          changeAccountStructure(row, $event)
                        "
                        :rules="[
                        (val: string) => useRules().is_required(val),
                        ]"
                      />
                    </template>
                    <template #structure_purpose="{ row }">
                      <GenericInputComponent
                        disabled
                        :default_value="row.structure_purpose"
                        required
                      />
                    </template>
                    <template #structure_structure="{ row }">
                      <GenericInputComponent
                        disabled
                        :default_value="row.structure_structure"
                        required
                      />
                    </template>
                    <template #concept_code="{ row }">
                      <GenericInputComponent
                        :default_value="row.concept_code"
                        type="number"
                        required
                        @update:model-value="changeConceptCode(row, $event)"
                        :rules="[
                          (val: string) => useRules().is_required(val),
                          (val: string) => useRules().max_length(val,row.concept_code_length)
                        ]"
                      />
                    </template>
                    <template #concept_name="{ row }">
                      <GenericInputComponent
                        :default_value="row.concept_name"
                        required
                        @update:model-value="row.concept_name = $event"
                        :rules="[
                          (val: string) => useRules().is_required(val),
                          (val: string) => useRules().only_alphanumeric(val),
                          (val: string) => useRules().min_length(val,1),
                          (val: string) => useRules().max_length(val,80)
                        ]"
                      />
                    </template>
                    <template #concept_type="{ row }">
                      <RadioYesNo
                        v-model="row.concept_type"
                        :options="payment_concept_types"
                        @update:model-value="changeConceptType(row, $event)"
                      />
                    </template>
                    <template #nature_type="{ row }">
                      <RadioYesNo
                        v-model="row.nature_type"
                        :options="payment_concept_nature_types"
                      />
                    </template>
                    <template #activity_type="{ row }">
                      <GenericSelectorComponent
                        :manual_option="payment_concept_activity_types"
                        :map_options="true"
                        :default_value="row.activity_type"
                        @update:model-value="row.activity_type = $event"
                        :required="false"
                        :clearable="false"
                        :rules="[]"
                      />
                    </template>
                    <template #obligation_type="{ row }">
                      <GenericSelectorComponent
                        :manual_option="payment_concept_obligation_types"
                        :map_options="true"
                        :default_value="row.obligation_type"
                        @update:model-value="changeObligationType(row, $event)"
                        :required="false"
                        :clearable="false"
                        :rules="[]"
                      />
                    </template>

                    <template #pension_type="{ row }">
                      <GenericSelectorComponent
                        :manual_option="payment_concept_pension_types"
                        :map_options="true"
                        :default_value="row.pension_type"
                        @update:model-value="row.pension_type = $event"
                        :disabled="row.disabled_pension_type"
                        :required="!row.disabled_pension_type"
                        :rules="!row.disabled_pension_type?[(val: string) => useRules().is_required(val,'')]:[]"
                      />
                    </template>
                    <template #liquidates_taxes="{ row }">
                      <RadioYesNo
                        v-model="row.liquidates_taxes"
                        :is-disabled="row.disabled_liquidates_taxes"
                      />
                    </template>

                    <template #is_advance="{ row }">
                      <RadioYesNo
                        v-model="row.is_advance"
                        :is-disabled="row.disabled_is_advance"
                      />
                    </template>

                    <template #actions="{ row }">
                      <!-- Eliminar -->
                      <Button
                        :outline="false"
                        :left-icon="defaultIconsLucide.trash"
                        color="orange"
                        :flat="true"
                        :class-custom="'custom'"
                        tooltip="Eliminar"
                        @click="handleDeleteValidatedRow(row)"
                      />
                    </template>
                  </TableList>
                </q-form>
                <section class="mx-2 mb-2">
                  <div class="q-mt-lg flex q-gutter-x-md justify-end">
                    <Button
                      label="Crear"
                      size="md"
                      unelevated
                      :outline="false"
                      color="orange"
                      class="text-capitalize btn-filter custom mt-2"
                      @click="handleCreate"
                    />
                  </div>
                </section>
              </section>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>

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
      ><template #default-img>
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
  </div>
</template>
<script setup lang="ts">
// components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import VCard from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

//Composables
import { useRules } from '@/composables'

//Logic
import usePaymentConceptsImport from '@/views/accounts-payable/payment-concepts/v1/import/PaymentConceptsImport'

const {
  defaultIconsLucide,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  uploadProps,
  tableProps,
  alertModalRef,
  alertModalConfig,
  isUploadButtonDisabled,
  validatingFiles,
  tablePropsValidatedRows,
  account_structures_payment_concepts,
  payment_concept_types,
  payment_concept_nature_types,
  payment_concept_activity_types,
  payment_concept_obligation_types,
  payment_concept_pension_types,
  basicDataFormRef,
  goToURL,
  handleDownloadTemplate,
  handleAddFile,
  handleCancelImport,
  openAlertModal,
  handleConfirm,
  handleLoad,
  handleDownloadErrors,
  changeAccountStructure,
  changeConceptCode,
  changeConceptType,
  changeObligationType,
  handleAddValidatedRow,
  handleDeleteValidatedRow,
  handleCreate,
} = usePaymentConceptsImport()
</script>
<style lang="scss" scoped>
:deep(.detail-table) {
  .q-field {
    padding-top: 15px !important;
    padding-bottom: 20px !important;
  }
  .q-select .q-field__native {
    min-height: unset;
  }
}
</style>
