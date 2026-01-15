<template>
  <div>
    <q-form ref="informationForm" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-lg">
          <div
            class="col-12"
            :class="['view'].includes(props.action) ? 'col-md-4' : 'col-md-3'"
          >
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(props.action)"
              :manual_option="
                business_trust.map((item) => ({
                  ...item,
                  label: `${item.business_code} - ${item.name}`,
                }))
              "
              label="Negocio"
              :map_options="true"
              :required="true"
              :default_value="accounting_receipt?.business_trust?.id ?? ''"
              :auto_complete="true"
              :clearable="true"
              :placeholder="'Seleccione'"
              :prepend_icon="'mdi-magnify'"
              :rules="[(val: string) => useRules().is_required(val, 'El código de negocio es requerido')]"
              :disabled="['edit'].includes(props.action)"
              @update:modelValue="changeBusinessTrust"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Negocio</p>
              <p class="text-weight-medium no-margin">
                {{ accounting_receipt?.business_trust?.business_code }} -
                {{ accounting_receipt?.business_trust?.name }}
              </p>
            </div>
          </div>

          <div
            class="col-12"
            :class="['view'].includes(props.action) ? 'col-md-4' : 'col-md-3'"
          >
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(props.action)"
              :manual_option="selectedAccountStructure"
              label="Estructura contable"
              :map_options="true"
              :required="true"
              :default_value="
                ['edit'].includes(props.action)
                  ? accounting_receipt?.business_trust_account_structure_label
                  : accounting_receipt.accounting_structure_id ?? ''
              "
              :auto_complete="true"
              :clearable="true"
              :placeholder="'Seleccione'"
              :prepend_icon="'mdi-magnify'"
              :rules="[(val: string) => useRules().is_required(val, 'El código de estructura requerido')]"
              :disabled="['edit'].includes(props.action)"
              @update:modelValue="
                accounting_receipt.accounting_structure_id = $event
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Estructura contable</p>
              <p class="text-weight-medium no-margin">
                {{ accounting_receipt?.accounting_structure?.code }}
                -
                {{ accounting_receipt?.accounting_structure?.purpose }}
              </p>
            </div>
          </div>
          <div
            class="col-12"
            :class="['view'].includes(props.action) ? 'col-md-4' : 'col-md-3'"
          >
            <GenericInput
              v-if="['create', 'edit'].includes(props.action)"
              ref="purposeRef"
              label="Estructura contable aplicada"
              placeholder="-"
              :required="true"
              :default_value="
                ['edit'].includes(props.action)
                  ? accounting_receipt?.structure_applied_label
                  : structureApplied?.accounting_structure ?? ''
              "
              disabled
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Estructura contable aplicada
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  BusinessTrustAccountStructureTypesEnum[
                    accounting_receipt?.accounting_structure
                      ?.type as keyof typeof BusinessTrustAccountStructureTypesEnum
                  ]
                }}
              </p>
            </div>
          </div>

          <div
            class="col-12"
            :class="['view'].includes(props.action) ? 'col-md-4' : 'col-md-3'"
          >
            <GenericDateInput
              v-if="['create', 'edit'].includes(props.action)"
              ref="periodRef"
              label="Periodo"
              placeholder="-"
              :required="true"
              :default_value="
                ['edit'].includes(props.action)
                  ? useUtils().formatDate(
                      accounting_receipt?.registration_date,
                      'YYYY-MM'
                    )
                  : periodValue
              "
              mask="YYYY-MM"
              :disabled="['edit'].includes(props.action)"
              :rules="[(val: string) => useRules().is_required(val, 'El periodo es requerido')]"
              @update:modelValue="changePeriod($event)"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Periodo</p>
              <p class="text-weight-medium no-margin">
                {{
                  useUtils().formatDate(
                    accounting_receipt?.registration_date,
                    'YYYY-MM'
                  )
                }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4" v-if="['view'].includes(props.action)">
            <p class="text-bold mb-0 text-black-10">Estado</p>
            <div>
              <ShowStatus
                :type="Number(accounting_receipt?.status?.id ?? 1)"
                chip-class="q-px-md q-py-md"
              />
            </div>
          </div>

          <div
            class="col-12"
            :class="['view'].includes(props.action) ? 'col-md-4' : 'col-md-3'"
          >
            <GenericDateInput
              v-if="['create', 'edit'].includes(props.action)"
              :key="`register-date-${periodValue}`"
              label="Fecha de registro"
              ref="register_dateRef"
              placeholder="-"
              :required="true"
              :default_value="
                accounting_receipt?.registration_date
                  ? useUtils().formatDate(
                      accounting_receipt?.registration_date,
                      'YYYY-MM-DD'
                    ) ?? ''
                  : ''
              "
              :rules="[(val: string) => useRules().is_required(val, 'La fecha de registro es requerida')]"
              @update:modelValue="accounting_receipt.registration_date = $event"
              :disabled="['edit'].includes(props.action)"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Fecha de registro</p>
              <p class="text-weight-medium no-margin">
                {{
                  useUtils().formatDate(
                    accounting_receipt?.registration_date,
                    'YYYY-MM-DD'
                  )
                }}
              </p>
            </div>
          </div>

          <div
            class="col-12"
            :class="['view'].includes(props.action) ? 'col-md-4' : 'col-md-3'"
          >
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(props.action)"
              :manual_option="
                receipt_types_manual_without_cancellation_subtypes
              "
              label="Tipo de comprobante"
              :map_options="true"
              :required="true"
              :default_value="accounting_receipt?.receipt_type?.id ?? ''"
              :auto_complete="true"
              :clearable="true"
              :placeholder="'Seleccione'"
              :prepend_icon="'mdi-magnify'"
              :rules="[(val: string) => useRules().is_required(val, 'El tipo de comprobante es requerido')]"
              :disabled="['edit'].includes(props.action)"
              @update:modelValue="accounting_receipt.receipt_type_id = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Tipo de comprobante</p>
              <p class="text-weight-medium no-margin">
                {{ accounting_receipt?.receipt_type?.code }} -
                {{ accounting_receipt?.receipt_type?.name }}
              </p>
            </div>
          </div>

          <div
            class="col-12"
            :class="['view'].includes(props.action) ? 'col-md-4' : 'col-md-3'"
          >
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(props.action)"
              :manual_option="sub_receipt_types"
              label="Subtipo de comprobante"
              :map_options="true"
              :required="true"
              :default_value="
                ['edit'].includes(props.action)
                  ? accounting_receipt?.sub_receipt_type_label
                  : accounting_receipt?.sub_receipt_type_id ?? ''
              "
              :auto_complete="true"
              :clearable="true"
              :placeholder="'Seleccione'"
              :prepend_icon="'mdi-magnify'"
              :rules="[(val: string) => useRules().is_required(val, 'El subtipo de comprobante es requerido')]"
              :disabled="['edit'].includes(props.action)"
              @update:modelValue="
                accounting_receipt.sub_receipt_type_id = $event
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Subtipo de comprobante</p>
              <p class="text-weight-medium no-margin">
                {{ accounting_receipt?.sub_receipt_type?.code }} -
                {{ accounting_receipt?.sub_receipt_type?.name }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4" v-if="['view'].includes(props.action)">
            <p class="text-bold mb-0 text-black-10">Consecutivo</p>
            <p class="text-weight-medium no-margin">
              {{ accounting_receipt?.code }}
            </p>
          </div>

          <div class="col-12">
            <q-separator spaced />
          </div>
        </div>
      </section>

      <section class="q-pt-lg amounts-table">
        <TableList
          :title="amountsTableProps.title"
          :loading="amountsTableProps.loading"
          :columns="amountsTableProps.columns"
          :rows="amountsTableProps.rows"
          :pages="amountsTableProps.pages"
          :rows-per-page="amountsTableProps.rowsPerPage"
          :custom-columns="customColumns"
          @update-page="updateAmountsPage"
          @update-rows-per-page="updateAmountsRowsPerPage"
        >
          <template v-if="action !== 'view'" #custom-header-action>
            <Button
              :outline="false"
              label="Agregar"
              left-icon="PlusCircle"
              color-icon="white"
              :styleContent="{
                'place-items': 'center',
                'border-radius': '20px',
                'font-size': '13px',
              }"
              @click="addReceiptAmount"
            />
          </template>

          <template v-if="action === 'view'" #custom-header-action>
            <q-btn
              outline
              unelevated
              class="text-capitalize btn-filter custom"
              size="100%"
              color="orange"
              @click="downloadAccountingReceipt"
              :tooltip="'Descargar excel'"
            >
              <div class="text-black flex align-center">
                <img
                  class="image-excel q-mr-sm"
                  src="@/assets/images/excel.svg"
                  alt="Excel Icon"
                />
                Descargar excel
              </div>
            </q-btn>
          </template>

          <template v-if="amountsTableProps.rows.length" #custom-bottom-row>
            <q-tr>
              <q-td colspan="6" align="right">
                <strong class="text-primary_fiduciaria">Totales</strong>
              </q-td>

              <q-td align="right">
                {{
                  useUtils().formatCurrencyString(
                    accounting_receipt.total_amount_debits ?? '0'
                  )
                }}
              </q-td>

              <q-td align="right">
                {{
                  useUtils().formatCurrencyString(
                    accounting_receipt.total_amount_credits ?? '0'
                  )
                }}
              </q-td>
              <q-td colspan="3"></q-td>
            </q-tr>

            <q-tr>
              <q-td colspan="6" align="right">
                <strong class="text-primary_fiduciaria">Diferencia</strong>
              </q-td>

              <q-td></q-td>

              <q-td
                :class="
                  Number(accounting_receipt.difference_amount || 0) !== 0
                    ? 'text-weight-bolder text-negative'
                    : ''
                "
                align="right"
              >
                {{
                  useUtils().formatCurrencyString(
                    accounting_receipt.difference_amount ?? '0'
                  )
                }}
              </q-td>

              <q-td colspan="3">
                <span
                  v-if="Number(accounting_receipt.difference_amount)"
                  class="text-negative"
                >
                  La diferencia debe ser 0
                </span>
              </q-td>
            </q-tr>
          </template>

          <template #id="{ index }">
            {{
              (amountsTableProps.pages.currentPage - 1) *
                amountsTableProps.rowsPerPage +
              index +
              1
            }}
          </template>

          <template #nature="{ row }">
            <GenericSelectorComponent
              :manual_option="voucher_natures"
              :map_options="true"
              :required="true"
              :default_value="row.nature"
              :auto_complete="false"
              :clearable="false"
              @update:modelValue="row.nature = $event"
              :rules="[(val: string) => useRules().is_required(val, '')]"
            />
          </template>

          <template #account_id="{ row, index }">
            <div class="input-with-button">
              <div class="input-wrapper">
                <GenericSelectorComponent
                  :default_value="row.account_id"
                  placeholder="Seleccione"
                  :manual_option="accounts_charts"
                  auto_complete
                  map_options
                  clearable
                  required
                  @update:modelValue="setAccountValue($event, row)"
                  :rules="[(val: string) => useRules().is_required(val, '')]"
                />
              </div>

              <Button
                :icon="defaultIconsLucide.filter"
                :outline="false"
                color="white"
                :color-icon="'#762344'"
                class="custom"
                @click="
                  () => {
                    rowSelectedForFilterAdvanced = index
                    accountingAccountFilterRef?.openFilter()
                  }
                "
              />
            </div>
          </template>

          <template #third_party_id="{ row }">
            <div class="input-with-button">
              <div class="input-wrapper">
                <GenericSelectorComponent
                  :manual_option="third_parties_label"
                  :map_options="true"
                  :required="true"
                  :default_value="row.third_party_id ? row.third_party_id : ''"
                  :auto_complete="true"
                  :clearable="true"
                  @update:modelValue="setThirdParty(row, $event)"
                  :rules="[(val: string) => useRules().is_required(val, '')]"
                />
              </div>

              <Button
                :icon="defaultIconsLucide.filter"
                :outline="false"
                color="white"
                :color-icon="'#762344'"
                class="custom"
                @click="thirdPartiesFilterRef?.openFilter()"
              />
            </div>
          </template>

          <template #cost_center_id="{ row }">
            <GenericSelectorComponent
              :manual_option="cost_center"
              :map_options="true"
              :required="false"
              :default_value="row.cost_center_id"
              :auto_complete="true"
              :clearable="true"
              :disabled="!hasCostCenter(row)"
              @update:modelValue="row.cost_center_id = $event"
              :rules="[(val: string) => useRules().is_required(val, '')]"
            />
          </template>

          <template #register_detail="{ row }">
            <GenericInput
              ref="detailRef"
              :required="true"
              :default_value="row.register_detail ?? ''"
              :rules="[(v: string) => useRules().is_required(v, ''), (v: string) => useRules().only_alphanumeric(v, false), (v: string) => useRules().max_length(v, 250)]"
              @update:model-value="row.register_detail = $event"
            />
          </template>

          <template #debit="{ row }">
            <InputMoneyComponent
              :model-value="
                row.nature === 'Crédito' ? (row.debit = '0.00') : row.debit
              "
              placeholder="0,00"
              :max_integer_digits="25"
              required
              :disabled="row.nature !== 'Débito'"
              :rules="[
                (val: string) => useRules().is_required(val, ''),
                (val: string) => useRules().only_positive_value(val),
                (val: string) => useRules().min_currency_value(val, 1)
              ]"
              @update:model-value="
                (rawValue) => {
                  row.debit = rawValue.rawValue
                }
              "
            />
          </template>

          <template #credit="{ row }">
            <InputMoneyComponent
              :model-value="
                row.nature === 'Débito' ? (row.credit = '0.00') : row.credit
              "
              placeholder="0,00"
              :max_integer_digits="25"
              required
              :disabled="row.nature !== 'Crédito'"
              :rules="[
                (val: string) => useRules().is_required(val, ''),
                (val: string) => useRules().only_positive_value(val),
                (val: string) => useRules().min_currency_value(val, 1)
              ]"
              @update:model-value="({ rawValue }) => (row.credit = rawValue)"
            />
          </template>

          <template #type_foreign_currency="{ row }">
            <GenericInput
              required
              :default_value="row.type_foreign_currency"
              placeholder="-"
              disabled
            />
          </template>

          <template #foreign_currency="{ row }">
            <InputMoneyComponent
              :model-value="row.foreign_currency"
              placeholder="0,00"
              :max_integer_digits="25"
              :max_decimal_digits="2"
              required
              hide_symbol
              :disabled="!isReexpressed(row) || !canForeignCurrency"
              :rules="[
                (val: string) => useRules().is_required(val, ''),
                (val: string) => useRules().only_positive_value(val),
                (val: string) => useRules().min_currency_value(val, 1)
              ]"
              @update:model-value="
                ({ rawValue }) => (row.foreign_currency = rawValue)
              "
            />
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              :disabled="isView"
              @click="removeAmount(row)"
            />
          </template>
        </TableList>
      </section>
    </q-form>
  </div>
  <AccountingAccountFilter
    v-if="accounting_receipt.accounting_structure_id && action !== 'view'"
    ref="accountingAccountFilterRef"
    :key="accounting_receipt.accounting_structure_id"
    :accounting_structure_id="accounting_receipt.accounting_structure_id"
    @response:selector-accounts="
      ($event) => {
        const row = amountsTableProps.rows[rowSelectedForFilterAdvanced]
        setAccountValue($event.selectedAccount.id, row)
      }
    "
  />
  <ThirdPartiesFilter
    ref="thirdPartiesFilterRef"
    @response:selected-thirdparty="
      ($event) => {
        const row = amountsTableProps.rows[rowSelectedForFilterAdvanced]
        setThirdParty(row, $event)
      }
    "
  />
</template>
<script setup lang="ts">
// Vue
import { ref } from 'vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { BusinessTrustAccountStructureTypesEnum } from '@/interfaces/customs/accounting'

// Composables
import { useRules, useUtils } from '@/composables'

// Components
import Button from '@/components/common/Button/Button.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import AccountingAccountFilter from '@/components/AdvancedFilters/Accounting/AccountingAccount/AccountingAccountFilter.vue'
import ThirdPartiesFilter from '@/components/AdvancedFilters/Accounting/ThirdParties/ThirdPartiesFilter.vue'

// Logic view
import useInformationForm from '@/components/Forms/Accounting/AccountingReceipt/Information/v3/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    id?: number
  }>(),
  {}
)

const accountingAccountFilterRef = ref()
const thirdPartiesFilterRef = ref()
const rowSelectedForFilterAdvanced = ref<number>(0)

defineExpose({
  validateForm: () => validateAccountingReceipt(),
  getFormData: () => getPayloadData(),
})

const {
  accounting_receipt,
  accounts_charts,
  amountsTableProps,
  business_trust,
  cost_center,
  receipt_types_manual_without_cancellation_subtypes,
  informationForm,
  selectedAccountStructure,
  structureApplied,
  sub_receipt_types,
  third_parties_label,
  voucher_natures,
  isView,
  customColumns,
  canForeignCurrency,
  defaultIconsLucide,
  periodValue,
  isReexpressed,
  hasCostCenter,
  removeAmount,
  addReceiptAmount,
  downloadAccountingReceipt,
  setThirdParty,
  getPayloadData,
  validateAccountingReceipt,
  setAccountValue,
  updateAmountsPage,
  updateAmountsRowsPerPage,
  changeBusinessTrust,
  changePeriod,
} = useInformationForm(props)
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

.input-with-button {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  max-width: 100%;

  .input-wrapper {
    flex: 1;
    max-width: 80%;
  }
}
</style>
