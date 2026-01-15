<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      show-back-btn
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      @on-back="handleGoToList"
    >
      <TabsComponent
        :tabs="tabs"
        :tab-active="tabActive"
        :tab-active-idx="tabActiveIdx"
      />

      <VCard>
        <template #content-card>
          <div class="q-pa-lg row q-col-gutter-x-lg q-col-gutter-y-lg">
            <div class="col-12 col-md-4 text-black-90">
              <p class="text-weight-bold no-margin">Código del fondo</p>
              <p class="text-weight-medium no-margin">
                {{ formData?.fund_code ?? '-' }}
              </p>
            </div>

            <div class="col-12 col-md-4 text-black-90">
              <p class="text-weight-bold no-margin">Nombre del fondo</p>
              <p class="text-weight-medium no-margin">
                {{ formData?.fund_name ?? '-' }}
              </p>
            </div>

            <div class="col-12 col-md-4 text-black-90">
              <p class="text-weight-bold no-margin">Negocio</p>
              <p class="text-weight-medium no-margin">
                {{ formData?.business_trust?.business_code ?? '-' }}
              </p>
            </div>

            <div class="col-12 col-md-4 text-black-90">
              <p class="text-weight-bold no-margin">Último cierre</p>
              <p class="text-weight-medium no-margin">
                {{
                  formData?.last_closing_date
                    ? formatDate(formData.last_closing_date, 'YYYY-MM-DD')
                    : '-'
                }}
              </p>
            </div>

            <div class="col-12 col-md-4 text-black-90">
              <p class="text-weight-bold no-margin">
                Porcentaje máximo de participación
              </p>
              <p class="text-weight-medium no-margin">
                {{ formData?.max_participation_percentage ?? '-' }}%
              </p>
            </div>

            <div class="col-12 col-md-4 text-black-90">
              <p class="text-weight-bold no-margin">
                Saldo máximo de participación
              </p>
              <p class="text-weight-medium no-margin">
                {{ formatCurrency(formData?.max_participation_balance ?? 0) }}
              </p>
            </div>
          </div>
        </template>
      </VCard>

      <NoDataState v-if="isTableEmpty" type="no-results" />

      <div class="q-mt-xl" v-else>
        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <TableList
                :title="tableProps.title"
                :loading="tableProps.loading"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :pages="tableProps.pages"
                :custom-columns="['status']"
              >
                <template #custom-header-action>
                  <Button
                    class-custom="custom"
                    :outline="true"
                    label="Descargar Excel"
                    color="orange"
                    :styleContent="{
                      'place-items': 'center',
                      color: 'black',
                    }"
                    :left-img="excelIcon"
                    @click="handleExportExcel"
                  />
                </template>

                <template #status="{ row }">
                  <ShowStatus :type="Number(row.status)" />
                </template>
              </TableList>
            </div>
          </template>
        </VCard>
      </div>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic view
import useConsultPercentagesView from '@/views/fics/collective-investment-funds/v1/consult-percentages/v1/view/ConsultPercentagesView'

const {
  tabs,
  formData,
  tabActive,
  formatDate,
  tableProps,
  headerProps,
  tabActiveIdx,
  isTableEmpty,
  handleGoToList,
  formatCurrency,
  handleExportExcel,
} = useConsultPercentagesView()
</script>
