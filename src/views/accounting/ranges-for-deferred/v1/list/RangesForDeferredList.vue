<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'RangesForDeferredList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('RangesForDeferredCreate')"
    >
      <FiltersComponent
        show_actions
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isRangeForDeferredEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md q-my-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="tableProperties.customColumns"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdatePerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('Accounting', 'RangesForDeferredList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color-icon="#f45100"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              tooltip="Ver"
              @click="handleOptions('view', row.id)"
            />
            <Button
              v-if="
                validateRouter('Accounting', 'RangesForDeferredList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color-icon="#f45100"
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
//Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

//Logic
import useRangesForDeferredList from '@/views/accounting/ranges-for-deferred/v1/list/RangesForDeferredList'

const {
  showState,
  filterConfig,
  tableProperties,
  headerProperties,
  defaultIconsLucide,
  isRangeForDeferredEmpty,

  goToURL,
  handleFilter,
  handleOptions,
  validateRouter,
  handleUpdatePage,
  handleUpdatePerPage,
  handleClearFilters,
} = useRangesForDeferredList()
</script>
