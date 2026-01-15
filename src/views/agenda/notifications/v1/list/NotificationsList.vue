<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <FiltersComponent
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isTableEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md q-my-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['status_id']"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdatePerPage"
        >
          <template #status_id="{ row }">
            <ShowStatus
              :type="Number(row?.status_id ?? 0)"
              statusType="notifications"
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
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'

// Logic view
import useNotificationsList from '@/views/agenda/notifications/v1/list/NotificationsList'

const {
  showState,
  tableProps,
  headerProps,
  isTableEmpty,
  handleFilter,
  filterConfig,
  handleUpdatePage,
  handleClearFilters,
  handleUpdatePerPage,
} = useNotificationsList()
</script>
