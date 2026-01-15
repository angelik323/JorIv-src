<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'OpeningRecordList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="() => handleGoTo('OpeningRecordCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          :fields="filterFields"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="title"
          :loading="loading"
          :columns="columns"
          :rows="rows"
          :pages="pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="row.status_id" clickable />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
//Components
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import useOpeningRecordList from './OpeningRecordList'

//Utils
import { defaultIconsLucide } from '@/utils'
import { computed } from 'vue'

const {
  headerProps,
  tableProps,
  handleFilter,
  handleClear,
  handleGoTo,
  updatePage,
  filterFields,
  updateRowsPerPage,
  validateRouter,
} = useOpeningRecordList()

const title = computed(() => tableProps.value.title)
const loading = computed(() => tableProps.value.loading)
const columns = computed(() => tableProps.value.columns)
const rows = computed(() => tableProps.value.rows)
const pages = computed(() => tableProps.value.pages)
</script>
