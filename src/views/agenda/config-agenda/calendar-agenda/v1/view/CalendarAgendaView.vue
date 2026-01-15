<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <FiltersComponent
        show_actions
        :fields="filterConfig"
        trigger_event_by_field
        @filter="handleFilter"
        @update:values="onChangeFilter"
        @clear-filters="handleClearFilters"
      />

      <component
        :is="calendarComponent"
        :key="componentKey"
        :initial-data="modelData"
        :filters="selectedFilters"
        v-if="hasSearched"
      />

      <NoDataState v-else type="empty" />
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'

// Logic view
import useCalendarAgenda from '@/views/agenda/config-agenda/calendar-agenda/v1/view/CalendarAgendaView'

const {
  modelData,
  hasSearched,
  filterConfig,
  handleFilter,
  componentKey,
  handleGoToList,
  onChangeFilter,
  selectedFilters,
  headerProperties,
  calendarComponent,
  handleClearFilters,
} = useCalendarAgenda()
</script>
