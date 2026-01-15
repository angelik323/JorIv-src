<script setup lang="ts">
// Components:
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VueApexCharts from 'vue3-apexcharts'
import TableList from '@/components/table-list/TableList.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Icon from '@/components/common/Icon/Icon.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic
import { useUserConnectedView } from '@/views/security/userConnected/UserConnectedList'
import { defaultIconsLucide } from '@/utils'
import moment from 'moment'

const {
  isGraph,
  headerProperties,
  configGraphic,
  disableXlsxBtn,
  tableProperties,

  updateRows,
  handleClick,
  updatePage,
  exportXlsx,
  handleBackView,
} = useUserConnectedView()
</script>
<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :show-back-btn="headerProperties.showBackBtn"
      @to="handleBackView"
      @on-back="handleBackView"
    >
      <section class="q-my-xl">
        <VCard v-if="isGraph">
          <template #content-card>
            <div class="q-px-xl q-py-lg row items-center justify-between">
              <div class="col-12 col-md-8">
                <div class="text-h5 text-medium">Usuarios conectados</div>

                <div class="row items-center q-mt-xs q-gutter-md">
                  <Icon :name="defaultIconsLucide.calendar" :size="24" />
                  <span class="text-grey-8 text-subtitle2">
                    Fecha y hora de consulta <br />
                    <b>{{ moment().format('DD/MM/YYYY hh:mm a') }}</b>
                  </span>
                </div>

                <Button
                  class="q-mt-lg"
                  label="Ver usuarios conectados"
                  color="primary_fiduciaria"
                  :left-icon="defaultIconsLucide.eye"
                  :right-icon="defaultIconsLucide.chevronRight"
                  colorIcon="#ffffff"
                  :outline="false"
                  class-custom="custom"
                  style-content="
                    display: flex;
                    align-items: center;
                  "
                  @click="handleClick"
                />
              </div>

              <div class="col-12 col-md-4">
                <div class="q-pa-md flex flex-center">
                  <q-circular-progress
                    v-if="configGraphic.loader"
                    indeterminate
                    rounded
                    size="40px"
                    color="orange"
                  />

                  <VueApexCharts
                    v-else-if="
                      configGraphic.chartData?.length &&
                      configGraphic.chartData[0] !== 0
                    "
                    height="280"
                    type="donut"
                    :options="configGraphic.chartOptions"
                    :series="configGraphic.chartData"
                  />

                  <div v-else>
                    <p class="text-weight-medium text-grey-6 q-mb-none">
                      No hay usuarios conectados
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </VCard>

        <TableList
          v-else
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="['status', 'actions']"
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
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>
