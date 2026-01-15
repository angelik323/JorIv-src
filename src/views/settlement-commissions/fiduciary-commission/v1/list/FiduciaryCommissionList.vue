<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
          v-model:selected="selectedRows"
          selection="multiple"
        >
          <template #custom-header-action>
            <Button
              no-caps
              class-custom="custom"
              :outline="false"
              :disabled="selectedRows?.length === 0"
              label="Liquidar comisión"
              color="orange"
              @click="handleLiquidate"
            />
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                $router.push({
                  name: 'SettlementFiduciaryCommissionEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Utils & Assets
import { defaultIconsLucide } from '@/utils'

// Logic view
import useFiduciaryCommissionList from '@/views/settlement-commissions/fiduciary-commission/v1/list/FiduciaryCommissionList'

const {
  headerProps,
  tableProps,
  filterConfig,
  selectedRows,

  handleFilter,
  updatePage,
  updatePerPage,
  handleClear,
  handleLiquidate,
} = useFiduciaryCommissionList()
</script>
