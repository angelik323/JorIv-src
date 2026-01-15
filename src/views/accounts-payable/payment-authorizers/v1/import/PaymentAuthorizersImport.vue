<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('PaymentAuthorizersList')"
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
                  :hide-bottom="true"
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
                    :pages="tablePropsValidatedRows.pages"
                    :custom-columns="[
                      'authorized_user_id',
                      'amount_from',
                      'amount_to',
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
                    <template #authorized_user_id="{ row }">
                      <GenericSelectorComponent
                        :manual_option="users_label_email"
                        :map_options="true"
                        :default_value="row.authorized_user_id"
                        required
                        @update:model-value="row.authorized_user_id = $event"
                        :rules="[
                          (val: string) => useRules().is_required(val, 'El usuario autorizado es requerido'),
                        ]"
                      />
                    </template>
                    <template #amount_from="{ row }">
                      <InputMoneyComponent
                        :model-value="row.amount_from"
                        :max_decimal_digits="2"
                        required
                        :rules="[
                            (val: string) => useRules().is_required(val, 'El monto desde es requerido'),
                            
                        ]"
                        @update:model-value="
                          ({ rawValue }) => (row.amount_from = rawValue)
                        "
                      />
                    </template>

                    <template #amount_to="{ row }">
                      <InputMoneyComponent
                        :model-value="row.amount_to"
                        :max_decimal_digits="2"
                        required
                        :rules="[
                            (val: string) => useRules().is_required(val, 'El monto hasta es requerido'),
                        ]"
                        @update:model-value="
                          ({ rawValue }) => (row.amount_to = rawValue)
                        "
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
                      class="text-capitalize btn-filter custom"
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
// Components
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
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// Composables
import { useRules } from '@/composables'

// Logic
import usePaymentAuthorizersImport from '@/views/accounts-payable/payment-authorizers/v1/import/PaymentAuthorizersImport'

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
  users_label_email,
  basicDataFormRef,
  goToURL,
  handleDownloadTemplate,
  handleAddFile,
  handleCancelImport,
  openAlertModal,
  handleConfirm,
  handleLoad,
  handleDownloadErrors,
  handleAddValidatedRow,
  handleDeleteValidatedRow,
  handleCreate,
} = usePaymentAuthorizersImport()
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
