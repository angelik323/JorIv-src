<script setup lang="ts">
// Components:
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/FiltersComponent.vue'
import VueApexCharts from 'vue3-apexcharts'

// Logic
import { useFailedAttemptsView } from '@/views/security/failedAttempts/FailedAttempts'

const {
  headerProperties,
  handleSearch,
  handleClear,
  configGraphic,
  disableXlsxBtn,
  totalUsers,
  exportXlsx,
} = useFailedAttemptsView()
</script>
<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <section class="q-mt-md q-mb-xl">
        <FiltersComponent @filter="handleSearch" @clear-filters="handleClear" />
      </section>

      <section
        class="q-my-xl menu__card--container"
        v-if="configGraphic.showGraphic"
      >
        <article class="q-pt-lg q-mx-xl">
          <div class="row items-center justify-between">
            <h2 class="text-h5 text-weight-bold">
              Intentos fallidos de ingreso
            </h2>
            <q-btn
              no-caps
              outline
              unelevated
              class="btn__table-excel"
              size="100%"
              :disable="disableXlsxBtn"
              @click="exportXlsx"
            >
              <img
                class="image__excel-btn q-mr-sm"
                src="@/assets/images/excel.svg"
                alt="Excel Icon"
              />
              Descargar excel
            </q-btn>
          </div>

          <div class="row justify-between items-center q-px-md q-pt-lg">
            <div class="col-12">
              <div class="row items-center justify-end q-gutter-x-sm">
                <span class="text-body2 text-weight-bold">Total:</span>
                <span class="text-body2 text-weight-medium">
                  {{ totalUsers }}</span
                >
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
    </ContentComponent>
  </div>
</template>
