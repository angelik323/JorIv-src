<template>
  <q-form ref="processCodesFormElementRef" class="q-pa-lg">
    <TableList
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :loading="tableProps.loading"
      :rows-per-page-options="tableProps.rowsPerPageOptions"
      :hide-bottom="true"
      :custom-columns="['movement_code_id']"
    >
      <template #movement_code_id="{ row }">
        <GenericSelectorComponent
          :manual_option="movements_codes"
          :map_options="true"
          :default_value="row.movement_code?.id ?? ''"
          :first_filter_option="'label'"
          :second_filter_option="'label'"
          :clearable="true"
          :auto_complete="true"
          :required="false"
          :rules="[]"
          @update:modelValue="onMovementCodeSelector($event, row)"
        />
      </template>
    </TableList>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

// Logic view
import useProcessCodesForm from '@/components/Forms/Fics/AccountingParameters/ProcessCodes/ProcessCodesForm'

const {
  tableProps,
  processCodesFormElementRef,
  onMovementCodeSelector,
  movements_codes,
} = useProcessCodesForm()

defineExpose({
  validateForm: () => processCodesFormElementRef.value?.validate(),
})
</script>
