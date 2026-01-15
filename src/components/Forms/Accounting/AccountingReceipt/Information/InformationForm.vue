<template>
  <div>
    <q-form ref="informationForm" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-4">
            <template v-if="props.action === 'view'">
              <p class="text-bold mb-0 text-black-10">Código de negocio</p>
              <div>
                {{ accounting_receipt?.business_trust.business_code }}
              </div>
            </template>
            <template v-else>
              <p class="text-weight-medium mb-0" :class="'text-grey-6'">
                Código de negocio{{ '*' }}
              </p>
              <GenericSelectorComponent
                :manual_option="business_trust"
                :map_options="true"
                :required="true"
                :default_value="accounting_receipt?.business_trust.id ?? ''"
                :auto_complete="true"
                :clearable="true"
                :placeholder="'Seleccione'"
                :prepend_icon="'mdi-magnify'"
                :rules="[(val: string) => useRules().is_required(val, 'El código de negocio es requerido')]"
                :disabled="props.action === 'edit'"
                @update:modelValue="selectBusiness($event)"
              />
            </template>
          </div>
          <div class="col-12 col-md-4">
            <template v-if="props.action === 'view'">
              <p class="text-bold mb-0 text-black-10">Nombre de negocio</p>
              <div>
                {{ accounting_receipt?.business_trust.name }}
              </div>
            </template>
            <template v-else>
              <p class="text-weight-medium mb-0" :class="'text-grey-6'">
                Nombre de negocio{{ '*' }}
              </p>
              <GenericInput
                ref="purposeRef"
                placeholder="-"
                :required="true"
                :default_value="selectedBusiness?.name ?? ''"
                disabled
              />
            </template>
          </div>
          <div class="col-12 col-md-4">
            <template v-if="props.action === 'view'">
              <p class="text-bold mb-0 text-black-10">
                Código de estructura contable
              </p>
              <div>
                {{
                  accounting_receipt?.business_trust.account.account_structure
                    .code
                }}
                -
                {{
                  accounting_receipt?.business_trust.account.account_structure
                    .purpose
                }}
              </div>
            </template>
            <template v-else>
              <p class="text-weight-medium mb-0" :class="'text-grey-6'">
                Código de estructura contable{{ '*' }}
              </p>
              <GenericInput
                ref="structureRef"
                placeholder="-"
                :required="true"
                :default_value="`${selectedAccountStructure?.code ?? ''} - ${
                  selectedAccountStructure?.purpose ?? ''
                }`"
                :rules="[(val: string) => useRules().is_required(val, 'El código de estructura requerido')]"
                disabled
              />
            </template>
          </div>
          <div class="col-12 col-md-4">
            <template v-if="props.action === 'view'">
              <p class="text-bold mb-0 text-black-10">Periodo</p>
              <div>
                {{ accounting_receipt?.registration_date.slice(3) }}
              </div>
            </template>
            <template v-else>
              <p class="text-weight-medium mb-0" :class="'text-grey-6'">
                Periodo{{ '*' }}
              </p>
              <GenericDateInput
                ref="periodRef"
                placeholder="-"
                :required="true"
                :default_value="
                  selectedBusiness?.account.current_period
                    ? useUtils().formatDate(
                        selectedBusiness?.account.current_period,
                        'MM/YYYY'
                      )
                    : ''
                "
                :rules="[(val: string) => useRules().is_required(val, 'El periodo es requerido')]"
                disabled
              />
            </template>
          </div>
          <div class="col-12 col-md-4">
            <template v-if="props.action === 'view'">
              <p class="text-bold mb-0 text-black-10">Día de registro</p>
              <div>
                {{ accounting_receipt?.registration_day }}
              </div>
            </template>
            <template v-else>
              <p class="text-weight-medium mb-0" :class="'text-grey-6'">
                Día de registro{{ '*' }}
              </p>
              <GenericSelectorComponent
                :manual_option="daysOptions"
                :map_options="false"
                :required="true"
                :default_value="accounting_receipt?.registration_day ?? ''"
                :auto_complete="false"
                :clearable="false"
                :placeholder="'Seleccione'"
                :prepend_icon="'mdi-magnify'"
                :rules="[(val: string) => useRules().is_required(val, 'El día de registro es requerido')]"
                :disabled="props.action === 'edit'"
                @update:modelValue="
                  accounting_receipt.registration_day = $event
                "
              />
            </template>
          </div>
          <div class="col-12 col-md-4">
            <template v-if="props.action === 'view'">
              <p class="text-bold mb-0 text-black-10">Fecha de registro</p>
              <div>
                {{ accounting_receipt?.registration_date }}
              </div>
            </template>
            <template v-else>
              <p class="text-weight-medium mb-0" :class="'text-grey-6'">
                Fecha de registro{{ '*' }}
              </p>
              <GenericDateInput
                ref="register_dateRef"
                placeholder="-"
                :required="true"
                :default_value="accounting_receipt?.registration_date ?? ''"
                :rules="[(val: string) => useRules().is_required(val, 'La fecha de registro es requerida')]"
                disabled
              />
            </template>
          </div>
          <div class="col-12 col-md-4">
            <template v-if="props.action === 'view'">
              <p class="text-bold mb-0 text-black-10">Tipo de comprobante</p>
              <div>
                {{ accounting_receipt?.receipt_type.code }} -
                {{ accounting_receipt?.receipt_type.name }}
              </div>
            </template>
            <template v-else>
              <p class="text-weight-medium mb-0" :class="'text-grey-6'">
                Tipo de comprobante{{ '*' }}
              </p>
              <GenericSelectorComponent
                :manual_option="receipt_types"
                :map_options="true"
                :required="true"
                :default_value="accounting_receipt?.receipt_type_id ?? ''"
                :auto_complete="true"
                :clearable="true"
                :placeholder="'Seleccione'"
                :prepend_icon="'mdi-magnify'"
                :rules="[(val: string) => useRules().is_required(val, 'El tipo de comprobante es requerido')]"
                :disabled="props.action === 'edit'"
                @update:modelValue="accounting_receipt.receipt_type_id = $event"
              />
            </template>
          </div>
          <div class="col-12 col-md-4">
            <template v-if="props.action === 'view'">
              <p class="text-bold mb-0 text-black-10">Subtipo de comprobante</p>
              <div>
                {{ accounting_receipt?.sub_receipt_type.code }} -
                {{ accounting_receipt?.sub_receipt_type.name }}
              </div>
            </template>
            <template v-else>
              <p class="text-weight-medium mb-0" :class="'text-grey-6'">
                Subtipo de comprobante{{ '*' }}
              </p>
              <GenericSelectorComponent
                :manual_option="sub_receipt_types"
                :map_options="true"
                :required="true"
                :default_value="
                  accounting_receipt?.sub_receipt_type_id
                    ? accounting_receipt.sub_receipt_type_id
                    : ''
                "
                :auto_complete="true"
                :clearable="true"
                :placeholder="'Seleccione'"
                :prepend_icon="'mdi-magnify'"
                :rules="[(val: string) => useRules().is_required(val, 'El subtipo de comprobante es requerido')]"
                :disabled="props.action === 'edit'"
                @update:modelValue="
                  accounting_receipt.sub_receipt_type_id = $event
                "
              />
            </template>
          </div>
          <div class="col-12 col-md-4">
            <template v-if="props.action === 'view'">
              <p class="text-bold mb-0 text-black-10">
                Consecutivo comprobante
              </p>
              <div>
                {{ accounting_receipt?.code }}
              </div>
            </template>
            <template v-if="props.action === 'edit'">
              <p class="text-weight-medium mb-0" :class="'text-grey-6'">
                Consecutivo comprobante{{ '*' }}
              </p>
              <GenericInput
                ref="serieRef"
                placeholder="-"
                :required="true"
                :default_value="accounting_receipt?.code ?? ''"
                disabled
              />
            </template>
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
          hide-bottom
          :custom-columns="customColumns"
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
              <q-td>{{
                useUtils().formatCurrencyString(
                  accounting_receipt.total_amount_debits
                )
              }}</q-td>
              <q-td colspan="3"
                >-{{
                  useUtils().formatCurrencyString(
                    accounting_receipt.total_amount_credits
                  )
                }}</q-td
              >
            </q-tr>
            <q-tr>
              <q-td colspan="6" align="right">
                <strong class="text-primary_fiduciaria">Diferencia</strong>
              </q-td>
              <q-td></q-td>
              <q-td
                :class="
                  accounting_receipt.difference_amount
                    ? 'text-weight-bolder text-negative'
                    : ''
                "
                >{{
                  useUtils().formatCurrencyString(
                    accounting_receipt.difference_amount
                  )
                }}</q-td
              >
              <q-td colspan="2">
                <span
                  v-if="accounting_receipt.difference_amount"
                  class="text-negative"
                  >La diferencia debe ser 0
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
              :auto_complete="false"
              :clearable="false"
              @update:modelValue="row.account_id = $event"
              :rules="[(val: string) => useRules().is_required(val, '')]"
            />
          </template>
          <template #third_party_id="{ row }">
            <GenericSelectorComponent
              :manual_option="third_parties"
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
              :auto_complete="false"
              :clearable="false"
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
            <CurrencyInput
              v-model="row.debit"
              :currency="'COP'"
              :placeholder="''"
              :disabled="row.nature !== 'Débito'"
              currencyLabel=""
              :rules="[
                (val: string) => useRules().is_required(val, ''),
                (val: string) => useRules().max_length(val, 17),
                (val: string) => useRules().min_length(val, 1),
              ]"
            />
          </template>
          <template #credit="{ row }">
            <CurrencyInput
              v-model="row.credit"
              :currency="'COP'"
              :placeholder="''"
              :disabled="row.nature !== 'Crédito'"
              currencyLabel=""
              :rules="[
                (val: string) => useRules().is_required(val, ''),
                (val: string) => useRules().max_length(val, 17),
                (val: string) => useRules().min_length(val, 1),
              ]"
            />
          </template>
          <template #foreign_currency="{ row }">
            <CurrencyInput
              v-model="row.foreign_currency"
              hide-icon
              :currency="'COP'"
              :placeholder="''"
              :disabled="!isReexpressed(row)"
              currencyLabel=""
              :rules="[
                (val: string) => useRules().is_required(val, ''),
                (val: string) => useRules().max_length(val, 17),
                (val: string) => useRules().min_length(val, 1),
              ]"
            />
          </template>
          <template #actions="{ row }">
            <!-- Eliminar -->
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
import Button from '@/components/common/Button/Button.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import TableList from '@/components/table-list/TableList.vue'

import { defaultIconsLucide } from '@/utils'
import useInformationForm from './InformationForm'
import { useRules, useUtils } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
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
  daysOptions,
  informationForm,
  receipt_types,
  selectedBusiness,
  selectedAccountStructure,
  sub_receipt_types,
  third_parties,
  voucher_natures,
  isView,
  customColumns,
  isReexpressed,
  hasCostCenter,
  removeAmount,
  addReceiptAmount,
  downloadAccountingReceipt,
  selectBusiness,
  setThirdParty,
  getPayloadData,
  validateAccountingReceipt,
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
