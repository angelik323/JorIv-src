<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="'Crear'"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('InvestmentPlanParticipationModificationCreate')"
    >
      <FiltersComponentV2
        ref="filtersRef"
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClear"
        @update:values="onChangeFilter"
      />

      <NoDataState
        v-if="isTableEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <section class="q-pt-md q-my-xl" v-else>
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['status']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
          selection="multiple"
          @update:selected="onUpdateSelected"
        >
          <template #custom-header-action>
            <div class="row q-gutter-md items-center">
              <Button
                v-if="
                  validateRouter(
                    'Fics',
                    'InvestmentPlanParticipationModificationList',
                    'delete'
                  )
                "
                :outline="true"
                :left-icon="defaultIconsLucide.trash"
                colorIcon="black"
                :class-custom="'custom'"
                label="Eliminar"
                size="md"
                :disabled="selectedRows.length === 0"
                @click="openDeleteModal"
              />
              <Button
                v-if="
                  validateRouter(
                    'Fics',
                    'InvestmentPlanParticipationModificationList',
                    'edit'
                  )
                "
                :outline="false"
                :left-icon="defaultIconsLucide.checkCircle"
                colorIcon="white"
                :class-custom="'custom'"
                label="Autorizar"
                size="md"
                color="orange"
                :disabled="selectedRows.length === 0"
                @click="openAuthorizeModal"
              />
            </div>
          </template>

          <template #status="{ row }">
            <ShowStatus
              :type="row.status.id"
              status-type="fics"
              class-custom="q-px-sm q-py-xs"
            />
          </template>
        </TableList>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :description_message="''"
        :textBtnConfirm="
          currentAction === 'authorize' ? 'Autorizar' : 'Eliminar'
        "
        @confirm="handleModalConfirm()"
        :showBtnCancel="false"
      >
        <template #default-img>
          <q-img
            v-if="currentAction === 'authorize'"
            src="@/assets/images/icons/confirmation_icon.svg"
            max-width="80px"
            width="80px"
            fit="contain"
            alt="Imagen de confirmación"
          />
          <q-img
            v-else
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
            alt="Imagen de alerta"
          />
        </template>

        <template #custom-actions>
          <Button
            :outline="true"
            :label="currentAction === 'authorize' ? 'No autorizar' : 'Cancelar'"
            size="md"
            color="orange"
            :class-custom="'custom'"
            @click="handleModalCancel()"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useInvestmentPlanParticipationModificationList from '@/views/fics/investment-plan-participation-modification/v1/list/InvestmentPlanParticipationModificationList'

const {
  goToURL,
  showState,
  filtersRef,
  updatePage,
  tableProps,
  headerProps,
  handleClear,
  isTableEmpty,
  filterConfig,
  handleFilter,
  selectedRows,
  currentAction,
  alertModalRef,
  updatePerPage,
  onChangeFilter,
  validateRouter,
  openDeleteModal,
  onUpdateSelected,
  alertModalConfig,
  handleModalCancel,
  defaultIconsLucide,
  handleModalConfirm,
  openAuthorizeModal,
} = useInvestmentPlanParticipationModificationList()
</script>
