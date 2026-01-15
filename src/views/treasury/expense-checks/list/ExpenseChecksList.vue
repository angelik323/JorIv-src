<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersV2
          :fields="filterConfig"
          ref="expenseCheckFilterRef"
          @filter="handlerSearchFilter"
          @update:values="onExpenseCheckUpdate"
          :buttons="['more_filters']"
          @show-more="handlerShowFilters"
          @clear-filters="cleanFilters"
        />
      </section>
      <section class="q-mt-xl">
        <TableList
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRows"
        >
          <template #custom-header>
            <div
              class="row q-col-gutter-sm justify-between items-center"
              style="width: 100%"
            >
              <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10">
                <p class="q-my-none text-weight-medium text-h5">
                  {{ tableProps.title }}
                </p>
              </div>

              <div class="col-auto">
                <Button
                  :outline="true"
                  label="Imprimir"
                  unelevated
                  color="orange"
                  class-custom="custom"
                  :leftIcon="defaultIconsLucide.print"
                  :disabled="tableProps.rows.length === 0"
                  tooltip="Imprimir"
                  @click="loadPrintChecks(tableProps.rows)"
                />
              </div>
            </div>
          </template>

          <template #actions="{ row }">
            <Button
              outline
              flat
              rounded
              color="orange"
              :left-icon="defaultIconsLucide.print"
              class-custom="custom"
              @click="openExpenseChecksModal(row)"
              tooltip="Imprimir"
            />

            <InfoModal
              ref="alertExpenseChecksModalRef"
              styleModal="min-width: 70%"
              :title="alertModalConfig.title"
              :description_message="alertModalConfig.description"
              :textBtnConfirm="alertModalConfig.btnLabel"
              :show-btn-cancel="false"
              :show-btn-confirm="false"
              textBtnCancel="Finalizar"
            >
              <template #default-body>
                <div class="row justify-center">
                  <div class="col-sm-12 col-md-10">
                    <ShowViewInfo title="" :info="getCheckInfo" />
                  </div>
                </div>
              </template>
              <template #custom-actions>
                <q-btn
                  outline
                  label="Cancelar"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="closeExpenseChecksModal"
                />
                <Button
                  :outline="false"
                  label="Imprimir"
                  color-icon="#FFFFFF"
                  :styleContent="{ 'place-items': 'center' }"
                  :left-icon="defaultIconsLucide.print"
                  @click="
                    handlerShowViewerFile(Number(getCheckInfo[0].description))
                  "
                />
              </template>
            </InfoModal>
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
  <ViewFile ref="viewerFileComponentRef" />
</template>

<script lang="ts" setup>
// components
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import InfoModal from '@/components/common/AlertModal/AlertModalComponent.vue'
import ShowViewInfo from '@/components/showViewInfo/ShowViewInfo.vue'
import useExpenseChecksList from '@/views/treasury/expense-checks/list/ExpenseChecksList'
import ViewFile from '@/components/ViewFile/ViewFile.vue'

const {
  headerProps,
  tableProps,

  defaultIconsLucide,
  filterConfig,
  expenseCheckFilterRef,

  alertExpenseChecksModalRef,
  alertModalConfig,

  viewerFileComponentRef,
  getCheckInfo,

  updatePage,
  updateRows,
  openExpenseChecksModal,
  handlerSearchFilter,
  closeExpenseChecksModal,
  handlerShowFilters,
  cleanFilters,

  onExpenseCheckUpdate,
  loadPrintChecks,

  handlerShowViewerFile,
} = useExpenseChecksList()
</script>
