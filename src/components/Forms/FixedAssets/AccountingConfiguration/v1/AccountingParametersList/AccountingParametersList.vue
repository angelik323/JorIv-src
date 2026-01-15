<template>
  <q-form ref="accountingParametersListFormRef">
    <section>
      <div class="flex items-center justify-between q-mb-none q-mb-none">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Listado tipo de Parámetros contables
        </p>
        <Button
          v-if="action !== 'view'"
          class="text-capitalize btn-filter custom q-mb-none"
          label="Agregar"
          size="md"
          unelevated
          color="orange"
          :outline="false"
          @click="validateAndAddRow"
        />
      </div>
      <span class="text-red text-caption" v-show="show_errors">
        Debes agregar al menos un parámetro contable
      </span>

      <TableList
        hide-pagination
        dense
        class="editable-table"
        :columns="tableProps.columns"
        :loading="tableProps.loading"
        :rows="tableProps.rows"
        :custom-columns="[
          'novelty_code',
          'debit_nature',
          'debit_account',
          'credit_nature',
          'credit_account',
          'detail_transaction',
          'actions',
        ]"
      >
        <template #novelty_code="{ row, index }">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            class_name="q-py-lg q-ml-sm"
            display_value="code"
            map_options
            auto_complete
            first_filter_option="label"
            :disabled="disableAllForm"
            :rules="[(val: string) => is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="row.novelty_code"
            :manual_option="configuration_novelty_types"
            @update:modelValue="handleNoveltyChange(index, $event)"
          />
          <div v-else class="cell-view">
            <p v-if="row.configuration_novelty_type" class="generic-selector">
              {{
                `${row.configuration_novelty_type.code} - ${row.configuration_novelty_type.description}`
              }}
            </p>
          </div>
        </template>

        <template #debit_nature="{ row, index }">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            class_name="q-py-lg"
            map_options
            auto_complete
            first_filter_option="label"
            :disabled="disableAllForm"
            :rules="[(val: string) => is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="row.debit_nature"
            :manual_option="debit_nature"
            @update:modelValue="updateRow(index, 'debit_nature', $event)"
          />
          <div v-else class="cell-view">
            <p class="generic-selector">
              {{ row.debit_nature }}
            </p>
          </div>
        </template>

        <template #debit_account="{ row, index }">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            class_name="q-py-lg"
            :disabled="disableAllForm"
            :rules="[(val: string) => is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="row.debit_accounts_chart_id"
            :manual_option="filteredDebitAccountsByRow[index]"
            @update:modelValue="
              updateRow(index, 'debit_accounts_chart_id', $event)
            "
          />
          <div v-else class="cell-view">
            <p class="generic-selector">
              {{ row.debit_accounts_chart_id }}
            </p>
          </div>
        </template>

        <template #credit_nature="{ row }">
          <GenericInputComponent
            v-if="action !== 'view'"
            required
            disabled
            class_name="q-py-lg q-py-sm"
            placeholder="Contrapartida"
            :rules="[]"
            :default_value="row.credit_nature"
          />
          <div v-else class="cell-view">
            <p>
              {{ row.credit_nature }}
            </p>
          </div>
        </template>

        <template #credit_account="{ row, index }">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            class_name="q-py-lg"
            :disabled="disableAllForm"
            :rules="[(val: string) => is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="row.credit_accounts_chart_id"
            :manual_option="filteredCreditAccountsByRow[index]"
            @update:modelValue="
              updateRow(index, 'credit_accounts_chart_id', $event)
            "
          />
          <div v-else class="cell-view">
            <p class="generic-selector">
              {{ row.credit_accounts_chart_id }}
            </p>
          </div>
        </template>

        <template #detail_transaction="{ row, index }">
          <GenericInputComponent
            v-if="action !== 'view'"
            required
            class_name="q-py-lg q-py-sm"
            :disabled="disableAllForm"
            :rules="[
              (val: string) => is_required(val, 'Diligencie campo obligatorio'),
              (val: string) => min_length(val, 10,),
              (val: string) => max_length(val, 20,)
            ]"
            :default_value="row.detail_transaction"
            @update:modelValue="updateRow(index, 'detail_transaction', $event)"
          />
          <div v-else class="cell-view">
            <p class="q-ma-none">
              {{ row.detail_transaction }}
            </p>
          </div>
        </template>

        <template #actions="{ index }">
          <Button
            v-show="tableProps.rows.length > 1"
            color="orange"
            class-custom="custom"
            flat
            colorIcon="#f45100"
            tooltip="Eliminar"
            :disabled="disableAllForm"
            :outline="false"
            :left-icon="defaultIconsLucide.trash"
            @click="removeRow(index)"
          />
        </template>
      </TableList>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// components
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// interfaces
import { ISelectorResources } from '@/interfaces/customs'
import { IAccountingParameters } from '@/interfaces/customs/fixed-assets/v1/AcountingConfiguration'
import { ActionType } from '@/interfaces/global/Action'

// logic
import useAccountingParametersList from '@/components/Forms/FixedAssets/AccountingConfiguration/v1/AccountingParametersList/AccountingParametersList'

const props = defineProps<{
  modelValue: IAccountingParameters[]
  disableAllForm: boolean
  configuration_novelty_types: ISelectorResources[]
  debit_nature: ISelectorResources[]
  show_errors?: boolean
  action: ActionType
}>()

const emit = defineEmits<{
  'update:modelValue': [value: IAccountingParameters[]]
}>()

const {
  accountingParametersListFormRef,

  tableProps,
  filteredCreditAccountsByRow,
  filteredDebitAccountsByRow,
  defaultIconsLucide,

  updateRow,
  removeRow,
  validateAndAddRow,
  handleNoveltyChange,

  is_required,
  min_length,
  max_length,
} = useAccountingParametersList(props, emit)
</script>
<style lang="scss" src="./AccountingParametersList.scss" />
