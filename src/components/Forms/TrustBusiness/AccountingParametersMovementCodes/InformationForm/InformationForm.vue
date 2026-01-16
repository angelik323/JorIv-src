<template>
  <q-form ref="formInformation">
    <section class="mx-4 mb-4 q-mt-md" :class="'q-pt-lg amounts-table'">
      <div class="row q-col-gutter-lg">
        <div class="col-xs-12">
          <TableList
            :loading="tablePropsAccountingBlock.loading"
            :columns="tablePropsAccountingBlock.columns"
            :rows="tablePropsAccountingBlock.rows"
            :pages="tablePropsAccountingBlock.pages"
            :custom-columns="[
              'business_type_id',
              'accounting_structure_id',
              'cost_center_structure_id',
              'budget_structure_id',
              'actions',
            ]"
            :hideHeader="false"
            :hideBottom="true"
            selection="single"
            :canDisableSelection="true"
            @selected="handleSelected"
          >
            <template #custom-header>
              <div>
                <p class="q-my-none text-weight-medium text-h5">
                  {{ tablePropsAccountingBlock.title }}
                </p>
              </div>
              <q-space />

              <Button
                v-if="
                  validateRouter(
                    'BusinessTrust',
                    'AccountingParametersMovementCodesCreate',
                    'edit'
                  )
                "
                no-caps
                unelevated
                :label="'Agregar '"
                :leftIcon="defaultIconsLucide.plusCircle"
                :color-icon="'white'"
                :text-color="'white'"
                :outline="false"
                :color="'primary'"
                :tooltip="'Agregar'"
                @click="addRowTable"
              />
            </template>

            <template #business_type_id="{ row }">
              <GenericSelectorComponent
                :manual_option="business_trust_types"
                :map_options="true"
                :required="true"
                :default_value="row.business_type_id"
                auto_complete
                :clearable="true"
                @update:modelValue="row.business_type_id = $event"
                :rules="[
                      (v: string) =>
                        useRules().is_required(v, 'El campo es requerido'),
                    ]"
              />
            </template>

            <template #accounting_structure_id="{ row }">
              <GenericSelectorComponent
                :manual_option="account_structures"
                :map_options="true"
                :required="true"
                :default_value="row.accounting_structure_id"
                auto_complete
                :clearable="true"
                @update:modelValue="row.accounting_structure_id = $event"
                :rules="[
                      (v: string) =>
                        useRules().is_required(v, 'El campo es requerido'),
                    ]"
              />
            </template>

            <template #cost_center_structure_id="{ row }">
              <GenericSelectorComponent
                :manual_option="cost_centers_structures"
                :map_options="true"
                :required="false"
                :default_value="row.cost_center_structure_id"
                auto_complete
                :clearable="true"
                :disabled="false"
                @update:modelValue="row.cost_center_structure_id = $event"
                :rules="[]"
              />
            </template>

            <template #budget_structure_id="{ row }">
              <GenericSelectorComponent
                :manual_option="budget_structures"
                :map_options="true"
                :required="false"
                :default_value="row.budget_structure_id"
                auto_complete
                first_filter_option="label"
                second_filter_option="label"
                :clearable="true"
                @update:modelValue="row.budget_structure_id = $event"
                :rules="[]"
              />
            </template>

            <template #actions="{ row }">
              <!-- Eliminar -->
              <Button
                v-if="
                  validateRouter(
                    'BusinessTrust',
                    'AccountingParametersMovementCodesCreate',
                    'edit'
                  )
                "
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                :tooltip="'Eliminar'"
                @click="openAlertModal('eliminar', row.id, true)"
              />
            </template>
          </TableList>
        </div>

        <div
          class="col-xs-12 mt-8"
          v-if="tablePropsAccountingBlock.rows.length > 0 && rowSelected"
        >
          <TableList
            :title="tablePropsNfi.title"
            :loading="tablePropsNfi.loading"
            :columns="tablePropsNfi.columns"
            :rows="tablePropsNfi.rows"
            :pages="tablePropsNfi.pages"
            :custom-columns="['status_id']"
            :hideHeader="false"
            :hideBottom="true"
          >
            <template #status_id="{ row }">
              <ShowStatus :type="Number(row?.status?.id ?? 1)" />
            </template>
          </TableList>
        </div>

        <div
          class="col-xs-12 mt-8"
          v-if="tablePropsAccountingBlock.rows.length > 0 && rowSelected"
        >
          <TableList
            :loading="tablePropsProperties.loading"
            :columns="tablePropsProperties.columns"
            :rows="tablePropsProperties.rows"
            :pages="tablePropsProperties.pages"
            :custom-columns="[
              'movement_code_id',
              'good_class',
              'good_type',
              'split_nature',
              'split_accounting_account_id',
              'np_auxiliary_type',
              'np_specific',
              'np_cost_center_id',
              'counterpart_nature',
              'offsetting_accounting_account_id',
              'ncp_auxiliary_type',
              'ncp_specific',
              'ncp_cost_center_id',
              'voucher_id',
              'sub_voucher_id',
              'actions',
            ]"
            :hideHeader="false"
            :hideBottom="true"
          >
            <template #custom-header>
              <div>
                <p class="q-my-none text-weight-medium text-h5">
                  {{ tablePropsProperties.title }}
                </p>
              </div>
              <q-space />

              <Button
                v-if="
                  validateRouter(
                    'BusinessTrust',
                    'AccountingParametersMovementCodesCreate',
                    'edit'
                  )
                "
                no-caps
                unelevated
                :label="'Agregar parámetro contable'"
                :leftIcon="defaultIconsLucide.plusCircle"
                :color-icon="'white'"
                :text-color="'white'"
                :outline="false"
                :color="'primary'"
                :disable="tablePropsNfi.rows.length === 0"
                :tooltip="'Agregar'"
                @click="addRowTableParameters"
              />
            </template>

            <template #movement_code_id="{ row }">
              <GenericSelectorComponent
                :manual_option="movement_codes_parameters"
                :map_options="true"
                :required="true"
                :default_value="row.movement_code_id"
                auto_complete
                :clearable="true"
                :disabled="false"
                @update:modelValue="row.movement_code_id = $event"
                :rules="[
                      (v: string) =>
                        useRules().is_required(v, 'El campo es requerido'),
                    ]"
              />
            </template>

            <template #good_class="{ row }">
              <GenericSelectorComponent
                :manual_option="params_good_class"
                :map_options="true"
                :required="true"
                :default_value="row.good_class"
                :auto_complete="true"
                :clearable="true"
                :disabled="false"
                @update:modelValue="row.good_class = $event"
                :rules="[
                      (v: string) =>
                        useRules().is_required(v, 'El campo es requerido'),
                    ]"
              />
            </template>

            <template #good_type="{ row }">
              <GenericSelectorComponent
                :manual_option="params_good_type"
                :map_options="true"
                :required="true"
                :default_value="row.good_type"
                :auto_complete="true"
                :clearable="true"
                :disabled="false"
                @update:modelValue="row.good_type = $event"
                :rules="[
                      (v: string) =>
                        useRules().is_required(v, 'El campo es requerido'),
                    ]"
              />
            </template>

            <template #split_nature="{ row }">
              <GenericSelectorComponent
                :manual_option="params_nature"
                :map_options="true"
                :required="true"
                :default_value="row.split_nature"
                :auto_complete="false"
                :clearable="true"
                :disabled="false"
                @update:modelValue="
                  (val) => {
                    row.split_nature = val
                    row.counterpart_nature =
                      val === 'D-Débito' ? 'C-Crédito' : 'D-Débito'
                  }
                "
                :rules="[
                      (v: string) =>
                        useRules().is_required(v, 'El campo es requerido'),
                    ]"
              />
            </template>

            <template #split_accounting_account_id="{ row }">
              <GenericSelectorComponent
                class_custom_popup="custom"
                :required="true"
                auto_complete
                map_options
                first_filter_option="label"
                second_filter_option="label"
                :default_value="row.split_accounting_account_id"
                :manual_option="params_accounting_account"
                @update:model-value="row.split_accounting_account_id = $event"
                :rules="[
                      (v: string) =>
                        useRules().is_required(v, 'El campo es requerido'),
                    ]"
              />
            </template>

            <template #np_auxiliary_type="{ row }">
              <GenericSelectorComponent
                :manual_option="params_auxiliary_type"
                :map_options="true"
                :required="true"
                :default_value="row.np_auxiliary_type"
                auto_complete
                :clearable="true"
                :disabled="false"
                @update:modelValue="
                  (val) => {
                    selectNpAuxiliarType(val, row)
                    row.np_specific = null
                  }
                "
                :rules="[
                  (v: string) =>
                    useRules().is_required(v, 'El campo es requerido'),
                ]"
              />
            </template>

            <template #np_specific="{ row }">
              <GenericSelectorComponent
                class_custom_popup="custom"
                :required="row.np_auxiliary_type === 'ES'"
                auto_complete
                map_options
                first_filter_option="label"
                second_filter_option="label"
                :default_value="row.np_specific"
                :manual_option="business_trust_third_parties"
                @update:model-value="row.np_specific = $event"
                :disabled="row.np_auxiliary_type !== 'ES'"
                :rules="
                      row.np_auxiliary_type === 'ES'
                        ? [(v: string) => useRules().is_required(v)]
                        : []
                    "
              />
            </template>

            <template #np_cost_center_id="{ row }">
              <GenericSelectorComponent
                :manual_option="cost_centers_structures"
                :map_options="true"
                :required="true"
                :default_value="
                  !rowSelected.cost_center_structure_id
                    ? ''
                    : row.np_cost_center_id
                "
                auto_complete
                :clearable="true"
                :disabled="!rowSelected.cost_center_structure_id"
                @update:modelValue="row.np_cost_center_id = $event"
                :rules="[
                      (v: string) =>
                        useRules().is_required(v, 'El campo es requerido'),
                    ]"
              />
            </template>

            <template #counterpart_nature="{ row }">
              <GenericSelectorComponent
                :manual_option="params_nature"
                :map_options="true"
                :required="true"
                :default_value="row.counterpart_nature"
                :auto_complete="false"
                :clearable="true"
                :disabled="false"
                @update:modelValue="
                  (val) => {
                    row.counterpart_nature = val
                    row.split_nature =
                      val === 'D-Débito' ? 'C-Crédito' : 'D-Débito'
                  }
                "
                :rules="[
                      (v: string) =>
                        useRules().is_required(v, 'El campo es requerido'),
                    ]"
              />
            </template>

            <template #offsetting_accounting_account_id="{ row }">
              <GenericSelectorComponent
                :manual_option="params_accounting_account"
                :map_options="true"
                :required="true"
                :default_value="row.offsetting_accounting_account_id"
                auto_complete
                :clearable="true"
                :disabled="false"
                @update:modelValue="
                  row.offsetting_accounting_account_id = $event
                "
                :rules="[
                      (v: string) =>
                        useRules().is_required(v, 'El campo es requerido'),
                    ]"
              />
            </template>

            <template #ncp_auxiliary_type="{ row }">
              <GenericSelectorComponent
                :manual_option="params_auxiliary_type"
                :map_options="true"
                :required="true"
                :default_value="row.ncp_auxiliary_type"
                auto_complete
                :clearable="true"
                :disabled="false"
                @update:modelValue="
                  (val) => {
                    selectNcpAuxiliaryType(val, row)
                    row.ncp_specific = null
                  }
                "
                :rules="[
                  (v: string) =>
                    useRules().is_required(v, 'El campo es requerido'),
                ]"
              />
            </template>

            <template #ncp_specific="{ row }">
              <GenericSelectorComponent
                class_custom_popup="custom"
                :required="row.ncp_auxiliary_type === 'ES'"
                auto_complete
                map_options
                first_filter_option="label"
                second_filter_option="label"
                :default_value="row.ncp_specific"
                :manual_option="business_trust_third_parties"
                :disabled="row.ncp_auxiliary_type !== 'ES'"
                @update:model-value="row.ncp_specific = $event"
                :rules="
                      row.ncp_auxiliary_type === 'ES'
                        ? [
                            (v: string) =>
                              useRules().is_required(
                                v,
                                'El campo es requerido'
                              ),
                          ]
                        : []
                    "
              />
            </template>

            <template #ncp_cost_center_id="{ row }">
              <GenericSelectorComponent
                :manual_option="cost_centers_structures"
                :map_options="true"
                :required="true"
                :default_value="
                  !rowSelected.cost_center_structure_id
                    ? ''
                    : row.ncp_cost_center_id
                "
                auto_complete
                :clearable="true"
                :disabled="!rowSelected.cost_center_structure_id"
                @update:modelValue="row.ncp_cost_center_id = $event"
                :rules="[
                  (v: string) => useRules().is_required(v, 'El campo es requerido'),
                ]"
              />
            </template>

            <template #voucher_id="{ row }">
              <GenericSelectorComponent
                :manual_option="receipt_types"
                :map_options="true"
                :required="true"
                :default_value="row.voucher_id"
                auto_complete
                :clearable="true"
                :disabled="false"
                @update:modelValue="
                  (val) => {
                    row.sub_voucher_id = null
                    row.voucher_id = val
                  }
                "
                :rules="[
                      (v: string) =>
                        useRules().is_required(v, 'El campo es requerido'),
                    ]"
              />
            </template>

            <template #sub_voucher_id="{ row }">
              <GenericSelectorComponent
                :manual_option="
                  sub_receipt_types.filter(
                    (item) => item.receipt_type_id === row.voucher_id
                  )
                "
                :map_options="true"
                :required="true"
                :default_value="row.sub_voucher_id"
                auto_complete
                :clearable="true"
                :disabled="!row.voucher_id"
                @update:modelValue="row.sub_voucher_id = $event"
                :rules="[
                      (v: string) =>
                        useRules().is_required(v, 'El campo es requerido'),
                    ]"
              />
            </template>

            <template #actions="{ row }">
              <!-- Eliminar -->
              <Button
                v-if="
                  validateRouter(
                    'BusinessTrust',
                    'AccountingParametersMovementCodesCreate',
                    'edit'
                  )
                "
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                tooltip="Eliminar"
                @click="openAlertModal('eliminar', row.id, false)"
              />

              <!-- Copiar -->
              <Button
                v-if="
                  validateRouter(
                    'BusinessTrust',
                    'AccountingParametersMovementCodesCreate',
                    'edit'
                  )
                "
                :left-icon="defaultIconsLucide.copy"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                tooltip="Copiar"
                @click="copyRowTable(row)"
              />
            </template>
          </TableList>
        </div>
      </div>
    </section>
  </q-form>

  <AlertModalComponent
    ref="alertModalRef"
    styleModal="min-width: 480px"
    :title="`¿Desea eliminar el ${
      alertModalConfig.isBlock ? 'bloque' : 'parámetro'
    } contable?`"
    @confirm="
      alertModalConfig.isBlock
        ? deleteRowTableAccountingBlock()
        : deleteRowTable()
    "
  >
  </AlertModalComponent>
</template>

<script setup lang="ts">
// components
import TableList from '@/components/table-list/TableList.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// logic
import useInformationForm from './InformationForm'

// composables
import { useRules } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'

const emits = defineEmits(['validate:form'])

const {
  business_trust_types,
  account_structures,
  cost_centers_structures,
  formInformation,
  tablePropsAccountingBlock,
  tablePropsNfi,
  tablePropsProperties,
  rowSelected,
  business_trust_third_parties,

  //
  movement_codes_parameters,
  params_good_class,
  params_good_type,
  params_nature,
  params_auxiliary_type,
  receipt_types,
  sub_receipt_types,
  params_accounting_account,
  budget_structures,
  alertModalRef,
  alertModalConfig,

  copyRowTable,
  addRowTable,
  handleSelected,
  addRowTableParameters,
  selectNpAuxiliarType,
  selectNcpAuxiliaryType,
  deleteRowTableAccountingBlock,
  openAlertModal,
  deleteRowTable,
  validateRouter,
} = useInformationForm()

defineExpose({
  validateForm: async () => await formInformation.value?.validate(),
})
</script>

<style lang="scss" scoped>
:deep(.amounts-table) {
  .q-field {
    padding-bottom: 0 !important;
  }
  .q-select .q-field__native {
    min-height: unset;
  }
}
</style>
