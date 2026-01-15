<template>
  <section class="q-pa-lg">
    <p class="text-black-90 text-weight-bold text-h6">Asociar negocio</p>

    <div class="q-mt-md">
      <FiltersComponentV2
        ref="filtersRef"
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleFilterClear"
        @update:values="onFilterChange"
      />
    </div>

    <TableList
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :pages="tableProps.pages"
      :custom-columns="['status_id']"
      :canDisableSelection="true"
      :disableSelection="action === ActionTypeEnum.VIEW"
      :hide-pagination="true"
      selection="multiple"
      row-key="id"
      v-model:selected="selectedAssociatedBusiness"
      @update:selected="onUpdateSelectedAssociatedBusiness"
    >
      <template #status_id="{ row }">
        <ShowStatus :type="Number(row?.status?.id ?? 0)" />
      </template>
    </TableList>
  </section>
</template>

<script setup lang="ts">
// Components
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'

// Interfaces
import { ActionType, ActionTypeEnum } from '@/interfaces/global'
import {
  IProjectManagementAssociatedBusinessForm,
  IProjectManagementAssociatedBusinessList,
} from '@/interfaces/customs/derivative-contracting/ProjectManagement'

// Logic view
import useAssociateBusinessList from '@/components/Lists/DerivativeContracting/ProjectManagement/AssociateBusiness/AssociateBusinessList'

const props = withDefaults(
  defineProps<{
    action: ActionType
    associatedBusinessForm?: IProjectManagementAssociatedBusinessForm | null
  }>(),
  {}
)

const emit = defineEmits<{
  (
    e: 'update:associatedBusinessForm',
    value: IProjectManagementAssociatedBusinessForm | null
  ): void
  (
    e: 'update:selectedAssociatedBusinessList',
    value: IProjectManagementAssociatedBusinessList
  ): void
}>()

const {
  filtersRef,
  filterConfig,
  tableProps,
  selectedAssociatedBusiness,

  handleFilter,
  handleFilterClear,
  onFilterChange,
  onUpdateSelectedAssociatedBusiness,
} = useAssociateBusinessList(props, emit)
</script>
