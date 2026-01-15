<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter(
          'InvestmentPortfolio',
          'TypesMarketabilityList',
          'create'
        )
          ? 'Crear'
          : undefined
      "
      @to="$router.push({ name: 'TypesMarketabilityCreate' })"
    >
      <section>
        <FiltersComponent
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>
      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :custom-columns="['status', 'actions']"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'TypesMarketabilityList',
                  'show'
                )
              "
              :right-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'TypesMarketabilityView',
                  params: { id: row.id },
                })
              "
            />
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'TypesMarketabilityList',
                  'edit'
                )
              "
              :right-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                () =>
                  $router.push({
                    name: 'TypesMarketabilityEdit',
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

<script lang="ts" setup>
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import { useTypesMarketabilityList } from './TypesMarketabilityList'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  filterConfig,
  tableProps,
  handleClear,
  handleFilter,
  validateRouter,
} = useTypesMarketabilityList()
</script>
