<template>
  <q-form
    ref="formRef"
    aria-label="Formulario de datos básicos para englobe de títulos"
  >
    <section class="catalog-limit-table">
      <TableList
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="[
          'budget_accounting_mapping_parameter_id',
          'budget_item_structure',
          'resource_structure',
          'area_structure',
          'code_movement_id',
          'movement_code_description',
          'balance_validation_level_id',
          'balance_validation_level_description',
          'validates_document_type',
          'validated_document_type_id',
          'validation_documento_type_description',
          'actions',
        ]"
        @update-page="updatePage"
        @update-rows-per-page="updatePerPage"
      >
        <template #custom-header>
          <div class="row justify-between full-width">
            <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
              {{ tableProps.title }}
            </p>
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
              @click="addBalanceRow"
            />
          </div>
        </template>
        <template #budget_accounting_mapping_parameter_id="{ row }">
          <GenericSelectorComponent
            :manual_option="accounting_budget_mapping_parameters"
            map_options
            auto_complete
            required
            :rules="[(val: string) => useRules().is_required(val, '')]"
            :default_value="row.accounting_budget_mapping_parameter_id"
            @update:model-value="selectBudgetStructure(row, $event)"
          />
        </template>
        <template #budget_item_structure="{ row }">
          <GenericInputComponent
            disabled
            :default_value="row.budget_item_structure"
          />
        </template>
        <template #resource_structure="{ row }">
          <GenericInputComponent
            disabled
            :default_value="row.resource_structure"
          />
        </template>
        <template #area_structure="{ row }">
          <GenericInputComponent disabled :default_value="row.area_structure" />
        </template>
        <template #code_movement_id="{ row }">
          <GenericSelectorComponent
            :manual_option="code_movements"
            map_options
            auto_complete
            required
            :rules="[(val: string) => useRules().is_required(val, '')]"
            :default_value="row.code_movement_id"
            @update:model-value="row.code_movement_id = $event"
          />
        </template>
        <template #movement_code_description="{ row }">
          <GenericInputComponent
            :default_value="
              code_movements.find((item) => item.value === row.code_movement_id)
                ?.movement_description
            "
            disabled
          />
        </template>
        <template #balance_validation_level_id="{ row }">
          <GenericSelectorComponent
            :manual_option="budget_levels"
            map_options
            auto_complete
            required
            :rules="[(val: string) => useRules().is_required(val, '')]"
            :default_value="row.balance_validation_level_id"
            @update:model-value="row.balance_validation_level_id = $event"
          />
        </template>
        <template #balance_validation_level_description="{ row }">
          <GenericInputComponent
            :default_value="
              budget_levels.find(
                (item) => item.value === row.balance_validation_level_id
              )?.description
            "
            disabled
          />
        </template>
        <template #validates_document_type="{ row }">
          <RadioYesNo
            v-model="row.validates_document_type"
            :is-radio-button="false"
            :is-switch="false"
          />
        </template>
        <template #validated_document_type_id="{ row }">
          <GenericSelectorComponent
            :manual_option="budget_document_types_selector"
            map_options
            auto_complete
            required
            :disabled="!row.validates_document_type"
            :rules="[(val: string) => useRules().is_required(val, '')]"
            :default_value="row.validated_document_type_id"
            @update:model-value="row.validated_document_type_id = $event"
          />
        </template>
        <template #validation_documento_type_description="{ row }">
          <GenericInputComponent
            :default_value="
              budget_document_types_selector.find(
                (item) => item.value === row.validated_document_type_id
              )?.description
            "
            disabled
          />
        </template>
        <template #actions="{ row }">
          <Button
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            class-custom="custom"
            :outline="false"
            flat
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="deleteBalanceValidation(row)"
          />
        </template>
      </TableList>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import { IBalanceValidationItemModel } from '@/interfaces/customs/budget/BudgetDocumentTypes'

// Composables
import { useRules } from '@/composables'

// Logic
import useBalanceValidationForm from '@/components/Forms/Budget/DocumentTypes/BalanceValidation/BalanceValidationForm'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data?: IBalanceValidationItemModel[]
  }>(),
  {}
)

const {
  models,
  formRef,
  tableProps,
  budget_levels,
  code_movements,
  defaultIconsLucide,
  budget_document_types_selector,
  accounting_budget_mapping_parameters,
  updatePage,
  updatePerPage,
  addBalanceRow,
  selectBudgetStructure,
  deleteBalanceValidation,
} = useBalanceValidationForm(props)

defineExpose({
  validateForm: () => formRef.value?.validate(),
  getFormData: () => models.value,
})
</script>
