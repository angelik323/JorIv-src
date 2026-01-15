<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <!-- :model-value="modelFilters" -->
      <section class="q-mt-md">
        <FiltersComponent
          ref="filtersRef"
          :fields="filters"
          @update:values="handleUpdateValues"
          @filter="handleUpdateFilters"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver historial"
              @click="handleOptions('view', row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import useCheckbookQueryList from './CheckBookConsultationList'
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  tableProps,
  filters,
  // modelFilters,
  filtersRef,
  handleUpdateValues,
  handleClearFilters,
  handleUpdateFilters,
  updatePage,
  updatePerPage,
  handleOptions,
} = useCheckbookQueryList()
</script>
