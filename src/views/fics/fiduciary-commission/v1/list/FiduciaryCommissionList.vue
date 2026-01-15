<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      btn-label="Crear"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('FiduciaryCommissionCreate')"
    >
      <FiltersComponent
        show_actions
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isFiduciaryCommissionEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md q-my-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="['actions']"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdateRowsPerPage"
        >
          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              colorIcon="#f45100"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              tooltip="Ver"
              @click="handleOptions('view', row.id)"
            />
            <Button
              :left-icon="defaultIconsLucide.edit"
              colorIcon="#f45100"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              tooltip="Editar"
              @click="handleOptions('edit', row.id)"
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
import useFiduciaryCommissionList from '@/views/fics/fiduciary-commission/v1/list/FiduciaryCommissionList'

const {
  goToURL,
  showState,
  handleFilter,
  filterConfig,
  handleOptions,
  tableProperties,
  headerProperties,
  handleUpdatePage,
  handleClearFilters,
  defaultIconsLucide,
  handleUpdateRowsPerPage,
  isFiduciaryCommissionEmpty,
} = useFiduciaryCommissionList()
</script>
