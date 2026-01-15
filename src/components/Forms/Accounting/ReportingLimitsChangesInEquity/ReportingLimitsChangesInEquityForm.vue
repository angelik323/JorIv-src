<template>
  <div>
    <q-form ref="reportingLimitsChangesEquityForm">
      <section class="q-mt-md">
        <FiltersComponent
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :loading="businessTableProps.loading"
          :columns="businessTableProps.columns"
          :rows="businessTableProps.rows"
          :pages="businessTableProps.pages"
          :custom-columns="['actions']"
        />
      </section>

      <VCard custom-style="padding: 16px;" :show-border="true">
        <template #content-card>
          <TableList
            title="Agregar límites de reportes"
            :loading="addReportingLimitsTableProps.loading"
            :columns="addReportingLimitsTableProps.columns"
            :rows="addReportingLimitsTableProps.rows"
            :pages="addReportingLimitsTableProps.pages"
            :custom-columns="['limit', 'from_account', 'to_account', 'actions']"
          >
            <template #custom-header-action>
              <Button
                v-if="hideButton()"
                :outline="false"
                label="Agregar"
                left-icon="PlusCircle"
                color-icon="white"
                :disabled="!hasBusinesses"
                :styleContent="{
                  'place-items': 'center',
                  'border-radius': '20px',
                  'font-size': '13px',
                }"
                @click="addRowTable"
              />
            </template>
            <template #limit="{ row }">
              <GenericSelectorComponent
                :manual_option="patrimonyLimitOptions"
                map_options
                required
                :default_value="row.limit"
                :auto_complete="false"
                :clearable="false"
                :disabled="false"
                @update:modelValue="
                  (val) => {
                    row.limit = val
                    notifyRowChange(row)
                  }
                "
                :rules="[(v: string) => useRules().is_required(v, 'El límite es requerido')]"
              />
            </template>
            <template #from_account="{ row }">
              <GenericSelectorComponent
                :manual_option="account_group_by_code"
                map_options
                required
                :default_value="row.from_account"
                auto_complete
                :clearable="false"
                :disabled="false"
                option_label="name"
                display_value="code"
                @update:modelValue="
                  (val) => {
                    row.from_account = val
                    notifyRowChange(row)
                  }
                "
                :rules="[(v: string) => useRules().is_required(v, 'Desde cuenta es requerido')]"
              />
            </template>
            <template #to_account="{ row }">
              <GenericSelectorComponent
                :manual_option="account_group_by_code"
                map_options
                required
                :default_value="row.to_account"
                option_label="name"
                display_value="code"
                auto_complete
                :clearable="false"
                :disabled="false"
                @update:modelValue="
                  (val) => {
                    row.to_account = val
                    notifyRowChange(row)
                  }
                "
                :rules="[(v: string) => useRules().is_required(v, 'Hasta cuenta es requerido')]"
              />
            </template>
          </TableList>
        </template>
      </VCard>
    </q-form>
  </div>
</template>
<script setup lang="ts">
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import { useRules } from '@/composables'
import useReportingLimitsChangesInEquityForm from './ReportingLimitsChangesInEquityForm'

const props = defineProps<{
  action?: 'create' | 'edit'
  business?: string
  accountStructure?: string
  businessId?: number
  limitType?: string
}>()

const emits = defineEmits(['update'])

const {
  addReportingLimitsTableProps,
  filterConfig,
  businessTableProps,
  patrimonyLimitOptions,
  account_group_by_code,
  hasBusinesses,
  handleClear,
  addRowTable,
  handleFilter,
  getFormData,
  hideButton,
  notifyRowChange,
} = useReportingLimitsChangesInEquityForm(props, emits)

defineExpose({
  getFormData,
  hasBusinesses,
})
</script>

<style lang="scss" scoped>
:deep(.catalog-limit-table) {
  .q-field {
    padding-bottom: 0 !important;
  }
  .q-select .q-field__native {
    min-height: unset;
  }
}
</style>
