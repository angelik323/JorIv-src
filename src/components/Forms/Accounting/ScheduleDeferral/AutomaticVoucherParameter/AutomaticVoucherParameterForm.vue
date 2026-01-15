// automatic vue
<template>
  <q-form ref="automaticVoucherParameterForm" class="q-px-md q-pt-md">
    <div>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericInput
            v-if="props.action !== 'view'"
            placeholder="Inserte"
            label="Cuotas"
            :required="true"
            :default_value="basicData.installments"
            @update:model-value="changeQuota($event)"
            :rules="[
              (v: string) => useRules().is_required(v, 'La cuota es requerida'),
              (v: string) => useRules().only_number(v),
              (v: string) => useRules().max_length(v, 4),
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Cuotas</p>
            <p class="text-weight-medium no-margin">
              {{ basicData.installments ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <GenericInput
            v-if="props.action !== 'view'"
            placeholder="-"
            label="Valor cuota"
            :required="true"
            :default_value="
              basicData.installment_amount
                ? useUtils().formatCurrencyString(basicData.installment_amount)
                : ''
            "
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor cuota</p>
            <p class="text-weight-medium no-margin">
              {{ basicData.installment_amount ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <GenericDateInput
            v-if="props.action !== 'view'"
            ref="periodRef"
            placeholder="AAAA-MM"
            mask="YYYY-MM"
            label="Desde"
            required
            :default_value="basicData.start_period"
            :rules="[(val: string) => useRules().is_required(val, 'El periodo es requerido')]"
            @update:model-value="basicData.start_period = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Desde</p>
            <p class="text-weight-medium no-margin">
              {{ basicData.start_period ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <q-separator
      class="q-mx-md"
      :class="props.action === 'view' ? 'q-mt-md' : ''"
    />
    <!-- Listado parámetros -->
    <section class="params-table">
      <VCard :show-border="false" class="q-pt-lg">
        <template #content-card>
          <TableList
            :title="parameterTableProps.title"
            :loading="parameterTableProps.loading"
            :columns="parameterTableProps.columns"
            :rows="parameterTableProps.rows"
            :dense="true"
            :hide-bottom="true"
            :custom-columns="
              props.action !== 'view'
                ? [
                    'receipt_type',
                    'sub_receipt_type',
                    'reduction',
                    'nature',
                    'aux',
                    'cost_center',
                    'percentage',
                    'counterpart_chart',
                    'counterpart_aux',
                    'counterpart_cost_center',
                    'actions',
                  ]
                : []
            "
          >
            <template v-if="props.action !== 'view'" #custom-header-action>
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
                @click="addParameter"
              />
            </template>
            <template v-if="parameterTableProps.rows.length" #custom-bottom-row>
              <q-tr>
                <q-td colspan="3" align="right">
                  <strong class="text-primary_fiduciaria">Totales</strong>
                </q-td>
                <q-td colspan="5">
                  <span>{{ percentage }}%</span>
                </q-td>
              </q-tr>
            </template>
            <template #receipt_type="{ row }">
              <GenericSelectorComponent
                :manual_option="receipt_types"
                map_options
                required
                :default_value="row.receipt_type_id"
                :auto_complete="false"
                :clearable="false"
                @update:modelValue="selectReceiptType(row, $event)"
                :rules="[(val: string) => useRules().is_required(val, '')]"
              />
            </template>
            <template #sub_receipt_type="{ row }">
              <GenericSelectorComponent
                :manual_option="subReceiptTypesByParent(row.receipt_type_id)"
                map_options
                required
                :default_value="row.sub_receipt_type_id || ''"
                :auto_complete="false"
                :clearable="false"
                @update:modelValue="row.sub_receipt_type_id = $event"
                :rules="[(val: string) => useRules().is_required(val, '')]"
              />
            </template>
            <template #percentage="{ row }">
              <GenericInput
                required
                :default_value="row.percentage ?? ''"
                :rules="[
                (v: string) => useRules().is_required(v, ''),
                (v: string) => useRules().only_number_with_decimals(v),
                () => validatePercentage(),
              ]"
                lazy_rules
                @update:model-value="row.percentage = $event"
              />
            </template>
            <template #counterpart_chart="{ row }">
              <GenericSelectorComponent
                :manual_option="account_charts"
                map_options
                required
                :default_value="row.counterpart_account_id"
                :auto_complete="false"
                :clearable="false"
                @update:modelValue="row.counterpart_account_id = $event"
                :rules="[(val: string) => useRules().is_required(val, '')]"
              />
            </template>
            <template #counterpart_aux="{ row }">
              <GenericSelectorComponent
                :manual_option="third_parties"
                map_options
                required
                :default_value="row.counterpart_auxiliary_id"
                auto_complete
                clearable
                @update:modelValue="row.counterpart_auxiliary_id = $event"
                :rules="[(val: string) => useRules().is_required(val, '')]"
              />
            </template>
            <template #counterpart_cost_center="{ row }">
              <GenericSelectorComponent
                :manual_option="cost_centers"
                map_options
                required
                :default_value="row.counterpart_cost_center_id || null"
                :auto_complete="false"
                :clearable="false"
                :disabled="!hasCostCenter(row, row.counterpart_account_id)"
                @update:modelValue="row.counterpart_cost_center_id = $event"
                :rules="[(val: string) => useRules().is_required(val, '')]"
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
                @click="deleteParameter(row)"
              />
            </template>
          </TableList>
        </template>
      </VCard>
    </section>
  </q-form>
</template>
<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import useAutomaticVoucherParameterForm from './AutomaticVoucherParameterForm'
import { useRules, useUtils } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { ActionType } from '@/interfaces/global'
import { IDeferredDataModel } from '@/interfaces/customs'

const props = withDefaults(
  defineProps<{
    action: ActionType
    id?: number
    data: IDeferredDataModel
  }>(),
  {}
)

defineExpose({
  validateForm: () => validateScheduleDeferral(),
  getFormData: () => getPayloadData(),
})

const {
  automaticVoucherParameterForm,
  account_charts,
  cost_centers,
  parameterTableProps,
  receipt_types,
  third_parties,
  percentage,
  basicData,
  subReceiptTypesByParent,
  addParameter,
  deleteParameter,
  changeQuota,
  selectReceiptType,
  validatePercentage,
  hasCostCenter,
  getPayloadData,
  validateScheduleDeferral,
} = useAutomaticVoucherParameterForm(props)
</script>
<style lang="scss" scoped>
.params-table {
  :deep(.q-field) {
    padding-bottom: 0 !important;
  }
  :deep(.generic-selector .q-field__control .q-field__native) {
    min-height: unset;
  }
}
</style>
