<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="'Crear'"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('OperatingOfficesCreate')"
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
              v-if="validateRouter('Fics', 'OperatingOfficesList', 'show')"
              :right-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="handleOptions('view', row.id)"
            />

            <Button
              v-if="validateRouter('Fics', 'OperatingOfficesList', 'edit')"
              :right-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleOptions('edit', row.id)"
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalStatusRef"
          styleModal="min-width: 480px"
          :title="alertModalStatusConfig.description"
          :show-img-default="false"
          @confirm="changeStatusAction()"
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
import useOperationOfficesList from '@/views/fics/operating-offices/v1/list/OperatingOfficesList'

const {
  goToURL,
  showState,
  tableProps,
  updatePage,
  headerProps,
  handleClear,
  isRowActive,
  filterConfig,
  handleFilter,
  isTableEmpty,
  handleOptions,
  updatePerPage,
  validateRouter,
  openAlertModal,
  changeStatusAction,
  defaultIconsLucide,
  alertModalStatusRef,
  alertModalStatusConfig,
} = useOperationOfficesList()
</script>
