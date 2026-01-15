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
                {{ selectedAccountStructure?.id }}
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
                ['create', 'edit'].includes(props.action)
                  ? selectedAccountStructure?.id || null
                  : `${selectedAccountStructure?.code} - ${selectedAccountStructure?.name}`
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
                {{ selectedAccountStructure?.code }}
              </p>
            </template>
            <GenericInput
              v-else
              ref="codeRef"
              label="Código"
              placeholder="-"
              required
              :default_value="selectedAccountStructure?.code ?? ''"
              disabled
            />
          </div>
          <div class="col-12 col-md-4">
            <template v-if="props.action === 'view'">
              <p class="text-weight-bold mb-0 text-black-90">Finalidad</p>
              <p class="text-weight-medium no-margin">
                {{ selectedAccountStructure?.purpose }}
              </p>
            </template>
            <GenericInput
              v-else
              ref="purposeRef"
              label="Finalidad"
              placeholder="-"
              required
              :default_value="selectedAccountStructure?.purpose ?? ''"
              disabled
            />
          </div>
        </div>
      </section>
      <q-separator spaced />
      <section class="q-pt-lg parameter-table">
        <div class="row full-width justify-between">
          <p class="text-black-10 text-weight-bold text-subtitle1 q-mb-md">
            {{ dailyTableProps.title }}
          </p>
          <RadioYesNo
            v-model="hasDailyParams"
            is-switch
            :is-radio-button="false"
          />
        </div>
        <VCard
          v-show="hasDailyParams"
          class="q-px-lg q-pb-lg"
          style="margin-bottom: 0"
        >
          <template #content-card>
            <TableList
              :loading="dailyTableProps.loading"
              :columns="dailyTableProps.columns"
              :rows="dailyTableProps.rows"
              hide-bottom
              :custom-columns="customColumns"
            >
              <template v-if #event="{ row }">
                <GenericSelectorComponent
                  :manual_option="account_closing_events"
                  map_options
                  required
                  :default_value="row.event"
                  :rules="[(v: string) => useRules().is_required(v, ''), () => validateEvent(models.daily_parameters)]"
                  @update:model-value="row.event = $event"
                />
              </template>
              <template #nature="{ row }">
                <GenericSelectorComponent
                  :manual_option="account_closing_natures"
                  :map_options="true"
                  :required="true"
                  :default_value="row.nature"
                  :auto_complete="false"
                  :clearable="false"
                  @update:modelValue="row.nature = $event"
                  :rules="[
                    (v: string) => useRules().is_required(v, ''),
                  ]"
                />
              </template>
              <template #accounts_chart_id="{ row }">
                <GenericSelectorComponent
                  :manual_option="account_charts"
                  :map_options="true"
                  :required="true"
                  :default_value="row.accounts_chart_id"
                  auto_complete
                  clearable
                  @update:modelValue="row.accounts_chart_id = $event"
                  :rules="[(val: string) => useRules().is_required(val, '')]"
                />
              </template>
              <template #third_party_type="{ row }">
                <GenericSelectorComponent
                  :manual_option="closing_third_party_types"
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.third_party_type ? row.third_party_type : null
                  "
                  auto_complete
                  clearable
                  @update:modelValue="row.third_party_type = $event"
                  :rules="[(val: string) => useRules().is_required(val, '')]"
                />
              </template>
              <template #third_party_id="{ row }">
                <GenericSelectorComponent
                  :manual_option="
                    accounting_closing_parameter_third_parties_format
                  "
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.third_party_type === 'Tercero específico'
                      ? row.third_party_id
                      : null
                  "
                  :auto_complete="true"
                  :clearable="true"
                  @update:modelValue="row.third_party_id = $event"
                  :rules="[(val: string) => useRules().is_required(val, '')]"
                  :disabled="row.third_party_type !== 'Tercero específico'"
                />
              </template>
              <template #counterpart_accounts_chart_id="{ row }">
                <GenericSelectorComponent
                  :manual_option="account_charts"
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.counterpart_accounts_chart_id
                      ? row.counterpart_accounts_chart_id
                      : null
                  "
                  auto_complete
                  clearable
                  @update:modelValue="
                    row.counterpart_accounts_chart_id = $event
                  "
                  :rules="[(val: string) => useRules().is_required(val, '')]"
                />
              </template>
              <template #counterpart_third_party_type="{ row }">
                <GenericSelectorComponent
                  :manual_option="closing_third_party_types"
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.counterpart_third_party_type
                      ? row.counterpart_third_party_type
                      : null
                  "
                  auto_complete
                  clearable
                  @update:modelValue="row.counterpart_third_party_type = $event"
                  :rules="[(val: string) => useRules().is_required(val, '')]"
                />
              </template>
              <template #counterpart_third_party_id="{ row }">
                <GenericSelectorComponent
                  :manual_option="
                    accounting_closing_parameter_third_parties_format
                  "
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.counterpart_third_party_type === 'Tercero específico'
                      ? row.counterpart_third_party_id
                      : null
                  "
                  :auto_complete="true"
                  :clearable="true"
                  @update:modelValue="row.counterpart_third_party_id = $event"
                  :rules="[(val: string) => useRules().is_required(val, '')]"
                  :disabled="
                    row.counterpart_third_party_type !== 'Tercero específico'
                  "
                />
              </template>
              <template #sub_receipt_type_id="{ row }">
                <GenericSelectorComponent
                  :manual_option="sub_receipt_types"
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.sub_receipt_type_id ? row.sub_receipt_type_id : null
                  "
                  :auto_complete="true"
                  :clearable="true"
                  @update:modelValue="row.sub_receipt_type_id = $event"
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
          </template>
        </VCard>
        <q-separator v-show="!hasDailyParams" spaced />
      </section>
      <section class="q-pt-lg parameter-table">
        <div class="row full-width justify-between">
          <p class="text-black-10 text-weight-bold text-subtitle1 q-mb-md">
            {{ monthlyTableProps.title }}
          </p>
          <RadioYesNo
            v-model="hasMonthlyParams"
            is-switch
            :is-radio-button="false"
          />
        </div>
        <VCard
          v-if="hasMonthlyParams"
          class="q-px-lg q-pb-lg"
          style="margin-bottom: 0"
        >
          <template #content-card>
            <TableList
              :loading="monthlyTableProps.loading"
              :columns="monthlyTableProps.columns"
              :rows="monthlyTableProps.rows"
              hide-bottom
              :custom-columns="customColumns"
            >
              <template v-if #event="{ row }">
                <GenericSelectorComponent
                  :manual_option="account_closing_events"
                  map_options
                  required
                  :default_value="row.event"
                  :rules="[(v: string) => useRules().is_required(v, ''), () => validateEvent(models.monthly_parameters)]"
                  @update:model-value="row.event = $event"
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
                  :rules="[(v: string) => useRules().is_required(v, ''),]"
                />
              </template>
              <template #accounts_chart_id="{ row }">
                <GenericSelectorComponent
                  :manual_option="account_charts"
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.accounts_chart_id ? row.accounts_chart_id : null
                  "
                  auto_complete
                  clearable
                  @update:modelValue="row.accounts_chart_id = $event"
                  :rules="[(val: string) => useRules().is_required(val, '')]"
                />
              </template>
              <template #third_party_type="{ row }">
                <GenericSelectorComponent
                  :manual_option="closing_third_party_types"
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.third_party_type ? row.third_party_type : null
                  "
                  auto_complete
                  clearable
                  @update:modelValue="row.third_party_type = $event"
                  :rules="[(val: string) => useRules().is_required(val, '')]"
                />
              </template>
              <template #third_party_id="{ row }">
                <GenericSelectorComponent
                  :manual_option="accounting_closing_parameter_third_parties"
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.third_party_id ? row.third_party_id : null
                  "
                  :auto_complete="true"
                  :clearable="true"
                  @update:modelValue="row.third_party_id = $event"
                  :rules="[(val: string) => useRules().is_required(val, '')]"
                  :disabled="row.third_party_type !== 'Tercero específico'"
                />
              </template>
              <template #counterpart_accounts_chart_id="{ row }">
                <GenericSelectorComponent
                  :manual_option="account_charts"
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.counterpart_accounts_chart_id
                      ? row.counterpart_accounts_chart_id
                      : null
                  "
                  auto_complete
                  clearable
                  @update:modelValue="
                    row.counterpart_accounts_chart_id = $event
                  "
                  :rules="[(val: string) => useRules().is_required(val, '')]"
                />
              </template>
              <template #counterpart_third_party_type="{ row }">
                <GenericSelectorComponent
                  :manual_option="closing_third_party_types"
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.counterpart_third_party_type
                      ? row.counterpart_third_party_type
                      : null
                  "
                  auto_complete
                  clearable
                  @update:modelValue="row.counterpart_third_party_type = $event"
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
                  :disabled="
                    row.counterpart_third_party_type !== 'Tercero específico'
                  "
                />
              </template>
              <template #sub_receipt_type_id="{ row }">
                <GenericSelectorComponent
                  :manual_option="sub_receipt_types"
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.sub_receipt_type_id ? row.sub_receipt_type_id : null
                  "
                  :auto_complete="true"
                  :clearable="true"
                  @update:modelValue="row.sub_receipt_type_id = $event"
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
          </template>
        </VCard>
        <q-separator v-show="!hasMonthlyParams" spaced />
      </section>
      <section class="q-pt-lg parameter-table">
        <div class="row full-width justify-between">
          <p class="text-black-10 text-weight-bold text-subtitle1 q-mb-md">
            {{ yearlyTableProps.title }}
          </p>
          <RadioYesNo
            v-model="hasYearlyParams"
            is-switch
            :is-radio-button="false"
          />
        </div>
        <VCard
          v-if="hasYearlyParams"
          class="q-px-lg q-pb-lg"
          style="margin-bottom: 0"
        >
          <template #content-card>
            <TableList
              :loading="yearlyTableProps.loading"
              :columns="yearlyTableProps.columns"
              :rows="yearlyTableProps.rows"
              hide-bottom
              :custom-columns="customColumns"
            >
              <template v-if #event="{ row }">
                <GenericSelectorComponent
                  :manual_option="account_closing_events"
                  map_options
                  required
                  :default_value="row.event"
                  :rules="[(v: string) => useRules().is_required(v, ''), () => validateEvent(models.yearly_parameters)]"
                  @update:model-value="row.event = $event"
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
                  :rules="[(v: string) => useRules().is_required(v, ''),]"
                />
              </template>
              <template #accounts_chart_id="{ row }">
                <GenericSelectorComponent
                  :manual_option="account_charts"
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.accounts_chart_id ? row.accounts_chart_id : null
                  "
                  auto_complete
                  clearable
                  @update:modelValue="row.accounts_chart_id = $event"
                  :rules="[(val: string) => useRules().is_required(val, '')]"
                />
              </template>
              <template #third_party_type="{ row }">
                <GenericSelectorComponent
                  :manual_option="closing_third_party_types"
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.third_party_type ? row.third_party_type : null
                  "
                  auto_complete
                  clearable
                  @update:modelValue="row.third_party_type = $event"
                  :rules="[(val: string) => useRules().is_required(val, '')]"
                />
              </template>
              <template #third_party_id="{ row }">
                <GenericSelectorComponent
                  :manual_option="accounting_closing_parameter_third_parties"
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.third_party_id ? row.third_party_id : null
                  "
                  :auto_complete="true"
                  :clearable="true"
                  @update:modelValue="row.third_party_id = $event"
                  :rules="[(val: string) => useRules().is_required(val, '')]"
                  :disabled="row.third_party_type !== 'Tercero específico'"
                />
              </template>
              <template #counterpart_accounts_chart_id="{ row }">
                <GenericSelectorComponent
                  :manual_option="account_charts"
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.counterpart_accounts_chart_id
                      ? row.counterpart_accounts_chart_id
                      : null
                  "
                  auto_complete
                  clearable
                  @update:modelValue="
                    row.counterpart_accounts_chart_id = $event
                  "
                  :rules="[(val: string) => useRules().is_required(val, '')]"
                />
              </template>
              <template #counterpart_third_party_type="{ row }">
                <GenericSelectorComponent
                  :manual_option="closing_third_party_types"
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.counterpart_third_party_type
                      ? row.counterpart_third_party_type
                      : null
                  "
                  auto_complete
                  clearable
                  @update:modelValue="row.counterpart_third_party_type = $event"
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
                  :disabled="
                    row.counterpart_third_party_type !== 'Tercero específico'
                  "
                />
              </template>
              <template #sub_receipt_type_id="{ row }">
                <GenericSelectorComponent
                  :manual_option="sub_receipt_types"
                  :map_options="true"
                  :required="true"
                  :default_value="
                    row.sub_receipt_type_id ? row.sub_receipt_type_id : null
                  "
                  :auto_complete="true"
                  :clearable="true"
                  @update:modelValue="row.sub_receipt_type_id = $event"
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
          </template>
        </VCard>
      </section>
    </q-form>
  </div>
</template>
<script setup lang="ts">
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

import useInformationForm from '@/components/Forms/Accounting/PeriodClosureParameter/Information/v2/InformationForm'

import { ActionType } from '@/interfaces/global'
import { IAccountingClosingParamsResponse } from '@/interfaces/customs'

import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: ActionType
    id?: number
    data?: IAccountingClosingParamsResponse
  }>(),
  {}
)

defineExpose({
  validateForm: () => informationForm.value?.validate(),
  getFormData: () => models.value,
})

const {
  models,
  customColumns,
  account_charts,
  hasDailyParams,
  hasYearlyParams,
  dailyTableProps,
  informationForm,
  yearlyTableProps,
  hasMonthlyParams,
  monthlyTableProps,
  sub_receipt_types,
  defaultIconsLucide,
  account_closing_events,
  account_closing_natures,
  selectedAccountStructure,
  closing_third_party_types,
  available_accounting_structures,
  accounting_closing_parameter_third_parties,
  accounting_closing_parameter_third_parties_format,
  clearEvent,
  validateEvent,
  selectAccountStructure,
} = useInformationForm(props)
</script>

<style lang="scss" scoped>
:deep(.parameter-table) {
  .q-field {
    padding-bottom: 0 !important;
  }
  .q-select .q-field__native {
    min-height: unset;
  }
}
</style>
