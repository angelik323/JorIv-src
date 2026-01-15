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
            <div class="col-12 col-md-3 text-black-90">
              <p class="text-weight-bold no-margin">Código del fondo</p>
              <p class="text-weight-medium no-margin">
                {{ formData?.fund_code ?? '-' }}
              </p>
            </div>

            <div class="col-12 col-md-3 text-black-90">
              <p class="text-weight-bold no-margin">Descripción del fondo</p>
              <p class="text-weight-medium no-margin">
                {{ formData?.fund_name ?? '-' }}
              </p>
            </div>

            <div class="col-12 col-md-3 text-black-90">
              <p class="text-weight-bold no-margin">Negocio</p>
              <p class="text-weight-medium no-margin">
                {{ formData?.business_trust?.business_code ?? '-' }}
              </p>
            </div>

            <div class="col-12 col-md-3 text-black-90">
              <p class="text-weight-bold no-margin">Fecha de último cierre</p>
              <p class="text-weight-medium no-margin">
                {{
                  formData?.last_closing_date
                    ? formatDate(formData.last_closing_date, 'YYYY-MM-DD')
                    : '-'
                }}
              </p>
            </div>
          </div>
        </template>
      </VCard>

      <VCard>
        <template #content-card>
          <div class="q-pa-lg row q-col-gutter-x-lg q-col-gutter-y-lg">
            <p class="col-12 text-h6 text-weight-bold q-mb-none">Consulta</p>

            <div class="col-12 col-md-4">
              <GenericDateInputComponent
                :default_value="selectedDate"
                label="Fecha de consulta"
                mask="YYYY-MM-DD"
                placeholder="AAAA-MM-DD"
                required
                :rules="[]"
                @update:modelValue="selectedDate = $event"
              />
            </div>

            <div class="col-12" v-if="isTableEmpty">
              <NoDataState
                :type="showState === 0 ? 'empty' : 'no-results'"
                :disableDefaultClass="true"
              />
            </div>

            <div class="col-12" v-else>
              <q-separator class="q-mt-sm q-mb-lg" />

              <TableList
                :title="tableProps.title"
                :loading="tableProps.loading"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :pages="tableProps.pages"
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
              </TableList>
            </div>

            <div class="flex col-12 justify-end">
              <Button
                :outline="false"
                label="Finalizar"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="handleGoToList"
              />
            </div>
          </div>
        </template>
      </VCard>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic view
import useConsultPercentagesView from '@/views/fics/collective-investment-funds/v1/consult-profitability/v1/view/ConsultProfitabilityView'

const {
  tabs,
  formData,
  tabActive,
  showState,
  formatDate,
  tableProps,
  headerProps,
  tabActiveIdx,
  selectedDate,
  isTableEmpty,
  handleGoToList,
  handleExportExcel,
} = useConsultPercentagesView()
</script>
