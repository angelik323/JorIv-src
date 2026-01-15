<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="headerProperties.btn.label"
      :btn-icon="headerProperties.btn.icon"
      @to="goToURL('BudgetAreasResponsibilityCreate')"
    >
      <FiltersComponentV2
        :fields="filterFields"
        @clear-filters="handleClear"
        @filter="handleFilterSearch"
      />
      <section class="q-mt-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['actions']"
          :hide-header="!tableProperties.rows.length"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header-action>
            <Button
              class-custom="custom"
              :outline="true"
              label="Descargar excel"
              color="orange"
              :styleContent="{
                'place-items': 'center',
                color: 'black',
              }"
              :left-img="imgButtonHeaderTable"
              @click="downloadAction"
              :disabled="tableProperties.rows.length === 0"
            />
          </template>
          <template #actions="{ row }">
            <Button
              v-if="row.id"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('BudgetAreasResponsibilityEdit', row.id)"
            />

            <Button
              v-if="row.id"
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openAlertModal('eliminar', row.id)"
            />
          </template>
        </TableList>
        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 480px"
          title="¿Desea eliminar el área de responsabilidad?"
          @confirm="changeStatusAction"
        ></AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import TableList from '@/components/table-list/TableList.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import useAreasResponsibilityList from '@/views/budget/areas-responsibility/v1/list/BudgetAreasResponsibilityList'

const {
  filterFields,
  headerProperties,
  tableProperties,
  defaultIconsLucide,
  alertModalRef,
  handleClear,
  handleFilterSearch,
  updatePage,
  updatePerPage,
  openAlertModal,
  changeStatusAction,
  downloadAction,
  goToURL,
} = useAreasResponsibilityList()
</script>
