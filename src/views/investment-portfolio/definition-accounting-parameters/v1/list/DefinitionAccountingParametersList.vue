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
          'DefinitionQuotasCounterpartPermitsList',
          'create'
        )
          ? headerProps.btnLabel
          : undefined
      "
      @to="$router.push({ name: 'DefinitionAccountingParametersCreate' })"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleFilterClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
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
                  'DefinitionQuotasCounterpartPermitsList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="
                $router.push({
                  name: 'DefinitionAccountingParametersView',
                  params: { id: row.id },
                })
              "
            />

            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'DefinitionQuotasCounterpartPermitsList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="primary"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="
                $router.push({
                  name: 'DefinitionAccountingParametersEdit',
                  params: { id: row.id },
                })
              "
            />

            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'DefinitionQuotasCounterpartPermitsList',
                  'delete'
                )
              "
              :left-icon="defaultIconsLucide.trash"
              color="negative"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              @click="openAlertModal('eliminar', row.id)"
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalRef"
          :title="alertModalConfig.title"
          @confirm="handleDeleteAction"
        >
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import useDefinitionAccountingParametersList from './DefinitionAccountingParametersList'

const {
  headerProps,
  tableProps,
  filterConfig,
  handleFilter,
  handleFilterClear,
  updatePage,
  updatePerPage,
  alertModalRef,
  alertModalConfig,
  openAlertModal,
  handleDeleteAction,
  defaultIconsLucide,
  validateRouter,
} = useDefinitionAccountingParametersList()
</script>
