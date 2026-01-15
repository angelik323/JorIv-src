<template>
  <q-form ref="formElementRef">
    <section class="q-pa-lg">
      <div class="q-mb-lg">
        <p class="text-weight-bold text-h6 q-mb-none">
          Asignación presupuestal
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
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
              {{ contractData?.contract_value ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="q-my-lg" />

    <section class="q-mt-md">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :custom-columns="[
          'select',
          'validity',
          'type_document_budget_id',
          'document_number_id',
          'actions',
        ]"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
      >
        <template #custom-header-action>
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

        <template #select="{ row }">
          <div class="px-1 flex justify-center">
            <q-radio
              dense
              size="sm"
              v-model="models.selected"
              :val="row"
              color="orange"
              :disable="!row.document_number_id || !row.validity"
            />
          </div>
        </template>

        <template #validity="{ row }">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="row.validity"
            :rules="[
              (v) => useRules().is_required(v),
              (v) => useRules().max_length(v, 4),
              (v) => useRules().min_value(v, 1950),
              (v) => useRules().max_value(v, 2999),
            ]"
            @update:modelValue="(val) => (row.validity = val)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-medium no-margin">
              {{ row?.validity ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <template #type_document_budget_id="{ row }">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="budget_document_types"
            :map_options="false"
            :required="true"
            :default_value="row.type_document_budget_id"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="row.type_document_budget_id = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-medium no-margin">
              {{ row?.type_document_budget_id ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <template #document_number_id="{ row }">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="
              operation_logs_authorized_filtered(row.type_document_budget_id)
            "
            :map_options="false"
            :required="true"
            :default_value="row.document_number_id"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="row.document_number_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-medium no-margin">
              {{ row?.document_number_id ?? 'No registrado' }}
            </p>
          </div>
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
            @click="openDeleteModal(row.id)"
          />
        </template>

        <template #custom-bottom-row>
          <q-tr v-for="(rows, idx) in bottomRows" :key="idx">
            <q-td v-for="(col, index) in tableProps.columns" :key="col.name">
              <template v-if="index === (tableProps.columns?.length ?? 1) - 3">
                <div class="row justify-end items-center">
                  <p
                    class="text-black-10 text-weight-bold q-mb-none"
                    :style="{ color: '#762344' }"
                  >
                    {{ rows.label }}
                  </p>
                </div>
              </template>

              <template
                v-else-if="index === (tableProps.columns?.length ?? 1) - 2"
              >
                <div class="row justify-start items-center">
                  {{ formatCurrencyString(rows.value) }}
                </div>
              </template>
            </q-td>
          </q-tr>
        </template>
      </TableList>
    </section>

    <q-separator class="q-my-lg" />

    <section class="q-mt-lg">
      <TableList
        :loading="tablePropsAvailableBudget.loading"
        :columns="tablePropsAvailableBudget.columns"
        :rows="tablePropsAvailableBudget.rows ?? []"
        :custom-columns="['actions']"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
      >
        <template #custom-header>
          <div>
            <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
              {{ tablePropsAvailableBudget.title }}
            </p>
          </div>
        </template>
        <template #actions="{ row }">
          <Button
            :left-icon="
              ['create', 'edit'].includes(action)
                ? defaultIconsLucide.plusCircle
                : defaultIconsLucide.eye
            "
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="['create', 'edit'].includes(action) ? 'Asociar' : 'Ver'"
            @click="openModalLinkRegister(row)"
          />
        </template>
      </TableList>
    </section>
  </q-form>

  <AlertModalComponent
    ref="deleteModalRef"
    styleModal="min-width: 480px"
    title="¿Desea eliminar la disponibilidad?"
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

  <AlertModalComponent
    ref="linkRegisterModalRef"
    styleModal="min-width: 1000px"
    :title-header="`${
      ['create', 'edit'].includes(action) ? 'Asociar' : 'Ver'
    } hitos al registro presupuestal`"
    :show-img-default="false"
    @confirm="saveMilestoneBudget"
    :text-btn-confirm="
      ['create', 'edit'].includes(action) ? 'Asociar' : 'Finalizar'
    "
    margin-top-body="mt-1"
  >
    <template #default-body>
      <section class="q-px-lg">
        <TableList
          :loading="tablePropsRegisterModal.loading"
          :columns="tablePropsRegisterModal.columns"
          :rows="tablePropsRegisterModal.rows"
          :hide-pagination="true"
          :rows-per-page-options="[0]"
        >
          <template #custom-header>
            <div>
              <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
                {{ tablePropsRegisterModal.title }}
              </p>
            </div>
          </template>
        </TableList>

        <q-separator class="q-my-lg" />

        <TableList
          :loading="tablePropsLinkModal.loading"
          :columns="tablePropsLinkModal.columns"
          :rows="tablePropsLinkModal.rows"
          :custom-columns="['select', 'value_assigned']"
          :hide-pagination="true"
          :rows-per-page-options="[0]"
        >
          <template #custom-header>
            <div>
              <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
                {{ tablePropsLinkModal.title }}
              </p>
            </div>
          </template>

          <template #select="{ row }">
            <q-checkbox
              v-model="row.select"
              @update:model-value="(val) => (row.select = val)"
              color="orange"
              :disable="['view'].includes(action)"
            />
          </template>

          <template #value_assigned="{ row }">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              required
              :default_value="row.value_assigned"
              type="number"
              :rules="[
                (v) => useRules().is_required(v),
                (val: string) => useRules().max_integer_decimal(val, 12, 2),
              ]"
              @update:modelValue="(val) => (row.value_assigned = val)"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-medium no-margin">
                {{ row?.value_assigned ?? 'No registrado' }}
              </p>
            </div>
          </template>
        </TableList>
      </section>
    </template>
  </AlertModalComponent>
</template>

<script setup lang="ts">
import {
  IBasicDataFormAdditions,
  IBudgetFormAdditions,
  ISchedulePaymentsFormAdditions,
} from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { ActionType } from '@/interfaces/global'

import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import { useRules } from '@/composables'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

import useBudgetForm from '@/components/Forms/DerivativeContracting/RegisterAdditions/Budget/Budget'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IBudgetFormAdditions | null
    basic_data: IBasicDataFormAdditions | null
    payments: ISchedulePaymentsFormAdditions | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IBudgetFormAdditions | null): void
}>()

const {
  formElementRef,
  defaultIconsLucide,
  tableProps,
  tablePropsAvailableBudget,
  deleteModalRef,
  bottomRows,
  linkRegisterModalRef,
  tablePropsRegisterModal,
  tablePropsLinkModal,
  budget_document_types,
  operation_logs_authorized_filtered,
  contractData,
  models,
  formatCurrencyString,
  confirmDeleteAction,
  addNewRow,
  openDeleteModal,
  openModalLinkRegister,
  saveMilestoneBudget,
} = useBudgetForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
