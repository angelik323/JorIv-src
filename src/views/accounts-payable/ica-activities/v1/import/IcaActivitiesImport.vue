<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      :btn-outline="true"
      @on-back="goToURL('IcaActivitiesList')"
    >
      <template #addAfter>
        <Button
          v-if="
            !validatingForm &&
            validateRouter('AccountsPayable', 'IcaActivitiesList', 'list')
          "
          no-caps
          outline
          :class-custom="headerProps.btn.class"
          :label="headerProps.btn.label"
          color="orange"
          :styleContent="{
            'place-items': 'center',
            color: 'black',
          }"
          :text-color="headerProps.btn.color"
          :left-img="headerProps.btn.icon"
          @click="handleDownloadTemplate"
        />
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
            <TableList
              :title="tableValidatingProps.title"
              :loading="tableValidatingProps.loading"
              :columns="tableValidatingProps.columns"
              :rows="paginatedRows"
              :pages="tableValidatingProps.pages"
              :custom-columns="[
                'city',
                'economic_activity',
                'description_economic_activity',
                'type_economic_activity',
                'fiscal_charge',
                'description_fiscal_charge',
                'applies_to_third_party',
                'third_party_type',
                'account_structure',
                'account_chart',
                'description_account_chart',
                'settlement_concept_id',
                'minimum_base_pesos',
                'minimum_base_uvt',
                'percentage',
                'status',
                'actions',
              ]"
              :hide-bottom="false"
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

              <template #city="{ row }">
                <GenericSelectorComponent
                  :default_value="row.ciudad"
                  :manual_option="cities"
                  :auto_complete="true"
                  :required="true"
                  :map_options="true"
                  :rules="[(val: string) => is_required(val, 'La ciudad es requerida')]"
                  @update:model-value="row.ciudad = $event"
                />
              </template>

              <template #economic_activity="{ row }">
                <GenericSelectorComponent
                  :default_value="row.actividad_economica"
                  :manual_option="ciius"
                  :auto_complete="true"
                  :required="true"
                  :map_options="true"
                  :rules="[(val: string) => is_required(val, 'La actividad económica es requerida')]"
                  @update:model-value="changeEconomicActivity(row, $event)"
                />
              </template>

              <template #description_economic_activity="{ row }">
                <GenericInputComponent
                  type="text"
                  :default_value="row.descripcion_actividad_economica"
                  :required="false"
                  :disabled="true"
                  :rules="[(val: string) => is_required(val, 'La descripción de la actividad económica es requerida')]"
                />
              </template>

              <template #type_economic_activity="{ row }">
                <GenericSelectorComponent
                  :default_value="row.tipo_de_actividad"
                  :manual_option="ica_activity_types"
                  :auto_complete="true"
                  :required="true"
                  :map_options="true"
                  :rules="[(val: string) => is_required(val, 'El tipo de actividad es requerido')]"
                  @update:model-value="row.tipo_de_actividad = $event"
                />
              </template>

              <template #fiscal_charge="{ row }">
                <GenericSelectorComponent
                  :default_value="row.cargo_fiscal"
                  :manual_option="fiscal_charges"
                  :auto_complete="true"
                  :required="true"
                  :map_options="true"
                  :rules="[(val: string) => is_required(val, 'El cargo fiscal es requerido')]"
                  @update:model-value="changeFiscalCharges(row, $event)"
                />
              </template>

              <template #description_fiscal_charge="{ row }">
                <GenericInputComponent
                  type="text"
                  :default_value="row.descripcion_cargo_fiscal"
                  :required="false"
                  :disabled="true"
                  :rules="[(val: string) => is_required(val, 'La descripción del cargo fiscal es requerida')]"
                />
              </template>

              <template #applies_to_third_party="{ row }">
                <div class="q-pa-sm flex items-center justify-center">
                  <SwitchComponent
                    :model-value="row.aplica_terceros"
                    :disable="false"
                    color="orange"
                    @update:model-value="handleAppliesToThirdParty($event, row)"
                  />
                </div>
              </template>

              <template #third_party_type="{ row }">
                <GenericSelectorComponent
                  :default_value="row.tipo_de_tercero"
                  :manual_option="third_party_types"
                  :auto_complete="true"
                  :required="true"
                  :disabled="false"
                  :map_options="true"
                  :rules="[(val: string) => is_required(val, 'El tipo de tercero es requerido')]"
                  @update:model-value="row.tipo_de_tercero = $event"
                />
              </template>

              <template #account_structure="{ row }">
                <GenericSelectorComponent
                  :default_value="row.estructura_contable"
                  :manual_option="account_structures_payment_concepts"
                  :auto_complete="true"
                  :required="true"
                  :map_options="true"
                  :rules="[(val: string) => is_required(val, 'La estructura contable es requerida')]"
                  @update:model-value="row.estructura_contable = $event"
                />
              </template>

              <template #account_chart="{ row }">
                <GenericSelectorComponent
                  :default_value="row.cuenta_contable"
                  :manual_option="accounts_chart"
                  :auto_complete="true"
                  :required="true"
                  :map_options="true"
                  :rules="[(val: string) => is_required(val, 'La cuenta contable es requerida')]"
                  @update:model-value="changeAccountChart(row, $event)"
                />
              </template>

              <template #description_account_chart="{ row }">
                <GenericInputComponent
                  type="text"
                  :default_value="row.descripcion_cuenta_contable"
                  :required="false"
                  :disabled="true"
                  :rules="[(val: string) => is_required(val, 'La descripción de la cuenta contable es requerida')]"
                />
              </template>

              <template #settlement_concept_id="{ row }">
                <GenericSelectorComponent
                  :default_value="row.concepto_de_liquidacion"
                  :manual_option="settlement_concept"
                  :auto_complete="true"
                  :required="false"
                  :map_options="true"
                  :rules="[]"
                  @update:model-value="row.concepto_de_liquidacion = $event"
                />
              </template>

              <template #minimum_base_pesos="{ row }">
                <CurrencyInput
                  :currency="'COP'"
                  v-model="row.base_minima_en_pesos"
                  required
                  :rules="[
                      (val: string) => is_required(val, 'La base mínima en pesos es requerida'),
                      (val: string) => max_length(val, 30),
                    ]"
                  @update:model-value="row.base_minima_en_pesos = $event"
                />
              </template>

              <template #minimum_base_uvt="{ row }">
                <CurrencyInput
                  :currency="'COP'"
                  v-model="row.base_minima_en_uvt"
                  required
                  :rules="[
                      (val: string) => is_required(val, 'La base mínima en UVT es requerida'),
                      (val: string) => max_length(val, 30),
                    ]"
                  @update:model-value="row.base_minima_en_uvt = $event"
                />
              </template>

              <template #percentage="{ row }">
                <GenericInputComponent
                  type="number"
                  :default_value="row.porcentaje"
                  :required="false"
                  :disabled="true"
                  :rules="[(val: string) => is_required(val, 'El porcentaje es requerido')]"
                  @update:model-value="row.porcentaje = $event"
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

      <AlertModalComponent
        ref="alertImportModalRef"
        :title="alertImportModalConfig.description"
        :showBtnConfirm="true"
        :textBtnConfirm="'Aceptar'"
        :textBtnCancel="'Cancelar'"
        :showCloseBtn="true"
        :showImgDefault="false"
        @confirm="handleConfirmDelete"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
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
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

// logic view
import useIcaActivitiesImport from '@/views/accounts-payable/ica-activities/v1/import/IcaActivitiesImport'

const {
  // configs
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  tableProps,
  uploadProps,
  alertModalRef,
  alertImportModalRef,
  paginatedRows,
  tableValidatingProps,
  alertModalConfig,
  alertImportModalConfig,

  // selects
  account_structures_payment_concepts,
  accounts_chart,
  settlement_concept,
  cities,
  ciius,
  ica_activity_types,
  fiscal_charges,
  third_party_types,

  // utils
  defaultIconsLucide,

  //refs
  validatingForm,

  // methods
  handleDownloadTemplate,
  handleAddFile,
  handleDownloadErrors,
  openAlertModal,
  disableLoad,
  updatePage,
  updatePerPage,
  handleAdd,
  handleDelete,
  handleCreate,
  handleConfirm,
  handleCancel,
  handleConfirmDelete,
  handleAppliesToThirdParty,
  changeEconomicActivity,
  changeFiscalCharges,
  changeAccountChart,
  goToURL,
  is_required,
  max_length,
  validateRouter,
} = useIcaActivitiesImport()
</script>
