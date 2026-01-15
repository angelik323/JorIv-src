<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <FiltersComponent
        :fields="filterConfig"
        :searchDisabled="disableOption"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
        @update:values="handleUpdateValues"
      />

      <NoDataState
        v-if="isTableEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md q-my-xl">
        <TableList
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :title="tableProps.title"
          :rows="tableProps.rows"
          :custom-columns="['level_match_id']"
          :rows-per-page-options="[0]"
          hidePagination
        >
          <template #level_match_id="{ row }">
            <ShowStatus
              :type="Number(row?.level_match_id)"
              :status-type="'sarlaft'"
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
import useConsultIndividualListPreventionList from '@/views/sarlaft/consult-individual-list-prevention/v1/list/ConsultIndividualListPreventionList'

const {
  showState,
  tableProps,
  headerProps,
  filterConfig,
  handleFilter,
  disableOption,
  isTableEmpty,
  handleClearFilters,
  handleUpdateValues,
} = useConsultIndividualListPreventionList()
</script>
