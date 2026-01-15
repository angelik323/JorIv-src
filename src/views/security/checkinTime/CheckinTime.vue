<script setup lang="ts">
// Components:
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/FiltersComponent.vue'
import VueApexCharts from 'vue3-apexcharts'

// Logic
import { useCheckinTimeView } from '@/views/security/checkinTime/CheckinTime'
import TableList from '@/components/table-list/TableList.vue'

const {
  isGraph,
  headerProperties,
  totalUsers,
  handleSearch,
  handleClear,
  configGraphic,
  tableProperties,
  updateRows,
  updatePage,
  exportXlsx,
  handleBackView,
} = useCheckinTimeView()
</script>
<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :subtitle="headerProperties.subtitle"
      :breadcrumbs="headerProperties.breadcrumbs"
      :show-back-btn="headerProperties.showBackBtn"
      @to="handleBackView"
      @on-back="handleBackView"
    >
      <template v-if="isGraph">
        <section class="q-mt-md q-mb-xl">
          <FiltersComponent
            @filter="handleSearch"
            @clear-filters="handleClear"
          />
        </section>

        <section
          class="q-my-xl menu__card--container"
          v-if="configGraphic.showGraphic"
        >
          <article class="q-pt-md q-mx-xl">
            <div class="row justify-between items-center q-px-md">
              <div class="col-9">
                <h2 class="text-h5 text-weight-bold">Ingreso de usuarios</h2>
              </div>
              <div class="col-3">
                <div class="row items-center justify-end q-gutter-x-sm">
                  <span class="text-body2 text-weight-bold">Total:</span>
                  <span class="text-body2 text-weight-medium">
                    {{ totalUsers }}
                  </span>
                </div>
              </div>
            </div>

            <VueApexCharts
              class="q-mt-md"
              height="550"
              type="line"
              :options="configGraphic.chartOptions"
              :series="configGraphic.chartData"
            />
          </article>
        </section>
      </template>
      <TableList
        v-else
        :title="' '"
        :loading="tableProperties.loading"
        :rows="tableProperties.rows"
        :columns="tableProperties.columns"
        :pages="tableProperties.pages"
        @update-page="updatePage"
        @update-rows-per-page="updateRows"
      >
        <template #custom-header-action>
          <q-btn
            no-caps
            outline
            unelevated
            class="btn__table-excel"
            size="100%"
            @click="exportXlsx"
          >
            <img
              class="image__excel-btn q-mr-sm"
              src="@/assets/images/excel.svg"
              alt="Excel Icon"
            />
            Descargar excel
          </q-btn>
        </template>
      </TableList>
    </ContentComponent>
  </div>
</template>
