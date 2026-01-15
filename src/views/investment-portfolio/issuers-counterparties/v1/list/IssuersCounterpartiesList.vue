<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter(
          'InvestmentPortfolio',
          'IssuersCounterpartiesList',
          'create'
        )
          ? headerProperties.btn.label
          : undefined
      "
      :btn-icon="headerProperties.btn.icon"
      @to="handlerGoTo('IssuersCounterpartiesCreate')"
    >
      <FiltersComponent
        :fields="filterConfig"
        :trigger_event_by_field="true"
        @filter="handleFilterSearch"
        @clear-filters="handleClearFilters"
      />

      <div class="q-pt-md q-my-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="['status_id', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                row.id &&
                validateRouter(
                  'InvestmentPortfolio',
                  'IssuersCounterpartiesList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="handlerGoTo('IssuersCounterpartiesView', row.id)"
            />
            <!-- Editar -->
            <Button
              v-if="
                row.id &&
                validateRouter(
                  'InvestmentPortfolio',
                  'IssuersCounterpartiesList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handlerGoTo('IssuersCounterpartiesEdit', row.id)"
            />
          </template>
        </TableList>
      </div>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import { defaultIconsLucide } from '@/utils'
import useIssuersCounterpartiesList from './IssuersCounterpartiesList'

const {
  tableProperties,
  headerProperties,
  filterConfig,
  handlerGoTo,
  handleFilterSearch,
  handleClearFilters,
  updatePage,
  updateRowsPerPage,
  validateRouter,
} = useIssuersCounterpartiesList()
</script>
