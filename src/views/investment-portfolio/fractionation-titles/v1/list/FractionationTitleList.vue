<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter(
          'InvestmentPortfolio',
          'FractionationTitleList',
          'create'
        )
          ? 'Crear'
          : undefined
      "
      @to="goToURL('FractionationTitleCreate')"
    >
      <section>
        <FiltersComponent
          @filter="handleFilter"
          :fields="filter"
          @clear-filters="handleClear"
        />
      </section>
      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :columns="tableProps.columns"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="Number(row.status.id ?? 72)"
              statusType="investmentPortfolio"
            />
          </template>
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'FractionationTitleList',
                  'show'
                )
              "
              :right-icon="useUtils().defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'FractionationTitleView',
                  params: { id: row.id },
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
//Components
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'

//Composables
import { useUtils } from '@/composables'

//Logica
import { useFractionationTitleList } from '@/views/investment-portfolio/fractionation-titles/v1/list/FractionationTitleList'

const {
  headerProperties,
  tableProps,
  filter,
  updatePage,
  updatePerPage,
  validateRouter,
  handleClear,
  handleFilter,
  goToURL,
} = useFractionationTitleList()
</script>
