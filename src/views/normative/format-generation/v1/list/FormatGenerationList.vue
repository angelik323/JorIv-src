<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="headerProperties.btn.label"
      :btn-icon="headerProperties.btn.icon"
      @to="goToURL('FormatGenerationCreate')"
    >
      <!-- :btn-label="
        validateRouter('Normative', 'FormatGenerationList', 'create')
          ? headerProperties.btn.label
          : undefined
      " -->
      <section class="q-mt-md">
        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          trigger_event_by_field
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="Number(row.status?.id)"
              status-type="normative"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('Normative', 'EquivalenceParametersList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('EquivalenceParametersEdit', row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useFormatGenerationList from '@/views/normative/format-generation/v1/list/FormatGenerationList'

const {
  defaultIconsLucide,
  headerProperties,
  tableProperties,
  filterComponentRef,
  filterConfig,
  validateRouter,
  goToURL,
  handleClearFilters,
  handleFilterSearch,
  updatePage,
  updateRowsPerPage,
} = useFormatGenerationList()
</script>
