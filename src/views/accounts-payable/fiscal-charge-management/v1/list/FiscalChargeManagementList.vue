<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('FiscalChargeManagementCreate')"
    >
      <section>
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
        <NoDataState
          v-if="isFiscalChargeManagementListEmpty"
          :type="!showState ? 'empty' : 'no-results'"
        />
        <section v-else>
          <TableList
            :title="tableProps.title"
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['status', 'actions']"
            @update-page="updatePage"
            @update-rows-per-page="updateRowsPerPage"
          >
            <template #status="{ row }">
              <CustomToggle
                :value="isRowActive(row.status.id)"
                :width="100"
                :height="30"
                checked-text="Activo"
                unchecked-text="Inactivo"
                readonly
                @click="openAlertModal(row, 'status')"
              />
            </template>
            <template #actions="{ row }">
              <!-- Editar -->
              <Button
                :left-icon="defaultIconsLucide.edit"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                tooltip="Editar"
                @click="goToURL('FiscalChargeManagementEdit', row.id)"
              />
              <!-- Eliminar -->
              <Button
                :outline="false"
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                :flat="true"
                :class-custom="'custom'"
                tooltip="Eliminar"
                @click="openAlertModal(row, 'delete')"
              />
            </template>
          </TableList>
        </section>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :textBtnConfirm="alertModalConfig.textBtnConfirm"
        :textBtnCancel="alertModalConfig.textBtnCancel"
        @confirm="handleConfirmAction()"
      >
        <template #default-img>
          <q-img
            v-if="selectedAlertModalAction === 'delete'"
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
            alt="Imagen de alerta"
          />
          <q-img
            v-else
            src="@/assets/images/icons/alert_popup.svg"
            max-width="80px"
            width="80px"
            fit="contain"
            alt="Imagen de alerta"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
//Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'

//Logic
import useFiscalChargeManagementList from '@/views/accounts-payable/fiscal-charge-management/v1/list/FiscalChargeManagementList'

const {
  defaultIconsLucide,
  headerProps,
  filterConfig,
  tableProps,
  showState,
  isFiscalChargeManagementListEmpty,
  alertModalRef,
  alertModalConfig,
  selectedAlertModalAction,
  handleFilter,
  handleClearFilters,
  openAlertModal,
  handleConfirmAction,
  updatePage,
  updateRowsPerPage,
  isRowActive,
  goToURL,
} = useFiscalChargeManagementList()
</script>
