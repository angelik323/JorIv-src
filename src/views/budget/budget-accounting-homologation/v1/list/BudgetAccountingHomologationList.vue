<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('BudgetAccountingHomologationCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          trigger_event_by_field
          @filter="handleSearch"
          @clear-filters="clearFilters"
        />
      </section>
      <section class="q-mt-xl">
        <TableList
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header>
            <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
              {{ tableProperties.title }}
            </p>
          </template>
          <template #actions="{ row }">
            <Button
              v-if="row.id"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                goToURL('BudgetAccountingHomologationView', {
                  id: row.id,
                  operation: row.is_from_operation_log
                    ? 'operation'
                    : 'transfer',
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useBudgetAccountingHomologationList from '@/views/budget/budget-accounting-homologation/v1/list/BudgetAccountingHomologationList'

const {
  headerProps,
  filterConfig,
  defaultIconsLucide,
  tableProperties,
  goToURL,
  updatePage,
  updatePerPage,
  clearFilters,
  handleSearch,
} = useBudgetAccountingHomologationList()
</script>
