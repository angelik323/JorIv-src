<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsList.title"
      :breadcrumbs="headerPropsList.breadcrumbs"
      :btn-label="'Crear'"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="$router.push({ name: 'VisitRecordsCreate' })"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
          @update:values="handleUpdateFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #actions="{ row }">
            <Button
              tooltip="Editar"
              flat
              :outline="false"
              :left-icon="defaultIconsLucide.edit"
              @click="handleEdit(row.id)"
            />
            <Button
              tooltip="Ver"
              flat
              :outline="false"
              :left-icon="defaultIconsLucide.eye"
              @click="handleView(row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// logic-view
import useVisitRecordsList from '@/views/fixed-assets/visit-records/v1/list/VisitRecordsList'

const {
  tableProps,
  filterConfig,
  headerPropsList,
  defaultIconsLucide,

  handleFilter,
  handleClearFilters,
  handleUpdateFilters,
  handleEdit,
  handleView,

  updatePage,
  updateRowsPerPage,
} = useVisitRecordsList()
</script>
