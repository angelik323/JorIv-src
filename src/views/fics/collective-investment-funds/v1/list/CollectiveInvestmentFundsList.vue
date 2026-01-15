<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="'Crear'"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('CollectiveInvestmentFundsCreate')"
    >
      <FiltersComponent
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isCollectiveInvestmentFundsEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="handleUpdatePerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('Fics', 'CollectiveInvestmentFundsList', 'show')
              "
              flat
              left-icon="Eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="handleOptions('view', row.id)"
            />
            <Button
              v-if="
                validateRouter('Fics', 'CollectiveInvestmentFundsList', 'edit')
              "
              flat
              left-icon="Pencil"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="handleOptions('edit', row.id)"
            />
            <Button
              flat
              left-icon="MoreVertical"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              colorIcon="#f45100"
              :tooltip="'Opciones'"
              :dropdown-options="collectiveInvestmentFundsOptions(row.id)"
            />
          </template>
        </TableList>
      </div>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useCollectiveInvestmentFundsList from '@/views/fics/collective-investment-funds/v1/list/CollectiveInvestmentFundsList'

const {
  goToURL,
  showState,
  updatePage,
  tableProps,
  headerProps,
  filterConfig,
  handleFilter,
  handleOptions,
  validateRouter,
  defaultIconsLucide,
  handleClearFilters,
  handleUpdatePerPage,
  isCollectiveInvestmentFundsEmpty,
  collectiveInvestmentFundsOptions,
} = useCollectiveInvestmentFundsList()
</script>
