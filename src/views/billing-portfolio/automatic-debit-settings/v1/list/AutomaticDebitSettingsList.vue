<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('BillingCollection', 'AutomaticDebitList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('AutomaticDebitCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions', 'status']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <CustomToggle
              :value="isRowActive(row?.is_active ? 1 : 2)"
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
              v-if="
                validateRouter(
                  'BillingCollection',
                  'AutomaticDebitList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('AutomaticDebitEdit', { id: row.id })"
            />
            <Button
              v-if="
                validateRouter(
                  'BillingCollection',
                  'AutomaticDebitList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('AutomaticDebitView', { id: row.id })"
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 470px"
          :title="alertModalConfig.title"
          :description_message="alertModalConfig.description"
          @confirm="changeStatusAction"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'

// Logic view
import useAutomaticDebtCollectionList from '@/views/billing-portfolio/automatic-debit-settings/v1/list/AutomaticDebitSettingsList'

const {
  headerProps,
  tableProps,
  filterConfig,
  alertModalRef,
  alertModalConfig,
  isRowActive,
  defaultIconsLucide,

  handleFilter,
  updatePage,
  updatePerPage,
  openAlertModal,
  changeStatusAction,
  goToURL,
  validateRouter,
  handleClearFilters,
} = useAutomaticDebtCollectionList()
</script>
