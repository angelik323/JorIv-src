<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Hitos de pagos
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Monto moneda extranjera"
            :default_value="props.basic_data?.additional_amount"
            :required="false"
            :rules="[]"
            disabled
            placeholder=""
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Monto moneda extranjera</p>
            <p class="text-weight-medium no-margin">
              {{
                formatCurrencyString(props.basic_data?.additional_amount) ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Valor del contrato"
            :default_value="formatCurrencyString(contractData?.contract_value)"
            :required="false"
            :rules="[]"
            disabled
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Valor del contrato</p>
            <p class="text-weight-medium no-margin">
              {{
                formatCurrencyString(contractData?.contract_value) ??
                'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="q-my-lg" />

    <section class="q-mt-md">
      <TableList
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :custom-columns="[
          'payment_type_id',
          'date_milestone',
          'foreign_amount',
          'value_milestone',
          'budget_apply',
          'actions',
        ]"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
      >
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
            @click="addNewRow"
          />
        </template>

        <template #payment_type_id="{ row }">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="payment_type"
            :map_options="false"
            :required="true"
            :default_value="row.payment_type_id"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="row.payment_type_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-medium no-margin">
              {{ row.payment_type_id ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <template #date_milestone="{ row }">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="row.date_milestone"
            :option_calendar="
              useCalendarRules().only_until(moment().format('YYYY-MM-DD'))
            "
            :rules="[
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().date_after_or_equal_to_specific_date(val, props.basic_data?.subscription_date ?? ''),
            ]"
            @update:modelValue="(val) => (row.date_milestone = val)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-medium no-margin">
              {{ row.date_milestone ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <template #foreign_amount="{ row }">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            type="number"
            :required="false"
            :default_value="row.foreign_amount"
            :rules="[
              (val: string) => useRules().only_number_greater_than_zero(val)
            ]"
            @update:modelValue="row.foreign_amount = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(row.foreign_amount) ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <template #value_milestone="{ row }">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            type="number"
            :required="false"
            :default_value="row.value_milestone"
            :rules="[
              (val: string) => useRules().only_number_greater_than_zero(val)
            ]"
            @update:modelValue="row.value_milestone = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(row.value_milestone) ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <template #budget_apply="{ row }">
          <q-checkbox
            v-model="row.budget_apply"
            @update:model-value="(val) => (row.budget_apply = val)"
            color="orange"
            :disable="['view'].includes(action)"
          />
        </template>

        <template
          #actions="{ row, index }"
          v-if="['create', 'edit'].includes(action)"
        >
          <Button
            v-if="index !== 0"
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="openDeleteModal(row.temporal_id)"
          />
        </template>

        <template #custom-bottom-row>
          <q-tr v-for="(row, idx) in bottomRows" :key="idx">
            <q-td v-for="(col, index) in tableProps.columns" :key="col.name">
              <template v-if="index === (tableProps.columns?.length ?? 1) - 5">
                <div class="row justify-end items-center">
                  <p
                    class="text-black-10 text-weight-bold q-mb-none"
                    :style="{ color: '#762344' }"
                  >
                    {{ row.label }}
                  </p>
                </div>
              </template>

              <template
                v-else-if="index === (tableProps.columns?.length ?? 1) - 4"
              >
                <div class="row justify-start items-center">
                  {{ formatCurrencyString(row.amount) }}
                </div>
              </template>

              <template
                v-else-if="index === (tableProps.columns?.length ?? 1) - 3"
              >
                <div class="row justify-start items-center">
                  {{ formatCurrencyString(row.value) }}
                </div>
              </template>
            </q-td>
          </q-tr>
        </template>
      </TableList>
    </section>
  </q-form>

  <AlertModalComponent
    ref="deleteModalRef"
    styleModal="min-width: 480px"
    title="¿Desea eliminar el hito programado?"
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
</template>

<script setup lang="ts">
import {
  IBasicDataFormAdditions,
  ISchedulePaymentsFormAdditions,
} from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { ActionType } from '@/interfaces/global'

import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import usePaymentForm from '@/components/Forms/DerivativeContracting/RegisterAdditions/Payments/Payments'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import { useCalendarRules, useRules } from '@/composables'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import moment from 'moment'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: ISchedulePaymentsFormAdditions | null
    basic_data: IBasicDataFormAdditions | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: ISchedulePaymentsFormAdditions | null): void
}>()

const {
  formElementRef,
  defaultIconsLucide,
  tableProps,
  deleteModalRef,
  bottomRows,
  payment_type,
  contractData,
  formatCurrencyString,
  confirmDeleteAction,
  addNewRow,
  openDeleteModal,
} = usePaymentForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
