<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('PeriodClosureList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />

        <VCard>
          <template #content-card>
            <div v-show="tabActive === 'information'">
              <PeriodClosureForm ref="periodClosureForm" :action="'create'" />
            </div>

            <section
              v-if="tabActive === 'report'"
              class="q-mx-xl q-mt-lg q-mb-xl"
            >
              <div class="row justify-between items-center q-mb-md">
                <p class="text-subtitle1 text-weight-bold q-mb-none">
                  Proceso pendientes y generados
                </p>
                <div class="row justify-end">
                  <Button
                    class-custom="custom"
                    :outline="true"
                    label="Descargar excel"
                    color="orange"
                    :styleContent="{
                      'place-items': 'center',
                      color: 'black',
                    }"
                    :left-img="imgButtonHeaderTable"
                    @click="handleDownloadExcel"
                  />
                </div>
              </div>

              <div
                class="bg-white q-pa-md shadow-1"
                style="border-radius: 32px"
              >
                <TableList
                  :loading="tableProps.loading"
                  :columns="tableProps.columns"
                  :rows="tableProps.rows"
                  :pages="tableProps.pages"
                  @update-page="updatePage"
                  @update-rows-per-page="updatePerPage"
                />
              </div>
              <div class="row justify-end q-mt-lg">
                <Button
                  label="Atrás"
                  color="orange"
                  class-custom="custom"
                  :outline="false"
                  @click="handleBackToForm"
                />
              </div>
            </section>

            <section class="mx-4 mb-4" v-if="tabActive === 'information'">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="closureStatus === 'Proceso exitoso'"
                  label="Crear"
                  :outline="false"
                  :class-custom="'custom'"
                  color="orange"
                  @click="onSubmit"
                />

                <Button
                  v-if="closureStatus === 'Procesos pendientes'"
                  label="Continuar"
                  :outline="false"
                  :class-custom="'custom'"
                  color="orange"
                  @click="activateReportTab"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Componentes comunes
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'

// Componentes del módulo
import PeriodClosureForm from '@/components/Forms/Accounting/PeriodClosure/Information/v2/PeriodClosureForm.vue'

// Assets
import imgButtonHeaderTable from '@/assets/images/excel.svg'

// Composable
import usePeriodClosureCreate from '@/views/accounting/period-closure/v2/create/PeriodClosureCreate'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  periodClosureForm,
  tableProps,
  closureStatus,
  handleBackToForm,
  onSubmit,
  activateReportTab,
  handleDownloadExcel,
  updatePage,
  updatePerPage,
  goToURL,
} = usePeriodClosureCreate()
</script>
