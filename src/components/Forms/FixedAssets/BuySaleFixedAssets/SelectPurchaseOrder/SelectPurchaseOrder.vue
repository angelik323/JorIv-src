<template>
  <section>
    <!-- Filtros -->
    <section class="q-mb-md">
      <FiltersComponentV2
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />
    </section>

    <!-- Tabla -->
    <section>
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns as any"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['select', 'total_value']"
        @update-page="updatePage"
        @update-rows-per-page="updateRowsPerPage"
      >
        <template #select="{ row }">
          <div class="q-pa-sm flex justify-center">
            <q-radio
              :model-value="isSelected(row.id)"
              :val="true"
              color="primary_fiduciaria"
              @update:model-value="selectOrder(row)"
            />
          </div>
        </template>

        <template #total_value="{ row }">
          <div class="q-pa-sm text-right">
            <span>{{ formatCurrency(Number(row.total_value)) }}</span>
          </div>
        </template>
      </TableList>
    </section>

    <!-- Orden seleccionada y botón continuar -->
    <section class="q-mt-lg q-mb-lg">
      <div class="row justify-end">
        <div class="col-auto">
          <Button
            :outline="false"
            no-caps
            unelevated
            label="Continuar"
            :disable="!canContinue"
            tooltip="Continuar con la orden seleccionada"
            @click="handleContinue"
          />
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
// components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// interfaces
import { IBuyOrderFixedAssetsList } from '@/interfaces/customs/fixed-assets/BuyOrderFixedAssets'

// composables
import { useUtils } from '@/composables'

// logic
import useSelectPurchaseOrder from './SelectPurchaseOrder'

const emit = defineEmits<{
  (e: 'select', order: IBuyOrderFixedAssetsList): void
}>()

const { formatCurrency } = useUtils()

const {
  // Table
  tableProps,
  filterConfig,

  // Selection
  //selectedOrder,
  canContinue,

  // Methods
  handleFilter,
  handleClearFilters,
  updatePage,
  updateRowsPerPage,
  selectOrder,
  isSelected,
  handleContinue
} = useSelectPurchaseOrder(emit)
</script>
