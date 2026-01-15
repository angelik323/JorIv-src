<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Relación de apropiaciones presupuestales futuras
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
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
                formatCurrencyString(props.basic_data?.additional_value) ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Monto con cobertura presupuestal"
            :default_value="''"
            :required="false"
            :rules="[]"
            disabled
            placeholder=""
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">
              Monto con cobertura presupuestal
            </p>
            <p class="text-weight-medium no-margin">
              {{
                formatCurrencyString(props.basic_data?.additional_value) ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Monto con cobertura futura"
            :default_value="''"
            :required="false"
            :rules="[]"
            disabled
            placeholder=""
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Monto con cobertura futura</p>
            <p class="text-weight-medium no-margin">
              {{
                formatCurrencyString(props.basic_data?.additional_value) ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Monto pendiente de asignación presupuestal"
            :default_value="''"
            :required="false"
            :rules="[]"
            disabled
            placeholder=""
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">
              Monto pendiente de asignación presupuestal
            </p>
            <p class="text-weight-medium no-margin">
              {{
                formatCurrencyString(props.basic_data?.additional_value) ??
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
          'select',
          'validity',
          'resource_id',
          'area_id',
          'budget_item_id',
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

        <template #select="{ row }">
          <div class="px-1 flex justify-center">
            <q-radio
              dense
              size="sm"
              v-model="models.selectedRow"
              :val="row"
              color="orange"
              :disable="
                !row.validity ||
                !row.resource_id ||
                !row.area_id ||
                !row.budget_item_id
              "
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

        <template #resource_id="{ row }">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="budget_resources_types"
            :map_options="false"
            :required="true"
            :default_value="row.resource_id"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="row.resource_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-medium no-margin">
              {{ row?.resource_id ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <template #area_id="{ row }">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="areas_resposabilities_codes"
            :map_options="false"
            :required="true"
            :default_value="row.area_id"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="row.area_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-medium no-margin">
              {{ row?.area_id ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <template #budget_item_id="{ row }">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="budget_item_codes"
            :map_options="false"
            :required="true"
            :default_value="row.budget_item_id"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="row.budget_item_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-medium no-margin">
              {{ row?.budget_item_id ?? 'No registrado' }}
            </p>
          </div>
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
            @click="openDeleteModal(row.id)"
          />
        </template>
      </TableList>
    </section>

    <q-separator class="q-my-lg" />

    <section class="q-mt-lg" v-if="models.selectedRow">
      <TableList
        :loading="tablePropsProgramLinks.loading"
        :columns="tablePropsProgramLinks.columns"
        :rows="tablePropsProgramLinks.rows"
        :custom-columns="['select', 'value_assigned']"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
      >
        <template #select="{ row }">
          <q-checkbox
            color="orange"
            :model-value="
              displayedMilestones.some((e) => e.temporal_id === row.temporal_id)
            "
            @update:model-value="
              (val) => toggleMilestoneForSelectedRow(row, val)
            "
            :disable="['view'].includes(action)"
          />
        </template>

        <template #value_assigned="{ row }">
          <GenericInput
            :required="true"
            :default_value="row.value_assigned"
            :rules="[
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().max_integer_decimal(val, 12, 2),
            ]"
            @update:modelValue="row.value_assigned = $event"
            :disabled="
              displayedMilestones.some(
                (e) => e.temporal_id === row.temporal_id
              ) || ['view'].includes(action)
            "
          />
        </template>
        <template #custom-header>
          <div>
            <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
              {{ tablePropsProgramLinks.title }}
            </p>
          </div>
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
</template>

<script setup lang="ts">
import {
  IBasicDataFormAdditions,
  ISchedulePaymentsFormAdditions,
  IValidityFormAdditions,
} from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { ActionType } from '@/interfaces/global'

import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import { useRules } from '@/composables'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

import useValidityForm from '@/components/Forms/DerivativeContracting/RegisterAdditions/Validity/Validity'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IValidityFormAdditions | null
    basic_data: IBasicDataFormAdditions | null
    payments: ISchedulePaymentsFormAdditions | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IValidityFormAdditions | null): void
}>()

const {
  formElementRef,
  defaultIconsLucide,
  tableProps,
  tablePropsProgramLinks,
  deleteModalRef,
  models,

  budget_item_codes,
  areas_resposabilities_codes,
  budget_resources_types,
  contractData,
  displayedMilestones,
  toggleMilestoneForSelectedRow,
  formatCurrencyString,
  confirmDeleteAction,
  addNewRow,
  openDeleteModal,
} = useValidityForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
