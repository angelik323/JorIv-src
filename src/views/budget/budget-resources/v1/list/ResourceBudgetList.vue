<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Budget', 'ResourceBudgetList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('ResourceBudgetCreate')"
    >
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
          string
        >
          <template #custom-header>
            <div class="row q-col-gutter-sm" style="width: 100%">
              <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 self-center">
                <p class="q-my-none text-weight-medium text-h5">
                  {{ tableProps.rows.length > 0 ? tableProps.title : '' }}
                </p>
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
                row.code &&
                validateRouter('Budget', 'ResourceBudgetList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('ResourceBudgetView', row.id)"
            />
            <Button
              v-if="
                row.code &&
                validateRouter('Budget', 'ResourceBudgetList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('ResourceBudgetEdit', row.id)"
            />
            <Button
              v-if="
                row.code &&
                validateRouter('Budget', 'ResourceBudgetList', 'delete')
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
      <!-- <TypeBudgetResourceList /> -->
      <TypeBudgetResourceList />
    </ContentComponent>
    <AlertModalComponent
      ref="deleteModalRef"
      styleModal="min-width: 470px"
      :showImgDefault="false"
      :title="alertModalConfig.description"
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
  </div>
</template>
<script setup lang="ts">
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import TypeBudgetResourceList from '@/components/Lists/Budget/ResourceBudget/TypeBudgetResource/TypeBudgetResourceList.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
// Utils & Assets
import imgButtonHeaderTable from '@/assets/images/excel.svg'
// logic view
import useResourceBudgetList from '@/views/budget/budget-resources/v1/list/ResourceBudgetList'

const {
  headerProps,
  tableProps,
  filterConfig,
  defaultIconsLucide,
  deleteModalRef,
  alertModalConfig,
  updatePage,
  updatePerPage,
  downloadAction,
  openModalDelete,
  handleFilter,
  goToURL,
  validateRouter,
  handleClearFilters,
  filtersUpdate,
  handleDelete,
  handleCloseModalDelete,
} = useResourceBudgetList()
</script>
