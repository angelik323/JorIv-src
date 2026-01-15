<template>
  <q-form ref="formInformation">
    <section class="q-mt-md">
      <FiltersComponentV2
        ref="filterRef"
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleCleanFilters"
        @update:values="changeValuesFilter"
      />
    </section>
    <VCard>
      <template #content-card>
        <section class="q-mt-xl mx-3 mb-3">
          <TableList
            :title="tableBusinessAvailableProps.title"
            :loading="tableBusinessAvailableProps.loading"
            :columns="tableBusinessAvailableProps.columns"
            :rows="tableBusinessAvailableProps.rows"
            :pages="tableBusinessAvailableProps.pages"
            selection="multiple"
            @update:selected="handleSelected"
            @update-page="updatePage"
            @update-rows-per-page="updateRows"
          />
        </section>
      </template>
    </VCard>
  </q-form>
</template>

<script setup lang="ts">
// components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'

// logic component
import useBasicDataForm from '@/components/Forms/Accounting/DesactivateDailyClosingVouchers/v2/BasicData/BasicDataForm'

const emits = defineEmits(['validateForm'])

const {
  filterRef,
  filterConfig,
  tableBusinessAvailableProps,
  handleFilter,
  handleCleanFilters,
  updatePage,
  updateRows,
  getDataForm,
  changeValuesFilter,
  handleSelected,
} = useBasicDataForm(emits)

defineExpose({
  getDataForm: () => getDataForm(),
})
</script>
