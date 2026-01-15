<template>
  <q-form role="form" ref="mandateFormRef" aria-label="Formulario de encargos">
    <section aria-label="Sección de formulario de encargos">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            :default_value="models.stage_id"
            label="Etapa"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="project_stage"
            :rules="[
              (val: string) => useRules().is_required(val, 'La etapa es requerida'),
            ]"
            @update:model-value="models.stage_id = $event"
            :disabled="action !== 'create'"
            v-if="['create', 'edit'].includes(action)"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Etapa</p>
            <p class="text-weight-medium">
              {{ data_balance_point_mandate_form?.stage_name }}
            </p>
          </div>
        </div>
        <div class="col-12">
          <q-separator />
        </div>
        <div class="col-12">
          <div class="q-my-lg">
            <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
              Listado de encargos de la etapa
            </p>
          </div>
          <VCard>
            <template #content-card>
              <div class="q-mx-md">
                <TableList
                  :loading="tableStageMandateProperties.loading"
                  :rows="tableStageMandateProperties.rows"
                  :columns="tableStageMandateProperties.columns"
                  :custom-columns="[
                    'checked',
                    'total_investment_balance',
                    'yields',
                    'net_with_tax',
                    'net_without_tax',
                  ]"
                  @update:selected="handleUpdateSelectedStageMandates"
                  :dense="false"
                  hide-pagination
                >
                  <template #header-checked v-if="!['view'].includes(action)">
                    <div class="px-1 flex justify-center">
                      <q-checkbox
                        :model-value="areAllRowsSelected()"
                        :indeterminate="isSomeRowsSelected()"
                        size="sm"
                        color="orange"
                        @update:model-value="handleSelectAll"
                      />
                    </div>
                  </template>

                  <template
                    #checked="{ row }"
                    v-if="!['view'].includes(action)"
                  >
                    <div class="px-1 flex justify-center">
                      <q-checkbox
                        :val="row.id"
                        :model-value="isRowSelected(row.id)"
                        size="sm"
                        color="orange"
                        @update:model-value="(checked: boolean) => handleRowSelection(row, checked)"
                      />
                    </div>
                  </template>

                  <template #total_investment_balance="{ row }">
                    {{ formatCurrency(`${row.total_investment_balance}`) }}
                  </template>
                  <template #yields="{ row }">
                    {{ formatCurrency(`${row.yields}`) }}
                  </template>
                  <template #net_with_tax="{ row }">
                    {{ formatCurrency(`${row.net_with_tax}`) }}
                  </template>
                  <template #net_without_tax="{ row }">
                    {{ formatCurrency(`${row.net_without_tax}`) }}
                  </template>
                </TableList>
              </div>
            </template>
          </VCard>
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            :default_value="models.general_mandate_id"
            label="Encargo general"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="general_order"
            :rules="[
              (val: string) => useRules().is_required(val, 'El encargo general es requerido'),
            ]"
            @update:model-value="models.general_mandate_id = $event"
            v-if="['create', 'edit'].includes(action)"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Encargo general</p>
            <p class="text-weight-medium">
              {{ data_balance_point_mandate_form?.general_mandate_name }}
            </p>
          </div>
        </div>
        <div class="col-12">
          <q-separator />
        </div>
        <div class="col-12 q-py-md">
          <p class="mb-0 text-weight-bold">Total de recursos de los encargos</p>
          <p class="mb-0">{{ formatCurrency(models.total_general_order) }}</p>
        </div>
        <div class="col-12">
          <q-separator class="mb-4" />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    action: ActionType
  }>(),
  {}
)
import { ActionType } from '@/interfaces/global'
import useMandateBalancePointForm from './MandateBalancePoint'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useRules } from '@/composables'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'

// utils
import { useUtils } from '@/composables'
const formatCurrency = useUtils().formatCurrency

const {
  models,
  mandateFormRef,
  tableStageMandateProperties,
  project_stage,
  general_order,
  data_balance_point_mandate_form,
  handleUpdateSelectedStageMandates,
  isRowSelected,
  handleRowSelection,
  areAllRowsSelected,
  isSomeRowsSelected,
  handleSelectAll,
} = useMandateBalancePointForm(props)

defineExpose({
  validateForm: () => mandateFormRef.value?.validate(),
})
</script>
