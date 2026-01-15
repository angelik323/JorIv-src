<template>
  <section class="q-mt-md">
    <FiltersComponent
      @filter="handleFilter"
      :fields="filterConfig"
      @clear-filters="clearFilters"
    />
  </section>
  <section class="q-my-md">
    <div class="q-ma-md no-bottom-mx">
      <TableList
        :title="tableProps.rows.length ? tableProps.title : ''"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['check', 'actions']"
        @update-page="updatePage"
        :hideHeader="!tableProps.rows.length"
        @update-rows-per-page="updatePerPage"
        :custom-no-data-message-title="tableProps.no_data_title"
        :custom-no-data-message-subtitle="tableProps.no_data_subtitle"
      >
        <template v-if="tableProps.rows.length" #custom-header-action>
          <Button
            v-if="validateRouter('Budget', 'BudgetLevelsList', 'export')"
            outline
            class="text-capitalize btn-filter custom"
            color="orange"
            :left-img="excelIcon"
            label="Descargar excel"
            @click="downloadBudgetLevel"
            tooltip="Descargar excel"
          />
        </template>
        <template #check="{ row }">
          <RadioYesNo
            v-if="validateRouter('Budget', 'BudgetLevelsList', 'list')"
            :model-value="selectedLevel === row"
            @update:model-value="selectLevel(row)"
            class="solo-radio"
            isRadioButton
            :hasTitle="false"
            :hasSubtitle="false"
            :options="[{ label: '', value: true }]"
          />
        </template>

        <template #actions="{ row }">
          <Button
            v-if="validateRouter('Budget', 'BudgetLevelsList', 'edit')"
            :left-icon="defaultIconsLucide.edit"
            color="orange"
            class-custom="custom"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Editar"
            @click="handleEdit(row)"
          />

          <Button
            v-if="validateRouter('Budget', 'BudgetLevelsList', 'delete')"
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            class-custom="custom"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="openModalDelete(row.id)"
          />
        </template>
      </TableList>
    </div>
  </section>

  <AlertModalComponent
    ref="alertModalRef"
    title="¿Desea eliminar el nivel presupuestal?"
    @confirm="handleDeleteRow"
    :show-img-default="false"
  >
    <template #default-img
      ><q-img
        src="@/assets/images/icons/alert_popup_delete.svg"
        max-width="80px"
        width="80px"
        fit="contain" /></template
  ></AlertModalComponent>
</template>

<script setup lang="ts">
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import useBusinessLineList from '@/components/Lists/Budget/BudgetLevels/BudgetLevelsList'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import excelIcon from '@/assets/images/excel.svg'

const {
  filterConfig,
  tableProps,
  selectedLevel,
  alertModalRef,
  defaultIconsLucide,
  //Methods
  handleFilter,
  updatePage,
  updatePerPage,
  selectLevel,
  openModalDelete,
  handleDeleteRow,
  clearFilters,
  downloadBudgetLevel,
  handleEdit,
  validateRouter,
} = useBusinessLineList()
</script>

<style
  scoped
  src="@/components/Lists/Budget/BudgetLevels/BudgetLevelsList.scss"
></style>
