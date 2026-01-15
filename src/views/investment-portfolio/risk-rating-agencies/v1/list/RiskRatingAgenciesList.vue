<template>
  <div class="q-px-xl" main>
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      btn-label="Crear"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handleGoTo('RiskRatingAgenciesCreate')"
    >
      <FiltersComponent
        show_actions
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isRiskRatingAgencieEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="['actions']"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdatePerPage"
        >
          <template #actions="{ row }">
            <Button
              flat
              :outline="false"
              left-icon="Eye"
              color="orange"
              :class-custom="'custom'"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="handleOptions('view', row.id)"
            />
            <Button
              flat
              :outline="false"
              left-icon="Pencil"
              color="orange"
              :class-custom="'custom'"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="handleOptions('edit', row.id)"
            />
          </template>
        </TableList>
      </div>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

import useRiskRatingAgenciesList from '@/views/investment-portfolio/risk-rating-agencies/v1/list/RiskRatingAgenciesList'

const {
  showState,
  handleGoTo,
  handleFilter,
  filterConfig,
  handleOptions,
  tableProperties,
  headerProperties,
  handleUpdatePage,
  handleClearFilters,
  defaultIconsLucide,
  handleUpdatePerPage,
  isRiskRatingAgencieEmpty,
} = useRiskRatingAgenciesList()
</script>
