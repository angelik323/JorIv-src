<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <FiltersComponentV2
        ref="filtersRef"
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <section class="mb-3">
        <TableList
          ref="tableRef"
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status_id', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status_id="{ row }">
            <ShowStatus
              :type="Number(row.status_id ?? 1)"
              status-type="accountsPayable"
            />
          </template>

          <template #actions="{ row }">
            <Button
              :outline="false"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :flat="true"
              :class-custom="'custom'"
              tooltip="Ver"
              @click="openDetailModal(row)"
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 800px"
          :showImgDefault="false"
          :titleHeader="alertModalConfig.title"
          :show-btn-cancel="false"
          :show-btn-confirm="false"
          marginTopBody="mt-0"
          marginTopActions="mt-0"
        >
          <template #default-body>
            <div class="mx-4">
              <p class="text-subtitle1">Número de solicitud</p>
              <p class="text-h6">{{ alertModalConfig.data.request_number }}</p>

              <TableList
                :loading="tableDetailProps.loading"
                :columns="tableDetailProps.columns"
                :rows="tableDetailProps.rows"
                :custom-columns="['status_id']"
                :hide-pagination="true"
              >
                <template #status_id="{ row }">
                  <ShowStatus
                    :type="Number(row.status_id ?? 1)"
                    status-type="accountsPayable"
                  />
                </template>
              </TableList>
            </div>
          </template>
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic
import usePaymentStatusList from '@/views/accounts-payable/payment-status/v1/list/PaymentStatusList'

const {
  // Configs
  headerProps,
  filtersRef,
  filterConfig,
  tableProps,
  defaultIconsLucide,
  alertModalConfig,
  tableDetailProps,

  // Refs
  alertModalRef,

  // Methods
  handleFilter,
  handleClearFilters,
  updatePage,
  updatePerPage,
  openDetailModal,
} = usePaymentStatusList()
</script>
