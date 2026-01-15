<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          v-if="
            validateRouter('Accounting', 'QueryMovementAccountsList', 'list')
          "
          ref="filtersRef"
          :fields="filters"
          @show-more="handleShowMoreFilters"
          :buttons="['more_filters']"
          @clear-filters="handleClear"
          @filter="handleFilter"
        />
      </section>
      <section class="q-mt-xl">
        <TableList
          v-if="
            validateRouter('Accounting', 'QueryMovementAccountsList', 'list')
          "
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :title="tableProps.title"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          :rowsPerPage="tableProps.rowsPerPage"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header-action>
            <div class="row justify-end">
              <Button
                v-if="
                  validateRouter(
                    'Accounting',
                    'QueryMovementAccountsList',
                    'export'
                  )
                "
                class-custom="custom"
                :outline="true"
                label="Descargar excel"
                color="orange"
                :styleContent="{ 'place-items': 'center', color: 'black' }"
                :left-img="imgButtonHeaderTable"
                :disabled="tableProps.rows.length === 0"
                @click="downloadTemplate"
              />
            </div>
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import { useQueryMovementAccountsList } from './QueryMovementAccountsList'

const {
  headerProps,
  filters,
  tableProps,
  filtersRef,
  validateRouter,
  handleShowMoreFilters,
  handleFilter,
  downloadTemplate,
  handleClear,
  updatePage,
  updatePerPage,
} = useQueryMovementAccountsList()
</script>
