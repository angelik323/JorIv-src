<template>
  <div>
    <q-form ref="informationForm" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-3">
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
              @update:modelValue="accounting_receipt.business_trust_id = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Negocio</p>
              <p class="text-weight-medium no-margin">
                {{ accounting_receipt?.business_trust?.business_code }} -
                {{ accounting_receipt?.business_trust?.name }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(props.action)"
              :manual_option="selectedAccountStructure"
              label="Estructura contable"
              :map_options="true"
              :required="true"
              :default_value="
                ['edit'].includes(props.action)
                  ? accounting_receipt?.business_trust_account_structure_label
                  : accounting_receipt?.business_trust?.account
                      ?.account_structure?.id ?? ''
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
          <div class="col-12 col-md-3">
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

          <div class="col-12 col-md-3">
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
                  : selectedBusiness?.account.current_period
                  ? useUtils().formatDate(
                      selectedBusiness?.account.current_period,
                      'YYYY-MM'
                    )
                  : ''
              "
              mask="YYYY-MM"
              :disabled="['edit'].includes(props.action)"
              :rules="[(val: string) => useRules().is_required(val, 'El periodo es requerido')]"
              @update:modelValue="accounting_receipt.registration_date = $event"
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

          <div class="col-12 col-md-3">
            <GenericDateInput
              v-if="['create', 'edit'].includes(props.action)"
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

          <div class="col-12 col-md-3">
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

          <div class="col-12 col-md-3">
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

          <div class="col-12 col-md-3" v-if="['view'].includes(props.action)">
            <p class="text-bold mb-0 text-black-10">Consecutivo</p>
            <p class="text-weight-medium no-margin">
              {{ accounting_receipt?.code }}
            </p>
          </div>
          <div class="col-12 col-md-3" v-if="['view'].includes(props.action)">
            <p class="text-bold mb-0 text-black-10">Estado</p>
            <div>
              <ShowStatus
                :type="Number(accounting_receipt?.status?.id ?? 1)"
                classCustom="q-px-md q-py-md"
              />
            </div>
          </div>
        </div>
      </section>

      <q-separator spaced />

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

              <q-td>
                {{
                  useUtils().formatCurrencyString(
                    accounting_receipt.total_amount_debits ?? '0'
                  )
                }}
              </q-td>

              <q-td colspan="3">
                {{
                  useUtils().formatCurrencyString(
                    accounting_receipt.total_amount_credits ?? '0'
                  )
                }}
              </q-td>
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
              >
                {{
                  useUtils().formatCurrencyString(
                    accounting_receipt.difference_amount ?? '0'
                  )
                }}
              </q-td>

              <q-td colspan="2">
                <span
                  v-if="Number(accounting_receipt.difference_amount)"
                  class="text-negative"
                >
                  La diferencia debe ser 0
                </span>
              </q-td>
            </q-tr>
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

          <template #account_id="{ row }">
            <GenericSelectorComponent
              :manual_option="accounts_charts"
              :map_options="true"
              :required="true"
              :default_value="row.account_id"
              :auto_complete="true"
              :clearable="true"
              @update:modelValue="setAccountValue($event, row)"
              :rules="[(val: string) => useRules().is_required(val, '')]"
            />
          </template>

          <template #third_party_id="{ row }">
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
              :rules="[(v: string) => useRules().is_required(v, ''), (v: string) => useRules().only_alphanumeric(v, false)]"
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
                (val: string) => useRules().only_positive_value(val)
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
                (val: string) => useRules().only_positive_value(val)
              ]"
              @update:model-value="({ rawValue }) => (row.credit = rawValue)"
            />
          </template>

          <template #foreign_currency="{ row }">
            <InputMoneyComponent
              :model-value="row.foreign_currency"
              placeholder="0,00"
              :max_integer_digits="25"
              required
              hide_symbol
              :disabled="!isReexpressed(row) || !canForeignCurrency"
              :rules="[
                (val: string) => useRules().is_required(val, ''),
                (val: string) => useRules().only_positive_value(val)
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
</template>
<script setup lang="ts">
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

// Logic view
import useInformationForm from '@/components/Forms/Accounting/AccountingReceipt/Information/v2/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    id?: number
  }>(),
  {}
)

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
  // daysOptions,
  receipt_types_manual_without_cancellation_subtypes,
  informationForm,
  selectedBusiness,
  selectedAccountStructure,
  structureApplied,
  sub_receipt_types,
  third_parties_label,
  voucher_natures,
  isView,
  customColumns,
  canForeignCurrency,
  defaultIconsLucide,
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
</style>
