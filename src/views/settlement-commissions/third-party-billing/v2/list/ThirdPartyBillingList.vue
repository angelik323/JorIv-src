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
          'ThirdPartyBillingList',
          'create'
        )
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('ThirdPartyBillingCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
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
              :value="isRowActive(row?.comission_settlement_statuses_id)"
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
                  'SettlementCommissions',
                  'ThirdPartyBillingList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('ThirdPartyBillingRead', { id: row.id })"
            />

            <Button
              v-if="
                validateRouter(
                  'SettlementCommissions',
                  'ThirdPartyBillingList',
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
              @click="goToURL('ThirdPartyBillingEdit', { id: row.id })"
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import useThirdPartyBillingList from '@/views/settlement-commissions/third-party-billing/v2/list/ThirdPartyBillingList'

const {
  headerProperties,
  tableProps,
  filterConfig,
  defaultIconsLucide,
  isRowActive,
  alertModalRef,
  alertModalConfig,

  handleClear,
  handleFilter,
  updatePage,
  updatePerPage,
  openAlertModal,
  goToURL,
  changeStatusAction,
  validateRouter,
} = useThirdPartyBillingList()
</script>
