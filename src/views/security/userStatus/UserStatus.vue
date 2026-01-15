<script setup lang="ts">
// Components:
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VueApexCharts from 'vue3-apexcharts'

// Logic
import { useUserStatusView } from '@/views/security/userStatus/UserStatus'
import TableList from '@/components/table-list/TableList.vue'

const {
  isGraph,
  headerProperties,
  configGraphic,
  exportXlsx,
  disableXlsxBtn,
  tableProperties,
  updatePage,
  updateRows,
} = useUserStatusView()
</script>
<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :show-back-btn="headerProperties.showBackBtn"
      @on-back="
        ;(isGraph = true), (headerProperties.title = 'Estado de usuarios')
      "
    >
      <template #addAfter>
        <q-btn
          v-if="!disableXlsxBtn"
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
      <section v-if="isGraph" class="q-pa-xl border-rounded">
        <VueApexCharts
          height="550"
          type="bar"
          :options="configGraphic.chartOptions"
          :series="configGraphic.chartData"
        />
      </section>

      <TableList
        v-else
        :loading="tableProperties.loading"
        :rows="tableProperties.rows"
        :columns="tableProperties.columns"
        :pages="tableProperties.pages"
        :custom-columns="['status', 'actions']"
        @update-page="updatePage"
        @update-rows-per-page="updateRows"
      />
    </ContentComponent>
  </div>
</template>
