<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Budget', 'BudgetValidityClosureList', 'create')
          ? 'Crear'
          : ''
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('BudgetValidityClosureCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          show_actions
          @show-more="handleShowFilters"
          :fields="filterConfig"
          :buttons="['more_filters']"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
          @update:values="filtersUpdate"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows ?? []"
          :pages="tableProps.pages"
          :custom-columns="['sequential_number', 'actions', 'status']"
          :hideHeader="tableProps.rows.length === 0"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header>
            <div class="row q-col-gutter-sm" style="width: 100%">
              <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 self-center">
                <p class="q-my-none text-weight-medium text-h5">
                  {{ tableProps.rows.length > 0 ? tableProps.title : '' }}
                </p>
              </div>
            </div>
          </template>

          <template #sequential_number="{ row }">
            {{ String(row._row_number ?? '-').padStart(2, '0') }}
          </template>

          <template #status="{ row }">
            <ShowStatus
              :type="getStatusType(row.status)"
              statusType="default"
            />
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
              @click="handleView(row.id)"
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
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Logic view
import { useClosureVigencyList } from '@/views/budget/closure-vigency/v1/list/ClosureVigencyList'

const {
  headerProps,
  tableProps,
  filterConfig,
  defaultIconsLucide,
  handleFilter,
  updatePage,
  handleClearFilters,
  filtersUpdate,
  handleView,
  updatePerPage,
  goToURL,
  handleShowFilters,
  getStatusType,
  validateRouter,
} = useClosureVigencyList()
</script>
