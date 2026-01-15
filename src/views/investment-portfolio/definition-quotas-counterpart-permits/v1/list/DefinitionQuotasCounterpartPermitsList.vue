<template>
  <div class="q-mx-xl">
    <ContentComponent
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
      :btn-icon="headerProps.btnIcon"
      :btn-color="headerProps.btnColor"
      :btn-text-color="headerProps.btnTextColor"
      :indentation="headerProps.indentation"
      :content-indentation="headerProps.contentIndentation"
      @to="$router.push({ name: 'DefinitionQuotasCounterpartPermitsCreate' })"
    >
      <section class="q-mt-md">
        <FiltersComponent
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
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="
                $router.push({
                  name: 'DefinitionQuotasCounterpartPermitsView',
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
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="
                $router.push({
                  name: 'DefinitionQuotasCounterpartPermitsEdit',
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
          @confirm="deleteAction"
        >
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import useDefinitionQuotaCounterpartPermitList from './DefinitionQuotasCounterpartPermitsList'

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
  deleteAction,
  defaultIconsLucide,
  validateRouter,
} = useDefinitionQuotaCounterpartPermitList()
</script>
