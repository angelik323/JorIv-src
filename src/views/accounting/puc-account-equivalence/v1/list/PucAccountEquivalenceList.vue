<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <FiltersComponent
        :fields="filterConfig"
        :show_actions="true"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isAccountEquivalenceEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div class="q-pt-md q-my-xl" v-else>
        <TableList
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          @update-page="updatePage"
          :custom-columns="customColumns"
        >
          <template #actions="{ row }">
            <Button
              :label="''"
              left-icon="Eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="handleOptions('view', row.id)"
            />
          </template>
        </TableList>
      </div>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import usePucAccountEquivalenceList from './PucAccountEquivalenceList'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

const {
  showState,
  updatePage,
  filterConfig,
  handleFilter,
  handleOptions,
  customColumns,
  tableProperties,
  headerProperties,
  handleClearFilters,
  isAccountEquivalenceEmpty,
} = usePucAccountEquivalenceList()
</script>
