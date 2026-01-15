<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('GeneralContractInquiryList')"
    >
      <section class="q-mt-lg">
        <TabsComponent
          :tabs="filteredTabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <section v-if="tabActive === 'tab_basic_data'">
                <BasicDataForm
                  ref="basicDataFormRef"
                  :action="'view'"
                  :basic-data-form="basicDataForm"
                  @update:basic-data-form="basicDataForm = $event ?? null"
                />
              </section>

              <section v-if="tabActive === 'tab_scheduled_payment_milestones'">
                <ScheduledPaymentMilestonesList
                  :contract-id="generalContractInquiryId"
                />
              </section>

              <section v-if="tabActive === 'tab_associated_budget'">
                <AssociatedBudgetList
                  :contract-id="generalContractInquiryId"
                />
              </section>

              <section v-if="tabActive === 'tab_attached_documents'">
                <AnnexDocumentList
                  :contract-id="generalContractInquiryId"
                />
              </section>

              <section v-if="tabActive === 'tab_clauses'">
                <ClausesList
                  :contract-id="generalContractInquiryId"
                />
              </section>
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  label="Atrás"
                  size="md"
                  unelevated
                  outline
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="backTab"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) <
                      tabs.length - 1
                  "
                  label="Continuar"
                  :rightIcon="defaultIconsLucide.next"
                  color-icon="#fff"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Continuar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="goToURL('GeneralContractInquiryList')"
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Forms
import BasicDataForm from '@/components/Forms/DerivativeContracting/GeneralContractInquiryForm/BasicData/BasicDataForm.vue'

// Lists
import ScheduledPaymentMilestonesList from '@/components/Lists/DerivativeContracting/GeneralContractInquiry/ScheduledPaymentMilestones/ScheduledPaymentMilestonesList.vue'
import AssociatedBudgetList from '@/components/Lists/DerivativeContracting/GeneralContractInquiry/AssociatedBudget/AssociatedBudgetList.vue'
import AnnexDocumentList from '@/components/Lists/DerivativeContracting/GeneralContractInquiry/AnnexDocument/AnnexDocumentList.vue'
import ClausesList from '@/components/Lists/DerivativeContracting/GeneralContractInquiry/Clauses/ClausesList.vue'

import useGeneralContractInquiryView from '@/views/derivative-contracting/general-contract-inquiry/v1/view/GeneralContractInquiryView'

const {
  headerProps,
  defaultIconsLucide,
  tabs,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  basicDataForm,
  generalContractInquiryId,

  goToURL,
  nextTab,
  backTab,
} = useGeneralContractInquiryView()
</script>
