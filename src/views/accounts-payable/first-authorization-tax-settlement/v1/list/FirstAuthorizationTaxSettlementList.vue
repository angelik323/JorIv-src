<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section>
        <FiltersComponentV2
          :fields="filterConfig"
          :buttons="['more_filters']"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
          @show-more="handleShowFilters"
        />
      </section>

      <NoDataState
        v-if="isListEmpty"
        :type="!showState ? 'empty' : 'no-results'"
      />

      <TableList
        v-else
        :title="tableProperties.title"
        :loading="tableProperties.loading"
        :columns="tableProperties.columns"
        :rows="tableProperties.rows"
        :pages="tableProperties.pages"
        :custom-columns="['request_status', 'authorization_status', 'actions']"
        @update-page="updatePage"
        @update-rows-per-page="updatePerPage"
      >
        <template #request_status="{ row }">
          <ShowStatus
            :type="row.request_status?.id ?? 1"
            selection="multiple"
            status-type="accountsPayable"
          />
        </template>

        <template #authorization_status="{ row }">
          <ShowStatus
            :type="row.authorization_status?.id ?? 1"
            selection="multiple"
            status-type="accountsPayable"
          />
        </template>

        <template #actions="{ row }">
          <Button
            v-if="validateRouter('AccountsPayable', 'FirstAuthorizationTaxSettlementList', 'show')"
            :left-icon="defaultIconsLucide.eye"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            tooltip="Ver"
            @click="handleView(row.id)"
          />
        </template>
      </TableList>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// logic
import useFirstAuthorizationTaxSettlementList from '@/views/accounts-payable/first-authorization-tax-settlement/v1/list/FirstAuthorizationTaxSettlementList'

const {
  headerProps,
  defaultIconsLucide,
  validateRouter,
  filterConfig,
  handleFilter,
  handleClearFilters,
  handleShowFilters,
  showState,
  isListEmpty,
  tableProperties,
  updatePage,
  updatePerPage,
  handleView,
} = useFirstAuthorizationTaxSettlementList()
</script>