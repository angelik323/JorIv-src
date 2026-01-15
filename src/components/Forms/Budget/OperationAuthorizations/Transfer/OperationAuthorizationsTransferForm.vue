<template>
  <q-form ref="formRef" greedy class="editable-table">
    <!-- Sección ORIGEN -->
    <section class="q-mt-lg">
      <TableList
        :title="tablePropsOrigin.title"
        :loading="false"
        :columns="tablePropsOrigin.columns"
        :rows="tablePropsOrigin.rows"
        :pages="undefined"
        :hide-bottom="true"
        :custom-columns="customColumns"
      >
        <template
          v-if="!is1to1Transfer && action === 'edit'"
          #custom-header-action
        >
          <Button
            label="Agregar fila"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            size="sm"
            :outline="false"
            color="primary_fiduciaria"
            class="text-capitalize custom"
            colorIcon="#ffffff"
            @click="addOriginRow"
          />
        </template>

        <template #business="{ row }">
          <GenericSelectorComponent
            return_object
            required
            auto_complete
            clearable
            map_options
            class_name="col-3"
            :disabled="action !== 'edit'"
            :manual_option="business_trusts"
            :placeholder="'Seleccione negocio'"
            :rules="[(val) => is_required(val, 'El negocio es requerido')]"
            :default_value="row.business_trust_id"
            @update:modelValue="
              ;(row.business_trust_id = $event.value),
                (row.business_trust_id_description = $event.description)
            "
          />
        </template>

        <template #business_description="{ row }">
          <GenericInputComponent
            placeholder="-"
            :default_value="row.business_trust_id_description"
            disabled
            hide_bottom_space
          />
        </template>

        <template #budget_item="{ row }">
          <GenericSelectorComponent
            return_object
            required
            auto_complete
            clearable
            map_options
            class_name="col-3"
            :disabled="action !== 'edit'"
            :manual_option="budget_item_codes_source_destination"
            :placeholder="'Seleccione rubro'"
            :rules="[
              (val) => is_required(val, 'El rubro presupuestal es requerido'),
            ]"
            :default_value="row.budget_item_id"
            @update:modelValue="
              ;(row.budget_item_id = $event.value),
                (row.budget_item_description = $event.description)
            "
          />
        </template>

        <template #budget_item_description="{ row }">
          <GenericInputComponent
            placeholder="-"
            :default_value="row.budget_item_description"
            disabled
            hide_bottom_space
          />
        </template>

        <template #resource="{ row }">
          <GenericSelectorComponent
            return_object
            required
            auto_complete
            clearable
            map_options
            class_name="col-3"
            :disabled="action !== 'edit'"
            :manual_option="budget_resource_codes"
            :placeholder="'Seleccione recurso'"
            :rules="[(val) => is_required(val, 'El recurso es requerido')]"
            :default_value="row.resource_id"
            @update:modelValue="
              ;(row.resource_id = $event.value),
                (row.resource_description = $event.description)
            "
          />
        </template>

        <template #resource_description="{ row }">
          <GenericInputComponent
            placeholder="-"
            :default_value="row.resource_description"
            disabled
            hide_bottom_space
          />
        </template>

        <template #area="{ row }">
          <GenericSelectorComponent
            return_object
            required
            auto_complete
            clearable
            map_options
            class_name="col-3"
            :disabled="action !== 'edit'"
            :manual_option="areas_resposabilities_codes"
            :placeholder="'Seleccione área'"
            :rules="[(val) => is_required(val, 'El área es requerida')]"
            :default_value="row.area_id"
            @update:modelValue="
              ;(row.area_id = $event.value),
                (row.area_description = $event.description)
            "
          />
        </template>

        <template #area_description="{ row }">
          <GenericInputComponent
            placeholder="-"
            :default_value="row.area_description"
            disabled
            hide_bottom_space
          />
        </template>

        <template #third_party="{ row }">
          <GenericSelectorComponent
            return_object
            required
            auto_complete
            clearable
            map_options
            class_name="col-3"
            :disabled="action !== 'edit'"
            :manual_option="third_parties"
            :placeholder="'Seleccione tercero'"
            :rules="[(val) => is_required(val, 'El tercero es requerido')]"
            :default_value="row.third_party_id"
            @update:modelValue="
              ($event) => {
                row.third_party_id = $event.value
                row.third_party_description =
                  $event.legal_person?.business_name ||
                  $event.natural_person?.full_name ||
                  $event.description ||
                  ''
              }
            "
          />
        </template>

        <template #third_party_description="{ row }">
          <GenericInputComponent
            placeholder="-"
            :default_value="row.third_party_description"
            disabled
            hide_bottom_space
          />
        </template>

        <template #month="{ row }">
          <GenericSelectorComponent
            :manual_option="month_list"
            map_options
            required
            class_name="col-3"
            :disabled="action === 'view'"
            :rules="[(val) => is_required(val, 'El mes es requerido')]"
            :default_value="row.month"
            @update:modelValue="row.month = $event"
          />
        </template>

        <template #value="{ row }">
          <InputMoneyComponent
            :model-value="row.value"
            disabled
            required
            :placeholder="'0'"
            :rules="[(val) => is_required(val, 'El valor es requerido')]"
            @update:model-value="row.value = $event.rawValue"
            hide_bottom_space
          />
        </template>

        <template
          v-if="!is1to1Transfer && action === 'edit'"
          #actions="{ row }"
        >
          <Button
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            class-custom="custom"
            :outline="false"
            flat
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="deleteOriginRow(row)"
          />
        </template>
      </TableList>
    </section>

    <!-- Sección DESTINO -->
    <section class="q-mt-lg">
      <TableList
        :title="tablePropsdestination.title"
        :loading="false"
        :columns="tablePropsdestination.columns"
        :rows="tablePropsdestination.rows"
        :pages="undefined"
        :hide-bottom-space="true"
        :custom-columns="customColumns"
      >
        <template
          v-if="!is1to1Transfer && action === 'edit'"
          #custom-header-action
        >
          <Button
            label="Agregar fila"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            size="sm"
            :outline="false"
            color="primary_fiduciaria"
            class="text-capitalize custom"
            colorIcon="#ffffff"
            @click="addDestinationRow"
          />
        </template>

        <template #business="{ row }">
          <GenericSelectorComponent
            return_object
            required
            auto_complete
            clearable
            map_options
            class_name="col-3"
            :disabled="action === 'view'"
            :manual_option="business_trusts"
            :placeholder="'Seleccione negocio'"
            :rules="[(val) => is_required(val, 'El negocio es requerido')]"
            :default_value="row.business_trust_id"
            @update:modelValue="
              ;(row.business_trust_id = $event.value),
                (row.business_trust_id_description = $event.description)
            "
          />
        </template>

        <template #business_description="{ row }">
          <GenericInputComponent
            placeholder="-"
            :default_value="row.business_trust_id_description"
            disabled
            hide_bottom_space
          />
        </template>

        <template #budget_item="{ row }">
          <GenericSelectorComponent
            return_object
            required
            auto_complete
            clearable
            map_options
            class_name="col-3"
            :disabled="action === 'view'"
            :manual_option="budget_item_codes_source_destination"
            :placeholder="'Seleccione rubro'"
            :rules="[
              (val) => is_required(val, 'El rubro presupuestal es requerido'),
            ]"
            :default_value="row.budget_item_id"
            @update:modelValue="
              ;(row.budget_item_id = $event.value),
                (row.budget_item_description = $event.description)
            "
          />
        </template>

        <template #budget_item_description="{ row }">
          <GenericInputComponent
            placeholder="-"
            :default_value="row.budget_item_description"
            disabled
            hide_bottom_space
          />
        </template>

        <template #resource="{ row }">
          <GenericSelectorComponent
            return_object
            required
            auto_complete
            clearable
            map_options
            class_name="col-3"
            :disabled="action === 'view'"
            :manual_option="budget_resource_codes"
            :placeholder="'Seleccione recurso'"
            :rules="[(val) => is_required(val, 'El recurso es requerido')]"
            :default_value="row.resource_id"
            @update:modelValue="
              ;(row.resource_id = $event.value),
                (row.resource_description = $event.description)
            "
          />
        </template>

        <template #resource_description="{ row }">
          <GenericInputComponent
            placeholder="-"
            :default_value="row.resource_description"
            disabled
            hide_bottom_space
          />
        </template>

        <template #area="{ row }">
          <GenericSelectorComponent
            return_object
            required
            auto_complete
            clearable
            map_options
            class_name="col-3"
            :disabled="action === 'view'"
            :manual_option="areas_resposabilities_codes"
            :placeholder="'Seleccione área'"
            :rules="[(val) => is_required(val, 'El área es requerida')]"
            :default_value="row.area_id"
            @update:modelValue="
              ;(row.area_id = $event.value),
                (row.area_description = $event.description)
            "
          />
        </template>

        <template #area_description="{ row }">
          <GenericInputComponent
            placeholder="-"
            :default_value="row.area_description"
            disabled
            hide_bottom_space
          />
        </template>

        <template #third_party="{ row }">
          <GenericSelectorComponent
            return_object
            required
            auto_complete
            clearable
            map_options
            class_name="col-3"
            :disabled="action === 'view'"
            :manual_option="third_parties"
            :placeholder="'Seleccione tercero'"
            :rules="[(val) => is_required(val, 'El tercero es requerido')]"
            :default_value="row.third_party_id"
            @update:modelValue="
              ($event) => {
                row.third_party_id = $event.value
                row.third_party_description =
                  $event.legal_person?.business_name ||
                  $event.natural_person?.full_name ||
                  $event.description ||
                  ''
              }
            "
          />
        </template>

        <template #third_party_description="{ row }">
          <GenericInputComponent
            placeholder="-"
            :default_value="row.third_party_description"
            disabled
            hide_bottom_space
          />
        </template>

        <template #month="{ row }">
          <GenericSelectorComponent
            :manual_option="month_list"
            map_options
            required
            class_name="col-3"
            :disabled="action === 'view'"
            :rules="[(val) => is_required(val, 'El mes es requerido')]"
            :default_value="row.month"
            @update:modelValue="row.month = $event"
          />
        </template>

        <template #value="{ row }">
          <InputMoneyComponent
            :model-value="row.value"
            disabled
            required
            :placeholder="'0'"
            :rules="[(val) => is_required(val, 'El valor es requerido')]"
            @update:model-value="row.value = $event.rawValue"
            hide_bottom_space
          />
        </template>

        <template
          v-if="!is1to1Transfer && action === 'edit'"
          #actions="{ row }"
        >
          <Button
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            class-custom="custom"
            :outline="false"
            flat
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="deleteDestinationRow(row)"
          />
        </template>
      </TableList>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'
// Interfaces
import { ITransferFormData } from '@/interfaces/customs/budget/OperationAuthorizations'
import { NonCreateActionType } from '@/interfaces/global'
// Constants
import { month_list } from '@/constants'
// Logic view
import useOperationAuthorizationTransferForm from '@/components/Forms/Budget/OperationAuthorizations/Transfer/OperationAuthorizationsTransferForm'

interface Props {
  action: NonCreateActionType
  data?: ITransferFormData
  is1to1?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  action: 'view',
  data: undefined,
  is1to1: false,
})

const {
  defaultIconsLucide,
  formRef,
  budget_item_codes_source_destination,
  areas_resposabilities_codes,
  budget_resource_codes,
  business_trusts,
  third_parties,
  customColumns,
  is_required,
  is1to1Transfer,
  tablePropsOrigin,
  tablePropsdestination,
  addOriginRow,
  addDestinationRow,
  deleteOriginRow,
  deleteDestinationRow,
  getFormData,
} = useOperationAuthorizationTransferForm(props)

// Exponer métodos para validación y envío
defineExpose({
  getFormData,
  validateForm: () => formRef.value?.validate(),
})
</script>
