<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter('BusinessTrust', 'BalancePointList', 'create')
          ? headerProperties.btn.label
          : undefined
      "
      :btn-icon="headerProperties.btn.icon"
      @to="handlerGoTo('BalancePointCreate')"
    >
      <FiltersComponent
        ref="filtersRef"
        :fields="filterConfig"
        @filter="handleFilterSearch"
        @clear-filters="handleClearFilters"
      />
      <div class="q-pt-md q-my-xl">
        <TableList
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="[
            'business_status_id',
            'project_status_id',
            'equilibrium_status_id',
            'actions',
          ]"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #custom-header>
            <div class="row q-col-gutter-sm full-width">
              <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10">
                <p class="full-height q-my-none text-weight-medium text-h5">
                  {{ tableProperties.title }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2">
                <div class="row justify-end">
                  <Button
                    v-if="
                      validateRouter(
                        'BusinessTrust',
                        'BalancePointList',
                        'export'
                      )
                    "
                    class-custom="custom"
                    :outline="true"
                    label="Descargar excel"
                    color="orange"
                    :disabled="isDownloadDisabled"
                    :styleContent="{
                      'place-items': 'center',
                      color: 'black',
                    }"
                    :left-img="imgButtonHeaderTable"
                    @click="downloadExcel"
                  />
                </div>
              </div>
            </div>
          </template>
          <template #business_status_id="{ row }">
            <ShowStatus
              :type="row.business_status_id"
              statusType="trustBusiness"
            />
          </template>
          <template #project_status_id="{ row }">
            <ShowStatus :type="row.project_status_id" statusType="project" />
          </template>
          <template #equilibrium_status_id="{ row }">
            <ShowStatus
              :type="row.equilibrium_status_id"
              statusType="balancePoint"
            />
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                row.id &&
                validateRouter('BusinessTrust', 'BalancePointList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="handlerGoTo('BalancePointView', row.id)"
            />
            <!-- Editar -->
            <Button
              v-if="
                row.id &&
                validateRouter('BusinessTrust', 'BalancePointList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handlerGoTo('BalancePointEdit', row.id)"
              :disabled="isEditDisabled(row.equilibrium_status_id)"
            />
            <!-- Eliminar -->
            <Button
              v-if="
                row.id &&
                validateRouter('BusinessTrust', 'BalancePointList', 'delete')
              "
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openModalDelete(row.id)"
              :disabled="isEditDisabled(row.equilibrium_status_id)"
            />
            <!-- Descarga individual -->
            <Button
              v-if="
                row.id &&
                validateRouter(
                  'BusinessTrust',
                  'BalancePointList',
                  'export_individual'
                )
              "
              :left-icon="defaultIconsLucide.download"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Descarga individual"
              @click="downloadExcelByRow(row.id)"
              :disabled="
                isIndividualDownloadDisabled(row.equilibrium_status_id)
              "
            />
            <!-- Autorizar -->
            <Button
              v-if="
                row.id &&
                validateRouter(
                  'BusinessTrust',
                  'BalancePointList',
                  'action_authorize'
                )
              "
              :left-icon="defaultIconsLucide.checkCircle"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Autorizar"
              @click="handlerGoTo('BalancePointAuthorize', row.id)"
              :disabled="isEditDisabled(row.equilibrium_status_id)"
            />
          </template>
        </TableList>
      </div>
      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :description_message="''"
        @confirm="handleDelete()"
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
    </ContentComponent>
  </div>
</template>
<script lang="ts" setup>
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import useBalancePointList from '@/views/trust-business/balance-point/v1/list/BalancePointList'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

const {
  headerProperties,
  filterConfig,
  tableProperties,
  isDownloadDisabled,
  alertModalRef,
  alertModalConfig,
  defaultIconsLucide,
  isIndividualDownloadDisabled,
  isEditDisabled,
  handleClearFilters,
  handleFilterSearch,
  updatePage,
  updateRowsPerPage,
  handlerGoTo,
  openModalDelete,
  handleDelete,
  downloadExcel,
  downloadExcelByRow,
  validateRouter,
} = useBalancePointList()
</script>
