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
          'InvestmentPortfolioList',
          'create'
        )
          ? headerProps.btn.label
          : undefined
      "
      :btn-icon="headerProps.btn.icon"
      @to="handleGoTo('InvestmentPortfolioCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="_cleanInvestmentPortfoliosData"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <CustomToggle
              :value="row.status_id === StatusID.ACTIVE"
              :width="100"
              :height="30"
              checked-text="Activo"
              unchecked-text="Inactivo"
              readonly
              @click="openModal(row)"
            />
          </template>
          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'InvestmentPortfolioList',
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
                  name: 'InvestmentPortfolioView',
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
                  'InvestmentPortfolioList',
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
                  name: 'InvestmentPortfolioEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />
          </template>
        </TableList>
        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 480px"
          :title="`¿Desea ${
            selectedPortfolio?.status_id === 1 ? 'inactivar' : 'activar'
          } el portafolio?`"
          @confirm="updatePortfolioStatus"
        >
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components:
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import Button from '@/components/common/Button/Button.vue'
// Utils
import { defaultIconsLucide } from '@/utils'
// Logic view
import useInvestmentPortfolioList from './InvestmentPortfolioList'
// Interfaces
import { StatusID } from '@/interfaces/global'

const {
  // Props
  headerProps,
  tableProps,
  alertModalRef,
  selectedPortfolio,
  filterConfig,
  // Methods
  handleFilter,
  handleGoTo,
  updatePage,
  updatePerPage,
  updatePortfolioStatus,
  openModal,
  _cleanInvestmentPortfoliosData,
  validateRouter,
} = useInvestmentPortfolioList()
</script>
