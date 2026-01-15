<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="validateRouterCreate ? 'Crear' : ''"
      :btn-icon="validateRouterCreate ? defaultIconsLucide.plusCircleOutline : ''"
      @to="validateRouterCreate ? goToURL('ClosureValidationsCreate') : null"
    >
      <section class="q-mt-lg">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
          @update:values="filtersUpdate"
        />
      </section>

      <section class="q-mt-lg">
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
              <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 self-center">
                <p class="q-my-none text-weight-medium text-h5">
                  {{ tableProps.rows.length > 0 ? tableProps.title : '' }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2">
                <div class="row justify-end">
                  <Button
                    v-if="tableProps.rows.length > 0 && validateRouter('Budget', 'ClosureValidationsList', 'export')"
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
              v-if="row.id && validateRouter('Budget', 'ClosureValidationsList', 'delete')"
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openModalDelete(row.id)"
            />

            <Button
              v-if="validateRouter('Budget', 'ClosureValidationsList', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="goToURL('ClosureValidationsEdit', row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
  <AlertModalComponent
    ref="deleteModalRef"
    styleModal="min-width: 470px"
    :showImgDefault="false"
    :title="alertModalConfig.description"
    @confirm="handleDelete"
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
</template>

<script setup lang="ts">
// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import { useClosureValidationsList } from '@/views/budget/closure-validations/v1/list/ClosureValidationsList'
// Utils & Assets
import imgButtonHeaderTable from '@/assets/images/excel.svg'

const {
  headerProps,
  tableProps,
  filterConfig,
  defaultIconsLucide,
  deleteModalRef,
  handleFilter,
  updatePage,
  handleClearFilters,
  filtersUpdate,
  validateRouter,
  validateRouterCreate,
  downloadAction,
  openModalDelete,
  handleDelete,
  alertModalConfig,
  updatePerPage,
  goToURL,
} = useClosureValidationsList()
</script>
