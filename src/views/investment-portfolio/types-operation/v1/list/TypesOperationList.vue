<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('InvestmentPortfolio', 'TypesOperationList', 'create')
          ? 'Crear'
          : undefined
      "
      @to="$router.push({ name: 'TypesOperationCreate' })"
    >
      <section>
        <FiltersComponentV2
          @filter="handleFilter"
          :fields="filterConfig"
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
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'TypesOperationList',
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
                  name: 'TypesOperationView',
                  params: { id: row.id },
                })
              "
            />
            <!-- <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'TypesOperationList',
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
                    name: 'TypesOperationEdit',
                    params: { id: row.id },
                  })
              "
            /> -->
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import { useTypesOperationList } from './TypesOperationList'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  tableProps,
  handleFilter,
  filterConfig,
  handleClear,
  validateRouter,
  updatePage,
  updatePerPage,
} = useTypesOperationList()
</script>
