<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('PaymentInstructionsCreate')"
    >
      <section>
        <FiltersComponentV2
          ref="filtersRef"
          :buttons="['more_filters']"
          :fields="filterConfig"
          trigger_event_by_field
          @filter="handleFilter"
          @clear-filters="handleClear"
          @show-more="handleShowMoreFilters"
        />

        <section class="mb-3">
          <TableList
            ref="tableRef"
            :title="tableProps.title"
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="[
              'payment_request_status_id',
              'status_id',
              'actions',
            ]"
            @update-page="updatePage"
            @update-rows-per-page="updatePerPage"
          >
            <template #payment_request_status_id="{ row }">
              <ShowStatus
                :type="Number(row.payment_request.status_id ?? 1)"
                status-type="accountsPayable"
              />
            </template>

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
                @click="goToURL('PaymentInstructionsView', row.id)"
              />

              <Button
                :outline="false"
                :left-icon="defaultIconsLucide.edit"
                color="orange"
                :flat="true"
                :class-custom="'custom'"
                tooltip="Editar"
                @click="goToURL('PaymentInstructionsEdit', row.id)"
              />
            </template>
          </TableList>
        </section>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Logic
import usePaymentInstructionsList from '@/views/accounts-payable/payment-instructions/v1/list/PaymentInstructionsList'

const {
  // Configs
  headerProps,
  filterConfig,
  tableProps,

  // Composables
  defaultIconsLucide,
  goToURL,

  // Methods
  handleFilter,
  handleClear,
  handleShowMoreFilters,
  updatePage,
  updatePerPage,
} = usePaymentInstructionsList()
</script>
