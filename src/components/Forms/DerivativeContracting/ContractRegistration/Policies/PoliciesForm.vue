<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section class="q-my-xl q-mx-sm">
      <TableList
        :loading="tablePropertiesPolicies.loading"
        :columns="tablePropertiesPolicies.columns"
        :rows="tablePropertiesPolicies.rows"
        :pages="tablePropertiesPolicies.pages"
        :custom-columns="['actions', 'status_id']"
        hide-pagination
        customNoDataMessageTitle="No hay datos registrados"
        customNoDataMessageSubtitle=""
        selection="single"
        v-model:selected="selectedRowsPolicies"
        @update:selected="handleSelectedRowsPolicies"
      >
        <template #custom-header>
          <div
            class="q-mt-sm q-mb-sm full-width flex justify-between items-center"
          >
            <span class="text-h5">
              {{ tablePropertiesPolicies.title }}
            </span>
            <Button
              v-if="['create', 'edit'].includes(action)"
              :outline="false"
              label="Crear"
              :class-custom="'items-center'"
              :left-icon="defaultIconsLucide.plusCircleOutline"
              color-icon="white"
              :style-content="{ 'align-items': 'center' }"
              @click="handleOpenModalCreatePolicies"
            />
          </div>
        </template>

        <template #status_id="{ row }">
          <div class="q-pa-md row items-center">
            <ShowStatusV2 :type="row.status_id || 63" status-type="policies" />
          </div>
        </template>

        <template #actions="{ row }">
          <Button
            v-if="['create', 'edit'].includes(action)"
            :left-icon="defaultIconsLucide.edit"
            color="primary"
            :class-custom="'custom'"
            :flat="true"
            :outline="false"
            colorIcon="#f45100"
            tooltip="Editar"
            @click="handleEditPolicies(row.id)"
          />
          <Button
            :left-icon="defaultIconsLucide.eye"
            color="primary"
            :class-custom="'custom'"
            :flat="true"
            :outline="false"
            colorIcon="#f45100"
            tooltip="Ver"
            @click="handleViewPolicies(row.id)"
          />
          <Button
            v-if="['create', 'edit'].includes(action)"
            :left-icon="defaultIconsLucide.trash"
            color="primary"
            :class-custom="'custom'"
            :flat="true"
            :outline="false"
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="handleDeletePolicies(row.id)"
          />
        </template>
      </TableList>
    </section>

    <section class="q-mt-xl q-mx-sm">
      <TableList
        :loading="tablePropertiesDocumentsPolicies.loading"
        :columns="tablePropertiesDocumentsPolicies.columns"
        :rows="tablePropertiesDocumentsPolicies.rows"
        :pages="tablePropertiesDocumentsPolicies.pages"
        :title="tablePropertiesDocumentsPolicies.title"
        :custom-columns="['actions', 'status_id']"
        hide-pagination
        customNoDataMessageTitle="No hay datos registrados"
        customNoDataMessageSubtitle=""
      >
        <template #status_id="{ row }">
          <div class="q-pa-md row items-center">
            <ShowStatusV1 :type="row.status_id || 75" />
          </div>
        </template>

        <template #actions="{ row }">
          <Button
            v-if="action !== 'create'"
            :left-icon="defaultIconsLucide.eye"
            color="primary"
            :class-custom="'custom'"
            :flat="true"
            :outline="false"
            colorIcon="#f45100"
            tooltip="Ver"
            @click="viewFile(row.temporal_path)"
          />

          <Button
            v-if="['create', 'edit'].includes(action)"
            :left-icon="defaultIconsLucide.trash"
            color="primary"
            :class-custom="'custom'"
            :flat="true"
            :outline="false"
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="handleDeleteDocumentPolicies(row.id)"
          />
        </template>
      </TableList>
    </section>
  </q-form>

  <AlertModalComponent
    :showImgDefault="false"
    styleModal="max-width: 1000px; width: 100%;"
    :title-header="`${alertModalConfig.action} pólizas del contrato`"
    ref="alertModalRef"
    :showBtnCancel="false"
    :show-btn-confirm="
      ['Crear', 'Editar'].includes(alertModalConfig.action ?? '')
    "
    :textBtnConfirm="
      alertModalConfig.action === 'Editar' ? 'Actualizar' : 'Crear'
    "
    @confirm="handleAddPolicies"
  >
    <template #default-body>
      <q-form ref="policyFormElementRef">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-md q-mx-sm">
          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              v-if="['Crear', 'Editar'].includes(alertModalConfig.action ?? '')"
              label="Tipo de póliza"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              :default_value="alertModalConfig.policie_id"
              :manual_option="policies"
              return_object
              :required="true"
              :rules="[(val: string) => useRules().is_required(val, 'Este campo es requerido')]"
              @update:model-value="
                (val) => {
                  alertModalConfig.policie_id = val.value
                  alertModalConfig.policie = val.label
                }
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Tipo de póliza</p>
              <p class="text-weight-medium no-margin">
                {{ alertModalConfig.policie || 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              v-if="['Crear', 'Editar'].includes(alertModalConfig.action ?? '')"
              label="Aseguradora"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              :default_value="alertModalConfig.insurer_id"
              :manual_option="
                third_parties.filter(
                  (tp) => tp.third_party_category === 'juridica'
                )
              "
              return_object
              :required="true"
              :rules="[(val: string) => useRules().is_required(val, 'Este campo es requerido')]"
              @update:model-value="
                (val) => {
                  alertModalConfig.insurer_id = val.value
                  alertModalConfig.insurance = val.label
                }
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Aseguradora</p>
              <p class="text-weight-medium no-margin">
                {{ alertModalConfig.insurance || 'No registrado' }}
              </p>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mx-sm">
          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericInputComponent
              v-if="['Crear', 'Editar'].includes(alertModalConfig.action ?? '')"
              :default_value="alertModalConfig.policy_number"
              label="Número póliza"
              required
              placeholder="Ingrese"
              :rules="[
                (val: string) => useRules().is_required(val, 'Este campo es requerido'),
                (val: string) => useRules().max_length(val, 25),
              ]"
              @update:model-value="alertModalConfig.policy_number = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Número póliza</p>
              <p class="text-weight-medium no-margin">
                {{ alertModalConfig.policy_number || 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              v-if="['Crear', 'Editar'].includes(alertModalConfig.action ?? '')"
              label="Beneficiario"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              :default_value="alertModalConfig.beneficiary_id"
              :manual_option="
                third_parties.filter(
                  (tp) => tp.third_party_category === 'juridica'
                )
              "
              return_object
              :required="true"
              :rules="[(val: string) => useRules().is_required(val, 'Este campo es requerido')]"
              @update:model-value="
                (val) => {
                  alertModalConfig.beneficiary_id = val.value
                  alertModalConfig.beneficiary = val.label
                }
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Beneficiario</p>
              <p class="text-weight-medium no-margin">
                {{ alertModalConfig.beneficiary || 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <CurrencyInput
              v-if="['Crear', 'Editar'].includes(alertModalConfig.action ?? '')"
              v-model="alertModalConfig.insured_value"
              label="Valor asegurado"
              required
              :rules="[
                (val: string) => useRules().is_required(val, 'Este campo es requerido'),
                (val: string) => useRules().max_length(val, 18),
              ]"
              @update:model-value="alertModalConfig.insured_value = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Valor asegurado</p>
              <p class="text-weight-medium no-margin">
                {{
                  formatCurrencyString(alertModalConfig.insured_value) ||
                  'No registrado'
                }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericDateInputComponent
              v-if="['Crear', 'Editar'].includes(alertModalConfig.action ?? '')"
              label="Fecha inicio vigencia"
              :default_value="alertModalConfig.start_date"
              :rules="[]"
              @update:model-value="alertModalConfig.start_date = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Fecha inicio vigencia</p>
              <p class="text-weight-medium no-margin">
                {{ alertModalConfig.start_date || 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericDateInputComponent
              v-if="['Crear', 'Editar'].includes(alertModalConfig.action ?? '')"
              label="Fecha fin vigencia"
              :default_value="alertModalConfig.end_date"
              :rules="[]"
              @update:model-value="alertModalConfig.end_date = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Fecha fin vigencia</p>
              <p class="text-weight-medium no-margin">
                {{ alertModalConfig.end_date || 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              v-if="['Crear', 'Editar'].includes(alertModalConfig.action ?? '')"
              label="Estado"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              :default_value="alertModalConfig.status_id"
              :manual_option="policy_status"
              required
              :rules="[(val: string) => useRules().is_required(val, 'Este campo es requerido')]"
              @update:model-value="alertModalConfig.status_id = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Estado</p>
              <p class="text-weight-medium no-margin">
                {{ 'Vigente' }}
              </p>
            </div>
          </div>
        </div>

        <div class="q-mt-xl q-mx-lg">
          <TableList
            :loading="tablePropertiesCoverage.loading"
            :columns="tablePropertiesCoverage.columns"
            :rows="tablePropertiesCoverage.rows"
            :pages="tablePropertiesCoverage.pages"
            :custom-columns="['risk_name', 'maximum_coverage_value', 'actions']"
            hide-pagination
          >
            <template #custom-header>
              <div
                class="q-mt-sm q-mb-sm full-width flex justify-between items-center"
              >
                <span class="text-h5">
                  {{ tablePropertiesCoverage.title }}
                </span>
                <Button
                  v-if="
                    ['Crear', 'Editar'].includes(alertModalConfig.action ?? '')
                  "
                  :outline="false"
                  label="Agregar"
                  :class-custom="'items-center'"
                  :left-icon="defaultIconsLucide.plusCircleOutline"
                  color-icon="white"
                  :style-content="{ 'align-items': 'center' }"
                  @click="handleAddCoverage"
                />
              </div>
            </template>

            <template #risk_name="{ row }">
              <GenericSelectorComponent
                v-if="
                  ['Crear', 'Editar'].includes(alertModalConfig.action ?? '')
                "
                map_options
                first_filter_option="label"
                second_filter_option="label"
                :default_value="row.risk_id"
                :manual_option="risk_list"
                return_object
                required
                hide_bottom_space
                :rules="[(val: string) => useRules().is_required(val, 'Este campo es requerido')]"
                @update:model-value="
                  (val) => {
                    row.risk_id = val.value
                    row.risk_name = val.label
                    row.minimum_percentage = val.minimum_percentage
                    row.coverage_percentage = val.maximum_percentage
                  }
                "
              />
              <span v-else>{{ row.risk_name }}</span>
            </template>

            <template #maximum_coverage_value="{ row }">
              <InputMoneyComponent
                v-if="
                  ['Crear', 'Editar'].includes(alertModalConfig.action ?? '')
                "
                hide_symbol
                :model-value="row.maximum_coverage_value"
                hide_bottom_space
                :rules="[
                  (v) =>
                    useRules().only_number_greater_than_zero_with_decimal(v),
                ]"
                @update:model-value="
                  ({ rawValue }) => (row.maximum_coverage_value = rawValue)
                "
              />
              <span v-else>{{
                formatCurrencyString(row.maximum_coverage_value)
              }}</span>
            </template>

            <template #actions="{ row }">
              <Button
                v-if="
                  ['Crear', 'Editar'].includes(alertModalConfig.action ?? '')
                "
                :left-icon="defaultIconsLucide.trash"
                color="primary"
                :class-custom="'custom'"
                :flat="true"
                :outline="false"
                colorIcon="#f45100"
                tooltip="Eliminar"
                @click="handleDeleteCoverage(row.id)"
              />
            </template>
          </TableList>

          <section>
            <div
              class="q-mt-lg q-mb-lg"
              v-if="
                ['create', 'edit'].includes(action) &&
                alertModalConfig.action !== 'Ver' &&
                alertModalConfig.policie_id
              "
            >
              <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
                Documentos
              </p>
              <UploadFile
                ref="attachDocumentRef"
                title="Cargar archivo *"
                multiple-files
                styles-customs="width: 100%"
                label-upload-btn="Seleccione el archivo para subir"
                accept="application/pdf"
                class-name-title="text-weight-medium text-grey-6 q-mt-md q-mb-xs"
                :bordered="false"
                :show-preview="false"
                color-icon="orange"
                @added="addedFiles"
                @rejected="rejectedFiles"
              />
            </div>

            <div>
              <p
                class="text-black-10 text-weight-bold text-h6 q-mb-none q-mt-xl"
              >
                Listado de documentos
              </p>

              <div class="q-mx-md q-mt-md">
                <TableList
                  :loading="tablePropertiesDocumentsContractPolicies.loading"
                  :rows="tablePropertiesDocumentsContractPolicies.rows"
                  :columns="tablePropertiesDocumentsContractPolicies.columns"
                  :custom-columns="['actions', 'status_id']"
                  hide-pagination
                  dense
                >
                  <template #status_id="{ row }">
                    <div class="q-pa-md row items-center">
                      <ShowStatusV1 :type="row.status_id || 75" />
                    </div>
                  </template>

                  <template #actions="{ row }">
                    <Button
                      v-if="
                        ['edit', 'view'].includes(action) &&
                        !row.is_new_document
                      "
                      :left-icon="defaultIconsLucide.download"
                      color="orange"
                      class-custom="custom"
                      :outline="false"
                      flat
                      colorIcon="#f45100"
                      tooltip="Descargar"
                      @click="handleViewFile(row.file_path, row.file_name)"
                    />

                    <Button
                      v-if="
                        ['create', 'edit'].includes(action) &&
                        alertModalConfig.action !== 'Ver'
                      "
                      :left-icon="defaultIconsLucide.trash"
                      color="orange"
                      class-custom="custom"
                      :outline="false"
                      flat
                      colorIcon="#f45100"
                      tooltip="Eliminar"
                      @click="handleRemoveFile(row.id)"
                    />
                  </template>

                  <template #custom-no-data>
                    <div
                      class="column justify-center items-center q-col-gutter-y-lg q-mt-sm"
                    >
                      <img
                        src="@/assets/images/icons/no_data_2.svg"
                        alt="No hay datos para mostrar"
                        width="180px"
                      />
                      <p class="text-weight-bold text-h5 text-center">
                        No hay datos para mostrar
                      </p>
                    </div>
                  </template>
                </TableList>
              </div>
            </div>
          </section>
        </div>
      </q-form>
    </template>
  </AlertModalComponent>

  <ViewerFileComponent ref="viewerFileComponentRef" />
</template>

<script lang="ts" setup>
// Components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import ShowStatusV2 from '@/components/showStatus/v2/ShowStatus.vue'
import ShowStatusV1 from '@/components/showStatus/ShowStatus.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// Composables
import { useRules } from '@/composables'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IContractRegistrationGeneralDataForm } from '@/interfaces/customs/derivative-contracting/ContractRegistration'

//Logic form
import usePoliciesForm from '@/components/Forms/DerivativeContracting/ContractRegistration/Policies/PoliciesForm'

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IContractRegistrationGeneralDataForm | null): void
}>()

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IContractRegistrationGeneralDataForm | null
  }>(),
  {}
)

const {
  formElementRef,
  tablePropertiesPolicies,
  tablePropertiesDocumentsPolicies,
  tablePropertiesCoverage,
  tablePropertiesDocumentsContractPolicies,
  defaultIconsLucide,
  alertModalRef,
  policyFormElementRef,
  alertModalConfig,
  viewerFileComponentRef,
  policies,
  third_parties,
  selectedRowsPolicies,
  risk_list,
  policy_status,

  handleAddCoverage,
  handleDeleteCoverage,
  handleOpenModalCreatePolicies,
  handleAddPolicies,
  handleDeletePolicies,
  handleEditPolicies,
  handleViewPolicies,
  handleDeleteDocumentPolicies,
  viewFile,
  addedFiles,
  rejectedFiles,
  handleRemoveFile,
  handleViewFile,
  handleSelectedRowsPolicies,
  formatCurrencyString,
} = usePoliciesForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
