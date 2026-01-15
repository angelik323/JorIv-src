<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      btn-label="Crear"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('BudgetSourceDestinationsCreate')"
    >
      <FiltersComponent
        show_actions
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
        ref="filterRef"
        @update:values="onChangeFilter"
      />

      <NoDataState
        v-if="isTableEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md q-my-xl">
        <TableList
          v-if="showTable"
          :key="`table-rows-${filtersFormat.rows}`"
          :rows-per-page-options="rowsPerPageOptions"
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.trash"
              colorIcon="#f45100"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              tooltip="Eliminar"
              @click="openDeleteModal(row.id)"
            />
          </template>
        </TableList>
      </div>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :description_message="''"
        @confirm="deleteItem()"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useBudgetSourceDestinationsList from '@/views/accounts-payable/budget-sources-destinations/v1/list/BudgetSourceDestinationsList'

const {
  goToURL,
  showState,
  handleFilter,
  filterConfig,
  tableProperties,
  headerProperties,
  updatePage,
  handleClearFilters,
  defaultIconsLucide,
  updateRowsPerPage,
  isTableEmpty,
  onChangeFilter,
  deleteItem,
  alertModalConfig,
  openDeleteModal,
  filtersFormat,
  showTable,
  rowsPerPageOptions,
} = useBudgetSourceDestinationsList()
</script>
