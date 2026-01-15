<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <FiltersComponentV2
        :fields="filterConfig"
        :trigger_event_by_field="true"
        @filter="handleFilterSearch"
        @clear-filters="handleClearFilters"
      />
      <div class="q-pt-md q-my-xl">
        <FormatDefinitionList />
        <RecordTypeList />
        <RecordColumnsList />
      </div>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import useBankStructuresList from './BankStructuresList'
import FormatDefinitionList from '@/components/Lists/Treasury/BankStructures/FormatDefinitionList/FormatDefinitionList.vue'
import RecordTypeList from '@/components/Lists/Treasury/BankStructures/RecordTypeList/RecordTypeList.vue'
import RecordColumnsList from '@/components/Lists/Treasury/BankStructures/RecordColumnsList/RecordColumnsList.vue'

const {
  headerProperties,
  filterConfig,
  handleFilterSearch,
  handleClearFilters,
} = useBankStructuresList()
</script>
