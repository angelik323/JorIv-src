<template>
  <q-form ref="formInformationRef" @submit.prevent class="q-px-lg">
    <section class="movement-codes-table">
      <TableList
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        hide-botton
        hide-pagination
        :custom-columns="customColumns"
        :visible-columns="visibleColumns"
        :rows-per-page-options="[0]"
      >
        <template v-if="action === 'create'" #custom-header>
          <div class="row justify-between full-width">
            <p class="text-black-10 text-weight-bold text-subtitle1 q-mb-md">
              {{ tableProps.title }}
            </p>
            <div class="col-auto">
              <Button
                :left-icon="defaultIconsLucide.plusCircle"
                :outline="false"
                label="Agregar"
                color-icon="white"
                class-custom="custom q-mr-sm"
                @click="addRow"
              >
              </Button>
            </div>
          </div>
        </template>
        <template #module="{ row }">
          <GenericSelectorComponent
            :default_value="row.module ? row.module : null"
            :manual_option="code_movements_source_destination_modules"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val, '')]"
            @update:model-value="row.module = $event"
          />
        </template>
        <template #movement_source_code="{ row }">
          <GenericSelectorComponent
            :default_value="
              row.movement_source_code ? row.movement_source_code : null
            "
            :manual_option="movement_codes_source_destination"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val, '')]"
            @update:model-value="selectSourceCode(row, $event)"
          />
        </template>
        <template #movement_source_description="{ row }">
          <GenericInputComponent
            :placeholder="'-'"
            disabled
            :required="false"
            :rules="[]"
            :default_value="
              row.movement_source_description
                ? row.movement_source_description
                : null
            "
            @update:model-value="row.movement_source_code = $event"
          />
        </template>
        <template #movement_destination_code="{ row }">
          <GenericSelectorComponent
            :default_value="
              row.movement_destination_code
                ? row.movement_destination_code
                : null
            "
            :manual_option="movement_codes_source_destination"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val, '')]"
            @update:model-value="selectDestinationCode(row, $event)"
          />
        </template>
        <template #movement_destination_description="{ row }">
          <GenericInputComponent
            :placeholder="'-'"
            disabled
            :required="false"
            :rules="[]"
            :default_value="
              row.movement_destination_description
                ? row.movement_destination_description
                : null
            "
            @update:model-value="row.movement_destination_description = $event"
          />
        </template>
        <template v-if="action === 'create'" #actions="{ row }">
          <!-- Eliminar -->
          <Button
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="clearEvent(row)"
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
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic
import InformationForm from '@/components/Forms/Budget/MovementCodes/Information/InformationForm'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IMovementCodesDestinationResponse } from '@/interfaces/customs/budget/MovementCodes'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IMovementCodesDestinationResponse | null
  }>(),
  {}
)

const {
  tableProps,
  customColumns,
  visibleColumns,
  defaultIconsLucide,
  formInformationRef,
  movement_codes_source_destination,
  code_movements_source_destination_modules,
  is_required,
  clearEvent,
  selectSourceCode,
  selectDestinationCode,
  getModelsData,
  addRow,
} = InformationForm(props)

defineExpose({
  validateForm: () => formInformationRef.value?.validate(),
  getFormData: () => getModelsData(),
})
</script>
<style scoped src="./InformationForm.scss" lang="scss"></style>
