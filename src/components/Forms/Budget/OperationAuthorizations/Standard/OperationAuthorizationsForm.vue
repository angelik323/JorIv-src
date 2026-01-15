<template>
  <q-form
    ref="formRef"
    greedy
    class="q-px-lg catalog-limit-table hide-arrows-number-input"
  >
    <TableList
      title="Listado de registro de operaciones"
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :pages="action === 'edit' ? tableProps.pages : undefined"
      :hide-bottom="action !== 'edit'"
      :custom-columns="customColumns"
    >
      <template v-if="action === 'edit'" #custom-header-action>
        <Button
          :outline="false"
          label="Agregar"
          size="md"
          color="orange"
          colorIcon="white"
          :left-icon="defaultIconsLucide.plusCircleOutline"
          @click="addRow()"
        />
      </template>

      <template #validity="{ row }">
        <GenericInputComponent
          required
          type="number"
          :disabled="action === 'view'"
          :default_value="row.validity"
          @update:modelValue="row.validity = $event"
          placeholder="AAAA"
          hide_bottom_space
          :rules="[(val) => is_required(val, 'La vigencia es requerida')]"
        />
      </template>

      <template #month="{ row }">
        <GenericInputComponent
          required
          type="number"
          :disabled="action === 'view'"
          :default_value="row.month"
          @update:modelValue="row.month = $event"
          placeholder="MM"
          hide_bottom_space
          :rules="[
            (v) => is_required(v),
            (v) => only_number_greater_than_zero(v),
            (v) => max_value(v, 12),
          ]"
        />
      </template>

      <template #day="{ row }">
        <GenericInputComponent
          required
          type="number"
          :disabled="action === 'view'"
          :default_value="row.day"
          @update:modelValue="
            row.day =
              $event < 10 && String($event).length === 1 ? '0' + $event : $event
          "
          placeholder="DD"
          hide_bottom_space
          :rules="[
            (v) => validateDay(v, row),
            (v) => is_required(v),
            (v) => only_number_greater_than_zero(v),
          ]"
        />
      </template>

      <template #area="{ row }">
        <GenericSelectorComponent
          required
          auto_complete
          clearable
          map_options
          :disabled="action === 'view'"
          :manual_option="areas_resposabilities_codes"
          :placeholder="'Seleccione área'"
          :rules="[(val) => is_required(val, 'El área es requerida')]"
          :default_value="row.area_id"
          @update:modelValue="row.area_id = $event"
        />
      </template>

      <template #movement_code="{ row }">
        <GenericSelectorComponent
          required
          auto_complete
          clearable
          map_options
          :disabled="action === 'view'"
          :manual_option="movement_codes_source_destination"
          :placeholder="'Seleccione código'"
          :rules="[
            (val) => is_required(val, 'El código de movimiento es requerido'),
          ]"
          :default_value="row.movement_code_id"
          @update:modelValue="row.movement_code_id = $event"
        />
      </template>

      <template #budget_item="{ row }">
        <GenericSelectorComponent
          required
          auto_complete
          clearable
          map_options
          :disabled="action === 'view'"
          :manual_option="budget_item_codes_source_destination"
          :placeholder="'Seleccione rubro'"
          :rules="[
            (val) => is_required(val, 'El rubro presupuestal es requerido'),
          ]"
          :default_value="row.budget_item_id"
          @update:modelValue="row.budget_item_id = $event"
        />
      </template>

      <template #resource="{ row }">
        <GenericSelectorComponent
          required
          auto_complete
          clearable
          map_options
          :disabled="action === 'view'"
          :manual_option="budget_resource_codes"
          :placeholder="'Seleccione recurso'"
          :rules="[(val) => is_required(val, 'El recurso es requerido')]"
          :default_value="row.resource_id"
          @update:modelValue="row.resource_id = $event"
        />
      </template>

      <template #value="{ row }">
        <InputMoneyComponent
          :model-value="row.value"
          :disabled="action === 'view'"
          required
          :placeholder="'0'"
          :rules="[
            (v) => is_required(v),
            (v) => only_number_greater_than_zero_with_decimal(v),
          ]"
          @update:model-value="row.value = $event.rawValue"
          hide_bottom_space
        />
      </template>

      <template v-if="action === 'edit'" #actions="{ index }">
        <Button
          :left-icon="defaultIconsLucide.trash"
          color="orange"
          class-custom="custom"
          :outline="false"
          flat
          colorIcon="#f45100"
          tooltip="Eliminar"
          @click="deleteRow(index)"
        />
      </template>
    </TableList>
  </q-form>
</template>

<script setup lang="ts">
// Components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// Logic
import { useOperationAuthorizationForm } from '@/components/Forms/Budget/OperationAuthorizations/Standard/OperationAuthorizationsForm'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IOperationAuthorizationFormEdit } from '@/interfaces/customs/budget/OperationAuthorizations'

const props = defineProps<{
  action: ActionType
  data: IOperationAuthorizationFormEdit[]
}>()

const {
  defaultIconsLucide,
  formRef,
  budget_item_codes_source_destination,
  areas_resposabilities_codes,
  movement_codes_source_destination,
  budget_resource_codes,
  tableProps,
  customColumns,
  addRow,
  deleteRow,
  max_value,
  getFormData,
  validateDay,
  is_required,
  only_number_greater_than_zero,
  only_number_greater_than_zero_with_decimal,
} = useOperationAuthorizationForm(props)

// Exponer datos para validación y envío
defineExpose({
  getFormData,
  validateForm: () => formRef.value?.validate(),
})
</script>
