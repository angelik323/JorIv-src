<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      show-back-btn
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      @on-back="goToURL('AccoutingReportList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="filteredTabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-show="tabActive === 'information'"
                ref="informationFormRef"
                action="create"
                name-report="Balance general detallado"
                type-report="Balances"
              />

              <div v-show="tabActive === 'report'" class="row justify-end">
                <div class="row items-center justify-between q-mb-md">
                  <div class="row q-gutter-md">
                    <Button
                      outline
                      class-custom="custom"
                      label="Descargar PDF"
                      color="orange"
                      :styleContent="{
                        'place-items': 'center',
                        color: 'black',
                      }"
                      :leftImg="pdfIcon"
                    />

                    <Button
                      outline
                      class-custom="custom"
                      label="Descargar excel"
                      color="orange"
                      :styleContent="{
                        'place-items': 'center',
                        color: 'black',
                      }"
                      :leftImg="excelIcon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </VCard>

        <div class="row justify-end">
          <Button
            :outline="false"
            class-custom="custom"
            color="orange"
            :label="tabActive === 'report' ? 'Finalizar' : 'Generar'"
            size="md"
            @click=""
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import InformationForm from '@/components/Forms/Accounting/AccoutingReport/v2/AccountingReportForm/InformationForm/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'
import pdfIcon from '@/assets/images/pdf.svg'

// Logic view
import useDetailedBalanceSheetCreate from '@/views/accounting/accouting-report/v2/reports/DetailedBalanceSheet/create/DetailedBalanceSheetCreate'

const {
  goToURL,
  tabActive,
  headerProps,
  filteredTabs,
  tabActiveIdx,
  informationFormRef,
} = useDetailedBalanceSheetCreate()
</script>
