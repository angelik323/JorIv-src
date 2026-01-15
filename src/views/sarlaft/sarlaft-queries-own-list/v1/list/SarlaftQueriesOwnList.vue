<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section>
        <FiltersComponent
          :fields="filterConfig"
          :search-disabled="isSearchButtonDisabled"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section>
        <NoDataState
          v-if="isQueryOwnListEmpty"
          :type="showState === 0 ? 'empty' : 'no-results'"
        />
        <div v-else>
          <TableList
            :title="tableProps.title"
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            @update-page="handleUpdatePage"
            @update-rows-per-page="handleUpdatePerPage"
          ></TableList>
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'

// Logic view
import useSarlaftQueriesOwnList from '@/views/sarlaft/sarlaft-queries-own-list/v1/list/SarlaftQueriesOwnList'

const {
  // conf
  headerProps,
  filterConfig,
  tableProps,
  isQueryOwnListEmpty,
  showState,
  isSearchButtonDisabled,

  // functions
  handleFilter,
  handleClearFilters,
  handleUpdatePage,
  handleUpdatePerPage,
} = useSarlaftQueriesOwnList()
</script>
