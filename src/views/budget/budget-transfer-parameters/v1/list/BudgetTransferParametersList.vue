<template>
  <section class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      @to="headerProps.btn.route"
    >
      <article class="q-mt-md">
        <FiltersComponent
          @filter="handleFilter"
          :fields="filterConfig"
          @clear-filters="_cleanData"
        />
      </article>
      <article class="q-my-md">
        <VCard>
          <template #content-card>
            <div class="q-ma-lg">
              <TableList
                v-if="
                  validateRouter(
                    'Budget',
                    'BudgetTransferParametersList',
                    'list'
                  )
                "
                :title="tableProps.title"
                :loading="tableProps.loading"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :pages="tableProps.pages"
                :custom-columns="['actions']"
                @updatePage="updatePage"
                @updateRowsPerPage="updatePerPage"
              >
                <template #custom-header-action>
                  <Button
                    v-if="
                      validateRouter(
                        'Budget',
                        'BudgetTransferParametersList',
                        'export'
                      )
                    "
                    outline
                    class="text-capitalize btn-filter custom"
                    color="orange"
                    :left-img="excelIcon"
                    label="Descargar excel"
                    @click="downloadBudgetTransfer"
                    tooltip="Descargar excel"
                  />
                </template>
                <template #actions="{ row }">
                  <Button
                    v-if="
                      validateRouter(
                        'Budget',
                        'BudgetTransferParametersList',
                        'edit'
                      )
                    "
                    :left-icon="defaultIconsLucide.edit"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    :colorIcon="'#f45100'"
                    tooltip="Editar"
                    @click="editView(row.business.id)"
                  />

                  <Button
                    v-if="
                      validateRouter(
                        'Budget',
                        'BudgetTransferParametersList',
                        'show'
                      )
                    "
                    :left-icon="defaultIconsLucide.eye"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    colorIcon="#f45100"
                    tooltip="Ver"
                    @click="transferView(row.business.id)"
                  />
                  <Button
                    v-if="
                      validateRouter(
                        'Budget',
                        'BudgetTransferParametersList',
                        'delete'
                      )
                    "
                    :left-icon="defaultIconsLucide.trash"
                    :outline="false"
                    :flat="true"
                    colorIcon="#f45100"
                    tooltip="Eliminar"
                    @click="openAlertModal(row.business.id)"
                  />
                </template>
              </TableList>
            </div>
          </template>
        </VCard>
      </article>
    </ContentComponent>
    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 480px"
      title="¿Desea eliminar el parámetro de traslado presupuestal?"
      :show-img-default="false"
      @confirm="deleteBudgetTransfer"
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
  </section>
</template>

<script setup lang="ts">
//Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import excelIcon from '@/assets/images/excel.svg'

//Logic View
import useBudgetTransferParametersList from '@/views/budget/budget-transfer-parameters/v1/list/BudgetTransferParametersList'

const {
  headerProps,
  tableProps,
  filterConfig,
  alertModalRef,
  defaultIconsLucide,
  handleFilter,
  _cleanData,
  openAlertModal,
  validateRouter,
  deleteBudgetTransfer,
  downloadBudgetTransfer,
  updatePage,
  updatePerPage,
  transferView,
  editView,
} = useBudgetTransferParametersList()
</script>
