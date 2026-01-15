<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter(
          'BillingCollection',
          'InvoicesCommissionNotesList',
          'create'
        )
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handleCreate"
      :btn-disable="selectedRecords.length === 0"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
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
          selection="single"
          v-model:selected="selectedRecords"
          @update:selected="emitSelectedIds"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'BillingCollection',
                  'InvoicesCommissionNotesList',
                  'show'
                )
              "
              :right-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="handleView(row)"
            >
            </Button>
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'

// Logic view
import useAdjustmentNoteRecordList from '@/views/billing-portfolio/adjustment-note-record/v1/list/AdjustmentNoteRecordList'
const emit = defineEmits<{ (e: 'update:selectedIds', ids: number[]): void }>()

const {
  headerProps,
  tableProps,
  selectedRecords,
  filterConfig,
  defaultIconsLucide,
  updatePage,
  updatePerPage,
  handleFilter,
  handleClearFilters,
  handleCreate,
  handleView,
  validateRouter,
} = useAdjustmentNoteRecordList()

const emitSelectedIds = () => {
  emit(
    'update:selectedIds',
    selectedRecords.value.map((o) => o.id)
  )
}
</script>
