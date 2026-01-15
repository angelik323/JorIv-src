<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('InvestmentPortfolio', 'InterestRateList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="$router.push({ name: 'InterestRatesCreate' })"
    >
      <section class="q-mt-md">
        <FiltersComponent
          :fields="filters"
          :model-value="modelFilters"
          @filter="handleUpdateFilters"
          @clear-filters="handleClearFilters"
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
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'InterestRateList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'InterestRatesView',
                  params: { id: row.id },
                })
              "
            />
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'InterestRateList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleOptions('edit', row.id)"
            />
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'InterestRateList',
                  'delete'
                )
              "
              :left-icon="defaultIconsLucide.trash"
              color="red"
              :outline="false"
              :flat="true"
              colorIcon="#d32f2f"
              tooltip="Eliminar"
              @click="handleOptions('delete', row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
    <AlertModalComponent
      ref="alertModalRef"
      :title="alertModalConfig.title"
      :description_message="alertModalConfig.description_message"
      :showBtnConfirm="true"
      :textBtnConfirm="'Eliminar'"
      :textBtnCancel="'Cerrar'"
      :showCloseBtn="true"
      :showImgDefault="true"
      @confirm="deleteItem"
    />
  </div>
</template>

<script setup lang="ts">
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import useInterestRatesList from './InterestRatesList'
import { defaultIconsLucide } from '@/utils'

const {
  tableProps,
  headerProps,
  filters,
  modelFilters,
  alertModalRef,
  alertModalConfig,
  handleUpdateFilters,
  handleOptions,
  updatePage,
  updatePerPage,
  deleteItem,
  handleClearFilters,
  validateRouter,
} = useInterestRatesList()
</script>
