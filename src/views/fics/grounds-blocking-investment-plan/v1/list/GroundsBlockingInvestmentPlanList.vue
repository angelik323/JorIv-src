<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="'Crear'"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('GroundsBlockingInvestmentPlanCreate')"
    >
      <FiltersComponentV2
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClear"
      />

      <NoDataState
        v-if="isTableEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <section v-else class="q-pt-md q-my-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['status_id', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status_id="{ row }">
            <CustomToggle
              :value="isRowActive(row.status_id)"
              :width="100"
              :height="30"
              checked-text="Activo"
              unchecked-text="Inactivo"
              readonly
              @click="openAlertModal(row)"
            />
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('GroundsBlockingInvestmentPlanEdit', row.id)"
            />
          </template>
        </TableList>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 480px"
        :title="alertModalConfig.description"
        :show-img-default="false"
        @confirm="changeStatusAction"
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
<script setup lang="ts">
// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useGroundsBlockingInvestmentPlanList from '@/views/fics/grounds-blocking-investment-plan/v1/list/GroundsBlockingInvestmentPlanList'

const {
  alertModalConfig,
  alertModalRef,
  filterConfig,
  headerProps,
  tableProps,
  changeStatusAction,
  openAlertModal,
  updatePerPage,
  handleFilter,
  handleClear,
  isRowActive,
  goToURL,
  updatePage,
  showState,
  isTableEmpty,
  defaultIconsLucide,
} = useGroundsBlockingInvestmentPlanList()
</script>
