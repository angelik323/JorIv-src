<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'AnnualPeriodClosingList' })"
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
            <div v-if="tabActive === 'information'">
              <AnnualPeriodClosingForm
                ref="annualPeriodClosingForm"
                :action="'create'"
                @update="handleFormUpdate"
              />
            </div>
            <div v-if="tabActive === 'Execute'">
              <ExecuteForm
                ref="executeForm"
                :action="'create'"
                :fields="arrayBusiness"
                @update="handleExecuteFormpdate"
              />
            </div>
            <!-- Buttons -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <q-btn
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) >
                      -1 &&
                    filteredTabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  flat
                  outline
                  label="Atrás"
                  icon="mdi-chevron-left"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter"
                  @click="backTab()"
                />
                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  :outline="false"
                  :class-custom="'custom'"
                  label="crear"
                  size="md"
                  color="orange"
                  @click="handleExecuteFormpdate()"
                />
                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) >
                      -2 &&
                    filteredTabs.findIndex((tab) => tab.name === tabActive) < 1
                  "
                  :outline="false"
                  :class-custom="'custom'"
                  label="Continuar"
                  size="md"
                  color="orange"
                  @click="handleFormUpdate()"
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
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AnnualPeriodClosingForm from '@/components/Forms/Accounting/AnnualPeriodClosing/BasicInformation/AnnualPeriodClosingForm.vue'
import ExecuteForm from '@/components/Forms/Accounting/AnnualPeriodClosing/AnnualPeriodClosingExecute/AnnualPeriodClosingExecute.vue'
import useAnnualPeriodClosingCreate from '@/views/accounting/annual-period-closing/v1/create/AnnualPeriodClosingCreate'

const {
  annualPeriodClosingForm,
  headerProps,
  executeForm,
  filteredTabs,
  tabActive,
  arrayBusiness,
  tabActiveIdx,
  backTab,
  handleFormUpdate,
  handleExecuteFormpdate,
} = useAnnualPeriodClosingCreate()
</script>
