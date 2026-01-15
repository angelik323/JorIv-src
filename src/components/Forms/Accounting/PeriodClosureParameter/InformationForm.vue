<template>
  <div>
    <q-form ref="informationForm" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-4">
            <template v-if="props.action === 'view'">
              <p class="text-weight-bold no-margin text-black-90">
                Estructura contable
              </p>
              <p class="text-weight-medium no-margin">
                {{ period_closure_parameter?.structure.name }}
              </p>
            </template>
            <GenericSelectorComponent
              v-else
              :manual_option="available_accounting_structures"
              label="Estructura contable"
              map_options
              required
              auto_complete
              clearable
              :default_value="
                ['create'].includes(props.action)
                  ? period_closure_parameter?.structure.id || null
                  : `${period_closure_parameter?.structure.code} - ${period_closure_parameter?.structure.name}`
              "
              :placeholder="'Busque por código de estructura y/o finalidad'"
              :prepend_icon="'mdi-magnify'"
              :rules="[(val: string) => useRules().is_required(val, 'La estructura contable es requerida')]"
              :disabled="props.action === 'edit'"
              @update:modelValue="selectAccountStructure($event)"
            />
          </div>
          <div class="col-12 col-md-4">
            <template v-if="props.action === 'view'">
              <p class="text-weight-bold mb-0 text-black-90">Código</p>
              <p class="text-weight-medium no-margin">
                {{ period_closure_parameter?.structure.code }}
              </p>
            </template>
            <GenericInput
              v-else
              ref="codeRef"
              label="Código"
              placeholder="-"
              required
              :default_value="period_closure_parameter?.structure.code ?? ''"
              disabled
            />
          </div>
          <div class="col-12 col-md-4">
            <template v-if="props.action === 'view'">
              <p class="text-weight-bold mb-0 text-black-90">Finalidad</p>
              <p class="text-weight-medium no-margin">
                {{ period_closure_parameter?.structure.purpose }}
              </p>
            </template>
            <GenericInput
              v-else
              ref="purposeRef"
              label="Finalidad"
              placeholder="-"
              required
              :default_value="period_closure_parameter?.structure.purpose ?? ''"
              disabled
            />
          </div>
        </div>
      </section>
      <q-separator spaced />
      <section class="q-pt-lg catalog-limit-table">
        <TableList
          :title="eventsTableProps.title"
          :loading="eventsTableProps.loading"
          :columns="eventsTableProps.columns"
          :rows="eventsTableProps.rows"
          hide-bottom
          :custom-columns="customColumns"
        >
          <template v-if #event="{ row }">
            <GenericInput
              placeholder="-"
              :required="true"
              :default_value="row.event"
              disabled
            />
          </template>
          <template #nature="{ row }">
            <GenericSelectorComponent
              :manual_option="account_closing_natures"
              :map_options="true"
              :required="true"
              :default_value="row.nature ? row.nature : null"
              :auto_complete="false"
              :clearable="false"
              @update:modelValue="row.nature = $event"
              :rules="[() => validateNature(row) || '']"
            />
          </template>
          <template #chart_id="{ row }">
            <GenericSelectorComponent
              :manual_option="account_charts"
              :map_options="true"
              :required="true"
              :default_value="row.chart_id ? row.chart_id : null"
              auto_complete
              clearable
              @update:modelValue="selectAccount(row, $event)"
              :rules="[(val: string) => useRules().is_required(val, '')]"
            />
          </template>
          <template #third_party_id="{ row }">
            <GenericSelectorComponent
              :manual_option="accounting_closing_parameter_third_parties"
              :map_options="true"
              :required="true"
              :default_value="row.third_party_id ? row.third_party_id : null"
              :auto_complete="true"
              :clearable="true"
              @update:modelValue="row.third_party_id = $event"
              :rules="[(val: string) => useRules().is_required(val, '')]"
            />
          </template>
          <template #cost_center_id="{ row }">
            <GenericSelectorComponent
              :manual_option="accounting_closing_parameter_cost_centers"
              :map_options="true"
              :required="true"
              :default_value="row.cost_center_id ? row.cost_center_id : null"
              :auto_complete="true"
              :clearable="true"
              @update:modelValue="row.cost_center_id = $event"
              :disabled="!hasCostCenter(row.chart_id)"
              :rules="[(val: string) => useRules().is_required(val, '')]"
            />
          </template>
          <template #counterpart_nature="{ row }">
            <GenericSelectorComponent
              :manual_option="account_closing_natures"
              :map_options="true"
              :required="true"
              :default_value="
                row.counterpart_nature ? row.counterpart_nature : null
              "
              :auto_complete="false"
              :clearable="false"
              @update:modelValue="row.counterpart_nature = $event"
              :rules="[() => validateNature(row) || '']"
            />
          </template>
          <template #counterpart_chart_id="{ row }">
            <GenericSelectorComponent
              :manual_option="account_charts"
              :map_options="true"
              :required="true"
              :default_value="
                row.counterpart_chart_id ? row.counterpart_chart_id : null
              "
              auto_complete
              clearable
              @update:modelValue="selectCounterpartAccount(row, $event)"
              :rules="[(val: string) => useRules().is_required(val, '')]"
            />
          </template>
          <template #counterpart_third_party_id="{ row }">
            <GenericSelectorComponent
              :manual_option="accounting_closing_parameter_third_parties"
              :map_options="true"
              :required="true"
              :default_value="
                row.counterpart_third_party_id
                  ? row.counterpart_third_party_id
                  : null
              "
              :auto_complete="true"
              :clearable="true"
              @update:modelValue="row.counterpart_third_party_id = $event"
              :rules="[(val: string) => useRules().is_required(val, '')]"
            />
          </template>
          <template #counterpart_cost_center_id="{ row }">
            <GenericSelectorComponent
              :manual_option="accounting_closing_parameter_cost_centers"
              :map_options="true"
              :required="true"
              :default_value="
                row.counterpart_cost_center_id
                  ? row.counterpart_cost_center_id
                  : null
              "
              :disabled="!hasCostCenter(row.counterpart_chart_id)"
              :auto_complete="true"
              :clearable="true"
              @update:modelValue="row.counterpart_cost_center_id = $event"
              :rules="[(val: string) => useRules().is_required(val, '')]"
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
              :disabled="action === 'view'"
              @click="clearEvent(row)"
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
import TableList from '@/components/table-list/TableList.vue'
import useInformationForm from '@/components/Forms/Accounting/PeriodClosureParameter/InformationForm'

import { defaultIconsLucide } from '@/utils'
import { ActionType } from '@/interfaces/global'
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: ActionType
    id?: number
  }>(),
  {}
)

defineExpose({
  validateForm: () => informationForm.value?.validate(),
  getFormData: () => period_closure_parameter.value,
})

const {
  account_closing_natures,
  available_accounting_structures,
  account_charts,
  accounting_closing_parameter_third_parties,
  accounting_closing_parameter_cost_centers,
  period_closure_parameter,
  eventsTableProps,
  informationForm,
  customColumns,
  selectAccountStructure,
  selectAccount,
  selectCounterpartAccount,
  clearEvent,
  validateNature,
  hasCostCenter,
} = useInformationForm(props)
</script>

<style lang="scss" scoped>
:deep(.catalog-limit-table) {
  .q-field {
    padding-bottom: 0 !important;
  }
  .q-select .q-field__native {
    min-height: unset;
  }
}
</style>
