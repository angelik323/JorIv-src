<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('InvestmentPortfolio', 'IsinesCodesList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handlerGoTo('IsinesCodesCreate')"
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
          @update-page="handleChangePage"
          @update-rows-per-page="updatePerPage"
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
                validateRouter('InvestmentPortfolio', 'IsinesCodesList', 'show')
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
                  name: 'IsinesCodesView',
                  params: {
                    id: row.id,
                  },
                })
              "
            />
            <!-- Editar -->
            <Button
              v-if="
                validateRouter('InvestmentPortfolio', 'IsinesCodesList', 'edit')
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
                  name: 'IsinesCodesEdit',
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
                  'IsinesCodesList',
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
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useIsinesCodesList from '@/views/investment-portfolio/isines-codes/v1/list/IsinesCodesList'

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
  handleChangePage,
  openAlertModal,
  updatePerPage,
  handleFilter,
  handlerGoTo,
  validateRouter,
} = useIsinesCodesList()
</script>
