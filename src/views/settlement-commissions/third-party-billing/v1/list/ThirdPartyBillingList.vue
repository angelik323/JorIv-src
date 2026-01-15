<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      btn-label="Vincular"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="$router.push({ name: 'ThirdPartyBillingCreate' })"
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
          :custom-columns="['actions', 'status_id']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status_id="{ row }">
            <ShowStatus :type="row?.comission_settlement_statuses?.id" />
          </template>
          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'ThirdPartyBillingRead',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                $router.push({
                  name: 'ThirdPartyBillingEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />
          </template>
        </TableList>
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

// Utils & Assets
import { defaultIconsLucide } from '@/utils'

// Logic view
import useThirdPartyBillingList from '@/views/settlement-commissions/third-party-billing/v1/list/ThirdPartyBillingList'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

const {
  headerProps,
  tableProps,
  filterConfig,
  handleClear,
  handleFilter,
  updatePage,
  updatePerPage,
} = useThirdPartyBillingList()
</script>
