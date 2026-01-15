<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      @btn-select="handleBtnSelect"
    >
      <template #addAfter>
        <Button
          v-if="validateRouter('Accounting', 'AccoutingReportList', 'create')"
          :outline="headerProps.btn.outline"
          :label="headerProps.btn.label"
          :icon="headerProps.btn.icon"
          :color="headerProps.btn.color || 'primary'"
          :size="headerProps.btn.size || 'md'"
          :class-custom="headerProps.btn.class || 'btn-header'"
          :disabled="headerProps.btn.disable || false"
          :dropdown-options="btnOptions"
          :color-icon="'white'"
          @select="handleBtnSelect"
        />
      </template>

      <section class="q-mt-md">
        <FiltersComponent
          :fields="filterConfig"
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
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="row.status_id" clickable />
          </template>
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('Accounting', 'AccoutingReportList', 'show') &&
                row.ready
              "
              left-icon="Eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="handleGoTo('AccoutingReportView', row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import useOpeningRecordList from './AccoutingReportList'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

const {
  headerProps,
  tableProps,
  handleFilter,
  handleGoTo,
  handleClear,
  updatePage,
  updatePerPage,
  filterConfig,
  handleBtnSelect,
  btnOptions,
  validateRouter,
} = useOpeningRecordList()

const title = computed(() => tableProps.value.title)
const loading = computed(() => tableProps.value.loading)
const columns = computed(() => tableProps.value.columns)
const rows = computed(() => tableProps.value.rows)
const pages = computed(() => tableProps.value.pages)
</script>
