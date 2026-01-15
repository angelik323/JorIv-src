<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <TableList
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :custom-columns="['select', 'actions']"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
      >
        <template #select="{ row }">
          <div class="px-1 flex justify-center">
            <q-radio
              dense
              size="sm"
              v-model="selectedRow"
              :val="row.id"
              color="orange"
            />
          </div>
        </template>

        <template #custom-header>
          <div>
            <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
              {{ tableProps.title }}
            </p>
          </div>
          <q-space />

          <Button
            v-if="['create', 'edit'].includes(props.action)"
            no-caps
            unelevated
            :label="'Agregar'"
            :leftIcon="defaultIconsLucide.plusCircle"
            :color-icon="'white'"
            :text-color="'white'"
            :outline="false"
            :color="'primary'"
            :tooltip="'Agregar'"
            @click="openAddPoliciesModal"
          />
        </template>

        <template
          #actions="{ row }"
          v-if="['create', 'edit'].includes(props.action)"
        >
          <Button
            :left-icon="defaultIconsLucide.edit"
            color="orange"
            class-custom="custom"
            :outline="false"
            flat
            colorIcon="#f45100"
            tooltip="Editar"
            @click="openEditPoliciesModal(row)"
          />

          <Button
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="openDeleteModal(row.id)"
          />
        </template>
      </TableList>
    </section>

    <section class="q-mt-lg" v-if="selectedRow">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Listado documentos adjuntos
        </p>
      </div>

      <div class="col-12" v-if="['create', 'edit'].includes(props.action)">
        <UploadFile
          ref="attachDocumentRef"
          title="Cargar archivo"
          labelUploadBtn="Seleccione los archivos para subir"
          stylesCustoms="width: 100%"
          :bordered="false"
          accept=".pdf"
          @added="onFileAdded"
        />
      </div>

      <TableList
        :loading="tablePropsDocuments.loading"
        :columns="tablePropsDocuments.columns"
        :rows="tablePropsDocuments.rows"
        :custom-columns="['actions']"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
      >
        <template
          #actions="{ row }"
          v-if="['create', 'edit'].includes(props.action)"
        >
          <Button
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="deleteDocument(row.id)"
          />
        </template>
      </TableList>
    </section>
  </q-form>

  <AlertModalComponent
    ref="deleteModalRef"
    styleModal="min-width: 480px"
    title="¿Desea eliminar la póliza seleccionada?"
    :show-img-default="false"
    @confirm="confirmDeleteAction"
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

  <AlertModalComponent
    ref="addAdditionModalRef"
    styleModal="min-width: 1000px"
    :title-header="`${
      updateModal ? 'Actualizar' : 'Agregar'
    } adición de póliza`"
    :show-img-default="false"
    @confirm="saveAddition"
    :text-btn-confirm="updateModal ? 'Actualizar' : 'Asociar'"
    margin-top-body="mt-1"
  >
    <template #default-body>
      <q-form ref="formAdditionModal">
        <section class="q-pa-lg">
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
            <div class="col-12 col-md-3">
              <GenericSelectorComponent
                label="Tipo de póliza"
                :manual_option="policies"
                :map_options="false"
                :required="true"
                :default_value="modelsModal?.type_policy_id"
                :auto_complete="false"
                :clearable="false"
                :placeholder="'Seleccione'"
                :rules="[(val: string) => useRules().is_required(val)]"
                @update:modelValue="modelsModal.type_policy_id = $event"
              />
            </div>

            <div class="col-12 col-md-3">
              <GenericSelectorComponent
                label="Aseguradora"
                :manual_option="third_parties"
                :map_options="false"
                :required="true"
                :default_value="modelsModal?.insurance_company_id"
                :auto_complete="false"
                :clearable="false"
                :placeholder="'Seleccione'"
                :rules="[(val: string) => useRules().is_required(val)]"
                @update:modelValue="modelsModal.insurance_company_id = $event"
              />
            </div>

            <div class="col-12 col-md-3">
              <GenericInput
                label="Número de póliza"
                :default_value="modelsModal?.policy_number"
                :required="true"
                :rules="[
                (val: string) => useRules().is_required(val),
                (val: string) => useRules().only_alphanumeric(val),
                (val: string) => useRules().max_length(val, 25),
              ]"
                @update:modelValue="modelsModal.policy_number = $event"
              />
            </div>

            <div class="col-12 col-md-3">
              <GenericSelectorComponent
                label="Beneficiario"
                :manual_option="third_parties"
                :map_options="false"
                :required="true"
                :default_value="modelsModal?.beneficiary_id"
                :auto_complete="false"
                :clearable="false"
                :placeholder="'Seleccione'"
                :rules="[(val: string) => useRules().is_required(val)]"
                @update:modelValue="modelsModal.beneficiary_id = $event"
              />
            </div>

            <div class="col-12 col-md-3">
              <GenericInput
                label="Valor asegurado"
                :default_value="modelsModal?.insured_value"
                :required="true"
                :rules="[
                (val: string) => useRules().is_required(val),
                (val: string) => useRules().max_integer_decimal(val, 12, 2),
              ]"
                @update:modelValue="modelsModal.insured_value = $event"
              />
            </div>

            <div class="col-12 col-md-3">
              <GenericDateInputComponent
                label="Fecha inicio vigencia"
                required
                :default_value="modelsModal.validity_start"
                :rules="[(v) => useRules().is_required(v)]"
                @update:modelValue="(val) => (modelsModal.validity_start = val)"
              />
            </div>

            <div class="col-12 col-md-3">
              <GenericDateInputComponent
                label="Fecha fin vigencia"
                required
                :default_value="modelsModal.validity_end"
                :rules="[
                  (val: string) => useRules().is_required(val),
                  (val: string) => useRules().date_after_or_equal_to_specific_date(val, modelsModal.validity_start ?? ''),
                ]"
                @update:modelValue="(val) => (modelsModal.validity_end = val)"
              />
            </div>

            <div class="col-12 col-md-3">
              <GenericSelectorComponent
                label="Estado"
                :manual_option="policy_status"
                :map_options="false"
                :required="true"
                :default_value="modelsModal?.status_id"
                :auto_complete="false"
                :clearable="false"
                :placeholder="'Seleccione'"
                :rules="[(val: string) => useRules().is_required(val)]"
                @update:modelValue="modelsModal.status_id = $event"
              />
            </div>
          </div>
        </section>

        <section class="q-pa-lg">
          <TableList
            :loading="tablePropsAddAdditions.loading"
            :columns="tablePropsAddAdditions.columns"
            :rows="tablePropsAddAdditions.rows"
            :hide-pagination="true"
            :rows-per-page-options="[0]"
            :custom-columns="['risk_id', 'coverage_max_value', 'actions']"
          >
            <template #custom-header>
              <div>
                <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
                  {{ tablePropsAddAdditions.title }}
                </p>
              </div>
              <q-space />

              <Button
                no-caps
                unelevated
                :label="'Agregar'"
                :leftIcon="defaultIconsLucide.plusCircle"
                :color-icon="'white'"
                :text-color="'white'"
                :outline="false"
                :color="'primary'"
                :tooltip="'Agregar'"
                @click="addNewRow"
              />
            </template>

            <template #risk_id="{ row }">
              <GenericSelectorComponent
                :manual_option="risk_list"
                :map_options="false"
                :required="true"
                :default_value="row?.risk_id"
                :auto_complete="false"
                :clearable="false"
                :placeholder="'Seleccione'"
                :rules="[(val: string) => useRules().is_required(val)]"
                @update:modelValue="row.risk_id = $event"
              />
            </template>

            <template #coverage_max_value="{ row }">
              <GenericInput
                :required="true"
                :default_value="row.coverage_max_value"
                :rules="[
                (val: string) => useRules().is_required(val),
                (val: string) => useRules().max_integer_decimal(val, 12, 2),
              ]"
                @update:modelValue="row.coverage_max_value = $event"
              />
            </template>

            <template #actions="{ row, index }">
              <Button
                v-if="index !== 0"
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                tooltip="Eliminar"
                @click="deleteRowModal(row.id)"
              />
            </template>
          </TableList>
        </section>
      </q-form>
    </template>
  </AlertModalComponent>
</template>

<script setup lang="ts">
import { IPoliciesFormAdditions } from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { ActionType } from '@/interfaces/global'

import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import { useRules } from '@/composables'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

import usePoliciesForm from '@/components/Forms/DerivativeContracting/RegisterAdditions/Policies/Policies'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IPoliciesFormAdditions | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IPoliciesFormAdditions | null): void
}>()

const {
  formElementRef,
  defaultIconsLucide,
  tableProps,
  tablePropsAddAdditions,
  deleteModalRef,
  addAdditionModalRef,
  formAdditionModal,
  modelsModal,
  policy_status,
  policies,
  third_parties,
  risk_list,
  selectedRow,
  updateModal,
  tablePropsDocuments,
  attachDocumentRef,
  deleteDocument,
  onFileAdded,
  saveAddition,
  deleteRowModal,
  openAddPoliciesModal,
  openEditPoliciesModal,
  confirmDeleteAction,
  addNewRow,
  openDeleteModal,
} = usePoliciesForm(props, emits)

defineExpose({
  validateForm: () => tableProps.value.rows.length > 0,
})
</script>
