<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('InvestmentPortfolio', 'ManualUnitValueList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handlerGoTo('ManualUnitValueCreate')"
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
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'ManualUnitValueList',
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
                  name: 'ManualUnitValueView',
                  params: {
                    id: row.id,
                  },
                })
              "
            />
            <!-- Eliminar -->
            <Button
              v-if="
                row.id &&
                validateRouter(
                  'InvestmentPortfolio',
                  'ManualUnitValueList',
                  'delete'
                )
              "
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              @click="openAlertModal(row.id)"
            />
          </template>
        </TableList>
      </section>
      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 480px"
        :title="alertModalConfig.description"
        :show-img-default="false"
        @confirm="changeStatusAction"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useManualUnitValueList from '@/views/investment-portfolio/manual-unit-value/v1/list/ManualUnitValueList'

// Utils
import { defaultIconsLucide } from '@/utils'

const {
  alertModalConfig,
  alertModalRef,
  filterConfig,
  headerProps,
  tableProps,
  changeStatusAction,
  handleClearFilters,
  openAlertModal,
  updatePerPage,
  handleFilter,
  handlerGoTo,
  updatePage,
  validateRouter,
} = useManualUnitValueList()
</script>
