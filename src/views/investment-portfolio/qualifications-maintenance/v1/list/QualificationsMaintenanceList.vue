<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          @clear-filters="handleClearFilters"
          :fields="filterConfig"
          @filter="handleFilter"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRows"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="row.status_id ?? 1"
              class-custom="q-px-sm q-py-xs"
            />
          </template>
          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'QualificationsMaintenanceList',
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
              @click="
                $router.push({
                  name: 'QualificationsMaintenanceView',
                  params: {
                    id: row.id,
                  },
                })
              "
            />
            <!-- Editar -->
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'QualificationsMaintenanceList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                $router.push({
                  name: 'QualificationsMaintenanceEdit',
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
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useQualificationsMaintenanceList from '@/views/investment-portfolio/qualifications-maintenance/v1/list/QualificationsMaintenanceList'

// Utils
import { defaultIconsLucide } from '@/utils'

const {
  filterConfig,
  headerProps,
  tableProps,
  handleClearFilters,
  handleFilter,
  updatePage,
  updateRows,
  validateRouter,
} = useQualificationsMaintenanceList()
</script>
