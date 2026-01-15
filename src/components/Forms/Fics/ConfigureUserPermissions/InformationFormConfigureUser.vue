<template>
  <div>
    <q-form ref="officePermissionForm" class="q-px-md">
      <section class="q-mt-md">
        <FiltersComponent :fields="filterConfig" @filter="handleFilter" />
      </section>

      <TableList
        class="q-mt-md"
        :loading="tableOfficesList.loading"
        :rows="tableOfficesList.rows"
        :columns="tableOfficesList.columns"
        :pages="tableOfficesList.pages"
        row-key="id"
        selection="multiple"
        v-model:selected="selectedOffices"
        @updatePage="updatePage"
        @update-rows-per-page="updatePerPage"
        @update:selected="emitSelectedIds"
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
// Components
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

// Interfaces
import { IRegionalResource } from '@/interfaces/customs'

// Logic view
import { useOfficesForm } from '@/components/Forms/Fics/ConfigureUserPermissions/InformationFormConfigureUser'

const props = defineProps<{ regions: IRegionalResource[] }>()
const emit = defineEmits<{ (e: 'update:selectedIds', ids: number[]): void }>()

const {
  filterConfig,
  selectedOffices,
  handleFilter,
  tableOfficesList,
  updatePage,
  updatePerPage,
} = useOfficesForm(props.regions)

const emitSelectedIds = () => {
  emit(
    'update:selectedIds',
    selectedOffices.value.map((o) => o.id)
  )
}
</script>
