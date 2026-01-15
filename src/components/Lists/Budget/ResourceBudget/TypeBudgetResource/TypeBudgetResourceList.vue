<template>
  <section class="q-mt-md">
    <FiltersComponentV2
      :fields="filterConfig"
      @filter="handleFilter"
      @clear-filters="handleClearFilters"
      @update:values="filtersUpdate"
    />
  </section>
  <section class="q-mt-xl q-mx-sm">
    <TableList
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows ?? []"
      :pages="tableProps.pages"
      :custom-columns="['actions']"
      :hideHeader="tableProps.rows.length === 0"
      @update-page="updatePage"
      @update-rows-per-page="updatePerPage"
    >
      <template #custom-header>
        <div class="row q-col-gutter-sm" style="width: 100%">
          <div class="col-xs-12 col-sm-12 col-md-7 col-lg-10 self-center">
            <p class="q-my-none text-weight-medium text-h5">
              {{ tableProps.title }}
            </p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <div class="row justify-end">
              <Button
                v-if="validateRouter('Budget', 'ResourceBudgetList', 'create')"
                :outline="false"
                label="Agregar"
                size="md"
                color="orange"
                colorIcon="white"
                :left-icon="defaultIconsLucide.plusCircleOutline"
                @click="openModal('create')"
              />
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2">
            <div class="row justify-end">
              <Button
                v-if="
                  tableProps.rows.length > 0 &&
                  validateRouter('Budget', 'ResourceBudgetList', 'export')
                "
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
              />
            </div>
          </div>
        </div>
      </template>

      <template #actions="{ row }">
        <Button
          v-if="
            row.id && validateRouter('Budget', 'ResourceBudgetList', 'edit')
          "
          :left-icon="defaultIconsLucide.edit"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Editar'"
          @click="openModal('edit', row)"
        />
        <Button
          v-if="
            row.id && validateRouter('Budget', 'ResourceBudgetList', 'delete')
          "
          :left-icon="defaultIconsLucide.trash"
          color="orange"
          class-custom="custom"
          :outline="false"
          flat
          colorIcon="#f45100"
          tooltip="Eliminar"
          @click="openModalDelete(row.id)"
        />
      </template>
    </TableList>
  </section>
  <AlertModalComponent
    ref="deleteModalRef"
    styleModal="min-width: 470px"
    :showImgDefault="false"
    :title="modalsConfig.description"
    @confirm="handleDelete"
    @cancel="handleCloseModalDelete"
  >
    <template #default-img>
      <q-img
        src="@/assets/images/icons/alert_popup_delete.svg"
        max-width="80px"
        width="80px"
        fit="contain"
      />
    </template>
  </AlertModalComponent>
  <AlertModalComponent
    v-model="showModalTypeBudgetResource"
    :title-header="modalsConfig.title"
    styleModal="max-width: 100vw; width: 70%;"
    :showBtnConfirm="true"
    :showBtnCancel="true"
    :showImgDefault="false"
    :showCloseBtn="true"
    :disableConfirm="disableConfirm"
    @confirm="handleConfirm"
    @close="closeModalTypeResourceBudget"
  >
    <template #default-body>
      <TypeBudgetResourceCustomList
        ref="typeResourceTableRef"
        :actionModal="actionModal"
        v-model:data="resource_type"
        @update:data="resource_type = $event"
      />
    </template>
  </AlertModalComponent>
</template>

<script setup lang="ts">
// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import useTypeBudgetResourceList from '@/components/Lists/Budget/ResourceBudget/TypeBudgetResource/TypeBudgetResourceList'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
// Utils & assets
import imgButtonHeaderTable from '@/assets/images/excel.svg'
// logic view
import TypeBudgetResourceCustomList from '@/components/Lists/Budget/ResourceBudget/TypeBudgetResourceCustom/TypeBudgetResourceCustomList.vue'

const {
  typeResourceTableRef,
  deleteModalRef,
  showModalTypeBudgetResource,
  tableProps,
  filterConfig,
  resource_type,
  defaultIconsLucide,
  modalsConfig,
  actionModal,
  updatePage,
  updatePerPage,
  filtersUpdate,
  downloadAction,
  openModalDelete,
  openModal,
  validateRouter,
  closeModalTypeResourceBudget,
  handleDelete,
  handleFilter,
  handleClearFilters,
  handleConfirm,
  disableConfirm,
  handleCloseModalDelete,
} = useTypeBudgetResourceList()
</script>
