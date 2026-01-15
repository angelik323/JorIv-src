<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      btn-label="Crear"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('OperationRejectionReasonsCreate')"
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
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <div class="flex justify-center">
              <CustomToggle
                :value="isRowActive(row.status_id)"
                :width="100"
                :height="30"
                checked-text="Activo"
                unchecked-text="Inactivo"
                readonly
                @click="openAlertModal(row)"
              />
            </div>
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('Fics', 'OperationRejectionReasonsList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('OperationRejectionReasonsEdit', row.id)"
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 470px"
          :title="alertModalConfig.description"
          @confirm="changeStatusAction"
        />
      </section>
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
import useOperationRejectionReasonsList from '@/views/fics/operation-rejection-reasons/v1/list/OperationRejectionReasonsList'

const {
  goToURL,
  showState,
  tableProps,
  updatePage,
  isRowActive,
  handleClear,
  headerProps,
  filterConfig,
  handleFilter,
  isTableEmpty,
  alertModalRef,
  openAlertModal,
  validateRouter,
  alertModalConfig,
  updateRowsPerPage,
  defaultIconsLucide,
  changeStatusAction,
} = useOperationRejectionReasonsList()
</script>
