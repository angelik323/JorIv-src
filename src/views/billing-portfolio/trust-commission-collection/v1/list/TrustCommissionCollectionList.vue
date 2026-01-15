<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="clearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
          selection="multiple"
          v-model:selected="selected"
        >
          <template #custom-header-action>
            <Button
              v-if="
                validateRouter(
                  'BillingCollection',
                  'CollectionTrustCommissionList',
                  'create'
                )
              "
              label="Aplicar recaudo"
              size="md"
              unelevated
              :left-icon="defaultIconsLucide.plusCircle"
              color-icon="white"
              class="text-capitalize btn-filter custom"
              :outline="false"
              :disabled="selected.length === 0"
              @click="handleCollection"
            />
          </template>

          <template #status="{ row }">
            <ShowStatus
              :type="Number(row?.status.id ?? 1)"
              status-type="billingPortfolio"
            />
          </template>
        </TableList>
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
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Logic view
import useTrustCommissionCollectionList from '@/views/billing-portfolio/trust-commission-collection/v1/list/TrustCommissionCollectionList'

const {
  headerProps,
  tableProps,
  filterConfig,
  selected,
  defaultIconsLucide,

  handleFilter,
  updatePage,
  updatePerPage,
  handleCollection,
  clearFilters,
  validateRouter,
} = useTrustCommissionCollectionList()
</script>
