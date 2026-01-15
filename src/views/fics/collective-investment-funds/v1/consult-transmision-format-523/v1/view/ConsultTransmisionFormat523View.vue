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
              <p class="text-weight-bold no-margin">Fecha de registro</p>
              <p class="text-weight-medium no-margin">
                {{
                  formData?.created_at
                    ? formData.created_at
                    : formatDate(new Date().toString(), 'YYYY-MM-DD')
                }}
              </p>
            </div>

            <div class="col-12 col-md-4 text-black-90">
              <p class="text-weight-bold no-margin">Código del fondo</p>
              <p class="text-weight-medium no-margin">
                {{ formData?.fund_code ?? '-' }}
              </p>
            </div>

            <div class="col-12 col-md-4 text-black-90">
              <p class="text-weight-bold no-margin">Descripción del fondo</p>
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

      <NoDataState v-if="isTableEmpty" type="no-results" />

      <VCard v-else>
        <template #content-card>
          <div class="q-pa-lg">
            <p class="text-weight-bold text-h6 q-pb-sm">
              {{ tableProps.title }}
            </p>

            <VCard>
              <template #content-card>
                <div class="q-pa-lg">
                  <TableList
                    :loading="tableProps.loading"
                    :columns="tableProps.columns"
                    :rows="tableProps.rows"
                    :pages="tableProps.pages"
                    selection="single"
                    @selected="handleSelected($event.selected)"
                  />
                </div>
              </template>
            </VCard>

            <div v-if="isSelected">
              <NoDataState
                v-if="isTableDetailEmpty"
                :type="showState === 0 ? 'empty' : 'no-results'"
                :disableDefaultClass="true"
              />

              <div v-else>
                <div class="row items-center justify-between q-pb-lg">
                  <p class="text-weight-bold text-h6 no-margin">
                    {{ tablePropsDetail.title }}
                  </p>

                  <div class="row">
                    <Button
                      class-custom="custom"
                      :outline="true"
                      label="Descargar 523"
                      color="orange"
                      :styleContent="{
                        'place-items': 'center',
                        color: 'black',
                      }"
                      :left-img="txtIcon"
                      @click="handleExportTXT"
                    />

                    <Button
                      class-custom="custom q-ml-md"
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
                  </div>
                </div>

                <VCard>
                  <template #content-card>
                    <div class="q-pa-lg">
                      <TableList
                        :loading="tablePropsDetail.loading"
                        :rows="tablePropsDetail.rows"
                        :columns="tablePropsDetail.columns"
                        :pages="tablePropsDetail.pages"
                        :hidePagination="true"
                      />
                    </div>
                  </template>
                </VCard>
              </div>
            </div>

            <div class="flex justify-end">
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'
import txtIcon from '@/assets/images/txt.svg'

// Logic view
import useConsultTransmisionFormat523 from '@/views/fics/collective-investment-funds/v1/consult-transmision-format-523/v1/view/ConsultTransmisionFormat523View'

const {
  tabs,
  formData,
  showState,
  tabActive,
  formatDate,
  tableProps,
  isSelected,
  headerProps,
  tabActiveIdx,
  isTableEmpty,
  handleGoToList,
  handleSelected,
  handleExportTXT,
  tablePropsDetail,
  handleExportExcel,
  isTableDetailEmpty,
} = useConsultTransmisionFormat523()
</script>
