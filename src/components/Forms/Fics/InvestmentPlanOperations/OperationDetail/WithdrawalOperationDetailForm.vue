<template>
  <div>
    <q-form ref="operationDetailForm">
      <section>
        <div class="row justify-between items-center q-pb-lg">
          <p class="mb-0 text-black-10 text-weight-bold text-h6">
            Detalle operación de retiros
          </p>
          <div>
            <Button
              :outline="false"
              :label="'Agregar'"
              :color-icon="'white'"
              :left-icon="useUtils().defaultIconsLucide.plusCircleOutline"
              :class-custom="'btn-header full-width'"
              :styleContent="{ 'place-items': 'center', color: 'white' }"
              @click="addDetail"
            />
          </div>
        </div>
        <VCard class="q-px-lg" style="margin-bottom: 0">
          <template #content-card>
            <section class="detail-table q-pb-lg">
              <TableList
                :loading="false"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :hide-pagination="true"
                :hide-header="!tableProps.rows.length"
                :visible-columns="tableProps.visibleColumns"
                :custom-columns="[
                  'radio',
                  'collection_type',
                  'description',
                  'value',
                  'is_registered',
                  'adjustment',
                  'account',
                  'actions',
                ]"
              >
                <template #radio="{ row }">
                  <RadioYesNo
                    v-model="row.selected"
                    :options="[{ label: '', value: true }]"
                    @update:model-value="selectDetail(row)"
                  />
                </template>
                <template #collection_type="{ row }">
                  <GenericSelectorComponent
                    :manual_option="means_of_payments"
                    map_options
                    required
                    :default_value="''"
                    auto_complete
                    clearable
                    :placeholder="'Seleccione'"
                    :rules="[(val: string) => useRules().is_required(val, '')]"
                    @update:modelValue="selectCollectionType(row, $event)"
                  />
                </template>
                <template #description="{ row }">
                  <GenericInputComponent
                    placeholder="-"
                    required
                    disabled
                    :default_value="row.means_of_payment_description"
                    :rules="[]"
                  />
                </template>
                <template #value="{ row }">
                  <InputMoneyComponent
                    :model-value="row.value"
                    @update:modelValue="(val) => (row.value = val.rawValue)"
                    :placeholder="''"
                    :max_integer_digits="50"
                    :max_decimal_digits="4"
                    :rules="[
                      (val: string) => useRules().is_required(val, 'Valor disponible sin impuestos es requerido'),
                    ]"
                  />
                </template>
                <template #adjustment="{ row }">
                  <q-radio
                    v-model="row.adjustment"
                    :val="true"
                    :label="''"
                    color="orange"
                    class="custom-radio"
                  />
                </template>
                <template #is_registered="{ row }">
                  <GenericInputComponent
                    placeholder="-"
                    required
                    disabled
                    :default_value="row.has_registered_accounts ? 'Sí' : 'No'"
                    :rules="[]"
                  />
                </template>
                <template #account="{ row }">
                  <!-- Ver -->
                  <Button
                    :left-icon="useUtils().defaultIconsLucide.plusCircleOutline"
                    color="orange"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    :disabled="!isEnableToOpenAccountModal(row)"
                    colorIcon="#f45100"
                    tooltip="Seleccionar cuenta"
                    @click="openAccountModal(row)"
                  />
                </template>
                <template #actions="{ row }">
                  <!-- Remover detalle -->
                  <Button
                    :left-icon="useUtils().defaultIconsLucide.trash"
                    color="orange"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    colorIcon="#f45100"
                    tooltip="Eliminar"
                    @click="removeDetail(row)"
                  />
                </template>
                <template v-if="tableProps.rows.length" #custom-bottom-row>
                  <q-tr>
                    <q-td colspan="9" style="height: 1.75rem">
                      <section class="row justify-center q-gutter-md">
                        <div class="row q-gutter-sm">
                          <strong class="text-primary_fiduciaria">{{
                            customBottomRowValueTitle
                          }}</strong>
                          <span>{{
                            useUtils().formatCurrency(props.withdrawalValue)
                          }}</span>
                        </div>
                        <div class="row q-gutter-sm">
                          <strong class="text-primary_fiduciaria"
                            >Total operación</strong
                          >
                          <span>{{
                            useUtils().formatCurrency(totalValue)
                          }}</span>
                        </div>
                      </section>
                    </q-td>
                  </q-tr>
                </template>
              </TableList>
            </section>
            <section v-if="selectedRow?.id">
              <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-end">
                <div class="col-12 col-md-3">
                  <GenericSelectorComponent
                    label="Banco"
                    :manual_option="banks"
                    map_options
                    required
                    :default_value="selectedRow.treasury_collection_bank_id"
                    auto_complete
                    clearable
                    :placeholder="'Seleccione'"
                    :rules="[
                      (val: string) =>
                        useRules().is_required(
                          val,
                          'El banco de recaudo es requerido'
                        ),
                    ]"
                    @update:modelValue="selectBank($event)"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <GenericInputComponent
                    label="Descripción banco"
                    placeholder="-"
                    required
                    disabled
                    :default_value="
                      selectedRow.treasury_collection_bank_description
                    "
                    :rules="[]"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <GenericSelectorComponent
                    label="Cuenta origen"
                    :manual_option="flatBankAccounts"
                    map_options
                    required
                    :default_value="selectedRow.fic_account_bank_id"
                    auto_complete
                    clearable
                    :placeholder="'Seleccione'"
                    :rules="[
                      (val: string) =>
                        useRules().is_required(
                          val,
                          'El banco de recaudo es requerido'
                        ),
                    ]"
                    @update:modelValue="selectBankAccount($event)"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <GenericInputComponent
                    label="Descripción cuenta origen"
                    placeholder="-"
                    required
                    disabled
                    :default_value="selectedRow.fic_account_bank_description"
                    :rules="[]"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <GenericInputComponent
                    label="Saldo cuenta origen"
                    placeholder="-"
                    required
                    disabled
                    :default_value="null"
                    :rules="[]"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <GenericInputComponent
                    label="Tipo de cuenta"
                    placeholder="-"
                    required
                    disabled
                    :default_value="selectedRow.fic_account_bank_type"
                    :rules="[]"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <GenericInputComponent
                    label="Cheque"
                    placeholder="-"
                    required
                    disabled
                    :default_value="null"
                    :rules="[]"
                  />
                </div>
                <div class="col-12">
                  <GenericInputComponent
                    label="Observaciones"
                    type="textarea"
                    placeholder="Inserte"
                    required
                    :default_value="selectedRow.observations"
                    :rules="[]"
                    @update:modelValue="selectedRow.observations = $event"
                  />
                </div>
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </q-form>

    <AlertModalComponent
      ref="accountModalRef"
      :show-img-default="false"
      marginTopBody=""
      styleModal="padding: 1vw; min-width: 80%"
      :title-header="'Cuentas'"
      text-btn-confirm="Guardar"
      :disable-confirm="!hasSelectedAccount"
      @confirm="closeAccountModal"
    >
      <template #default-body>
        <section class="detail-table q-px-lg">
          <FiltersComponent
            ref="filterComponentRef"
            :fields="filterConfig"
            @filter="handleBankAccountsFilter"
            @clear-filters="handleBankAccountsClearFilters"
          />
          <q-separator />
          <q-form ref="accountDetailForm">
            <TableList
              dense
              :loading="false"
              :columns="accountsTableProps.columns"
              :rows="accountsTableProps.rows"
              :pages="accountsTableProps.pages"
              :hide-pagination="true"
              :custom-columns="['radio']"
              @update-page="handleBankAccountsUpdatePage"
              @update-rows-per-page="handleBankAccountsUpdateRowsPerPage"
            >
              <template #custom-top-row>
                <q-tr>
                  <q-td>
                    <RadioYesNo
                      v-model="newAccount.selected"
                      :options="[{ label: '', value: true }]"
                      @update:model-value="selectAccount(newAccount)"
                    />
                  </q-td>
                  <q-td>-</q-td>
                  <q-td>
                    <GenericSelectorComponent
                      :manual_option="banksOrFunds"
                      :class_name="'dense-selector'"
                      map_options
                      required
                      :default_value="newAccount.bank_or_fund_id"
                      auto_complete
                      clearable
                      :placeholder="'Seleccione'"
                      :rules="[
                        (val: string) => useRules().is_required(val, ''),
                      ]"
                      @update:modelValue="newAccount.bank_or_fund_id = $event"
                    />
                  </q-td>
                  <q-td>
                    <GenericSelectorComponent
                      v-if="!isTransfer"
                      :class_name="'dense-selector'"
                      :manual_option="newAccountPlansOptions"
                      map_options
                      required
                      :default_value="newAccount.plan_id"
                      auto_complete
                      clearable
                      :placeholder="'Seleccione'"
                      :rules="[
                        (val: string) => useRules().is_required(val, ''),
                      ]"
                      @update:modelValue="newAccount.plan_id = $event"
                    />

                    <GenericSelectorComponent
                      v-else
                      :class_name="'dense-selector'"
                      :manual_option="plan_accounts"
                      map_options
                      required
                      :default_value="newAccount.account_number"
                      auto_complete
                      clearable
                      :placeholder="'Seleccione'"
                      :rules="[
                        (val: string) => useRules().is_required(val, ''),
                      ]"
                      @update:modelValue="newAccount.account_number = $event"
                    />
                  </q-td>
                  <q-td>
                    <GenericSelectorComponent
                      map_options
                      auto_complete
                      clearable
                      required
                      :disabled="!isTransfer"
                      :manual_option="account_types"
                      :class_name="'dense-selector'"
                      :default_value="newAccount.account_type"
                      :placeholder="'Seleccione'"
                      :rules="[
                        (val: string) => useRules().is_required(val, ''),
                      ]"
                      @update:modelValue="newAccount.account_type = $event"
                    />
                  </q-td>
                  <q-td>
                    <GenericSelectorComponent
                      :class_name="'dense-selector'"
                      :manual_option="identification_types_for_plans"
                      map_options
                      required
                      :default_value="newAccount.document_type"
                      auto_complete
                      clearable
                      :placeholder="'Seleccione'"
                      :rules="[
                        (val: string) => useRules().is_required(val, ''),
                      ]"
                      @update:modelValue="newAccount.document_type = $event"
                    />
                  </q-td>
                  <q-td>
                    <GenericInputComponent
                      :class_name="'dense-selector'"
                      placeholder="-"
                      required
                      :default_value="newAccount.holder_document"
                      :rules="[
                        (val: string) => useRules().is_required(val, ''),
                      ]"
                      @update:model-value="newAccount.holder_document = $event"
                    />
                  </q-td>
                  <q-td>
                    <GenericInputComponent
                      :class_name="'dense-selector'"
                      placeholder="-"
                      required
                      :default_value="newAccount.holder_name"
                      :rules="[
                        (val: string) => useRules().is_required(val, ''),
                      ]"
                      @update:model-value="newAccount.holder_name = $event"
                    />
                  </q-td>
                  <q-td>
                    <div class="row no-wrap items-center q-gutter-sm">
                      <RadioYesNo
                        v-model="newAccount.register"
                        :is-switch="true"
                        :is-radio-button="false"
                      />
                      <span>{{ newAccount.register ? 'Sí' : 'No' }}</span>
                    </div>
                  </q-td>
                </q-tr>
              </template>
              <template #radio="{ row }">
                <RadioYesNo
                  v-model="row.selected"
                  :options="[{ label: '', value: true }]"
                  @update:model-value="selectAccount(row)"
                />
              </template>
            </TableList>
          </q-form>
        </section>
      </template>
    </AlertModalComponent>
  </div>
</template>
<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { IInvestmentPlanOperationsBasicDataForm } from '@/interfaces/customs/fics/InvestmentPlanOperations'

// Composables
import { useRules, useUtils } from '@/composables'

// Logic view
import useWithdrawalOperationDetailForm from '@/components/Forms/Fics/InvestmentPlanOperations/OperationDetail/WithdrawalOperationDetailForm'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

const props = withDefaults(
  defineProps<{
    subtype?: IInvestmentPlanOperationsBasicDataForm['subtype']
    fiduciaryInvestmentPlanId: number | null
    withdrawalValue?: number
    fundId: number | null
  }>(),
  {
    withdrawalValue: 0,
  }
)

const {
  account_types,
  identification_types_for_plans,
  plan_accounts,

  banks,
  tableProps,
  newAccount,
  totalValue,
  selectedRow,
  hasSelectedAccount,
  flatBankAccounts,
  filterConfig,
  accountModalRef,
  means_of_payments,
  accountsTableProps,
  banksOrFunds,
  newAccountPlansOptions,
  isTransfer,
  customBottomRowValueTitle,
  addDetail,
  selectBank,
  getFormData,
  removeDetail,
  selectDetail,
  selectAccount,
  openAccountModal,
  closeAccountModal,
  selectBankAccount,
  selectCollectionType,
  isEnableToOpenAccountModal,
  handleBankAccountsClearFilters,
  handleBankAccountsFilter,
  handleBankAccountsUpdatePage,
  handleBankAccountsUpdateRowsPerPage,
  operationDetailForm,
} = useWithdrawalOperationDetailForm(props)

defineExpose({
  validateForm: () => operationDetailForm.value?.validate(),
  getFormData: () => getFormData(),
})
</script>
<style lang="scss" scoped>
:deep(.detail-table, .detail-table .q-tr .q-td) {
  .q-field {
    padding-bottom: 0 !important;
  }
  .q-select .q-field__native {
    min-height: unset;
  }
}
:deep(.dense-selector) {
  padding-bottom: 0 !important;
  .q-field__native {
    min-height: unset;
  }
}
</style>
