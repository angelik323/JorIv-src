<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('FixedAssets', 'CalculationDeteriorationList', 'create')
          ? 'Crear'
          : ''
      "
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('CalculationDeteriorationCreate')"
    >
    </ContentComponent>
    <section>
      <FiltersComponentV2
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <TableList
        ref="tableRef"
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['actions']"
      >
        <template #actions="{ row }">
          <!-- Ver -->
          <Button
            v-if="
              validateRouter(
                'FixedAssets',
                'CalculationDeteriorationList',
                'view'
              )
            "
            :left-icon="useUtils().defaultIconsLucide.eye"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Ver'"
            @click="goToURL('CalculationDeteriorationView', row.id)"
          />

          <!-- Eliminar -->
          <Button
            v-if="
              validateRouter(
                'FixedAssets',
                'CalculationDeteriorationList',
                'delete'
              )
            "
            :outline="false"
            :left-icon="useUtils().defaultIconsLucide.trash"
            color="orange"
            :flat="true"
            :class-custom="'custom'"
            tooltip="Eliminar"
            @click="openDeleteModal(row.id)"
          />
        </template>
      </TableList>
      <AlertModalComponent
        ref="alertModalRef"
        :title="alertModalConfig.description"
        @confirm="handleDelete()"
      >
      </AlertModalComponent>
    </section>
  </div>
</template>
<script setup lang="ts">
// componentes
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// logic
import useCalculationDeteriorationList from '@/views/fixed-assets/calculation-deterioration/v1/list/CalculationDeteriorationList'

// utils
import { useUtils } from '@/composables'

const {
  headerProps,
  filterConfig,
  tableProps,
  alertModalConfig,

  handleDelete,
  openDeleteModal,
  goToURL,
  handleFilter,
  handleClearFilters,
  validateRouter,
} = useCalculationDeteriorationList()
</script>
