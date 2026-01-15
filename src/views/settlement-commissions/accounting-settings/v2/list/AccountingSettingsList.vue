<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter(
          'SettlementCommissions',
          'AccountingSettingsList',
          'create'
        )
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('AccountingSettingsCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'SettlementCommissions',
                  'AccountingSettingsList',
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
              @click="goToURL('AccountingSettingsView', { id: row.id })"
            />

            <Button
              v-if="
                validateRouter(
                  'SettlementCommissions',
                  'AccountingSettingsList',
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
              :disabled="row.has_commissions"
              @click="goToURL('AccountingSettingsEdit', { id: row.id })"
            />

            <Button
              v-if="
                validateRouter(
                  'SettlementCommissions',
                  'AccountingSettingsList',
                  'delete'
                )
              "
              :left-icon="defaultIconsLucide.delete"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              :disabled="row.has_commissions"
              @click="openAlertModal(row.id)"
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 470px"
          :title="alertModalConfig.title"
          :description_message="alertModalConfig.description"
          @confirm="handleDeleteAction"
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

// Logic view
import useAccountingSettingList from '@/views/settlement-commissions/accounting-settings/v2/list/AccountingSettingsList'

const {
  headerProperties,
  tableProperties,
  defaultIconsLucide,
  filterConfig,
  alertModalConfig,
  alertModalRef,

  updatePage,
  updateRowsPerPage,
  goToURL,
  handleFilterSearch,
  handleClearFilters,
  handleDeleteAction,
  openAlertModal,
  validateRouter,
} = useAccountingSettingList()
</script>
